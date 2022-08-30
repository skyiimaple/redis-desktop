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

  static getStringSize(key: string) {
    const size = Buffer.byteLength(key, 'utf-8')
    if (!size) {
      return 0
    }
    const i = Math.floor(Math.log(size) / Math.log(1024))
    const count: any = (size / Math.pow(1024, i)).toFixed(2)
    return 1 * count + ['B', 'KB', 'MB', 'GB', 'TB'][i];
  }


}