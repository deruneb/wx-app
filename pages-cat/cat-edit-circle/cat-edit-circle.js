// pages-cat/cat-edit-circle/cat-edit-circle.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textValue: '',
    fileIdList: [], //上传图片id
    imageList: [], //选中图片回显
    idList: [],
    copyText: '', //朋友圈文案
    circleRule: ''
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
    // self.getUploadImg()
    this.setData({
      circleRule: wx.getStorageSync('circle-rule') || false
    })
  },

  inputChange: function(e){
    this.setData({
      copyText: e.detail.value
    })
    console.log("输入",e.detail.value)
  },

  //上传图片
  uploadImg:function(){
    var self = this,idList = [];
    wx.chooseImage({
      success: function(res) {
        console.log(res);//用于查看结果
        var image = res.tempFilePaths;
        wx.showLoading({
          title: '上传中',
        });
    
        for(let i = 0 ; i < image.length ; i++){
          wx.cloud.uploadFile({
            cloudPath: (new Date()).getTime()+Math.floor(9*Math.random())+".jpg", // 上传至云端的路径
            filePath: res.tempFilePaths[i], // 小程序临时文件路径
            success: res => {
              self.data.idList.push(res.fileID);
              self.setData({
                fileIdList: self.data.idList
              })
               wx.hideLoading()
              console.log("fidId",self.data.fileIdList)
            },
            fail:function(){
              wx.hideLoading();
            },
          })
        }
      }
    })
  },

  //获取上传图片
  getUploadImg: function (){
    db.collection('circle-imgs').get({
      success:res=> {
        console.log("端获取",res.data)
      },
    })
  },

  //返回上一页
  returnBtn: function (){
    wx.navigateBack({
      delta: 1
    })
  },

  //发布瞄圈
  releaseBtn: function (){
    let self = this;
    if(!self.data.copyText){
      wx.showToast({
        icon: 'none',
        title: '文案不能为空~~~哈拉少',
      })
      return
    }
    db.collection('circle-info').add({
      data:{
        name: getApp().globalData.userInfo.nickName,
        photo: getApp().globalData.userInfo.avatarUrl,
        copyText: self.data.copyText,
        circleImgs: self.data.fileIdList,
        timeStamp: new Date().getTime()
      },
      success: res => {
        wx.showToast({
          icon: 'none',
          title: '发布成功了喵 >_<',
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          });
        },1000)
      },
      fail: res => {
        wx.showToast({
          icon: 'none',
          title: '发布失败，请稍后再试，奥利给~',
        })
      }
    })
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