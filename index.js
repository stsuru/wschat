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
