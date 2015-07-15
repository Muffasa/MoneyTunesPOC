angular.module("directives.controllers",[])
.controller("incomingCallCtrl",function ($scope,$rootScope,$state,$http,MediaSrv,socket){
      
      var initRington = function(){
        MediaSrv.loadMedia('./Assets/rington.mp3').then(function(media)
          {
            if(!$rootScope.rington)
            $rootScope.rington=media;
            
          })
      };

      initRington();
      $scope.From = JSON.parse($scope.from);
      $scope.CurrentCampaign = JSON.parse($scope.currentCampaign);


      $scope.answer = function(){
       
              $rootScope.connection = $rootScope.TwilioClient.answer();
              $rootScope.rington.pause();
              $rootScope.rington.reset(); 
              $rootScope.incomingCallModal.hide();

                $state.go('live-connection'); 
            
      };
      $scope.reject = function(){
        $rootScope.rington.pause();
        $rootScope.rington.reset();
        initRington();
        $scope.$broadcast('timer-reset');
        $rootScope.incomingCallModal.hide();
        socket.emit("rejectCall");
      };
      $scope.messege = function(){
        //new modal  with templat es messeges and text box
      };

      $rootScope.$on("incomingCallModal.show",function(){

        $rootScope.rington.play();  
       // $scope.$broadcast('timer-set-countdown',$rootScope.currentCampaign.lenght);
        $scope.$broadcast('timer-start');
      });

    })
/*.controller("incomingCallCtrlsdf",function ($scope,$rootScope,$state,$http,MediaSrv,socket){
      
              //if(window.DebugMode)
              //{
                $http.get('http://188.226.198.99:3000/twilioTokenGen/'+$rootScope.MainUser.phone_number)
                .success(function(twilioToken){
                TwilioT.Device.setup(twilioToken);
              });

       // }
 
      var initRington = function(){
        MediaSrv.loadMedia('./Assets/rington.mp3').then(function(media)
          {

            $rootScope.rington=media;
            
          })
      };
      if(!$rootScope.rington)
      initRington();
      $scope.From = JSON.parse($scope.from);
      $scope.CurrentCampaign = JSON.parse($scope.currentCampaign);


      $scope.answer = function(){
       
              $rootScope.connection = TwilioT.Device.connect({//dosent allways work=\ regular connection firt solves it
                CallerId:'+97243741132', 
                AnswerQ:$rootScope.MainUser.phone_number +'Q'  
                });
              $rootScope.rington.pause();
              $rootScope.rington.reset(); 
              $rootScope.incomingCallModal.hide();

                $state.go('live-connection'); 
            
      };
      $scope.reject = function(){
        $rootScope.rington.pause();
        $rootScope.rington.reset();
        initRington();
        $scope.$broadcast('timer-reset');
        $rootScope.incomingCallModal.hide();
        socket.emit("rejectCall");
      };
      $scope.messege = function(){
        //new modal  with templat es messeges and text box
      };

      $rootScope.$on("incomingCallModal.show",function(){

      	$rootScope.rington.play(); 	
       // $scope.$broadcast('timer-set-countdown',$rootScope.currentCampaign.lenght);
      	$scope.$broadcast('timer-start');
      });

    })*/



;