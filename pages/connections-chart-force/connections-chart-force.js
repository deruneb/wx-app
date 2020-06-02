import * as echarts from '../../vendor/ec-canvas/echarts';
import _ from '../../vendor/underscore/underscore-min';

Page({

  /**
   * 页面的初始数据
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.data.taskId = options.id;
    // this.data.businessId = options.businessId;
    // this.data.userId = options.userId;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.ecComponent = this.selectComponent(`#chart_${this.data.uid}`);
    this.init();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  init() {
    let self = this;
    if (self.data.userId) {
      self.data.categories.shift();
    }
    Promise.all([
      new Promise((resolve, reject) => {
        self.loadDataSource(resolve);
      }),
      new Promise((resolve, reject) => {
        if (!self.chart) {
          self.ecComponent.init((canvas, width, height) => {
            let chart = echarts.init(canvas, null, { width: width, height: height });
            canvas.setChart(chart);
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
      self.data.collapseEmptyNode = dataSource.length > 50;
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
      legend: [{ data: categories.map(item => { return item.name }) }],
      series: [
        {
          type: 'graph',
          layout: 'force',
          roam: "move",
          force: { repulsion: 140, layoutAnimation: true },
          itemStyle: {
            normal: { borderColor: '#fff', borderWidth: 1, shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.3)' }
          },
          lineStyle: { color: 'source', curveness: 0.3 },
          label: {
            normal: { show: true, position: "bottom", color: "#333" }
          },
          emphasis: { label: { show: true, color: "#F68411" } },
          categories: categories,
          data: graph.nodes,
          links: graph.links,
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
        // 开启空分组后，将除了根节点外的所有层级节点做分组处理（空下级视情况汇总显示 —— 仅汇总当前层级不是终极层级并且无下级层级的节点）
        if (self.data.collapseEmptyNode && levelIndex != 0) {
          let endLeafOfParentIds = {},
            emptyNodeOfParentIds = {},
            _groupByParent = _.groupBy(currentNodes, "parent");
          for (let key in _groupByParent) {
            let emptyNodes = _groupByParent[key].filter(item => { return item._nodeChildrenCount == 0 });
            if (emptyNodes.length == _groupByParent[key].length) {
              endLeafOfParentIds[key] = true;
            } else if (emptyNodes.length > 0) {
              emptyNodeOfParentIds[key] = emptyNodes;
            }
          }
          // 只保留拥有子集或者是当前分支终极层级的节点
          currentNodes = currentNodes.filter(item => { return item._nodeChildrenCount > 0 || endLeafOfParentIds[item.parent] });
          // 创建空组合节点
          for (const parent in emptyNodeOfParentIds) {
            currentNodes.push({
              "id": "emptynode" + parent,
              "name": emptyNodeOfParentIds[parent].length + "人",
              "parent": parent,
              "_nodeChildrenCount": 0,
              "_details": emptyNodeOfParentIds[parent],
              "_mode": "emptyGroup"
            });
            // 去掉分组数据中的多余数据
            const nodeIds = emptyNodeOfParentIds[parent].map(item => { return item.id });
            nodeIdWithChildren[parent] = nodeIdWithChildren[parent].filter(item => { return !nodeIds.includes(item.id) });
          }
        }
        // 第一人脉层级排序后，将会把数据较多的排名靠前的节点分布到四周
        if (levelIndex === 1) {
          currentNodes = currentNodes.sort((item1, item2) => {
            return item1._nodeChildrenCount > item2._nodeChildrenCount ? -1 : 1
          });
        }
        const maxSymbolSize = 30; // 节点最大值
        currentNodes.forEach((node, nodeIndex) => {
          let nodeData = {
            id: node.id,
            name: node.name,
            _mode: node._mode || "normal",
            value: node._nodeChildrenCount,
            category: self.data.categories[levelIndex].name,
            symbol: "circle",
            symbolSize: Math.min(maxSymbolSize, Math.max(10, node._nodeChildrenCount * 2))
          }
          if (node._mode == "emptyGroup") {
            nodeData.value = node._details;
            nodeData.category = self.data.categories[self.data.categories.length - 1].name;
            nodeData.symbol = "pin";
            nodeData.symbolSize = maxSymbolSize * 0.6;
            nodeData.label = { normal: { color: "#999" } }
          }
          if (levelIndex == 0) {
            nodeData.symbolSize = maxSymbolSize;
            nodeData.x = self.chart.getWidth() / 2;
            nodeData.y = self.chart.getHeight() / 2;
            nodeData.fixed = true;
            if (!self.data.userId) {
              nodeData.label = { normal: { show: true, position: "inside", color: "#fff" } }
            }
          }
          // 添加节点
          graph.nodes.push(nodeData);
          // 添加节点关系
          if (node.parent != undefined) {
            graph.links.push({
              "source": graph.nodes.findIndex(item => { return item.id === node.parent }),
              "target": graph.nodes.findIndex(item => { return item.id === node.id }),
              "lineStyle": { "normal": { width: 1 } }
            });
          }
        });
        levelIndex++
        eachNodes(currentNodes);
      }
    }
    eachNodes(undefined);

    return { levelIndex: levelIndex, graph: graph };
  },
});