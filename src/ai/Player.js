//空棋格、电脑棋子、人类棋子分别用0、1、2表示
export default {
  empty: 0,
  computer: 1,
  human: 2,
  //交换角色，分别下棋
  Turn: function(player) {
    return player == this.computer ? this.human : this.computer;
  }
}
