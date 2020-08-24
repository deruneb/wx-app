const strategyData = require('../../utils/strategy.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    noramalData: [
      // {
      //   Cover: "http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png",
      //   CoverHeight: 467,
      //   CoverWidth: 350,
      //   text: "奥利给"
      // },
      // {
      //   Cover: "http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png",
      //   CoverHeight: 427,
      //   CoverWidth: 350,
      //   text: "奥利给"
      // },
      // {
      //   Cover: "http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png",
      //   CoverHeight: 367,
      //   CoverWidth: 350,
      //   text: "奥利给"
      // },
      // {
      //   Cover: "http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png",
      //   CoverHeight: 367,
      //   CoverWidth: 350,
      //   text: "奥利给"
      // },
      // {
      //   Cover: "http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png",
      //   CoverHeight: 567,
      //   CoverWidth: 350,
      //   text: "奥利给"
      // },
      // {
      //   Cover: "http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png",
      //   CoverHeight: 467,
      //   CoverWidth: 350,
      //   text: "奥利给"
      // },
      
    ],
  
    leftList: [],
    rightList: [],
    leftHight: 0,
    rightHight: 0,
    addImgRight: -104
  },
    //以本地数据为例，实际开发中数据整理以及加载更多等实现逻辑可根据实际需求进行实现   
  onLoad: function(options) {
    this.setData({
      noramalData: strategyData.strategy 
    })
    this.waterfallInit()
  },

  onShow: function (){

  },

  //瀑布初始化
  waterfallInit: function (){
    var that = this;
    var allData = that.data.noramalData;
    //定义两个临时的变量来记录左右两栏的高度，避免频繁调用setData方法
    var leftH = that.data.leftHight;
    var rightH = that.data.rightHight;
    var leftData = [];
    var rightData = [];
    for (let i = 0; i < allData.length; i++) {
      var currentItemHeight = parseInt(Math.round(allData[i].coverHeight * 345 / allData[i].coverWidth));
      allData[i].coverHeight = currentItemHeight + "rpx";//因为xml文件中直接引用的该值作为高度，所以添加对应单位
      if (leftH == rightH || leftH < rightH) {//判断左右两侧当前的累计高度，来确定item应该放置在左边还是右边
        leftData.push(allData[i]);
        leftH += currentItemHeight;
      } else {
        rightData.push(allData[i]);
        rightH += currentItemHeight;
      }
    }
  
    //更新左右两栏的数据以及累计高度
    that.setData({
      leftHight: leftH,
      rightHight: rightH,
      leftList: leftData,
      rightList: rightData
    })
  },

  //跳转详情
  jumpDetail: function (e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages-cat/cat-strategy-detail/cat-strategy-detail?id=' + id,
    })
  },

  //点击弹出
  jumpPop: function (){
    this.setData({
      addImgRight: -12
    })
    setTimeout(()=>{
      this.setData({
        addImgRight: -104
      })
    },3000)
  },

  
})