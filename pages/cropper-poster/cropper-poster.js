import WeCropper from '../../utils/we-cropper/we-cropper.min.js';
const device = wx.getSystemInfoSync(), // 获取设备信息
      width = device.windowWidth,
      height = device.windowHeight;

Page({
  data: {
    userInfo:{},
    cropperOpt: {
      id: 'cropper', // 用于手势操作的canvas组件标识符
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width, // 画布宽度
      height, // 画布高度
      tailoringHeight: 56.4, //裁剪画布高度
      control: 'none', //控制显示
      marTop: 25,
      src: '',
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 250) / 2, // 裁剪框x轴起点
        y: (width - 440) / 2, // 裁剪框y轴起点 (width - 460) / 2
        width: (width/375)*250, // 裁剪框宽度
        height: (width/375) * 460 // 裁剪框高度 (height/480) * 480
      },
      orginType: 'poster'
    },
    uploadFlag: true, //占位状态
    isShare: false, //分享菜单
    posterImg: '', //海报图片
    qrcodeImg: '', //二维码图片
    shareBtnFlag: true, //分享获客按钮状态
    canvasSrc: '', //画布
    originalUrl: '', //原图
    compFlag: false,//组件状态
    
  },
  // 页面onLoad函数中实例化WeCropper
  onLoad: function (options) {
    let self = this;
    self.cropper = new WeCropper(self.data.cropperOpt);
  },
  onShow: function(){
    console.log("设备像素",device)
  },

  // 插件通过touchStart、touchMove、touchEnd方法来接收事件对象。
  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },
  touchClick(){
    let self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        let src = res.tempFilePaths[0]
        self.setData({
          originalUrl: src
        })
        self.cropper.pushOrign(src)
      }
    })
  },
  // 选择图片
  uploadTap() {
    let self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const imageSrc = res.tempFilePaths[0];
        self.setData({
          posterImg: imageSrc,
          originalUrl: imageSrc
        })
        if(imageSrc){
          self.setData({shareBtnFlag: false})
        }
        const {
          cropperOpt
        } = self.data;
        cropperOpt.src = imageSrc;
        self.setData({
          uploadFlag: false,
          "cropperOpt.control": 'block'
        })
        self.cropper = new WeCropper(self.data.cropperOpt)
          .on('ready', (ctx) => {
            console.log(`wecropper is ready for work!`)
          })
          .on('beforeImageLoad', (ctx) => {
            wx.showToast({
              title: '上传中',
              icon: 'loading',
              duration: 3000
            })
          })
          .on('imageLoad', (ctx) => {
            wx.hideToast()
          })
        // self.cropper.pushOrign(imageSrc)
        console.log("上传图片",imageSrc)
        
        
      }
    })
  },
  // 生成图片
  getCropperImage(){
    let self = this;
    self.cropper.getCropperImage(tempFilePath => {
      // tempFilePath 为裁剪后的图片临时路径
      console.log("裁剪地址1",tempFilePath)

      if (tempFilePath) {
        console.log("裁剪地址2",tempFilePath)
        self.setData({
          posterImg: tempFilePath,
          compFlag: true
        })
        // 拿到裁剪后的图片路径的操作
        // wx.uploadFile({
        //   url: `后台上传接口`,
        //   filePath: tempFilePath,
        //   name: 'file',
        //   formData: {
        //     'user': 'test'
        //   },
        //   success: function(res) {
        //     var uploadData = JSON.parse(res.data);
        //     //上传图片到服务器后的地址
        //     var imgPath = uploadData.data[0].file;
        //     self.setData({posterImg: imgPath})
        //     // if(imgPath){
        //     //   self.setData({shareBtnFlag: false})
        //     // }
        //     console.log("上传后路径",imgPath)
        //   }
        // })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  //生成id
  shareSelect() {
    function genID(length){
      return Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
    }
  }
  
})