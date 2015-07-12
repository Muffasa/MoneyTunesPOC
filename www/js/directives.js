angular.module('starter.directives', [])

/*.directive('liveConnection',['$state','$rootScope',function() {
  return {

    restrict: 'E',
    templateUrl: 'templates/myDirectives/live-connection-directive.html',
    controller: "liveConnectionCtrl"


    }
 
}])*/
.directive('incomingCall',['$state','$rootScope',function($state,$rootScope) {
  return {

    restrict: 'E',
    templateUrl: 'templates/myDirectives/incoming-call-directive.html',
    scope:{

    	from:"@",
      currentCampaign:"@",
      test:"=test"

    },

    controller: 'incomingCallCtrl'
    	


    }
 
}])
.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.focusMe, function(value) {
        if(value === true) { 
          console.log('value=',value);
          $timeout(function() {
            element[0].focus();
            //scope[attrs.focusMe] = false;
          },20);
        }
      });
    }
  };
})
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