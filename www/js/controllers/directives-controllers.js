angular.module("directives.controllers",[])

.controller("incomingCallCtrl",function ($scope,$rootScope,$state,$http,MediaSrv,socket){
      
              if(window.DebugMode)
              {
                $http.get('http://188.226.198.99:3000/twilioTokenGen/'+$rootScope.MainUser.phone_number)
             .success(function(twilioToken){
                TwilioT.Device.setup(twilioToken);
              });

        }

      MediaSrv.loadMedia('./Assets/rington.mp3').then(function(media)
      {
        $scope.rington=media;
        
      })
      $scope.From = JSON.parse($scope.from);
      $scope.CurrentCampaign = JSON.parse($scope.currentCampaign);

      //console.log($scope.CurrentCampaign.name);
      //alert($scope.From.name);
     // $scope.rington = angular.element().find("audio");
      //$scope.timer = angular.element().find("timer");
      $scope.ring = function(){
      	$scope.rington.play();
      };


      $scope.answer = function(){
       
              $rootScope.connection = TwilioT.Device.connect({
                CallerId:'+97243741132', 
                AnswerQ:$rootScope.MainUser.phone_number +'Q'  
                });
              $scope.rington.stop(); 
              $rootScope.incomingCallModal.hide();

                $state.go('live-connection'); 
               // $rootScope.incomingCallModal.hide(); 
                //$rootScope.incomingCallModal.destroy();             
      };
      $scope.reject = function(){
        $scope.rington.stop();
        //$rootScope.incomingCallModal.hide();
       // $rootScope.incomingCallModal.destroy();
        socket.emit("rejectCall");
      };
      $scope.messege = function(){
        //new modal  with templat es messeges and text box
      };

      $rootScope.$on("incomingCallModal.show",function(){

      	$scope.ring(); 	
       // $scope.$broadcast('timer-set-countdown',$rootScope.currentCampaign.lenght);
      	$scope.$broadcast('timer-start');
      });

    })



;