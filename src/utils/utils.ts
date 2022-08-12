export default class CommonUtils {


  static randomString(len = 5) {
    return Math.random().toString(36).substring(-len);
  }
}