/**
 * Created by winder on 2016/5/18.
 */
define(function (require, exports, module) {

    var kity = require('../core/kity');

    /**
     * 创建交集图标 n
     * @returns {*}
     */
    function createPropertyRestrictionIcon(node) {
        var g = new kity.Group();
        var rect = new kity.Rect();
        g.addShape(rect);
        rect.setHeight(75);
        rect.setWidth(75);
        var u1 = new kity.Path('m17,17c8,-8 17,-13 25,-16c8,-2 16,-2 21,3c5,5 6,12 3,21c-2,8 -8,17 -16,25c-8,8 -17,13 -25,16c-8,2 -16,2 -21,-3c-5,-5 -6,-12 -3,-21c2,-8 8,-17 16,-25zm26,-12c-8,2 -16,7 -23,15c-7,7 -13,16 -15,23c-2,7 -2,13 2,17c4,4 10,4 17,2c8,-2 16,-7 23,-15c7,-7 13,-16 15,-23c2,-7 2,-13 -2,-17c-4,-4 -10,-4 -17,-2z');
        u1.fill(node.getStyle('intersection-icon-background-1'));
        var u2 = new kity.Path('m17,50c-8,-8 -13,-17 -16,-25c-2,-8 -2,-16 3,-21c5,-5 12,-6 21,-3c8,2 17,8 25,16c8,8 13,17 16,25c2,8 2,16 -3,21c-5,5 -12,6 -21,3c-8,-2 -17,-8 -25,-16zm-12,-26c2,8 7,16 15,23c7,7 16,13 23,15c7,2 13,2 17,-2c4,-4 4,-10 2,-17c-2,-8 -7,-16 -15,-23c-7,-7 -16,-13 -23,-15c-7,-2 -13,-2 -17,2c-4,4 -4,10 -2,17z');
        u2.fill(node.getStyle('intersection-icon-background-2'));
        g.addShape(u1);
        g.addShape(u2);
        g.scale(0.25);
        g.setTranslate(-22,-30);
        g.fill = function (color) {
            rect.fill(color);
        };
        return g;
    }

    return module.exports = createPropertyRestrictionIcon;
});