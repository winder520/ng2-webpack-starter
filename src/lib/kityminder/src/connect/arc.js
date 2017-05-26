/**
 * @fileOverview
 *
 * 圆弧连线
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

define(function (require, exports, module) {
    var kity = require('../core/kity');
    var connect = require('../core/connect');

    var connectMarker = new kity.Marker().pipe(function () {
        var dot = new kity.Path('M 0 0 L 0 20 L 20 10 z');
        this.setOrient('auto-start-reverse');
        dot.fill('#0393FD').stroke('#0393FD', 2);
        this.addShape(dot);
        this.setRef(0, 10).setViewBox(0, 0, 20, 20).setWidth(8).setHeight(10);
        this.dot = dot;
        this.node.setAttribute('markerUnits', 'strokeWidth');
    });
    var rhombusMarker = new kity.Marker().pipe(function () {
        this.setOrient('auto-start-reverse');
        //var dot = new kity.Path('M0,0 L6,2 L8,10 L2,8 ');
        var dot = new kity.Path('M0,5 L10,0 L20,5 L10,10 z');
        //var dot = new kity.Rect();
        // dot.setHeight(6);
        // dot.setWidth(6);
        // dot.node.style.transform = 'rotate(-50deg)';

        dot.fill('#0393FD');
        //dot.stroke('#0393FD', 2);
        this.addShape(dot);
        //this.setRef(9, -0.2).setViewBox(0, 0, 20, 20).setWidth(20).setHeight(50);
        this.setRef(8, 2).setViewBox(0, 0, 20, 20).setWidth(20).setHeight(50);
        this.dot = dot;
        //this.node.setAttribute('markerUnits', 'strokeWidth');
    });
    connect.register('arc', function (node, parent, connection, width, color) {

        var box = node.getLayoutBox(),
            pBox = parent.getLayoutBox();

        var start, end, vector;
        var abs = Math.abs;
        var pathData = [];
        var side = box.x > pBox.x ? 'right' : 'left';
        var position = box.y > pBox.y ? 'bottom' : 'top';

        node.getMinder().getPaper().addResource(connectMarker);
        node.getMinder().getPaper().addResource(rhombusMarker);

        start = new kity.Point(pBox.cx, pBox.cy);
        end = side == 'left' ?
            new kity.Point(box.right, box.cy) :
            new kity.Point(box.left, box.cy);


        vector = kity.Vector.fromPoints(start, end);

        //var arrowSize = 0;//15;

        switch (true) {
            /*case abs(box.cx) - pBox.cx < box.width / 2:
             //当不同父节点和子节点垂直的时候适合画直线
             if (box.y < pBox.y) {
             //start = new kity.Point(pBox.x + pBox.width / 2, pBox.y - arrowSize);
             end = new kity.Point(box.x + box.width / 2, box.y + box.height);
             }
             else {
             //start = new kity.Point(pBox.x + pBox.width / 2, pBox.y + pBox.height + arrowSize);
             end = new kity.Point(box.x + box.width / 2, box.y);
             }
             pathData.push('M', start);
             pathData.push('L', end);
             break;*/
            default:
                pathData.push('M', start);
                pathData.push('A', abs(vector.x), abs(vector.y), 0, 0, (vector.x * vector.y > 0 ? 0 : 1), end);
                // var centerPoints = convert(start.x, start.y, end.x, end.y, 0, 0, vector.x, vector.y, 0);
                // var cPoint = {
                //     x: (start.x + end.x) / 2,
                //     y: (start.y + end.y) / 2
                // };
                // var k = (centerPoints.cy - cPoint.y) / (centerPoints.cx - cPoint.x);
                // var b = cPoint.y - k * cPoint.x;
                // var result = countArcCenterPoints(centerPoints.cx, centerPoints.cy, k, b, abs(vector.x), abs(vector.y));
                // if (Math.abs(box.y - pBox.y) < 15) {
                //     node._centerPoint = {
                //         x: side == 'left' ? ((start.x - pBox.width / 2) + end.x) / 2 : ((start.x + pBox.width / 2) + end.x) / 2,
                //         y: (start.y + end.y) / 2
                //     };
                //
                // } else if (result) {
                //
                //     var distance1 = Math.pow(start.x - result.p1.x, 2) + Math.pow(start.y - result.p1.y, 2);
                //     var distance2 = Math.pow(start.x - result.p2.x, 2) + Math.pow(start.y - result.p2.y, 2);
                //     node._centerPoint = distance1 > distance2 ? result.p2 : result.p1;
                //
                // } else {
                //
                //     node._centerPoint = {
                //         x: side == 'left' ? ((start.x - pBox.width / 2) + end.x) / 2 : ((start.x + pBox.width / 2) + end.x) / 2,
                //         y: (start.y + end.y) / 2
                //     };
                // }
                break;
        }
        var offsetX = 0, offsetY = 0;
        if (side == 'right') {
            offsetX = -(node._connectionText.node.getBoundingClientRect().width - 10);
            //p3 = new kity.Point(box.right, underY);
        } else {
            offsetX = 8;
            //p3 = new kity.Point(box.left, underY);
        }

        if (position === 'top') {
            offsetY = -8;
        } else {
            offsetY = 15;
        }
        node._centerPoint = {
            x: end.x + offsetX,
            y: end.y + offsetY
        };


        //pathData.push('A', abs(vector.x), abs(vector.y), 0, 0, (vector.x * vector.y > 0 ? 0 : 1), end);
        //connection.setMarker(connectMarker, 'start');
        //connection.setMarker(rhombusMarker, 'start');
        connection.setMarker(null);
        //connectMarker.dot.fill('transparent');

        connection.setPathData(pathData);
    });
    /*function radian(ux, uy, vx, vy) {
        var dot = ux * vx + uy * vy;
        var mod = Math.sqrt(( ux * ux + uy * uy ) * ( vx * vx + vy * vy ));
        var rad = Math.acos(dot / mod);
        if (ux * vy - uy * vx < 0.0) rad = -rad;
        return rad;
    }

    //conversion_from_endpoint_to_center_parameterization
    //sample :  convert(200,200,300,200,1,1,50,50,0,{})
    function convert(x1, y1, x2, y2, fA, fS, rx, ry, phi) {
        var cx, cy, theta1, delta_theta;

        if (rx === 0.0 || ry === 0.0) return -1;  // invalid arguments

        var s_phi = Math.sin(phi);
        var c_phi = Math.cos(phi);
        var hd_x = ( x1 - x2 ) / 2.0;   // half diff of x
        var hd_y = ( y1 - y2 ) / 2.0;   // half diff of y
        var hs_x = ( x1 + x2 ) / 2.0;   // half sum of x
        var hs_y = ( y1 + y2 ) / 2.0;   // half sum of y

        // F6.5.1
        var x1_ = c_phi * hd_x + s_phi * hd_y;
        var y1_ = c_phi * hd_y - s_phi * hd_x;

        var rxry = rx * ry;
        var rxy1_ = rx * y1_;
        var ryx1_ = ry * x1_;
        var sum_of_sq = rxy1_ * rxy1_ + ryx1_ * ryx1_;   // sum of square
        var coe = Math.sqrt(( rxry * rxry - sum_of_sq ) / sum_of_sq);
        if (fA == fS) coe = -coe;

        // F6.5.2
        var cx_ = coe * rxy1_ / ry;
        var cy_ = -coe * ryx1_ / rx;

        // F6.5.3
        cx = c_phi * cx_ - s_phi * cy_ + hs_x;
        cy = s_phi * cx_ + c_phi * cy_ + hs_y;

        var xcr1 = ( x1_ - cx_ ) / rx;
        var xcr2 = ( x1_ + cx_ ) / rx;
        var ycr1 = ( y1_ - cy_ ) / ry;
        var ycr2 = ( y1_ + cy_ ) / ry;

        // F6.5.5
        theta1 = radian(1.0, 0.0, xcr1, ycr1);

        // F6.5.6
        delta_theta = radian(xcr1, ycr1, -xcr2, -ycr2);
        var PIx2 = Math.PI * 2.0;
        while (delta_theta > PIx2) delta_theta -= PIx2;
        while (delta_theta < 0.0) delta_theta += PIx2;
        if (fS == false) delta_theta -= PIx2;

        var outputObj = {
            /!* cx, cy, theta1, delta_theta *!/
            cx: cx,
            cy: cy,
            theta1: theta1,
            delta_theta: delta_theta
        };
        //console.dir(outputObj);

        return outputObj;
    }

    /!**
     * 计算中圆弧上的点
     * @param cx 椭圆圆心X
     * @param cy 椭圆圆心Y
     * @param k 斜率 过椭圆圆心(cx,cy) 和 画弧度开始点和结束点两点之间的中间点((x1+x2)/2,(y1+y2)/2) 两点线的斜率
     * @param b
     * @param rx 椭圆长半轴
     * @param ry 椭圆短半轴
     *!/
    function countArcCenterPoints(cx, cy, k, b, rx, ry) {
        if (isNaN(cx) || isNaN(cy) || isNaN(k) || isNaN(b) || isNaN(rx) || isNaN(ry))return null;
        cx = cx === 0 ? cx : cx.toFixed(2);
        cy = cy === 0 ? cy : cy.toFixed(2);
        k = k === 0 ? k : k.toFixed(2);
        b = b === 0 ? b : b.toFixed(2);
        rx = rx === 0 ? rx : rx.toFixed(2);
        ry = ry === 0 ? ry : ry.toFixed(2);

        var ans = [];
        try {
            var eq = algebra.parse('((x' + (cx < 0 ? '+' : '-') + Math.abs(cx) + ')^2)/(' + rx + '^2)+((' + k + '*x' + (b < 0 ? '-' : '+') + Math.abs(b) + (cy < 0 ? '+' : '-') + Math.abs(cy) + ')^2)/(' + ry + '^2)=1');
            ans = eq.solveFor('x');
        } catch (e) {
            return null;
        }

        if (!ans || ans.length === 0)return null;

        var x1 = ans[0];
        var x2 = ans[1];
        var y1 = parseFloat(k) * x1 + parseFloat(b);
        var y2 = parseFloat(k) * x2 + parseFloat(b);

        return {
            p1: {
                x: x1,
                y: y1
            },
            p2: {
                x: x2,
                y: y2
            }
        };
    }*/
});