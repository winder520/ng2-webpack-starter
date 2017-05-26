export class Util {
  /**
   * 根据cookie key 获取cookie的值 
   * @param key Cookie key
   */
  static getCookie(key: string): string {
    var cookieValue = '';
    var allCookies = document.cookie;
    if (!allCookies || allCookies === '') return '';
    var list = allCookies.split(';');

    for (var i = 0; i < list.length; i++) {
      var p = list[i].split('=');
      if (p[0].trim() == key) {
        cookieValue = p[1];
        break;
      }
    }
    return cookieValue;
  }

  static setCookie(key: string, value: string, domain: string = '.kopbit.com'): void {
    document.cookie = key + '=' + value + ';domain=' + domain
  }

  /**
   * 根据当前key获取Cookie值
   */
  static getCookieValueByKey(key: string): string {
    let cookieInfo = this.getCookie("AUTH");
    if (cookieInfo) {
      let cookieInfoByDecodeURI = decodeURIComponent(cookieInfo);
      let userInfo: string;
      let userInfoModel: string[];
      if (cookieInfoByDecodeURI.indexOf('}') > 0) {
        userInfo = decodeURIComponent(cookieInfoByDecodeURI.substring(cookieInfoByDecodeURI.indexOf(':') + 1, cookieInfoByDecodeURI.length));
        let user: any = JSON.parse(userInfo.substr(userInfo.indexOf(":") + 2, userInfo.length - userInfo.indexOf(":") - 4));
        return user[key];
      }
    }
    return "";
  }

  /**
   * 清除Cookie
   */
  static clearCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      for (var i = 0; i < keys.length; i++)
        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() + ";Domain=.dev.kopbit.com;path=/";
    }
    location.reload(false);
  }

  /**
   * 生成GUID
   */
  static guid(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    let id = s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();

    return id.replace(/^[0-9]/, (d): any => {
      return String.fromCharCode(97 + (+d))
    });
  }

  /**
   * 判断是否是日期字符串
   * @param str 字符串
   */
  static isUTCTime(str: string): boolean {
    let reg = /^(\d+)-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d+)Z$/;
    return reg.test(str);
  }

  /**
   * 格式化日期
   * @param date 
   * @param format 
   */
  static dateTimeFormat(date: Date, format: string) {
    format = format || 'yyyy-MM-dd HH:mm:ss';
    return format.replace(/y+/, item => {
      let year = date.getFullYear().toString();
      return year.substr(4 - item.length);
    }).replace(/M+/, item => {
      let month = (date.getMonth() + 1).toString();
      if (month.length === 1) {
        return month;
      }
      return month.length === 2 ? month : ('0' + month);
    }).replace(/d+/, item => {
      let day = date.getDate().toString();
      if (day.length === 1) {
        return day;
      }
      return day.length === 2 ? day : ('0' + day);
    }).replace(/H+/, item => {
      let hours = date.getHours().toString();
      if (hours.length === 1) {
        return hours;
      }
      return hours.length === 2 ? hours : ('0' + hours);
    }).replace(/m+/, item => {
      let minutes = date.getMinutes().toString();
      if (minutes.length === 1) {
        return minutes;
      }
      return minutes.length === 2 ? minutes : ('0' + minutes);
    }).replace(/s+/, item => {
      let seconds = date.getSeconds().toString();
      if (seconds.length === 1) {
        return seconds;
      }
      return seconds.length === 2 ? seconds : ('0' + seconds);
    })
  }

}