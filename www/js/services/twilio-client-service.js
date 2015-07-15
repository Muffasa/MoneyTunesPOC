angular.module('MTPOC')
.run(function($rootScope,$q,TokensGenerator,socket){

      $rootScope.$on('MainUserSet',function(){
        initialize($rootScope.MainUser.phone_number);
        socket.emit("identify",$rootScope.MainUser.phone_number);
      });


          var initialize = function(user_phone_number){
          	if(!$rootScope.Twilio)
     	    $rootScope.Twilio = TwilioT;
     	    TokensGenerator.getTwilioToken(user_phone_number).then(function(twilioToken){
            	$rootScope.Twilio.Device.setup(twilioToken);
		        $rootScope.Twilio.userPhoneNumber=user_phone_number;
		    });

             $rootScope.TwilioClient={

			                    call:function(to){
									var d =$q.defer();
									if(!$rootScope.Twilio.initialized)
										d.reject("Twilio not initialized");
									else{
									      var connection = $rootScope.Twilio.Device.connect({ // Connect our call.
						                  CallerId:'+97243741132', // Your Twilio number (Format: +15556667777).
						                  callFrom: $rootScope.Twilio.userPhoneNumber,
						                  //PhoneNumber:'<Enter number to call here>',
						                  callTo:to // Number to call (Format: +15556667777).
						               });
									d.resolve(connection);
									}

									return d.promise;

								},
								answer:function(){
						            var d =$q.defer();
									if(!$rootScope.Twilio.initialized)
										d.reject("Twilio not initialized");
									else
									{

									var connection = $rootScope.Twilio.Device.connect({ // Connect our call.
						                  CallerId:'+97243741132', 
						                  AnswerQ:$rootScope.Twilio.userPhoneNumber+'Q'
						               });
									d.resolve(connection);
								    }

									return d.promise;
								 },
								hangup:function(){
									$rootScope.Twilio.Device.disconnectAll();
								 },
								sendDigits:function(digit){
						           $rootScope.Twilio.Connection.sendDigits(digit);
								 },
								setSpeaker:function(onOff){
									$rootScope.Twilio.Connection.setSpeaker(onOff);
								}
			             }

		        $rootScope.Twilio.initialized=true;//temp till event will fixed

            };


});
     




/*.factory("TwilioClient",function($rootScope,$q,TokensGenerator){
     var initialized=false;
     var userPhoneNumber=null;

          var initialize = function(user_phone_number){
          	if(!$rootScope.Twilio)
     	    $rootScope.Twilio = TwilioT;
     	    TokensGenerator.getTwilioToken(user_phone_number).then(function(twilioToken){
            	$rootScope.Twilio.Device.setup(twilioToken);
		        userPhoneNumber=user_phone_number;

             $rootScope.TwilioClient={

                    call:function(to){
						var d =$q.defer();
						if(!initialized)
							d.reject("Twilio not initialized");
						else{
						      var connection = $rootScope.Twilio.Device.connect({ // Connect our call.
			                  CallerId:'+97243741132', // Your Twilio number (Format: +15556667777).
			                  callFrom: userPhoneNumber,
			                  //PhoneNumber:'<Enter number to call here>',
			                  callTo:to // Number to call (Format: +15556667777).
			               });
						d.resolve(connection);
						}



						return d.promise;

					},
					answer:function(){
			            var d =$q.defer();
						if(!initialize)
							d.reject("Twilio not initialized");
						else
						{

						var connection = $rootScope.Twilio.Device.connect({ // Connect our call.
			                  CallerId:'+97243741132', 
			                  AnswerQ:userPhoneNumber+'Q'
			               });
						d.resolve(connection);
					    }

						return d.promise;
					 },
					hangup:function(){
						$rootScope.Twilio.Device.disconnectAll();
					 },
					sendDigits:function(digit){
			           $rootScope.Twilio.Connection.sendDigits(digit);
					 },
					setSpeaker:function(onOff){
						$rootScope.Twilio.Connection.setSpeaker(onOff);
					}
			             }







		        initialized=true;//temp till event will fixed

            });

     	      $rootScope.Twilio.Device.ready(function(twilioDevice){
				     		 console.log("Twilio.Device is now ready for connections");
				     		 $rootScope.$broadcast("twilio:ready");
				     		 registerEvents();
		                     initialized=true;
     					});
     };

     var registerEvents= function(){
     	
     	$rootScope.Twilio.Device.offline(function(twilioDevice){
     		 console.log("Twilio.Device is offline..reconnecting");
     		 $rootScope.$broadcast("twilio:offline");
     		 initialize(userPhoneNumber);	 

     	});
     	$rootScope.Twilio.Device.connect(function(twilioConnection){
     		 console.log("Twilio.Connection session started");
     		 $rootScope.$broadcast("twilio:connectionAlive");		 

     	});
     	$rootScope.Twilio.Device.disconnect(function(twilioConnection){
	        console.log("Twilio.Connection session started");		 
	        $rootScope.$broadcast("twilio:connectionDead");
     	});
     };

	return{

		init:initialize,
		call:function(to){
			var d =$q.defer();
			if(!initialized)
				d.reject("Twilio not initialized");
			else{
			      var connection = $rootScope.Twilio.Device.connect({ // Connect our call.
                  CallerId:'+97243741132', // Your Twilio number (Format: +15556667777).
                  callFrom: userPhoneNumber,
                  //PhoneNumber:'<Enter number to call here>',
                  callTo:to // Number to call (Format: +15556667777).
               });
			d.resolve(connection);
			}



			return d.promise;

		},
		answer:function(){
            var d =$q.defer();
			if(!initialize)
				d.reject("Twilio not initialized");
			else
			{

			var connection = $rootScope.Twilio.Device.connect({ // Connect our call.
                  CallerId:'+97243741132', 
                  AnswerQ:userPhoneNumber+'Q'
               });
			d.resolve(connection);
		    }

			return d.promise;
		},
		hangup:function(){
			$rootScope.Twilio.Device.disconnectAll();
		},
		sendDigits:function(digit){
           $rootScope.Twilio.Connection.sendDigits(digit);
		},
		setSpeaker:function(onOff){
			$rootScope.Twilio.Connection.setSpeaker(onOff);
		}

	}
})*/