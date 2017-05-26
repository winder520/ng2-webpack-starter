/**
 * @fileOverview
 *
 * 提供折线相连的方法
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

define(function(require, exports, module) {
    var kity = require('../core/kity');
    var connect = require('../core/connect');
    var connectMarkerReverse = new kity.Marker().pipe(function () {
        this.setOrient('auto-start-reverse');
        var dot = new kity.Path('M 0 0 L 20 10 L 0 20 z');

        dot.fill('#0393FD').stroke('#0393FD', 2);
        this.addShape(dot);
        this.setRef(20, 10).setViewBox(0, 0, 20, 20).setWidth(8).setHeight(10);
        this.dot = dot;
        this.node.setAttribute('markerUnits', 'strokeWidth');
    });
    var connectMarker = new kity.Marker().pipe(function () {
        var dot = new kity.Path('M 0 0 L 20 10 L 0 20 z');

        dot.fill('#0393FD').stroke('#0393FD', 2);
        this.addShape(dot);
        this.setRef(20, 10).setViewBox(0, 0, 20, 20).setWidth(8).setHeight(10);
        this.dot = dot;
        this.node.setAttribute('markerUnits', 'strokeWidth');
    });
    var rhombusMarker = new kity.Marker().pipe(function () {
        this.setOrient('auto-start-reverse');
        //var dot = new kity.Path('M0,0 L6,2 L8,10 L2,8 ');
        var dot = new kity.Path('M0,5 L10,0 L20,5 L10,10 z');
        //var dot=new kity.Rect();
        //dot.setHeight(6);
        //dot.setWidth(6);
        //dot.node.style.transform = 'rotate(-50deg)';
        dot.scale(0.4);

        //dot.fill('#0393FD');
        dot.fill('#fff').stroke('#0393FD');
        this.addShape(dot);
        this.setRef(8, 2).setViewBox(0, 0, 20, 20).setWidth(20).setHeight(50);
        this.dot = dot;
        //this.node.setAttribute('markerUnits', 'strokeWidth');
    });

    connect.register('bezier', function(node, parent, connection, width, color) {

        // 连线起点和终点
        var po = parent.getLayoutVertexOut(),
            pi = node.getLayoutVertexIn();
        var box = node.getLayoutBox(),
            pBox = parent.getLayoutBox();

        var side = box.x > pBox.x ? 'right' : 'left';
        var position = box.y > pBox.y ? 'bottom' : 'top';

        node.getMinder().getPaper().addResource(connectMarker);
        node.getMinder().getPaper().addResource(connectMarkerReverse);
        node.getMinder().getPaper().addResource(rhombusMarker);
        // 连线矢量和方向
        var v = parent.getLayoutVectorOut().normalize();

        var r = Math.round;
        var abs = Math.abs;

        var pathData = [];
        pathData.push('M', r(po.x), r(po.y));

        if (abs(v.x) > abs(v.y)) {
            // x - direction
            var hx = (pi.x + po.x) / 2;
            pathData.push('C', hx, po.y, hx, pi.y, pi.x, pi.y);
        } else {
            // y - direction
            var hy = (pi.y + po.y) / 2;
            pathData.push('C', po.x, hy, pi.x, hy, pi.x, pi.y);
        }

        var offsetX = 0, offsetY = 0;
        if (side == 'right') {
            offsetX = -(node._connectionText.node.getBoundingClientRect().width - 8);
        } else {
            offsetX = 8;
        }
        if (position === 'top') {
            offsetY = -8;
        } else {
            offsetY = 15;
        }

        node._centerPoint = {
            x: pi.x + offsetX,
            y: pi.y + (node.children.length === 0 ? 0 : offsetY)
        };

        /*node._centerPoint = {
            x: (po.x + pi.x) / 2,
            y: (po.y + pi.y) / 2
        };*/

        if (node.data.connect && (node.data.connect.type === 'subClassOf'|| node.data.connect.type === 'subPropertyOf')) {
            connection.setMarker(connectMarkerReverse, 'start');
        } else if (node.data.connect && (node.data.connect.type === 'superTypes'|| node.data.connect.type === 'superProperties')) {
            connection.setMarker(connectMarker, 'end');
        } else if (node.data.connect && (node.data.connect.type === 'subClassOf'|| node.data.connect.type === 'subPropertyOf')) {
            connection.setMarker(rhombusMarker, 'start');
        } else {
            connection.setMarker(null,'start');
            connection.setMarker(null);
        }
        connection.setPathData(pathData);
    });
});