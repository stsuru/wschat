### Node.jsとは

<font size="3">http://qiita.com/hshimo/items/1ecb7ed1b567aacbe559</font><font size="4"><blockquote>特徴<ul><li>サーバーサイドのJavaScript</li><li>非同期 (I/Oの処理結果を待たず処理を進める)<ul><li>ノンブロッキングI/O (I/Oの結果を待たないで処理をすすめる。I/O処理が終了したらコールバック関数を実行。)</li></ul></li><li>イベントドリブン </li><li>シングルスレッド (メモリ消費が少ない、仕事切り替えが少ないので速い)</li><li>JavaScript エンジンが Google の V8 で速い</li></ul></blockquote></font>

###### Corporate Members

<img src="img/ibmLogo.png" height="40">
<img src="img/intelLogo.png" height="40">
<img src="img/joyentLogo.svg" height="40">
<img src="img/microsoftLogo.png" height="40">
<img src="img/paypalLogo.png" height="40">
<img src="img/redhatLogo.png" height="40"><font size="3">他20社...</font>
<font size="2">画像は各企業に帰属します<font size="3">



## 環境準備



### node.jsのインストール

https://nodejs.org/en/download/
<img src="img/downloads.png">



### 開発ツールに便利なものをインストール

<dl>
  <dt>nodemon</dt>
  <dd>ソース変更を検知してプロセスを自動で再起動してくれるツール</dd>
</dl>

```bash
npm install nodemon -g
```



## 作ってみましょう

```bash
mkdir wschat
cd wschat
npm init
npm install connect --save
npm install morgan --save
npm install serve-static --save
npm install websocket.io --save
```



### サーバサイドコーディング（１）

index.js
```javascript
// connectモジュールの取得（httpサーバにモジュールを追加することで拡張する）
var connect = require('connect');
// morganモジュールの取得（アクセスログを簡単に出してくれる）
var logger = require('morgan');
// serve-staticモジュールの取得（ローカルに存在するファイルを返すミドルウェア）
var serveStatic = require('serve-static');
// httpサーバの設定（ログと静的コンテンツの指定）
var app = connect().use(logger('dev')).use(serveStatic(process.cwd()));
// httpモジュールの取得
var http = require('http');
// httpサーバの生成（サーバ設定とリスンポートの指定）
var httpserver = http.createServer(app).listen(3000);
// websocket.ioモジュールの取得
var ws = require('websocket.io');
// websocketサーバ
var server = ws.attach(httpserver);
```



### サーバサイドコーディング（２）

index.js
```javascript
// websocketサーバにクライアントが接続して来た際に「connection」イベントが発生する
server.on('connection', function(socket) {
    // クライアントがメッセージを送信して来た際に「message」イベントが発生する
    socket.on('message', function(data) {
        // 接続しているクライアントの数だけループ
        server.clients.forEach(function(client) {
            // 接続しているクライアントに送信
            client.send(JSON.stringify(data));
        });
    });
    // サーバーに接続していたクライアントの接続が切れた際に「close」イベントが発生する
    socket.on('close', function() {
        console.log('close');
    });
});
```



### クライアントサイドコーディング（１）

index.html
```html
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <strong>ws chat</strong>
        <br>
        <input type="text" id="msg" />
        <input type="button" value="send" onclick="send()" />
        <hr>
        <div id="messages"></div>
        <script type="text/javascript" src="client.js"></script>
    </body>
</html>
```



### クライアントサイドコーディング（２）

client.js
```javascript
var messages = document.getElementById("messages");
var ws = new WebSocket('ws://localhost:3000');
ws.onopen = function() {
    messages.innerHTML += "<div>sebsocketサーバに接続しました</div>";
};
ws.onmessage = function(event) {
    var data = JSON.parse(event.data);
    messages.innerHTML += "<div>" + data + "</div>";
    console.log(data);
};
ws.onclose = function() {
    messages.innerHTML += "<div>sebsocketサーバとの接続が切れました</div>";
};
function send() {
    ws.send(document.getElementById('msg').value);
}
```



## 参考

- http://qiita.com/twipg/items/cb969b335d66c4aee690
- https://www.npmjs.com/package/websocket.io#socket
- http://tkybpp.hatenablog.com/entry/2016/05/08/195707
- http://mawatari.jp/archives/make-a-chat-application-in-node-js-and-websocket-io
- http://dev.classmethod.jp/server-side/ws/
- http://qiita.com/hshimo/items/1ecb7ed1b567aacbe559
- http://www.publickey1.jp/blog/15/joyentnodejs_foundationibmmicrosoftpaypalfidelity.html



# おわり
