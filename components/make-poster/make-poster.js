// components/make-poster/make-poster.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    posterImg:{ //海报图片
      type: String
    },
    posterClose: { //分享蒙层关闭状态
      type: Boolean,
      value: true
    },
    sourceType:{ //来源 
      type: String,
      value: ''
    }
  }, 
  ready(){
    this.createImg();
    console.log("海报图片",this.data.posterImg)

    console.log("this.data.sourceType",this.data.sourceType)
  },
  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {
      name: '王氏小本本',
      job: '功能库集合',
      company: 'DR:wy',
      phone: 'qq953727948'
    }, //个人信息
    // posterImg: '', //海报图片
    canvasSrc: '', //画布
    posterItem: {}, //海报模板数据
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //创建画布
    createImg() {
      let self = this,
      canvasContainer = {
        width: 250,
        height: 575
      },
      qrcodeSize = {
        width: 81,
        height: 81
      };
      wx.createSelectorQuery().in(this).select('.canvas_cover').fields({
        size: true,
      },(canvasBox)=>{
        const ctx = wx.createCanvasContext('canvas_cover', this);
        console.log("canvasBoxcanvasBoxcanvasBox",canvasBox)
        let widthRate = canvasBox.width / 250;
        let imgUrls = [];
        imgUrls.push(self.data.posterImg,'https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/05c15fcf-a290-4e4c-8fc1-6d9d99a12b0a.jpg')
        let name = self.data.userInfo.name,job = self.data.userInfo.job,compay = self.data.userInfo.company;
        let nameStr = name.length > 5 ? name.substring(0, 4)+'...':name,
          jobStr = job.length >10 ? job.substring(0, 9)+'...':job,
          compayStr = compay.length >10 ? compay.substring(0, 9)+'...':compay;
        console.log("canvasBox",canvasBox,"imgUrls",imgUrls)
        //设置底色
        ctx.setFillStyle('white');
        //创建盒子
        ctx.fillRect(0,0,canvasBox.width,canvasBox.height);
        let imgUrlsFn = self.downloadFileImg(imgUrls);
        imgUrlsFn.then((res)=>{
          console.log("本地海报",res)
          //绘制海报图片到画布
          ctx.drawImage(res[0],0,0,canvasBox.width,widthRate*480);
          //绘制二维码
          ctx.drawImage(res[1],160*widthRate,488*widthRate,qrcodeSize.width,qrcodeSize.height);
          
          //姓名电话
          ctx.setFontSize(12);
          ctx.setFillStyle('#3C4A55');
          ctx.fillText(nameStr, (10 / canvasContainer.width * canvasBox.width), (502 / canvasContainer.height * canvasBox.height));
          if(compayStr){
            ctx.fillText(self.data.userInfo.phone, (80 / canvasContainer.width * canvasBox.width), (502 / canvasContainer.height * canvasBox.height));
          }
          //职位
          if(compayStr){
            ctx.setFillStyle('#B1BFCD');
            ctx.fillText(jobStr, (10 / canvasContainer.width * canvasBox.width), (522 / canvasContainer.height * canvasBox.height));
          }else{
            ctx.fillText(self.data.userInfo.phone, (10 / canvasContainer.width * canvasBox.width), (522 / canvasContainer.height * canvasBox.height));
          }
          
          //分割线
          ctx.beginPath()
          ctx.setStrokeStyle('#DDE4EB')
          ctx.moveTo(10, (535 / canvasContainer.height * canvasBox.height))
          ctx.lineTo(150, (535 / canvasContainer.height * canvasBox.height))
          ctx.stroke()
          //公司
          if(compayStr){
            ctx.fillText(compayStr, (10 / canvasContainer.width * canvasBox.width), (555 / canvasContainer.height * canvasBox.height));
          }
          ctx.draw(true, setTimeout(()=>{
            self.saveImage();
          },1000));
        })
        
      }).exec();

    },
    //转化为本地图片
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
    //导出画布
    saveImage() {
      let self = this;
      wx.createSelectorQuery().in(this).select('.canvas_cover').fields({
        size: true,
      }, (box) => {
        wx.canvasToTempFilePath({
          fileType: "png",
          destWidth: box.width * 750 / wx.getSystemInfoSync().windowWight,
          destHeight: box.height * 750 / wx.getSystemInfoSync().windowWight,
          canvasId: 'canvas_cover',
          success: (res) => {
            // self.setData({
            //   canvasSrc: res.tempFilePath
            // })
            console.log("生成画布",res)
            let canvasSrc = res.tempFilePath;
            //保存到相册
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: (res)=>{
                self.setData({
                  isShare: false,
                })
                wx.showToast({
                  title: '保存成功',
                  icon: 'none'
                })
              },
              fail: (err) => {
                wx.showToast({
                  title: '保存失败!',
                  icon: 'none'
                })
              },
              complete: ()=>{
                wx.hideLoading();
              }
            },self)
            console.log("canvasSrc",res.tempFilePath)
          },
          fail: ()=>{
            console.log("导出失败！")
          }
        }, self)
      }).exec();
    }
  },
  
})
