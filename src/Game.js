import { useState } from 'react';
import isWho from './utils/winner-determiner';
import Board from './components/board';
import s from './game.module.scss';

/**
 * 棋子設定處
 */
const PIECE = ['>w<', '~3~'];

const getTimeStamp = () => new Date().getTime();

export default function Game() {
  //*=========================================== constructors
  /**
   * @type { {squares: Array<string>}[] }
   */
  const historyInit = [
    { squares: Array(9).fill(null) }
  ];
  // history : 紀錄每回合的 9 格局面，儲存為從左上角到右下角的棋子陣列
  const [history, setHistory] = useState(historyInit);

  /**
   * @type {[number, React.Dispatch<number>>]}
   * @description stepNum | 遊戲回合數，機制上會與 history.length 保持同值 (0 ~ 9)
   */
  const [stepNum, setStepNum] = useState(0);

  /**
   * @type {[boolean, React.Dispatch<boolean>>]}
   * @description is0sTurn | 是否為先手的回合
   */
  const [is0sTurn, setIs0sTurn] = useState(true);

  const [status, setStatus] = useState(`現在輪到: ${PIECE[0]}`);

  const [isEnd, setIsEnd] = useState(false);

  /**
   * square 的晃動效果的啟動狀態；初始值為全關閉
   * @type boolean[]
   */
  const shakeStateInit = Array(9).fill(false);
  const [shakeState, setShakeState] = useState(shakeStateInit);

  //*=========================================== methods
  /**
   * 處理棋子的顯示機制
   * @param {number} i_board 九宮格對應的 index (0~8)
   */
  const handleClick = (i_board) => {
    //* Stage 1 : 擷取目前局面
    /**
     * 目前為止的紀錄，沒有選取的未來會被捨棄
     * @type { {squares:string[]}[] }
     */
    const slicedHistory = history.slice(0, stepNum + 1);

    /**
     * 目前局面
     * @type { string[] }
     * @description 從 history 取出的副本，是為了適用 useState 的對照機制
     */
    const current9 = slicedHistory[slicedHistory.length - 1].squares.slice();

    //* Stage 2 : 特殊狀況應對
    // 如果前一回合就已經結束 OR 點了已經有棋子的地方，提醒使用者。
    // 晃動效果設定為 0.3s

    // 如果賽局已經結束，每格都不能點。
    if (isEnd) {
      setShakeState(Array(9).fill(true));
      setTimeout(() => {
        setShakeState(shakeStateInit);
      }, 500);
      return;
    }

    // 如果格子已有棋子，則該格不能點。
    if (current9[i_board]) {
      setShakeState((prev) => prev.map(
        (item, index) => (index === i_board ? !item : item)
      ))
      setTimeout(() => {
        setShakeState(shakeStateInit);
      }, 500);
      return;
    }

    //* Stage 3 : 分析目前局面
    current9[i_board] = is0sTurn ? PIECE[0] : PIECE[1];
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
    console.log('開始 jump');
    if (stepNum === 0) return;
    // 因為 setStepNum 並非馬上更新，才需要依賴新變數吩咐
    setStepNum(newStepNum);
    setIs0sTurn((newStepNum % 2 === 0));
    setStatus('現在輪到: ' + (newStepNum % 2 === 0 ? PIECE[0] : PIECE[1]));
    setHistory(prev => prev.slice(0, newStepNum + 1));
    setIsEnd(false);
    console.log('結束 jump');
  }

  console.log(history);
  console.log(stepNum);

  return (
    <div className={["container", s.game].join(' ')}>
      <div className="row">
        <div className="col-12 col-lg-8">
          <Board
            gameSituation={history[stepNum].squares}
            clickHandler={handleClick}
            shakeState={shakeState}
          />
        </div>
        <div className="col-12 col-lg-4">
          <div className={s.gamePanel}>
            <div className={s.status}>{status}</div>
            <div className="btn-box">
              <div className="restart" onClick={() => jumpTo(0)}>重新開始</div>
              <div className="btn-plate">
                {history.map((item, i) => {
                  if (i <= 0 || i >= 9) return <></>;
                  // 以下只顯示 i = 1 ~ 8
                  const isActive = item && i !== stepNum;
                  const btnClass = "btn" + (isActive ? " btn-active" : "");

                  return (
                    <div
                      key={getTimeStamp + i}
                      onClick={item ? () => jumpTo(i) : null}
                      className={btnClass}
                    >{i}</div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
