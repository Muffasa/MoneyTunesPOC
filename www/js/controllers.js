angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, $ionicUser, $ionicPush,socket) {
  // Identifies a user with the Ionic User service
  $scope.identifyUser = function() {
    console.log('Ionic User: Identifying with Ionic User service');

    var user = $ionicUser.get();
    if(!user.user_id) {
      // Set your user_id here, or generate a random one.
      user.user_id = $ionicUser.generateGUID();
    };

    // Add some metadata to your user object.
    angular.extend(user, {
      name: 'Ionitron',
      bio: 'I come from planet Ion'
    });

    // Identify your user with the Ionic User Service
    $ionicUser.identify(user).then(function(){
      $scope.identified = true;
     // alert('Identified user ' + user.name + '\n ID ' + user.user_id);
    });
  };

  $scope.connect = function(){
    socket.emit('connecta','test');
    socket.emit('identify','test');
  };
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
  
  
    $scope.contacts = Contacts;
  

  $scope.getContactList = function() {
    $cordovaContacts.find({filter: ''}).then(function(result) {
        $scope.contacts = result;
    }, function(error) {
        console.log("ERROR: " + error);
    });
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

 $scope.$on('$ionicView.beforeEnter', function() {
                  
              if(User.isAuth()){
                    User.getCurrentUser();
                    $state.go("tab.twilio-client");
                  }
 
       });

      $scope.countries = Countries.all();
      $scope.selectedCountry= $scope.countries[102];
      $scope.usernumber=null;
      $scope.userCodeInput=null;

     

      
      $scope.goToLoginState = function(){$state.go('login');}

      $scope.ConfirmNumber = function(number) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirmation',
        template: 'Are you sure this is your phone number? an SMS will be send to this number: ' + number,
        cancelText:'Cancel',
        okText:'Send SMS'

      });
      confirmPopup.then(function(res) {
        if(res) {
            $rootScope.show();
            socket.emit("MiniRegister", $scope.selectedCountry.dial_code+'-'+number);

            socket.on("MiniRegisterSuccess",function(){
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

   $scope.fullnumber=$stateParams.userPhoneNumber;

  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
   // alert("Successfully registered token " + data.token);
    console.log('Ionic Push: Got token ', data.token, data.platform);
    $scope.ionicPushToken = data.token;
  });

 $scope.ConfirmSmsCode =function(user_code){
  $rootScope.show();
  flow(user_code).then(function(){
    console.log("flow resolved!");
    compeleteMiniRegistrationAndLogin().then(function(firebaseAuthToken){
      console.log("compeleteMiniRegistrationAndLogin resolved! firebase token:" +firebaseAuthToken);
      User.saveAuthTokenLocally(firebaseAuthToken);
      User.auth();
      Auth.$authWithCustomToken(window.localStorage.getItem("authToken")).then(function(authData) {
          console.log("Logged in as:", authData);
          $rootScope.hide();
          $state.go('tab');
        }).catch(function(error) {
          console.error("Authentication failed:", error);
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
.controller('twilioTestCtrl', function($scope, $http,User,$ionicModal) {
            var user = User.getCurrentUser();
            $scope.dialpadInput="";

               user.$loaded().then(function(){
                Twilio.Device.setup(user.twilio_token);
              });
                // Setup our Twilio device with the token.

            // Make a Twilio call.
            $scope.call = function (to) {
               Twilio.Device.connect({ // Connect our call.
                  CallerId:'+97243741132', // Your Twilio number (Format: +15556667777).
                  callFrom: user.phone_number,
                  //PhoneNumber:'<Enter number to call here>',
                  callTo:to // Number to call (Format: +15556667777).
               });
            };

            $scope.answer = function(){
              Connection = Twilio.Device.connect({
                CallerId:'+97243741132', 
                AnswerQ:user.phone_number +'Q'    
                
                 });
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


              $ionicModal.fromTemplateUrl('modals/dialpad-modal.html', {
                  scope: $scope,
                  animation: 'slide-in-up'
                }).then(function(modal) {
                  $scope.modal = modal;
                });
            $scope.openModal = function() {
              $scope.modal.show();
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





         })

.controller('AccountCtrl', function($scope) {
  $scope.user = Global.getCurrentUser;
});
