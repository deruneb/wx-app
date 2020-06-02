import * as echarts from '../../../vendor/ec-canvas/echarts';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userType: {
      type: String,
      value: ''
    },
    where: { //不传默认为浏览习惯 habit-为客户详情中ta带来的的浏览习惯 Newtask-为最新任务报表TA带来的浏览习惯 taskList-为任务详情TA带来的浏览习惯
      type: String,
      value: ''
    },
    showSelf: { // 是否是显示自己的
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ecComponent: {},
    uid: Date.now(),
    ec: {
      singleTouch: true, //禁止touchmove事件
      lazyLoad: true // 将 lazyLoad 设为 true 后，需要手动初始化图表
    },
    isLoaded: false,
    isDisposed: false,
    businessId: '', //浏览接口传参
    indexMax: 0, //最大数据值索引
    maxData: 0, //最大数据值
    timeLength: '', //时长
    isSelf: 1, // 0-默认，自身的浏览，1-带来的浏览数据
    timespan: '',
    avgBrowseTime: '',
    topTasks: '',
  },

  ready() {
    this.ecComponent = this.selectComponent(`#chart_${this.data.uid}`);
  },

  lifetimes: {
    ready() {
      let self = this;
      this.ecComponent = this.selectComponent(`#chart_${this.data.uid}`);
      setTimeout(()=>{ //延迟加载
        self.getBrowseTimespanList();
      },1000)
      if (this.data.userType == 'business' && this.data.where == '') {
        this.getBrowseSummary()
      }
      if (this.isLoaded) {
        this.dispose();
      }
      wx.$on('browse', () => {
        self.getBrowseTimespanList();
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化图表
    init(data) {
      this.ecComponent.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart);

        chart.setOption(genOptions(data));

        if (this.data.maxData > 0) {
          chart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: this.data.indexMax
          });
        }

        this.chart = chart;
        this.setData({
          isLoaded: true,
          isDisposed: false
        });
        return chart;
      });
    },
    // 释放图表
    dispose: function() {
      if (this.chart) {
        this.chart.dispose();
      }
      this.setData({
        isDisposed: true
      });
    },

    // 获取任务或员工浏览统计summary
    getBrowseSummary() {
      let self = this;
     
      let avgBrowseTime = (100 / 60).toFixed(0);
      self.setData({
        topTasks: 10,
        avgBrowseTime: avgBrowseTime,
        timespan: 20
      })
    },
    // 浏览习惯
    getBrowseTimespanList() {
      // console.log(this.data.userId)
      let self = this;
        
      if (self.data.where == 'habit' && self.data.userType == 'business' && self.data.taskCustomer != '1') {
        self.setData({
          isSelf: 1
        }) 
      }
      if (self.data.showSelf || self.data.taskCustomer == '1') {
        self.setData({
          isSelf: 0
        }) 
      }
 
     
        let arr = [{timespan: 0, value: 0, length: 0},
          {timespan: 1, value: 0, length: 0},
          {timespan: 2, value: 2, length: 20},
          {timespan: 3, value: 0, length: 0},
          {timespan: 4, value: 0, length: 0},
          {timespan: 5, value: 5, length: 550},
          {timespan: 6, value: 0, length: 0},
          {timespan: 7, value: 0, length: 0},
          {timespan: 8, value: 0, length: 0},
          {timespan: 9, value: 0, length: 0},
          {timespan: 10, value: 0, length: 0},
          {timespan: 11, value: 0, length: 0},
          {timespan: 12, value: 6, length: 60},
          {timespan: 13, value: 0, length: 0},
          {timespan: 14, value: 0, length: 0},
          {timespan: 15, value: 0, length: 0},
          {timespan: 16, value: 0, length: 0},
          {timespan: 17, value: 0, length: 0},
          {timespan: 18, value: 0, length: 0},
          {timespan: 19, value: 0, length: 0},
          {timespan: 20, value: 0, length: 0},
          {timespan: 21, value: 0, length: 0},
          {timespan: 22, value: 0, length: 0},
          {timespan: 23, value: 0, length: 0}];
        let arrData = [];
        let timeLength = [];
        let newArr = [];
        arr.forEach((item, index) => {
          if (index > 2) {
            arrData.push(item.value)
            timeLength.push(self.turnMin(item.length))
          }
        })
        arr.forEach((item, index) => {
          if (index < 3) {
            arrData.push(item.value)
            timeLength.push(self.turnMin(item.length))
          }
        })
        // console.log("arrData", arrData, "timeLength", timeLength)
        newArr.push(arrData, timeLength)
        var max = Math.max(...newArr[0]);
        var indexOfMax = newArr[0].indexOf(max);
        self.setData({
          indexMax: indexOfMax,
          maxData: max,
          timeLength: timeLength
        })
        self.init(newArr);
     
    },
    turnMin(s) {
      s = Number(s);
      var min = (s / 60).toFixed(1);
      return min;
    }
  }
});
// 生成图标的配置项
let genOptions = function(data) { 
  let hourArray = [
    "凌晨3点", "凌晨4点", "凌晨5点",
    "上午6点", "上午7点", "上午8点", "上午9点", "上午10点", "上午11点",
    "下午12点", "下午1点", "下午2点", "下午3点", "下午4点", "下午5点",
    "晚上6点", "晚上7点", "晚上8点", "晚上9点", "晚上10点", "晚上11点",
    "凌晨0点", "凌晨1点", "凌晨2点", "凌晨3点"
  ];
  return {
    backgroundColor: "#fff",
    color: ["#24AA7D"],
    tooltip: {
      show: true,
      backgroundColor: "rgba(0,0,0,0.5)",
      position: function(point, params, dom, rect, size) {
        return {
          right: "10%",
          top: "5%"
        }
      },
      trigger: 'axis',
      formatter: function(params, ticket, callback) {
        return '时间: ' + hourArray[params[0].dataIndex] + `\n` + '浏览数: ' + params[0].data + '次' + '\n' + '浏览时长: ' + data[1][params[0].dataIndex] + 'min';
      }
    },
    grid: {
      containLabel: false,
      top: "20%",
      bottom: "20%"
    },
    xAxis: {
      type: 'category',
      data: ['', '', '', '上午', '', '', '', '', '', '下午', '', '', '', '', '', '晚上', '', '', '', '', '', '凌晨', '', ''],
      axisLabel: {
        interval: 0,
        rotate: 360,
        rich: {}
      },
      axisLine: {
        lineStyle: {
          color: "#999"
        }
      },
    },
    yAxis: {
      show: false
    },
    series: [{
      type: 'line',
      areaStyle: {
        normal: {
          opacity: 0.3
        }
      },
      smooth: true,
      data: data[0]
    }]
  }
}