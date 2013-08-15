requirejs.config({
  baseUrl: 'js'
});

require(['ws'], function(ws) {
   ws.call("Arith.Multiply", [{"A":4, "B":4}], function(msg){
      console.log("get answer:" + msg.result);
   });
});