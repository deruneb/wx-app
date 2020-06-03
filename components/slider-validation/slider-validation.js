import silderPublic from './silderPublic';
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
    r:9,
    s:45,
    n:0,
    width:0,//silder_img2,silder_ceng宽
    height: 0,//silder_img2,silder_ceng高
    isMatch:false,
    mX:0,//移动距离
    dX: 0, //滑动区域
    dX1: 0, //滑动区域
    isDrag:false,
    imageSrc:'',
    isPass:null,
    isPassText:'',
    isShow:'none'
  },
  ready: function () {},
  /**
   * 组件的方法列表
   */
  methods: {
    reloadSilder: function(){//加载滑块验证
      var self = this;
      self.data.isDrag = false;
      self.data.isMatch = false;
      self.setData({
        isPassText: '',
        isPass: null,
        mX: 0,//移动距离
        dX: 0, //滑动区域
        dX1: 0, //滑动区域
        imageSrc: '',
        isShow:'block'
      })
      self.data.ctx_img = wx.createCanvasContext('silder_img2', this),
      self.data.ctx_ceng = wx.createCanvasContext('silder_ceng', this);
      var query = wx.createSelectorQuery().in(this);
      query.select('#silderContent').boundingClientRect();
      query.exec(function (res) {
        self.data.width = res[0].width;
        self.data.height = res[0].height;
        self.getData();
      })
    },
    getData: function () {
      var self=this;
      self.data.mX = 0;
      self.data.ctx_img.clearRect(0, 0, self.data.width, self.data.height);
      self.data.ctx_ceng.clearRect(0, 0, self.data.width, self.data.height);
      var silderData = silderPublic.product(self.data.width, self.data.height,self.data.s);
      self.data.cX = silderData.x;
      self.data.cY = silderData.y;
      //背景图
      wx.getImageInfo({
        src: silderData.imgSrc,
        success: function(data){
          self.data.ctx_img.drawImage(data.path, 0, 0, self.data.width, self.data.height);

          self.data.ctx_img.draw(false, setTimeout(function () {
            wx.canvasToTempFilePath({
              canvasId: 'silder_img2',
              x: self.data.cX,
              y: self.data.cY - self.data.r,
              width: self.data.s + self.data.r + 1,
              height: self.data.s + 2 * self.data.r + 1,
              destWidth: self.data.s + self.data.r + 1,
              destHeight: self.data.s + 2 * self.data.r + 1,
              fileType: 'png',
              success(res) {
                self.data.imageSrc = res.tempFilePath;
                //右侧拼图块
                self.data.ctx_img.clearRect(0, 0, self.data.width, self.data.height);
                self.data.ctx_img.drawImage(data.path, 0, 0, self.data.width, self.data.height);
                self.data.ctx_img.save();
                self.data.ctx_img.setLineWidth(2);
                self.data.ctx_img.setStrokeStyle('#fff');
                self.data.ctx_img.beginPath();
                self.data.ctx_img.moveTo(self.data.cX, self.data.cY);
                self.data.ctx_img.lineTo(self.data.cX + self.data.s / 2 - self.data.r, self.data.cY);
                self.data.n = self.strockArc(self.data.ctx_img, self.data.cX);
                self.data.ctx_img.closePath();
                self.data.ctx_img.stroke();
                self.data.ctx_img.clip();
                self.data.ctx_img.fillStyle = 'rgba(255,255,255, .5)';
                self.data.ctx_img.fillRect(0, 0, self.data.width, self.data.height);
                self.data.ctx_img.restore();
                self.data.ctx_img.fillStyle = 'rgba(255,255,255,0.0)';
                self.data.ctx_img.fillRect(0, 0, self.data.width, self.data.height);
                self.data.ctx_img.draw();
                // 左侧拼图块
                self.data.ctx_ceng.clearRect(0, 0, self.data.width, self.data.height);
                self.data.ctx_ceng.setLineWidth(2);
                self.data.ctx_ceng.setStrokeStyle("#fff");
                self.data.ctx_ceng.save();
                self.data.ctx_ceng.beginPath();
                self.data.ctx_ceng.moveTo(self.data.mX, self.data.cY);
                self.data.ctx_ceng.lineTo(self.data.mX + self.data.s / 2 - self.data.r, self.data.cY);
                self.strockArc(self.data.ctx_ceng, self.data.mX + 1, self.data.n);
                self.data.ctx_ceng.closePath();
                self.data.ctx_ceng.setShadow(1, 1, 6, "rgba(0,0,0,.8)");
                self.data.ctx_ceng.setFillStyle('green');
                self.data.ctx_ceng.fill();
                self.data.ctx_ceng.stroke();
                self.data.ctx_ceng.clip();
                self.data.ctx_ceng.drawImage(self.data.imageSrc, self.data.mX + 1, self.data.cY - self.data.r, self.data.s + self.data.r + 1, self.data.s + 2 * self.data.r + 1);
                self.data.ctx_ceng.restore();
                self.data.ctx_ceng.draw();
              }
            }, self)
          }, 100));
        }
      })
      
    },
    strockArc: function (ctx, mX, n) {//圆心(x,y)，半径r
      var self=this;
      var number = Math.floor(Math.random() * 9) % 9;
      if (n >= 0) number = n;
      switch (number) {
        case 0:
          //上凸下凹
          ctx.arc(mX + self.data.s / 2, self.data.cY, self.data.r, Math.PI, 2 * Math.PI);
          ctx.lineTo(mX + self.data.s, self.data.cY);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s);
          ctx.lineTo(mX + self.data.s / 2 + self.data.r, self.data.cY + self.data.s);
          ctx.arc(mX + self.data.s / 2, self.data.cY + self.data.s, self.data.r, 2 * Math.PI, Math.PI, true);
          ctx.lineTo(mX, self.data.cY + self.data.s);
          return number;
        case 1:
          //上凸右凹
          ctx.arc(mX + self.data.s / 2, self.data.cY, self.data.r, Math.PI, 2 * Math.PI);
          ctx.lineTo(mX + self.data.s, self.data.cY);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s / 2 - self.data.r);
          ctx.arc(mX + self.data.s, self.data.cY + self.data.s / 2, self.data.r, 1.5 * Math.PI, 0.5 * Math.PI, true);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s);
          ctx.lineTo(mX, self.data.cY + self.data.s);
          return number;
        case 2:
          //上凸左凹
          ctx.arc(mX + self.data.s / 2, self.data.cY, self.data.r, Math.PI, 2 * Math.PI);
          ctx.lineTo(mX + self.data.s, self.data.cY);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s);
          ctx.lineTo(mX, self.data.cY + self.data.s);
          ctx.lineTo(mX, self.data.cY + self.data.s / 2 + self.data.r);
          ctx.arc(mX, self.data.cY + self.data.s / 2, self.data.r, 0.5 * Math.PI, 1.5 * Math.PI, true);
          return number;
        case 3:
          //上凸下凸
          ctx.arc(mX + self.data.s / 2, self.data.cY, self.data.r, Math.PI, 2 * Math.PI);
          ctx.lineTo(mX + self.data.s, self.data.cY);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s);
          ctx.lineTo(mX + self.data.s / 2 + self.data.r, self.data.cY + self.data.s);
          ctx.arc(mX + self.data.s / 2, self.data.cY + self.data.s, self.data.r, 0, Math.PI);
          ctx.lineTo(mX, self.data.cY + self.data.s);
          return number;
        case 4:
          //上凸右凸
          ctx.arc(mX + self.data.s / 2, self.data.cY, self.data.r, Math.PI, 2 * Math.PI);
          ctx.lineTo(mX + self.data.s, self.data.cY);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s / 2 - self.data.r);
          ctx.arc(mX + self.data.s, self.data.cY + self.data.s / 2, self.data.r, 1.5 * Math.PI, 0.5 * Math.PI);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s);
          ctx.lineTo(mX, self.data.cY + self.data.s);
          return number;
        case 5:
          //上凸右凸下凹
          ctx.arc(mX + self.data.s / 2, self.data.cY, self.data.r, Math.PI, 2 * Math.PI);
          ctx.lineTo(mX + self.data.s, self.data.cY);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s / 2 - self.data.r);
          ctx.arc(mX + self.data.s, self.data.cY + self.data.s / 2, self.data.r, 1.5 * Math.PI, 0.5 * Math.PI);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s);
          ctx.lineTo(mX + self.data.s / 2 + self.data.r, self.data.cY + self.data.s);
          ctx.arc(mX + self.data.s / 2, self.data.cY + self.data.s, self.data.r, 2 * Math.PI, Math.PI, true);
          ctx.lineTo(mX, self.data.cY + self.data.s);
          return number;
        case 6:
          //上凸右凸左凹
          ctx.arc(mX + self.data.s / 2, self.data.cY, self.data.r, Math.PI, 2 * Math.PI);
          ctx.lineTo(mX + self.data.s, self.data.cY);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s / 2 - self.data.r);
          ctx.arc(mX + self.data.s, self.data.cY + self.data.s / 2, self.data.r, 1.5 * Math.PI, 0.5 * Math.PI);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s);
          ctx.lineTo(mX, self.data.cY + self.data.s);
          ctx.lineTo(mX, self.data.cY + self.data.s / 2 + self.data.r);
          ctx.arc(mX, self.data.cY + self.data.s / 2, self.data.r, 0.5 * Math.PI, 1.5 * Math.PI, true);
          return number;
        case 7:
          //上凸下凸右凹
          ctx.arc(mX + self.data.s / 2, self.data.cY, self.data.r, Math.PI, 2 * Math.PI);
          ctx.lineTo(mX + self.data.s, self.data.cY);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s / 2 - self.data.r);
          ctx.arc(mX + self.data.s, self.data.cY + self.data.s / 2, self.data.r, 1.5 * Math.PI, 0.5 * Math.PI, true);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s);
          ctx.lineTo(mX + self.data.s / 2 + self.data.r, self.data.cY + self.data.s);
          ctx.arc(mX + self.data.s / 2, self.data.cY + self.data.s, self.data.r, 0, Math.PI);
          ctx.lineTo(mX, self.data.cY + self.data.s);
          return number;
        case 8:
          //上凸左凹右凹
          ctx.arc(mX + self.data.s / 2, self.data.cY, self.data.r, Math.PI, 2 * Math.PI);
          ctx.lineTo(mX + self.data.s, self.data.cY);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s / 2 - self.data.r);
          ctx.arc(mX + self.data.s, self.data.cY + self.data.s / 2, self.data.r, 1.5 * Math.PI, 0.5 * Math.PI, true);
          ctx.lineTo(mX + self.data.s, self.data.cY + self.data.s);
          ctx.lineTo(mX, self.data.cY + self.data.s);
          ctx.lineTo(mX, self.data.cY + self.data.s / 2 + self.data.r);
          ctx.arc(mX, self.data.cY + self.data.s / 2, self.data.r, 0.5 * Math.PI, 1.5 * Math.PI, true);
          return number;
      }
    },
    touchstart:function (e) {
      var self=this;
      console.log("e",e)
      if (self.data.isMatch) return;
      self.data.dX = e.touches[0].pageX;
      self.data.dX1 = e.touches[0].pageX + self.data.width - self.data.s;
      self.data.isDrag = true;
    },
    touchmove:function(e){//触摸移动
      var self = this;
      if (self.data.isDrag) {
        var x = e.touches[0].pageX;
        if (x >= self.data.dX && x <= self.data.dX1) {
          self.data.mX = e.touches[0].pageX - self.data.dX;
        }
        if (x >= self.data.dX1) {
          self.data.isDrag = false;
          self.data.mX = 0;
        }
        self.setData({
          mX:self.data.mX
        })
        self.data.ctx_ceng.clearRect(0, 0, self.data.width, self.data.height);
        self.data.ctx_ceng.lineWidth = 2;
        self.data.ctx_ceng.strokeStyle = '#ffffff';
        self.data.ctx_ceng.save();
        self.data.ctx_ceng.beginPath();
        self.data.ctx_ceng.moveTo(self.data.mX, self.data.cY);
        self.data.ctx_ceng.lineTo(self.data.mX + self.data.s / 2 - self.data.r, self.data.cY);
        self.strockArc(self.data.ctx_ceng, self.data.mX, self.data.n);
        self.data.ctx_ceng.closePath();
        self.data.ctx_ceng.fillStyle = 'green';
        self.data.ctx_ceng.fill();
        self.data.ctx_ceng.stroke();
        self.data.ctx_ceng.clip();
        self.data.ctx_ceng.drawImage(self.data.imageSrc, self.data.mX + 1, self.data.cY - self.data.r, self.data.s + self.data.r + 1, self.data.s + 2 * self.data.r + 1);
        self.data.ctx_ceng.restore();
        self.data.ctx_ceng.draw();
      }
    },
    touchend: function (e) {
      console.log("滑动啊")
      var self=this;
      self.data.isDrag = false;
      if (self.data.mX + 1 <= self.data.cX + 3 && self.data.mX + 1 >= self.data.cX - 3) {
        self.data.isMatch = true;
        self.data.isPass = true;
        self.data.isPassText='验证通过';
        self.hideSilder();
        // self.getData();
      } else {
        self.data.isPass = false;
        self.data.isPassText = '验证失败';
        self.getData();
      }
      self.setData({
        isPassText: self.data.isPassText,
        isPass:self.data.isPass,
        mX: self.data.mX
      })
      self.isPass();
    },
    isPass:function(){
      var self=this;
      var eDetail = {
        isPass: self.data.isPass
      }
      self.triggerEvent('compTouchend', eDetail, { composed: true }); 
    },
    hideSilder:function(){//隐藏验证
      var self = this;
      self.data.isShow='none';
      self.setData({
        isShow: self.data.isShow
      })
    }
  },
  
})

