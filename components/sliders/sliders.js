// sliders.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {
    hint: '右滑验证',//默认提示语
    sysW: wx.getSystemInfoSync().windowWidth,//获取屏幕宽度
    xAxial: 0,//X轴的初始值
    x: 0,//触摸时X轴的值
    w: (wx.getSystemInfoSync().windowWidth * 0.8) - 50,//滑块可移动的X轴范围
    cssAnimation: 'translate3d(0, 0, 0)',//CSS动画的初始值
    succeedMsg: '',//验证成功提示信息的默认值
    pullStatus: true,//是否允许验证成功后继续滑动
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //滑块移动中执行的事件
    moveFun: function (e) {
      //如果验证成功后仍允许滑动，则执行下面代码块（初始值默认为允许）
      if (this.data.pullStatus) {
        //设置X轴的始点
        this.data.x = e.changedTouches[0].clientX - ((this.data.sysW * 0.1) + 25);
        //如果触摸时X轴的坐标大于可移动距离则设置元素X轴的坐标等于可移动距离的最大值，否则元素X轴的坐标等于等于当前触摸X轴的坐标
        this.data.x >= this.data.w ? this.data.xAxial = this.data.w : this.data.xAxial = this.data.x;
        //如果触摸时X轴的坐标小于设定的始点，则将元素X轴的坐标设置为0
        if (this.data.x < 25) this.data.xAxial = 0;
        //根据获取到的X轴坐标进行动画演示
        this.data.cssAnimation = 'translate3d(' + this.data.xAxial + 'px, 0, 0)';

        this.setData({
          cssAnimation: this.data.cssAnimation
        })
      }
    },

    //松开滑块执行的事件
    endFun: function () {
      //自定义组件触发事件时提供的detail对象
      var detail = {};
      //如果触摸的X轴坐标大于等于限定的可移动范围，则验证成功
      if (this.data.x >= this.data.w) {
        //元素X轴坐标等于可移动范围的最大值
        this.data.xAxial = this.data.w;
        //设置验证成功提示语
        this.data.succeedMsg = '验证成功';
        //设置detail对象的返回值
        detail.msg = true;
        //验证成功后，禁止滑块滑动
        this.data.pullStatus = false;
      } else {
        //元素X轴坐标归0
        this.data.xAxial = 0;
        //清空验证成功提示语
        this.data.succeedMsg = '';
        //设置detail对象的返回值
        detail.msg = false;
      }

      //使用triggerEvent事件，将绑定在此组件的myevent事件，将返回值传递过去
      this.triggerEvent('myevent', detail);
      //根据获取到的X轴坐标进行动画演示
      this.data.cssAnimation = 'translate3d(' + this.data.xAxial + 'px, 0, 0)';

      this.setData({
        succeedMsg: this.data.succeedMsg,
        cssAnimation: this.data.cssAnimation
      })
    }
  }
})