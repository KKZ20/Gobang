//五子棋棋盘及游戏行动
import {evaluatePoint, fixScore} from "./EvaluatePoint.js"
import Player from "./Player.js"
import ScoreTable from "./ScoreTable.js"
import Config from "./Config.js"

class ChessBoard {
  //棋盘初始化
  Init(size) 
  {
    var board_size //棋盘规格
    this.route = [] //存放路线
    this.step = 0 //游戏步数
    this.board = [] //棋盘

    // 存储双方得分
    this.computer_score
    this.human_score
    //创造数组
    function createArray(r, c) {
      var array = []
      for (var i = 0; i < r; i++) {
        var row = new Array()
        for(var j = 0; j < c; j++) {
          row.push(0)
        }
        array.push(row)
      }
      return array
    }
    //电脑先手，有初始棋盘
    if (size.length) {
      this.board = size
      board_size = this.board.length
      for (var i = 0; i < this.board.length; i++)
        this.step += this.board[i].filter(d=>d > 0).length
    } 
    //人类先手，棋盘初始为空
    else {
      board_size = size
      for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
          row.push(0)
        }
        this.board.push(row)
      }
    }
    
    this.computer_score = createArray(board_size, board_size)
    this.human_score = createArray(board_size, board_size)
    this.initScore()
  }

  //对棋面进行估分
  initScore() 
  {
    var board = this.board

    for (var i = 0; i  <board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
        //空位，对双方都打分
        if (board[i][j] == Player.empty) {
          if (this.hasNeighbor(i, j, 2, 2)) { //必须是有邻居的才行
            this.computer_score[i][j] = evaluatePoint(this, i, j, Player.computer)
            this.human_score[i][j] = evaluatePoint(this, i, j, Player.human)
          }
        }
        else if (board[i][j] == Player.com) { //对电脑打分，玩家此位置分数为0
          this.computer_score[i][j] = evaluatePoint(this, i, j, Player.computer)
          this.human_score[i][j] = 0
        }
        else if (board[i][j] == Player.hum) { //对玩家打分，电脑位置分数为0
          this.human_score[i][j] = evaluatePoint(this, i, j, Player.human)
          this.computer_score[i][j] = 0
        }
      }
    }
  }

  //更新一个点附近的分数
  updateScore(x, y)
  {
    const HORIZONTAL = 0
    const VERTICAL = 1
    const LEFT_OBILIQUE = 2
    const RIGHT_OBLIQUE = 3

    var self = this
    var len = this.board.length
    var distance = 4
    var i
    
    function Update(x, y, direction) {
      var player = self.board[x][y]
      if (player === Player.computer) {
        self.computer_score[x][y] = evaluatePoint(self, x, y, Player.computer, direction)
      } 
      else {
        self.computer_score[x][y] = 0
      }
      if (player === Player.human) {
        self.human_score[x][y] = evaluatePoint(self, x, y, Player.human, direction)
      } 
      else {
        self.human_score[x][y] = 0
      }
    }

    // -
    for(i = -distance; i <= distance; i++) {
      if (i === 0)
        continue
      if (y + i < 0) 
        continue
      if (y + i >= len) 
        break
      Update(x, y + i, HORIZONTAL)
    }

    // |
    for (i = -distance; i<=distance; i++) {
      if (i === 0)
        continue
      if (x + i < 0) 
        continue
      if (x + i >= len) 
        break
      Update(x + i, y, VERTICAL)
    }

    // \
    for (i = -distance; i <= distance; i++) {
      if (i === 0)
        continue
      if (x + i < 0 || y + i < 0) 
        continue
      if (x + i >= len || y + i >= len) 
        break
      Update(x + i, y + i, LEFT_OBILIQUE)
    }

    // /
    for (i = -distance; i <= distance; i++) {
      if (i === 0)
        continue
      if (x + i < 0 || y - i >= len) 
        continue
      if (x + i >= len || y - i < 0) 
        break
      Update(x + i, y - i, RIGHT_OBLIQUE)
    }
  }

  //下子
  Play(point, player)
  {
    point.player = player
    this.board[point[0]][point[1]] = player
    this.updateScore(point[0], point[1])
    this.route.push(point)
    this.undo_route = []
    this.step++
  }

  //移除棋子
  Remove(point)
  {
    this.board[point[0]][point[1]] = Player.empty
    this.updateScore(point[0], point[1])
    this.route.pop()
    this.step--
  }

  //悔棋
  Undo()
  {
    if(this.route.length < 2) return
    var i = 0;
    while(i < 2) {
      var s = this.route[this.route.length - 1]
      this.Remove(s)
      this.undo_route.push(s)
      i++
    }
  }

  //取消悔棋
  Redo()
  {
    if(this.undo_route.length < 2) return
    var i = 0;
    while(i < 2) {
      var s = this.undo_route.pop()
      this.Play(s, s.player)
      i++
    }
  }

  //重新开始
  Restart()
  {
    this.Init(15)
  }

  //当前棋面估分
  evaluateBoard(player)
  {
    this.computer_max_score = 0
    this.human_max_score = 0

    var board = this.board
    var result

    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
        if (board[i][j] == Player.computer) {
          this.computer_max_score += fixScore(this.computer_score[i][j])
        }
        else if (board[i][j] == Player.human) {
          this.human_max_score += fixScore(this.human_score[i][j])
        }
      }
    }
    // 有冲四延伸了，不需要专门处理冲四活三
    // 不过这里做了这一步，可以减少电脑胡乱冲四的毛病
    this.computer_max_score = fixScore(this.computer_max_score)
    this.human_max_score = fixScore(this.human_max_score)
    result = (player == Player.computer? 1: -1) * (this.computer_max_score - this.human_max_score)

    return result
  }

  //根据棋面估分选择可能的落子位置 
  selectPoints (player)
  { 
    var result = []

    var fives = []
    var comfours=[]
    var humfours=[]
    var comblockfours = []
    var humblockfours = []
    var comtwothrees=[]
    var humtwothrees=[]
    var comthrees = []
    var humthrees = []
    var comtwos = []
    var humtwos = []
    var neighbors = []

    var board = this.board
    var point
    var max_score

    if (this.step <= 0) 
      return [7, 7]

    for (var i = 0;i < board.length; i++) {
      for (var j = 0;j < board.length; j++) {
        if (board[i][j] == Player.empty) {
          if(this.route.length < 6) {
            if (!this.hasNeighbor(i, j, 1, 1)) 
              continue
          }
          else if (!this.hasNeighbor(i, j, 2, 2))
            continue
          
          max_score = Math.max(this.human_score[i][j], this.computer_score[i][j])

          point = [i, j]
          point.human_score = this.human_score[i][j]
          point.computer_score = this.computer_score[i][j]
          point.max_score = max_score
          point.player = player

          if (this.computer_score[i][j] >= ScoreTable.FIVE) {//电脑能不能连成五子
            fives.push(point)
          }
          else if (this.human_score[i][j] >= ScoreTable.FIVE) {//玩家能不能连成五子
            fives.push(point)
          }
          else if (this.computer_score[i][j] >= ScoreTable.FOUR) {
            comfours.push(point)
          }
          else if (this.human_score[i][j] >= ScoreTable.FOUR) {
            humfours.push(point)
          }
          else if (this.computer_score[i][j] >= ScoreTable.BLOCK_FOUR) {
            comblockfours.push(point)
          }
          else if (this.human_score[i][j] >= ScoreTable.BLOCK_FOUR) {
            humblockfours.push(point)
          }
          else if (this.computer_score[i][j] >= 2 * ScoreTable.THREE) {
            //双三
            comtwothrees.push(point)
          }
          else if (this.human_score[i][j] >= 2 * ScoreTable.THREE) {
            humtwothrees.push(point)
          }
          else if (this.computer_score[i][j] >= ScoreTable.THREE) {
            comthrees.push(point)
          }
          else if (this.human_score[i][j] >= ScoreTable.THREE) {
            humthrees.push(point)
          }
          else if (this.computer_score[i][j] >= ScoreTable.TWO) {
            //comtwos.unshift(point)
            comtwos.push(point)
          }
          else if (this.human_score[i][j] >= ScoreTable.TWO) {
            //humtwos.unshift(point)
            humtwos.push(point)
          }
          else 
            neighbors.push(point)
        }
      }
    }

    //如果成五，是必杀棋，直接返回
    if(fives.length)
      return fives
    
    // 自己能活四，则直接活四，不考虑冲四
    if (player === Player.computer && comfours.length)
      return comfours
    if (player === Player.human && humfours.length)
      return humfours

    //对面有活四冲四，自己冲四都没，则只考虑对面活四
    //console.log("humfours"+humfours+"comfours"+comfours)
    if (player === Player.computer && humfours.length && !comblockfours.length)
      return humfours
    if (player === Player.human && comfours.length && !humblockfours.length)
      return comfours

    //对面有活四自己有冲四，则都考虑
    var fours = (player === Player.computer)? comfours.concat(humfours): humfours.concat(comfours)
    var blockfours = (player === Player.computer)? comblockfours.concat(humblockfours): humblockfours.concat(comblockfours)
    if (fours.length)
      return fours.concat(blockfours)

    
    if (player === Player.computer) {
      result = comtwothrees.concat(humtwothrees).concat(comblockfours).concat(humblockfours).concat(comthrees).concat(humthrees)
    }
    if (player === Player.human) {
      result = humtwothrees.concat(comtwothrees).concat(humblockfours).concat(comblockfours).concat(humthrees).concat(comthrees)
    }
    
    result.sort(function(a, b) { return b.score - a.score })

    //双三很特殊，因为能形成双三的不一定比一个活三强
    if (comtwothrees.length || humtwothrees.length) {
      return result
    }

    var twos
    if (player === Player.computer) 
      twos = comtwos.concat(humtwos)
    else 
      twos = humtwos.concat(comtwos)

    twos.sort(function(a, b) { return b.score - a.score })
    result = result.concat(twos.length? twos: neighbors)

    if (result.length > Config.pointLimit) {
      return result.slice(0, Config.pointLimit)
    }

    return result
  }

  //判断某个棋子周围一定范围是否有其它棋子
  hasNeighbor(x, y, distance, num)
  {
    var board = this.board
    var len = board.length
    var startX = x-distance
    var startY = y-distance
    var endX = x+distance
    var endY = y+distance
    for (var i = startX; i <= endX; i++) {
      if (i < 0 || i >= len)
        continue
      for (var j = startY; j <= endY; j++) {
        if (j < 0 || j >= len)
          continue
        if (i == x && j == y)
          continue
        if (board[i][j] != Player.empty) {
          num--
          if (num <= 0)
            return true
        }
      }
    }
    return false
  }
}

var chessboard = new ChessBoard()

export default chessboard
