const gameBoard = function () {
    let selectedCellHasMark = false;
    let rows = 3;
    let columns = 3;
    const board = [];

    const getCurrentBoard = () => board;
    const getCellBoolean = () =>  selectedCellHasMark;

    const createBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
    
            for (let j = 0; j < columns; j++) {
                board[i].push(cell())
            }
        }
    }

    const updateBoard = (currentToken, selectedRow, selectedColumn) => {
        selectedCellHasMark = board.filter(currentRow => board.indexOf(currentRow) === selectedRow)
        .reduce((value, currentRow) => {

            value = currentRow.some((currentCell, index) => {
                if (index !== selectedColumn) return;

                let cellValue = currentCell.getCurrentValue();
                if (cellValue === 'x' || cellValue === 'o')
                     return true;
            });

            return value;
        }, null);
        
        if (selectedCellHasMark) return;
    
        board[selectedRow][selectedColumn].addPlayerToken(currentToken);    
    }
   
    createBoard();

    return {
        getCurrentBoard,
        getCellBoolean,
        updateBoard,
        createBoard,
    }

}

const cell = function () {
    let value = '-';

    const addPlayerToken = (playerToken) => {
        value = playerToken
    }
    const getCurrentValue = () => value;
   
    return {
        addPlayerToken, 
        getCurrentValue
    }
}

const gameController = function () {
    const board = gameBoard();
    let selectedCellHasMark = board.getCellBoolean;


    const player = [{
        name: 'Player One',
        mark: 'x',
        score: 0,
    }, 
    {
        name: 'Player Two',
        mark: 'o',
        score: 0
    }];

    let currentPlayer = player[0];
    let turnCount = 0;
    let roundWinner;
    let gameWinner;
    const switchPlayer = () => currentPlayer === player[0] ? currentPlayer = player[1] : currentPlayer = player[0];
    const getCurrentPlayer = () => currentPlayer.name;
    const getPlayers = () => player;
    const getTurnCount = () => turnCount;
    const getRoundWinner = () => roundWinner;
    const getGameWinner = () => gameWinner;
    

    const playRound = function (selectedRow, selectedColumn) {  
        board.updateBoard(currentPlayer.mark, selectedRow, selectedColumn);
        if (selectedCellHasMark()) return;

        switchPlayer();
        setRoundWinner();
        addScore();     
        checkGameWinner();
        turnCount++
    }

    const addScore = () => {
        if (roundWinner === player[0]) player[0].score++;
        if (roundWinner === player[1]) player[1].score++;
    }

    const setNewGame = function () {
        currentPlayer = player[0];
        turnCount = 0;
        roundWinner = null;
        gameWinner = null;
        player[0].score = 0;
        player[1].score = 0;
        board.createBoard();
    }

    const setNewRound = () => {
        roundWinner = null;
        turnCount = 0;
        board.createBoard()
    }

    const checkRound = () => {    
        if (gameWinner) {
            setNewGame();
            return;
        }

        if (roundWinner) setNewRound();
        if (!roundWinner && turnCount === 9) setNewRound();
    }

    const checkGameWinner = () => {
        if (player[0].score === 3) gameWinner = player[0].name;
        if (player[1].score === 3) gameWinner = player[1].name;
    }

    const setRoundWinner = () => {
        let pattern;
        let currentBoard = board.getCurrentBoard();
        boardWithValues = currentBoard.map(row => row.map(cell => cell.getCurrentValue()));

        const resetPattern = () => pattern = ''; 
        const checkValidPattern = () => {
            if (pattern === 'xxx') roundWinner = player[0];
            if (pattern === 'ooo') roundWinner = player[1];
            resetPattern();
        } 

        const checkPattern = (caseNumber, diagonalPos = 0) => {
            switch (caseNumber) {
                case 0:
                    boardWithValues.map(row => {
                        pattern = row.join('');
                        checkValidPattern()
                    }); 
                    break;

                case 1:
                    boardWithValues.map((column, columnIndex) => {
                        for (let rowIndex = 0; rowIndex < column.length; rowIndex++) {
                            pattern += boardWithValues[rowIndex][columnIndex];
                        }
                        checkValidPattern()
                    });
                    break;
                
                case 2:
                    for (let i = 0; i < 3; i++) {
                        pattern += boardWithValues[i][diagonalPos]
                        diagonalPos++
                    }
                    checkValidPattern();
                    break;
                
                case 3:
                    for (let j = 2; j >= 0; j--) {
                        pattern += boardWithValues[j][diagonalPos]
                        diagonalPos++
                    }
                    checkValidPattern();
                    break;
            }
        }

        for (let i = 0; i < 4; i++) {   
            checkPattern(i);
            if (roundWinner) break;
        }

    }

    return {
        playRound,
        checkRound,
        getCurrentPlayer,
        getPlayers,
        getRoundWinner,
        getGameWinner,
        getTurnCount,
        getCurrentBoard: board.getCurrentBoard,
    }

}

const screenController = (function () {
    const game = gameController();
    const player = game.getPlayers();
    const hasGameWinner = game.getGameWinner;

    const menu = document.querySelector('.main-menu');
    const playButton = document.querySelector('#play-btn');
    const mainContainer = document.querySelector('.main-container');
    const mainScoreHolder = document.querySelectorAll('.score-holder');
    const gameBoard = document.querySelector('.game-board');
    const announcer = document.querySelector('.announcer');
    const playerScoreHolder = {
        first: document.querySelector('.player-score-1 > .score'),
        second: document.querySelector('.player-score-2 > .score'),
    }

    const playerNameHolder = {
        first: document.querySelector('.player-name-1'),
        second: document.querySelector('.player-name-2'),
    }

    const modal = {
        backdrop: document.querySelector('.overlay'),
        message: document.querySelector('.modal'),
        confirmButton: document.querySelector('#confirm-btn'),
        backButton: document.querySelector('#back-btn'),
    }

    const render = function() {
        renderGameBoard();
        renderPlayers();
        renderScores();
        renderCurrentPlayer();
        renderRoundWinner();
        renderGameWinner();
    }

    const renderGameBoard = function() {
        gameBoard.textContent = '';
        const boardWithValues = game.getCurrentBoard().map(row => row.map(cell => cell.getCurrentValue()));
        boardWithValues.map((row, rowIndex) => {
            row.map((cellValue, columnIndex) => {
                let cell = document.createElement('button');
                let dataNode = `${rowIndex}${columnIndex}`
                cell.className = 'cell';
                cell.textContent = cellValue;
                cellValue === 'x' ? cell.style.color = '#df3838' : 
                cellValue === 'o' ? cell.style.color = '#3e3ee0' :
                                    cell.style.color = 'transparent'; 
                cell.setAttribute('data-node', dataNode); 
                gameBoard.appendChild(cell);
            });
        });
    }

    const renderScores = function () {
        playerScoreHolder.first.textContent = player[0].score;
        playerScoreHolder.second.textContent = player[1].score;
    }

    const renderPlayers = function () {
        playerNameHolder.first.textContent = player[0].name;
        playerNameHolder.second.textContent = player[1].name;
    }

    const renderCurrentPlayer = function () {
        const currentPlayer = game.getCurrentPlayer();
        announcer.textContent = `${currentPlayer} turn`;
    }

    const renderRoundWinner = function () {
        if (hasGameWinner()) return;

        const roundWinner = game.getRoundWinner();
        const turnCount = game.getTurnCount();
        const MAX_TURN = 9;
    
        if (!roundWinner && turnCount === MAX_TURN) 
            announcer.textContent = 'DRAW';
        
        if (roundWinner) 
            announcer.textContent = `${roundWinner.name} wins this round!`;
            
        if ((!roundWinner && turnCount === MAX_TURN) || roundWinner) 
            restartBoard();

    }

    const renderGameWinner = function () {
        const gameWinner = game.getGameWinner();
        if (!gameWinner) return;

        announcer.textContent = `${gameWinner} wins the game!`;
        restartBoard(gameWinner)
    }

    const renderPerRound = function () {
        game.checkRound();
        renderGameBoard();
        renderCurrentPlayer();
    }

    const restartBoard = function (gameWinner) {
        disableGameBoard();

        if (gameWinner) {
            setTimeout(game.checkRound, 1000)
            setTimeout(showModal, 1500)
            return
        }

        setTimeout(renderPerRound, 1000)
    }

    const showModal = function () {
        modal.backdrop.classList.add('active');
        modal.message.classList.add('active');
    }

    const disableGameBoard = function () {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.removeAttribute('data-node'));
    }

    const newGameHandler = function () {
        modal.backdrop.classList.remove('active');
        modal.message.classList.remove('active');
        render();
    }

    const showMainMenu = function () {
        menu.classList.remove('inactive');
        modal.backdrop.classList.remove('active');
        modal.message.classList.remove('active');
        mainContainer.classList.remove('active');
        mainScoreHolder.forEach(scoreHolder => scoreHolder.classList.remove('active'));
    }

    const showGame = function () {
        menu.classList.add('inactive')
        mainContainer.classList.add('active');
        mainScoreHolder.forEach(scoreHolder => scoreHolder.classList.add('active'));
        render();
    }

    const gameHandler = function (e) {
        if (e.target.className != 'cell') return;
        const cell = e.target;
        const [selectedRow, selectedColumn] = cell.getAttribute('data-node');
        game.playRound(parseInt(selectedRow), parseInt(selectedColumn));
        render();
    }

    playButton.onmousedown = showGame;
    modal.backButton.onmousedown = showMainMenu;
    modal.confirmButton.onmousedown = newGameHandler;
    gameBoard.onmousedown = gameHandler;
})();