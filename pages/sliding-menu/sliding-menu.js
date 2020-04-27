// pages/sliding-menu/sliding-menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barWidth: 0, //滑动滚动条容器长度
    slideWidth:'',//滑块宽
    slideLeft:0 ,//滑块位置
    slideRatio: '', //滑块比例
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

    //获取元素实例
    var query = wx.createSelectorQuery();
    query.select('.detail-item').boundingClientRect();
    query.exec(function (rect) {
      if (rect[0] === null) return;
      var singleWidth = rect[0].width + 8;
      //滑动查看信息 singleWidth是单个元素的宽度 + margin
      console.log("单个宽",singleWidth)
      var systemInfo = wx.getSystemInfoSync(),
      windowWidth = systemInfo.windowWidth;
      var _totalLength =  700; //列表总长度
      var _ratio = (singleWidth / 2) / _totalLength * (750 / windowWidth); //滚动列表长度与滑条长度比例

      var _showLength = 750 / _totalLength * (singleWidth / 2); //当前显示蓝色滑条的长度
      self.setData({
        slideWidth: _showLength,
        slideRatio:_ratio,
        barWidth: 160
      })
    })

   
  },
  //滑动菜单
  getleft(e){
    this.setData({
      slideLeft: e.detail.scrollLeft * this.data.slideRatio
    })
    console.log("滚动距离",e.detail.scrollLeft,"slideLeft",this.data.slideLeft)
  }, 
})