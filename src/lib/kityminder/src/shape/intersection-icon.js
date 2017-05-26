/**
 * Created by winder on 2016/4/21.
 */
define(function (require, exports, module) {

    var kity = require('../core/kity');

    /**
     * 创建交集图标 n
     * @returns {*}
     */
    function createIntersectionIcon(node) {
        var g = new kity.Group();
        var rect = new kity.Rect();
        g.addShape(rect);
        rect.setHeight(18);
        rect.setWidth(16);
        var u1 = new kity.Path('m0,6l0,11l4,0l0,-11c0,-2 1,-4 3,-4l0,-3c-4,0 -7,2 -7,6l0,1z');
        u1.fill(node.getStyle('intersection-icon-background-1'));
        var u2 = new kity.Path('m14,6l0,11l-4,0l0,-11c0,-2 -1,-4 -3,-4l0,-3c4,0 7,2 7,6l0,1z');
        u2.fill(node.getStyle('intersection-icon-background-2'));
        g.addShape(u1);
        g.addShape(u2);
        g.fill = function (color) {
            rect.fill(color);
        };
        return g;
    }

    return module.exports = createIntersectionIcon;
});