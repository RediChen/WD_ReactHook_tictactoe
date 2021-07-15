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
    // 函數集 methods
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    // 渲染區
    render() {
        //* 實際的呈現 */
        return (
            <div>
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
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                }
            ],
            stepNum: 0,
            xIsNext: true,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNum + 1);
        //-> 物件的陣列
        const current = history[history.length - 1];//-> 物件
        const nine = current.squares.slice();       //-> 物件中的陣列

        if (calculateWinner(nine) || nine[i]) return;
        /* 如果已經贏了 OR 點了已經有棋子的地方，拒絕反應。 */

        nine[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat(
                [{
                    squares: nine,
                }]
            ),
            stepNum: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step) {
        this.setState(
            {
                stepNum: step,
                xIsNext: ((step % 2) === 0),
            }
        )
    }
    render() {
        //* 準備區 */
        const history = this.state.history;
        const current = history[this.state.stepNum];
        const winner = calculateWinner(current.squares);
        // 雖然是 const，但是一有改變，就會重新 render。

        const moves = history.map(
            (step, move) => {
                const desc = move ?
                    'Go to move #' + move :
                    'Go to game start';
                return (
                    <li key={move}>
                        <button
                            onClick={
                                () => this.jumpTo(step)
                            }
                        >
                            {desc}
                        </button>
                    </li>
                )
            }
        )

        let status;
        if (winner) {
            status = '獲勝者是: ' + winner;
        } else if (current.squares.indexOf(null) === -1) {
            status = '平手';
        } else {
            status = '現在輪到: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        //* 輸出區 */
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <ol>{moves}</ol>
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
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) return squares[a];
    }
    return null;
}