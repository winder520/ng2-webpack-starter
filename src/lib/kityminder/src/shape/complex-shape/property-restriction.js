/**
 * Created by winder on 2016/5/18.
 */
define(function (require, exports, module) {

    var kity = require('../../core/kity');
    var utils = require('../../core/utils');
    var Shape = require('../../core/shape');
    var createImportIcon = require('../import-icon');
    var createObjectIcon = require('../object-icon');
    var createDataIcon = require('../data-icon');
    var createPropertyRestrictionIcon = require('../property-restriction-icon');
    Shape.register('propertyRestriction', {
        create: function (node) {
            var group = new kity.Group();
            var outline = new kity.Polygon()
                .setId(utils.uuid('node_outline'));
            node.outline = outline;
            group.addShape(outline);

            node._setIcons = {};
            var g = createObjectIcon(node);
            g.setTranslate(-8, -30);

            node._setIcons.object = g;
            group.addShape(g);
            g = createDataIcon(node);
            g.setTranslate(-8, -30);
            node._setIcons.data = g;
            group.addShape(g);

            g = createPropertyRestrictionIcon(node);
            node._setIcons.propertyRestriction = g;
            group.addShape(g);

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

            for (var icon in node._setIcons) {
                //node._setIcons[icon].setStyle('display', 'none');
                node._setIcons[icon].setVisible(false);
            }

            var p1, p2, p3, p4, p5, p6, points;
            if (node.root.minder.getLayoutGraphType() === 'class-class') {
                node._setIcon = node._setIcons.propertyRestriction;
                p1 = new kity.Point(outlineBox.x, outlineBox.y);
                p2 = new kity.Point(outlineBox.x, outlineBox.y + outlineBox.height);
                p3 = new kity.Point(outlineBox.x + outlineBox.width, outlineBox.y + outlineBox.height);
                p4 = new kity.Point(outlineBox.x + outlineBox.width, outlineBox.y);
                points = [p1, p2, p3, p4];
            } else {
                if (node.data.type)
                    node._setIcon = node._setIcons[node.data.type];
                p1 = new kity.Point(outlineBox.x + 19, outlineBox.y);
                p2 = new kity.Point(outlineBox.x, outlineBox.y + outlineBox.height / 2);
                p3 = new kity.Point(outlineBox.x + 19, outlineBox.y + outlineBox.height);
                p4 = new kity.Point(outlineBox.x + outlineBox.width - 19, outlineBox.y + outlineBox.height);
                p5 = new kity.Point(outlineBox.x + outlineBox.width, outlineBox.y + outlineBox.height / 2);
                p6 = new kity.Point(outlineBox.x + outlineBox.width - 19, outlineBox.y);
                points = [p1, p2, p3, p4, p5, p6];
            }
            outline
                .setPoints(points)
                .fill(background);
            var width = 1.5;

            if (prefix) {
                width = node.getStyle('selected-stroke-width') || 3;
            }

            //outline.stroke(node.getStyle(prefix + 'stroke' || node.getStyle('stroke')), width);
            var importStroke = node.getStyle(prefix + 'stroke' || node.getStyle('stroke'));
            outline.stroke(new kity.Pen().setColor(importStroke).setWidth(width).setDashArray([0]));

            // 判断类型是否是引用的  如果是则添加成虚线边框 和 灰色的颜色
            if (node.root.minder.getLayoutGraphType() === 'class-property' && node.data.isReference) {

                background = node.getStyle(prefix + 'import-background') || node.getStyle('import-background');
                if (!prefix) {
                    importStroke = node.getStyle(prefix + 'import-stroke' || node.getStyle('import-stroke'));
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
                var propertyCount = 0;
                if ('class-property' === minder.getLayoutGraphType())
                    propertyCount = 19;
                node._importIcon.setTranslate(outlineBox.width - 32 - propertyCount, 20 - outlineBox.height);
                node._importIcon.fill(background);
            } else {
                //node._importIcon.setStyle('display', 'none');
                node._importIcon.setVisible(false);
            }

            return outlineBox;
        }
    })
});