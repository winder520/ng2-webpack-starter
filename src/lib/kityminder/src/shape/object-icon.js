/**
 * Created by winder on 2016/4/22.
 */
define(function (require, exports, module) {

    var kity = require('../core/kity');

    /**
     * 创建对象图标
     * @returns {*}
     */
    function createObjectIcon(node) {
        var g = new kity.Group();
        var rect = new kity.Rect();
        g.addShape(rect);
        rect.setHeight(9);
        rect.setWidth(10);
        var head = new kity.Circle();
        head.setRadius(4);
        head.setCenter(5,4);
        head.fill(node.getStyle('object-icon-background'));
        var body = new kity.Path('m5,7c0,0 1,1 2,1c2,1 3,2 3,4l-10,0c0,-2 1,-3 3,-4c1,-1 2,-1 2,-1z');
        body.fill(node.getStyle('object-icon-background'));
        g.addShape(head);
        g.addShape(body);
        g.fill = function (color) {
            rect.fill(color);
        };
        g.scale(1.2);
        return g;
    }

    return module.exports = createObjectIcon;
});