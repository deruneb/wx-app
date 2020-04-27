const app = getApp()
const QR = require('../../utils/weapp-qrcode.js')
Page({
  data: {
    motto: 'Hello World',
    qrcodeURL: "",
    codeText: "github.com/Pudon",
    imgPhoto: ''
  },
  onLoad: function () {
    this.drawImg();
  },
  setText: function (e) {
    this.setData({
      codeText: e.detail.value
    })
  },
  drawImg: function () {
    console.log(this.data.codeText);
    var imgData = QR.drawImg(this.data.codeText, {
      typeNumber: 4,
      errorCorrectLevel: 'M',
      size: 500
    })
    this.setData({
      qrcodeURL: imgData
    })
    console.log("二维码",imgData)
  },
  onShow: function(){
    
  }
})
