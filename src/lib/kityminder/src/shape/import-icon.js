/**
 * Created by winder on 2016/4/21.
 */
define(function (require, exports, module) {

    var kity = require('../core/kity');

    /**
     * 导入图标
     * @returns {*}
     */
    function createImportIcon(node) {
        var importIcon = new kity.Group();
        var importBg = new kity.Rect();
        importBg.setWidth(70);
        importBg.setHeight(45);
        var p = new kity.Polygon([
            new kity.Point(36, 14),
            new kity.Point(71, 14),
            new kity.Point(71, 29),
            new kity.Point(36, 29),
            new kity.Point(36, 44),
            new kity.Point(0, 21),
            new kity.Point(36, 0)
        ]);
        p.fill(node.getStyle('import-icon-background'));
        importIcon.scale(0.2);
        importIcon.addShape(importBg);
        importIcon.addShape(p);
        importIcon.fill = function (color) {
            importBg.fill(color);
        };
        return importIcon;
    }

    return module.exports = createImportIcon;
});