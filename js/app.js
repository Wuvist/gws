requirejs.config({
  baseUrl: 'js',
  urlArgs: "v=" + (new Date()).getTime()
});

require(['ws'], function(ws) {
   ws.call("Arith.Divide", [{"A":7, "B":4}], function(msg){
      console.log("get answer:");
      console.log(msg.result.Rem);
   });
});