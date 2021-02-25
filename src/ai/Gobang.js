//五子棋游戏的实现
import SearchPoint from "./Algorithm.js"
import Player from "./Player.js"
import Config from "./Config.js"
import ChessBoard from "./ChessBoard.js"

class Gobang {
  //初始化
  Start(random) 
  {
    if (random) {
      //电脑先手，第一子放在棋盘正中
      ChessBoard.Init(15)
      ChessBoard.board[7][7] = Player.computer
      return {
        board: ChessBoard.board
      }
    }
    else {
      //人类先手
      ChessBoard.Init(15)
      return  { board: undefined }
    }
  }

  //电脑下棋
  Begin() 
  {
    let point
    if (ChessBoard.route.length < 1) {
      point = [7, 7]
    }
    else {
      point = point || SearchPoint(undefined, Config.searchDepth)
    }
    ChessBoard.Play(point, Player.computer)
    return point
  }

  //下子并选择下一个棋子位置（电脑）
  Play(x, y) 
  {
    this.Place(x, y, Player.human)
    return this.Begin()
  }

  //只下子，不做选择（人类）
  Place(x, y, player) 
  {
    ChessBoard.Play([x, y], player)
  }
  //悔棋
  Undo() 
  {
    ChessBoard.Undo()
  }
  //取消悔棋
  Redo() 
  {
    ChessBoard.Redo()
  }
  //重新开始
  Restart()
  {
    ChessBoard.Restart()
  }
}
export default Gobang
