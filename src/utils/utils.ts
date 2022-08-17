export default class CommonUtils {


  static randomString(len = 5) {
    return Math.random().toString(36).substr(-len);
  }


  static isEmpty(obj: any) {
    return obj === null || obj === 'undefined' || obj === '' || obj.length === 0;
  }

  static isExist(obj: any) {
    return !this.isEmpty(this.isEmpty);
  }

  static getCurTime() {
    return new Date().getTime();
  }

  static getKey() {
    return `${this.getCurTime()}_${this.randomString()}`;
  }
}