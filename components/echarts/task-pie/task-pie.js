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
      lazyLoad: true // 将 lazyLoad 设为 true 后，需要手动初始化图表
    },
    isLoaded: false,
    isDisposed: false,
    objData:{
      total: 5000,
      completed: 800
    }
  },

  ready() {
    this.ecComponent = this.selectComponent(`#chart_${this.data.uid}`);
    this.init({
      total: 5000,
      completed: 800
    });
  },

  lifetimes: {
    ready() {
      var self = this;
      this.ecComponent = this.selectComponent(`#chart_${this.data.uid}`);
      this.init(self.data.objData);
      wx.$on('pieData', () => {
        this.init(self.data.objData);
        console.log("$on")
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
    }
  }
});
// 生成图标的配置项
let genOptions = function(data) {
  return {
    backgroundColor: "#ffffff",
    color: ["#24AA7D", "#f3f3f3"],
    series: [{
      label: {
        normal: {
          fontSize: 12,
          rich: {}
        },
      },
      type: 'pie',
      radius: '55%',
      data: [{
        value: data.completed ? data.completed:0,
        name: '已完成',
        label: {
          color: '#B1BFCD'
        },
      }, {
        value: data.total - data.completed,
        name: '未完成',
        label: {
          color: '#B1BFCD'
        },
        labelLine: {
          lineStyle: {
            color: '#e3e3e3'
          }
        }
      }],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };
}