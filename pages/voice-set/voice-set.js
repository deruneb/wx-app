const recorderManager = wx.getRecorderManager(),
  innerAudioContext = wx.createInnerAudioContext();
var voice = "",timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playVoice: false, //录音状态
    state: '', //跳转类型 1-编辑界面 2-重录界面
    playState: false, //播放状态
    voiceTimer: '', //录音时间
    clickFlag: true, //点击状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({
      state: options.state
    })
    voice = wx.getStorageSync('voiceUrl');
    console.log("录音",options, options.voiceUrl)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  //录音操作
  voiceIntroduced:function(event){
    var type = event.currentTarget.dataset.type,
        self = this,time = 0;
    switch (type) {
      case '1': //开始录音
        self.setData({playVoice: true});
        innerAudioContext.pause();
        const options = {
          duration: 600000, //指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
          sampleRate: 16000, //采样率
          numberOfChannels: 1, //录音通道数
          encodeBitRate: 96000, //编码码率
          format: 'mp3', //音频格式，有效值 aac/mp3
          frameSize: 50, //指定帧大小，单位 KB
         }
         
        //开始录音
        recorderManager.start(options);
        recorderManager.onStart(() => {
          // wx.showToast({
          //   title: "开始录音..",
          //   icon: 'none'
          // });
          self.setData({clickFlag: false});
          timer = setInterval(()=>{
            time++
            self.setData({
              voiceTimer: self.timeToFormat(time)
            })
            console.log("计时器",time)
          },1000)
          console.log('。。。开始录音。。。')
        });
        //错误回调
        recorderManager.onError((res) => {
          console.log(res);
        })
         
        break;
      case '2': //播放录音
        if(!self.data.playVoice && voice){
          wx.showToast({
            title: "播放中..",
            icon: 'none',
          });
          innerAudioContext.src = voice;
          //在ios下静音时播放没有声音，默认为true，改为false
          innerAudioContext.obeyMuteSwitch = false
          innerAudioContext.play();
          //播放结束
          innerAudioContext.onEnded(() => {
            innerAudioContext.stop()
          })
        }else if(!voice && !self.data.playVoice){
          wx.showToast({
            title: "没找到录音文件，快去录音吧!",
            icon: 'none'
          });
        }else{
          wx.showToast({
            title: "录音还未停止!",
            icon: 'none',
            duration: 2000
          });
        }
        console.log("播放",voice,"状态",self.data.playVoice)
        break;
      case '3': //停止录音
        if(self.data.playVoice){
          recorderManager.stop();
          recorderManager.onStop((res) => {
            console.log('。。停止录音。。', res.tempFilePath,"时长",res.duration)
            self.setData({clickFlag: true, voiceTimer: ''});
            clearInterval(timer);
            const {
              tempFilePath,
              duration
            } = res;
            let voiceSeconds = parseInt(duration / 1000); 
            // let pages = getCurrentPages();
            // let prevPage = pages[pages.length - 2];
            voice = tempFilePath;
            wx.setStorage({
              data: tempFilePath,
              key: 'voiceUrl',
            })
            self.setData({playVoice: false});
            console.log("录音时长",voiceSeconds,"本地录音文件",tempFilePath)
            //上传录音
            // wx.uploadFile({
            //   url: 'http://api.cn/api/assets_service/v1/assets/upload?session_id=f5397327-4b75-45c5-9339-860e526feb2b&secret_key=e00a05cf37305a22ba10fec428b4ab01', //这是你自己后台的连接
            //   filePath: tempFilePath,
            //   name: "file", 
            //   header: {
            //     "Content-Type": "multipart/form-data"
            //   },
            //   success: function (res) {
            //     var fileData = JSON.parse(res.data);
            //     voice = fileData.data[0].file;
            //     console.log(fileData);
            //     上传后的操作
            //   },
            //   fail: function (res) {
            //     console.log("。。录音保存失败。。");
            //   }
            // })
          })
        }
        if(voice){ //暂停播放
          innerAudioContext.pause();
        }
        break;
      case '4': //重录
        innerAudioContext.stop();
        self.setData({state:1});
        break;
      case '5': //试听
        if(!voice){
          wx.showToast({
            title: "没找到录音文件，快去录音吧!",
            icon: 'none',
          });
          return
        }
        self.setData({playState:true})
        innerAudioContext.src = voice;
        innerAudioContext.obeyMuteSwitch = false
        innerAudioContext.play();
        //播放结束
        innerAudioContext.onEnded(() => {
          innerAudioContext.stop()
        })
        console.log("试听",voice)
        break;
      case '6': //暂停试听
        innerAudioContext.pause();
        self.setData({playState:false});
        console.log("暂停试听")
        break;
    }
  },
  //秒数转换
  timeToFormat: function(times){
    var result = '00:00:00';
    var hour,minute,second
    if (times > 0) {
      hour = Math.floor(times / 3600);
      if (hour < 10) {
        hour = "0"+hour;
      }
      minute = Math.floor((times - 3600 * hour) / 60);
      if (minute < 10) {
        minute = "0"+minute;
      }

      second = Math.floor((times - 3600 * hour - 60 * minute) % 60);
      if (second < 10) {
        second = "0"+second;
      }
      result = hour+':'+minute+':'+second;
    }
    return result;  
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    innerAudioContext.stop();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    innerAudioContext.stop();
  }
})