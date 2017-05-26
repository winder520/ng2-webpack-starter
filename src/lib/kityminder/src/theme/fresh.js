define(function(require, exports, module) {
    var kity = require('../core/kity');
    var theme = require('../core/theme');

    function hsl(h, s, l) {
        return kity.Color.createHSL(h, s, l);
    }

    function generate(h, compat) {
        return {
            'background': '#fbfbfb',

            'root-color': 'white',
            'root-background': '#0393FD',
            'root-stroke': '#0393FD',
            'root-font-size': 16,
            'root-padding': [6, 20],
            'root-margin': compat ? 8 : [20,30],
            'root-radius': 5,
            'root-space': 10,

            'main-color': 'black',
            'main-background': 'white',
            'main-stroke': '#0393FD',
            'main-import-stroke': '#D8D8D8',
            'main-import-background': '#F9F9F9',
            'main-stroke-width': 1,
            'main-font-size': 14,
            'main-padding': [6, 20],
            'main-margin': compat ? 8 : [20,30],
            'main-radius': 3,
            'main-space': 5,

            'sub-color': 'black',
            'sub-background': 'white',
            'sub-stroke': '#0393FD',
            'sub-import-stroke': '#D8D8D8',
            'sub-import-background': '#F9F9F9',
            'sub-font-size': 14,
            'sub-padding': [6, 20],
            'sub-margin': compat ?  16 : [20,30],
            'sub-radius': 5,
            'sub-space': 5,

            'connect-color': '#B8DBF4',
            'selected-connect-color': '#0393FD',
            'selected-connect-width': 2.5,
            'connect-width': 2,
            'connect-radius': 5,

            'selected-stroke': '#98C878',
            'selected-stroke-width': '4',
            'blur-selected-stroke': hsl(h, 10, 60),

            'marquee-background': hsl(h, 100, 80).set('a', 0.1),
            'marquee-stroke': hsl(h, 37, 60),

            'drop-hint-color': hsl(h, 26, 35),
            'drop-hint-width': 5,

            'order-hint-area-color': hsl(h, 100, 30).set('a', 0.5),
            'order-hint-path-color': hsl(h, 100, 25),
            'order-hint-path-width': 1,
            
            
            'complement-set-background': '#1976D2',

            'data-background-1': '#0092FD',
            'data-background-2': '#1976D2',

            'import-icon-background': '#B8DBF4',

            'intersection-icon-background-1':'#0092FD',
            'intersection-icon-background-2':'#1976D2',

            'object-icon-background':'#1976D2',

            'folder-icon-background':'#CCCC00',

            'union-set-icon-background-1':'#0092FD',
            'union-set-icon-background-2':'#1976D2',

            'text-selection-color': hsl(h, 100, 20),
            'text-value-restriction-color':'#0393FD',
            'line-height':1.5
        };
    }

    var plans = {
        red: 0,
        soil: 25,
        green: 122,
        blue: 204,
        purple: 246,
        pink: 334
    };
    var name;
    for (name in plans) {
        theme.register('fresh-' + name, generate(plans[name]));
        theme.register('fresh-' + name + '-compat', generate(plans[name], true));
    }

});