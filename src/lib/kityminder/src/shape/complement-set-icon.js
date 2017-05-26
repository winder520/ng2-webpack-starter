/**
 * Created by winder on 2016/4/21.
 */
define(function (require, exports, module) {

    var kity = require('../core/kity');

    /**
     * 创建补集图标 C
     * @returns {*}
     */
    function createComplementIcon(node) {
        var g = new kity.Group();
        var rect = new kity.Rect();
        g.addShape(rect);
        var u1 = new kity.Path('m19,24l7,3c0,3 -1,5 -2,7c-1,2 -2,3 -4,4c-2,1 -4,2 -6,2c-3,0 -5,-1 -7,-2c-2,-1 -4,-3 -5,-6c-1,-3 -2,-7 -2,-12c0,-6 1,-11 4,-15c2,-3 6,-5 10,-5c3,0 6,1 8,3c2,2 3,5 4,9l-7,2c0,-1 -1,-2 -1,-3c0,-1 -1,-2 -2,-2c-1,0 -1,-1 -2,-1c-2,0 -3,1 -4,3c-1,2 -1,4 -1,8c0,4 0,7 1,9c1,2 2,2 4,2c2,0 3,-1 4,-2c1,-1 1,-3 2,-6l-1,2z');
        u1.fill(node.getStyle('complement-set-background'));
        g.scale(0.5);
        rect.setHeight(38);
        rect.setWidth(30);
        g.addShape(u1);
        g.fill = function (color) {
            rect.fill(color);
        };
        return g;
    }

    return module.exports = createComplementIcon;
});