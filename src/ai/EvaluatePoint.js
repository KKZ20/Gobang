//对棋子进行估分的部分函数
import Player from "./Player.js"
import ScoreTable from "./ScoreTable.js"

//对一颗棋子从各个方向进行比较
export function evaluatePoint(cb, x, y, player, direction)
{
  const HORIZONAL = 0 // -
  const VERTICAL = 1 // |
  const LEFT_OBLIQUE = 2 // \
  const RIGHT_OBLIQUE = 3 // /

  var board = cb.board
  var len = board.length
  var count, empty, block
  var result = 0
  var i, j
  //重置参数
  function reset() 
  {
      count = 0 //同类棋子
      empty = -1 //空格位置
      block = 0 //对手棋子或棋盘边缘
  }
  //水平
  if (direction === undefined || direction === HORIZONAL) {
      reset()
      for (i = x; i < len; i++) {
          if (board[i][y] === Player.empty) {
              if (empty == -1 && i < len - 1 && board[i + 1][y] == player) {
                  empty = count
              }
              else
                  break
          }
          else if (board[i][y] === player) {
              count++
          }
          else {
              block++
              break
          }
          if (i === len - 1) {
              block++
          }
      }
      for(i = x - 1; i >= 0; i--) {
          if (board[i][y] === Player.empty) {
              if (empty == -1 && i > 0 && board[i - 1][y] == player) {
                  empty = 0
              }
              else
                  break
          }
          else if (board[i][y] === player) {
              count++
              if (empty != -1) {
                  empty++ 
              }
          }
          else {
              block++
              break
          }
          if (i === 0) {
              block++
          }
      }
      result += calculateScore(count, block, empty)
  }
  //垂直
  if (direction === undefined || direction === VERTICAL) {
      reset()
      for (i = y; i < len; i++) {
          if (board[x][i] === Player.empty) {
              if (empty == -1 && i < len - 1 && board[x][i + 1] == player) {
                  empty = count
              }
              else
                  break
          }
          else if (board[x][i] === player) {
              count++
          }
          else {
              block++
              break
          }
          if (i === len - 1) {
              block++
          }
      }
      for(i = y - 1; i >= 0; i--) {
          if (board[x][i] === Player.empty) {
              if (empty == -1 && i > 0 && board[x][i - 1] == player) {
                  empty = 0
              }
              else
                  break
          }
          else if (board[x][i] === player) {
              count++
              if (empty != -1) {
                  empty++ 
              }
          }
          else {
              block++
              break
          }
          if (i === 0) {
              block++
          }
      }
      result += calculateScore(count, block, empty)
  }
  //左斜
  if (direction === undefined || direction === LEFT_OBLIQUE) {
      reset()
      for (i = x, j = y; i < len && j < len; i++, j++) {
          if (board[i][j] === Player.empty) {
              if (empty == -1 && i < len - 1 && j < len - 1 && board[i + 1][j + 1] == player) {
                  empty = count
              }
              else
                  break
          }
          else if (board[i][j] === player) {
              count++
          }
          else {
              block++
              break
          }
          if (i === len - 1 && j === len - 1) {
              block++
          }
      }
      for(i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
          if (board[i][j] === Player.empty) {
              if (empty == -1 && i > 0 && j > 0 && board[i - 1][j - 1] == player) {
                  empty = 0
              }
              else
                  break
          }
          else if (board[i][j] === player) {
              count++
              if (empty != -1) {
                  empty++ 
              }
          }
          else {
              block++
              break
          }
          if (i === 0 && j === 0) {
              block++
          }
      }
      result += calculateScore(count, block, empty)
  }
  //右斜
  if (direction === undefined || direction === RIGHT_OBLIQUE) {
      reset()
      for (i = x, j = y; i < len && j >= 0; i++, j--) {
          if (board[i][j] === Player.empty) {
              if (empty == -1 && i < len - 1 && j > 0 && board[i + 1][j - 1] == player) {
                  empty = count
              }
              else
                  break
          }
          else if (board[i][j] === player) {
              count++
          }
          else {
              block++
              break
          }
          if (i === len - 1 && j === 0) {
              block++
          }
      }
      for(i = x - 1, j = y + 1; i >= 0 && j < len; i--, j++) {
          if (board[i][j] === Player.empty) {
              if (empty == -1 && i > 0 && j < len - 1 && board[i - 1][j + 1] == player) {
                  empty = 0
              }
              else
                  break
          }
          else if (board[i][j] === player) {
              count++
              if (empty != -1) {
                  empty++ 
              }
          }
          else {
              block++
              break
          }
          if (i === 0 && j === len - 1) {
              block++
          }
      }
      result += calculateScore(count, block, empty)
  }

  return result
}

//对一个方向上的棋子的棋型进行打分
function calculateScore(count, block, empty)
{
  if (empty === undefined)
    empty = 0

  //没有空位
  if (empty <= 0) {
    if (count >= 5)
      return ScoreTable.FIVE
    if (block === 0) {
      switch (count) {
        case 1: return ScoreTable.ONE
        case 2: return ScoreTable.TWO
        case 3: return ScoreTable.THREE
        case 4: return ScoreTable.FOUR
      }
    }

    if (block === 1) {
      switch (count) {
        case 1: return ScoreTable.BLOCK_ONE
        case 2: return ScoreTable.BLOCK_TWO
        case 3: return ScoreTable.BLOCK_THREE
        case 4: return ScoreTable.BLOCK_FOUR
      }
    }

  }
  else if (empty === 1 || empty == count - 1) {
    //第1个是空位
    if (count >= 6) {
      return ScoreTable.FIVE
    }
    if (block === 0) {
      switch (count) {
        case 2: return ScoreTable.TWO / 2
        //case 2: return ScoreTable.TWO
        case 3: return ScoreTable.THREE
        case 4: return ScoreTable.BLOCK_FOUR
        //case 4: return ScoreTable.FOUR
        case 5: return ScoreTable.FOUR
      }
    }

    if (block === 1) {
      switch (count) {
        case 2: return ScoreTable.BLOCK_TWO
        case 3: return ScoreTable.BLOCK_THREE
        case 4: return ScoreTable.BLOCK_FOUR
        case 5: return ScoreTable.BLOCK_FOUR
      }
    }
  }
  else if (empty === 2 || empty == count - 2) {
    //第二个是空位
    if (count >= 7) {
      return ScoreTable.FIVE
    }
    if (block === 0) {
      switch (count) {
        case 3: return ScoreTable.THREE
        case 4: 
        case 5: return ScoreTable.BLOCK_FOUR
        case 6: return ScoreTable.FOUR
      }
    }

    if (block === 1) {
      switch (count) {
        case 3: return ScoreTable.BLOCK_THREE
        case 4: return ScoreTable.BLOCK_FOUR
        case 5: return ScoreTable.BLOCK_FOUR
        case 6: return ScoreTable.FOUR
      }
    }

    if (block === 2) {
      switch (count) {
        case 4:
        case 5:
        case 6: return ScoreTable.BLOCK_FOUR
      }
    }
  }
  else if (empty === 3 || empty == count - 3) {
    //第三个是空位
    if (count >= 8) {
      return ScoreTable.FIVE
    }
    if (block === 0) {
      switch (count) {
        case 4:
        //case 4: return ScoreTable.FOUR
        case 5: return ScoreTable.THREE
        case 6: return ScoreTable.BLOCK_FOUR
        case 7: return ScoreTable.FOUR
      }
    }

    if (block === 1) {
      switch (count) {
        case 4:
        case 5:
        case 6: return ScoreTable.BLOCK_FOUR
        case 7: return ScoreTable.FOUR
      }
    }

    if (block === 2) {
      switch (count) {
        case 4:
        case 5:
        case 6:
        case 7: return ScoreTable.BLOCK_FOUR
      }
    }
  }
  else if (empty === 4 || empty == count - 4) {
    //第四个是空位
    if (count >= 9) {
      return ScoreTable.FIVE
    }
    if (block === 0) {
      switch (count) {
        case 5:
        case 6:
        case 7:
        case 8: return ScoreTable.FOUR
      }
    }

    if (block === 1) {
      switch (count) {
        case 4:
        case 5:
        case 6:
        case 7: return ScoreTable.BLOCK_FOUR
        case 8: return ScoreTable.FOUR
      }
    }

    if (block === 2) {
      switch (count) {
        case 5:
        case 6:
        case 7:
        case 8: return ScoreTable.BLOCK_FOUR
      }
    }
  }
  else if (empty === 5 || empty == count - 5) {
    //第五个是空位
    return ScoreTable.FIVE
  }

  return 0
}

//进行分数修正
//冲四的分其实肯定比活三高，但是如果这样的话容易形成盲目冲四的问题，所以如果发现电脑有无意义的冲四，则将分数降低到和活三一样
//而对于冲四活三这种杀棋，则将分数提高
export function fixScore(type)
{
  if (type < ScoreTable.FOUR && type >= ScoreTable.BLOCK_FOUR) {
    if (type >= ScoreTable.BLOCK_FOUR && type < (ScoreTable.BLOCK_FOUR + ScoreTable.THREE)) {
      //单独冲四，意义不大
      return ScoreTable.THREE
    }
    else if (type >= ScoreTable.BLOCK_FOUR + ScoreTable.THREE && type < ScoreTable.BLOCK_FOUR * 2) {
      return ScoreTable.FOUR  //冲四活三，比双三分高，相当于自己形成活四
    }
    else {
      //双冲四 比活四分数也高
      return ScoreTable.FOUR * 2
    }
  }
  return type
}