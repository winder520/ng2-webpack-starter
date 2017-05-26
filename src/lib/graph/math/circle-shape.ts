
import { Core } from './core';

export class CircleShape {
  static calculateLinkPoint(point, circleShape) {
    var x, y;
    var dx = point.x - circleShape.x;
    var dy = point.y - circleShape.y;

    var r = circleShape.width / 2;
    //计算两个点之间的距离
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circleShape.width / 2) {
      return { x: point.x, y: point.y };
    }
    var outDistance = distance - r;

    //计算直线斜率

    var k = (point.y - circleShape.y) / (point.x - circleShape.x);


    /**
     * 联立 方程求解 方程如下：
     * k=(y-y0)/(x-x0)
     * r^2=(y-y0)^2+(x-x0)^2
     * 其中： x0 === circleShape.x, y0===circleShape.y
     */

    var x1 = ((2 * circleShape.x * k * k) - Math.sqrt(4 * k * k * r * r + 4 * r * r) + 2 * circleShape.x) / (2 * k * k + 2),
      x2 = ((2 * circleShape.x * k * k) + Math.sqrt(4 * k * k * r * r + 4 * r * r) + 2 * circleShape.x) / (2 * k * k + 2),
      y1 = (-Math.sqrt(4 * r * r + (4 * r * r) / (k * k)) * (k * k) + 2 * circleShape.y * k * k + 2 * circleShape.y) / (2 * k * k + 2),
      y2 = (+Math.sqrt(4 * r * r + (4 * r * r) / (k * k)) * (k * k) + 2 * circleShape.y * k * k + 2 * circleShape.y) / (2 * k * k + 2);

    var dataArr = [{ x: x1, y: y1 }, { x: x1, y: y2 }, { x: x2, y: y1 }, { x: x2, y: y2 }];
    var item,
      pointDistance,
      prevDiff = Infinity,//存储上次相减的值
      currentDiff = Infinity//存储当前相减后的值
      ;
    for (var i = 0, len = dataArr.length; i < len; i++) {
      item = dataArr[i];
      pointDistance = Core.calculateDistance({ x: item.x, y: item.y }, { x: point.x, y: point.y });

      if (outDistance.toFixed() === pointDistance.toFixed()) {
        currentDiff = Math.abs(outDistance - pointDistance);
        if (prevDiff > currentDiff) {
          prevDiff = currentDiff;
          x = item.x;
          y = item.y;
        }

      }
    }
    return {
      x: x || 0,
      y: y || 0
    };
  }
}
