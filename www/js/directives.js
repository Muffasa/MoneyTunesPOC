angular.module('starter.directives', [])
.directive('myFirstDirective', function() {
  return {
    restrict: 'E',
    template: '<h1>WTWWWWWWWWWFFFFFFFF</h1>',
    controller: function($scope){

    }
    
  };
})
.directive('incomingCall',['$state','$rootScope',function($state,$rootScope) {
  return {

    restrict: 'E',
    templateUrl: 'templates/myDirectives/incoming-call-directive.html',
    scope:{

    	from:"@",
      currentCampaign:"@",
      test:"=test"

    },

    controller: function ($scope,$rootScope,$state,MediaSrv){
      
      MediaSrv.loadMedia('./Assets/rington.mp3').then(function(media)
      {
        $scope.rington=media;
        $scope.rington.play();
      })
      $scope.From = JSON.parse($scope.from);
      $scope.CurrentCampaign = JSON.parse($scope.currentCampaign);

      //console.log($scope.CurrentCampaign.name);
      //alert($scope.From.name);
     // $scope.rington = angular.element().find("audio");
      //$scope.timer = angular.element().find("timer");


      $scope.answer = function(){
        
              $rootScope.connection = Twilio.Device.connect({
                CallerId:'+97243741132', 
                AnswerQ:$rootScope.User.phone_number +'Q'  
                });

                $state.go('live-connection'); 
                $rootScope.incomingCallModal.hide(); 
                $rootScope.incomingCallModal.destroy();             
      };
      $scope.reject = function(){
        $scope.rington.stop();
        //$rootScope.incomingCallModal.hide();
       // $rootScope.incomingCallModal.destroy();
        socket.emit("rejectCall");
      };
      $scope.messege = function(){
        //new modal  with templates messeges and text box
      };

    }
    	


    }
 
}])
.directive('miniUserView', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/myDirectives/mini-user-directive.html',
    scope:{
       user:'='
    },
    controller: function($scope){

    }
    
  };
})

.directive('myTabs', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    controller: function($scope) {
      var panes = $scope.panes = [];

      $scope.select = function(pane) {
        angular.forEach(panes, function(pane) {
          pane.selected = false;
        });
        pane.selected = true;
      };

      this.addPane = function(pane) {
        if (panes.length === 0) {
          $scope.select(pane);
        }
        panes.push(pane);
      };
    },
    templateUrl: 'my-tabs.html'
  };
})
.directive('myPane', function() {
  return {
    require: '^myTabs',
    restrict: 'E',
    transclude: true,
    scope: {
      title: '@'
    },
    link: function(scope, element, attrs, tabsCtrl) {
      tabsCtrl.addPane(scope);
    },
    templateUrl: 'my-pane.html'
  };
})

;