/**
 * Created by winder on 2016/5/19.
 */
define(function (require, exports, module) {
    var kity = require('../../core/kity');
    var utils = require('../../core/utils');
    var Shape = require('../../core/shape');

    var shapes = ['dataPropertyValue'];

    shapes.forEach(function (name) {
        Shape.register(name, {
            create: function (node) {
                var group = new kity.Group();
                var outline = new kity.Path;
                //node.outline = outline;
                group.addShape(outline);

                node._outline = outline;
                return group;
            },
            update: function (outline, node, box) {
                outline = node._outline;
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


                var radius = node.getStyle('radius');

                var prefix = node.isSelected() ? (node.getMinder().isFocused() ? 'selected-' : 'blur-selected-') : '';
                var background = node.getData('background') || node.getStyle(prefix + 'background') || node.getStyle('background');

                var pathData = [];
                var leftTop = new kity.Point(outlineBox.x , outlineBox.y);
                var leftBottom = new kity.Point(outlineBox.x , outlineBox.y + outlineBox.height);
                var rightBottom = new kity.Point(outlineBox.x +outlineBox.width, outlineBox.y + outlineBox.height);
                var rightTop = new kity.Point(outlineBox.x +outlineBox.width, outlineBox.y + 10);
                var rightTop2 = new kity.Point(outlineBox.x +outlineBox.width-10, outlineBox.y);

                pathData.push('M', leftTop);
                pathData.push('L', leftBottom);
                pathData.push('L', rightBottom);
                pathData.push('L', rightTop);
                pathData.push('L', rightTop2);
                pathData.push('z');


                //outline.setPathData()
                outline.setPathData(pathData);

                outline.fill(background);
                var width = 1.5;

                if (prefix) {
                    width = node.getStyle('selected-stroke-width') || 3;
                }
                outline.stroke(node.getStyle(prefix + 'stroke' || node.getStyle('stroke')), width);


                return outlineBox;
            }
        });
    });


});