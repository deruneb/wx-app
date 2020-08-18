// pages-cat/cat-edit-circle/cat-edit-circle.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textValue: '',
    fileIdList: [], //上传图片id
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
    self.getUploadImg()
  },

  inputChange: function(e){
    console.log("输入",e.detail.value)
  },

  //上传图片
  uploadImg:function(){
    var self = this,idList = [];
    wx.chooseImage({
      success: function(res) {
        console.log(res);//用于查看结果
        var image = res.tempFilePaths;
        self.setData({
            images:res.tempFilePaths 
        });
        console.log(self.data.images);//用于查看结果
        wx.showLoading({
          title: '正在提交！',
        });
    
        for(let i = 0 ; i < image.length ; i++){
          wx.cloud.uploadFile({
            cloudPath: (new Date()).getTime()+Math.floor(9*Math.random())+".jpg", // 上传至云端的路径
            filePath: res.tempFilePaths[i], // 小程序临时文件路径
            success: res => {
              idList.push(res.fileID);
              self.setData({
                fileIdList: idList
              })
              // 返回文件 ID
              db.collection('circle-imgs').add({
                data:{
                  images: self.data.fileIdList
                }
              }).then(res=>{
                console.log("上传信息成功")
              }).catch(error => {
                console.log("上传信息失败!")
              })
              console.log(res.fileID,"fileIdList",self.data.fileIdList)
              wx.hideLoading();
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