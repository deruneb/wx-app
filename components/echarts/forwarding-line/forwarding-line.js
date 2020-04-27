import * as echarts from '../../../vendor/ec-canvas/echarts';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    ecComponent: {},
    uid: Date.now(),
    ec: {
      //singleTouch: true, //禁止touchmove事件
      lazyLoad: true // 将 lazyLoad 设为 true 后，需要手动初始化图表
    },
    isLoaded: false,
    isDisposed: false,
    xLength: 0, //x轴数据长度
    forwardEffect: {
      xData: [],
      yData: [],
      serierData: [],
      yMax: 0,
      xMax: 0,
      interval: 0 //x轴间隔
    }
  },

  ready() {
    this.ecComponent = this.selectComponent(`#chart_${this.data.uid}`);
  },

  lifetimes: {
    ready() {
      let self = this;

      this.ecComponent = this.selectComponent(`#chart_${this.data.uid}`);
      setTimeout(()=>{
        self.getForwardEffect();
      },1000)
      if (this.isLoaded) {
        this.dispose();
      }
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
        this.chart = chart;
        this.setData({
          isLoaded: true,
          isDisposed: false
        });
        return chart;
      });
    },
    // 释放图表
    dispose: function () {
      if (this.chart) {
        this.chart.dispose();
      }
      this.setData({
        isDisposed: true
      });
    },
    // 返回数组的最大值
    arrayMax(arrayName) {
      var max = arrayName[0];
      for (let i = 0; i < arrayName.length; i++) {
        max = arrayName[i] > max ? arrayName[i] : max;
      }
      return max;
    },
    // 获取转发效果数据 
    getForwardEffect: function () {
      let self = this;
     
        var effect = self.data.forwardEffect,
            xLength = 0,
            sortArray = [
              {x: 1, y: 1},
              {x: 2, y: 2},
              {x: 3, y: 3},
              {x: 4, y: 5},
              {x: 6, y: 8},
              {x: 8, y: 10},
              {x: 9, y: 20},
              {x: 10, y: 40},
              {x: 11, y: 80}
            ];

        effect.yMax = sortArray.length != 0 ? Math.max.apply(Math, sortArray.map(item => { return item.y })) : 5; //y最大值
        effect.xMax = sortArray.length != 0 ? Math.max.apply(Math, sortArray.map(item => { return item.x })) : 5; //x最大值
        effect.xData = Array.from({ length: effect.xMax < 5 ? 5 : effect.xMax + 1 }, (x, xitem) => xitem); //x初始化数据
        effect.yData = Array(effect.xMax < 5 ? 5 : effect.xMax + 1).fill(0); //y初始化数据
        effect.serierData = Array(effect.xMax < 5 ? 5 : effect.xMax + 1).fill(0); //显示数据
        
        effect.yMax = effect.yMax > 5 ? effect.yMax : 5; 

        effect.interval = effect.xData.length < 20 ? 0 : 15;
        xLength = effect.xData.length;
        sortArray.forEach((ele, index) => {  // 拼装数据
          effect.yData[ele.x] = ele.y;
          effect.serierData[ele.x] = ele.y
        })
        self.setData({
          forwardEffect: effect,
          xLength: xLength
        })
        self.init(self.data.forwardEffect);
    }
  }
});
// 生成图标的配置项
let genOptions = function (data) {
  return {
    tooltip: {
      show: true,
      backgroundColor: "rgba(0,0,0,0.5)",
      position: function (point, params, dom, rect, size) {
        return {
          right: "10%",
          top: "5%"
        }
      },
      trigger: 'axis',
      formatter: function (params, ticket, callback) {
        return `转发${params[0].axisValue}次 带来客户${params[0].data}人`;
      }
    },
    color: "#24AA7D",
    legend: {
      data: ['浏览量', '访客量'],
      orient: 'vertical',
      top: 30,
      right: 10,
      itemHeight: 10,
      itemGap: 15,
    },
    grid: {
      containLabel: true,
      left: 50,
      right: 40,
      bottom: 20,
      top: 50
    },
    dataZoom: [{
      type: 'inside',
      startValue: 0,
      endValue: 10
    }],
    xAxis: {
      // name: "次数",
      nameLocation: 'start',
      nameTextStyle: {
        color: "#3C4A55",
        fontSize: 10,
        padding: [0, 0, -25, 0],
        rich:{}
      },
      nameGap: 15,
      position: "bottom",
      type: "category",
      boundaryGap: false,
      data: data.xData,
      axisTick: {
        show: false,
        interval: 2,
        lineStyle: {
          color: "#B1BFCD"
        },
        alignWithLabel: false
      },
      axisLabel: {
        color: "#B1BFCD",
        fontSize: 10,
        interval: 0
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#1091cf',
          width: 1
        }
      }
    },
    yAxis: {
      // name: "效益",
      nameLocation: 'end',
      nameTextStyle: {
        color: "#3C4A55",
        fontSize: 10,
        padding: [0, 80, -16, 0],
        rich: {}
      },
      nameGap: 12,
      type: "value",
      min: 0,
      max: data.yMax,
      splitNumber: 5,
      axisLabel: {
        color: "#B1BFCD",
        fontSize: 10,
        interval: 0
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#1091cf',
          width: 1
        }
      }
    },
    series: [
      {
        name: "转发",
        type: "line",
        symbolSize: 5,
        smooth: true,
        data: data.serierData,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#24AA7D' // 0% 处的颜色
            }, {
              offset: 1, color: '#24AA28' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
        itemStyle: {
          barBorderRadius: 2
        }
      }
    ]
  }
}