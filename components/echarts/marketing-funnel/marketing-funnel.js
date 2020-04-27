import * as echarts from '../../../vendor/ec-canvas/echarts';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    where: { // 营销漏斗传参-marketing 成交概率-make
      type: String,
      value: 'marketing'
    }
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
    funnelData: [{
        value: 90,
        name: '浏览',
        cont: ''
      },
      {
        value: 68,
        name: '点击',
        cont: ''
      },
      {
        value: 46,
        name: '预约',
        cont: ''
      },
      {
        value: 22,
        name: '成交',
        cont: ''
      }
    ],
    funnelDataSource: [{
        value: 0,
        name: '浏览'
      },
      {
        value: 0,
        name: '点击'
      },
      {
        value: 0,
        name: '预约'
      },
      {
        value: 0,
        name: '成交'
      }
    ],
    clickRate: '', //比率
    consultRate: '',
    orderRate: '',
    isRate: false
  }, 

  ready() {
    this.ecComponent = this.selectComponent(`#chart_${this.data.uid}`);
  },

  lifetimes: {
    ready() {
      this.ecComponent = this.selectComponent(`#chart_${this.data.uid}`);
      if (this.data.where == "make") {
        this.getStatisticalNum();
      } else {
        setTimeout(()=>{
          this.getIndicatorsContData();
        },200)
      }
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
          isDisposed: false,
          isRate: true
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
    //成交概率
    getStatisticalNum() {
      this.setData({
        "funnelData[0].cont": 5,
        "funnelData[1].cont": 6,
        "funnelData[2].cont": 7,
        "funnelData[3].cont": 8
      })
      this.init(this.data.funnelData);
    },
    //漏斗数据
    getIndicatorsContData() {
      
        let that = this, 
        mValue = {
          clickNum: 8,
          exposureNum: 10,
          consultNum:8,
          orderNum: 8
        },
          clickRate = isNaN((mValue.clickNum / mValue.exposureNum) * 100) == true || isFinite((mValue.clickNum / mValue.exposureNum) * 100) == false || mValue.clickNum == '0' ? ' 0.00' : ((mValue.clickNum / mValue.exposureNum) * 100).toFixed(2),
          consultRate = isNaN((mValue.consultNum / mValue.clickNum) * 100) == true || isFinite((mValue.consultNum / mValue.clickNum) * 100) == false || mValue.consultNum == '0' ? ' 0.00' : ((mValue.consultNum / mValue.clickNum) * 100).toFixed(2),
          orderRate = isNaN((mValue.orderNum / mValue.consultNum) * 100) == true || isFinite((mValue.orderNum / mValue.consultNum) * 100) == false || mValue.orderNum == '0' ? ' 0.00' : ((mValue.orderNum / mValue.consultNum) * 100).toFixed(2);

        that.setData({
          "funnelDataSource[0].value": mValue.exposureNum,
          "funnelDataSource[1].value": mValue.clickNum,
          "funnelDataSource[2].value": mValue.consultNum,
          "funnelDataSource[3].value": mValue.orderNum,
          clickRate: clickRate,
          consultRate: consultRate,
          orderRate: orderRate
        })

        that.data.funnelDataSource.map((item, index) => {
          that.data.funnelData[index].cont = item.value
          if (index > 2) {
            return that.data.funnelData
          }
        })
        setTimeout(()=>{ //延迟显示比率
          that.init(that.data.funnelData);
        },100)
    
    }
  }
});
// 生成图标的配置项
let genOptions = function(data) {
  return {
    backgroundColor: '#ffffff',
    // 金字塔块的颜色
    color: ['#3898EC', '#24D0C6', '#F68411', '#FA766B'],
    calculable: true,
    series: [{
      name: '漏斗图',
      type: 'funnel',
      // top: 0,
      // //x2: 80,
      // bottom: 0,
      // left:"10%",
      // width: '80%',
      // // height: {totalHeight} - y - y2,
      // min: 0,
      // max: 100,
      // minSize: '0%',
      // maxSize: '100%',
      // sort: 'descending',
      left: 10,
      top: 20,
      bottom: 30,
      width: '80%',
      min: 0,
      max: 100,
      minSize: '10%',
      maxSize: '85%',
      sort: 'descending',
      gap: 5,
      label: {
        normal: {
          show: true,
          position: 'inside',
          fontSize: 12,
          rich: {}
        },
        emphasis: {
          textStyle: {
            fontSize: 20
          }
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1,
        normal: {
          label: {
            position: 'inner',
            formatter: function(params) {
              return params.name + params.data.cont
            }
          },
          labelLine: {
            show: false
          }
        }
      },
      labelLine: {
        normal: {
          length: 10,
          lineStyle: {
            width: 2,
            type: 'solid'
          }
        }
      },
      data
    }]
  };
}