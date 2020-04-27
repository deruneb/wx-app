import * as echarts from '../../../vendor/ec-canvas/echarts';
import _ from '../../../vendor/underscore/underscore-min';

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
    // ---- 报表数据属性 START ----
    ecComponent: {},
    uid: Date.now(),
    ec: {
      lazyLoad: true // 将 lazyLoad 设为 true 后，需要手动初始化图表
    },
    isLoaded: false,
    isDisposed: false,
    // ---- 报表数据属性 END ----

    // ---- 业务数据属性 START ----
    categories: [
      { name: "任务", itemStyle: { color: '#4DD1C7' } },
      { name: "脉主", itemStyle: { color: '#8382D8' } },
      { name: "一度", itemStyle: { color: '#66C377' } },
      { name: "二度", itemStyle: { color: '#58BBE5' } },
      { name: "三度", itemStyle: { color: '#FAC877' } },
      { name: "四度", itemStyle: { color: '#ACCEC8' } },
      { name: "五度", itemStyle: { color: '#5881F2' } },
      { name: "六度", itemStyle: { color: '#5ABBAE' } },
      { name: "七度", itemStyle: { color: '#63728B' } },
      { name: "八度", itemStyle: { color: '#95BE32' } },
      { name: "九度", itemStyle: { color: '#3BA3AD' } },
      { name: "十度", itemStyle: { color: '#949482' } },
      { name: "十一度", itemStyle: { color: '#B560E5' } },
      { name: "十二度", itemStyle: { color: '#EFE6C7' } },
      { name: "十三度", itemStyle: { color: '#DE53C2' } },
      { name: "十四度", itemStyle: { color: '#F67E55' } },
      { name: "十五度", itemStyle: { color: '#FAC877' } },
      { name: "十六度", itemStyle: { color: '#FF6767' } },
      { name: "十七度", itemStyle: { color: '#F8DF00' } },
      { name: "十八度", itemStyle: { color: '#ED4F94' } },
      { name: "十九度", itemStyle: { color: '#FDF600' } },
      { name: "未建立下级关系的人脉", itemStyle: { color: '#cccccc' } }
    ],
    rootNode: null,
    collapseEmptyNode: false,
    dataSource: null
    // ---- 业务数据属性 END ----
  },

  ready() {
  },

  lifetimes: {
    ready() {
      console.log("人脉图商家id", this.data.businessId)
      // setTimeout(()=>{
      this.init()
      // },120)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化图表
    init() {
      console.log("人迈图", this.data.userId)
      let self = this;
      // if (!self.data.taskId) return;
      // if (self.data.userId) {
      //   self.data.categories.shift();
      // }
      Promise.all([
        new Promise((resolve, reject) => {
          self.loadDataSource(resolve);
        }),
        new Promise((resolve, reject) => {
          if (!self.ecComponent || !self.chart) {
            self.ecComponent = this.selectComponent(`#chart_${this.data.uid}`);
            self.ecComponent.init((canvas, width, height) => {
              let chart = echarts.init(canvas, null, { width: width, height: height });
              canvas.setChart(chart);
              chart.on('click', function (params) {
                wx.navigateTo({ url: `/pages/connections-chart-force/connections-chart-force` })
              });
              self.chart = chart;
              resolve();
              return chart;
            });
          } else {
            resolve();
          }
        })
      ]).then(results => {
        let dataSource = results[0];
        // 节点总数小于阀值节点数量时一次性展示到chart中
        self.data.collapseEmptyNode = dataSource.length > 100;
        // 格式化数据源
        let renderData = self.buildData(dataSource);
        self.renderChart(renderData);
        self.setData({
          isLoaded: true,
          isDisposed: false
        });
      })
    },
    // 获取数据集
    loadDataSource(callback) {
      let self = this;
      let graph = [
        {
          empId: "3c0545004bba11eaa653f76ee42f452e",
          id: "e8eece80-4d6d-11ea-bc7c-4d0c39710120",
          level: 0,
          parentId: "",
          userId: "b2d3eabc-e4c3-4704-90cc-81f0897e868d",
          userImage: "https://wx.qlogo.cn/mmopen/vi_32/CbOT6xnMCd98xCk3leD1C46A3ic8lHgZyN4xIa5b1d6wb0oLN7fic53OFsH1MTeibdH4q9JsE8qyaXuVF8f9qickuw/132",
          userName: "王经理"
        },
        {
          empId: "",
          id: "e2146470-4d6e-11ea-8b5f-1322dce04e63",
          level: 1,
          parentId: "e8eece80-4d6d-11ea-bc7c-4d0c39710120",
          userId: "3da0b770-092e-4d94-ae5e-8820d0e0f54e",
          userImage: "http://thirdwx.qlogo.cn/mmopen/vi_32/icRibz1X2PicN5vmUlFicgoxaBpwhYt1Mx4MtgmaQ7PicQ8e9pZibSK8yRkIs5FicFicNp9IPGHvvWGl2u5hFdPzv3F8kQ/132",
          userName: "客户"
        }
      ]
      // ----- build data -----
      let rootData = {},
        dataSource = [],
        rootNodes = graph.filter(node => { return node.userId == self.data.userId });  // 客户在不同的分支节点下时，会出现多个根节点的情况
      if (rootNodes.length > 0) rootData = rootNodes[0];

      graph.forEach(node => {
        if (node.userId != self.data.userId) {
          // 如果有多个相同客户根节点时，需要将节点的子集合并到一起
          if (rootNodes.length > 1 && rootNodes.findIndex(item => { return item.id == node.parentId }) != -1) {
            node.parentId = rootData.id;
          }
          dataSource.push({
            "id": node.id,
            "parent": node.parentId || self.data.uid,
            "name": node.userName,
            "photo": node.userImage
          })
        }
      });
      self.data.rootNode = {
        "id": rootData.id || self.data.uid,
        "parent": "",
        "name": rootData.userName || "任务",
        "photo": rootData.userImage || ""
      }
      callback(dataSource);
    },
    renderChart({ levelIndex, graph }) {
      let self = this;
      let categories = self.data.categories.slice(0, levelIndex);
      if (self.data.collapseEmptyNode) { categories.push(self.data.categories[self.data.categories.length - 1]); }
      self.chart.setOption({
        backgroundColor: "#fff",
        // legend: [{
        //   data: categories.map(item => { return item.name })
        // }],
        series: [
          {
            type: 'graph',
            layout: 'force',
            // roam: true,
            // focusNodeAdjacency: true,
            // nodeScaleRatio: 1,
            force: {
              repulsion: [100, 300],
              edgeLength: [30, 50],
              layoutAnimation: true
            },
            categories: categories,
            data: graph.nodes,
            links: graph.links,
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 1,
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
              }
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
            label: {
              normal: {
                show: true,
                position: "bottom",
                color: "#333"
              }
            },
            emphasis: {
              lineStyle: {
                width: 10
              }
            }
          }
        ]
      });
    },
    genChartRootNode() {
      return JSON.parse(JSON.stringify(this.data.rootNode));
    },
    buildData(data) {
      let self = this,
        graph = { nodes: [], links: [] },
        nodeIdWithChildren = _.groupBy(data, "parent"), // 获得parent_id相同的所有节点
        levelIndex = 0;
      let eachNodes = (parentNodes) => {
        let currentNodes = [];
        if (!parentNodes) {
          // 获取根节点
          currentNodes = [self.genChartRootNode()];
        } else {
          // 当前级别所有节点
          parentNodes.forEach(node => {
            let nodeChildren = [];
            data.forEach(item => {
              // 过滤已存在的节点（避免死循环）
              if (!item._isExist && item.parent == node.id) {
                item._isExist = true;
                item._nodeChildrenCount = (nodeIdWithChildren[item.id] || []).length;
                nodeChildren.push(item);
              }
            })
            currentNodes = currentNodes.concat(nodeChildren);
          });
        }
        if (currentNodes.length > 0) {
          const
            nodeTotal = currentNodes.length,
            maxSymbolSize = 40; // 节点最大值
          let nodeData = {
            id: "node_level_" + levelIndex,
            name: `${self.data.categories[levelIndex].name}` + (levelIndex != 0 ? `${nodeTotal}人` : ``),
            value: nodeTotal,
            category: self.data.categories[levelIndex].name,
            symbol: levelIndex == 0 ? "pin" : "circle",
            symbolSize: levelIndex == 0 ? 28 : Math.min(maxSymbolSize, Math.max(20, nodeTotal))
          }
          // 添加节点
          graph.nodes.push(nodeData);
          // 添加节点关系
          if (graph.nodes.length > 1) {
            graph.links.push({
              "source": graph.nodes.length - 2,
              "target": graph.nodes.length - 1,
              "lineStyle": { "normal": { width: 3 } }
            });
          }
          levelIndex++
          eachNodes(currentNodes);
        }
      }
      eachNodes(undefined);

      graph.nodes.forEach((node, index) => {
        node.fixed = (index == 0) || (index + 1 == graph.nodes.length) || (index % 2 == 0);
        node.x = self.chart.getWidth() * (index + 1) / (levelIndex + 1);
        node.y = (self.chart.getHeight() / 2) + (node.fixed ? 0 : ((Math.random() > 0.5 ? 1 : -1) * Math.random() * self.chart.getHeight() / 2));
      });
      return { levelIndex: levelIndex, graph: graph };
    },
    transferTo(e) {
      let self = this;

      console.log("eee",e)
      // wx.navigateTo({ url: `/pages/connections-chart-force/connections-chart-force`})
    },
    // 释放图表
    dispose: function () {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
      this.setData({
        isDisposed: true
      });
    }
  }
});