import * as echarts from '../../../vendor/ec-canvas/echarts';
import geoJson from './china.js';

echarts.registerMap('china', geoJson);

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
    rankList: [],

    ecComponent: {},
    uid: Date.now(),
    ec: {
      singleTouch: true, //禁止touchmove事件
      lazyLoad: true // 将 lazyLoad 设为 true 后，需要手动初始化图表
    },
    isLoaded: false,
    isDisposed: false,
    mapDataSource: {
      city: [
        {
          name: "",
          value: ''
        }
      ],
      province: [
        {
          name: "",
          value: ''
        }
      ]
    }
  },

  ready() {
    this.ecComponent = this.selectComponent(`#chart_${this.data.uid}`);
  },

  lifetimes: {
    ready() {
      var self = this;
      this.ecComponent = this.selectComponent(`#chart_${this.data.uid}`);
      setTimeout(()=>{
        this.getRegionList();
      },100)
      if (this.isLoaded) {
        this.dispose();
      }
      wx.$on('region', () => {
        this.getRegionList();
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
    },
    // 地域分布
    getRegionList() {
      let self = this,
      city = [{name: "四川成都", value: 2},{name: "上海", value: 10}],
      province = [{name: "四川", value: 2},{name: "上海", value: 10}];
     
      self.setData({
        rankList: !!city && city.length > 5 ? city.splice(0, 5) : city,
        "mapDataSource.province": province.length > 0 ? province : [{}]
      });
      self.init(self.data.mapDataSource.province)
     
    }
  }
});
// 生成图标的配置项
let genOptions = function (data) {
  return {
    backgroundColor: "#ffffff",
    tooltip: {
      backgroundColor: "rgba(0,0,0,0.5)",
      position: function(point, params, dom, rect, size) {
        return {
          left: 0,
          top: "65%",
        }
      },
      formatter: function(params, ticket, callback) {
        return `${params.name}: ${params.data ? params.data.value : '0'}`;
      }
    },
    visualMap: {
      show: false,
      min: 0,
      max: (() => {
        let values = data.map(item => {
          return item.value
        }).sort();
        return values[values.length - 1];
      })(),
      color: ["#24AA7D", "#dddddd"]
    },
    series: [{
      type: 'map',
      mapType: 'china',
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: false,
          textStyle: {
            color: '#fff'
          }
        }
      },
      itemStyle: {
        normal: {
          borderColor: '#eee',
          areaColor: '#d8d8d8',
        },
        emphasis: {
          areaColor: '#F68411',
          borderWidth: 0
        }
      },
      animation: false,
      data: data
    }]
  };
}