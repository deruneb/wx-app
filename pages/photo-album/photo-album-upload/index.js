// pages/photo-album/photo-album.js
const db = wx.cloud.database();
const utils = require("../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoAlbumFileIdList: [],
    tipsTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  upload(){
    let self = this;
    utils.getPhotoAlbumFileId((data)=>{
      self.setData({
        photoAlbumFileIdList: data,
        tipsTitle: '上传成功，点击保存至相册，即可生效!'
      })
      console.log("相册数据",data)
    })
  },

  savePhoto(){
    let self = this;
    if(self.data.photoAlbumFileIdList.length == 0){
      wx.showToast({
        icon: 'none',
        title: '未上传照片',
      })
      return
    }
    db.collection('photo-album').add({
      data:{
        timestamp: Date.parse(new Date()),
        photoList: self.data.photoAlbumFileIdList
      },
      success: res=>{
        wx.showToast({
          icon: 'none',
          title: '保存成功',
        })
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  }
})