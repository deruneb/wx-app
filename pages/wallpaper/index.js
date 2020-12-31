// pages/wallpaper/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    girlUrl: 'https://uploadbeta.com/api/pictures/random/?key=%E6%8E%A8%E5%A5%B3%E9%83%8E',
    sceneryUrl: 'https://unsplash.it/1600/900?random',
    searchUrl: 'https://uploadbeta.com/api/pictures/random/?key=',
    searchCodeUrl: '',
    imgUrl: '',
    currentType: 'scenery',
    keyword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initFn('scenery');
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
    
    
  },

  initFn(type){
    wx.showLoading({
      title: '读取中...',
    })
    let self = this, infoUrl = ''; 
    switch (type) {
      case 'scenery':
        infoUrl = this.data.sceneryUrl;
        break;
      case 'girl':
        infoUrl = this.data.girlUrl;
        break;
      case 'search':
        infoUrl = this.data.searchCodeUrl;
        break;
    }
    wx.getImageInfo({
      src: infoUrl,
      success: function (res) {
        self.setData({
          imgUrl: res.path
        })
        wx.hideLoading();
      },
      fail: function(err){
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '关键词查询失败',
        })
      }
    }) 
  },

  previewImage(){
    var list = [];
    list.push(this.data.imgUrl)
    wx.previewImage({
      current: this.data.imgUrl,
      urls: list
    })
  },

  getKeyword(e) {
    let value = e.detail.value;
    this.setData({
      keyword: value
    })
  },

  swithFn(e){
    let type = e.currentTarget.dataset.type;
    this.setData({
      currentType: type,
      imgUrl: ''
    })

    if(type != 'search'){
      this.initFn(type)
    }
  },

  replaceFn(e){
    let type = e.currentTarget.dataset.type;
    this.initFn(type)
  },

  searchFn(){
    let codeText = encodeURI(this.data.keyword);
    let codeUrl = this.data.searchUrl + codeText;
    this.setData({
      searchCodeUrl: codeUrl
    })
    this.initFn('search');
  },

  confirmFn(){
    this.searchFn()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})