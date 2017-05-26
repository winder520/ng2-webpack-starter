/**
 * Created by winder on 2016/4/22.
 */
define(function (require, exports, module) {

    var kity = require('../core/kity');

    /**
     * 创建对象图标
     * @returns {*}
     */
    function createDataIcon(node) {
        var g = new kity.Group();
        var rect = new kity.Rect();
        g.addShape(rect);
        rect.setHeight(24);
        rect.setWidth(24);
        var p1 = new kity.Path('m10,11l10,0c0,0 0,0 0,0c0,6 -5,10 -11,10c-6,0 -10,-5 -10,-11c0,-6 5,-10 10,-10l0,10l1,1z');
        p1.fill(node.getStyle('data-background-1'));
        var p2 = new kity.Path('m23,9l-11,0l5,-9c3,1 6,6 6,9z');
        p2.fill(node.getStyle('data-background-1'));
        var p3 = new kity.Path('m21,11l-10,0l-8,6c7,8 19,3 19,-6l-1,0z');
        p3.fill(node.getStyle('data-background-2'));
        g.addShape(p1);
        g.addShape(p2);
        g.addShape(p3);
        g.fill = function (color) {
            rect.fill(color);
        };

        g.scale(0.7);
        return g;
    }

    return module.exports = createDataIcon;
});