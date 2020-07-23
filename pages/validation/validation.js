var MCAP = require('../../utils/mcaptcha.js');
Page({
  data: {
    codeStr: '', //生成的验证码
    code: '', //输入的验证码
    character: true, //字符验证
    sliding: false, //滑动验证
    graphics: false, //图形验证
  },
  onLoad: function(options) {

  },
  onShow (){
    this.initDraw(); //生成验证码
  },
  //切换菜单
  menuBtn: function(e){
    console.log("验证",e)
    switch (e.currentTarget.dataset.type) {
      case '1':
        this.setData({
          character: true,
          sliding: false, 
          graphics: false, 
        })
        break;
      case '2':
        this.setData({
          character: false,
          sliding: true, 
          graphics: false, 
        })
        break;
      case '3':
        this.setData({
          character: false,
          sliding: false, 
          graphics: true, 
        })
        //图形滑动
        this.selectComponent("#jigsawPuzzle").reloadSilder();
        break;  
    }
  },
  /**
   * 制作验证码
   */
  initDraw() {
    console.log("生成验证")
    var that = this;
    var codes = that.getRanNum();
    that.setData({
      codeStr: codes //生成的验证码
    })
    new MCAP({
      el: 'canvas',
      width: 120,
      height: 40,
      code: codes
    });
  },
   /**
   * 更换验证码
   */
  changeImg: function () {
    this.initDraw();
  },
   /**
   * 图片验证码绑定变量 
   */
  bindCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  /**
   * 点击提交触发
   */
  saves: function() {
    console.log('输入的验证码为：'+this.data.code)
  },
  /**
   * 获取随机数
   */
  getRanNum: function () {
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var pwd = '';
    for (var i = 0; i < 4; i++) {
      if (Math.random() < 48) {
        pwd += chars.charAt(Math.random() * 48 - 1);
      }
    }
    return pwd;
  },

  // 滑动验证事件
  myEventListener: function (e) {
    //获取到组件的返回值，并将其打印
    console.log('是否验证通过:' + e.detail.msg)
  },

  //图形滑动验证
  compTouchend: function(eDetail) { //获取滑动验证的结果
    var self = this;
    var flag = (eDetail.detail.isPass ? 2 : 1);
    if (flag == 2) { //验证成功
      wx.showToast({
        title: '验证成功了铁汁，开始后续操作吧',
        icon: 'none'
      })
    }
  }
})