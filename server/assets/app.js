// Vue.config.devtools = true;
var app = new Vue({
  el: '#app',
  mounted: function() {
    var self = this;

    // Force moment to English
    moment.locale('en');

    // Websocket connection
    var scheme = "ws";
    if (location.protocol == "https:") {
      scheme = "wss";
    }
    var socket = new WebSocket(scheme+"://"+location.host+"/ws");
    socket.onopen = function() {
        console.log("Socket is open");
    };
    socket.onmessage = function (e) {
      self.data = e.data;
      data = JSON.parse(e.data);
      // TODO data['error']
      self.updated_at = data['updated_at'];
      self.os_stats = data['os_stats'];
      self.containers_stats = data['containers_stats'];

      if ( self.totalMemory === -1 && data['os_stats'] !== {} ) {
        self.totalMemory = data['os_stats']['mem']['total'];
      }
    };
    socket.onclose = function () {
      console.log("Socket closed");
      self.error = "Fatal error, you must restart your application please.";
    };
  },
  data: {
    totalMemory: -1,
    data: "",
    updated_at: "",
    os_stats: {
      "cpu_usage_percent": -1,
      "mem": {
        "total": -1,
        "available": -1
      },
      "net": {
        "tx": -1,
        "rx": -1
      },
      "io": {
        "bytes_read": -1,
        "bytes_write": -1
      }
    },
    containers_stats: []
  },
  computed: {
    memUsage: function () {
      if (this.os_stats === {} || this.os_stats['mem'] == {}) return 0;
      return this.totalMemory - this.os_stats['mem']['available'];
    }
  },
  filters: {
    round: function (value) {
      return round2decimals(value);
    },
    bytesHumanize: function (bytes) {
      return bytesHumanize(bytes);
    },
    momentTime: function (date) {
      return moment(date).format("HH:mm:ss");
    }
  }
});
