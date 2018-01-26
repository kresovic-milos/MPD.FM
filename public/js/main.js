
var socket = null;

Vue.component('radio-station', {
    props: ['station']
})  

var app = new Vue({
    el: '#app',
    data: {
        stationList: [ ]
    },
    created: function () {
        connectWSS();

    //   this.stationList.push( { });
    }
})

function connectWSS() {
    // Connect to WebSocket server
    var url = 'ws://'+location.hostname+(location.port ? ':'+location.port: '');
    socket = new ReconnectingWebSocket(url, null, {reconnectInterval: 3000});

    socket.onopen = function () {
        sendWSSMessage('REQUEST_STATION_LIST', null);
    };

    socket.onmessage = function (message) {
        var msg = JSON.parse(message.data);
        switch(msg.type) {
            case "STATION_LIST":
                app.stationList = msg.data;
                break;
        }
    };

    socket.onerror = socket.onclose = function(err) {
        // console.log('close / error');
    };
}

function sendWSSMessage(type, data) {
    var msg = {
        type: type,
        data: (data) ? data : {}
    }
    socket.send(JSON.stringify(msg));
}