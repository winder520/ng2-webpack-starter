/**
 * 创建高级类 时图形
 * Created by winder on 2016/4/21.
 */
define(function (require, exports, module) {

    var kity = require('../../core/kity');
    var utils = require('../../core/utils');
    var Shape = require('../../core/shape');
    var createImportIcon = require('../import-icon');
    var createComplementIcon = require('../complement-set-icon');
    var createIntersectionIcon = require('../intersection-icon');
    var createUnionSetIcon = require('../union-set-icon');

    Shape.register('advanced', {
        create: function (node) {
            var group = new kity.Group();
            var outline = new kity.Rect()
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

            //判断是否是引入

            var importIcon = createImportIcon(node);
            group.addShape(importIcon);
            node._importIcon = importIcon;


            //node._setIcon = g;
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
            outline
                .setPosition(outlineBox.x, outlineBox.y)
                .setSize(outlineBox.width, outlineBox.height)
                .fill(background);
            var width = 1.5;

            if (prefix) {
                width = node.getStyle('selected-stroke-width') || 3;
            }
            //交集、并集和补集图标切换
            for (var icon in node._setIcons) {
                node._setIcons[icon].setVisible(false);
            }
            node._setIcon = node._setIcons.unionSet;
            if(node.data.pattern)
                node._setIcon = node._setIcons[node.data.pattern];

            outline.stroke(node.getStyle(prefix + 'stroke' || node.getStyle('stroke')), width);

            // 判断类型是否是引用的  如果是则添加成虚线边框 和 灰色的颜色
            if (node.data.isReference) {

                background = node.getStyle(prefix + 'import-background') || node.getStyle('import-background');
                if (!prefix) {
                    var importStroke = node.getStyle(prefix + 'import-stroke' || node.getStyle('import-stroke'));
                    outline.stroke(new kity.Pen().setColor(importStroke).setWidth(width).setDashArray([4, 5]));
                }
                outline.fill(background);
            }
            if (node._setIcon) {
                //node._setIcon.setStyle('display', 'block');
                node._setIcon.setVisible(true);
                node._setIcon.fill(background);
            }

            //导入图标显示和隐藏
            if (node.data.isImport) {
                node._importIcon.setTranslate(outlineBox.width - 32, 20 - outlineBox.height);
                node._importIcon.fill(background);
            } else {
                //node._importIcon.setStyle('display', 'none');
                node._importIcon.setVisible(false);
            }

            return outlineBox;
        }
    })
});