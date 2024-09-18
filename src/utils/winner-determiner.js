/**
 * 判斷局面是否已有贏家，有的話回傳贏家的 index
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

export default isWho;