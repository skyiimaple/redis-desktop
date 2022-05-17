// 仅供阅读
const config = {
  "build": {
    "productName":"xxxx",//项⽬名这也是⽣成的exe⽂件的前缀名
    "appId": "com.leon.xxxxx",//包名
    "copyright":"xxxx",//版权信息
    "directories": { // 输出⽂件夹
      "output": "build"
    }, 
    "nsis": {
      "oneClick": false, // 是否⼀键安装
      "allowElevation": true, // 允许请求提升。如果为false，则⽤户必须使⽤提升的权限重新启动安装程序。
      "allowToChangeInstallationDirectory": true, // 允许修改安装⽬录
      "installerIcon": "./build/icons/aaa.ico",// 安装图标
      "uninstallerIcon": "./build/icons/bbb.ico",//卸载图标
      "installerHeaderIcon": "./build/icons/aaa.ico", // 安装时头部图标
      "createDesktopShortcut": true, // 创建桌⾯图标
      "createStartMenuShortcut": true,// 创建开始菜单图标
      "shortcutName": "xxxx", // 图标名称
      "include": "build/script/installer.nsh", // 包含的⾃定义nsis脚本
    },
    "publish": [
      {
        "provider": "generic", // 服务器提供商也可以是GitHub等等
        "url": "http://xxxxx/" // 服务器地址
      }
    ],
    "files": [
      "dist/electron/**/*"
    ],
    "dmg": {
      "contents": [
        {
          "x": 410,
          "y": 150,
          "type": "link",
          "path": "/Applications"
        },
        {
          "x": 130,
          "y": 150,
          "type": "file"
        }
      ]
    },
    "mac": {
      "icon": "build/icons/icon.icns"
    },
    "win": {
      "icon": "build/icons/aims.ico",
      "target": [
        {
          "target": "nsis",
          "arch": [
            "ia32"
          ]
        }
      ]
    },
    "linux": {
      "icon": "build/icons"
    }
  }
}