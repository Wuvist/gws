requirejs.config({
  baseUrl: 'js',
  urlArgs: "v=" + (new Date()).getTime()
});

require(['ws'], function(ws) {
   $("#Calculate").click(function(){
      ws.call("Arith." + $("input[name='method']:checked").val(), [{"A": parseInt($("#A").val()), "B": parseInt($("#B").val())}], function(msg){
         $("#answer").val(JSON.stringify(msg.result));
      });      
   })
});