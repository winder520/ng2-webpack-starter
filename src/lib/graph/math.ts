/**
 * Created by winder on 2017/3/20.
 */
import { RectShape } from './math/rect-shape';
import { CircleShape } from './math/circle-shape';
import { IrregularShape } from './math/irregular-shape';
import { Ellipse } from './math/ellipse-shape';
import { Core } from './math/core';

export class MathUtil {

  constructor() {
    // for (var key in Core) {
    //   this[key] = Core[key];
    // }
  }
  calculateDistance(startPosition, endPosition): number {
    return Core.calculateDistance(startPosition, endPosition);
  }

  /**
   * 计算矩形的连接点
   * @param source 点
   * @param target 矩形
   */
  calculateRectangleOnPoint(source, target) {
    return RectShape.calculateLinkPoint(source, target);
  };

  /**
   * 计算椭圆的连接点
   * @param source 点
   * @param target 矩形
   */
  calculateEllipseOnPoint(source, target) {
    // return Ellipse.calculateLinkPoint(source, target);
  };
  /**
   * 计算圆的连接点
   * @param source 点
   * @param target 矩形
   */
  calculateCircleOnPoint(source, target) {
    return CircleShape.calculateLinkPoint(source, target);
  };

  /**
   * 计算不规则图形的连接点
   */
  calculateShapePoint(calculateElement, point) {
    return IrregularShape.calculateLinkPoint(calculateElement, point);
  }

}
