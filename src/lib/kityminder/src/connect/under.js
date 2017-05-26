/**
 * @fileOverview
 *
 * 下划线连线
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

define(function (require, exports, module) {
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
    connect.register('under', function (node, parent, connection, width, color) {

        var box = node.getLayoutBox(),
            pBox = parent.getLayoutBox();

        var start, end, vector;
        var abs = Math.abs;
        var pathData = [];
        var side = box.x > pBox.x ? 'right' : 'left';
        var position = box.y > pBox.y ? 'bottom' : 'top';
        node.getMinder().getPaper().addResource(connectMarker);
        node.getMinder().getPaper().addResource(connectMarkerReverse);
        node.getMinder().getPaper().addResource(rhombusMarker);

        var radius = node.getStyle('connect-radius');
        var underY = box.bottom - box.height / 2;
        //var startY = parent.getType() == 'sub' ? pBox.bottom + 3 : pBox.cy;
        var startY = pBox.cy;
        var p1, p2, p3, mx;

        switch (true) {
            /*case (side == 'right' && pBox.x + pBox.width - box.x + 10 > 0) || (side == 'left' && box.x + box.width - pBox.x + 10 > 0):
             //子节点和父节点出现在垂直位置的时候连接线变为直线
             if (box.y < pBox.y) {
             start = new kity.Point(pBox.cx, pBox.cy - pBox.height / 2);
             end = new kity.Point(box.x + box.width / 2, box.y + box.height);
             }
             else {
             start = new kity.Point(pBox.cx, pBox.cy + pBox.height / 2);
             end = new kity.Point(box.x + box.width / 2, box.y);
             }
             pathData.push('M', start);
             pathData.push('L', end);
             // node._centerPoint = {
             //     x: (start.x + end.x) / 2,
             //     y: (start.y + end.y) / 2
             // };
             node._centerPoint = {
             x: end.x,
             y: end.y
             };
             break;*/
            default:
                var offsetX = 0, offsetY = 0;
                if (side == 'right') {
                    p1 = new kity.Point(pBox.right, startY);
                    p2 = new kity.Point(box.left, underY);
                    offsetX = -(node._connectionText.node.getBoundingClientRect().width - 8);
                    //p3 = new kity.Point(box.right, underY);
                } else {
                    p1 = new kity.Point(pBox.left, startY);
                    p2 = new kity.Point(box.right, underY);
                    offsetX = 8;
                    //p3 = new kity.Point(box.left, underY);
                }
                if (position === 'top') {
                    offsetY = -8;
                } else {
                    offsetY = 15;
                }
                mx = (p1.x + p2.x) / 2;

                pathData.push('M', p1);
                pathData.push('C', mx, p1.y, mx, p2.y, p2);
                //pathData.push('L', p3);
                // node._centerPoint = {
                //     x: (p1.x + p2.x) / 2,
                //     y: (p1.y + p2.y) / 2
                // };
                node._centerPoint = {
                    x: p2.x + offsetX,
                    y: p2.y + (node.children.length === 0 ? 0 : offsetY)
                };
                break;
        }

        //node._connectionAggregation.


        //connection.setMarker(connectMarker, 'start');
        if (node.data.connect && (node.data.connect.type === 'subClassOf' || node.data.connect.type === 'subPropertyOf')) {
            connection.setMarker(connectMarkerReverse, 'start');
        } else if (node.data.connect && (node.data.connect.type === 'superTypes' || node.data.connect.type === 'superProperties')) {
            connection.setMarker(connectMarker, 'end');
        } else if (node.data.connect && (node.data.connect.type === 'subClassOf' || node.data.connect.type === 'subPropertyOf')) {
            connection.setMarker(rhombusMarker, 'start');
        } else {
            connection.setMarker(null, 'start');
            connection.setMarker(null);
        }

        connection.setPathData(pathData);

    });
});