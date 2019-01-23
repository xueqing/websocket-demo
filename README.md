# websocket 学习

## 参考链接

- [WebSockets Tutorial](https://www.tutorialspoint.com/websockets/index.htm)
- [HTML5 WebSocket](http://www.runoob.com/html/html5-websocket.html)
- [Create a WebSocket Server Using Node.js](https://www.dotnetcurry.com/nodejs/1220/create-web-socket-server-nodejs-for-real-time)
- [WebSocket : Simple client and Server](https://blog.revathskumar.com/2015/08/websockets-simple-client-and-server.html)
- [ws: a Node.js WebSocket library](https://github.com/websockets/ws)
- [WebSocket + Node.js + Express — Step by step tutorial using Typescript](https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4)
- [[Node.js] set up Websocket + Express + HTML service in 3 step](https://hackernoon.com/nodejs-web-socket-example-tutorial-send-message-connect-express-set-up-easy-step-30347a2c5535)
- [Create a WebSocket Client in JavaScript](https://www.pegaxchange.com/2018/03/23/websocket-client/)

## windows 环境

- 安装 python
  - 下载 [python2.7](https://www.python.org/ftp/python/2.7.15/python-2.7.15.amd64.msi)
  - 安装
  - 配置系统环境变量，添加两个路径到 Path
    - absolute_path\Python27\Scripts
    - absolute_path\Python27
  - 测试：打开命令提示符，输入`python`，输出`Python 2.7.15......`
- 安装 pywebsocket
  - 克隆源码`git clone https://github.com/google/pywebsocket.git`
  - 进入 pywebsocket 目录，执行命令
    - `python setup.py build`
    - `python setup.py install`
- 开启服务`python standalone.py -p 9998 -w ../example/`
  - 以上命令会开启一个端口号为 9998 的服务，使用 -w 来设置处理程序 echo_wsh.py 所在的目录

### websocket client

- 可以在浏览器打开[index.html](./client/index.html)，连接的 url 写`ws://localhost:9998/echo`
- pywebsocket 会把收到的消息再发送给 client

### websocket server

- 编写 server 和 client 代码，使用 websocket 通信
- 安装`ws`模块：`npm install ws`
- 创建文件夹`server/scripts`和`server/pages`
  - `server/scripts`中编写[app.js](./server/scripts/app.js)
  - `server/pages`中编写[client.html](./server/pages/client.html)
- 开启服务：在命令行打开[app.js](./server/scripts/app.js)`node ./app.js`