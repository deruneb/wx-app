// pages-cat/cat-strategy-edit/cat-strategy-edit.js
const utils = require('../../utils/util.js'),
  db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverImg: '', //封面图片
    coverHeight: '', //封面高度
    coverTime: '', //攻略创建时间
    coverTitle: '', //标题
    detail: '', //详情文字
    detailImg: [], //详情图片
    currentDate: '请选择', //当前时间
    listLength: null, //已有数据长度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      listLength: Number(options.listLength) 
    })
    console.log("长度啊",this.data.listLength,"ceshiceshiceshi",ceshi)
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setData({coverImg: ''})
  },

  //上传封面
  uploadImg: function (){
    let self = this;
    utils.getFileId((fileid)=>{
      self.setData({
        coverImg: fileid
      })
      console.log("fileid",fileid)
    })
  },

  //详情图片
  uploadMoreImg: function (){
    let self = this;
    utils.getMoreFileId((moreFile)=>{
      self.setData({
        detailImg: moreFile
      })
      console.log("多图啊",moreFile)
    })
  },

  //监听input值
  changeValue: function (e){
    let type = e.currentTarget.dataset.type,
      value = e.detail.value;
    switch (type){
      case 'coverheight':
        this.setData({
          coverHeight: Number(value)
        })  
      break;
      case 'covertitle':
        this.setData({
          coverTitle: value
        })  
      break;
      case 'covertime':
        this.setData({
          coverTime: value
        })  
        break;
      case 'detail':
        this.setData({
          detail: value
        })
        break;
    }
    console.log("eee",e)
  },

  //获取当前选择日期
  changeDate:function(e){
    var date = e.detail.value;
    this.setData({
      currentDate:date
    })
  },

  //保存设置
  saveStrategy: function (){
    let self = this,tipsNum = this.data.listLength += 1;
    if(!self.data.coverImg){
      wx.showToast({
        icon: 'none',
        title: '封面图片不能为空!',
      })
      return
    }
    if(!self.data.coverHeight){
      wx.showToast({
        icon: 'none',
        title: '封面图片高度不能为空!',
      })
      return
    }
    if(!!self.data.coverHeight && self.data.coverHeight < 200){
      wx.showToast({
        icon: 'none',
        title: '封面图片高度不能低于200!',
      })
      return
    }
    if(!self.data.coverTime){
      wx.showToast({
        icon: 'none',
        title: '攻略创建时间不能为空!',
      })
      return
    }
    if(!self.data.coverTitle){
      wx.showToast({
        icon: 'none',
        title: '攻略标题不能为空!',
      })
      return
    }
    if(!self.data.detail){
      wx.showToast({
        icon: 'none',
        title: '攻略详情不能为空!',
      })
      return
    }
    db.collection('strategy-list').add({
      data:{
        id: tipsNum,
        coverImg: self.data.coverImg,
        coverTitle: self.data.coverTitle,
        coverHeight: self.data.coverHeight,
        coverTime: self.data.currentDate,
        coverWidth: 350, 
        detail: self.data.detail,
        detailImg: self.data.detailImg,
        userName: getApp().globalData.userInfo.nickName || '未授权的热心网友',
        userPhoto: getApp().globalData.userInfo.avatarUrl || 'https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/45a1703d-ea27-48d1-8c3e-d09614bc31ad.jpg'
      },
      success: res=>{
        wx.showToast({
          icon: 'none',
          title: '保存成功，奥利给!',
        })
        setTimeout(()=>{
          wx.navigateBack({
            detail: 1,
          })
        },1000)
      }
    })
  }
})