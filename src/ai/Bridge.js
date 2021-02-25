//连接前端，传输数据
import Gobang from "./Gobang.js"
import Config from './Config.js'

var gobang = new Gobang()

self.onmessage = function(e) 
{
  var d = e.data
  console.log('get message: ')
  console.log(d)
  if (d.type == "START") {
    const open = gobang.Start(d.random)
    postMessage({
      type: 'board',
      data: open
    })
  }
  else if (d.type == "BEGIN") {
    var p = gobang.Begin()
    postMessage({
      type: 'put',
      data: p
    })
  }
  else if (d.type == "GO") {
    var q = gobang.Play(e.data.x, e.data.y)
    postMessage({
      type: 'put',
      data: q
    })
  }
  else if (d.type == "BACKWARD") {
    gobang.Undo()
  }
  else if (d.type == "FORWARD") {
    gobang.Redo()
  }
  else if (d.type == "RESTART") {
    gobang.Restart()
  }
  else if (d.type == "CONFIG") {
    var c = e.data.config
    if (c.searchDeep) 
      Config.searchDepth = d.searchDeep
    if (c.countLimit) 
      Config.pointLimit = d.countLimit
  }
}
