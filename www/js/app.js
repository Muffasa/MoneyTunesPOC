// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic','ngCordova','firebase','btford.socket-io','ionic.service.push','ionic.service.core', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(['$ionicAppProvider', function($ionicAppProvider) {
  
  $ionicAppProvider.identify({
    
    app_id: 'fe0f0dc6',
    
    api_key: '98f3518c158248bbd24d46e26edb29c8ea344c7468530882',

    //gcm_id:'558835618221'

    dev_push: true
  });
}])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome/welcome.html',
    controller: 'WelcomeCtrl'
  })
  .state('welcome-post-sms', {
    url: '/welcome/:userPhoneNumber',
    templateUrl: 'templates/welcome/welcome-post-sms.html',
    controller: 'WelcomePostCtrl'
  })
 .state('login', {
    url: '/login',
    templateUrl: 'templates/welcome/login.html',
    controller: 'LoginCtrl'
    
  })
  .state('sing-in', {
    url: '/sing-in',
    templateUrl: 'templates/welcome/sing-in.html',
    controller: 'SingInCtrl'   
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
  //  abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })


  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');

});
