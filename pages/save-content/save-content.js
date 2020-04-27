// pages/save-content/save-content.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authFlag: true, //授权状态
    imgUrl: 'https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/ca7ce395-b5bd-41cb-9f31-12ee03ffa811.png',
    textCont: '奥利给，没毛病老铁!!!',
    phoneCont: '17609399909'
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

  },
  //保存图片
  saveImg: function (e) {
    let self = this;
    if(self.data.authFlag){
      wx.getSetting({
        success(res) {
            if (!res.authSetting['scope.writePhotosAlbum']){ // 不授权
              wx.downloadFile({
                url: e.currentTarget.dataset.imgsrc,
                success: function (res){
                  console.log("11",res)
                  if(res.statusCode === 200){
                    console.log("22",res)
                    let qrcodeImg = res.tempFilePath;
                    wx.saveImageToPhotosAlbum({
                      filePath: qrcodeImg,
                      success: function(){
                        wx.showToast({
                          title: '保存成功'
                        })
                      },
                      fail: function (err){
                        if(err.errMsg == "saveImageToPhotosAlbum:fail auth deny" || err.errMsg == "saveImageToPhotosAlbum:fail authorize no response"){
                          self.setData({authFlag: false})
                        }
                      }
                    })
                  }
                }
              })
            } else { // 授权
              console.log("授权成功")
              wx.downloadFile({
                url: e.currentTarget.dataset.imgsrc,
                success: function (res){
                  console.log("11",res)
                  if(res.statusCode === 200){
                    console.log("22",res)
                    let qrcodeImg = res.tempFilePath;
                    wx.saveImageToPhotosAlbum({
                      filePath: qrcodeImg,
                      success: function(){
                        wx.showToast({
                          title: '保存成功'
                        })
                      }
                    })
                  }
                }
              })
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
  //复制文字
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  //拨号
  dialNumber: function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
})