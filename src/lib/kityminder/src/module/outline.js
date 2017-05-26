define(function (require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var Minder = require('../core/minder');
    var MinderNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');
    var Shape = require('../core/shape');

    var OutlineRenderer = kity.createClass('OutlineRenderer', {
        base: Renderer,

        create: function (node) {
            var shape = node.data.category;
            if (node.isRoot())
                shape = 'root';
            var shapeStyle = Shape.getShapeStyle(shape || 'default');
            if (!shapeStyle)
                shapeStyle = Shape.getShapeStyle('default');
            var outline = shapeStyle.create(node);
            this.bringToBack = true;
            return outline;
        },

        update: function (outline, node, box) {

            var shape = node.data.category;

            if (node.isRoot())
                shape = 'root';
            var shapeStyle = Shape.getShapeStyle(shape || 'default');
            if (!shapeStyle)
                shapeStyle = Shape.getShapeStyle('default');
            var outlineBox = shapeStyle.update(outline, node, box);
            return new kity.Box(outlineBox);
        }
    });

    var ShadowRenderer = kity.createClass('ShadowRenderer', {
        base: Renderer,

        create: function (node) {
            this.bringToBack = true;
            return new kity.Rect();
        },

        shouldRender: function (node) {
            return node.getStyle('shadow');
        },

        update: function (shadow, node, box) {
            shadow.setPosition(box.x + 4, box.y + 5)
                .fill(node.getStyle('shadow'));

            var shape = node.getStyle('shape');
            if (!shape) {
                shadow.setSize(box.width, box.height);
                shadow.setRadius(node.getStyle('radius'));

            } else if (shape == 'circle') {
                var width = Math.max(box.width, box.height);
                shadow.setSize(width, width);
                shadow.setRadius(width / 2);
            }
        }
    });

    var marker = new kity.Marker();

    marker.setWidth(10);
    marker.setHeight(12);
    marker.setRef(0, 0);
    marker.setViewBox(-6, -4, 8, 10);

    marker.addShape(new kity.Path().setPathData('M-5-3l5,3,-5,3').stroke('#33ffff'));

    var wireframeOption = /wire/.test(window.location.href);
    var WireframeRenderer = kity.createClass('WireframeRenderer', {
        base: Renderer,

        create: function () {
            var wireframe = new kity.Group();
            var oxy = this.oxy = new kity.Path()
                .stroke('#f6f')
                .setPathData('M0,-50L0,50M-50,0L50,0');

            var box = this.wireframe = new kity.Rect()
                .stroke('lightgreen');

            var vectorIn = this.vectorIn = new kity.Path()
                .stroke('#66ffff');
            var vectorOut = this.vectorOut = new kity.Path()
                .stroke('#66ffff');

            vectorIn.setMarker(marker, 'end');
            vectorOut.setMarker(marker, 'end');

            return wireframe.addShapes([oxy, box, vectorIn, vectorOut]);
        },

        shouldRender: function () {
            return wireframeOption;
        },

        update: function (created, node, box) {
            this.wireframe
                .setPosition(box.x, box.y)
                .setSize(box.width, box.height);
            var pin = node.getVertexIn();
            var pout = node.getVertexOut();
            var vin = node.getLayoutVectorIn().normalize(30);
            var vout = node.getLayoutVectorOut().normalize(30);
            this.vectorIn.setPathData(['M', pin.offset(vin.reverse()), 'L', pin]);
            this.vectorOut.setPathData(['M', pout, 'l', vout]);
        }
    });

    Module.register('OutlineModule', function () {
        return {
            events: (!wireframeOption ? null : {
                'ready': function () {
                    this.getPaper().addResource(marker);
                },
                'layoutallfinish': function () {
                    this.getRoot().traverse(function (node) {
                        node.getRenderer('WireframeRenderer').update(null, node, node.getContentBox());
                    });
                }
            }),
            renderers: {
                outline: OutlineRenderer,
                outside: [ShadowRenderer, WireframeRenderer]
            }
        };
    });
});