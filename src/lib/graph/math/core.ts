export class Core {
  /**
   * 计算两点之间的距离
   * @param {起始点} startPosition 
   * @param {起始点} endPosition 
   */
  static calculateDistance(startPosition, endPosition) {
    var dx = startPosition.x - endPosition.x;
    var dy = startPosition.y - endPosition.y;
    return Math.sqrt(dx * dx + dy * dy)
  }
}
