/**
 * Contains a collection of mathematical functions with some additional data
 * used for WebVOWL.
 */
var d3 = require('d3');
module.exports = (function () {

	var math = {},
		loopFunction = d3.line()
			.x(function (d) { return d.x; })
			.y(function (d) { return d.y; })
			.curve(d3.curveCardinal.tension(-1));
	// loopFunction = d3.svg.line()
	// 	.x(function (d) {
	// 		return d.x;
	// 	})
	// 	.y(function (d) {
	// 		return d.y;
	// 	})
	// 	.interpolate("cardinal")
	// 	.tension(-1);


	/**
	 * Calculates the normal vector of the path between the two nodes.
	 * @param source the first node
	 * @param target the second node
	 * @param length the length of the calculated normal vector
	 * @returns {{x: number, y: number}}
	 */
	math.calculateNormalVector = function (source, target, length) {
		var dx = target.x - source.x,
			dy = target.y - source.y;

		var nx = -dy,
			ny = dx;

		var vlength = Math.sqrt(nx * nx + ny * ny);

		var ratio = vlength !== 0 ? length / vlength : 0;

		return { "x": nx * ratio, "y": ny * ratio };
	};

	/**
	 * Calculates the path for a link, if it is a loop. Currently only working for circlular nodes.
	 * @param link the link
	 * @returns {*}
	 */
	math.calculateLoopPath = function (link) {
		var node = link.domain(),
			label = link.label();

		var fairShareLoopAngle = 360 / link.loops().length,
			fairShareLoopAngleWithMargin = fairShareLoopAngle * 0.8,
			loopAngle = Math.min(60, fairShareLoopAngleWithMargin);

		var dx = label.x - node.x,
			dy = label.y - node.y,
			labelRadian = Math.atan2(dy, dx),
			labelAngle = calculateAngle(labelRadian);

		var startAngle = labelAngle - loopAngle / 2,
			endAngle = labelAngle + loopAngle / 2;

		var arcFrom = calculateRadian(startAngle),
			arcTo = calculateRadian(endAngle),

			x1 = Math.cos(arcFrom) * node.actualRadius(),
			y1 = Math.sin(arcFrom) * node.actualRadius(),

			x2 = Math.cos(arcTo) * node.actualRadius(),
			y2 = Math.sin(arcTo) * node.actualRadius(),

			fixPoint1 = { "x": node.x + x1, "y": node.y + y1 },
			fixPoint2 = { "x": node.x + x2, "y": node.y + y2 };

		return loopFunction([fixPoint1, link.label(), fixPoint2]);
		return this.curveFunction([fixPoint1, link.label(), fixPoint2], -1);
	};

	/**
	 * @param angle
	 * @returns {number} the radian of the angle
	 */
	function calculateRadian(angle) {
		angle = angle % 360;
		if (angle < 0) {
			angle = angle + 360;
		}
		return (Math.PI * angle) / 180;
	}

	/**
	 * @param radian
	 * @returns {number} the angle of the radian
	 */
	function calculateAngle(radian) {
		return radian * (180 / Math.PI);
	}

	/**
	 * Calculates the point where the link between the source and target node
	 * intersects the border of the target node.
	 * @param source the source node
	 * @param target the target node
	 * @param additionalDistance additional distance the
	 * @returns {{x: number, y: number}}
	 */
	math.calculateIntersection = function (source, target, additionalDistance) {
		var dx = target.x - source.x,
			dy = target.y - source.y,
			length = Math.sqrt(dx * dx + dy * dy);

		if (length === 0) {
			return { x: source.x, y: source.y };
		}

		var innerDistance = target.distanceToBorder(dx, dy);

		var ratio = (length - (innerDistance + additionalDistance)) / length,
			x = dx * ratio + source.x,
			y = dy * ratio + source.y;

		return { x: x, y: y };
	};

	/**
	 * Calculates the position between the two points.
	 * @param firstPoint
	 * @param secondPoint
	 * @returns {{x: number, y: number}}
	 */
	math.calculateCenter = function (firstPoint, secondPoint) {
		return {
			x: (firstPoint.x + secondPoint.x) / 2,
			y: (firstPoint.y + secondPoint.y) / 2
		};
	};

	function d3SvgLineLinear(points) {
		return points.length > 1 ? points.join("L") : points + "Z";
	}
	function d3SvgLineCardinal(points, tension) {
		return points.length < 3 ? d3SvgLineLinear(points) : points[0] + d3SvgLineHermite(points, d3SvgLineCardinalTangents(points, tension));
	}
	function d3SvgLineCardinalTangents(points, tension) {
		var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length;
		while (++i < n) {
			p0 = p1;
			p1 = p2;
			p2 = points[i];
			tangents.push([a * (p2[0] - p0[0]), a * (p2[1] - p0[1])]);
		}
		return tangents;
	}

	function d3SvgLineHermite(points, tangents) {
		if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {
			return d3SvgLineLinear(points);
		}
		var quad = points.length != tangents.length, path = "", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;
		if (quad) {
			path += "Q" + (p[0] - t0[0] * 2 / 3) + "," + (p[1] - t0[1] * 2 / 3) + "," + p[0] + "," + p[1];
			p0 = points[1];
			pi = 2;
		}
		if (tangents.length > 1) {
			t = tangents[1];
			p = points[pi];
			pi++;
			path += "C" + (p0[0] + t0[0]) + "," + (p0[1] + t0[1]) + "," + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
			for (var i = 2; i < tangents.length; i++ , pi++) {
				p = points[pi];
				t = tangents[i];
				path += "S" + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
			}
		}
		if (quad) {
			var lp = points[pi];
			path += "Q" + (p[0] + t[0] * 2 / 3) + "," + (p[1] + t[1] * 2 / 3) + "," + lp[0] + "," + lp[1];
		}
		return path;
	}
	function d3Functor(v) {
		return typeof v === "function" ? v : function () {
			return v;
		};
	}
	function d3GeomPointX(d) {
		return d.x || 0;
	}
	function d3GeomPointY(d) {
		return d.y || 0;
	}

	function d3True() {
		return true;
	}

	function d3Identity(d) {
		return d;
	}
	/**
	 * 创建曲线方法
	 */
	math.curveFunction = function (data, tension) {
		tension = tension || 0.7;
		var segments = [], points = [], i = -1, n = data.length, d, fx = d3Functor(d3GeomPointX), fy = d3Functor(d3GeomPointY);
		function segment() {
			segments.push("M", d3SvgLineCardinal(d3Identity(points), tension));
		}
		while (++i < n) {
			if (d3True.call(this, d = data[i], i)) {
				points.push([+fx.call(this, d, i), +fy.call(this, d, i)]);
			} else if (points.length) {
				segment();
				points = [];
			}
		}
		if (points.length) segment();
		return segments.length ? segments.join("") : null;
	}


	return function () {
		/* Use a function here to keep a consistent style like webvowl.path.to.module()
		 * despite having just a single math object. */
		return math;
	};
})();
