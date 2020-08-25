// pages-cat/cat-strategy-detail/cat-strategy-detail.js
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageId: '', //跳转页id
    detailData: [], //详情数据
    optionsData: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      optionsData: options
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let self = this;
    //获取数据
    utils.getStrategyList((data)=>{
      wx.hideLoading();
      self.setData({
        pageId: self.data.optionsData.id,
        detailData: data
      })
      wx.setNavigationBarTitle({
        title: self.data.detailData[self.data.pageId].coverTitle,
      })
      
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
    let self = this,index = this.data.pageId;
    let shareData = self.data.detailData[index];
    console.log("self.data.detailData[index].coverTitle",)
    return {
      title: shareData.coverTitle + "【欢迎转发】",
      path: `/pages-cat/cat-strategy-detail/cat-strategy-detail?id=${this.data.pageId}`,
      imageUrl: shareData.coverImg
    }
  }
})