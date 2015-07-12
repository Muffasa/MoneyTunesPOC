angular.module('starter.controllers', [])
.controller('testCtrl', function($scope,$rootScope,$state,Users,Campaigns,Weather) {
  $scope.from = Users.get(0);
  $scope.currentCampaign= Campaigns.get(0);
 ///test





     Weather.getCurrentWeather(32.00,34.00).then(function(res){
      var currentInF = res.data.currently.apparentTemperature;
      $scope.currentTemp = (currentInF-32)/1.8;
      console.log("Weather test, response on fixed location: "+$scope.currentTemp);
     })


    $scope.goToDash=function()
    {
      $state.go('tab.dash');
    } 
    $scope.goToLiveConnection=function()
    {
      $state.go('live-connection');
    } 
    $scope.micOn=false;
            $scope.speaker = function(){
              $scope.micOn=!$scope.micOn;
              //TwilioT.Connection.setSpeaker("on");
            }
    $scope.showForm=false; 
    $scope.focusInput=false;
    $scope.dialpadShow=false;
    $scope.toggleDialpad = function(){
      $scope.dialpadShow=!$scope.dialpadShow;
      $scope.showForm=!$scope.showForm; 
      $scope.focusInput=!$scope.focusInput;
    }

    $scope.popupDialpad = function(){

                 $ionicModal.fromTemplateUrl('modals/dialpad-modal.html', {
                                    scope: $scope,
                                    animation: 'slide-in-down',
                                    backdropClickToClose: true,
                                    hardwareBackButtonClose: true
                                  }).then(function(modal) {
                                    $scope.dialpadModal = modal;
                                  });

                                  $scope.dialpadModal.show();

    }
})
.controller('liveConnectionCtrl', function($scope,$rootScope,$state,$ionicHistory) {

 $scope.$broadcast('timer-start');

        $scope.micOn=false;
     $scope.speaker = function(){
          $scope.micOn=!$scope.micOn;

          $scope.micOn? TwilioT.Connection.setSpeaker("on"):TwilioT.Connection.setSpeaker("off");
        };

       $scope.showForm=false; 
       $scope.focusInput=false;
       $scope.dialpadShow=false;
     $scope.toggleDialpad = function(){
          $scope.dialpadShow=!$scope.dialpadShow;
          $scope.showForm=!$scope.showForm; 
          $scope.focusInput=!$scope.focusInput;
        };

     $scope.hangup = function(){
      TwilioT.Device.disconnectAll();
      $ionicHistory.goBack();

     }   




})
.controller('DashCtrl', function($scope, $rootScope, $ionicUser, $ionicPush,$ionicModal,socket,User) {
  // Identifies a user with the Ionic User service
                $ionicModal.fromTemplateUrl('modals/dialpad-modal.html', {
                                scope: $scope,
                                animation: 'slide-in-down',
                                backdropClickToClose: true,
                                hardwareBackButtonClose: true
                              }).then(function(modal) {
                                $scope.dialpadModal = modal;
                              });

               /* $ionicModal.fromTemplateUrl('modals/incoming-call-modal.html', {
                  scope: $scope,
                  animation: 'slide-in-up',
                  backdropClickToClose: true,
                                hardwareBackButtonClose: true
                }).then(function(modal) {
                  $scope.incomingCallModal = modal;
                });*/

                $ionicModal.fromTemplateUrl('modals/ongoing-call-modal.html', {
                  scope: $scope,
                  animation: 'slide-in-up',
                  backdropClickToClose: true,
                                hardwareBackButtonClose: true
                }).then(function(modal) {
                  $scope.outgoingCallModal = modal;
                });

  $scope.showDailpad = function() {
    $scope.dialpadModal.show();
  };
  $scope.showIncomingCall = function(){
    $rootScope.incomingCallModal.show();
    $rootScope.$broadcast("incomingCallModal.show");//will fire on incoming call socket event
  };
  $scope.showOutgoingCall = function(){
    $scope.outgoingCallModal.show();
  };



               $ionicModal.fromTemplateUrl('modals/incoming-call-modal.html', {
              scope: $rootScope,
              animation: 'slide-in-up',
              backdropClickToClose: false,
              hardwareBackButtonClose: false
            }).then(function(modal) {
              $rootScope.incomingCallModal = modal;

            });


})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
 })

.controller('ContactsCtrl', function($scope,$cordovaContacts,Contacts) {
  
  
    $scope.contacts = Contacts.allUsers();
  

   $scope.getContactList = function() {
    
   }
})

.controller('LoginCtrl', function($scope,Auth) {

    $scope.email=null;
    $scope.password=null;

      $scope.anonLogin = function() {
      $scope.authData = null;
      $scope.error = null;

      Auth.$authAnonymously().then(function(authData) {
        console.log("Anonymus user loged in with uid: " + userData.uid);
      }).catch(function(error) {
        $scope.error = error;
      });
      };




     $scope.getTwilioToken = function(user_phone_number){
      $http({
            url:'http://188.226.198.99:3000/twilioTokenGen',
            method: 'GET',
            params: {userPhoneNumber:user_phone_number}
      }).success(function(token){$scope.token=token;});
      };

    $scope.twilioToken='not set';

    /*$scope.getFirebaseToken = function(){
      $http({
            url:'http://188.226.198.99:3000/createFirebaseToken',
            method: 'GET',
            params: {userPhoneNumber:user_phone_number}
      }).success(function(token){$scope.token=token;});
      };

    $scope.firebaseToken='not set';*/





      $scope.miniSingIn = function (){
        Auth.authWithCustomToken($scope.firebaseToken, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Login Succeeded!", authData);
          }
        })
      };




     /* $scope.login = function {
        Auth.$authWithPassword({
          email: $scope.email,
          password: $scope.password
        }).then(function(authData) {
          console.log("Logged in as:", authData.uid);
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
      };*/

})


.controller('WelcomeCtrl', function($scope,$rootScope,$state,$ionicPopup,$ionicUser,Auth,User, Countries,socket) {

/* $scope.$on('$ionicView.beforeEnter', function() {
                 
                 if($rootScope.DebugMode)
                 {
                  
                  $state.go("tab.dash")
                 } 


              if(User.isAuth()){
                    $state.go("tab.twilio-client");
                  }

                 // console.log("no user session detected..welcome!");
 
       });*/

$scope.enterAsOhad = function(){

}






      $scope.countries = Countries.all();
      $scope.selectedCountry= $scope.countries[102];
      $scope.usernumber=null;
      $scope.userCodeInput=null;

     

      
      $scope.goToLoginState = function(){$state.go('login');}

      $scope.ConfirmNumber = function(number) {

        if(true)//number.isValid)
        {

          var confirmPopup = $ionicPopup.confirm({
            title: 'Confirmation',
            template: 'Are you sure this is your phone number? an SMS will be send to this number: ' + number,
            cancelText:'Cancel',
            okText:'Send'

          });
        }

      confirmPopup.then(function(res) {
        if(res) {
            $rootScope.show();
            socket.emit("MiniRegister", $scope.selectedCountry.dial_code+'-'+number);

            socket.on("MiniRegisterSuccess",function(){
              $rootScope.user_phone_number=$scope.selectedCountry.dial_code+'-'+number;
              $rootScope.hide();
            $state.go('welcome-post-sms',{userPhoneNumber:$scope.selectedCountry.dial_code+'-'+number,country:$scope.selectedCountry.name});
            });
            //sms code generated and user saved on the DB with
            //this params: user_phone,sms_code,current_socket_id
            
          }

                                        
         else {
          
        }
      });

    };

})
.controller('WelcomePostCtrl',function($scope,$rootScope,$http,$state,$stateParams,$ionicUser,$ionicPush,$ionicPopup,$q,$cordovaDevice,Auth,User,Countries,socket){

   

  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
   // alert("Successfully registered token " + data.token);
    console.log('Ionic Push: Got token ', data.token, data.platform);
    $scope.ionicPushToken = data.token;
    console.log("cordovePush token:"+data.token+" Device uuid:"+$cordovaDevice.getUUID());
  });
      $scope.fullnumber=$stateParams.userPhoneNumber;


 $scope.ConfirmSmsCode =function(user_code){
  $rootScope.show();
  flow(user_code).then(function(){
    console.log("flow resolved!");
    compeleteMiniRegistrationAndLogin().then(function(firebaseAuthToken){
      console.log("compeleteMiniRegistrationAndLogin resolved! firebase token:" +firebaseAuthToken);
      User.saveAuthTokenLocally(firebaseAuthToken);
      User.auth().then(function(user){
        console.log("all set up, current user number:" +user.phone_number);
        //$state.go('tab.twilio-client');
        $rootScope.hide();
      });
      

    })
  },function(error){
      $ionicPopup.alert({
      title: 'Smthing went wrong ):',
      template: 'En error occured:' +error
      });
    });
  };

 var compeleteMiniRegistrationAndLogin = function(){

  var d = $q.defer();
        createFirebaseUser({
        phone_number: $stateParams.userPhoneNumber,
        //on production uuid:$cordovaDevice.getUUID()
        country: Countries.getByDialCode($stateParams.userPhoneNumber.slice(0,$stateParams.userPhoneNumber.indexOf('-'))),
        ionic_push_token: $scope.ionicPushToken,
        twilio_token: $scope.twilioToken

        
      }).then(function(uid) {

          console.log("User created with uid: " + uid);

          getFirebaseAuthToken(uid).then(function(firebaseAuthToken){
          d.resolve(firebaseAuthToken);
          },function(error){
          d.reject(error);
          });
       
      });
      return d.promise;

      /*var d = $q.defer();
        Auth.$createUser({
        email:  $stateParams.userPhoneNumber+"@temp.com", 
        password: String(Math.random()), 
        phone_number: $stateParams.userPhoneNumber,
        //on production uuid:$cordovaDevice.getUUID()
        country: Countries.getByDialCode($stateParams.userPhoneNumber.slice(0,$stateParams.userPhoneNumber.indexOf('-'))),
        device_token: $scope.deviceToken,
        twilio_token: $scope.twilioToken

        
      }).then(function(userData) {

          console.log("User created with uid: " + userData.uid);

          getFirebaseAuthToken(userData.uid).then(function(firebaseAuthToken){
          d.resolve(firebaseAuthToken);
          },function(error){
          d.reject(error);
          });
       
      }).catch(function(error) {
        d.reject(error);
      });
      return d.promise;*/

 }

 var createFirebaseUser = function(user){
  var d = $q.defer();
  var baseRef= new Firebase("https://mtdemo.firebaseio.com");

 var userID =  baseRef.child("users").push().key();

 if(userID){
  user.uid=userID;
  User.setId(userID);
  baseRef.child("users").child(userID).set(user);
  d.resolve(userID);
 }
 else{
  d.reject();
 }

 return d.promise;
 }
  
 var flow = function(user_code){
  var d = $q.defer();
  console.log("entered flow");
  socket.emit('ConfirmSmsCode',user_code,$stateParams.userPhoneNumber);

    socket.on("SmsCodeConfirmed",function(MyCustomToken){
      //the user input code matchs the DB temp user phone_number sms_code bound,
      //deeping the register to untempuser and generates API tokens:
      socket.removeListener('WrongCode');
      console.log("smsconfirmedeventfromserver and his token:" +MyCustomToken);
      getTwilioToken().then(function(twilioToken){
      console.log("got twilio token token:" +twilioToken);
        $scope.twilioToken=twilioToken;

        ionicIdentifyUser().then(function(){
          console.log("ionic identify user identified");
            pushRegister().then(function(){
              console.log("ionic push registered");

              d.resolve();

            },function(error){
              console.log("ionic push register error:" + error);
              d.reject(error);
            })
        },function(error){
          console.log("ionic idenification error:" + error);
          d.reject(error);
        })
      },function(error){
        console.log("twilio error:" +error);
        d.reject(error);
      })

      
      
      socket.removeListener('SmsCodeConfirmed');
      
    });

    socket.on('WrongCode',function(){
      socket.removeListener('WrongCode');
      $rootScope.hide();
      $ionicPopup.alert({
      title: 'Wrong code',
      template: 'The code you entered is wrong, please try again'
      });
      
    });

 return d.promise;
  
 };

  var getTwilioToken= function (){
  var d = $q.defer();

   $http.get('http://188.226.198.99:3000/twilioTokenGen/'+$stateParams.userPhoneNumber)
             .success(function(twilioToken){
                d.resolve(twilioToken);
              },function(error){
                d.reject(error);
              });

    return d.promise;         

  };

  var getFirebaseAuthToken= function (uid){
  var d = $q.defer();

   $http.get('http://188.226.198.99:3000/createFirebaseToken/'+uid)
             .success(function(firebaseAuthToken){
                d.resolve(firebaseAuthToken);
              },function(error){
                d.reject(error);
              });

    return d.promise;         

  };

  var ionicIdentifyUser = function() {
  var d = $q.defer();

    var user = $ionicUser.get();
    if(!user.user_id) {
      user.user_id = $stateParams.userPhoneNumber;
      // on production user.uuid=$cordovaDevice.getUUID();
      user.device_token=$scope.deviceToken
    };

    // Identify your user with the Ionic User Service
    $ionicUser.identify(user).then(function(){
      $rootScope.ionicUserIdentified = true;
      $scope.ionicUserId =user.user_id;
      d.resolve();
    },function (error) {
      d.reject(error);
    });
    return d.promise;
  };

  var pushRegister = function() {
    var d =$q.defer();
  

    $ionicPush.register({
      canShowAlert: true, //Can pushes show an alert on your screen?
      canSetBadge: true, //Can pushes update app icon badges?
      canPlaySound: true, //Can notifications play a sound?
      canRunActionsOnWake: true, //Can run actions outside the app,
      onNotification: function(notification) {
        
         console.log(notification);
        return true;
      }
    }).then(function(){
      d.resolve();
    })

    return d.promise;
  }; 

  




  $scope.getTwilioToken= function (){

   $http.get('http://188.226.198.99:3000/twilioTokenGen/'+$stateParams.userPhoneNumber)
             .success(function(twilioToken){
                $scope.twilioToken=twilioToken;
              });

  };

 
  $scope.ionicIdentifyUser = function() {

    var user = $ionicUser.get();
    if(!user.user_id) {

      user.user_id = $stateParams.userPhoneNumber
    

    };

    // Identify your user with the Ionic User Service
    $ionicUser.identify(user).then(function(){
      $rootScope.ionicUserIdentified = true;
      $scope.ionicUserId =user.user_id;
    });
  };
  
  // Registers a device for push notifications and stores its token
    $scope.pushRegister = function() {
    console.log('Ionic Push: Registering user');

    // Register with the Ionic Push service.  All parameters are optional.
    $ionicPush.register({
      canShowAlert: true, //Can pushes show an alert on your screen?
      canSetBadge: true, //Can pushes update app icon badges?
      canPlaySound: true, //Can notifications play a sound?
      canRunActionsOnWake: true, //Can run actions outside the app,
      onNotification: function(notification) {
        // Handle new push notifications here
        // console.log(notification);
        return true;
      }
    });
  }

})
.controller('twilioTestCtrl', function($scope,$rootScope,$state,$ionicPopup, $http,User,$ionicModal,socket,Countries) {
            

  $scope.$on('$ionicView.beforeEnter', function() {
              
          User.getCurrentUser(function(user){

                if(user)
                Twilio.Device.setup(user.twilio_token);
                else
                {
                  $state.go('welcome');
                }
              });
 
       });




            $scope.dialpadInput="";

               
                
              
                

                $scope.testRing = function () {
                  var src = "/Assets/rington.mp3";
                  var media = new Media(src, null, null, mediaStatusCallback);
                    media.play()
               };
            


            // Make a Twilio call.
            $scope.call = function (to) {
              var addPrefix = "+972-"+to;
               Twilio.Device.connect({ // Connect our call.
                  CallerId:'+97243741132', // Your Twilio number (Format: +15556667777).
                  callFrom: $rootScope.User.phone_number,
                  //PhoneNumber:'<Enter number to call here>',
                  callTo:addPrefix // Number to call (Format: +15556667777).
               });
               
               socket.emit('outgoingCall',addPrefix);
            };

            $scope.answer = function(){
              Connection = Twilio.Device.connect({
                CallerId:'+97243741132', 
                AnswerQ:$rootScope.User.phone_number +'Q'    
                
                 });
              //Ring.stop();
            };

            // Hang up a Twilio call.
            $scope.hangUp = function () {
               Twilio.Device.disconnectAll(); // Disconnect our call.
            };

            $scope.pressed = function (num){
              $scope.dialpadInput+=num;
            };

            $scope.removed = function (){
              $scope.dialpadInput=$scope.dialpadInput.slice(0,$scope.dialpadInput.length - 1);
            }


             

            $scope.IncomingCall=false;
            socket.on("IncomingCall",function(from){
              $scope.IncomingCall=true;
            })





         })

.controller('TwilioTestCtrl', function($scope,$rootScope,$state,$ionicPopup, $http,User,$ionicModal,socket,Countries,MediaSrv) {
            

$scope.$on('$ionicView.beforeEnter', function() {
              
          User.getCurrentUser(function(user){

                if(user)
                TwilioT.Device.setup(user.twilio_token);
                else
                {
                  $state.go('welcome');
                }
              });
 
       });

MediaSrv.loadMedia('./Assets/rington.mp3').then(function(media)
      {
        $scope.rington=media;
        
      })




            $scope.dialpadInput="";

               
                
              
                

                $scope.testRing = function () {
                  $scope.rington.play();
                };
            


            // Make a Twilio call.
            $scope.call = function (to) {
              var addPrefix = "+972-"+to;
               $rootScope.connection=TwilioT.Device.connect({ // Connect our call.
                  CallerId:'+97243741132', // Your Twilio number (Format: +15556667777).
                  callFrom: $rootScope.User.phone_number,
                  //PhoneNumber:'<Enter number to call here>',
                  callTo:addPrefix // Number to call (Format: +15556667777).
               });
               
               socket.emit('outgoingCall',addPrefix);
            };

            $scope.answer = function(){
              $rootScope.connection = TwilioT.Device.connect({
                CallerId:'+97243741132', 
                AnswerQ:$rootScope.User.phone_number +'Q'    
                
                 });
              //Ring.stop();
            };

            // Hang up a Twilio call.
            $scope.hangUp = function () {
               TwilioT.Device.disconnectAll(); // Disconnect our call.
            };

            $scope.pressed = function (num){
              $scope.dialpadInput+=num;
              TwilioT.Connection.sendDigits(num);
            };

            $scope.removed = function (){
              $scope.dialpadInput=$scope.dialpadInput.slice(0,$scope.dialpadInput.length - 1);
            }


              $scope.speakerON=false;
            $scope.openModal = function() {
              $scope.speakerON=!$scope.speakerON;
              $scope.speakerON? TwilioT.Connection.setSpeaker('on'):TwilioT.Connection.setSpeaker('off');
            };
            $scope.closeModal = function() {
              $scope.modal.hide();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
              $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hidden', function() {
              // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function() {
              // Execute action
            });

            $scope.IncomingCall=false;
            socket.on("IncomingCall",function(from){
              $scope.IncomingCall=true;
            })





         })



.controller('AccountCtrl', function($scope) {
  $scope.user = Global.getCurrentUser;
});
