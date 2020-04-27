// pages/multiple-upload/multiple-upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enterpriseInfo: [
      {
        title: '',
        introduce: '',
        imgs: []
      }
    ]
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
    if(wx.getStorageSync('multiple')){
      var ceshi = wx.getStorageSync('multiple');
      this.setData({
        enterpriseInfo: ceshi
      })
    }
  },

   //简介
   enterpriseTextareaInput: function (e) {
    let index = e.currentTarget.dataset.index;
    let ary = this.data.enterpriseInfo;
    ary[index].introduce = e.detail.value;
    this.setData({
      enterpriseInfo: ary
    })
    wx.setStorage({
      data: ary,
      key: 'multiple',
    })
  },
  //标题
  enterpriseInput:function (e) {
    let index = e.currentTarget.dataset.index;
    let ary = this.data.enterpriseInfo;
    ary[index].title = e.detail.value;
    this.setData({
      enterpriseInfo: ary
    })
    wx.setStorage({
      data: ary,
      key: 'multiple',
    })
  },
  //添加模块
  addModule: function () {
    let ary = this.data.enterpriseInfo;
    ary.push({
      title: '',
      introduce: '',
      imgs: []
    })
    this.setData({
      enterpriseInfo: ary
    })
    wx.setStorage({
      data: ary,
      key: 'multiple',
    })
  },
  //删除模块
  removeModule: function (e) {
    console.log("index", e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index;
    let ary = this.data.enterpriseInfo;
    if(ary.length == 1) return;
    ary.splice(index, 1);
    this.setData({
      enterpriseInfo: ary
    })
  },
  //模块上移动
  upModule: function (e) {
    let index = e.currentTarget.dataset.index;
    if(index == 0) return;
    let ary = this.data.enterpriseInfo;
    let mid = ary[index-1];
    ary[index-1] = ary[index];
    ary[index] = mid;
    this.setData({
      enterpriseInfo: ary
    })
    wx.setStorage({
      data: ary,
      key: 'multiple',
    })
  },
  //模块向下移动
  downModule: function (e) {
    let index = e.currentTarget.dataset.index;
    let ary = this.data.enterpriseInfo;
    if (index == ary.length-1) return;
    let mid = ary[index];
    ary[index] = ary[index+1];
    ary[index+1] = mid;
    this.setData({
      enterpriseInfo: ary
    })
    wx.setStorage({
      data: ary,
      key: 'multiple',
    })
  },
  //删除图片
  deleteImg: function (e) {
    let index = e.currentTarget.dataset.index;
    let indexs = e.currentTarget.dataset.indexs;
    let ary = this.data.enterpriseInfo;
    ary[index].imgs.splice(indexs,1);
    // wx.removeStorageSync('multiple')
    this.setData({
      enterpriseInfo: ary
    });
  },
   //多图上传
   uploadImg: function (e) {
    var self = this;
    let index = e.currentTarget.dataset.index;
    let indexs = e.currentTarget.dataset.indexs;
    let number = 9;
    if(indexs != 'all') {
      number = 1;
    }

    wx.chooseImage({
      count: number,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let successUp = 0; //成功
        let failUp = 0; //失败
        let length = res.tempFilePaths.length; //总数
        let count = 0; //第几张
        self.uploadOneByOne(res.tempFilePaths, successUp, failUp, count, length, index, indexs);
      },
    });
  },

  uploadOneByOne(imgPaths, successUp, failUp, count, length, index, indexs) {
    let self = this;
    if(length > 1) {
      wx.showLoading({
        title: '正在上传第' + count + '张',
      })
    }
    //方式一 上传
    wx.uploadFile({
      url: `http://api.kpaas.biaoxiaoxu.cn/api/assets_service/v1/assets/upload?secret_key=e00a05cf37305a22ba10fec428b4ab01&client_type=weapp`,
      filePath: imgPaths[count],
      name: 'file',
      success: function (res) {
        successUp++; //成功+1
        let uploadData = JSON.parse(res.data);
        //上传图片到服务器后的地址
        let imgPath = uploadData.data[0].file;

        if (indexs == 'photo') { //头像
          self.setData({
            imgSrc: imgPath
          })
        } else {
          let ary = self.data.enterpriseInfo;
          if (indexs == 'all') { //添加
            ary[index].imgs.push({
              "url": imgPath
            })
          } else { //修改
            ary[index].imgs[indexs].url = imgPath
          }
          self.setData({
            enterpriseInfo: ary
          }) 
          wx.setStorage({
            data: ary,
            key: 'multiple',
          })
          self.onShow();
        }
      },
      fail: function (e) {
        failUp++; //失败+1
      },
      complete: function (e) {
        count++; //下一张
        if (count == length) {
          if(length > 1) {
            wx.showToast({
              title: '上传成功' + successUp + '张',
              icon: 'success',
              duration: 2000
            })
          }
        } else {
          //递归调用，上传下一张
          self.uploadOneByOne(imgPaths, successUp, failUp, count, length, index, indexs);
        }
      }
    });
  }
})