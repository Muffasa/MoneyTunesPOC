angular.module('starter.controllers', [])
.controller('testCtrl', function($scope,$rootScope,$state,Users,Campaigns,Weather,User) {
  $scope.from = Users.get(0);
  $scope.currentCampaign= Campaigns.get(0);

     Weather.getCurrentWeather(32.00,34.00).then(function(res){
      var currentInF = res.data.currently.apparentTemperature;
      $scope.currentTemp = (currentInF-32)/1.8;
      console.log("Weather test, response on fixed location: "+$scope.currentTemp);
     })

    $scope.unauth=function()
    {
      User.unauth();
    } 
    $scope.goToDash=function()
    {
      $state.go('tab.dash');
    } 
        $scope.goToLogin=function()
    {
      $state.go('login');
    } 
     $scope.goToSingin=function()
    {
      $state.go('sing-in');
    } 
    $scope.goToLiveConnection=function()
    {
      $state.go('live-connection');
    } 
    $scope.micOn=false;
            $scope.speaker = function(){
              $scope.micOn=!$scope.micOn;
          
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



              /* $ionicModal.fromTemplateUrl('modals/incoming-call-modal.html', {
              scope: $rootScope,
              animation: 'slide-in-up',
              backdropClickToClose: false,
              hardwareBackButtonClose: false
            }).then(function(modal) {
              $rootScope.incomingCallModal = modal;

            });*/
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

.controller('ChatDetailCtrl', function($scope, $stateParams,$state, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);

  $scope.call=function (){
    $state.go('calling', { to: $stateParams.chatId });

  }
 })






.controller('twilioTestCtrl', function($scope,$rootScope,$state,$ionicPopup, $http,User,$ionicModal,socket,Countries) {
            

  $scope.$on('$ionicView.beforeEnter', function() {
              if(!window.DebugMode){


          User.getCurrentUser(function(user){

                if(user)
                Twilio.Device.setup(user.twilio_token);
                else
                {
                  $state.go('welcome');
                }
              });
        }
 
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


;
