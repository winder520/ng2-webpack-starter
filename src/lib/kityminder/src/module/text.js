define(function (require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var Minder = require('../core/minder');
    var MinderNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');
    var restrictionMap = require('../configuration/restriction-config');
    /**
     * 针对不同系统、不同浏览器、不同字体做居中兼容性处理
     * 暂时未增加Linux的处理
     */
    var FONT_ADJUST = {
        'safari': {
            '微软雅黑,Microsoft YaHei': -0.17,
            '楷体,楷体_GB2312,SimKai': -0.1,
            '隶书, SimLi': -0.1,
            'comic sans ms': -0.23,
            'impact,chicago': -0.15,
            'times new roman': -0.1,
            'arial black,avant garde': -0.17,
            'default': 0
        },
        'ie': {
            10: {
                '微软雅黑,Microsoft YaHei': -0.17,
                'comic sans ms': -0.17,
                'impact,chicago': -0.08,
                'times new roman': 0.04,
                'arial black,avant garde': -0.17,
                'default': -0.15
            },
            11: {
                '微软雅黑,Microsoft YaHei': -0.17,
                'arial,helvetica,sans-serif': -0.17,
                'comic sans ms': -0.17,
                'impact,chicago': -0.08,
                'times new roman': 0.04,
                'sans-serif': -0.16,
                'arial black,avant garde': -0.17,
                'default': -0.15
            }
        },
        'edge': {
            '微软雅黑,Microsoft YaHei': -0.15,
            'arial,helvetica,sans-serif': -0.17,
            'comic sans ms': -0.17,
            'impact,chicago': -0.08,
            'sans-serif': -0.16,
            'arial black,avant garde': -0.17,
            'default': -0.15
        },
        'sg': {
            '微软雅黑,Microsoft YaHei': -0.15,
            'arial,helvetica,sans-serif': -0.05,
            'comic sans ms': -0.22,
            'impact,chicago': -0.16,
            'times new roman': -0.03,
            'arial black,avant garde': -0.22,
            'default': -0.15
        },
        'chrome': {
            'Mac': {
                'andale mono': -0.05,
                'comic sans ms': -0.3,
                'impact,chicago': -0.13,
                'times new roman': -0.1,
                'arial black,avant garde': -0.17,
                'default': 0
            },
            'Win': {
                '微软雅黑,Microsoft YaHei': -0.15,
                'arial,helvetica,sans-serif': -0.02,
                'arial black,avant garde': -0.2,
                'comic sans ms': -0.2,
                'impact,chicago': -0.12,
                'times new roman': -0.02,
                'default': -0.15
            },
            'Lux': {
                'andale mono': -0.05,
                'comic sans ms': -0.3,
                'impact,chicago': -0.13,
                'times new roman': -0.1,
                'arial black,avant garde': -0.17,
                'default': 0
            }
        },
        'firefox': {
            'Mac': {
                '微软雅黑,Microsoft YaHei': -0.2,
                '宋体,SimSun': 0.05,
                'comic sans ms': -0.2,
                'impact,chicago': -0.15,
                'arial black,avant garde': -0.17,
                'times new roman': -0.1,
                'default': 0.05
            },
            'Win': {
                '微软雅黑,Microsoft YaHei': -0.16,
                'andale mono': -0.17,
                'arial,helvetica,sans-serif': -0.17,
                'comic sans ms': -0.22,
                'impact,chicago': -0.23,
                'times new roman': -0.22,
                'sans-serif': -0.22,
                'arial black,avant garde': -0.17,
                'default': -0.16
            },
            'Lux': {
                "宋体,SimSun": -0.2,
                "微软雅黑,Microsoft YaHei": -0.2,
                "黑体, SimHei": -0.2,
                "隶书, SimLi": -0.2,
                "楷体,楷体_GB2312,SimKai": -0.2,
                "andale mono": -0.2,
                "arial,helvetica,sans-serif": -0.2,
                "comic sans ms": -0.2,
                "impact,chicago": -0.2,
                "times new roman": -0.2,
                "sans-serif": -0.2,
                "arial black,avant garde": -0.2,
                "default": -0.16
            }
        },
    };

    var DATATYPE_MAP = {
        'http://www.w3.org/2001/XMLSchema': 'xsd',
        'http://www.w3.org/2002/07/owl': 'owl',
        'http://www.w3.org/1999/02/22-rdf-syntax-ns': 'rdf',
        'http://www.w3.org/2000/01/rdf-schema': 'rdfs'
    };

    /**
     * 生成类的值
     * @param node
     * @param classValue
     * @param ellipsis
     * @returns {*}
     */
    function generateClassValue(node, classValue, ellipsis) {
        var dataArr;
        if (node.data.type === 'data') {
            if (node.data.restrictionValue.onTypeInfo && node.data.restrictionValue.onTypeInfo.onTypeIRI) {
                dataArr = node.data.restrictionValue.onTypeInfo.onTypeIRI.split('#');
                if (dataArr.length == 2)
                    classValue += DATATYPE_MAP[dataArr[0]] + ':' + dataArr[1];
            } else {
                classValue += ellipsis;
            }
        } else if (node.data.type === 'object') {
            classValue += !node.data.restrictionValue.onTypeInfo ? '' : (node.data.restrictionValue.onTypeInfo.onTypeIRI ? node.data.restrictionValue.onTypeInfo.onTypeIRI.split('#')[1] : ellipsis);
        }
        return classValue;
    }

    var TextRenderer = kity.createClass('TextRenderer', {
        base: Renderer,

        create: function () {
            return new kity.Group().setId(utils.uuid('node_text'));
        },

        update: function (textGroup, node) {

            function getDataOrStyle(name) {
                return node.getData(name) || node.getStyle(name);
            }

            var nodeText = node.getText();
            var textArr = nodeText ? nodeText.split('\n') : [' '];

            var lineHeight = node.getStyle('line-height');

            var fontSize = getDataOrStyle('font-size');
            var fontFamily = getDataOrStyle('font-family') || 'default';

            var height = (lineHeight * fontSize) * textArr.length - (lineHeight - 1) * fontSize;
            var yStart = -height / 2;
            var Browser = kity.Browser;
            var adjust;

            if (Browser.chrome || Browser.opera || Browser.bd || Browser.lb === "chrome") {
                adjust = FONT_ADJUST['chrome'][Browser.platform][fontFamily];
            } else if (Browser.gecko) {
                adjust = FONT_ADJUST['firefox'][Browser.platform][fontFamily];
            } else if (Browser.sg) {
                adjust = FONT_ADJUST['sg'][fontFamily];
            } else if (Browser.safari) {
                adjust = FONT_ADJUST['safari'][fontFamily];
            } else if (Browser.ie) {
                adjust = FONT_ADJUST['ie'][Browser.version][fontFamily];
            } else if (Browser.edge) {
                adjust = FONT_ADJUST['edge'][fontFamily];
            } else if (Browser.lb) {
                // 猎豹浏览器的ie内核兼容性模式下
                adjust = 0.9;
            }

            textGroup.setTranslate(0, (adjust || 0) * fontSize);

            var rBox = new kity.Box(),
                r = Math.round;
            var dataArr, value;

            this.setTextStyle(node, textGroup);

            var textLength = textArr.length;

            var textGroupLength = textGroup.getItems().length;
            var i, ci, textShape, text;

            if (textLength < textGroupLength) {
                for (i = textLength, ci; ci = textGroup.getItem(i);) {
                    textGroup.removeItem(i);
                }
            } else if (textLength > textGroupLength) {
                var growth = textLength - textGroupLength;
                while (growth--) {
                    textShape = new kity.Text()
                        .setAttr('text-rendering', 'inherit');

                    if (kity.Browser.ie || kity.Browser.edge) {
                        textShape.setVerticalAlign('top');
                    } else {
                        textShape.setAttr('dominant-baseline', 'text-before-edge');
                    }
                    textGroup.addItem(textShape);
                }
            }

            for (i = 0, text, textShape;
                 (text = textArr[i], textShape = textGroup.getItem(i)); i++) {
                if (node.data.category === 'anonymity') {
                    textShape.setContent('');
                    textShape.addShape(new kity.TextSpan(node.data.propertyRestriction));
                    value = new kity.TextSpan(' ' + node.data.valueRestriction + ' ').fill(node.getStyle('text-value-restriction-color'));
                    textShape.addShape(value);
                    textShape.addShape(new kity.TextSpan(text));
                } else if (node.data.category === 'property' && node.data.type === 'data') {
                    textShape.setContent('');
                    textShape.addShape(new kity.TextSpan(text));
                    node.data.value = node.data.value || '';
                    textShape.addShape(new kity.TextSpan(' ' + node.data.value).fill(node.getStyle('text-value-restriction-color')));
                } else if (node.getRoot().data.graphType === 'class-class' && node.data.category === 'propertyRestriction') {
                    node._currentTextGroupBox = null;
                    textShape.setContent('');
                    textShape.addShape(new kity.TextSpan(text));
                    value = new kity.TextSpan(' ' + restrictionMap.getMapConfig(node) + ' ').fill(node.getStyle('text-value-restriction-color'));
                    textShape.addShape(value);
                    var classValue = '';
                    switch (node.data.restrictionType) {
                        case 'allValuesFromRestriction':
                        case 'someValuesFromRestriction':
                            classValue = generateClassValue(node, classValue, '...');
                            break;
                        case 'hasValueRestriction':
                            break;
                        case 'maxCardinalityRestriction':
                            classValue = node.data.restrictionValue.maxCardinality || '';
                            break;
                        case 'qualifiedCardinality':
                            classValue = node.data.restrictionValue.cardinality || '';
                            classValue += ' ';
                            classValue = generateClassValue(node, classValue, '');
                            break;
                        case 'minQualifiedCardinality':
                            classValue = node.data.restrictionValue.minCardinality || '';
                            classValue += ' ';
                            classValue = generateClassValue(node, classValue, '');
                            break;
                        case 'maxQualifiedCardinality':
                            classValue = node.data.restrictionValue.maxCardinality || '';
                            classValue += ' ';
                            classValue = generateClassValue(node, classValue, '');
                            break;
                        case 'minCardinalityRestriction':
                            classValue = node.data.restrictionValue.minCardinality || '';
                            break;
                        case 'cardinalityRestriction':
                            classValue = node.data.restrictionValue.cardinality || '';
                            break;
                    }
                    textShape.addShape(new kity.TextSpan(classValue));

                } else if (node.data.category === 'dataPropertyValue') {
                    dataArr = text.split('#');
                    if (dataArr.length == 2)
                        textShape.setContent(DATATYPE_MAP[dataArr[0]] + ':' + dataArr[1]);
                    else
                        textShape.setContent(text);
                } else if (node.data.category === 'root') {
                    if (node.data.graphType === 'property')
                        textShape.setContent(node.data.ontologyName || text);
                    else
                        textShape.setContent('Thing');
                    node._currentTextGroupBox = null;
                } else if (node.data.category === 'text') {
                    var temp=utils.clearHtml(text);
                    textShape.setContent(temp.length > 15 ? temp.substr(0, 15) + '...' : temp);
                } else {
                    if (node.data.category === 'propertyRestriction') {
                        node._currentTextGroupBox = null;
                    }
                    textShape.setContent(text);
                }
                if (!textShape._title) {
                    var title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
                    textGroup.node.appendChild(title);
                    textShape._title = title;
                }
                var showText = text;
                if ('text' === node.data.category) {
                    showText = text || '';
                    textShape._title.innerHTML = showText;
                }
                else if ('root' !== node.data.category) {
                    showText = node.data.iri || text || '';
                    var prefixs = node.getRoot().data.prefixs;
                    if (node.data.iri && prefixs) {
                        showText = node.data.iri;
                        var iriSplit = node.data.iri.split('#');
                        for (var key in prefixs) {
                            if (prefixs[key] === iriSplit[0]) {
                                showText = key + ':' + iriSplit[1];
                                break;
                            }
                        }
                    }
                    textShape._title.innerHTML = showText;

                }

                // textShape.node.onclick=function () {
                //     var title = document.createElement('title');
                //     title.innerHTML = node.data.iri || node.data.text;
                //     textGroup.node.appendChild(title);
                //     //textShape.node.insertBefore(title,null);
                // };

                if (kity.Browser.ie || kity.Browser.edge) {
                    textShape.fixPosition();
                }
            }

            this.setTextStyle(node, textGroup);

            var textHash = node.getText() +
                ['font-size', 'font-name', 'font-weight', 'font-style'].map(getDataOrStyle).join('/');

            if (node._currentTextHash == textHash && node._currentTextGroupBox) return node._currentTextGroupBox;

            node._currentTextHash = textHash;

            return function () {
                textGroup.eachItem(function (i, textShape) {
                    var y = yStart + i * fontSize * lineHeight;

                    textShape.setY(y);
                    var bbox = textShape.getBoundaryBox();
                    rBox = rBox.merge(new kity.Box(0, y, bbox.height && bbox.width || 1, fontSize));
                });

                var nBox = new kity.Box(r(rBox.x), r(rBox.y), r(rBox.width), r(rBox.height));

                node._currentTextGroupBox = nBox;
                return nBox;
            };

        },

        setTextStyle: function (node, text) {
            var hooks = TextRenderer._styleHooks;
            hooks.forEach(function (hook) {
                hook(node, text);
            });
        }
    });

    var TextCommand = kity.createClass({
        base: Command,
        execute: function (minder, text) {
            var node = minder.getSelectedNode();
            if (node) {
                node.setText(text);
                node.render();
                minder.layout();
            }
        },
        queryState: function (minder) {
            return minder.getSelectedNodes().length == 1 ? 0 : -1;
        },
        queryValue: function (minder) {
            var node = minder.getSelectedNode();
            return node ? node.getText() : null;
        }
    });

    utils.extend(TextRenderer, {
        _styleHooks: [],

        registerStyleHook: function (fn) {
            TextRenderer._styleHooks.push(fn);
        }
    });

    kity.extendClass(MinderNode, {
        getTextGroup: function () {
            return this.getRenderer('TextRenderer').getRenderShape();
        }
    });

    Module.register('text', {
        'commands': {
            'text': TextCommand
        },
        'renderers': {
            center: TextRenderer
        }
    });

    module.exports = TextRenderer;
});
