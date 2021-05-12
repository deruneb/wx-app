//获取应用实例
const app = getApp();
const db = wx.cloud.database();
const config = require('../../config.js');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    introduce: '',
    openId: '',
    circleRule: false,
    strateRule: false,
    photoRule: false
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
    this.setData({
      circleRule: wx.getStorageSync('circle-rule') || '',
      strateRule: wx.getStorageSync('strate-rule') || '',
      photoRule: wx.getStorageSync('photo-rule') || ''
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    let self = this;
    getApp().globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    let sex = e.detail.userInfo.gender == 0 ? '未知' :e.detail.userInfo.gender == 1?'男':'女';
    if(e.detail.userInfo){
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey
          console.log(res.code)
          if(res.code){
            console.log(res.code)
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',//微信服务器获取appid的网址 不用变
              method:'post',//必须是post方法
              data:{
                js_code:res.code,
                appid: config.appid,//仅为实例appid
                secret: config.secret,//仅为实例secret
                grant_type:'authorization_code'
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              success:function(response){
                console.log(response.data)
                //ogMRd5TG5h0rkMdhdAm6-x2Ek8II
                self.setData({
                  openId: response.data.openid
                })
                wx.setStorageSync('app_openid', response.data.openid); 
                wx.setStorageSync('sessionKey', response.data.session_key)//将session_key 存入本地缓存命名为SessionKey
              }
            })
          }else{
            console.log("登陆失败");
          }
        }
      })
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
    console.log('appp',app)
    app.router.push('index',{openType: 'switchTab'})
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
  },
  //功能集合跳转
  jumpCollection: function (){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  //壁纸跳转
  jumpWallpaper: function (){
    wx.navigateTo({
      url: '/pages/wallpaper/index',
    })
  },
  //日记权限
  circleFn(){
    this.setData({
      circleRule: !this.data.circleRule
    })
    wx.setStorageSync('circle-rule', this.data.circleRule); 
  },
  //攻略权限
  strateFn(){
    this.setData({
      strateRule: !this.data.strateRule
    })
    wx.setStorageSync('strate-rule', this.data.strateRule);
  },
  //相册权限
  photoFn(){
    this.setData({
      photoRule: !this.data.photoRule
    })
    wx.setStorageSync('photo-rule', this.data.photoRule);
  },
  welfareFn(e){
    let welfareUrl = '';
    switch (e.currentTarget.dataset.type) {
      case 'fulao':
        welfareUrl = 'https://safe.qdyingqishun.com/?utm_source=share&utm_medium=ios';
        break;
      case 'aiweier':
        welfareUrl = 'https://night18.icu';
        break;
    }
    wx.setClipboardData({
      data: welfareUrl,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }
})
