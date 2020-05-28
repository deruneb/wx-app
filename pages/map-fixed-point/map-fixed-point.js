// pages/map-fixed-point/map-fixed-point.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detaileAddxress: '', //详细地址
    ADDRESS_1_STR: '', //省市区
    chooseAddress:{
      name: '',
      phone: '',
      detailAddress: ''
    }
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
  getMapad: function() {
    var that = this;
    wx.chooseLocation({
      success: function(e) {
        console.log("我是地图",e)
        var regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;  
        var REGION_PROVINCE=[];  
        var addressBean = {  
          REGION_PROVINCE:null,  
          REGION_COUNTRY:null,  
          REGION_CITY:null,  
          ADDRESS:null};  
        function regexAddressBean(address, addressBean){  
            regex = /^(.*?[市州]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;  
            var addxress = regex.exec(address);  
            addressBean.REGION_CITY=addxress[1];  
            addressBean.REGION_COUNTRY=addxress[2];  
            addressBean.ADDRESS=addxress[3]+"("+e.name+")";  
            that.setData({
              detaileAddxress: addxress[3]
            })
            console.log(addxress);  
        }  
        if(!(REGION_PROVINCE = regex.exec(e.address))){  
          regex = /^(.*?(省|自治区))(.*?)$/;  
          REGION_PROVINCE = regex.exec(e.address);  
          addressBean.REGION_PROVINCE= REGION_PROVINCE[1];  
          regexAddressBean(REGION_PROVINCE[3],addressBean);  
        } else {  
          addressBean.REGION_PROVINCE= REGION_PROVINCE[1];  
          regexAddressBean(e.address, addressBean);  
        }  
        that.setData({
          ADDRESS_1_STR: addressBean.REGION_PROVINCE+" "+addressBean.REGION_CITY+""+addressBean.REGION_COUNTRY 
        });  
        console.log("我是地图",e,"省市区",that.data.ADDRESS_1_STR,"详细地址",that.data.detaileAddxress)
      },
      fail: function(t) {},
      complete: function(t) {}
    });
  },

  jumpAddress: function (){
    let self = this;
    wx.chooseAddress({
      success (res) {
        let detail = res.provinceName + res.cityName + res.detailInfo,addressObj = res;
        self.setData({
          'chooseAddress.name': res.userName,
          'chooseAddress.phone': res.telNumber,
          'chooseAddress.detailAddress': detail,
        })
        console.log("地址啊",res)
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})