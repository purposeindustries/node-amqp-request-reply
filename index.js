module.exports = function wrapper(conn) {
  return function(exchange, route, message, options, cb) {
    function onExchange(exchange) {
      exchange.publish(route, message, options);
    }
    conn.queue('', function(anon) {
      options.replyTo = anon.name;
      anon.subscribe(function(message, headers, deliveryInfo, job) {
        cb(message, headers, deliveryInfo, job);
        anon.unsubsrcibe(deliveryInfo.consumerTag);
      });
      if(typeof exchange === 'string') {
        return conn.exchange(exchange, {}, onExchange);
      }
      onExchange(exchange);
    });
  };
};
