/**
 * Created by winder on 2016/5/26.
 */
define(function (require, exports, module) {
    var axiomNameConfig = {
        'subclassof': '父类',
        'supertypes': '父类',
        'equivalenttypes': '相等类',
        'disjointwithes': '不相交',
        'subobjectpropertyof': '父属性',
        'subpropertyof': '父属性',
        'superproperties': '父属性',
        'equivalentproperties': '相等属性',
        'inverseproperties': '逆反属性',
        'domains': '定义域',
        'ranges': '值域'
    };
    return module.exports = {
        getName: function (node) {
            if ('property' == node.data.category && node.parent.data.category === 'root') {
                return '属性';
            }
            node.data.connect = node.data.connect || {};
            var type = node.data.connect.type ? node.data.connect.type.toLowerCase() : node.data.connect.type;
            if ('property' == node.data.category && 'disjointwithes' === node.data.connect.type) {
                return '不相交属性';
            }
            if ('advanced,class,enum,anonymity'.indexOf(node.data.category) > -1 && 'disjointwithes' === node.data.connect.type) {
                return '不相交类';
            }
            if ('propertyRestriction' === node.data.category) {
                if (axiomNameConfig[type])
                    return axiomNameConfig[type];
            }
            if ('propertyRestriction' === node.data.category && node.getRoot().data.graphType === 'class-class') {
                return '子类';
            }
            if ('propertyRestriction' === node.data.category && node.getRoot().data.graphType === 'class-property') {
                return node.data.inherit?'继承属性':'属性';
            }

            return axiomNameConfig[type] || '';
        }
    }
});