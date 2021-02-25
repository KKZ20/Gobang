//算法部分相关函数
import Player from "./Player"
import ScoreTable from "./ScoreTable.js"
import math from "./math.js"
import Config from "./Config.js"
import ChessBoard from "./ChessBoard.js"

//定义最大最小分数值
var MAX = ScoreTable.FIVE * 10
var MIN = -MAX

//负极大值算法
function Negamax(points, player, depth, alpha, beta)
{
  var best
  var steps

  for(var i = 0; i < points.length; i++) {
    ChessBoard.Play(points[i], player)
    steps = [points[i]]
    best = alphaBeta(Player.Turn(player), depth - 1, -beta, -alpha, 1, steps.slice(0))
    best.score = -best.score
    alpha = Math.max(alpha, best.score)
    ChessBoard.Remove(points[i])
    points[i].score = best.score
    points[i].step = best.step
    //console.log("point:"+points[i]+"score:"+points[i].score)
  }

  return alpha
}

//AlphaBeta剪枝
function alphaBeta(player, depth, alpha, beta, step, steps)
{
  var board_score = ChessBoard.evaluateBoard(player)
  var best = {
    score: MIN,
    step: step,
    steps: steps
  }
  var temp = {
    score: board_score,
    step: step,
    steps: steps
  }
  var points
  var _steps

  if (depth <= 0 || math.greatOrEqualThan(board_score, ScoreTable.FIVE) || math.littleOrEqualThan(board_score, -ScoreTable.FIVE)) {
    return temp
  }

  points = ChessBoard.selectPoints(player)
  if (!points.length) {
    return temp
  }
    
  
  for (var i = 0; i < points.length; i++) {
    ChessBoard.Play(points[i], player)
    _steps = steps.slice(0)
    _steps.push(points[i])
    temp = alphaBeta(Player.Turn(player), depth - 1, -beta, -alpha, step + 1, _steps)
    temp.score = -temp.score
    //console.log("point:"+points[i]+"score:"+temp)
    ChessBoard.Remove(points[i])

    if (temp.score > best.score) {
      best = temp
    }
    alpha = Math.max(best.score, alpha)
    //剪枝
    if (math.greatOrEqualThan(temp.score, beta)) {
      temp.score = MAX - 1 // 被剪枝的，直接用一个极大值来记录，但是注意必须比MAX小
      return temp
    }
  }
  
  return best
}

//从选择的落子中进行极小极大算法和剪枝，选择估分最大的位置
function SearchPoint(player, depth)
{
  const points = ChessBoard.selectPoints(player)
  var best_score
  var result

  player = player || Player.computer
  depth = (depth === undefined)? Config.searchDepth: depth
  
  for (var i = 2; i <= depth; i += 2) {
    best_score = Negamax(points, player, i, MIN, MAX)

    if (math.greatOrEqualThan(best_score, ScoreTable.FIVE))
      break 
  }

  // 排序
  /*function pointsSort(a, b)
  {
        return b.score - a.score
  }

  points.sort(pointsSort)*/
  points.sort(function (a,b) {
    if (math.equal(a.score,b.score)) {
      // 大于零是优势，尽快获胜，因此取步数短的
      // 小于0是劣势，尽量拖延，因此取步数长的
      if (a.score >= 0) {
        if (a.step !== b.step) return a.step - b.step
        else return b.score - a.score // 否则 选取当前分最高的（直接评分)
      }
      else {
        if (a.step !== b.step) return b.step - a.step
        else return b.score - a.score // 否则 选取当前分最高的（直接评分)
      }
    }
    else return (b.score - a.score)
  })
  //console.log(points)
  result = points[0]
  
  return result
}
export default SearchPoint
