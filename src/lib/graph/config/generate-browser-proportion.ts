/**
 * Created by winder on 2017/3/22.
 */
export class GenerateBrowserProportion {
  specialChar = ['.', ',', '\\', '/', '*', '(', ')', '[', ']', '_', '-', '+', '=', '`', '!', '@', '#', '$', '%', '^', '&', '*', ',', '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  constructor() {
    this.createElement();
  }

  private createElement() {
    if (window['browserConfig']) return;
    var wrapper = document.createElement('div');
    wrapper.style.visibility = 'hidden';
    wrapper.style.width = '0';
    wrapper.style.height = '0';
    var childElement;
    this.specialChar.forEach(function (char) {
      childElement = document.createElement('span');
      childElement.style.fontSize = '12px !important';
      childElement.className = 'js-temp-selector';
      childElement.style.fontFamily = '"Microsoft YaHei", "Segoe UI", "Lucida Grande", Helvetica, Arial, sans-serif';
      childElement.innerText = char;
      wrapper.appendChild(childElement);
    });
    document.body.appendChild(wrapper);
    var selectList = document.querySelectorAll('.js-temp-selector');
    var nodeList = Array.apply(null, selectList);

    var configJson = {}, rect;
    nodeList.forEach(function (node) {
      rect = node.getBoundingClientRect();
      configJson[node.innerHTML] = rect.width / 12;
    });
    window['browserConfig'] = configJson;
    document.body.removeChild(wrapper);
  }
  getProportion = function (char) {
    return window['browserConfig'][char] || 1;
  }

}
