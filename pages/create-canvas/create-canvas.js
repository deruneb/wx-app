// pages/create-canvas/create-canvas.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authFlag: true, //保存授权状态
    rankingData:[ //本页面canvas
      {
        name: '张三',
        marketing_power: '1',
        face: 'https://wx.qlogo.cn/mmopen/vi_32/CbOT6xnMCd98xCk3leD1C46A3ic8lHgZyN4xIa5b1d6wb0oLN7fic53OFsH1MTeibdH4q9JsE8qyaXuVF8f9qickuw/132'
      },
      {
        name: '李四',
        marketing_power: '2',
        face: 'https://wx.qlogo.cn/mmopen/vi_32/CbOT6xnMCd98xCk3leD1C46A3ic8lHgZyN4xIa5b1d6wb0oLN7fic53OFsH1MTeibdH4q9JsE8qyaXuVF8f9qickuw/132'
      },
      {
        name: '王麻子',
        marketing_power: '3',
        face: 'https://wx.qlogo.cn/mmopen/vi_32/CbOT6xnMCd98xCk3leD1C46A3ic8lHgZyN4xIa5b1d6wb0oLN7fic53OFsH1MTeibdH4q9JsE8qyaXuVF8f9qickuw/132'
      }
    ],
    dataInfo: { //组件canvas
      userCount: "100", //总获客
      totalInvestment: "1", //总投入
      totalBrowseCount: "1", //总浏览
      totalAccessTimeCount: "1", //总访问（浏览）时长
      totalForwardCount: "2", //总转发
      totalUserCount: "3", //总客户
      totalServiceCount: "4" //总预约
    }, 
    showModal: false,
    localFlag: false,
    cardFlag: false
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //本页面
  localImg(e) {
    this.setData({localFlag: true});
    wx.showLoading({
      title: '排行榜生成中'
    });
    let self = this;
    //拒绝授权后重新调起授权
    if(self.data.authFlag){
      wx.getSetting({
        success(res) {
            if (!res.authSetting['scope.writePhotosAlbum']){ // 不授权
              self.buildImg(true);            
            } else { // 授权
              console.log("授权成功")
              self.buildImg(true);
            }
        }
      })
    }else{
      wx.openSetting({
        success(res){
          console.log("open",res)
          if(res.authSetting['scope.writePhotosAlbum']){
            self.setData({authFlag: true})
          }
        }
      })
    }
  },
  downloadFileImg(url) {
    return Promise.all(url.map(url => {
      return new Promise((resolve, reject) => wx.downloadFile({
        url: url,
        success: function(res) {
          if (res.statusCode === 200) {
            var avaterSrc = res.tempFilePath;
            resolve(avaterSrc);
          }
        },
        fail: reject
      }));
    }));
  },
  // 授权使用保存到相册功能回调
  saveImg: function() {
    this.setData({
      coverSaveStatus: 1
    });
    this.saveImage();
  },
  buildImg() {
    let self = this
    let canvasContainer = { //canvas容器的rpx尺寸
      width: 750,
      height: 377
    };
    wx.createSelectorQuery().select('.canvas_cover').fields({
      size: true,
    }, (box) => {
      const ctx = wx.createCanvasContext('canvas_cover');
      var defult = "https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/miniapp/logo-white.png";
      // 设置底色
      ctx.setFillStyle('white');
      ctx.fillRect(0, 0, box.width, box.height);

      let imgUrls = ['https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/miniapp/reward_bg.png']
      let rankData = JSON.parse(JSON.stringify(self.data.rankingData))

      rankData.forEach(item => {
        if (!!item.wx_face && item.wx_face.indexOf('thirdwx') !== -1) {
          item.newPhoto = item.wx_face.replace('http', 'https') || item.face.replace('http', 'https');
        } else {
          item.newPhoto = item.face || item.wx_face
        }
        imgUrls.push(item.newPhoto || "https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/miniapp/icon-default-photo.png")
      })
      var imgUrlsFn = self.downloadFileImg(imgUrls);
      imgUrlsFn.then(res => {
        ctx.drawImage(res[0], 0, 0, box.width, box.height);
        //画圆点
        ctx.beginPath();
        ctx.strokeStyle = "#ffffff";
        ctx.arc(251 / canvasContainer.width * box.width, 34, 4, 0, 2 * Math.PI);
        ctx.fillRect(255 / canvasContainer.width * box.width, 34, 51, 1);
        ctx.fillRect(450 / canvasContainer.width * box.width, 34, 51, 1);
        ctx.arc(500 / canvasContainer.width * box.width, 34, 4, 0, 2 * Math.PI);

        ctx.fill();

        function fillTextFn(str, fontSize, fontColor, startX, startY) {
          let maxWidth = box.width - startX,
            maxLength = Math.floor(maxWidth / fontSize);

          ctx.setTextBaseline('top');
          ctx.setFontSize(fontSize);
          ctx.setTextAlign('center');
          ctx.setFillStyle(fontColor);
          if (str.length <= maxLength) {
            ctx.fillText(str, startX, startY, maxWidth);
          } else {
            ctx.fillText(str.substring(0, maxLength - 3) + '...', startX, startY, maxWidth);
          }
        }
        //标题
        fillTextFn('排行榜', (24 / canvasContainer.width * box.width), '#ffffff', (379 / canvasContainer.width * box.width), (20 / canvasContainer.height * box.height));

        fillTextFn(`2020/4/23更新`, (16 / canvasContainer.width * box.width), '#ffffff', (379 / canvasContainer.width * box.width), (62 / canvasContainer.height * box.height));
        // 排行
        if (res.length > 2) {
          //绘制圆
          ctx.save();
          ctx.beginPath();
          ctx.arc(140, 210, 140 / 2, 0, 2 * Math.PI);
          ctx.setFillStyle('#FFFFFF')
          ctx.fill();
          ctx.beginPath()
          ctx.arc(140, 210, 130 / 2, 0, 2 * Math.PI)
          ctx.setStrokeStyle('#FFFFFF')
          ctx.stroke();
          ctx.clip();
          ctx.drawImage((res[2] == null || res[2] == "") ? defult : res[2],
            65, 140, 150, 150
          );
          ctx.restore();
          ctx.drawImage('../../images/icon-num2.png',
            175, 253, 32, 40
          );
          fillTextFn(self.data.rankingData[1].name, (16 / canvasContainer.width * box.width), '#ffffff', (138 / canvasContainer.width * box.width), (316 / canvasContainer.height * box.height));
          fillTextFn(`${self.convertJoinCount(self.data.rankingData[1].marketing_power)}分`, (26 / canvasContainer.width * box.width), '#FFFF00', (138 / canvasContainer.width * box.width), (338 / canvasContainer.height * box.height));
        }

        if (res.length > 1) {
          // 绘制圆图 
          ctx.save(); //保存上下文
          ctx.beginPath(); //开始绘制
          ctx.arc(380, 175, 160 / 2, 0, 2 * Math.PI);
          ctx.setFillStyle('#FFFFFF')
          ctx.fill(); //填充
          ctx.beginPath();
          ctx.arc(380, 175, 150 / 2, 0, 2 * Math.PI)
          ctx.setStrokeStyle('#FFFFFF') //填充色
          ctx.stroke() //画出当前路径边框
          ctx.clip(); //裁剪 (保存上下文的原因，否则之后的绘制会限制在裁剪区域))
          ctx.drawImage((res[1] == null || res[1] == "") ? defult : res[1],
            295, 90, 170, 170
          );
          ctx.restore(); //恢复之前保存的绘图上下文,可以接着后续绘制
          ctx.drawImage('../../images/icon-num1.png',
            407, 225, 32, 40
          );
          fillTextFn(self.data.rankingData[0].name, (16 / canvasContainer.width * box.width), '#ffffff', (380 / canvasContainer.width * box.width), (299 / canvasContainer.height * box.height));
          fillTextFn(`${self.convertJoinCount(self.data.rankingData[0].marketing_power)}分`, (26 / canvasContainer.width * box.width), '#FFFF00', (380 / canvasContainer.width * box.width), (324 / canvasContainer.height * box.height));
        }

        if (res.length > 3) {
          //绘制圆
          ctx.save();
          ctx.beginPath();
          ctx.arc(613, 210, 140 / 2, 0, 2 * Math.PI);
          ctx.setFillStyle('#FFFFFF')
          ctx.fill();
          ctx.beginPath()
          ctx.arc(613, 210, 130 / 2, 0, 2 * Math.PI)
          ctx.setStrokeStyle('#FFFFFF')
          ctx.stroke();
          ctx.clip();
          ctx.drawImage((res[3] == null || res[3] == "") ? defult : res[3],
            538, 140, 150, 150
          );
          ctx.restore();
          ctx.drawImage('../../images/icon-num3.png',
            647, 253, 32, 40
          );
          fillTextFn(self.data.rankingData[2].name, (16 / canvasContainer.width * box.width), '#ffffff', (615 / canvasContainer.width * box.width), (316 / canvasContainer.height * box.height));
          fillTextFn(`${self.convertJoinCount(self.data.rankingData[2].marketing_power)}分`, (26 / canvasContainer.width * box.width), '#FFFF00', (620 / canvasContainer.width * box.width), (338 / canvasContainer.height * box.height));
        }
        ctx.draw(true, () => {
          // if (download)
          self.saveImage();
        });
      })
    }).exec();
  },
  // 保存到相册
  saveImage: function() {
    let self = this
    wx.createSelectorQuery().select('.canvas_cover').fields({
      size: true,
    }, (box) => {
      wx.canvasToTempFilePath({
        fileType: "png",
        width: box.width, //导出图片的宽
        height: box.height, //导出图片的高
        destWidth: box.width,
        destHeight: box.height,
        canvasId: 'canvas_cover',
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              self.setData({
                coverSaveStatus: 1
              });
              wx.hideLoading();
              wx.showToast({
                title: "图片下载成功",
              })
            },
            fail: (err) => {
              wx.hideLoading();
              console.error("图片下载失败", err);
              //未授权状态设置
              if(err.errMsg == "saveImageToPhotosAlbum:fail auth deny" || err.errMsg == "saveImageToPhotosAlbum:fail authorize no response"){
                self.setData({authFlag: false})
              }
              self.setData({
                coverSaveStatus: 2
              });
            }
          })
        },
        fail: (err => {
          console.log(err)
        })
      })
    }).exec();
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
  },

  //组件canvas
  downloadImg() {
    wx.showLoading({
      title: '报表生成中',
    })
    this.setData({
      showModal: true
    });
    setTimeout(() => {
      wx.$emit('drawReport');
    });
  },
  parentEvent(data) {
    this.setData({
      showModal: false
    });
  },

  //生成名片
  cardImg(){
    wx.showLoading({
      title: '名片图片下载中'
    });
    this.setData({cardFlag: true});
    let self = this;
    //拒绝授权后重新调起授权
    if(self.data.authFlag){
      wx.getSetting({
        success(res) {
            if (!res.authSetting['scope.writePhotosAlbum']){ // 不授权
              self.cardBuildImg(true);
            } else { // 授权
              console.log("授权成功")
              self.cardBuildImg(true);
            }
        }
      })
    }else{
      wx.openSetting({
        success(res){
          console.log("open",res)
          if(res.authSetting['scope.writePhotosAlbum']){
            self.setData({authFlag: true})
          }
        }
      })
    }
   
  },
   //生成名片图片
  cardBuildImg: function (download) {
     // https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/fcf36563-6e89-46a2-a354-849cb5a01c90.png
     //https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/ca7ce395-b5bd-41cb-9f31-12ee03ffa811.png
    let companyLogo = 'https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/ca7ce395-b5bd-41cb-9f31-12ee03ffa811.png', 
    wxCompanyLogo = '',self = this;
    let canvasContainer = {//canvas容器的rpx尺寸
      width: 720,
      height: 900
    };
    wx.createSelectorQuery().select('.cover_box1').fields({
      size: true,
    }, (box) => {
      let
        qrcodeInfo = {//小程序码
          source: null,
          size: {
            rateW: 300 / canvasContainer.width,  
            rateH: 300 / canvasContainer.height
          }
        };
      Promise.all([
        // 小程序码
        new Promise((resolve, reject) => {
          wx.getImageInfo({
            src: 'https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/d8b2b320-0fbc-4972-9879-2ed6e2cde2ef.jpg',
            success: resolve,
            fail: reject
          })
        }),
        // 商家logo
        new Promise((resolve,reject) => {
          wx.getImageInfo({
            src: companyLogo,
            success: resolve,
            fail: reject
          })
        })
      ])
      .then((result) => {
        qrcodeInfo.source = result[0].path;
        wxCompanyLogo = result[1].path;
        const ctx = wx.createCanvasContext('canvas_cover1');
        // 设置底色
        ctx.setFillStyle('white');
        ctx.fillRect(0, 0, box.width, box.height);
        
        // 绘制背景
        ctx.drawImage('https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/miniapp/offlinecashprize-bg.png',
          0, 0, box.width, box.height * 0.31
        );
        ctx.arc(box.width / 2, 230 / canvasContainer.height * box.height, qrcodeInfo.size.rateW * box.width / 2, 0, 2 * Math.PI);
        ctx.fill();

        // 绘制小程序码
        ctx.drawImage(qrcodeInfo.source,
          211 / canvasContainer.width * box.width ,
          83 / canvasContainer.height * box.height,
          qrcodeInfo.size.rateW * box.width,
          qrcodeInfo.size.rateH * box.height
        );
        console.log("计算X", 362 / canvasContainer.width * box.width, "1", box.width, "计算Y", 234 / canvasContainer.height * box.height, "2", box.height, "圆半径", 148 / canvasContainer.width * box.width)
        // 绘制圆图 
        ctx.save(); //保存上下文
        ctx.beginPath(); //开始绘制
        ctx.arc(362 / canvasContainer.width * box.width, 234 / canvasContainer.height * box.height, 68 / canvasContainer.width * box.width, 0, 2 * Math.PI);
        ctx.setFillStyle('#FFFFFF')
        ctx.fill(); //填充
        ctx.beginPath();
        ctx.arc(362 / canvasContainer.width * box.width, 234 / canvasContainer.height * box.height, 68 / canvasContainer.width * box.width, 0, 2 * Math.PI)
        ctx.setStrokeStyle('#FFFFFF') //填充色
        ctx.stroke() //画出当前路径边框
        ctx.clip(); //裁剪 (保存上下文的原因，否则之后的绘制会限制在裁剪区域))
        ctx.drawImage(wxCompanyLogo,
          290 / canvasContainer.width * box.width, 164 / canvasContainer.height * box.height, 148 / canvasContainer.width * box.width, 148 / canvasContainer.height * box.height
        );
        ctx.restore(); //恢复之前保存的绘图上下文,可以接着后续绘制
        function fillTextFn(str, fontSize, fontColor, startX, startY){
            let maxWidth = box.width - startX,
            maxLength = Math.floor(maxWidth / fontSize);
          ctx.setTextBaseline('top');
          ctx.setFontSize(fontSize);
          ctx.setTextAlign('left');
          ctx.setFillStyle(fontColor);
          if (str.length <= maxLength) {
            ctx.fillText(str, startX, startY, maxWidth);
          } else {
            ctx.fillText(str.substring(0, maxLength - 3) + '...', startX, startY, maxWidth);
          }
        }
        // 绘制名片文字内容
        fillTextFn('昵称', (36 / canvasContainer.width * box.width), '#000000', (50 / canvasContainer.width * box.width), (440 / canvasContainer.height * box.height));
        fillTextFn('职位', (24 / canvasContainer.width * box.width), '#999999', (50 / canvasContainer.width * box.width), (495 / canvasContainer.height * box.height));

        function drawIconFn(path, startyPoint) { //小图标绘制
          ctx.drawImage(path,
            (50 / canvasContainer.width * box.width),
            (startyPoint / canvasContainer.height * box.height),
            (35 / canvasContainer.width * box.width),
            (35 / canvasContainer.height * box.height)
          );
        }
        drawIconFn('../../images/card-company.png', 570);
        drawIconFn('../../images/card-phone.png', 626);
        drawIconFn('../../images/card-email.png', 683);

        fillTextFn('公司', (28 / canvasContainer.width * box.width), '#555555', (95 / canvasContainer.width * box.width), (572 / canvasContainer.height * box.height));
        fillTextFn('电话', (28 / canvasContainer.width * box.width), '#555555', (95 / canvasContainer.width * box.width), (628 / canvasContainer.height * box.height));
        fillTextFn('邮箱', (28 / canvasContainer.width * box.width), '#555555', (95 / canvasContainer.width * box.width), (683 / canvasContainer.height * box.height));
        fillTextFn('扫一扫小程序码，面对面递名片', (24 / canvasContainer.width * box.width), '#999999', (194 / canvasContainer.width * box.width), (829 / canvasContainer.height * box.height));

        ctx.setLineDash([(5 / canvasContainer.width * box.width), (5 / canvasContainer.width * box.width)]); 
        ctx.lineWidth = (4 / canvasContainer.width * box.width); 
        ctx.strokeStyle = '#999999'; 
        ctx.beginPath(); 
        ctx.moveTo((20 / canvasContainer.width * box.width), (776 / canvasContainer.height * box.height)); 
        ctx.lineTo((704 / canvasContainer.width * box.width), (776 / canvasContainer.height * box.height)); 
        ctx.stroke();

        ctx.draw(true, () => {
          if (download)
          self.saveCardImage();
        });
      }).catch(self.errMessage);
    }).exec();
  },
  //保存到相册
  saveCardImage: function () {
    let self = this;
    wx.createSelectorQuery().select('.cover_box1').fields({
      size: true,
    }, (box) => {
      wx.canvasToTempFilePath({
        fileType: "png",
        width: box.width, //导出图片的宽
        height: box.height, //导出图片的高
        destWidth: box.width * 750 / wx.getSystemInfoSync().windowWight,
        destHeight: box.height * 750 / wx.getSystemInfoSync().windowWight,
        canvasId: 'canvas_cover1',
        success: (res) => {
          // self.setData({
          //   ceshi: res.tempFilePath
          // })
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => { 
              wx.hideLoading();
              wx.showToast({
                title: '图片下载成功',
              })
              self.setData({
                coverSaveStatus: 1,
                isShare: false
              });
            },
            fail: (err) => {
              wx.hideLoading();
              console.error("图片下载失败", err);
              self.setData({
                coverSaveStatus: 2
              });
              if(err.errMsg == "saveImageToPhotosAlbum:fail auth deny" || err.errMsg == "saveImageToPhotosAlbum:fail authorize no response"){
                self.setData({authFlag: false})
              }
            }
          })
        },
        fail: self.errMessage
      })
    }).exec();
  },
  //下载图片
  downloadCard: function(){
    wx.showLoading({
      title: '名片图片下载中'
    });
    this.cardBuildImg(true);
  },
  //授权使用保存到相册功能回调
  saveCardImg: function(){
    this.setData({
      coverSaveStatus: 1
    });
    this.downloadCard();
  },
  errMessage: function (err) {
    wx.hideLoading();
    console.error(err,'生成图片失败');
  },
})