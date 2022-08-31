import { ElMessageBox, messageType } from "element-plus";

export default class CommonUtils {

  /**
   * 生成指定长度的随机数
   * @param len 随机数长度
   * @returns 
   */
  static randomString(len = 5) {
    return Math.random().toString(36).substr(-len);
  }

  /**
   * 判断对象是否为不存在
   * @param obj 
   * @returns 
   */
  static isEmpty(obj: any) {
    return obj === null || obj === 'undefined' || obj === '' || obj.length === 0;
  }

  /**
   * 判断对象是否为存在
   * @param obj 
   * @returns 
   */
  static isExist(obj: any) {
    return !this.isEmpty(obj);
  }

  /**
   * 获取当前时间
   * @returns 
   */
  static getCurTime() {
    return new Date().getTime();
  }

  /**
   * 生成唯一key
   * @returns 
   */
  static getKey() {
    return `${this.getCurTime()}_${this.randomString()}`;
  }

  /**
   * 给对象赋值
   * @param target 被赋值对象
   * @param data 值对象
   * @param prop （可选）指定更新属性
   */
  static setReactive(target: any = {}, data: any = {}, prop?: string) {
    if (prop) {
      target[prop] = data
    } else {
      for (const key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key) && Object.prototype.hasOwnProperty.call(data, key)) {
          target[key] = data[key]
        }
      }
    }
  }


  /**
   * 处理成树形结构
   * 
   * @param array 要被处理的的数组
   * @param id 节点id
   * @param pid 父节点id
   */
  static formatTree(array: any[], id: string = 'id', pid: string = 'pid') {
    // 先深拷贝 不影响原数据
    let copyedObj = JSON.parse(JSON.stringify(array)) // 深拷贝源数据
    let data = copyedObj.filter((parent: any) => {
      let findChildren = copyedObj.filter((child: any) => {
        return parent[id] === child[pid]
      })
      parent.children = (findChildren.length > 0 && !parent.value) ? findChildren : []
      // parent.children.sort((a: any, b: any) => { return a.label?.length - b.label?.length })
      // console.log('findChildren :>> ', findChildren);
      // parent.keyCount = copyedObj.find 
      return parent[pid] === '' // 返回顶层，依据实际情况判断这里的返回值
    })
    this.getChildrenLen(data)
    return data
  }

  /**
   * 获取叶子节点的个数
   * @param data 
   * @returns 
   */
  static getChildrenLen(data: any[]) {
    if (data.some((res: any) => res.value)) {
      return data.length
    }
    let count = 0
    data.forEach((res: any) => {
      res.keyCount = this.getChildrenLen(res.children)
      count += res.keyCount
    })
    return count
  }

  /**
   * 计算字符的字节长度
   * @param key 
   * @returns 
   */
  static getStringSize(key: string) {
    const size = Buffer.byteLength(key, 'utf-8')
    if (!size) {
      return 0
    }
    const i = Math.floor(Math.log(size) / Math.log(1024))
    const count: any = (size / Math.pow(1024, i)).toFixed(2)
    return 1 * count + ['B', 'KB', 'MB', 'GB', 'TB'][i];
  }

  /**
   * 统一生成提示框
   * @param text 
   * @param type 
   * @returns 
   */
  static message(text: string, type: messageType = 'warning') {
    return ElMessageBox.confirm(text, '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type,
      }
    )
  }


}