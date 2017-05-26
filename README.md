# 文件打开

## 获取项目文件


`git clone https://github.com/winder520/angular-webpack-starter.git`


## 安装相关依赖及运行项目

> 1、安装node 和安装npm
[node下载地址](https://nodejs.org/en/)

> 2、用vscode或webstorm打开项目

> 3、用开发软件自带的终端（命令行） 输入
`npm install` 或 `cnpm install`

> 4、用开发软件自带的终端（命令行） 输入
`npm install -g webpack`

> 5、用开发软件自带的终端（命令行） 输入
`npm start`

> 6、在浏览器中输入:http://localhost:4200/

## 测试环境相关配置

> 1、安装karma `npm install -g karma`

> 2、在仿DOS窗口运行：`npm run test`

## 开发的时候注意项

> 1、在组件里面引用CSS（LESS）的时候用 `require` 导入：

  ```js

  require('./app.component.less')

  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
  })
  export class AppComponent implements OnInit {}
  ```

> 2、在CSS或HTML引用外部图片要用相对路径

  ```CSS
  .row {
    margin: 0px;
    padding: 0px;
    height: 100%;
    background: url('../assets/images/faces/ee_1.png')
  }
  ```

  ```HTML
  <img src="../assets/images/css-sprites/notify.png" class="chat-but">
  ```

> 3、图片格式请使用格式 jpg png gif

> 4、在js（ts）里面不要直接使用图片地址的方式，打包不支持

> 5、编写测试代码的时候文件名后缀以：组件（｜指令｜服务）.spec.ts 结尾


#### 启动

npm start

