define(function (require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var Minder = require('../core/minder');
    var MinderNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');
    var restriction = require('../configuration/restriction-config');


    /**
     * @command AppendChildNode
     * @description 添加子节点到选中的节点中
     * @param {string|object} textOrData 要插入的节点的文本或数据
     * @state
     *    0: 当前有选中的节点
     *   -1: 当前没有选中的节点
     */
    var AppendChildCommand = kity.createClass('AppendChildCommand', {
        base: Command,
        execute: function (km, text) {
            var parent = km.getSelectedNode();
            if (!parent) {
                return null;
            }
            if (parent.isReadOnly()) {
                return null;
            }
            var node = km.createNode(text, parent);
            km.select(node, true);
            if (parent.isExpanded()) {
                node.render();
            }
            else {
                parent.expand();
                parent.renderTree();
            }
            km.layout(600);
        },
        queryState: function (km) {
            var selectedNode = km.getSelectedNode();
            return selectedNode ? 0 : -1;
        }
    });

    function appendChildNode(km, textOrObj, parentNode) {
        if (!parentNode) {
            return null;
        }
        var node = km.createNode(textOrObj, parentNode);
        km.select(node, true);
        if (parentNode.isExpanded()) {
            node.render();
        }
        else {
            parentNode.expand();
            parentNode.renderTree();
        }
        km.layout(600);
    }

    /**
     * @command AppendSiblingNode
     * @description 添加选中的节点的兄弟节点
     * @param {string|object} textOrData 要添加的节点的文本或数据
     * @state
     *    0: 当前有选中的节点
     *   -1: 当前没有选中的节点
     */
    var AppendSiblingCommand = kity.createClass('AppendSiblingCommand', {
        base: Command,
        execute: function (km, text) {
            var sibling = km.getSelectedNode();
            var parent = sibling.parent;
            if (!parent) {
                return km.execCommand('AppendChildNode', text);
            }
            var node = km.createNode(text, parent, sibling.getIndex() + 1);
            node.setGlobalLayoutTransform(sibling.getGlobalLayoutTransform());
            km.select(node, true);
            node.render();
            km.layout(600);
        },
        queryState: function (km) {
            var selectedNode = km.getSelectedNode();
            return selectedNode ? 0 : -1;
        }
    });

    /**
     * @command RemoveNode
     * @description 移除选中的节点
     * @state
     *    0: 当前有选中的节点
     *   -1: 当前没有选中的节点
     */
    var RemoveNodeCommand = kity.createClass('RemoverNodeCommand', {
        base: Command,
        execute: function (km, isOnlyRemoveSelect) {
            var nodes = km.getSelectedNodes();
            var ancestor = MinderNode.getCommonAncestor.apply(null, nodes);
            var index = nodes[0].getIndex();
            var node = nodes[0];
            var referenceClassList = [];
            if (!node.data.isReference) {
                referenceClassList = km.getNodesByIri(node.data.iri, function (n) {
                    return n.data.isReference;
                });
            }

            if (!isOnlyRemoveSelect) {
                nodes.forEach(function (node) {
                    if (!node.isRoot()) km.removeNode(node);
                });
            } else {
                nodes.forEach(function (node) {
                    if (node.isRoot())return;
                    var parent = node.parent;
                    var children = node.children;
                    var awaitRemoveList = [];
                    var axiomNodes = [];
                    for (var i = children.length - 1; i >= 0; i--) {
                        if (children[i].data.isReference || children[i].data.category === 'propertyRestriction') {
                            //km.removeNode(children[0]);
                            awaitRemoveList.push(children[i]);
                        } else {
                            axiomNodes.push(children[i]);
                        }
                    }
                    awaitRemoveList.forEach(function (item) {
                        km.removeNode(item);
                    });
                    //如果仅删除自身 则当前节点下非引用并且是为类或属性的要先执行移除公理
                    axiomNodes.forEach(function (item) {
                        km.execCommand('RemoveAxiom', {
                            selectId: item.data.id,
                            id: node.data.id,
                            type: item.data.connect.type
                        })
                    });

                    km.execCommand('movetoparent', children, parent);
                    km.removeSelectNode(node);
                });
            }
            for (var j = 0, len = referenceClassList.length; j < len; j++) {
                if (referenceClassList[j].parent.data.category === 'propertyRestriction') {
                    km.removeNode(referenceClassList[j].parent);
                    continue;
                }
                km.removeNode(referenceClassList[j]);
            }
            if (nodes.length == 1) {
                var selectBack = ancestor.children[index - 1] || ancestor.children[index];
                km.select(selectBack || ancestor || km.getRoot(), true);
            } else {
                km.select(ancestor || km.getRoot(), true);
            }
            km.layout(600);
        },
        queryState: function (km) {
            var selectedNode = km.getSelectedNode();
            return selectedNode && !selectedNode.isRoot() ? 0 : -1;
        }
    });

    var AppendParentCommand = kity.createClass('AppendParentCommand', {
        base: Command,
        execute: function (km, text) {
            var nodes = km.getSelectedNodes();

            nodes.sort(function (a, b) {
                return a.getIndex() - b.getIndex();
            });
            var parent = nodes[0].parent;

            var newParent = km.createNode(text, parent, nodes[0].getIndex());
            nodes.forEach(function (node) {
                newParent.appendChild(node);
            });
            newParent.setGlobalLayoutTransform(nodes[nodes.length >> 1].getGlobalLayoutTransform());

            km.select(newParent, true);
            km.layout(600);
        },
        queryState: function (km) {
            var nodes = km.getSelectedNodes();
            if (!nodes.length) return -1;
            var parent = nodes[0].parent;
            if (!parent) return -1;
            for (var i = 1; i < nodes.length; i++) {
                if (nodes[i].parent != parent) return -1;
            }
            return 0;
        }
    });

    /**
     * 连接线
     */
    var ConnectCommand = kity.createClass({
        base: Command,
        execute: function (minder, obj) {
            var node = minder.getSelectedConnectNode();
            if (node) {
                var connect = node._connection;
                for (var key in obj) {
                    connect[key] = obj[key];
                }
                connect.render();
            }
        },
        queryState: function (minder) {
            var nodes = minder.getSelectedConnectNodes();
            return nodes.length === 1 ? 0 : -1;
        }
    });

    function editAxiom(minder, obj, startNode) {
        if (startNode.parent.isRoot()) {
            startNode.parent.data.iri = startNode.parent.data.iri || startNode.parent.data.id;
            if (obj.iri === obj.oldAxiom.iri && obj.iri === obj.iri) {
                startNode.data.connect.type = obj.axioms;
                startNode._connection.render();
                return;
            } else if (obj.iri === obj.oldAxiom.iri) {
                //从父类修改为其它类型 则将当前类移到Thing节点下面 然后再添加节点 todo 添加节点
                if ('superTypes,superProperties'.indexOf(startNode.parent.data.connect.type) > -1 && 'superTypes,superProperties'.indexOf(startNode.parent.data.connect.type) === -1) {
                    if (startNode.parent.data.isReference)
                        minder.removeNode(startNode.parent);
                    minder.execCommand('movetoparent', [startNode], minder.getRoot());
                    //从服务器端取得的数据
                    if (obj.textOrObj) {
                        obj.textOrObj.id = utils.guid();
                        appendChildNode(minder, obj.textOrObj, startNode);

                    }
                } else if ('superTypes,superProperties'.indexOf(startNode.parent.data.connect.type) > -1 && 'superTypes,superProperties'.indexOf(obj.textOrObj.connect.type) > -1) {
                    minder.execCommand('movetoparent', [startNode], minder.getRoot());
                    var parentNode = minder.getNodeById(obj.iri);
                    if (!parentNode) {

                        minder.execCommand('AppendChildNode', obj.textOrObj, minder.getRoot());
                        parentNode = minder.getSelectedNode();
                    }
                    minder.execCommand('movetoparent', [startNode], parentNode);

                }
                return;
                //首先判断是否在当前界面中是否存在这个元素
            }
        } else if (startNode.parent.data.iri === obj.oldAxiom.iri) {
            //修改原来父节点公理
            if ('superTypes,superProperties'.indexOf(obj.axioms) > -1) {
                parentNode = minder.getNodeById(obj.textOrObj.iri);
                minder.execCommand('movetoparent', [startNode], parentNode);
            }
            else {
                minder.execCommand('movetoparent', [startNode], startNode.parent.parent);
                minder.execCommand('AppendChildNode', obj.textOrObj, startNode);
            }
            return;
        }

        //先判断子类是否是指定类型
        var children = startNode.children, childNode;
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i].data.iri === obj.oldAxiom.iri && children[i].data.connect.type === obj.oldAxiom.type) {
                childNode = children[i];
                break;
            }
        }
        if (childNode && obj.iri === obj.oldAxiom.iri) {
            childNode.data.connect.type = obj.axioms;
            childNode._connection.render();
        } else if (childNode) {
            if (childNode.data.isReference)
                minder.removeNode(childNode);
            if ('superTypes,superProperties'.indexOf(obj.axioms) > -1 && startNode.parent.isRoot()) {
                var parentNode = minder.getNodeById(obj.textOrObj.iri);
                minder.execCommand('movetoparent', [startNode], parentNode);
            } else {
                minder.execCommand('AppendChildNode', obj.textOrObj, startNode);
            }
        }
    }

    /**
     * 添加公理
     */
    var AddAxiomCommand = kity.createClass('AddAxiomCommand', {
        base: Command,
        execute: function (minder, obj) {
            /**
             * {
             *    startIri:"",
             *    category:"",
             *    localName:"",
             *    iri:"",
             *    label:"",
             *    axioms:"" //
             * }
             */
            var selectNode = minder.getSelectedNode();
            var startNode = minder.getNodeById(obj.startIri);

            if (!startNode && selectNode.data.iri === obj.startIri) {
                startNode = selectNode;
            }
            if (!startNode)return;

            //判断父类是否是
            if (obj.state === 'edit' && !obj.oldAxiom.isManchester) {
                editAxiom(minder, obj, startNode);
                minder.select(selectNode, true);
                minder.layout(600);
                return;
            } else if (obj.state === 'edit') {
                //删除属性约束
                var delNode = minder.getNodeById(obj.oldAxiom.delNodeId);
                if (delNode)
                    minder.removeNode(delNode);
                //添加公理留下面来做
            }
            if (startNode.parent && startNode.parent.isRoot() && 'superProperties,superTypes'.indexOf(obj.textOrObj.connect.type) > -1) {
                var endNode = minder.getNodeById(obj.iri);
                if (!endNode) {
                    obj.textOrObj.id = utils.guid();
                    if ('advanced,class,enum,anonymity'.indexOf(obj.textOrObj.category) > -1) {
                        obj.textOrObj.connect.type = 'subClassOf';
                    } else if ('property' === obj.textOrObj.category) {
                        obj.textOrObj.connect.type = 'subPropertyOf';
                    }
                    appendChildNode(minder, obj.textOrObj, minder.getRoot());
                    endNode = minder.getSelectedNode();
                }
                minder.execCommand('movetoparent', [startNode], endNode);
                if (endNode && endNode.isExpanded()) {
                    endNode.render();
                }
                else if (endNode) {
                    endNode.expand();
                    endNode.renderTree();
                }
                if (selectNode)
                    minder.select(selectNode, true);
                minder.layout(600);
                return;
            }


            //从服务器端取得的数据
            if (obj.textOrObj) {
                obj.textOrObj.id = utils.guid();
                appendChildNode(minder, obj.textOrObj, startNode);
                if (selectNode)
                    minder.select(selectNode, true);
                return;
            }
            //创建 一个引用类型
            var node = minder.getNodeById(obj.iri);
            if (!node)return;
            var nodeData = {};
            if (node)
                nodeData = utils.clone(node.data);
            nodeData.id = startNode.data.iri + obj.iri + obj.type;
            nodeData.iri = obj.iri;
            nodeData.text = obj.localName;
            nodeData.localName = obj.localName;
            nodeData.isReference = true;
            nodeData.connect = {
                type: obj.axioms
            };
            appendChildNode(minder, nodeData, startNode);
            if (selectNode)
                minder.select(selectNode, true);
            minder.layout(600);
        },
        queryState: function (minder) {
            var selectNodes = minder.getSelectedNodes();
            return selectNodes.length === 1 ? 0 : -1;
        }
    });

    /**
     * 移除公理
     */
    var RemoveAxiomCommand = kity.createClass('RemoveAxiomCommand', {
        base: Command,
        execute: function (minder, obj) {

            var selectNode = minder.getSelectedNode();
            var startNode = minder.getNodeById(obj.selectId);
            if (!startNode && selectNode.parent.data.iri === obj.selectId) {
                startNode = selectNode.parent;
            }
            if (!startNode)return;
            var parentNode = startNode.parent;

            var childrenNodes = startNode.children.sort(function (a, b) {
                return a.created > b.created ? 1 : -1;
            });
            var len = childrenNodes.length;
            var node;

            if (parentNode && parentNode.data.iri == obj.id) {
                //在移除当前父类的公理时 判断子类是有公理为父类的情况 如果有，则要移动到指定的父类并删除当前子节点
                if (parentNode.isRoot() && 'root' !== parentNode.data.category) {
                    minder.removeNode(startNode);
                    minder.select(selectNode, true);
                    minder.layout(600);
                    return;
                }
                for (var j = 0; j < len; j++) {
                    if ('superProperties,superTypes'.indexOf(childrenNodes[j].data.connect.type) > -1 && childrenNodes[j].data.isReference) {
                        node = childrenNodes[j];
                        break;
                    }
                }
                if (node) {
                    var tempParentNode = minder.getNodeById(node.data.iri);
                    if (tempParentNode) {
                        minder.execCommand('movetoparent', [startNode], tempParentNode);
                        minder.removeNode(node);
                    } else {
                        minder.execCommand('movetoparent', [startNode], node);
                        minder.execCommand('movetoparent', [node], minder.getRoot());
                    }
                } else {
                    minder.execCommand('movetoparent', [startNode], minder.getRoot());
                }
                if (parentNode.data.isReference)
                    minder.removeNode(parentNode);
                minder.select(selectNode, true);
                minder.layout(600);
                return;
            }
            for (var i = 0; i < len; i++) {
                node = childrenNodes[i];
                if (obj.id === node.data.iri && obj.type === node.data.connect.type) {
                    if (node.data.isReference || node.data.category === 'dataPropertyValue') {
                        minder.removeNode(node);
                    } else {
                        minder.execCommand('movetoparent', [node], minder.getRoot());
                        // node.data.connect.type = 'remove';
                        // node._connection.render();
                    }
                    break;
                }
            }
            minder.layout(600);
        },
        queryState: function (minder) {
            var nodes = minder.getSelectedNodes();
            return nodes.length === 1 ? 0 : -1;
        }
    });

    /**
     * 切换公理类型
     */
    var ChangeAxiomTypeCommand = kity.createClass('ChangeAxiomTypeCommand', {
        base: Command,
        execute: function (minder, obj) {

            var selectNode = minder.getSelectedNode();
            if (selectNode.data.id !== obj.selectId)return;
            var parentNode = selectNode.parent;
            if (parentNode.data.id == obj.id) {
                selectNode.data.connect = selectNode.data.connect || {};
                selectNode.data.connect.type = obj.type;
                selectNode._connection.render();
            }
            var childrenNodes = selectNode.children;
            var node;
            for (var i = 0, len = childrenNodes.length; i < len; i++) {
                node = childrenNodes[i];
                if (obj.id === node.data.iri && obj.oldType === node.data.connect.type) {
                    node.data.connect.type = obj.type;
                    node._connection.render();
                    break;
                }
            }
        },
        queryState: function (minder) {
            var nodes = minder.getSelectedNodes();
            return nodes.length === 1 && !nodes[0].isReadOnly() ? 0 : -1;
        }
    });

    var SetGraphTypeCommand = kity.createClass('SetGraphTypeCommand', {
        base: Command,
        execute: function (minder, obj) {
            var node = minder.getRoot();
            node.data = node.data || {};
            node.data.graphType = obj.type;
            node.renderTree();
            minder.layout();
        },
        queryState: function (minder) {
            return 0;
        }
    });

    var RemoveReferenceNodeCommand = kity.createClass('RemoveReferenceNodeCommand', {
        base: Command,
        execute: function (minder, obj) {
            var allNodes = minder.getAllNode();
            var removeNodes = [];
            var removeIdList = [];
            allNodes.forEach(function (item) {
                if (item.data.iri) {
                    var namespace = item.data.iri.split('#')[0] + '#';
                    if (obj[item.data.iri] && obj[item.data.iri].type === 'property' &&
                        (item.data.category === 'property' || item.data.category === 'propertyRestriction')) {
                        removeNodes.push(item);
                        removeIdList.push(obj[item.iri].id);
                    } else if (obj[item.data.iri] && obj[item.data.iri].type === 'class' && 'advanced,class,enum,anonymity'.indexOf(item.data.category) > -1) {
                        removeNodes.push(item);
                        removeIdList.push(obj[item.data.iri].id);
                    } else if (obj[namespace] && obj[namespace].type === 'ontology') {
                        removeNodes.push(item);
                        removeIdList.push(obj[item.data.iri].id);
                    }
                }
            });
            removeNodes.forEach(function (item) {
                if (item.category === 'propertyRestriction') {
                    minder.removeNode(item);
                } else if (item.parent.isRoot() && item.children.length > 0) {
                    minder.execCommand('movetoparent', item.children, item.parent);
                    minder.removeNode(item);
                } else {
                    minder.removeNode(item);
                }
            });

            return removeIdList;
        },
        queryState: function (minder) {
            return 0;
        }

    });

    /**
     * 创建属性约束后面的值的节点
     * @param minder
     * @param obj
     * @param parentNode
     */
    function createPropertyValue(minder, obj, parentNode) {
        obj.restrictionType = obj.restrictionType || '';
        if (obj.type === 'data' && obj.restrictionValue.onTypeInfo && obj.restrictionValue.onTypeInfo.onTypeIRI) {
            var dataNode = {
                category: 'dataPropertyValue',
                text: obj.restrictionValue.onTypeInfo ? obj.restrictionValue.onTypeInfo.onTypeIRI : '',
                connect: {
                    name: restriction.getMapConfig(obj.restrictionType)
                }
            };
            appendChildNode(minder, dataNode, parentNode);
        } else if ((obj.type === 'data' && obj.restrictionValue.onTypeInfo && obj.restrictionValue.onTypeInfo.typeAtomInfo) || (obj.type === 'object')) {
            if (obj.textOrObj) {
                appendChildNode(minder, obj.textOrObj, parentNode);
            }
        } else if (obj.type === 'data' && obj.restrictionValue.value) {
            var dataNode = {
                category: 'text',
                text: obj.restrictionValue.value.value,
                iri: obj.restrictionValue.value.valueType,
                connect: {
                    name: restriction.getMapConfig(obj.restrictionType)
                }
            };
            appendChildNode(minder, dataNode, parentNode);
        }
    }

    /**
     * 添加属性约束
     */
    var AddPropertyRestrictionCommand = kity.createClass('AddPropertyRestrictionCommand', {
        base: Command,
        execute: function (minder, obj) {
            var node = minder.getSelectedNode();
            var textOrData = obj.textOrObj;
            delete obj.textOrObj;
            //minder.execCommand('AppendChildNode', obj);
            var parentNode = minder.getNodeById(obj.startIri);
            delete obj.startIri;
            appendChildNode(minder, obj, parentNode);
            var selectNode = minder.getSelectedNode();
            obj.textOrObj = textOrData;
            createPropertyValue(minder, obj, selectNode);
            minder.select(node, true);
        },
        queryState: function (minder) {
            var nodes = minder.getSelectedNodes();
            return nodes.length === 1 ? 0 : -1;
        }
    });

    /**
     * 编辑属性约束
     */
    var EditPropertyRestrictionCommand = kity.createClass('EditPropertyRestrictionCommand', {
        base: Command,
        execute: function (minder, obj) {
            var node = minder.getSelectedNode();
            var propertyNode;
            for (var i = 0, len = node.children.length; i < len; i++) {
                if (node.children[i].data.category === 'propertyRestriction' && node.children[i].data.id === obj.oldId) {
                    propertyNode = node.children[i];
                    break;
                }
            }
            if (!propertyNode)return;
            for (var key in obj) {
                if (key !== 'textOrObj')
                    propertyNode.data[key] = obj[key];
            }
            if (propertyNode.children && propertyNode.children.length > 0)
                minder.removeNode(propertyNode.children[0]);
            createPropertyValue(minder, obj, propertyNode);
            propertyNode.render();
            minder.select([node], true);
        },
        queryState: function (minder) {
            var nodes = minder.getSelectedNodes();
            return nodes.length === 1 ? 0 : -1;
        }
    });

    /**
     * 编辑属性约束
     */
    var RemovePropertyRestrictionCommand = kity.createClass('RemovePropertyRestrictionCommand', {
        base: Command,
        execute: function (minder, obj) {
            var node = minder.getSelectedNode();
            var propertyNode;
            for (var i = 0, len = node.children.length; i < len; i++) {
                if (node.children[i].data.category === 'propertyRestriction' && node.children[i].data.id === obj.id) {
                    propertyNode = node.children[i];
                    break;
                }
            }
            if (!propertyNode)return;
            minder.removeNode(propertyNode);
            minder.layout(600);
        },
        queryState: function (minder) {
            var nodes = minder.getSelectedNodes();
            return nodes.length === 1 && !nodes[0].isReadOnly() ? 0 : -1;
        }
    });

    /**
     * 添加或修改实例断言
     */
    /*var AddOrEditIndividualAssertCommand = kity.createClass('AddOrEditIndividualAssertCommand', {
     base: Command,
     execute: function (minder, obj) {
     var select = minder.getSelectedNode();
     var individualNode = minder.getNodeById(obj.individualIri);
     if (!individualNode)return;
     var property;
     for (var i = 0, len = individualNode.children; i < len; i++) {
     if (individualNode.children[i].iri === obj.propertyIri) {
     property = individualNode.children[i];
     }
     }
     if (!property) {
     property = minder.createNode(obj.propertyObj, individualNode);
     }

     switch (obj.state) {
     case 'edit':

     break;
     case 'add':
     minder.createNode(obj.assertObj, property);
     break;
     default:

     break;
     }

     minder.select(select, true);
     minder.layout();
     },
     queryState: function (minder) {
     var graphType = minder.getLayoutGraphType();
     return 'individual' === graphType ? 0 : -1;
     }
     });*/

    /**
     * 删除实例断言
     */
    var RemoveIndividualAssertCommand = kity.createClass('RemoveIndividualAssertCommand', {
        base: Command,
        execute: function (minder, obj) {
            var select = minder.getSelectedNode();
            var individualNode = minder.getNodeById(obj.individualIri);
            if (!individualNode)return;
            var len = individualNode.children.length;
            var property, individual;
            for (var i = 0; i < len; i++) {
                property = individualNode.children[i];
                if (property.data.iri === obj.propertyIri) {
                    break;
                }
                property = null;
            }
            if (!property)return;
            len = property.children.length;
            if (len === 1) {
                minder.removeNode(property);
            } else {
                for (var j = 0; j < len; j++) {
                    individual = property.children[j];
                    if ('individual' === obj.valueType && individual.data.iri === obj.value && individual.data.valueType === obj.valueType) {
                        minder.removeNode(individual);
                        break;
                    } else if (individual.data.text === obj.value && individual.data.valueType === obj.valueType) {
                        minder.removeNode(individual);
                        break;
                    }
                }

            }
            minder.select(select, true);
            minder.layout();
        },
        queryState: function (minder) {
            var graphType = minder.getLayoutGraphType();
            return 'individual' === graphType ? 0 : -1;
        }
    });


    Module.register('NodeModule', function () {
        return {
            commands: {
                'AppendChildNode': AppendChildCommand,
                'AppendSiblingNode': AppendSiblingCommand,
                'RemoveNode': RemoveNodeCommand,
                'AppendParentNode': AppendParentCommand,
                'Connect': ConnectCommand,
                'RemoveAxiom': RemoveAxiomCommand,
                'AddAxiom': AddAxiomCommand,
                'ChangeAxiomType': ChangeAxiomTypeCommand,
                'SetGraphType': SetGraphTypeCommand,
                'AddPropertyRestriction': AddPropertyRestrictionCommand,
                'EditPropertyRestriction': EditPropertyRestrictionCommand,
                'RemovePropertyRestriction': RemovePropertyRestrictionCommand,
                'RemoveReferenceNode': RemoveReferenceNodeCommand,
                'RemoveIndividualAssert': RemoveIndividualAssertCommand
            },

            'commandShortcutKeys': {
                'appendsiblingnode': 'normal::Enter',
                'appendchildnode': 'normal::Insert|Tab',
                'appendparentnode': 'normal::Shift+Tab|normal::Shift+Insert',
                'removenode': 'normal::Del|Backspace'
            }
        };
    });
});