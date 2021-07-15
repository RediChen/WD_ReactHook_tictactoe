import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// 下次從這裡繼續練習：https://medium.com/how-to-react/scroll-to-an-element-on-click-in-react-js-8424e478bb9

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
class Board extends React.Component {
    // 建構子
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            // 變數名為 squares，使用react的array建構函數
            // (9)指定9個位子，(?) what if w/o fill null
            xIsNext: true,
            // 預設 'X' 玩家先手
        };
    }
    // 函數集 methods
    handleClick(i) {
        const nine = this.state.squares.slice();
        if (calculateWinner(nine) || nine[i]) return ;
        /* 如果已經贏了 OR 點了已經有棋子的地方，拒絕反應。 */
        nine[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: nine,
            xIsNext: !this.state.xIsNext,
        });
        /* 因為要改的東西有兩個以上，故以物件格式來包裝 */
    }
    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }
    // 渲染區
    render() {
        //* 細部的調整 */
        const winner = calculateWinner(this.state.squares) ;
        // 雖然是 const，但是一有改變，就會重新 render。
        let status ;
        if (winner) {
            status = '獲勝者是: ' + winner ;
        } else if (this.state.squares.indexOf(null) === -1) {
            status = '平手' ;
        } else {
            status = '現在輪到: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        //* 實際的呈現 */
        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}