(function(document){

var ws;
function socket() {
    ws = new WebSocket('ws://127.0.0.1:9000');
    ws.onmessage = function(e) {
        var data = JSON.parse(e.data);
        if (data.r) {
            document.location.reload();
        }
    }
	ws.onerror = ws.onclose = function(e) {
		ws = null;
	}
}

setInterval(function() {
    if (ws) {
        if (ws.readyState !== 1) {
            socket();
        }
    }
    else {
        socket();
    }
}, 1000);

}(document))
