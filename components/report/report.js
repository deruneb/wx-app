Component({
  /**
   * 组件的属性列表
   */
  properties: { 
    userData: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {
        this.setData({
          paintData: newVal
        })
        console.log("传递", this.data.paintData)
      }
    },
    showModal: {
      type: Boolean,
      value: false
    },
  },
  lifetimes: {
    ready: function() { 
     
      this.buildBossImg();
      wx.$on('drawReport', () => {
        this.buildBossImg();
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgSrc: '',
    coverSaveStatus: 0,
    paintData: {}, //总信息
    rankList: {},
    h5Info: null,
    type: '',
  },
  /**
   * 组件的方法列表
   */
  methods: {
    buildBossImg: function (download) {
      let self = this;

      wx.createSelectorQuery().in(this).select('.canvas_box').fields({
        size: true
      }, (box) => {
        console.log('开始绘图',box);
        let rate = box.width / 580,
          employeeList = [{
            name: '姓名1',
            marketingForce: 1
          },
          {
            name: '姓名2',
            marketingForce: 2
          },
          {
            name: '姓名3',
            marketingForce: 3
          }],
          customerList = [{
            nickname: '姓名4',
            marketingForce: 4
          },
          {
            nickname: '姓名5',
            marketingForce: 5
          },
          {
            nickname: '姓名6',
            marketingForce: 6
          }],
          paintData = self.data.paintData;
        let
          qrcodeInfo = {
            source: null,
            size: {
              width: 75,
              height: 75
            }
          };
        const ctx = wx.createCanvasContext('canvas_cover', this);
        function fillText(ctx, str, fontSize, color, x, y) {
          ctx.setTextBaseline('top');
          ctx.setFontSize(fontSize);
          ctx.setFillStyle(color);
          // ctx.fillText(str, x, y);

          let maxWidth = box.width - x,
            maxLength = Math.floor(maxWidth / fontSize);

          if (str.length <= maxLength) {
            ctx.fillText(str, x, y, maxWidth);
          } else {
            ctx.fillText(str.substring(0, maxLength - 3) + '...', x, y, maxWidth);
          }
        }

        Promise.all([
          new Promise((resolve, reject) => {
            wx.getImageInfo({
              src: 'https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/miniapp/canvas-bg.png',
              success: resolve,
              fail: reject
            })
            // resolve('/images/report_img2.png');
          }),
          new Promise((resolve, reject) => {
            wx.getImageInfo({
              src: 'https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/10adb0de-ea39-4e36-9dd1-38e7cd0dd83e.png',
              success: resolve,
              fail: reject
            })
            // resolve('/images/report_img2.png');
          })
        ]).then((result) => {
          qrcodeInfo.source = result[1];
          ctx.drawImage(result[0].path, 0, 0, 580 * rate, 534 * rate); //绘制背景
          // 绘制小程序码
          ctx.drawImage(qrcodeInfo.source.path, 21 * rate, 130 * rate, qrcodeInfo.size.width, qrcodeInfo.size.width);
          fillText(ctx, '扫码参加本活动', 20 * rate, '#3C4A55', 25 * rate, 280 * rate);
          fillText(ctx, '累计总人数', 20 * rate, '#3C4A55', 243 * rate, 31 * rate);
          ctx.setFontSize(40 * rate);
          let target_left = ctx.measureText(String(self.convertJoinCount(paintData.userCount))).width / 2,
            textWidth = target_left.toFixed(1);
          console.log("字体宽度", target_left, "222", textWidth, "计算", (box.width / 2) - textWidth)
          fillText(ctx, `${self.convertJoinCount(paintData.userCount)}`, 40 * rate, '#24D0C6', (box.width / 2) - textWidth, 56 * rate);

          fillText(ctx, '总投入', 20 * rate, '#3C4A55', 190 * rate, 150 * rate);
          fillText(ctx, `￥${self.convertJoinCount(paintData.totalInvestment)}`, 20 * rate, '#FA766B', 290 * rate, 150 * rate);
          fillText(ctx, '总收入', 20 * rate, '#3C4A55', 395 * rate, 150 * rate);
          fillText(ctx, `${self.convertJoinCount(paintData.totalForwardCount)}`, 20 * rate, 'rgba(36,208,198,1)', 490 * rate, 150 * rate);

          fillText(ctx, '总浏览', 20 * rate, '#3C4A55', 190 * rate, 195 * rate);
          fillText(ctx, `${self.convertJoinCount(paintData.totalBrowseCount)}`, 20 * rate, 'rgba(36,208,198,1)', 310 * rate, 195 * rate);
          fillText(ctx, '总客户', 20 * rate, '#3C4A55', 395 * rate, 195 * rate);
          fillText(ctx, `${self.convertJoinCount(paintData.totalUserCount)}`, 20 * rate, 'rgba(36,208,198,1)', 490 * rate, 195 * rate);

          fillText(ctx, '在线时长', 20 * rate, '#3C4A55', 190 * rate, 240 * rate);
          fillText(ctx, `${(paintData.totalAccessTimeCount)}min`, 20 * rate, 'rgba(36,208,198,1)', 300 * rate, 240 * rate);
          fillText(ctx, '总打赏', 20 * rate, '#3C4A55', 395 * rate, 240 * rate);
          fillText(ctx, `${self.convertJoinCount(paintData.totalServiceCount)}`, 20 * rate, 'rgba(36,208,198,1)', 490 * rate, 240 * rate);

          fillText(ctx, '排行榜', 21 * rate, '#3C4A55', 40 * rate, 330 * rate);
          fillText(ctx, '打赏榜', 21 * rate, '#3C4A55', 310 * rate, 330 * rate);
          // 员工排行
          fillText(ctx, `${!!employeeList[0] ? (employeeList[0].name || employeeList[0].nickname) : '暂无'}`, 21 * rate, '#3C4A55', 95 * rate, 385 * rate);
          fillText(ctx, `${!!employeeList[0] ? self.convertJoinCount(employeeList[0].marketingForce) + '分' : '0分'}`, 21 * rate, '#F68411', 195 * rate, 385 * rate);

          fillText(ctx, `${!!employeeList[1] ? (employeeList[1].name || employeeList[1].nickname) : '暂无'}`, 21 * rate, '#3C4A55', 95 * rate, 432 * rate);
          fillText(ctx, `${!!employeeList[1] ? self.convertJoinCount(employeeList[1].marketingForce) + '分' : '0分'}`, 21 * rate, '#F68411', 195 * rate, 432 * rate);

          fillText(ctx, `${!!employeeList[2] ? (employeeList[2].name || employeeList[2].nickname) : '暂无'}`, 21 * rate, '#3C4A55', 95 * rate, 479 * rate);
          fillText(ctx, `${!!employeeList[2] ? self.convertJoinCount(employeeList[2].marketingForce) + '分' : '0分'}`, 21 * rate, '#F68411', 195 * rate, 479 * rate);
          // 客户排行
          fillText(ctx, `${!!customerList[0] ? customerList[0].nickname : '暂无'}`, 21 * rate, '#3C4A55', 360 * rate, 385 * rate);
          fillText(ctx, `${!!customerList[0] ? self.convertJoinCount(customerList[0].marketingForce) + '分' : '0分'}`, 21 * rate, '#F68411', 465 * rate, 385 * rate);

          fillText(ctx, `${!!customerList[1] ? customerList[1].nickname : '暂无'}`, 21 * rate, '#3C4A55', 360 * rate, 434 * rate);
          fillText(ctx, `${!!customerList[1] ? self.convertJoinCount(customerList[1].marketingForce) + '分' : '0分'}`, 21 * rate, '#F68411', 465 * rate, 434 * rate);

          fillText(ctx, `${!!customerList[2] ? customerList[2].nickname : '暂无'}`, 21 * rate, '#3C4A55', 360 * rate, 481 * rate);
          fillText(ctx, `${!!customerList[2] ? self.convertJoinCount(customerList[2].marketingForce) + '分' : '0分'}`, 21 * rate, '#F68411', 465 * rate, 481 * rate);

          ctx.draw(true, setTimeout(() => {
            self.saveImage();
          }, 1000));
        })
      }).exec();
      
    },
    saveImage: function() {
      let self = this;
      wx.createSelectorQuery().in(this).select('.canvas_box').fields({
        size: true
      }, (box) => {
        wx.canvasToTempFilePath({
          fileType: "png",
          destWidth: box.width * 6,
          destHeight: box.height * 6,
          canvasId: 'canvas_cover',
          success: (res) => {
            self.data.imgSrc = res.tempFilePath;
            wx.hideLoading();
          }
        }, self)

      }).exec();
    },
    // 下载图片
    downloadImg: function() {
      let self = this;
      wx.showLoading({
        title: '图片下载中'
      });
      wx.saveImageToPhotosAlbum({
        filePath: self.data.imgSrc,
        success: (res) => {
          self.setData({
            coverSaveStatus: 1 
          });
          wx.hideLoading();
          wx.showToast({
            title: "图片下载成功"
          })
        },
        fail: (err) => {
          wx.hideLoading();
          self.toast.fail({
            title: "图片下载失败"
          });
          console.error("图片下载失败", err);
          self.setData({
            coverSaveStatus: 2
          });
        }
      }, self);
    },
    // 授权使用保存到相册功能回调
    saveImg: function() {
      this.setData({
        coverSaveStatus: 1
      });
      this.downloadImg();
    },
    closeModal: function() {
      this.setData({
        showModal: false,
        coverSaveStatus: 0
      });
      this.triggerEvent('parentEvent', false); //myevent自定义名称事件，父组件中使用
    },
    //参与数的数值范围为0到9999，超过9999时记作1w+，超过19999时记作2w+，以此类推，最高99w+；
    convertJoinCount:function(num) {
      num = Number(num);
      if (isNaN(num)) {
        return 0;
      }
      let w = (num / 10000);
      if (w > 99) {
        w = 99;
      }
      if (w >= 1) {
        w = Math.floor(w)
        return w + 'w+';
      }
      return num;
    }
  }
})