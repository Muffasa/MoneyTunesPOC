angular.module('views.controllers',[])



.controller('profileCtrl', function($scope,$rootScope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk,facebookService) {
    // Set Header

    
    $scope.isExpanded = false;
    $scope.test = "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc3/v/t1.0-1/c42.42.528.528/s50x50/1010164_10201302239219813_888308472_n.jpg?oh=25bcad6f28c8244f2be56f0bd9ed0439&oe=5657AEC4&__gda__=1444637015_652112ec8a8c3eca38b20f14b0720569";
    $scope.profilePicture=$rootScope.MainUser.facebookData.profileImageURL;
    $scope.coverPhotoUrl=$rootScope.MainUser.facebookData.coverPhotoUrl;
    $scope.displayName= $rootScope.MainUser.facebookData.cachedUserProfile.name;

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('AccountCtrl', function($scope,$rootScope,socket) {
  
$scope.toggleOnline = false;
$scope.isOnline= "Offline";

  $scope.connect=function(){
    $scope.toggleOnline=!$scope.toggleOnline;
    if($scope.toggleOnline)
    socket.emit("identify",$rootScope.MainUser.phone_number);

  };

  socket.on('identified',function(){
    $scope.isOnline = "Online";
  })
})

.controller('liveConnectionCtrl', function($scope,$rootScope,$state,$ionicHistory) {

 $scope.$broadcast('timer-start');

        $scope.micOn=false;
     $scope.speaker = function(){
          $scope.micOn=!$scope.micOn;

         // $scope.micOn? TwilioT.Connection.setSpeaker("on"):TwilioT.Connection.setSpeaker("off");
          $scope.micOn? $rootScope.TwilioClient.setSpeaker("on"):$rootScope.TwilioClient.setSpeaker("off");
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
      $rootScope.TwilioClient.hangup();
      $ionicHistory.goBack(); 

     }   




})
.controller('callingCtrl', function($scope,$rootScope,$state,$stateParams,$ionicHistory,socket,Users) {


        $scope.callingTo=Users.get($stateParams.to);


       socket.on('call:answer',function(){
        $rootScope.peerUser = $scope.callingTo;//get full user data
        $state.go('live-connection');
       })
       socket.on('call:reject',function(){
        $rootScope.peerUser = $scope.callingTo;//get full user data
       })
       socket.on('call:noAnswer',function(){

       })




})
.controller('TwilioTestCtrl', function($scope,$rootScope,$state,$ionicPopup, $http,User,$ionicModal,socket,Countries,MediaSrv) {
            



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
               $rootScope.connection=$rootScope.TwilioClient.call(addPrefix);
               
               socket.emit('outgoingCall',addPrefix);
            };

            $scope.answer = function(){
              $rootScope.connection = $rootScope.TwilioClient.answer();
              //Ring.stop();
            };

            // Hang up a Twilio call.
            $scope.hangUp = function () {
              $rootScope.TwilioClient.hangup(); // Disconnect our call.
            };

            $scope.pressed = function (num){
              $scope.dialpadInput+=num;
              $rootScope.TwilioClient.sendDigits(num);
            };

            $scope.removed = function (){
              $scope.dialpadInput=$scope.dialpadInput.slice(0,$scope.dialpadInput.length - 1);
            }


              $scope.speakerON=false;
            $scope.openModal = function() {
              $scope.speakerON=!$scope.speakerON;
              $scope.speakerON? $rootScope.TwilioClient.setSpeaker('on'):$rootScope.TwilioClient.setSpeaker('off');
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





         })//with TwilioClientService

/*.controller('TwilioTestCtrlasd', function($scope,$rootScope,$state,$ionicPopup, $http,User,$ionicModal,socket,Countries,MediaSrv) {
            

 $scope.$on('$ionicView.beforeEnter', function() {
              
              if(window.DebugMode)
              {
                $http.get('http://188.226.198.99:3000/twilioTokenGen/'+$rootScope.MainUser.phone_number)
                .success(function(twilioToken){
                TwilioT.Device.setup(twilioToken);
                });

             }
        else{
                    

             

        }
 
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
                  callFrom: $rootScope.MainUser.phone_number,
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





})*/

;