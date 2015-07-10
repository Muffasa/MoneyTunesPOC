angular.module('starter.directives', [])

.directive('incomingCall',['$state','$rootScope',function($state,$rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'templates/incoming-call-directive.html',
    scope:{

    	from:"&from",
    	muteRington:false,
    	answer: function(){
    		
              $rootScope.connection = Twilio.Device.connect({
                CallerId:'+97243741132', 
                AnswerQ:$rootScope.User.phone_number +'Q'  
                }               
    	},
    	reject: function(){
    		muteRington=true;
    		socket.emit("rejectCall");
    	},


    }
  };
}])
.directive('miniUserView', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'my-pane.html'
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