/**
 * Created by winder on 2017/3/17.
 */
var d3 = require('d3');
import { NodeText } from './node-text';
export class NodeGraph {

  private category20;
  private textObj: NodeText;
  constructor(private graph) {
    this.category20 = d3.scaleOrdinal(d3.schemeCategory20);
    for (var i = 0; i < 20; i++) {
      this.category20(i);
    }
    this.textObj = new NodeText(graph);
  }
  private drawNode(element, style) {
    // if (!Array.isArray(style)) return;
    var nodes = style.map(function (item) {
      return item;
    });

    var elements = element
      .selectAll('.node-wrapper')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-wrapper')
      .attr('transform', function (d) {
        if (!d.left && !d.top) return null;
        return 'translate(' + [d.left, d.top] + ')'
      });
    elements.each(function (ele) {

      d3.select(this)
        .selectAll('.path')
        .data(ele.paths)
        .enter()
        .append('path')
        .attr('d', function (d) {
          return d.d;
        })
        .attr('fill', function (d) {
          return d.fill;
        })
        .attr('stroke', function (d) {
          return d.stroke;
        })
        .attr('stroke-width', function (d) {
          return d.strokeWidth;
        })
        .classed('suport-select', function (d) {
          return !!d.selectable;
        })
        ;

      if (ele.group) {
        if (!Array.isArray(ele.graph)) ele.graph = [];
        this.drawNode(d3.select(this), ele.group);
      }

    });


  }

  private drawSimpleNode(element, shapeStyle) {
    if (shapeStyle.shape && shapeStyle.shape.type)
      this.createShapeFn[shapeStyle.shape.type].bind(this)(element, shapeStyle);
  }

  createShapeFn = {
    circle: function (element, style) {
      var that = this;
      element.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', style.shape.r)
        .attr('fill', (d) => {
          if (style.class) return;
          return that.category20(d.index % 20)
        })
        .attr('stroke', (d) => {
          if (style.class) return;
          return '#333'
        })
        .attr('stroke-dasharray', d => {
          if (d.isReference) return '2 2';
        })
        .attr('class', style.class);
    },
    rect: function (element, style) {
      element.append('rect')
        .attr('x', -style.shape.width / 2)
        .attr('y', -style.shape.height / 2)
        .attr('width', style.shape.width)
        .attr('height', style.shape.height)
        .attr('class', style.class);
    }
  }

  draw(element) {
    if (this['style'].simpleDefine) {
      this.drawSimpleNode(element, this['style'].simpleDefine);
    } else if (this['style'].shapes)
      this.drawNode(element, this['style'].shapes);
    this.textObj.drawText(element);

  }


}
