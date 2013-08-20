(function( ng, app ){
	"use strict";

	app.controller(
		"AppController",
		function($scope, wsService) {
			$scope.Calculate = function() {
				wsService.call("Arith." + $("input[name='method']:checked").val(), [{"A": parseInt($("#A").val()), "B": parseInt($("#B").val())}]).then(
					function(msg){
						$("#answer").val(JSON.stringify(msg.result));
					},
					function(err){
						console.log(err);
					}
				);
			};
		}
	);
})( angular, Demo );
