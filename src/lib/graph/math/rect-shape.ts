export class RectShape {

  /**
   * 已知x坐标 计算y坐标
   * @param startCenterPoint
   * @param endCenterPoint
   * @param x
   * @returns {number}
   */
  private static calculateY(startCenterPoint, endCenterPoint, x) {
    //公式  (y0-y)/(x0-x)=(y0-y1)/(x0-x1) => y=y0-(((y0-y1)/(x0-x1))*(x0-x))
    return startCenterPoint.y - (((startCenterPoint.y - endCenterPoint.y) * (startCenterPoint.x - x)) / (startCenterPoint.x - endCenterPoint.x));
  }

  /**
   * 已知y坐标 计算x坐标
   * @param startCenterPoint
   * @param endCenterPoint
   * @param y
   * @returns {number}
   */
  private static calculateX(startCenterPoint, endCenterPoint, y) {
    //公式  (y0-y1)/(x0-x1)=(y0-y2)/(x0-x2) => x1=x0-(((y0-y1)*(x0-x2))/(y0-y2))
    return startCenterPoint.x - (((startCenterPoint.y - y) * (startCenterPoint.x - endCenterPoint.x)) / (startCenterPoint.y - endCenterPoint.y));
  }

  static calculateLinkPoint(source, target) {
    var leftTop = {
      x: target.x - target.width / 2 - 2,
      y: target.y - target.height / 2
    };
    var leftBottom = {
      x: target.x - target.width / 2 - 2,
      y: target.y + target.height / 2
    };
    var rightTop = {
      x: target.x + target.width / 2,
      y: target.y - target.height / 2
    };
    var rightBottom = {
      x: target.x + target.width / 2,
      y: target.y + target.height / 2
    };

    //左上角到中心点直线的斜率
    var leftTopSlope = (leftTop.y - target.y) / (leftTop.x - target.x);
    //左下角到中心点直线的斜率
    var leftBottomSlope = (leftBottom.y - target.y) / (leftBottom.x - target.x);
    //右上角到中心点直线的斜率
    var rightTopSlope = (rightTop.y - target.y) / (rightTop.x - target.x);
    //右下角到中心点直线的斜率
    var rightBottomSlope = (rightBottom.y - target.y) / (rightBottom.x - target.x);

    //当前点到矩形中心的斜率
    var slope = (source.y - target.y) / (source.x - target.x);

    var x, y;
    if (source.y < leftTop.y) {
      //对角线
      if (source.x < leftTop.x) {
        if (slope > leftBottomSlope && slope < leftTopSlope) {
          x = leftTop.x;
          y = RectShape.calculateY(target, source, x);
        } else {
          y = leftTop.y;
          x = RectShape.calculateX(target, source, y);
        }
      } else {
        if (slope < rightBottomSlope && slope > rightTopSlope) {
          x = rightBottom.x;
          y = RectShape.calculateY(target, source, x);
        } else {
          y = leftTop.y;
          x = RectShape.calculateX(target, source, y);

        }
      }
    } else {
      if (source.x < leftTop.x) {
        if (slope > leftBottomSlope && slope < leftTopSlope) {
          x = leftTop.x;
          y = RectShape.calculateY(target, source, x)
        } else {
          y = leftBottom.y;
          x = RectShape.calculateX(target, source, y);
        }
      } else {
        if (slope < rightBottomSlope && slope > rightTopSlope) {
          x = rightBottom.x;
          y = RectShape.calculateY(target, source, x)
        } else {
          y = rightBottom.y;
          x = RectShape.calculateX(target, source, y);
        }
      }

    }
    return {
      x: x,
      y: y
    };
  }
}
