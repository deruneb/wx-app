const routes = {
  voice: '/pages/voice-set/voice-set'
}

const routeTabs = {
  cat: '/pages/cat/cat',
  user: '/pages/user/user',
  index: '/pages/index/index'
}

const router = {
  // 析参数对象
  parse(data) {
    let tempArr = [];
    for (let key in data) {
      tempArr.push(key + '=' + encodeURIComponent(data[key]));
      return tempArr.join('&')
    }
  },
  /**
   * path 路由地址
   * option  query参数 duration跳转延迟 openType 跳转方式
   */
  push(path, option = {}){
    console.log("option.openTypeoption.openType",option.openType)
    //无参数传入
    if(Object.keys(option).length === 0 && option.openType != 'switchTab'){
      this.to(option.openType,routes[path])
      return
    }else if(option.openType === 'switchTab'){
      this.to(option.openType,routeTabs[path])
      return
    }
    //带参数跳转
    const { query, duration, openType } = option;
    const url = `${routes[path]}?${this.parse(query)}`;
    if(duration){
      setTimeout(()=>{
        this.to(openType,url);
      },duration)
    }else{
      this.to(openType,url);
    }
  },
  to(openType, path) {
    switch (openType) {
      case 'redirect':
        wx.redirectTo({
          url: path
        })
        break;
      case 'back':
        wx.navigateBack({
          delta: 1,
        })
        break;
      case 'switchTab':
        wx.switchTab({
          url: path
        })
        break;
      default:
        wx.navigateTo({
          url: path,
          success: (res) => {
            console.log("跳转目标页成功",res)
          },
          fail: (err) => {
            console.log("跳转目标页失败",err)
          }
        })
        break;
    }
  }
}

module.exports = router;