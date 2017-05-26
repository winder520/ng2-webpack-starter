/**
 * Created by winder on 2016/5/31.
 */
define(function (require, exports, module) {
    var restrictionMapConfig = {
        'allValuesFromRestriction': 'only',
        'hasValueRestriction': 'value',
        'maxCardinalityRestriction': 'max',
        'qualifiedCardinality': 'exactly',
        'minQualifiedCardinality': 'min',
        'minCardinalityRestriction': 'min',
        'someValuesFromRestriction': 'some',
        'cardinalityRestriction': 'exactly',
        'maxQualifiedCardinality': 'max'
    };
    return module.exports = {
        getMapConfig: function (node) {
            return restrictionMapConfig[node.data?node.data.restrictionType:node] || '';
        }
    }
});