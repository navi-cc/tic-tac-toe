const gameBoard = function () {
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

    const updateBoard = (currentToken, selectedRow, selectedColumn) => {
        const selectedCellHasMark = board.filter(currentRow => board.indexOf(currentRow) === selectedRow)
        .reduce((value, currentRow) => {

            value = currentRow.some((currentCell, index) => {
                if (index !== selectedColumn) return;
                if (currentCell.getCurrentValue() === 'x' || currentCell.getCurrentValue() === 'o') return true;
            });

            return value;
        }, null);

        if (selectedCellHasMark) return;
        board[selectedRow][selectedColumn].addPlayerToken(currentToken);
    }

    const printNewBoard = () => {
        const boardWithValues = board.map(row => row.map(cells => cells.getCurrentValue()))
        console.log(boardWithValues);
    }
   
    return {
        getCurrentBoard,
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