/**
 * Created by winder on 2017/3/15.
 */
var d3 = require('d3');
var _ = require('lodash');

import { NodeGraph } from './elements/nodes/node-graph';
import { LinkGraph } from './elements/links/link-graph';
import { LinkText } from './elements/links/link-text';
import { Util } from '../util/util';

export class Parser {
  private defaultStyle = {
    node: {
      simpleDefine: {
        shape: {
          type: 'circle',
          r: 20,
        },
        // class: 'graph-circle-default'
      },
      text: {
        container: {
          path: {},
          x: 0,
          y: 0,
          dock: ''
        },
        shape: {
          path: {},
          x: -40,
          y: 5,
          dock: ''
        }
      },
      width: 40,
      height: 40,
      type: 'circle'
    },
    link: {
      line: {
        d: '',
        fill: 'white',
        stroke: '#0393FD',
        strokeDashArray: '',
        strokeWidth: '1.5',
        selectable: null
      },
      texts: [{
        shape: {
          path: {
            d: '',
            fill: 'white',
            stroke: '#0393FD',
            strokeDashArray: '',
            strokeWidth: '1.5',
            selectable: null
          },
          x: '-40',
          y: '6',
          dock: ''
        }
      }]
    }
  };

  private iriSpecialCharReg = /[\/\.#:]+/gi;



  constructor(private graph) {

  }

  /**
   * 过滤无用的连接线
   * @param data 
   */
  private filterUserlessLink(data) {

    data.graphData.links = data.graphData.links.filter((link) => {

      return data.graphData.nodes.any(function (node) {
        return node.id === link.source;
      }) && data.graphData.nodes.any(function (node) {
        return node.id === link.target;
      })
    });


    data.graphData.links = data.graphData.links.distinct(function (a, b) {
      return a.id === b.id;
    })

  }

  /**
   * 由于ID当特殊字符的时候用d3.select 或 document.querySelector会报错
   * @param data 
   */
  private transformId(data) {
    data.graphData.nodes.forEach(node => {
      node.iri = node.id;
      node.id = node.id.replace(this.iriSpecialCharReg, '-');
    });
    data.graphData.links.forEach(link => {
      link.sourceIri = link.source;
      link.targetIri = link.target;
      link.source = link.source.replace(this.iriSpecialCharReg, '-');
      link.target = link.target.replace(this.iriSpecialCharReg, '-');
      link.id = link.source + '-to-' + link.target + link.type.replace(this.iriSpecialCharReg, '-');
    })
  }

  private transitionStyle(data) {
    var tempData //= window.localStorage.getItem('temp-layout-position');

    if (tempData) {
      tempData = JSON.parse(tempData);
      data.graphData.nodes.forEach(function (node) {
        if (tempData[node.id]) {
          node.x = tempData[node.id].x;
          node.y = tempData[node.id].y;
        }
      })
    }
    data.graphDefine.nodes = d3.map(data.graphDefine.nodes, function (node) {
      if (node.data.simpleDefine.shape)
        node.data.simpleDefine.shape = JSON.parse(node.data.simpleDefine.shape);
      return (node.type || '').replace(/[\r\n]$/, '');
    });
    data.graphDefine.links = d3.map(data.graphDefine.links, function (node) {
      return node.type;
    });

  }

  private combineClasses(data) {
    // var nodeIdMap = {};
    // for (var key in data.axiomMap) {
    //     var nodes = data.axiomMap[key];
    //     nodes.forEach(function (item) {
    //         nodeIdMap[item] = true;
    //     })
    // }
    // data.graphData.nodes = data.graphData.nodes.filter(function (node) {
    //     return !!nodeIdMap[node.id];
    // })
    // data.graphData.links = data.graphData.links.filter(function (node) {
    //     return !!data.axiomMap[node.type];
    // })
    data.graphData.nodes.forEach((node) => {
      var drawObj = new NodeGraph(this.graph);
      var $type = '$' + node.type;
      if (data.graphDefine.nodes[$type]) {
        node.style = data.graphDefine.nodes[$type].data;

      }
      else
        node.style = this.defaultStyle.node;
      for (var key in drawObj) {
        node[key] = drawObj[key];
      }
    });

    data.graphData.links.forEach((link) => {
      var drawObj = new LinkGraph(this.graph);
      var linkTextObj = new LinkText(this.graph);
      var $type = '$' + link.type;
      if (data.graphDefine.links[$type])
        link.style = data.graphDefine.links[$type].data;
      else
        link.style = this.defaultStyle.link;
      for (var key in drawObj) {
        link[key] = drawObj[key];
      }
      for (var key in linkTextObj) {
        link[key] = linkTextObj[key];
      }
      if (link.type)
        link.sourceText = link.type.split('#')[1]

    });
  }

  private filterLinks(data) {

    var targetLinks = [];
    var sourceLinks = [];

    var autoLinks = [];
    var selfCalculate = [];

    var group = data.graphData.links.groupBy(function (d) {
      return d.source;
    }).sort(function (a, b) {
      return a.length > b.length ? -1 : 1;
    });



    group.forEach(function (g) {
      g.forEach(function (item) {
        if (targetLinks.indexOf(item.target) > -1 && sourceLinks.indexOf(item.source) > -1) {
          selfCalculate.push(item);
          return;
        }
        sourceLinks.push(item.source);
        targetLinks.push(item.target);
        autoLinks.push(item);
      })
    })

    data.graphData.links = autoLinks;
    data.graphData.selfLinks = selfCalculate;
  }

  private transformTree(data) {
    var targetLinks = [];
    var sourceLinks = [];
    var newNodeList = [];

    var autoLinks = [];
    var selfCalculate = [];

    var group = data.graphData.links.groupBy(function (d) {
      return d.source;
    }).sort(function (a, b) {
      return a.length > b.length ? -1 : 1;
    });



    group.forEach(function (g) {
      g.forEach(function (link) {
        if (targetLinks.indexOf(link.target) > -1 && sourceLinks.indexOf(link.source) > -1) {
          var node = data.graphData.nodes.first(function (n) {
            return n.id === link.target;
          })
          if (node) {
            node = _.cloneDeep(node);
            node.isReference = true;
            node.id = link.source + node.id;
            link.target = node.id;
            link.id = Util.guid();
            newNodeList.push(node)
          }
          return;
        }
        sourceLinks.push(link.source);
        targetLinks.push(link.target);
      })
    })
    data.graphData.nodes = data.graphData.nodes.concat(newNodeList);

    data.graphData.selfLinks = [];
  }

  private parseAxiomMap(data) {
    var map = {};
    data.graphData.links.forEach(function (item) {
      if (!map[item.type]) {
        map[item.type] = [];
      }
      map[item.type].push(item.source);
      map[item.type].push(item.target);
    })
    data.graphData.axiomMap = map;
  }

  parse(data) {
    // 经过处理 将数据分离 ==
    // combineClasses(data, graph.nodeFunction);
    this.transformId(data);
    this.filterUserlessLink(data);
    this.transitionStyle(data);
    // data.axiomMap = data.graphData.axiomMap;
    this.combineClasses(data);
    if ('network' === this.graph.getOptions().showGraphType) {
      this.filterLinks(data);
    } else {
      this.transformTree(data);
    }
    this.parseAxiomMap(data);
    // filterLinks(data);

    // parseArrowData(data);
    return data;
  };
}
