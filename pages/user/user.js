//获取应用实例
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    introduce: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let self = this;
    wx.showTabBar();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log("res.userInfo1",res.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          console.log("res.userInfo2",res.userInfo)
        }
      })
    }
  },
  onShow: function(){
    
  },
  getUserInfo: function(e) {
    console.log(e)
    getApp().globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    let sex = e.detail.userInfo.gender == 0 ? '未知' :e.detail.userInfo.gender == 1?'男':'女';
    if(e.detail.userInfo){
      db.collection('upload').add({
        data:{
          name: e.detail.userInfo.nickName,
          photo: e.detail.userInfo.avatarUrl,
          gender: sex,
          city: e.detail.userInfo.city,
          province: e.detail.userInfo.province
        }
      }).then(res=>{
        console.log("上传信息成功")
      }).catch(error => {
        console.log("上传信息失败!")
      })
    }
    
  },
  openSetting: function (e){
    var permissions = e.detail.authSetting, self = this;
    console.log("取消授权",typeof permissions['scope.userInfo']);

    //判断取消了哪些权限 scope.writePhotosAlbum(相册)scope.userInfo(个人授权)
    if(!permissions['scope.userInfo']){ 
      self.setData({
        userInfo: {},
        hasUserInfo: false
      })
    }
  },
  //简介
  enterpriseTextareaInput: function (e) {
    let valueText =  e.detail.value;
    this.setData({
      introduce: valueText
    })
    console.log("valueText",valueText)
  },
  //提交
  addModule: function (){
    let self = this;
    db.collection('Leave-message').add({
      data:{
        message: self.data.introduce
      }
    }).then(res=>{
      self.setData({
        introduce: ''
      })
      wx.showToast({
        title: '发表成功',
        icon: 'success',
        duration: 1500
      })
    }).catch(error => {
      wx.showToast({
        title: '发表失败，请重试~~',
        icon: 'none',
        duration: 1500
      })
      // handle error
    })
  }
})
