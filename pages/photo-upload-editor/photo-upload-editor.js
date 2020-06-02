// pages/photo-upload-editor/photo-upload-editor.js
import WeCropper from '../../utils/we-cropper.min.js';
const device = wx.getSystemInfoSync(), // 获取设备信息
      width = device.windowWidth,
      height = device.windowHeight + 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImage: 'https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/b498d003-36f1-421e-baec-41ab02121174.png', //头像路径
    tailoringPhoto: '', //裁剪后的头像
    flag: false, //状态 true显示裁剪界面 false显示界面
    cropperOpt: { //组件配置
      id: 'cropper', // 用于手势操作的canvas组件标识符
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width, // 画布宽度
      height, // 画布高度
      src: '',
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 320) / 2, // 裁剪框x轴起点
        y: (width - 320) / 2, // 裁剪框y轴起点
        width: 320, // 裁剪框宽度
        height: 320 // 裁剪框高度
      }
    }
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
    var photo = wx.getStorageSync('photo');
    this.setData({
      tailoringPhoto: photo
    })
  },

  //更换头像
  switchPhoto: function(e) {
    let self = this;
    //调用微信api
    wx.chooseImage({
      count: 1,//选择数量
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        const src = res.tempFilePaths[0]
        self.setData({
          headImage: src,
          flag: true
        })
        self.initWeCropper(src);
      },
    })
  },
  //实例化WeCropper
  initWeCropper: function (src){
    const {
      cropperOpt
    } = this.data;
    cropperOpt.src = src;
    if (cropperOpt.src) {
      this.cropper = new WeCropper(cropperOpt)
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
    }
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
  // 自定义裁剪页面的布局中，可以重新选择图片
  uploadTap() {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        self.cropper.pushOrign(src)
      }
    })
  },

  // 生成图片
  getCropperImage(){
    wx.showLoading({
      title: '保存中',
    })
    let self = this;
    self.cropper.getCropperImage(tempFilePath => {
      // tempFilePath 为裁剪后的图片临时路径
      console.log("裁剪地址1",tempFilePath)

      if (tempFilePath) {
        console.log("裁剪地址2",tempFilePath)
        // 拿到裁剪后的图片路径的操作(上传操作)
        // wx.uploadFile({
        //   url: `${config.apiGateway}api/assets_service/v1/assets/upload?secret_key=${config.secretKey}&client_type=weapp`,
        //   filePath: tempFilePath,
        //   name: 'file',
        //   formData: {
        //     'user': 'test'
        //   },
        //   success: function(res) {
        //     var uploadData = JSON.parse(res.data);
        //     //上传图片到服务器后的地址
        //     var imgPath = uploadData.data[0].file;
            
        //     console.log("上传后路径",imgPath)

        //   }
        // })
        self.setData({
          tailoringPhoto: tempFilePath,
          flag: false
        })
        wx.setStorage({
          key: 'photo',
          data: tempFilePath
        })
        wx.hideLoading()

      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
})