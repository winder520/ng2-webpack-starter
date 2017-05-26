define(function (require, exports, module) {
    var kity = require('./kity');
    var utils = require('./utils');
    var Module = require('./module');
    var Minder = require('./minder');
    var MinderNode = require('./node');
    var Command = require('../core/command');
    var config = require('../configuration/axiom-name-config');
    // 连线提供方
    var _connectProviders = {};

    var SUPER_TYPES = 'superTypes';
    var EQUIVALENT_TYPES = 'equivalentTypes';
    var DISJOINT_WITHES = 'disjointWithes';

    function register(name, provider) {
        _connectProviders[name] = provider;
    }

    register('default', function (node, parent, connection) {
        connection.setPathData([
            'M', parent.getLayoutVertexOut(),
            'L', node.getLayoutVertexIn()
        ]);
    });

    kity.extendClass(MinderNode, {
        /**
         * @private
         * @method getConnect()
         * @for MinderNode
         * @description 获取当前节点的连线类型
         *
         * @grammar getConnect() => {string}
         */
        getConnect: function () {
            return this.data.connect || 'default';
        },

        getConnectProvider: function () {
            return _connectProviders[this.getConnect()] || _connectProviders['default'];
        },

        getConnectProviderByShape: function (name) {
            return _connectProviders[name] || _connectProviders['default'];
        },

        /**
         * @private
         * @method getConnection()
         * @for MinderNode
         * @description 获取当前节点的连线对象
         *
         * @grammar getConnection() => {kity.Path}
         */
        getConnection: function () {
            return this._connection || null;
        }
    });

    function removeTextInput() {
        var textInput = document.getElementById('shapeTextInput');
        if (textInput) {
            document.body.removeChild(textInput)
        }
    }

    Minder.registerInitHook(function () {
        this._initSelectionConnection();
    });

    kity.extendClass(Minder, {
        _initSelectionConnection: function () {
            this._selectedConnectNodes = [];
        },
        getConnectContainer: function () {
            return this._connectContainer;
        },

        createConnect: function (node) {
            if (node.isRoot()) return;
            var self = this;

            var connectionGroup = new kity.Group().setId(utils.uuid('connection_line'));

            //连接线线段
            var connection = new kity.Path();
            connectionGroup.addShape(connection);

            //连接线文本
            var connectionText = new kity.Text();
            node.data = node.data || {};
            node.data.connect = node.data.connect || {};
            connectionText.setContent(config.getName(node));

            connectionText.scale(0.6);
            connectionGroup.addShape(connectionText);

            var title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            connection.node.appendChild(title);
            connection._title = title;

            //聚合根

            // var connectionAggregation = new kity.Path();
            // connectionAggregation.setVisible(false);
            // connectionGroup.addShape(connectionAggregation);

            node._connection = connection;
            node._connectionGroup = connectionGroup;
            node._connectionText = connectionText;
            //node._connectionAggregation = connectionAggregation;
            connection.on('mousedown', function (e) {
                e.stopPropagation();
                self.selectConnect(node, true);
                var params = {
                    element: connection,
                    event: e,
                    type: 'path'
                };
                self._executeEventImmediately(e.type, params);
            });

            connection.render = function () {

                self.updateConnect(node);
            };
            /*
             connectionGroup.on('dblclick', function (e) {
             if (self.getStatus() === 'readonly')return;
             if (node.data.from === 'import')return;
             e.stopPropagation();
             var position = node._connectionText.getNode().getBoundingClientRect();
             removeTextInput();
             var textInput = document.createElement('textarea');
             textInput.id = 'shapeTextInput';
             textInput.style.position = 'absolute';
             textInput.style.top = position.top + 'px';
             textInput.style.left = position.left + 'px';
             textInput.value = node._connectionText.getContent();
             textInput.style.zIndex = 100;
             textInput.addEventListener('blur', function (e) {
             node.data.connect.name = textInput.value;
             node._connectionText.setContent(textInput.value || '');
             removeTextInput();
             self.fire('contentchange');
             }, false);
             document.body.appendChild(textInput);
             textInput.focus();
             //  var params = {
             //      element: connection,
             //      event: e
             //  };
             // self._executeEventImmediately(e.type,params);

             });*/
            this._connectContainer.addShape(connectionGroup);
            this.updateConnect(node);
        },

        removeConnect: function (node) {
            var me = this;
            node.traverse(function (node) {
                me._connectContainer.removeShape(node._connectionGroup);
                node._connection = node._connectionGroup = node._connectionText = null;
            });
        },

        updateConnect: function (node) {

            var connection = node._connection;
            var connectionGroup = node._connectionGroup;
            var parent = node.parent;

            if (!parent || !connection) return;

            if (parent.isCollapsed() || !node.isExpandedByNode()) {
                //connection.setVisible(false);
                connectionGroup.setVisible(false);
                return;
            }
            var visible = true;
            visible = node.isVisible(visible);
            if (!visible) {
                connectionGroup.setVisible(visible);
                return;
            }

            //connection.setVisible(true);
            connectionGroup.setVisible(true);

            var provider = node.getConnectProvider();
            // if (node.data.connect && node.data.connect.shape) {
            //     provider = node.getConnectProviderByShape(node.data.connect.shape);
            // }

            var strokeColor = node.getStyle('connect-color') || 'white',
                strokeWidth = node.getStyle('connect-width') || 2;

            connection.stroke(strokeColor, strokeWidth);

            provider(node, parent, connection, strokeWidth, strokeColor);
            if (!node._centerPoint) {
                var po = parent.getLayoutVertexOut(),
                    pi = node.getLayoutVertexIn();
                var v = parent.getLayoutVectorOut().normalize();
                var abs = Math.abs;
                if (abs(v.x) > abs(v.y)) {
                    // x - direction
                    var hx = (pi.x + po.x) / 2;
                    node._connectionText.setTranslate(hx, pi.y);
                } else {
                    // y - direction
                    var hy = (pi.y + po.y) / 2;
                    node._connectionText.setTranslate(pi.x, hy);
                }
            } else {
                var offsetWidth = (!node._connectionText.node) ? 0 : node._connectionText.getWidth() / 2;

                node._connectionText.setTranslate(node._centerPoint.x - offsetWidth + 10, node._centerPoint.y);
            }

            //node._connectionGroup.setTranslate(po.x,po.y);
            var name = config.getName(node) || node.data.connect.name;
            if (name) {
                node._connectionText.setVisible(true);
                if ('-父类-,-父属性-,-子类-'.indexOf('-' + name + '-') > -1)
                    node._connectionText.setVisible(false);
                node._connectionText.setContent(name);
                node._connection._title.innerHTML = name;
            }

            if (strokeWidth % 2 === 0) {
                connection.setTranslate(0.5, 0.5);
            } else {
                connection.setTranslate(0, 0);
            }

            if (node.data.connect.type === 'remove') {
                connection.fill('transparent').stroke('transparent');
            } else if (connection.isSelect)
                connection.stroke(node.getStyle('selected-connect-color'), node.getStyle('selected-connect-width'));
            else
                connection.stroke(node.getStyle('connect-color'), node.getStyle('connect-width'));

        },
        updateChangedSelection: function (last) {
            var current = this.getSelectedConnectNodes();
            var changed = [];

            current.forEach(function (node) {
                if (last.indexOf(node) == -1) {
                    changed.push(node);
                }
            });

            last.forEach(function (node) {
                if (current.indexOf(node) == -1) {
                    changed.push(node);
                }
            });

            // if (changed.length) {
            //     this._interactChange();
            //     this.fire('selectionchange');
            // }
            while (changed.length) {
                changed.shift()._connection.render();
            }
        },
        getSelectedConnectNodes: function () {
            //不能克隆返回，会对当前选区操作，从而影响querycommand
            return this._selectedConnectNodes;
        },
        getSelectedConnectNode: function () {
            return this.getSelectedConnectNodes()[0] || null;
        },
        removeAllConnectes: function () {
            var me = this;
            var last = this._selectedConnectNodes.splice(0);
            this._selectedConnectNodes = [];
            last.forEach(function (node) {
                node._connection.isSelect = false;
            });
            this.updateChangedSelection(last);
            return this.fire('selectionclear');
        },
        removeSelectedConnectNodes: function (nodes) {
            var me = this;
            var last = this._selectedConnectNodes.slice(0);
            nodes = utils.isArray(nodes) ? nodes : [nodes];

            nodes.forEach(function (node) {
                var index;
                node.isSelect = false;
                if ((index = me._selectedConnectNodes.indexOf(node)) === -1) return;
                me._selectedConnectNodes.splice(index, 1);
            });

            this.updateChangedSelection(last);
            return this;
        },
        selectConnect: function (nodes, isSingleSelect) {
            var lastSelect = this.getSelectedConnectNodes().slice(0);
            if (isSingleSelect) {
                this._selectedConnectNodes = [];
            }
            var me = this;
            nodes = utils.isArray(nodes) ? nodes : [nodes];
            lastSelect.forEach(function (node) {
                node._connection.isSelect = false;
            });
            nodes.forEach(function (node) {
                node._connection.isSelect = true;
                if (me._selectedConnectNodes.indexOf(node) !== -1) return;
                me._selectedConnectNodes.unshift(node);
            });
            this.updateChangedSelection(lastSelect);
            return this;
        }
    });

    Module.register('Connect', {
        init: function () {
            this._connectContainer = new kity.Group().setId(utils.uuid('minder_connect_group'));
            this.getRenderContainer().prependShape(this._connectContainer);
        },
        events: {
            'nodeattach': function (e) {
                this.createConnect(e.node);
            },
            'nodedetach': function (e) {
                this.removeConnect(e.node);
            },
            'layoutapply layoutfinish noderender': function (e) {
                this.updateConnect(e.node);
            }
        }
    });

    exports.register = register;
});