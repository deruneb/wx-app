// pages-cat/cat-circle/cat-circle.js
const db = wx.cloud.database(),
    utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    miaoInfoList: [], //喵星数据
    userInfo: {},
    fileIDImg: '', //封面
    authorizationFlag: false, //授权状态
    modelFlag: false,
    commentext: '', //评论
    currentUserId: '', //当前评论userid
    currentName: '', //当前评论name
    currentimeStamp: '', //当前评论timeStamp
    commentList: [], //评论数据
    giveLikeList: [], //点赞用户
    middleFlag: false,
    openid: '', //用户标识
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this;
    this.setData({
      userInfo: getApp().globalData.userInfo,
      openid: wx.getStorageSync('app_openid')
    })
    if(!getApp().globalData.userInfo){
      this.setData({authorizationFlag: true});
      wx.showModal({
        title: '提示',
        content: '喵星圈需要您的微信授权才能使用哦 >_<',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      this.setData({authorizationFlag: false})
      this.initData();
    }
   
  },

  //初始化数据
  initData: function (){
    this.getMiaoInfo();
    this.getComment();
    this.getGiveLike();
    
    // userOpenId: wx.getStorageSync('app_openid')
    db.collection('circle-imgs').orderBy('timeStamp','desc').get({
      success: res=>{
        res.data.forEach((item)=>{
          if(item._openid == wx.getStorageSync('app_openid')){
            this.setData({
              fileIDImg: item.fileIDImg,
            })
          }
        })
        console.log("背景图啊",res.data,"wx.getStorageSync('app_openid'",wx.getStorageSync('app_openid'))
      }
    })
    this.setData({
      middleFlag: true
    })
  },

  //获取喵星圈数据
  getMiaoInfo: function (){
    let self = this;
    db.collection('circle-info').orderBy('timeStamp','desc').get({
      success: res => {
        res.data.forEach((item) => {
          item.newTime = utils.getDateDiff(item.timeStamp)
        });
        self.setData({
          miaoInfoList: res.data
        })
        console.log("喵星数据",res)
      }
    })
  },

  //获取对应评论
  getComment: function (){
    db.collection('comment').orderBy('timeStamp','desc').get({
      success: res=>{
        this.setData({
          commentList: res.data
        })
        console.log("对应评论",res.data)
      }
    });
  },

  //获取对应点赞
  getGiveLike: function (){
    db.collection('give-like').orderBy('timeStamp','desc').get({
      success: res=>{
        for (var i = 0; i < res.data.length; i++) {
          for (var j = i+1; j <res.data.length; ) {
              if ((res.data[i]._openid == res.data[j]._openid) && (res.data[i].currentimeStamp == res.data[j].currentimeStamp)) {//通过photoid属性进行匹配；
                  res.data.splice(j, 1);//去除重复的对象；
              }else {
                  j++;
              }
          }
        }
        this.setData({
          giveLikeList: res.data
        })
        console.log("对应点赞",res.data)
      }
    });
  },

  //编辑喵星圈
  jumpEdit: function (){
    wx.navigateTo({
      url: '/pages-cat/cat-edit-circle/cat-edit-circle',
    })
  },

  //用户授权
  getUserInfo: function(e) {
    getApp().globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo
    })
    let sex = e.detail.userInfo.gender == 0 ? '未知' :e.detail.userInfo.gender == 1?'男':'女';
    let self = this;
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
                appid:'wx96d9a606d24aef3b',//仅为实例appid
                secret:'',//仅为实例secret
                grant_type:'authorization_code'
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              success:function(response){
                console.log(response.data)
                wx.setStorageSync('app_openid', response.data.openid); 
                wx.setStorageSync('sessionKey', response.data.session_key)//将session_key 存入本地缓存命名为SessionKey
               
              }
            })
          }else{
            console.log("登陆失败");
          }
        }
      })
      
      self.setData({authorizationFlag:false})
      self.onShow();

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

  //切换背景封面
  changeCover: function (){
    let self = this;
    wx.chooseImage({
      count:1,
      success: function(res) {
        console.log(res);//用于查看结果
        wx.showLoading({
          title: '上传中',
        });
    
        wx.cloud.uploadFile({
          cloudPath: (new Date()).getTime()+Math.floor(9*Math.random())+".jpg", // 上传至云端的路径
          filePath: res.tempFilePaths[0], // 小程序临时文件路径
          success: res => {
            self.setData({
              fileIDImg: res.fileID
            })
            self.saveCover(res.fileID);
            wx.hideLoading()
            console.log("fidId",self.data.fileIdList)
          },
          fail:function(){
            wx.hideLoading();
          },
        })
      }
    })
  },

  //保存封面
  saveCover: function (fidId){
    let self = this;
    console.log("保存封",self.data.fileIDImg)
    db.collection('circle-imgs').add({
      data:{
        fileIDImg: fidId,
        timeStamp: new Date().getTime()
      },
      success: res=>{
        this.onShow()
      }
    })
  },

  //放大图片
  showImg: function (e){
    var single = e.currentTarget.dataset.single;
    var imgList = e.currentTarget.dataset.list;
    console.log("single",single,"imgList",imgList)
    wx.previewImage({
      current: single, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  //评论蒙层
  comment: function (e){
    this.setData({
      modelFlag:true,
      currentUserId: e.currentTarget.dataset.userid,
      currentName: e.currentTarget.dataset.name,
      currentimeStamp: e.currentTarget.dataset.timestamp
    })
  },

  //蒙层
  hideModel: function(){
    this.setData({modelFlag:false})
  },

  //监听input评论输入框
  inputText: function (e){
    this.setData({
      commentext: e.detail.value
    })
  },

  //提交评论
  submitComment: function (){
    db.collection('comment').add({
      data:{
        currentUserId: this.data.currentUserId, //被评论用户UserId
        currentName: this.data.currentName, //被评论用户姓名
        currentimeStamp: this.data.currentimeStamp, //被评论用户喵星圈发布时间
        commentext: this.data.commentext, //评论内容
        selfName: getApp().globalData.userInfo.nickName, //评论人姓名
        timeStamp: new Date().getTime()
      },
      success: res=>{
        wx.showToast({
          icon:'none',
          title: '评论成功',
        })
        this.setData({
          modelFlag: false
        })
        this.getComment();
      }
    })
    console.log("commentext",this.data.commentext)
  },

  //点赞
  giveLike: function (e){
     let currentUserId = e.currentTarget.dataset.userid,
      currentName = e.currentTarget.dataset.name,
      currentimeStamp = e.currentTarget.dataset.timestamp;
  
    db.collection('give-like').add({
      data:{
        currentUserId: currentUserId, //被点赞用户UserId
        currentName: currentName, //被点赞用户姓名
        currentimeStamp: currentimeStamp, //被点赞用户喵星圈发布时间
        selfName: getApp().globalData.userInfo.nickName, //点赞人姓名
        selfphoto: getApp().globalData.userInfo.avatarUrl, //点赞人头像
        selfOpenID: wx.getStorageSync('app_openid'), //点赞人标识
        timeStamp: new Date().getTime()
      },
      success: res=>{
        this.getGiveLike();
      }
    })
   
  },

  guid: function () {
    return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      complete: (res) => {
        if(!this.data.authorizationFlag){
          this.initData();
    
        }
      }
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})