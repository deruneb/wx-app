// pages/cat-home/cat-home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catList:[
      {
        name: '金吉拉',
        img: '../../images/cat-1.JPG'
      },
      {
        name: '金渐层',
        img: '../../images/cat-2.JPG'
      },
      {
        name: '橘猫',
        img: '../../images/cat-3.JPG'
      },
      {
        name: '狸花',
        img: '../../images/cat-4.jpg'
      },
      {
        name: '英短',
        img: '../../images/cat-5.jpg'
      },
      {
        name: '蓝猫',
        img: '../../images/cat-6.jpg'  
      },
      {
        name: '暹罗猫',
        img: 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2333090299,850498900&fm=5'
      },
      {
        name: '布偶猫',
        img: 'https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2247692397,1189743173&fm=5'
      },
      {
        name: '苏格兰折耳猫',
        img: 'https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1569462993,172008204&fm=5'
      },
      {
        name: '波斯猫',
        img: 'https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1853832225,307688784&fm=5'
      },
      {
        name: '埃及猫',
        img: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1855682282,311511202&fm=5'
      },
      {
        name: '伯曼猫',
        img: 'https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2164847730,542622686&fm=5'  
      },
      {
        name: '斯芬克斯猫',
        img: 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1567328461,281260858&fm=5'  
      },
      {
        name: '缅甸猫',
        img: 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1722029194,209608728&fm=5'  
      },
      {
        name: '土耳其梵猫',
        img: 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1891064581,255096779&fm=5'  
      },
      {
        name: '美国短尾猫',
        img: 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2191049473,237480689&fm=5'  
      },
      {
        name: '西伯利亚森林猫',
        img: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1764000932,23334225&fm=5'  
      },
      {
        name: '巴厘猫',
        img: 'https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2209975110,512117732&fm=5'  
      },
    ]
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

  },
  
  jumpDetail(e){
    let catIndex = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/cat-detail/cat-detail?id=' + catIndex
    })
    console.log("eee",catIndex)
  }
})