var GRID_SIZE = 4;
var INITIAL_GRID_SIZE = GRID_SIZE;
var Y_OFFSET = 50;
var w = 50;
var grid_size_jump = [5, 10, 20, 30, 40, 50, 50, 50, 60, 60, 100, 100];
var levelNumber = 0;
var levelMinorCounter = 0;

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function createGrid(rows) {
    var arr = [];

    for (var i = 0; i < rows; i++) {
        arr[i] = [];
        for (var j = 0; j < rows; j++) {
            arr[i].push(new Cell());
        }
    }
    return arr;
}

// get random item from a Set
function getRandomItem(set) {
    let items = Array.from(set);
    return items[Math.floor(Math.random() * items.length)];
}


function Cell() {

    this.content = 'EMPTY';
    this.placed_content = 'EMPTY';

    this.toggleContent = function () {
        switch (this.placed_content) {
            case 'EMPTY':
                this.placed_content = 'GRASS';
                break;
            case 'GRASS':
                this.placed_content = 'PLACED_PINGU';
                break;
            case 'PLACED_PINGU':
                this.placed_content = 'EMPTY';
                break;
        }
    }

};

function Board() {

    this.grid = createGrid(GRID_SIZE);
    this.rowHeader = Array(GRID_SIZE).fill(0);
    this.colHeader = Array(GRID_SIZE).fill(0);
    this.isRowValid = Array(GRID_SIZE).fill(false);
    this.isColValid = Array(GRID_SIZE).fill(false);

    this.isWon = false;

    this.generateGame = function () {

        // Create set of available positions
        availablePositions = new Set();
        for (var i = 0; i < GRID_SIZE * GRID_SIZE; i++)
            availablePositions.add(i);


        var timeOut = 0;
        while (availablePositions.size > 0) {

            randomPos = getRandomItem(availablePositions);

            let x = randomPos % GRID_SIZE;
            let y = Math.floor(randomPos / GRID_SIZE);

            console.log("XY " + x + ' ' + y);
            this.grid[x][y].content = 'PINGU';

            // Place a tibou next to the pingu
            var isTibouPlaced = false;
            while (!isTibouPlaced) {
                let tibouPos = Math.floor(Math.random() * 4);
                switch (tibouPos) {
                    case 0:
                        if (x - 1 >= 0 && this.grid[x - 1][y].content == 'EMPTY') {
                            this.grid[x - 1][y].content = 'TIBOU';
                            this.grid[x - 1][y].placed_content = 'TIBOU';
                            isTibouPlaced = true;
                        }
                        break;
                    case 1: if (x + 1 < GRID_SIZE && this.grid[x + 1][y].content == 'EMPTY') {
                        this.grid[x + 1][y].content = 'TIBOU';
                        this.grid[x + 1][y].placed_content = 'TIBOU';
                        isTibouPlaced = true;
                    }
                        break;
                    case 2:
                        if (y - 1 >= 0 && this.grid[x][y - 1].content == 'EMPTY') {
                            this.grid[x][y - 1].content = 'TIBOU';
                            this.grid[x][y - 1].placed_content = 'TIBOU';
                            isTibouPlaced = true;
                        }
                        break;
                    case 3:
                        if (y + 1 < GRID_SIZE && this.grid[x][y + 1].content == 'EMPTY') {
                            this.grid[x][y + 1].content = 'TIBOU';
                            this.grid[x][y + 1].placed_content = 'TIBOU';
                            isTibouPlaced = true;
                        }
                        break;
                }
                if (++timeOut > 100000) {
                    alert("impossible to create grid");
                }

            }


            availablePositions.delete(randomPos);

            //Remove all 8 neigbours from set so we won't pick them next time
            availablePositions.delete((x - 1) + (y - 1) * GRID_SIZE);
            availablePositions.delete((x + 0) + (y - 1) * GRID_SIZE);
            availablePositions.delete((x + 1) + (y - 1) * GRID_SIZE);
            availablePositions.delete((x + 1) + (y + 0) * GRID_SIZE);
            availablePositions.delete((x + 1) + (y + 1) * GRID_SIZE);
            availablePositions.delete((x + 0) + (y + 1) * GRID_SIZE);
            availablePositions.delete((x - 1) + (y + 1) * GRID_SIZE);
            availablePositions.delete((x - 1) + (y + 0) * GRID_SIZE);

            console.log(availablePositions);
        }

        console.table(this.grid);
        // Fill in Header

        let pCounter = 0;
        let tCounter = 0;
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (this.grid[i][j].content == 'PINGU') {
                    pCounter++;
                    this.colHeader[i]++;
                    this.rowHeader[j]++;
                }
                if( this.grid[i][j].content == 'TIBOU' ){
                    tCounter++;
                }
            }
        }
        if( pCounter != tCounter ) alert("FATAL ERROR IN GAME GENERATION");

        console.log(this.rowHeader);
        console.log(this.colHeader);


    };

    this.display = function () {
        background(13, 38, 35);

        if (this.isWon) {

            setFrameRate(10);

            for (let row = 0; row < GRID_SIZE; row++) {
                fill(Math.floor(random(128, 255)), Math.floor(random(128, 255)), Math.floor(random(128, 255)));
                text(Math.floor(random(0, 9)), -w / 3, row * w + w / 2 + w / 8);

                for (let col = 0; col < GRID_SIZE; col++) {

                    switch (Math.floor(random(0, 3))) {
                        case 0:
                            image(tibouImg, row * w, col * w, w, w);
                            break;
                        case 1:
                            image(pinguImg, row * w, col * w, w, w);
                            break;
                        case 2:
                            image(grassImg, row * w, col * w, w, w);
                            break;
                        case 3:
                            image(emptyImg, row * w, col * w, w, w);
                            break;
                    }
                }
            }

            for (let col = 0; col < GRID_SIZE; col++) {
                fill(Math.floor(random(128, 255)), Math.floor(random(128, 255)), Math.floor(random(128, 255)));
                text(Math.floor(random(10)), col * w + w / 2 - w / 8, GRID_SIZE * w + w / 2);
            }
            fill(255)
            textSize(w / 2);
            text('You won. Congratulations', 0, Y_OFFSET, GRID_SIZE * w, GRID_SIZE * w);
            textSize(w / 2);
            text('Next grid >>', 1 * w, Y_OFFSET + 2 * w, GRID_SIZE * w, GRID_SIZE * w);
            textSize(30);

        } else {

            for (let row = 0; row < GRID_SIZE; row++) {
                fill(246, 228, 240);
                if (this.isRowValid[row]) fill(87, 199, 102);

                text(this.rowHeader[row], -w / 3, row * w + w / 2 + w / 8);

                for (let col = 0; col < GRID_SIZE; col++) {

                    switch (this.grid[row][col].placed_content) {
                        case 'TIBOU':
                            image(tibouImg, row * w, col * w, w, w);
                            break;
                        case 'PLACED_PINGU':
                            image(pinguImg, row * w, col * w, w, w);
                            break;
                        case 'GRASS':
                            image(grassImg, row * w, col * w, w, w);
                            break;
                        case 'EMPTY':
                            image(emptyImg, row * w, col * w, w, w);
                            break;
                    }
                    //                rect(row*w, col*w, w, w, 0);

                }
            }

            for (let col = 0; col < GRID_SIZE; col++) {
                fill(246, 228, 240);
                if (this.isColValid[col]) fill(87, 199, 102);
                text(this.colHeader[col], col * w + w / 2 - w / 8, GRID_SIZE * w + w / 2);

            }

        }

    };

    this.check4TheWin = function () {

        for (let row = 0; row < GRID_SIZE; row++) {
            let pinguCounter = 0;
            let grassCounter = 0;
            let tibouCounter = 0;
            for (let col = 0; col < GRID_SIZE; col++) {
                if (this.grid[col][row].placed_content == 'PLACED_PINGU') pinguCounter++;
                if (this.grid[col][row].placed_content == 'GRASS') grassCounter++;
                if (this.grid[col][row].placed_content == 'TIBOU') tibouCounter++;
            }
            if (pinguCounter == this.rowHeader[row] && pinguCounter + grassCounter + tibouCounter == GRID_SIZE) {
                this.isRowValid[row] = true;
            } else {
                this.isRowValid[row] = false;
            }
        }

        for (let col = 0; col < GRID_SIZE; col++) {
            let pinguCounter = 0;
            let grassCounter = 0;
            let tibouCounter = 0;
            for (let row = 0; row < GRID_SIZE; row++) {
                if (this.grid[col][row].placed_content == 'PLACED_PINGU') pinguCounter++;
                if (this.grid[col][row].placed_content == 'GRASS') grassCounter++;
                if (this.grid[col][row].placed_content == 'TIBOU') tibouCounter++;
            }
            if (pinguCounter == this.colHeader[col] && pinguCounter + grassCounter + tibouCounter == GRID_SIZE) {
                this.isColValid[col] = true;
            } else {
                this.isColValid[col] = false;
            }
        }

        var isAllValid = true;
        for (let i = 0; i < GRID_SIZE; i++) {
            if (!this.isRowValid[i]) isAllValid = false;
            if (!this.isColValid[i]) isAllValid = false;
        }

        if (isAllValid) {
            console.log("ALL VALID. verification now");

            // Check if all pingus are on placed pingus
            var isAllPinguMatch = true;
            for (let row = 0; row < GRID_SIZE; row++) {
                for (let col = 0; col < GRID_SIZE; col++) {
                    if (this.grid[row][col].placed_content == 'PLACED_PINGU' && this.grid[row][col].content != 'PINGU') {
                        isAllPinguMatch = false;
                    }
                }
            }
            if (isAllPinguMatch == true) this.isWon = true;




        }

    };
};


board = new Board();

function preload() {
    tibouImg = loadImage('images/tibou_.png');
    pinguImg = loadImage('images/pingu_.png');
    grassImg = loadImage('images/grass.png');
    emptyImg = loadImage('images/empty.png');
    robotoFnt = loadFont('fonts/Roboto-Light.ttf');
}

function setup() {

    var previousScore = getCookie('levelNum');

    if (false && previousScore) {
        levelNumber = previousScore;
        levelMinorCounter = getCookie('levelMinorNum');
        GRID_SIZE = getCookie('gridSize');
        board = new Board();
        alert("restored your session");
        console.log('>>>>>>>>>>' + levelNumber + ' ' + levelMinorCounter + ' ' + GRID_SIZE);
    }
    // createCanvas(800,800);
    createCanvas(windowWidth, windowHeight);
    w = min((windowHeight - Y_OFFSET) / (GRID_SIZE + 1), (windowWidth) / (GRID_SIZE + 1));
    //background(0);

    textSize(40);
    textFont(robotoFnt);
    board.generateGame();

}


function draw() {
    translate(windowWidth / 2 - (w * GRID_SIZE) / 2, Y_OFFSET);

    board.display();
    fill(246, 228, 240);
    textSize(w / 6);
    text('Level ' + levelNumber + ' - Size jump in ' + (grid_size_jump[GRID_SIZE - INITIAL_GRID_SIZE] - levelMinorCounter) + ' levels', 0, -5);
    textSize(w / 3);
    //    ellipse(50, 50, 80, 80);
}

function touchStarted() {
    let rectangleX = Math.floor((mouseX - (windowWidth / 2 - (w * GRID_SIZE) / 2)) / w)
    let rectangleY = Math.floor((mouseY - Y_OFFSET) / w);
    // if(board.isWon && (rectangleX == GRID_SIZE-1 || rectangleX == GRID_SIZE -2) && (rectangleY == GRID_SIZE-1 || rectangleY == GRID_SIZE -2 )){
    if (board.isWon) {
        levelNumber++;
        levelMinorCounter++;
        setCookie('levelNum', levelNumber, 800);
        setCookie('levelMinorNum', levelMinorCounter, 800);
        setCookie('gridSize', GRID_SIZE, 800);
        if (grid_size_jump[GRID_SIZE - INITIAL_GRID_SIZE] == levelMinorCounter) {
            GRID_SIZE++;
            levelMinorCounter = 0;
            w = min((windowHeight - Y_OFFSET) / (GRID_SIZE + 1), (windowWidth) / (GRID_SIZE + 1));
        }
        board = new Board();
        board.generateGame();
        setFrameRate(30);
    }
    else if (rectangleX >= 0 && rectangleX < GRID_SIZE && rectangleY >= 0 && rectangleY < GRID_SIZE) {
        board.grid[rectangleX][rectangleY].toggleContent();
        board.check4TheWin();
    }


}