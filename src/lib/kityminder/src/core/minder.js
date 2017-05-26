/**
 * @fileOverview
 *
 * KityMinder 类，暴露在 window 上的唯一变量
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function (require, exports, module) {
    var kity = require('./kity');
    var utils = require('./utils');

    var _initHooks = [];
    var domEventListeners = {};

    var Minder = kity.createClass('Minder', {
        constructor: function (options) {
            this._options = utils.extend({}, options);

            var initHooks = _initHooks.slice();

            var initHook;
            while (initHooks.length) {
                initHook = initHooks.shift();
                if (typeof(initHook) == 'function') {
                    initHook.call(this, this._options);
                }
            }

            this.fire('finishInitHook');
        }
    });

    Minder.version = '1.4.33';

    Minder.registerInitHook = function (hook) {
        _initHooks.push(hook);
    };
    /**
     * 将外部事件注册进来，有事件进行回调
     * @param eventType
     * @param callback
     */
    Minder.prototype.registerOnEvent = function (eventType, callback) {
        if (!domEventListeners[eventType]) {
            domEventListeners[eventType] = [];
        }
        domEventListeners[eventType].push(callback);
    };
    /**
     * 移除注册事件
     * @param eventType
     * @param callback
     */
    Minder.prototype.unregisterOnEvent = function (eventType, callback) {
        if (domEventListeners[eventType]) {
            var len = domEventListeners[eventType];
            for (var i = 0; i < len; i++) {
                if(domEventListeners[eventType][i]===callback){
                    break;
                }
            }
            domEventListeners[eventType].splice(i,1);
        }
    };
    /**
     * 执行事件
     * @param eventType
     * @param params
     */
    Minder.prototype._executeEventImmediately = function (eventType, params) {
        if (domEventListeners[eventType]) {
            domEventListeners[eventType].forEach(function (fn) {
                fn(params);
            });
        }
    };
    module.exports = Minder;
});
