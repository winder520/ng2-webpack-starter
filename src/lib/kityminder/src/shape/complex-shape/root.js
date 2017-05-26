/**
 * Created by winder on 2016/6/25.
 */
define(function (require, exports, module) {

    var kity = require('../../core/kity');
    var utils = require('../../core/utils');
    var Shape = require('../../core/shape');
    var createComplementIcon = require('../complement-set-icon');
    var createIntersectionIcon = require('../intersection-icon');
    var createUnionSetIcon = require('../union-set-icon');
    var createObjectIcon = require('../object-icon');
    var createDataIcon = require('../data-icon');

    Shape.register('root', {
        create: function (node) {
            var group = new kity.Group();
            // var outline = new kity.Polygon()
            //     .setId(utils.uuid('node_outline'));
            var outline = new kity.Path()
                .setId(utils.uuid('node_outline'));
            node.outline = outline;
            group.addShape(outline);
            var g;
            node._setIcons = {};

            //并集
            g = createUnionSetIcon(node);
            g.setTranslate(-22, -28);
            node._setIcons.unionSet = g;
            group.addShape(g);

            //交集
            g = createIntersectionIcon(node);
            g.setTranslate(-22, -28);
            node._setIcons.intersectionSet = g;
            group.addShape(g);

            //补集
            g = createComplementIcon(node);
            g.setTranslate(-22, -28);
            node._setIcons.complementSet = g;
            group.addShape(g);


            group.addShape(outline);
            g = createObjectIcon(node);
            g.setTranslate(-8, -30);

            node._setIcons.object = g;
            group.addShape(g);
            g = createDataIcon(node);
            g.setTranslate(-8, -30);
            node._setIcons.data = g;
            group.addShape(g);


            return group;
        },
        update: function (outline, node, box) {
            outline = node.outline;
            var paddingLeft = node.getStyle('padding-left'),
                paddingRight = node.getStyle('padding-right'),
                paddingTop = node.getStyle('padding-top') + 10,
                paddingBottom = node.getStyle('padding-bottom');

            var outlineBox = {
                x: box.x - paddingLeft,
                y: box.y - paddingTop,
                width: box.width + paddingLeft + paddingRight,
                height: box.height + paddingTop + paddingBottom + 10
            };


            var prefix = node.isSelected() ? (node.getMinder().isFocused() ? 'selected-' : 'blur-selected-') : '';
            var background = node.getData('background') || node.getStyle(prefix + 'background') || node.getStyle('background');

            var p1,
                p2,
                p3,
                p4,
                p5,
                p6,
                points = [];

            //交集、并集和补集图标切换
            for (var icon in node._setIcons) {
                node._setIcons[icon].setVisible(false);
            }
            var pathData = [];

            switch (node.data.category) {
                case 'advanced':
                    node._setIcon = node._setIcons.unionSet;
                    if (node.data.pattern)
                        node._setIcon = node._setIcons[node.data.pattern];
                    p1 = new kity.Point(outlineBox.x, outlineBox.y);
                    p2 = new kity.Point(outlineBox.x, outlineBox.y + outlineBox.height);
                    p3 = new kity.Point(outlineBox.x + outlineBox.width, outlineBox.y + outlineBox.height);
                    p4 = new kity.Point(outlineBox.x + outlineBox.width, outlineBox.y);
                    //points = [p1, p2, p3, p4];

                    pathData.push('M', p1);
                    pathData.push('L', p2);
                    pathData.push('L', p3);
                    pathData.push('L', p4);
                    pathData.push('z');
                    break;
                case 'property':
                    //对象和数据图标切换
                    node._setIcon = node._setIcons.data;
                    if (node.data.type)
                        node._setIcon = node._setIcons[node.data.type];
                    p1 = new kity.Point(outlineBox.x + 19, outlineBox.y);
                    p2 = new kity.Point(outlineBox.x, outlineBox.y + outlineBox.height / 2);
                    p3 = new kity.Point(outlineBox.x + 19, outlineBox.y + outlineBox.height);
                    p4 = new kity.Point(outlineBox.x + outlineBox.width - 19, outlineBox.y + outlineBox.height);
                    p5 = new kity.Point(outlineBox.x + outlineBox.width, outlineBox.y + outlineBox.height / 2);
                    p6 = new kity.Point(outlineBox.x + outlineBox.width - 19, outlineBox.y);
                    //points = [p1, p2, p3, p4, p5, p6];
                    pathData.push('M', p1);
                    pathData.push('L', p2);
                    pathData.push('L', p3);
                    pathData.push('L', p4);
                    pathData.push('L', p5);
                    pathData.push('L', p6);
                    pathData.push('z');
                    break;
                case 'individual':

                    var start = new kity.Point(outlineBox.x + 12, outlineBox.y);
                    var end = new kity.Point(outlineBox.x + 12, outlineBox.y + outlineBox.height);
                    var vector = kity.Vector.fromPoints(start, end);
                    pathData.push('M', start);
                    pathData.push('A', 100, Math.abs(vector.y), 0, 0, 0, end);
                    pathData.push('L', end);
                    pathData.push('L', new kity.Point(outlineBox.x + outlineBox.width - 12, outlineBox.y + outlineBox.height));
                    pathData.push('A', 100, Math.abs(vector.y), 0, 0, 0, new kity.Point(outlineBox.x + outlineBox.width - 12, outlineBox.y));
                    pathData.push('z');
                    node._setIcon = null;

                    //outline.setPathData()
                    //outline.setPathData(pathData);
                    break;
                default:
                    p1 = new kity.Point(outlineBox.x, outlineBox.y);
                    p2 = new kity.Point(outlineBox.x, outlineBox.y + outlineBox.height);
                    p3 = new kity.Point(outlineBox.x + outlineBox.width, outlineBox.y + outlineBox.height);
                    p4 = new kity.Point(outlineBox.x + outlineBox.width, outlineBox.y);
                    //points = [p1, p2, p3, p4];

                    pathData.push('M', p1);
                    pathData.push('L', p2);
                    pathData.push('L', p3);
                    pathData.push('L', p4);
                    pathData.push('z');
                    node._setIcon = null;
                    break;
            }

            outline
            //.setPoints(points)
                .setPathData(pathData)
                .fill(background);
            var width = 1.5;

            if (prefix) {
                width = node.getStyle('selected-stroke-width') || 3;
            }

            outline.stroke(node.getStyle(prefix + 'stroke' || node.getStyle('stroke')), width);

            if (node._setIcon) {
                node._setIcon.setVisible(true);
                node._setIcon.fill('transparent');
            }

            return outlineBox;
        }
    })
});