/**
 * Created by winder on 2017/3/15.
 */

var d3 = require('d3');
var _ = require('lodash');
import { Parser } from './parser';
import { Filter } from './modules/filter';
import { Options } from './options';
import { MathUtil } from './math';
import { GenerateBrowserProportion } from './config/generate-browser-proportion';

export class Graph {
  private parser: Parser;
  private filter: Filter;
  private options: Options;
  //Container for visual elements
  private svgContainer
  private graphContainer
  private nodeList
  private linkList
  private selfLinkList
  //Visual element
  private nodeElements
  private linkElements
  private sourceLinks
  private targetLinks
  private linkTexts
  //graph behaviour
  private dragBehavior
  private simulation
  private zoomFactor
  private zoom
  //store var
  private hashEvent: any = {}
  private selectNode
  private attachAttr
  private browserProportion: GenerateBrowserProportion;
  private math: MathUtil;
  private mathFunctionMap: any;
  //regx expession
  private regxPathStartMatch = /M[-0-9]+,[-0-9]+/i;

  constructor(private containerSelector: HTMLElement) {
    if (containerSelector && containerSelector.outerHTML) {
      var matcher = containerSelector.outerHTML.match(/_ngcontent-[0-9a-z]+/i);
      if (matcher) {
        this.attachAttr = matcher[0];
      }
    }
    this.math = new MathUtil();
    this.mathFunctionMap = {
      rect: this.math.calculateRectangleOnPoint,
      circle: this.math.calculateCircleOnPoint
    }
    this.browserProportion = new GenerateBrowserProportion();
    this.parser = new Parser(this);
    this.options = new Options();
    this.filter = new Filter(this.options);

    this.initializeGraph();
  }

  /**
     * 加载数据
     */
  loadGraphData() {
    var cloneGraphData = _.cloneDeep(this.options.graphData);
    cloneGraphData.nodes = this.filter.filterIndividualNodes(cloneGraphData.nodes, cloneGraphData.links);
    var parserData = this.parser.parse({
      graphDefine: _.cloneDeep(this.options.dataDefine),
      graphData: cloneGraphData
    });
    this.nodeList = parserData.graphData.nodes;
    this.linkList = parserData.graphData.links;
    this.selfLinkList = parserData.graphData.selfLinks;
    this.options.axiomMap = parserData.graphData.axiomMap;
    this.filter.init(this.options.axiomMap);
  }

  private tempData = {};

  /**
   * 设置图形位置
   */
  recalculatePositions() {
    if (!this.nodeElements) return;

    this.nodeElements.attr('transform', (d) => {
      if (d.cx && d.cy) {
        d.x = d.cx;
        d.y = d.cy;
        d.cx = d.cy = null;
      }
      if (!this.options.isAutoLayout) {
        d.fx = d.x;
        d.fy = d.y;
      } else {
        d.fx = d.fy = null;
      }
      return 'translate(' + [d.x, d.y] + ')'
    });

    this.linkElements.attr('d', (d) => {
      if ('string' === typeof (d.source)) {
        d.source = this.nodeList.first((n) => {
          return n.id === d.source;
        })
      }

      if ('string' === typeof (d.target)) {
        d.target = this.nodeList.first((n) => {
          return n.id === d.target;
        })
      }

      //判断链接图形的位置
      //当相默认为矩形
      var startRect = {
        x: d.source.x,
        y: d.source.y,
        id: d.id,
        width: d.source.style.width,
        height: d.source.style.height
      };

      var endRect = {
        x: d.target.x,
        y: d.target.y,
        id: d.id,
        width: d.target.style.width,
        height: d.target.style.height
      };



      //先判断 开始（source）图形 的圆心位于结束(target)图形的什么位置

      var start = this.mathFunctionMap[d.source.style.type](endRect, startRect);// math.calculateRectangleOnPoint(endRect, startRect);

      //判断 结束(target)图形 的圆心位于开始（source）图形的什么位置
      var end = this.mathFunctionMap[d.target.style.type](startRect, endRect);// math.calculateRectangleOnPoint(startRect, endRect);

      if (!this.mathFunctionMap[d.source.style.type]) {
        var element: any = document.getElementById(d.source.id);
        if (!element)
          return;
        element = element.firstElementChild;
        if (!element) return;
        element = element.firstElementChild;
        var sourcePathData = element.getAttribute('d');
        sourcePathData = sourcePathData.replace(this.regxPathStartMatch, (item) => {
          item = item.substr(1);
          return 'M' + (+item.split(',')[0] + startRect.x) + ',' + (+item.split(',')[1] + startRect.y);
        })
        start = this.math.calculateShapePoint(sourcePathData, endRect);

      }
      // start = { x: start.x + d.source.x, y: start.y + d.source.y };
      if (!this.mathFunctionMap[d.target.style.type]) {
        var targetPathData = document.getElementById(d.target.id).firstElementChild.firstElementChild.getAttribute('d');
        targetPathData = targetPathData.replace(this.regxPathStartMatch, (item) => {
          item = item.substr(1);
          return 'M' + (+item.split(',')[0] + endRect.x) + ',' + (+item.split(',')[1] + endRect.y);
        });
        var end: any = this.math.calculateShapePoint(targetPathData, startRect);

      }

      // end = { x: end.x + d.target.x, y: end.y + d.target.y };



      var pathData = [];
      pathData.push('M', [start.x, start.y]);
      pathData.push('L', [end.x, end.y]);
      d.start = start;
      d.end = end;
      return pathData.join('');
    });

    this.linkTexts
      .attr('x', (d) => {
        return this.math.calculateDistance({ x: d.start.x, y: d.start.y }, { x: d.end.x, y: d.end.y }) / 2 + 6 - (d.textLen / 2);
      })
    //     .attr('y', (d) => {
    //         return 10;
    //     });

    this.nodeElements.each((node) => {
      this.tempData[node.id] = {
        x: node.x,
        y: node.y
      }
    })

    window.localStorage.setItem('temp-layout-position', JSON.stringify(this.tempData));
  }


  nodeStoreList = [];
  /**
   * 计算连接线的长度
   * @param {*连接线对应的节点} linkPark 
   */
  calculateLinkDistance(linkPark) {
    // if (nodeStoreList.indexOf(linkPark.target.id) > -1) {
    //     return 280;
    // }
    // nodeStoreList.push(linkPark.target.id);
    var resultSet = this.linkList.filter((item) => {
      return item.source.id === linkPark.target.id
    });

    var distance = linkPark.source.style.width + linkPark.target.style.width;
    if (resultSet.length > 1) {
      return distance < 20 ? 20 : distance * 2;
    }
    return distance < 20 ? 20 : distance * 0.8;
  }

  /**
   * 绘制图形
   */
  redrawGraph() {
    if (!this.svgContainer) {
      return;
    }
    var width = 1200,
      height = 600;
    if (this.containerSelector instanceof HTMLElement) {
      var rect = this.containerSelector.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
    }
    var nodes = this.filter.filterNodes(this.nodeList);
    var links = this.filter.filterLinks(this.linkList);
    this.svgContainer.selectAll('*').remove();

    this.simulation = d3.forceSimulation(nodes)
      // .velocityDecay(0.2)
      .force('x', d3.forceX())
      .force('y', d3.forceY())

      // .force("collision", d3.forceCollide().strength(400))
      .force("charge", d3.forceManyBody().strength((element): any => {
        var charge = this.options.charge;
        // if (elementTools.isLabel(element)) {
        //     charge *= 0.8;
        // }
        return charge;
      }))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink(links).id((d) => {
        return d.id;
      }).distance(this.calculateLinkDistance.bind(this)).strength(1))
      .on('tick', this.recalculatePositions.bind(this));

    this.graphContainer = this.svgContainer.append('g');

    var filterDefs = this.graphContainer.append('defs')
      .append('filter')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%')
      .attr('id', 'node-select-style');
    filterDefs.append('feGaussianBlur')
      .attr('stdDeviation', '1.5')
      .attr('in', 'coloredBlur');



    var linkContainer = this.graphContainer.append('g').classed('link-container', true);
    var nodeContainer = this.graphContainer.append('g').classed('node-container', true);

    // nodeContainer.append('image')
    // .attr('width',24)
    // .attr('height',24)
    // .attr('xlink:href',window.location.origin+'assets/images/css-sprites/check-box-checked.png');

    var markerContainer = linkContainer.append('defs');

    var lines = linkContainer
      .selectAll('.line')
      .data(links.concat(this.selfLinkList))
      .enter()
      .append('g')
      .attr('id', (d) => {
        return d.id;
      })
      .classed('line', true);

    lines.each(function (linkText) {
      if (linkText.sourceText || linkText.targetText) {
        linkText.drawText(d3.select(this));
      }
    });

    this.linkTexts = lines.selectAll('.link-text')
      .attr('fill-opacity', this.options.isShowLinkText ? 1 : 0);

    this.linkElements = lines
      .append('path')
      .attr('stroke', '#000')
      .attr('fill', 'none');

    this.nodeElements = nodeContainer
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .classed('node', true)
      .attr('id', (d) => {
        return d.id;
      })
      .call(this.dragBehavior);

    this.nodeElements.each(function (node) {
      node.draw(d3.select(this));
    });

    this.linkElements.each(function (link) {
      link.draw(d3.select(this), markerContainer);
    });

    this.svgContainer.selectAll('*')
      .attr(this.attachAttr, '');

    var canvasOffset: any = window.localStorage.getItem('kop-graph-canvas-offset');
    if (canvasOffset) {
      canvasOffset = JSON.parse(canvasOffset);
      //graphContainer.attr("transform", "translate(" + [canvasOffset.x, canvasOffset.y] + ")scale(" + canvasOffset.k + ")");
      //zoom.translateBy(svgContainer, canvasOffset.x, canvasOffset.y)
      // console.log(zoom,svgContainer);
      canvasOffset.k = 1;
      //setCanvasOffset(canvasOffset);
    }
    this.addClickEvents();
  }

  private addClickEvents() {
    // function executeModules(selectedElement) {
    //   options.selectionModules().forEach(function (module) {
    //     module.handle(selectedElement);
    //   });
    // }
    var that = this;

    this.svgContainer.on("click", function (e) {
      if (d3.event.target === this) {
        that.cancelSelectNodeStyle();
      }
    });

    this.nodeElements
      .on("click", function (clickedNode) {

        that.cancelSelectNodeStyle();

        that.showOrHiddenElement(d3.select(this), clickedNode);

        d3.select(this)
          .classed('select-node', true);
        that.selectNode = {
          data: clickedNode,
          element: this
        };
        that.dispatchEvent(clickedNode);
      })
      .on("contextmenu", function (e) {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        that.dispatchEvent(e);
      });

    // labelGroupElements.selectAll(".label").on("click", function (clickedProperty) {
    //   executeModules(clickedProperty);
    // });
  }

  private showOrHiddenElement(element, nodeData) {
    this.svgContainer.selectAll('.node')
      .classed('inactive', true);

    this.svgContainer.selectAll('.arrow')
      .classed('inactive', true);

    this.svgContainer.selectAll('.line')
      .classed('inactive', true);

    element
      .classed('inactive', false);

    var _linkList = this.linkList.concat(this.selfLinkList);
    var relationLinkList = _linkList.filter((link) => {
      return link.source.id === nodeData.id || link.target.id === nodeData.id;
    });

    var arrowIdList = [];
    relationLinkList.forEach((link) => {
      if (link.target.id !== nodeData.id) {
        this.svgContainer.select('#' + link.target.id)
          .classed('inactive', false);

      }
      if (link.source.id !== nodeData.id) {
        this.svgContainer.select('#' + link.source.id)
          .classed('inactive', false);
      }
      this.svgContainer.select('#' + link.id)
        .classed('inactive', false);

      if (link.style.startArrow)
        arrowIdList.push(link.id + '-arrow');
      if (link.style.endArrow)
        arrowIdList.push(link.id + '-arrow-inverse');

    })
    arrowIdList.forEach((arrowId) => {
      this.svgContainer.select('#' + arrowId)
        .classed('inactive', false);
    })

    // var sourceList = _linkList.filter((link) => {
    //   return link.target.id === nodeData.id;
    // });

  }

  private dispatchEvent(data) {
    var eventList = this.hashEvent[d3.event.type];
    if (!eventList) return;
    eventList.forEach((fn) => {
      fn(d3.event, data);
    });
  }


  private storeCanvasOffset() {
    window.localStorage.setItem('kop-graph-canvas-offset', JSON.stringify(d3.event.transform))
  }

  private setCanvasOffset(transform) {
    if (!transform) return;
    this.graphContainer.attr("transform", "translate(" + [transform.x, transform.y] + ")scale(" + transform.k + ")");
    // store zoom factor for export
    this.zoomFactor = transform.k;
    // this.graphTranslation = [transform.x, transform.y];
  }


  /**
   * Adjusts the containers current scale and position.
   */
  private zoomed() {
    this.setCanvasOffset(d3.event.transform);
    this.storeCanvasOffset();
  }

  /**
   * 取消样式
   */
  private cancelSelectNodeStyle() {
    if (this.selectNode) {

      this.svgContainer.selectAll('.node')
        .classed('inactive', false);

      this.svgContainer.selectAll('.line')
        .classed('inactive', false);

      this.svgContainer.selectAll('.arrow')
        .classed('inactive', false);

      d3.select(this.selectNode.element)
        .classed('select-node', false);
    }
  }

  /**
   * 开始绘制图形
   */
  start() {
    this.loadGraphData();
    this.redrawGraph();
  };

  /**
   * 开始绘制图形
   */
  restart() {

    this.simulation.stop();
    // this.filter.init({});
    this.loadGraphData();
    this.redrawGraph();
  };

  // /**
  //  * 设置或获取节点样式
  //  */
  // dataDefine(p) {
  //   if (!p) return this.define;
  //   this.define = p;
  //   return this.define;
  // }

  // /**
  //  * 设置或获取数据
  //  */
  // graphData(p) {
  //   if (!p) return this.data;
  //   this.data = p;
  //   return this.data;
  // };

  /**
   * 获取配置
   */
  getOptions(): Options {
    return this.options;
  }



  updateNodeStyle(): void {
    this.filter.init(this.options.axiomMap);
    this.restart();
  }

  /**
   * 更新链接线样式
   */
  updateLinkStyle(): void {
    this.linkTexts.attr('fill-opacity', this.options.isShowLinkText ? 1 : 0)
  }

  /**
   * 初始化
   */
  private initializeGraph() {

    this.dragBehavior = d3.drag()
      .subject((d) => {
        return d === null ? { x: d3.event.x, y: d3.event.y } : d;
      })
      .on('start', (d) => {
        if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (d) => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      })
      .on('end', (d) => {
        if (!d3.event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        if (!this.options.isAutoLayout) {
          d.fx = d.x;
          d.fy = d.y;
        }
      });

    // Apply the zooming factor.
    this.zoom = d3.zoom()
      .duration(150)
      .scaleExtent([0.01, 4])
      .on("zoom", this.zoomed.bind(this));

    this.svgContainer = d3.select(this.containerSelector).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr(this.attachAttr, '')
      .call(this.zoom.bind(this));


  }




  addEventListener(key, fn) {
    var eventList = this.hashEvent[key];
    if (!eventList) {
      eventList = [];
      this.hashEvent[key] = eventList;
    }
    eventList.push(fn);
  }

  removeEventListener(key, fn) {
    var eventList = this.hashEvent[key];
    if (!eventList) {
      return;
    }
    var len = eventList.length;
    for (var i = 0; i < len; i++) {
      if (eventList[i] === fn) {
        eventList.splice(i, 1);
        return;
      }
    }

  }

}