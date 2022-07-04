import Square from './square';
const Board = (props) => {
    const renderSquare = (i) =>
        <Square
            id={i}
            value={props.squares[i]}
            onClick={props.clickHandler}
            isActive={props.shakeState[i]}
            key={i.toString()}
        />
    const squarePack = [];
    for (let i = 0; i < 9; i++) {
        squarePack.push(renderSquare(i));
    }
    return (
        <div className='board'> {squarePack} </div>
    );
}

export default Board;