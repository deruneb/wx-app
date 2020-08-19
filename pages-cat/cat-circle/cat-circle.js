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
    middleFlag: false
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
      userInfo: getApp().globalData.userInfo
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
    db.collection('circle-imgs').orderBy('timeStamp','desc').get({
      success: res=>{
        this.setData({
          fileIDImg: res.data[0].fileIDImg,
          middleFlag: true
        })
      }
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
    })
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
    if(e.detail.userInfo){
      this.setData({authorizationFlag:false})
      this.onShow();
      
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
    console.log("少时诵诗书",e.currentTarget.dataset)
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