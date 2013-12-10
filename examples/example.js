var conn = require('amqp').createConnection('amqp://localhost');
var req = require('../index')(conn);

conn.once('ready', function() {
  conn.queue('target', function(q) {
    q.subscribe(function(message, header, deliveryInfo, job) {
      console.log('message: ', message);
      conn.publish(deliveryInfo.replyTo, { msg: 'pong!' }, {
        contentType: 'application/json'
      });
    });
    req('', 'target', { msg: 'ping!' }, {
      contentType: 'application/json'
    }, function(message, headers, deliveryInfo, job) {
      console.log('reply: ', message);
    });
  });
});

