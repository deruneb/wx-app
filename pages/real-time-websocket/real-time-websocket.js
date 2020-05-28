// pages/real-time-websocket/real-time-websocket.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    behaviorList:[
      {
        face: "https://wx.qlogo.cn/mmopen/vi_32/CbOT6xnMCd98xCk3leD1C46A3ic8lHgZyN4xIa5b1d6wb0oLN7fic53OFsH1MTeibdHhLZFKRldvVyS2vruGibiatRg/132",
        nickname: "1Giao窝里Giao",
        userData: [
          {type: "browseArticle", dateTime: 1590551566646, time: 7, title: "罗志祥520发6000字长文表白周扬青，是在求原谅吗？"},
          {type: "browseCard", dateTime: 1590548100398, time: 2},
          {type: "clickPhone", dateTime: 1590546785816, time: 2}
        ],
        newTime: 1590551566646,
        userId: "121441d23dsza32512dsd21421dsc"
      }
    ],
    numCeshi: 1, //假数据
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
    // 启动websocket
    // this.soketProMsg(this.data.pagination.pageSize);

    //假数据
    this.operationBehaviorList();
  },

  //假数据处理
  operationBehaviorList: function (){
    let behaviorList = this.data.behaviorList,self = this;
    for (var i = 0; i < behaviorList.length; i++) {
      behaviorList[i].time = self.getDateDiff(behaviorList[i].newTime);
      behaviorList[i].userData.forEach((n) => { //组装数据
        self.behaviorDataProcess(n);
      })
    }
    this.setData({
      behaviorList: behaviorList
    })
  },

  //行为数据组装
  behaviorDataProcess: function (data){
    let str1 = '',str2 = '',str3 = '',str4 = '',str5 = '',str6 = '',secondsecond = '';    
    // debugger;
    switch (data.type) {
      
      case 'browseArticle': //查看文章
        str1 = '查看了你分享的 ';
        str3 = `"${data.title}"`;
        break;
      case 'browseCard': //查看名片
        str1 = '查看了 ';
        str2 = `${data.time}次`;
        str3 = "你的名片";
        break;
      case 'clickPhone': //拨打手机
        str1 = '拨打了 ';
        str2 = `${data.time}次`;
        str3 = "你的电话号码";
        break;
      case 'wxFriend': //复制微信
        str1 = '复制了 ';
        str2 = `${data.time}次`;
        str3 = "你的微信号";
        break;
    }
    data.str1 = str1;
    data.str2 = str2;
    data.str3 = str3;
    data.str4 = str4;
    data.str5 = str5;
    // data.str6 = str6;
  },

  // 创建soket连接
  connectSoket: function (callback) {
    let sessionId = getApp().globalData.userInfo.session_id,
      // url = `${config.wsHost}api/websocket_service/v1/ws/index?session_id=a3bb277b-5c89-4417-b619-601920364323&business_id=017da184-903f-4664-b5b1-43f61c79d188`;
      url = `${config.wsHost}api/websocket_service/v1/ws/index?session_id=${sessionId}&business_id=${this.data.globalUserInfo.businessId}`;
    getApp().globalData.soketObj = wx.connectSocket({
      url: url
    });
    !!callback && callback();
  },
  // 连接websoket
  soketProMsg: function (size) { 
    var self = this;
    let beParam = {
      code: 150,
      data: {
        type: self.data.searchType,
        from: 0,
        size: size
      }
    }

    self.connectSoket(() => {
      let soketIo = getApp().globalData.soketObj;

      // console.log("链接对象", soketIo)
      soketIo.onOpen((res) => {
        // console.log("开启",res)
        soketIo.onMessage((result) => {
          result = JSON.parse(result.data);
          // console.log("信息数据", result);
          switch (result.code) {
            case 66:
              // wx.sendSocketMessage({
              //   data: JSON.stringify(beParam)
              // });
              // self.heartTest();
              break;
            case 101: //用户雷达单条数据推送
              console.log("状态码101", result);
          
              let oldIndex = 0
              self.data.behaviorList = self.data.behaviorList.map((item, index) => {
                if (item.userId == result.data.userId) {
                  oldIndex = index;
                  item.time = self.getDateDiff(result.data.systemTime);
                  item.userData.forEach((cont) => {
                    if ((cont.type == 'cardView' && result.data.userData.type == 'cardView') || (cont.type == 'cardShare' && result.data.userData.type == 'cardShare')){
                      result.data.userData.time = cont.time + result.data.userData.time;
                    }
                  })
                  item.userData.unshift(result.data.userData);
                  if (item.userData.length > 10) { //超过10条删除多余数据
                    var itemLength = item.userData.length - 3;
                    item.userData.splice(3, itemLength);
                  }
                  var hash = {};  //过滤掉相同类型的数据
                  item.userData = item.userData.reduce(function (item, next) {
                    hash[next.type] ? '' : hash[next.type] = true && item.push(next);
                    return item
                  }, [])
                }
                item.userData.forEach((n) => { //组装数据
                  self.behaviorDataProcess(n)
                })
                return item;
              });

              if (oldIndex > 0) {
                const item = self.data.behaviorList[oldIndex]
                self.data.behaviorList.splice(oldIndex, 1);
                self.data.behaviorList.unshift(item)
              }

              self.setData({
                behaviorList: self.data.behaviorList
              })
              console.log('雷达数据推送');
              console.log(self.data.behaviorList);
              break;
            case 1:
            case 2:
              utils.toast.fail({
                title: data.list.message
              });
              break;
          }
        })
      })
      
    })
  },
  // 链接检测
  heartTest: function() {
    let self = this;
    if (getApp().globalData.soketObj.readyState !== 0 && getApp().globalData.soketObj.readyState !== 1) {
      clearTimeout(self.heartTestTimeout);
      self.soketProMsg(self.data.behaviorList.length);
    }
    this.heartTestTimeout = setTimeout(() => {
      self.heartTest();
    }, 2 * 60 * 1000);
  },
  // 处理更新时间
  getDateDiff: function(dateTimeStamp){
    var minute = 1000 * 60, //用毫秒显示
        hour = minute * 60,
        day = hour * 24,
        halfamonth = day * 15,
        month = day * 30,
        now = new Date().getTime(),
        diffValue = now - dateTimeStamp,
        monthC = diffValue / month, 
        weekC = diffValue / (7 * day),
        dayC = diffValue / day,
        hourC = diffValue / hour,
        minC = diffValue / minute,
        result = '';
    
    var oldTime = this.getMyDate(dateTimeStamp), //获取具体时间
        aindex = oldTime.indexOf(' '),
        specificTime = oldTime.substring(aindex + 1, oldTime.length),
        yearTime = oldTime.substring(aindex + 1, 0);
    // console.log("时间转换", oldTime, "specificTime", specificTime, "yearTime", yearTime,"aindex")

    if(monthC>= 1){
      // result = "" + parseInt(monthC) + "月前 " + "specificTime";
      result = "" + yearTime;
    }
    else if (weekC >= 1) {
      // result = "" + parseInt(weekC) + "周前";
      result = "" + yearTime ; 
    }
    else if (dayC >= 1) {
      result = "" + parseInt(dayC) + "天前 " + specificTime;
    }
    else if (hourC >= 1) {
      result = "" + parseInt(hourC) + "小时前";
    }
    else if (minC >= 1) {
      result = "" + parseInt(minC) + "分钟前";
    } else{
      result = "刚刚";
    }

    return result;
  },
  // 时间戳转日期
  getMyDate: function (str){
    if(str > 9999999999) { // 这里判断：时间戳为几位数
      var c_Date = new Date(parseInt(str));
    } else {
      var c_Date = new Date(parseInt(str) * 1000);
    }
    var c_Year = c_Date.getFullYear(),
      c_Month = c_Date.getMonth() + 1,
      c_Day = c_Date.getDate(),
      c_Hour = c_Date.getHours(),
      c_Min = c_Date.getMinutes(),
      c_Sen = c_Date.getSeconds();
      var c_Time = c_Year + '/' + this.getzf(c_Month) + '/' + this.getzf(c_Day) + ' ' + this.getAPHour(this.getzf(c_Hour)) + ':' + this.getzf(c_Min) + " ";
    return c_Time;
  },
  //补0操作  小于10的就在数字前面加0
  getzf: function (c_num){
    if(parseInt(c_num) < 10){
      c_num = '0' + c_num;
    }
    return c_num; 
  },
  //13点-24点减去12小时显示
  getAPHour: function (hour) {
    if (hour > 12) {
      return hour - 12;
    }
    return hour;
  },

  //删除用户
  delete: function (){
    this.data.behaviorList.pop();
    this.operationBehaviorList();
  },
  //增加用户
  newAdd: function (){
    this.data.numCeshi += 1
    this.data.behaviorList.push({
      face: "https://wx.qlogo.cn/mmopen/vi_32/CbOT6xnMCd98xCk3leD1C46A3ic8lHgZyN4xIa5b1d6wb0oLN7fic53OFsH1MTeibdHhLZFKRldvVyS2vruGibiatRg/132",
      nickname: this.data.numCeshi + "Giao窝里Giao",
      userData: [
        {type: "browseArticle", dateTime: 1590551566646, time: 7, title: "罗志祥520发6000字长文表白周扬青，是在求原谅吗？"},
        {type: "browseCard", dateTime: 1590548100398, time: this.data.numCeshi},
        {type: "clickPhone", dateTime: 1590546785816, time: 3}
      ],
      newTime: 1590551566646,
      userId: "121441d23dsza32512dsd21421dsc"
    })
    this.operationBehaviorList();
  },
  //增加行为模拟雷达推送
  newBehavior: function () {
    let self = this,
    result = {
      userData:{
        type: "wxFriend",
        dateTime: 1590546792888, 
        time: 5,
      },
      systemTime: new Date().getTime(),
      userId: "121441d23dsza32512dsd21421dsc"
    },
    oldIndex = 0;
    self.data.behaviorList = self.data.behaviorList.map((item, index) => {
      if (item.userId == result.userId) {
        oldIndex = index;
        item.time = self.getDateDiff(result.systemTime);
        item.userData.unshift(result.userData);
        if (item.userData.length > 10) { //超过10条删除多余数据
          var itemLength = item.userData.length - 3;
          item.userData.splice(3, itemLength);
        }
        var hash = {};  //过滤掉相同类型的数据
        item.userData = item.userData.reduce(function (item, next) {
          hash[next.type] ? '' : hash[next.type] = true && item.push(next);
          return item
        }, [])
      }
      item.userData.forEach((n) => { //组装数据
        self.behaviorDataProcess(n)
      })
      return item;
    });

    if (oldIndex > 0) {
      const item = self.data.behaviorList[oldIndex]
      self.data.behaviorList.splice(oldIndex, 1);
      self.data.behaviorList.unshift(item)
    }

    self.setData({
      behaviorList: self.data.behaviorList
    })
  }
})