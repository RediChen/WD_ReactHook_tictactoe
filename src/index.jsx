import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Board from './components/board';
import './style/style.css';

/**
 * 
 * @param {string[]} squares 
 * @returns {string} 0號棋子, 1號棋子, null
 */
const isWho = (squares) => {
    if (!squares) return null;
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
    for (let combination of lines) {
        const [a, b, c] = combination;
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) return squares[a];
    }
    return null;
}
const Game = () => {
    //* constructors
    const PIECE = ['>w<', '~"~'];//棋子設定處
    /**
     * @type { {squares: Array<string>}[] }
     */
    const historyInit = [
        { squares: Array(9).fill(null) }
    ];
    const [history, setHistory] = useState(historyInit);
    // history : 紀錄每回合的 9 格局面，儲存為從左上角到右下角的棋子陣列
    const [stepNum, setStepNum] = useState(0);
    // stepNum : 遊戲回合數，機制上會與 history.length 保持同值
    const [is0sTurn, setIs0sTurn] = useState(true);
    const [status, setStatus] = useState(`現在輪到: ${PIECE[0]}`);
    const [isEnd, setIsEnd] = useState(false);
    /**
     * square 的晃動效果的啟動狀態；初始值為全關閉
     * @type boolean[]
     */
    const shakeStateInit = Array(9).fill(false);
    const [shakeState, setShakeState] = useState(shakeStateInit);

    //* methods
    /**
     * 處理棋子的顯示機制
     * @param {number} i 
     * @returns 
     */
    const handleClick = (i) => {
        //* Stage 1 : 擷取目前局面
        /**
         * 目前為止的紀錄，沒有選取的未來會被捨棄
         * @type [{squares:string[]}]
         */
        const slicedHistory = history.slice(0, stepNum + 1);
        // slice 的 end index 代表從它開始排除掉
        /**
         * 目前局面
         * @type string[]
         */
        const current9 = slicedHistory[slicedHistory.length - 1].squares.slice();
        // 複製是為了給 useState 不同存取位置的「新」變數

        //* Stage 2 : 特殊狀況應對
        /* 如果前一回合就已經結束 OR 點了已經有棋子的地方，提醒使用者。 */
        // 晃動效果設定為 0.3s
        if (isEnd) {
            setShakeState(Array(9).fill(true));
            setTimeout(() => {
                setShakeState(shakeStateInit);
            }, 500);
            return;
        }
        if (current9[i]) {
            setShakeState((prev) => prev.map(
                (item, index) => (index === i ? !item : item)
            ))
            setTimeout(() => {
                setShakeState(shakeStateInit);
            }, 500);
            return;
        }

        //* Stage 3 : 分析目前局面
        current9[i] = is0sTurn ? PIECE[0] : PIECE[1];
        const winner = isWho(current9);

        //* Stage 4 : 更新目前畫面
        setIs0sTurn(is0sTurn => !is0sTurn);

        if (winner) {
            setStatus(`${winner} 贏了！`);
            setIsEnd(true);
        } else if (current9.indexOf(null) === -1) {
            setStatus('平手');
            setIsEnd(true);
        } else {
            setStatus('現在輪到: ' + (is0sTurn ? PIECE[1] : PIECE[0]));
        }

        if (history.length === stepNum + 1) {
            setHistory(prev => [...prev, { squares: current9 }]);
        } else {
            setHistory([...slicedHistory, { squares: current9 }]);
        }
        setStepNum(history.length);
    }

    const jumpTo = (newStepNum) => {
        // 省效能
        if (stepNum === 0) return;
        // 因為 setStepNum 並非馬上更新，才需要依賴新變數吩咐
        setStepNum(newStepNum);
        setIs0sTurn((newStepNum % 2 === 0));
        setStatus('現在輪到: ' + (newStepNum % 2 === 0 ? PIECE[0] : PIECE[1]));
        setHistory(prev => prev.slice(0, newStepNum + 1));
        setIsEnd(false);
    }

    const buttons = [];
    for (let i = 1; i < 9; i++) {
        buttons.push(
            <div
                key={i}
                onClick={history[i] ? () => jumpTo(i) : null}
                className={history[i] ? "btn btn-active" : "btn"}
            >{i+1}</div>
        )
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={history[stepNum].squares}
                    clickHandler={handleClick}
                    shakeState={shakeState}
                />
            </div>
            <div className="game-panel">
                <div className="status">{status}</div>
                <div className="btn-box">
                    <div className="restart" onClick={() => jumpTo(0)}>重新開始</div>
                    <div className="btn-plate">
                        {buttons}
                    </div>
                </div>
            </div>
        </div>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Game />);