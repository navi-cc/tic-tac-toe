const gameBoard = function () {
    let selectedCellHasMark = false;
    let rows = 3;
    let columns = 3;
    const board = [];


    for (let i = 0; i < rows; i++) {
        board[i] = [];

        for (let j = 0; j < columns; j++) {
            board[i].push(cell())
        }
    }

    const getCurrentBoard = () => board;

    const getCellBoolean = () =>  selectedCellHasMark;

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

        if (selectedCellHasMark) {
            console.log("Selected cell already has mark");
            return;
        }
    
        board[selectedRow][selectedColumn].addPlayerToken(currentToken);    
    }

    const printNewBoard = () => {
        const boardWithValues = board.map(row => row.map(cells => cells.getCurrentValue()))
        console.log(boardWithValues);
    }
   
    return {
        getCurrentBoard,
        getCellBoolean,
        updateBoard,
        printNewBoard
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
        mark: 'x'
    }, 
    {
        name: 'Player Two',
        mark: 'o'
    }];

    let currentPlayer;
    const switchPlayer = () => currentPlayer === player[0] ? currentPlayer = player[1] : currentPlayer = player[0];
    const printCurrentPlayer = () => console.log(`${currentPlayer.name} turn`);

    const start = () => {
        currentPlayer = player[0];
        printCurrentPlayer();
        board.printNewBoard();
    }

    const playRound = function (selectedRow, selectedColumn) {
        if (!currentPlayer) {
            console.log('Start the game first');
            return;
        }
        
        board.updateBoard(currentPlayer.mark, selectedRow, selectedColumn);

        if (selectedCellHasMark()) return;

        switchPlayer();
        printCurrentPlayer();
        board.printNewBoard();
    }

    return {
        start,
        playRound,
    }

}