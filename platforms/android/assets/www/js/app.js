// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('MTPOC', ['directives.controllers','entities.controllers','ionic','ngCordova','firebase','btford.socket-io','ionic.service.push','ionic.service.core', 'starter.controllers', 'starter.services','starter.directives','timer'])

.run(function($ionicPlatform,$rootScope,$ionicLoading,$ionicModal,$state,$cordovaSplashscreen,User) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    setTimeout(function() {
        //$cordovaSplashscreen.hide();
    }, 3000);

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    

    if(window.DebugMode)
    {
      User.debugAuth();
    }
    else{
           if(User.gotAuthToken()){
            console.log("I have Auth Token!");
            User.auth().then(function(user){
              console.log("My number is:"+user.phone_number);

            });
          }
          else{
            console.log("I dont have Auth Token..fresh start...");

            User.unauth();
          }

          if(User.isAuth()){
            User.getCurrentUser(function(user){
              if(user)
              console.log("the current user after auth: " + user.phone_number);
              else
                User.unauth();
          
            });
           }
  
    }

    $rootScope.show = function(text) {
      $rootScope.loading = $ionicLoading.show({
        content: text ? text : 'Loading..',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    };
 
    $rootScope.hide = function() {
      $ionicLoading.hide();
    };
 
    $rootScope.notify = function(text) {
      $rootScope.show(text);
      $window.setTimeout(function() {
        $rootScope.hide();
      }, 1999);
    };
                 //temp for test
            $rootScope.currentCampaign = {
                                            id: 0,
                                            name: 'Dayatsu',
                                            length:'14',
                                            pps: '0.02',
                                            ppfl: '0.5',
                                            audioUrl:'./Assets/dayatsu_14s.mp3',
                                            face: './Assets/logo.jpg'
                                          };
            $rootScope.callerUser={
                                     id: 0,
                                      name: 'Ben Sparrow',
                                      phone_number: '+972-0544446644',
                                      face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
                                    };
               //////

   /* $rootScope.userEmail = null;
    $rootScope.baseUrl = 'https://bucketlist-app.firebaseio.com/';
    var authRef = new Firebase($rootScope.baseUrl);
    //$rootScope.auth = $firebaseAuth(authRef);
 

 
    $rootScope.logout = function() {
      $rootScope.auth.$logout();
      $rootScope.checkSession();
    };
 
    $rootScope.checkSession = function() {
      var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
        if (error) {
          // no action yet.. redirect to default route
          $rootScope.userEmail = null;
          $window.location.href = '#/auth/signin';
        } else if (user) {
          // user authenticated with Firebase
          $rootScope.userEmail = user.email;
          $window.location.href = ('#/bucket/list');
        } else {
          // user is logged out
          $rootScope.userEmail = null;
          $window.location.href = '#/auth/signin';
        }
      });
    }*/

      
      
    


       /*$scope.$apply(function() {            
                       // sometimes binding does not work! 
                var device = $cordovaDevice.getDevice();           
           
                     });  

        });*/ 





      $rootScope.$on("incomingCall", function(event,from){
        $rootScope.incomingCallModal.show();
      });

      $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
          

    if(!$rootScope.DebugMode)
    {


      if (toState.authRequired){

          if(!User.gotAuthToken()) {      
            $state.go("welcome");
            event.preventDefault(); 
          }
          else
          {
            if(!$rootScope.User)
            {
            User.auth().then(function(user)
              {
                console.log("user has token and conecting to the app, user:"+user.phone_number);
              });
            }
          }
      }
    }
    });
 
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
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.navBar.alignTitle('center');
})
.config(function($stateProvider, $urlRouterProvider) {
window.DebugMode=false;
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
  .state('live-connection', {//connection alive
    url: '/live-connection',
    templateUrl: 'templates/live-connection.html',
    controller: 'liveConnectionCtrl'
    
  })
    .state('test', {//connection alive
    url: '/test',
    templateUrl: 'templates/test.html',
    controller: 'testCtrl'
    
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
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
      },
        authRequired: true
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      },
        authRequired: true
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    },
        authRequired: true
  })

      .state('tab.twilio-client', {
    url: '/twilio-client',
    views: {
      'tab-twilio-client': {
        templateUrl: 'templates/tab-twilio-client.html',
        controller: 'twilioTestCtrl'
      }
    },
        authRequired: true
  })

    .state('tab.contacts', {
    url: '/contacts',
    views: {
      'tab-contacts': {
        templateUrl: 'templates/tab-contacts.html',
        controller: 'contactsCtrl'
      }
    },
        authRequired: true
  })

   .state('tab.twilio-test', {
    url: '/twilio-test',
    views: {
      'tab-twilio-test': {
        templateUrl: 'templates/tab-twilio-test.html',
        controller: 'TwilioTestCtrl'
      }
    },
        authRequired: true
  })


  ;

  // if none of the above states are matched, use this as the fallback
  if(window.DebugMode)
  $urlRouterProvider.otherwise('/test');
    else
  $urlRouterProvider.otherwise('/welcome');

});
