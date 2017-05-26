/**
 * Created by winder on 2016/4/21.
 */
define(function (require, exports, module) {

    var kity = require('../core/kity');

    /**
     * 创建并集图标 U
     * @returns {*}
     */
    function createUnionSetIcon(node) {
        var g = new kity.Group();
        var rect = new kity.Rect();
        g.addShape(rect);
        rect.setHeight(36);
        rect.setWidth(32);
        g.scale(0.5);
        var u1 = new kity.Path('m0,24l0,-24l7,0l0,23c0,5 3,8 7,7l0,6c-9,0 -14,-4 -14,-13l0,1z');
        u1.fill(node.getStyle('union-set-icon-background-1'));
        var u2 = new kity.Path('m29,24l0,-24l-7,0l0,23c0,5 -3,8 -7,7l0,6c9,0 14,-4 14,-13l0,1z');
        u2.fill(node.getStyle('union-set-icon-background-2'));
        g.addShape(u1);
        g.addShape(u2);
        g.fill = function (color) {
            rect.fill(color);
        };
        return g;
    }

    return module.exports = createUnionSetIcon;
});