Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
    //以本地数据为例，实际开发中数据整理以及加载更多等实现逻辑可根据实际需求进行实现   
  onLoad: function(options) {

  },

  onShow: function (){

  },

  //添加攻略
  jumpAdd: function (){
    wx.navigateTo({
      url: '/pages-cat/cat-strategy-detail/cat-strategy-detail',
    })
  }
})