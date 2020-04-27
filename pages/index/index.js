//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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
