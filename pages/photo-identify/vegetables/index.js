// pages/plant-identification/index.js
const utils = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    updataImg: '',
    tokenData: {},
    resultsList: [],
    tipsFlag: false
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
    let self = this;
    utils.getAccessToken().then((res)=>{
      self.setData({
        tokenData: res
      })
    });
  },

  picturesFn() {
    let self = this;
    utils.picturesFn({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/classify/ingredient?access_token=' + self.data.tokenData.access_token,
      access_token: self.data.tokenData.access_token,
      baike_num: 1
    }).then((res)=>{
      self.setData({
        updataImg: res.tempFilePaths[0],
        tipsFlag: true,
        resultsList: res.data.result
      })
    })
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})