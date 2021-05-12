// pages/photo-album/photo-album.js
const db = wx.cloud.database();
const utils = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgArr: [],
    flag: true,
    photoFlag: true,
    sizeFlag: true, //false-大图 true-小图
    addImgRight: -350,
    endFlag: false, //翻页结束
    lastTapTime:0, //判断双击
    previewImageList: [], //预览列表
    clickFlag: false, //双击状态
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
    if(!this.data.clickFlag){
      this.setData({
        photoFlag: true,
        imgArr: [],
        previewImageList: []
      })
      this.getPhotoAlbum();
    }else{
      this.setData({
        photoFlag: false,
        clickFlag: false
      })
    }
    
  },

  //获取数据
  getPhotoAlbum() {
    let self = this,list = [], previewList = [];
    utils.getPhotoAlbumList((res) => {
      console.log("初始数据",res)
      res.forEach(item => {
        previewList = previewList.concat(item.photoList);
        item.photoList.forEach(sitem => {
          list.push({
            src: sitem,
            isturn: false
          });
        })
      });
      self.setData({
        imgArr: list,
        previewImageList: previewList
      })
      console.log("相册数据",list)
      setTimeout(()=>{
        self.setData({
          photoFlag: false
        })
      },3000)
    })
  },
  // 控制翻页效果
  change(e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    let imgs = this.data.imgArr;
    let curTime = e.timeStamp;
    let lastTime = e.currentTarget.dataset.time;
    let currentImg = e.currentTarget.dataset.img;
    if (this.data.flag) {
      this.data.flag = true;
      imgs.map((ele,i)=>{
        if(index==i){
          imgs[i].isturn = !imgs[i].isturn;
          imgs[i].zIndex = imgs.length;
        }else{
          imgs[i].zIndex = 1;
        }
      })
      if(index-1>=0){
          imgs[index-1].zIndex = imgs.length - 1;
      }
      if(index+1<imgs.length){
          imgs[index+1].zIndex = imgs.length - 1;
      }
      if(index-2>=0){
          imgs[index - 2].zIndex = imgs.length - 2;
      }
      if(index+2<imgs.length){
          imgs[index + 2].zIndex = imgs.length - 2;
      }
      // 判断翻页结束
      const isBelowThreshold = (currentValue) => currentValue.isturn == true;
      if(imgs.every(isBelowThreshold)){
        this.setData({endFlag: true})
      }else{
        this.setData({endFlag: false})
      }
      
      this.setData({
        imgArr: imgs
      })
      
    }
    //双击事件
    if (curTime - lastTime > 0) {
      if (curTime - lastTime < 300) {
        wx.previewImage({
          current: currentImg, 
          urls: this.data.previewImageList,
          success: function(){
            console.log("成功")
            self.setData({
              clickFlag: true
            })
          },
          fail: function(){
            console.log("失败")
          }
        })
      }
    }
    this.setData({
      lastTapTime: curTime
    })
  },
  finish(){
    this.setData({
      flag: true
    })
  },

  //点击弹出
  jumpPop: function (){
    this.setData({
      addImgRight: -100
    })
    setTimeout(()=>{
      this.setData({
        addImgRight: -350
      })
    },3000)
  },

  //操作按钮
  operationFn(e){
    console.log("sssss",e)
    switch (e.currentTarget.dataset.type) {
      case 'big':
        this.setData({
          sizeFlag: false
        })
        break;
      case 'standard':
        this.setData({
          sizeFlag: true
        })
        break;
      case 'upload':
        wx.navigateTo({
          url: '/pages/photo-album/photo-album-upload/index',
        })
        break;
    }
  }
})
