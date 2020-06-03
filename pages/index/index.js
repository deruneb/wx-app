//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    msgList: [
      { url: "url", title: "公告：新增集成parse第三方解析插件，巴适的板！" },
      { url: "url", title: "公告：新增地址管理DOM效果！" },
      { url: "url", title: "公告：新增模拟websoket实现即时通讯！" },
      { url: "url", title: "公告：需要源码请看个人中心意见反馈！"}
    ]
    
  },

  onLoad: function () {
    wx.showTabBar();
    wx.showShareMenu();
  },
  //功能跳转
  jumpPage: function (e){
    let type = e.currentTarget.dataset.type;
    switch (type) {
      case '1': //基于base64生成二维码
        wx.navigateTo({
          url: '/pages/create-qrcode/create-qrcode',
        })
        break;
      case '2': //内容/图文折叠
        wx.navigateTo({
          url: '/pages/content-folding/content-folding',
        })
        break;
      case '3': //头像上传裁剪+保存
        wx.navigateTo({
          url: '/pages/photo-upload-editor/photo-upload-editor',
        })
        break;
      case '4': //横向滑动菜单
        wx.navigateTo({
          url: '/pages/sliding-menu/sliding-menu',
        })
        break;
      case '5': //完整录音功能
        wx.navigateTo({
          url: '/pages/voice-set/voice-set?state=2',
        })
        break;
      case '6': //多图上传
        wx.navigateTo({
          url: '/pages/multiple-upload/multiple-upload',
        })
        break;
      case '7': //创建canvas
        wx.navigateTo({
          url: '/pages/create-canvas/create-canvas',
        })
        break;
      case '8': //保存图片至手机 复制文字
        wx.navigateTo({
          url: '/pages/save-content/save-content',
        })
        break;
      case '9': //富文本（html）编译
        wx.navigateTo({
          url: '/pages/parse-html/parse-html',
        })
        break;
      case '10': //地图定点
        wx.navigateTo({
          url: '/pages/map-fixed-point/map-fixed-point',
        })
        break;
      case '11': //websocket
        wx.navigateTo({
          url: '/pages/real-time-websocket/real-time-websocket',
        })
        break;
      case '12': //图形验证码
        wx.navigateTo({
          url: '/pages/validation/validation',
        })
        break;
    }
  },
  onShareAppMessage: function () {
  
    return {
      title: "个人开发小程序功能记录,欢迎参考",
      imageUrl: "https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/ca7ce395-b5bd-41cb-9f31-12ee03ffa811.png",
      path: '/pages/index/index',
    }
  }
})
