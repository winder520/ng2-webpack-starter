/**
 * Created by winder on 2016/4/22.
 */
define(function (require, exports, module) {

    var kity = require('../../core/kity');
    var utils = require('../../core/utils');
    var Shape = require('../../core/shape');
    var createImportIcon = require('../import-icon');
    Shape.register('individual', {
        create: function (node) {
            var group = new kity.Group();
            var outline = new kity.Path()
                .setId(utils.uuid('node_outline'));
            node.outline = outline;
            group.addShape(outline);

            //导入图标
            var importIcon = createImportIcon(node);
            node._importIcon = importIcon;
            group.addShape(importIcon);


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

            var pathData = [];
            var start = new kity.Point(outlineBox.x + 12, outlineBox.y);
            var end = new kity.Point(outlineBox.x + 12, outlineBox.y + outlineBox.height);
            var vector = kity.Vector.fromPoints(start, end);
            pathData.push('M', start);
            pathData.push('A', 100, Math.abs(vector.y), 0, 0, 0, end);
            pathData.push('L', end);
            pathData.push('L', new kity.Point(outlineBox.x  + outlineBox.width-12, outlineBox.y + outlineBox.height));
            pathData.push('A', 100, Math.abs(vector.y), 0, 0, 0,new kity.Point(outlineBox.x + outlineBox.width-12, outlineBox.y));
            pathData.push('z');


            //outline.setPathData()
            outline.setPathData(pathData);
            outline
                .fill(background);
            var width = 1.5;

            if (prefix) {
                width = node.getStyle('selected-stroke-width') || 3;
            }
            outline.stroke(node.getStyle(prefix + 'stroke' || node.getStyle('stroke')), width);

            //判断类型是否是引用的  如果是则添加成虚线边框 和 灰色的颜色
            if (node.data.isReference) {
                background = node.getStyle(prefix + 'import-background') || node.getStyle('import-background');
                if (!prefix) {
                    var importStroke = node.getStyle(prefix + 'import-stroke' || node.getStyle('import-stroke'));
                    outline.stroke(new kity.Pen().setColor(importStroke).setWidth(width).setDashArray([4, 5]));
                }
                outline.fill(background);
            }
            if (node._setIcon) {
                node._setIcon.fill(background);
            }

            //导入图标显示和隐藏
            if (node.data.isImport) {
                node._importIcon.setTranslate(outlineBox.width - 38, 20 - outlineBox.height);
                node._importIcon.fill(background);
            } else {
                //node._importIcon.setStyle('display', 'none');
                node._importIcon.setVisible(false);
            }
            return outlineBox;
        }
    })
});