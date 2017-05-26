/**
 * Created by winder on 2017/3/22.
 */
import { GenerateBrowserProportion } from '../../config/generate-browser-proportion';
import { Util } from '../../../util/util';
export class NodeText {
  options;
  FONT_SIZE: number = 12;
  browserProportion: GenerateBrowserProportion
  constructor(private graph) {
    this.options = graph.getOptions();
    this.browserProportion = new GenerateBrowserProportion();
  }

  drawText(element) {


    element.append('text')
      // .attr('x', (d) => {
      //     if (!d.text) return;
      //     return d.style.text.shape.x;
      // })
      .attr('text-anchor', 'middle')
      .attr('y', (d) => {
        if (!d.text) return;
        if (d.style.text && d.style.text.shape)
          return d.style.text.shape.y;

      })
      .attr('font-size', (d) => {
        if (!d.text) return;
        this.FONT_SIZE = (d.style.text && d.style.text.fontSize) || this.options.nodeTextFontSize;
        return this.FONT_SIZE;
      })
      .text((d) => {
        if (Util.isUTCTime(d.text)) {
          d.text = Util.dateTimeFormat(new Date(d.text), 'yyyy-MM-dd HH:mm:ss');
        }
        return this.subShowText(d.text, d.style.width);
      });
    element.append('title')
      .text((d) => {
        return d.text;
      })
  }


  private subShowText(text, width) {
    text || (text = '');
    var strData = [],
      accumulation = 0;
    var adjust = 1;
    for (var i = 0, len = text.length; i < len; i++) {
      adjust = this.browserProportion.getProportion(text[i]);
      accumulation = accumulation + adjust * this.FONT_SIZE;

      if (accumulation > width - this.browserProportion.getProportion('.') * this.FONT_SIZE * 3) {
        strData.push('...');
        break;
      }
      strData.push(text[i])
    }
    return strData.join('');
  }

}
