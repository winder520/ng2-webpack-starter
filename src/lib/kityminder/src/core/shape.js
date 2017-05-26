/**
 * Created by winder on 2016/4/12.
 */
define(function (require, exports, module) {
    //已注册的形状
    var _shapes={};
    exports.register=function (name,module) {
        _shapes[name]=module;
    };
    exports.getShapeStyle=function (name) {
        return _shapes[name];
    }
});