// pages/content-folding/content-folding.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personalText: '', //单内容
    textIntroduce: '',
    businessIntro: [], //图文混合
    anFlag: false, //内容展示状态
    anCompany: false, //图文展示状态
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
    let contArr = [
      {
        imgs: [{
          url: '../../images/icon-index-select.png'
        }],
        introduce: "描述1111",
        title: "标题1111",
      },
      {
        imgs: [{
          url: '../../images/icon-memo-select.png'
        }],
        introduce: "描述2222",
        title: "标题2222",
      },
      {
        imgs: [{
          url: '../../images/icon-space-select.png'
        }],
        introduce: "描述3333",
        title: "标题3333",
      }
    ];
    this.setData({
      personalText: '4月20日，交通运输部、商务部、海关总署、国家铁路局、中国民用航空局、国家邮政局和中国国家铁路集团有限公司联合发布通知，从畅通外贸运输通道、促进外贸运输便利化、降低进出口环节物流成本、营造良好外部环境和强化机制保障五方面提出了16项具体措施，充分发挥综合交通运输的组合优势和各种运输方式的比较优势，发挥交通运输“先行官”作用，保障国际国内运输通道畅通便利，优化运输市场环境，提高运输服务效率，更好地服务稳外贸工作。',
      businessIntro: contArr
    })
    if(this.data.personalText.length > 100){
      var text = this.data.personalText.length > 76 ? this.data.personalText.substring(0,76) + '...':this.data.personalText;
      this.setData({textIntroduce: text})
    }
  },

  //展开
  anText: function (e){
    let type = e.currentTarget.dataset.type;
    switch (type) {
      case 'personal':
        if(!this.data.anFlag){
          this.setData({
            anFlag: true,
            textIntroduce: this.data.personalText
          })
        }else{
          var text = this.data.personalText.length > 100 ? this.data.personalText.substring(0,100) + '...':this.data.personalText;
          this.setData({
            textIntroduce: text,
            anFlag: false,
          })
          console.log("收起",this.data.businessCards)
        }
        break;
      case 'company':
        if(!this.data.anCompany){
          this.setData({anCompany: true})
        }else{
          this.setData({anCompany: false})
        }
        break;
    }
  }
})