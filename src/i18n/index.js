import VueI18n from 'vue-i18n'
import Vue from 'vue'

import store from '../store/index.js'

Vue.use(VueI18n)

const messages = {
    zh: {
        'title': '《人工智能课程设计》实验二：五子棋人机博弈问题',
        'settings': '设置',
        'changes': '更新日志',
        'lang': '语言',
        'search deep': '思考深度',
        'idiot': '萌新',
        'easy': '简单',
        'normal': '普通',
        'hard': '困难',
        'start': '开始',
        'give': '认输',
        'restart': '重新开始',
        'forward': '前进',
        'backward': '后退',
        'show steps': '显示序号',
        'step spread': '单步延伸',
        'home': '首页',
        'about': '关于',
        'status': {
            'loading': '正在加载...',
            'start': '请点击 `开始` 按钮',
            'thinking': '正在思考...',
            'playing': '分数 {score}, 步数: {step}, 时间: {time}'
        },
        'you lose': '你输了',
        'you win': '你赢了',
        'dialog': {
            'chooseOffensiveTitle': '选择先手',
            'chooseOffensiveBody': '谁是先手下子？',
            'me': '我',
            'computer': '电脑',
            'giveTitle': '认输?',
            'giveBody': '你确定认输吗?',
            'restartTitle': '重新开始?',
            'restartBody': '你确定重新开始吗?',
            'ok': '确认',
            'cancel': '取消'
        }
    }
}

export default new VueI18n({
    locale: store.getters.lang,
    messages
})