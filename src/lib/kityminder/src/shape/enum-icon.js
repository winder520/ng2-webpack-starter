/**
 * Created by winder on 2016/4/21.
 */
define(function (require, exports, module) {

    var kity = require('../core/kity');

    function createEnumIcon(node) {
        var g = new kity.Group();
        var rect = new kity.Rect();
        rect.setWidth(46);
        rect.setHeight(40);
        g.addShape(rect);
        g.scale(0.4);
        g.setTranslate(-22, -28);
        var top = new kity.Rect();
        top.setWidth(40);
        top.setHeight(7);
        top.fill('#0092FD');
        var middle = new kity.Rect();
        middle.setWidth(40);
        middle.setHeight(7);
        middle.fill('#0072C6');
        middle.setPositionY(14);
        var bottom = new kity.Rect();
        bottom.setWidth(40);
        bottom.setHeight(7);
        bottom.fill('#0072C6');
        bottom.setPositionY(30);
        g.addShape(top);
        g.addShape(middle);
        g.addShape(bottom);
        g.fill = function (color) {
            rect.fill(color);
        };
        return g;
    }

    return module.exports = createEnumIcon;
});