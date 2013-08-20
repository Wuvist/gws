(function( ng, app ) {
	"use strict";

	var wsuri;
	if (window.location.protocol === "https:") {
		wsuri = "wss:" +  "//" + window.location.host + "/_ws";
	} else {
		wsuri = "ws:" +  "//" + window.location.host + "/_ws";
	}
	var sock = new WebSocket(wsuri);
	var _id = 0;
	var isConnected = false;
	var msgQueue = Array();
	var cbs = new Object();
	var _scope;

	sock.onopen = function() {
		console.log("connected to " + wsuri);
		isConnected = true;
		msgQueue.reverse();
		var msg = msgQueue.pop();
		while(msg) {
			console.log("send : " + msg);
			sock.send(msg);
			msg = msgQueue.pop();
		}
	}

	sock.onclose = function(e) {
		isConnected = false;
		console.log("connection closed (" + e.code + ")");
	}

	sock.onmessage = function(e) {
		var msg = JSON.parse(e.data);
		console.log("onmsg: " + e.data);
		var msgId = msg.id;
		if(msgId) {
			var cb = cbs[msgId];
			if(cb){
				delete cbs[msgId];
				cb.resolve(msg);
				_scope.$apply();
			}
		}
	}

	app.service(
		"wsService",
		function($rootScope, $q) {
			_scope = $rootScope;
			function _send(msg, cb) {
				_id += 1;
				msg["id"] = _id;
				cbs[_id] = cb;
				var strMsg = JSON.stringify(msg);
				if(isConnected) {
					console.log("send : " + strMsg);
					sock.send(strMsg);
				} else {
					msgQueue.push(strMsg);
				}
			}

			function call(method, params) {
				var deferred = $q.defer();
				var msg = {};
				msg.method = method;
				msg.params = params;
				_send(msg, deferred);
				return( deferred.promise );
			}

			// Return the public API.
			return({
				call: call
			});
		}
	);

})( angular, Demo );