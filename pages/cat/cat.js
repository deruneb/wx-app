// pages/cat/cat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areas1:[
      {
        title: '喵星百科',
        img: 'https://resource.tuixb.cn/release/00000000-0000-0000-0000-000000000000/KMA/default/e1d7c968-0daa-453d-bb2f-f4e8e590415e.jpg'
      },
      {
        title: '喵星日记',
        img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1597723964475&di=0c433bc29e559119a831aba9a237e506&imgtype=0&src=http%3A%2F%2Fi1.17173cdn.com%2F2fhnvk%2FYWxqaGBf%2Fcms3%2FQYKzKHbkAlhxzbj.jpg'
      },
      {
        title: '喵星入宅手册',
        img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1597666772411&di=75f9e6e536f82dfdef84b463d9535c8d&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20190927%2F6103f601d2a84af3977bd0f93ad44e58.jpeg'
      },
      {
        title: '科学养宠攻略',
        img: 'https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/6e238a80-5232-4015-99b3-154703be81e9.png'
      },
      {
        title: '动物识别',
        img: '../../images/animal-1.jpg'
      }
    ],
    url:[
      '/pages-cat/cat-home/cat-home',
      '/pages-cat/cat-circle/cat-circle',
      '/pages-cat/cat-manual/cat-manual',
      '/pages-cat/cat-strategy/cat-strategy',
      '/pages/photo-identify/animal/index',
    ],
    state: false, //控制相册显示中间状态
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
    let list = this.data.areas1,urlList = this.data.url;
    if(wx.getStorageSync('photo-rule') && !this.data.state){
      list.push({
        title: '土豆애인',
        img: '../../images/cat-6.jpg'
      })
      urlList.push('/pages/photo-album/photo-album')
      this.setData({
        state: true
      })
    }else if(!wx.getStorageSync('photo-rule') && (list.length == 6 || urlList.length == 6)){
      list.pop(); 
      urlList.pop();
      this.setData({
        state: false
      })
    }
    this.setData({
      areas1: list,
      url: urlList
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