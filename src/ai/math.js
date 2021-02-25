//对五子棋的评估分数进行比较，不严格比较分数，采用在一定倍数范围内比较
import ScoreTable from './ScoreTable.js'

var threshold = 1.15

var equal = function(a, b) {
  b = b || 0.01
  return b >= 0 ? ((a >= b / threshold) && (a <= b * threshold))
          : ((a >= b * threshold) && (a <= b / threshold))
}
var greatThan = function(a, b) {
  return b >= 0 ? (a >= (b+0.1) * threshold) : (a >= (b+0.1) / threshold) // 注意处理b为0的情况，通过加一个0.1 做简单的处理
}
var greatOrEqualThan = function(a, b) {
  return equal(a, b) || greatThan(a, b)
}
var littleThan = function(a, b) {
  return b >= 0 ? (a <= (b-0.1) / threshold) : (a <= (b-0.1) * threshold)
}
var littleOrEqualThan = function(a, b) {
  return equal(a, b) || littleThan(a, b)
}

var containPoint = function (arrays, p) {
  for (var i=0;i<arrays.length;i++) {
    var a = arrays[i]
    if (a[0] === p[0] && a[1] === p[1]) return true
  }
  return false
}

var pointEqual = function (a, b) {
  return a[0] === b[0] && a[1] === b[1]
}

var round = function (score) {
  var neg = score < 0 ? -1 : 1
  var abs = Math.abs(score)
  if (abs <= ScoreTable.ONE / 2) return 0
  if (abs <= ScoreTable.TWO / 2 && abs > ScoreTable.ONE / 2) return neg * ScoreTable.ONE
  if (abs <= ScoreTable.THREE / 2 && abs > ScoreTable.TWO / 2) return neg * ScoreTable.TWO
  if (abs <= ScoreTable.THREE * 1.5 && abs > ScoreTable.THREE / 2) return neg * ScoreTable.THREE
  if (abs <= ScoreTable.FOUR / 2 && abs > ScoreTable.THREE * 1.5) return neg * ScoreTable.THREE*2
  if (abs <= ScoreTable.FIVE / 2 && abs > ScoreTable.FOUR / 2) return neg * ScoreTable.FOUR
  return neg * ScoreTable.FIVE
}

export default {
  equal: equal,
  greatThan: greatThan,
  greatOrEqualThan: greatOrEqualThan,
  littleThan: littleThan,
  littleOrEqualThan: littleOrEqualThan,
  containPoint: containPoint,
  pointEqual: pointEqual,
  round: round
}
