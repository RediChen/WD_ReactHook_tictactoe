import s from './board.module.scss';

const Board = ({
  gameSituation = [],
  clickHandler = () => { },
  shakeState = []
}) => (
  <div className={s.board}> {
    Array(9).fill(0).map((_, i) => (
      <div
        key={i}
        className={[
          s.square,
          shakeState[i] ? s.active : ""
        ].join(' ')}
        onClick={() => clickHandler(i)}
      >
        {gameSituation[i]}
      </div>
    ))
  }
  </div>
);

export default Board;