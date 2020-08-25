var db = wx.cloud.database();

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 处理更新时间
const getDateDiff = function(dateTimeStamp){
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
  
  var oldTime = getMyDate(dateTimeStamp), //获取具体时间
      aindex = oldTime.indexOf(' '),
      specificTime = oldTime.substring(aindex + 1, oldTime.length),
      yearTime = oldTime.substring(aindex + 1, 0);
  console.log("时间转换", oldTime, "specificTime", specificTime, "yearTime", yearTime,"aindex")

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
}

// 时间戳转日期
function getMyDate(str){
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
    var c_Time = c_Year + '/' + getzf(c_Month) + '/' + getzf(c_Day) + ' ' + getAPHour(getzf(c_Hour)) + ':' + getzf(c_Min) + " ";
  return c_Time;
}

//补0操作  小于10的就在数字前面加0
function getzf(c_num){
  if(parseInt(c_num) < 10){
    c_num = '0' + c_num;
  }
  return c_num; 
}

//13点-24点减去12小时显示
function getAPHour(hour) {
  if (hour > 12) {
    return hour - 12;
  }
  return hour;
}

//上传
const uploadResource = function (cb){
  let self = this;
  wx.chooseImage({
    count:1,
    success: function(res) {
      wx.showToast({
        icon:'none',
        title: '上传图片中',
      });
  
      wx.cloud.uploadFile({
        cloudPath: (new Date()).getTime()+Math.floor(9*Math.random())+".jpg", // 上传至云端的路径
        filePath: res.tempFilePaths[0], // 小程序临时文件路径
        success: res => {
          var file = res.fileID,db = wx.cloud.database();
          db.collection('resources-file').add({
            data:{
              fileRes: file,
              timeStamp: new Date().getTime()
            },
            success: res=>{
              !!cb && cb();
              console.log("奥利给")
            }
          })
          wx.showToast({
            icon:'none',
            title: '上传成功',
          })
        },
        fail:function(){
          wx.hideLoading();
        },
      })
    }
  })
 
}

//获取上传图片资源
const getResource = function (cb){
  db.collection('resources-file').orderBy('timeStamp','desc').get({
    success: res=>{
      let data = res.data;
      !!cb && cb(data);
    }
  })
}

//获取单个图片fileId
const getFileId = function (cb){
  let self = this;
  wx.chooseImage({
    count:1,
    success: function(res) {
      wx.showToast({
        icon:'none',
        title: '上传图片中',
      });
  
      wx.cloud.uploadFile({
        cloudPath: (new Date()).getTime()+Math.floor(9*Math.random())+".jpg", // 上传至云端的路径
        filePath: res.tempFilePaths[0], // 小程序临时文件路径
        success: res => {
          var file = res.fileID;
          !!cb && cb(file)
          wx.showToast({
            icon:'none',
            title: '上传成功',
          })
        },
        fail:function(){
          wx.hideLoading();
        },
      })
    }
  })
 
}

//获取多图fileId
const getMoreFileId = function(cb){
  var idList = [];
  wx.chooseImage({
    count: 9,
    success: function(res) {
      console.log(res);//用于查看结果
      var image = res.tempFilePaths;
      
      wx.showToast({
        icon:'none',
        title: '上传图片中',
      });
  
      for(let i = 0 ; i < image.length ; i++){
        wx.cloud.uploadFile({
          cloudPath: (new Date()).getTime()+Math.floor(9*Math.random())+".jpg", // 上传至云端的路径
          filePath: res.tempFilePaths[i], // 小程序临时文件路径
          success: res => {
            idList.push(res.fileID);
            !!cb && cb(idList)
            wx.showToast({
              icon:'none',
              title: '上传成功',
            })
          },
          fail:function(){
          },
        })
      }
     
    }
  })
}

//获取攻略数据
const getStrategyList = function (cb){
  db.collection('strategy-list').orderBy('id','desc').get({
    success: res=>{
      let data = res.data;
      !!cb && cb(data);
      console.log("数据列表",res)
    }
  })
}

module.exports = {
  formatTime,
  getDateDiff,
  uploadResource,
  getResource,
  getFileId,
  getMoreFileId,
  getStrategyList
}
