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
