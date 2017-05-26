define(function (require, exports, module) {
    var kity = require('../core/kity');
    var Layout = require('../core/layout');
    var Minder = require('../core/minder');

    Layout.register('mind', kity.createClass({
        base: Layout,
        /**
         *  主要用于内容分配
         * @param node
         * @param children
         */
        doLayout: function (node, children) {
            var layout = this;
            //var half = Math.ceil(node.children.length / 2);
            var tempChildren = [];
            node.children.forEach(function (item) {
                if (item.isVisible(true))
                    tempChildren.push(item);
            });

            var right = [];
            var left = [];

            /*children.forEach(function (child) {
             if (child.getIndex() < half) right.push(child);
             else left.push(child);
             });*/
            tempChildren = tempChildren.orderBy(function (a) {
                a.data.orderIndex = a.data.orderIndex || 0;
                return a.data.orderIndex;
            }).thenBy(function (a) {
                a.data.created = a.data.created || 0;
                return a.data.created;
            }).thenBy(function (a) {
                return a.data.iri;
            });
            // tempChildren.forEach(function (child, index) {
            //     if (index % 2 === 0) right.push(child);
            //     else left.push(child);
            // });
            var childrenLen = tempChildren.length;
            tempChildren.forEach(function (child, index) {
                if (childrenLen / 2 <= index) right.push(child);
                else left.push(child);
            });

            var leftLayout = Minder.getLayoutInstance('left');
            var rightLayout = Minder.getLayoutInstance('right');

            leftLayout.doLayout(node, left);
            rightLayout.doLayout(node, right);

            var box = node.getContentBox();
            node.setVertexOut(new kity.Point(box.cx, box.cy));
            node.setLayoutVectorOut(new kity.Vector(0, 0));
        },

        getOrderHint: function (node) {
            var hint = [];
            var box = node.getLayoutBox();
            var offset = 5;

            hint.push({
                type: 'up',
                node: node,
                area: new kity.Box({
                    x: box.x,
                    y: box.top - node.getStyle('margin-top') - offset,
                    width: box.width,
                    height: node.getStyle('margin-top')
                }),
                path: ['M', box.x, box.top - offset, 'L', box.right, box.top - offset]
            });

            hint.push({
                type: 'down',
                node: node,
                area: new kity.Box({
                    x: box.x,
                    y: box.bottom + offset,
                    width: box.width,
                    height: node.getStyle('margin-bottom')
                }),
                path: ['M', box.x, box.bottom + offset, 'L', box.right, box.bottom + offset]
            });
            return hint;
        }
    }));
});