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
      alert('Identified user ' + user.name + '\n ID ' + user.user_id);
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

.controller('ContactsCtrl', function($scope,$cordovaContacts) {

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


.controller('WelcomeCtrl', function($scope,$rootScope,$state,$ionicPopup,$ionicUser,Auth, Countries,socket) {

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
      
      socket.emit("MiniRegister", $scope.selectedCountry.dial_code+number);

      socket.on("MiniRegisterSuccess",function(){
      $rootScope.miniRegisterSuccess=true;
      $state.go('welcome-post-sms',{userPhoneNumber:$scope.selectedCountry.dial_code+number,country:$scope.selectedCountry.name});
      });
        
      }

                                    
     else {
      
    }
  });

  $scope.createUser = function() {
      Auth.$createUser({
        email: $scope.email,
        password: $scope.password
      }).then(function(userData) {
        console.log("User created with uid: " + userData.uid);
      }).catch(function(error) {
        console.log(error);
      });
    };




};



})
.controller('WelcomePostCtrl',function($scope,$rootScope,$http,$state,$stateParams,$ionicUser,$ionicPush,$ionicPopup,Auth,socket){

   

  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
    alert("Successfully registered token " + data.token);
    console.log('Ionic Push: Got token ', data.token, data.platform);
    $scope.deviceToken = data.token;
  });
  
$scope.ConfirmSmsCode = function(user_code){
  socket.emit('ConfirmSmsCode',user_code,$stateParams.userPhoneNumber);

    socket.on("SmsCodeConfirmed",function(token){
      console.log("WORKS!!");
      $scope.getTwilioToken();
      $scope.MTPOCToken=token;
      $scope.ionicIdentifyUser();
      $rootScope.SmsVerificationSuccess=true;
      $state.go('tab');
      socket.removeListener('WrongCode');
      socket.removeListener('SmsCodeConfirmed');
    });

    socket.on('WrongCode',function(){
      $ionicPopup.alert({
      title: 'Wrong code',
      template: 'The code you entered is wrong, please try again'


      });
      socket.removeListener('WrongCode');
    });

  
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
  $scope.miniRegister = function (){
        Auth.$createUser({
        phone_number: $stateParams.userPhoneNumber
        
      }).then(function(userData) {
        console.log("User created with uid: " + userData.uid);
      }).catch(function(error) {
        console.log(error);
      });
    };



})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
