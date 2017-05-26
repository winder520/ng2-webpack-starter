
import { GenerateBrowserProportion } from '../../config/generate-browser-proportion';
import { Options } from '../../options';

export class LinkText {
  options: Options;
  browserProportion: GenerateBrowserProportion
  constructor(private graph) {
    this.options = graph.getOptions();
    this.browserProportion = new GenerateBrowserProportion();
  }
  drawText(element) {
    var textObj;
    element.append('text')
      .classed('link-text', true)
      .attr('font-size', this.options.linkTextFontSize)
      .append('textPath')
      .attr('xlink:href', (d) => {
        return '#' + d.id + '-line';
      })
      .text((d) => {
        textObj = this.subShowText(d.sourceText || d.targetText, this.options.linkTextShowLength);
        d.textLen = textObj.textLen;
        return textObj.text;
      });
  };
  private subShowText(text, width) {
    text || (text = '');
    var strData = [],
      accumulation = 0;
    var adjust = 1;
    for (var i = 0, len = text.length; i < len; i++) {
      adjust = this.browserProportion.getProportion(text[i]);
      accumulation = accumulation + adjust * this.options.linkTextFontSize;

      if (accumulation > width - this.browserProportion.getProportion('.') * this.options.linkTextFontSize * 3) {
        strData.push('...');
        accumulation += this.browserProportion.getProportion('.') * this.options.linkTextFontSize * 3;
        break;
      }
      strData.push(text[i])
    }
    return { text: strData.join(''), textLen: accumulation };
  }
}
