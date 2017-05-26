/**
 * Created by winder on 2016/12/7.
 */
define(function (require, exports, module) {

    var kity = require('../core/kity');

    function createFileFolderIcon(node) {
        var g = new kity.Group();
        var body = new kity.Path('M26 30l6-16h-26l-6 16zM4 12l-4 18v-26h9l4 4h13v4z');
        body.fill(node.getStyle('folder-icon-background'));
        g.addShape(body);
        g.scale(0.6);
        return g;
    }

    return module.exports = createFileFolderIcon;
});