//关于胜负判断的函数
import Player from "./Player.js"

const VERTICAL = 1
const HORIZONTAL = 2
const LEFT_OBLIQUE = 3
const RIGHT_OBLIQUE = 4

//判断棋盘中是否有五子相连的棋
function isFive(board, point, player)
{
  var len = board.length
  var count = 1
  var i, x, y

  function reset() 
  {
    count = 1
  }

  // | 
  reset()

  for (i = point[1] + 1; i < len; i++) {
    if(board[point[0]][i] !== player)
      break
    count++
  }

  for (i = point[1] - 1; i >= 0; i--) {
    if(board[point[0]][i] !== player) 
      break
    count++
  }

  if (count >= 5) 
    return VERTICAL
  // ——
  reset();

  for (i = point[0] + 1; i < len; i++) {
    if(board[i][point[1]] !== player)
      break
    count++
  }

  for (i = point[0] - 1; i >= 0; i--) {
    if(board[i][point[1]] !== player)
      break
    count++
  }

  if (count >= 5)
    return HORIZONTAL
  // \
  reset();

  for (i = 1; 1; i++) {
    x = point[0] + i
    y = point[1] + i
    if (x >= len || y >= len) {
      break
    }
    if (board[x][y] !== player)
      break
    count++
  }

  for (i = 1; 1; i++) {
    x = point[0] - i
    y = point[1] - i
    if (x < 0 || y < 0) {
      break
    }
    if (board[x][y] !== player)
      break
    count++
  }

  if (count >= 5)
    return LEFT_OBLIQUE

  // /
  reset();

  for (i = 1; 1;i++) {
    x = point[0] + i
    y = point[1] - i
    if (x < 0 || y < 0 || x >= len || y >= len) {
      break
    }
    if (board[x][y] !== player)
      break
    count++
  }

  for (i = 1; 1; i++) {
    x = point[0] - i
    y = point[1] + i
    if (x < 0 || y < 0 || x >= len || y >= len) {
      break
    }
    if (board[x][y] !== player)
      break
    count++
  }

  if (count >= 5)
    return RIGHT_OBLIQUE

  return 0
}

//判断棋局是否产生胜负，返回胜者角色
export function isWin(board, player)
{
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      var point = [i, j]
      if (board[i][j] === player) {
        if (isFive(board, point, board[i][j])) {
          return board[i][j]
        }
      }
    }
  }

  return 0
}

//若产生胜负，返回五子相连的五个坐标
export function winPieces(board)
{
  var point, direction = 0
  for (var i = 0; i < board.length && !direction; i++) {
    for (var j = 0; j < board[i].length && !direction; j++) {
      point = [i, j]
      if (board[i][j] === Player.empty) {
        direction = isFive(board, [i, j], board[i][j])
        if (direction)
          break
      }
    }
    if (direction)
          break
  }

  if (!direction)
    return false;
  if (direction === VERTICAL)
    return [
      point,
      [point[0], point[1]+1],
      [point[0], point[1]+2],
      [point[0], point[1]+3],
      [point[0], point[1]+4],
  ]
  if (direction === HORIZONTAL)
    return [
      point,
      [point[0]+1, point[1]],
      [point[0]+2, point[1]],
      [point[0]+3, point[1]],
      [point[0]+4, point[1]],
  ]
  if (direction === LEFT_OBLIQUE)
    return [
      point,
      [point[0]+1, point[1]+1],
      [point[0]+2, point[1]+2],
      [point[0]+3, point[1]+3],
      [point[0]+4, point[1]+4],
  ]
  if (direction === RIGHT_OBLIQUE)
    return [
      point,
      [point[0]+1, point[1]-1],
      [point[0]+2, point[1]-2],
      [point[0]+3, point[1]-3],
      [point[0]+4, point[1]-4],
  ]
}
