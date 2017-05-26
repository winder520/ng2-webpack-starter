/**
 * Created by winder on 2016/4/21.
 */
define(function (require, exports, module) {

    var kity = require('../../core/kity');
    var utils = require('../../core/utils');
    var Shape = require('../../core/shape');
    var createObjectIcon = require('../object-icon');
    var createDataIcon = require('../data-icon');
    var createImportIcon = require('../import-icon');
    Shape.register('property', {
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

            var importIcon = createImportIcon(node);
            group.addShape(importIcon);
            node._importIcon = importIcon;

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
            for (var icon in node._setIcons) {
                //node._setIcons[icon].setStyle('display', 'none');
                node._setIcons[icon].setVisible(false);
            }

            var prefix = node.isSelected() ? (node.getMinder().isFocused() ? 'selected-' : 'blur-selected-') : '';
            var background = node.getData('background') || node.getStyle(prefix + 'background') || node.getStyle('background');
            var p1 = new kity.Point(outlineBox.x + 19, outlineBox.y);
            var p2 = new kity.Point(outlineBox.x, outlineBox.y + outlineBox.height / 2);
            var p3 = new kity.Point(outlineBox.x + 19, outlineBox.y + outlineBox.height);
            var p4 = new kity.Point(outlineBox.x + outlineBox.width - 19, outlineBox.y + outlineBox.height);
            var p5 = new kity.Point(outlineBox.x + outlineBox.width, outlineBox.y + outlineBox.height / 2);
            var p6 = new kity.Point(outlineBox.x + outlineBox.width - 19, outlineBox.y);
            outline
                .setPoints([p1, p2, p3, p4, p5, p6])
                .fill(background);
            var width = 1.5;

            //对象和数据图标切换
            node._setIcon = node._setIcons.data;
            if (node.data.type)
                node._setIcon = node._setIcons[node.data.type];
            if (node._setIcon) {
                //node._setIcon.setStyle('display', 'block');
                node._setIcon.setVisible(true);
                node._setIcon.fill(background);
            }

            if (prefix) {
                width = node.getStyle('selected-stroke-width') || 3;
            }
            outline.stroke(node.getStyle(prefix + 'stroke' || node.getStyle('stroke')), width);
            //是否引用属性

            if(node.data.isReference){
                background = node.getStyle(prefix + 'import-background') || node.getStyle('import-background');
                if (!prefix) {
                    var importStroke = node.getStyle(prefix + 'import-stroke' || node.getStyle('import-stroke'));
                    outline.stroke(new kity.Pen().setColor(importStroke).setWidth(width).setDashArray([4, 5]));
                }
                outline.fill(background);
            }

            //导入图标显示和隐藏
            if (node.data.isImport) {
                node._importIcon.setTranslate(outlineBox.width - 32 - 19, 18 - outlineBox.height);
                node._importIcon.fill(background);
            } else {
                //node._importIcon.setStyle('display', 'none');
                node._importIcon.setVisible(false);
            }

            return outlineBox;
        }
    })
});