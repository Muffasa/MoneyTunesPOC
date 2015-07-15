angular.module('register.controllers',[])


.controller('WelcomeCtrl', function($scope,$rootScope,$state,$ionicPopup,$ionicUser,Auth,User, Countries,socket) {

      $scope.countries = Countries.all();
      $scope.selectedCountry= $scope.countries[102];
      $scope.usernumber=null;
      $scope.userCodeInput=null;

     

      
      $scope.goToLoginState = function(){$state.go('login');}

      $scope.ConfirmNumber = function(number) {

        if(true)//number.isValid and number is not registered yet) 9-10 digits 0on start or not insert
        {

		          var confirmPopup = $ionicPopup.confirm({
		            title: 'Confirmation',
		            template: 'Are you sure this is your phone number? an SMS will be send to this number: ' + number,
		            cancelText:'Cancel',
		            okText:'Send'

		          });
             
		        

		      confirmPopup.then(function(res) {
				        if(res) {
				            $rootScope.show();
				            socket.emit("MiniRegister", $scope.selectedCountry.dial_code+'-'+number);

				            socket.on("MiniRegisterSuccess",function(){
				              $rootScope.user_phone_number=$scope.selectedCountry.dial_code+'-'+number;
				              $rootScope.hide();
				            $state.go('welcome-post-sms',{userPhoneNumber:$scope.selectedCountry.dial_code+'-'+number,country:$scope.selectedCountry.name});
				            });
                     socket.on("UserPhoneNumberExists",function(){
                      socket.removeListener("UserPhoneNumberExists");
                      $rootScope.hide();
                      console.log("UserPhoneNumberExists emited");
                      $ionicPopup.alert({
                       title: 'Number Exists',
                       template: 'The number you entered allready registered'
                     });

                    });
				            
				            
				          }

		                                        
				         else {
				          
				        }
		    		})

        }

        else{//this number is in use, please login or re send sms activision code for this device

        }

      };

    

})

.controller('WelcomePostCtrl',function($scope,$rootScope,$http,$state,$stateParams,$ionicUser,$ionicPush,$ionicPopup,$q,$cordovaDevice,Auth,User,Countries,socket,TokensGenerator){

   
  $scope.deviceUUID="no device";
  $scope.fullnumber=$stateParams.userPhoneNumber;

  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
    console.log('Ionic Push: Got token ', data.token, data.platform);
    $scope.ionicPushToken = data.token;
    if(device)
    $scope.deviceUUID=$cordovaDevice.getUUID();
    console.log("cordovePush token:"+data.token+" Device uuid:"+$cordovaDevice.getUUID());
  });

 $scope.ConfirmSmsCode =function(user_code){
  $rootScope.show();
	  flow(user_code).then(function(){

			    compeleteMiniRegistrationAndLogin().then(function(){
			    	$rootScope.hide();
			    },
			    function(error){
			      $ionicPopup.alert({
			      title: 'Smthing went wrong ):',
			      template: 'En error occured:' +error
			      });
			    });
	   });
  };

 var flow = function(user_code){
  var d = $q.defer();
  console.log("entered flow");
  socket.emit('ConfirmSmsCode',user_code,$stateParams.userPhoneNumber);

    socket.on("SmsCodeConfirmed",function(MyCustomToken){
      //the user input code matchs the DB temp user phone_number sms_code bound,
      //deeping the register to untempuser and generates API tokens:
      socket.removeListener('WrongCode');
      console.log("sms confirmed event from server and his token:" +MyCustomToken);
      TokensGenerator.getTwilioToken($stateParams.userPhoneNumber).then(function(twilioToken){
      console.log("got temp twilio token token:" +twilioToken);
        $scope.twilioToken=twilioToken;

        TokensGenerator.ionicIdentifyUser($stateParams.userPhoneNumber,$scope.deviceUUID).then(function(){
          console.log("ionic identify user identified");
            TokensGenerator.ionicPushRegister().then(function(){
              console.log("ionic push registered");

              d.resolve();

            },function(error){
              console.log("ionic push register error:" + error);
              d.reject(error);
            })
        },function(error){
          console.log("ionic idenification error:" + error);
          d.reject(error);
        })
      },function(error){
        console.log("twilio error:" +error);
        d.reject(error);
      })

      
      
      socket.removeListener('SmsCodeConfirmed');
      
    });

    socket.on('WrongCode',function(){
      socket.removeListener('WrongCode');
      $rootScope.hide();
      $ionicPopup.alert({
      title: 'Wrong code',
      template: 'The code you entered is wrong, please try again'
      });
      
    });

 return d.promise;
  
 };

 var compeleteMiniRegistrationAndLogin = function(){

  var d = $q.defer();
        TokensGenerator.createPhoneValidatedUser({
        phone_number: $stateParams.userPhoneNumber,
        country: Countries.getByDialCode($stateParams.userPhoneNumber.slice(0,$stateParams.userPhoneNumber.indexOf('-'))),
        device_uuid:$scope.deviceUUID,        
        ionic_push_token: $scope.ionicPushToken,//update commonly
        twilio_token: $scope.twilioToken//update commnly

        
      }).then(function(uid) {

          console.log("User created with uid: " + uid);


          TokensGenerator.getFirebaseAuthToken(uid).then(function(firebaseAuthToken){
              User.saveAuthTokenLocally(firebaseAuthToken,$stateParams.userPhoneNumber);
              User.auth($stateParams.userPhoneNumber).then(function(user){
              console.log("all set up, current user validate number:" +user.phone_number);
              d.resolve();
              
      })
          },function(error){
          d.reject(error);
          });
       
      });
      return d.promise;

 };

})
.controller("SinginCtrl", function($scope,$rootScope,$state,$stateParams, $rootScope,Auth,User) {

  $scope.user = null;
  $scope.email=null;
  $scope.password=null;
  $scope.firstName=null;
  $scope.lastName=null;
  // Logs a user in with inputted provider
  $scope.singIn = function() {
  	//validation
  $rootScope.show();

var new_user ={
  email:$scope.email,
  password: $scope.password,
  user_phone_number:$rootScope.MainUser.user_phone_number,
  user_fist_name:$scope.firstName,
  user_last_name:$scope.lastName
};

  User.createUser(new_user).then(function(userData) {
           console.log("User " + userData.uid + " created successfully!");
  
  });

};
    $scope.login = function(provider) {
  		User.socialAuth(provider).then(function(authData) {
		  console.log("Logged in as:", authData.uid);
		},function(error) {
		  console.error("Authentication failed:", error);
		});
  };
  $scope.goToProfile = function(){
  	$state.go('tab.profile');
  }


})
.controller("LoginCtrl", function($scope, $rootScope,Auth,User) {

  $scope.email=null;
  $scope.password=null;
  // Logs a user in with inputted provider
  $scope.login = function(provider) {
  	if(provider)
  	{
  		User.socialAuth(provider).then(function(authData) {
		  console.log("Logged in as:", authData.uid);
		},function(error) {
		  console.error("Authentication failed:", error);
		});
	}
	else{
		User.regularAuth($scope.email,$scope.password).then(function(authData){
			console.log("regular login success");
		},
		function(error){
			console.log("wrong email or password");
		});
	}
  };
  // Logs a user out
  $scope.logout = function() {
    User.unauth();
  };

})
/*.controller("LoginCtrl", function($scope, $rootScope, $firebase, $firebaseSimpleLogin) {
  // Get a reference to the Firebase
  // TODO: Replace "ionic-demo" below with the name of your own Firebase
  var firebaseRef = new Firebase("https://mtdemo.firebaseio.com/");
  // Create a Firebase Simple Login object
  $scope.auth = $firebaseSimpleLogin(firebaseRef);
  // Initially set no user to be logged in
  $scope.user = null;
  // Logs a user in with inputted provider
  $scope.login = function(provider) {
    $scope.auth.$login(provider);
  };
  // Logs a user out
  $scope.logout = function() {
    $scope.auth.$logout();
  };
  // Upon successful login, set the user object
  $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
    $scope.user = user;
  });
  // Upon successful logout, reset the user object
  $rootScope.$on("$firebaseSimpleLogin:logout", function(event) {
    $scope.user = null;
  });
  // Log any login-related errors to the console
  $rootScope.$on("$firebaseSimpleLogin:error", function(event, error) {
    console.log("Error logging user in: ", error);
  });
})
*/;