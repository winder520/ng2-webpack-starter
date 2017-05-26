var nodes = [];
nodes.push(require("./implementations/ExternalClass"));
nodes.push(require("./implementations/OwlClass"));
nodes.push(require("./implementations/OwlComplementOf"));
nodes.push(require("./implementations/OwlDeprecatedClass"));
nodes.push(require("./implementations/OwlDisjointUnionOf"));
nodes.push(require("./implementations/OwlEquivalentClass"));
nodes.push(require("./implementations/OwlIntersectionOf"));
nodes.push(require("./implementations/OwlNothing"));
nodes.push(require("./implementations/OwlThing"));
nodes.push(require("./implementations/OwlUnionOf"));
nodes.push(require("./implementations/RdfsClass"));
nodes.push(require("./implementations/RdfsDatatype"));
nodes.push(require("./implementations/RdfsLiteral"));
nodes.push(require("./implementations/RdfsResource"));
var d3 = require('d3');
var map = d3.map(nodes, function (Prototype) {
	console.log(new Prototype().type());
	return new Prototype().type();
});

console.log(map);

module.exports = function () {
	return map;
};
