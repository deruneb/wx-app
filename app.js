// {
//   "pagePath": "pages/index/index",
//   "text": "功能集合",
//   "iconPath": "/images/icon-space.png",
//   "selectedIconPath": "/images/icon-space-select.png"
// },
//app.js
const PubSub = require('./utils/pubsub.js'),
  router = require('./router/router.js');

// 事件模块支持
Object.defineProperties(wx, {
  "$on": {
    get() {
      return PubSub.subscribe;
    }
  },
  "$emit": {
    get() {
      return PubSub.publish;
    }
  }
})
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'deruneb-d1sqd'
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    soketObj: {}
  },
  router:router
})