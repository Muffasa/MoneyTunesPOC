angular.module('register.services',[])
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://mtdemo.firebaseio.com");
    return $firebaseAuth(ref);
  }
])
.factory("User", ["$firebaseObject","$firebaseAuth","$rootScope","$q","$state","facebookService","TokensGenerator","$timeout",
  function($firebaseObject,$firebaseAuth,$rootScope,$q,$state,facebookService,TokensGenerator,$timeout) {
    var ref = new Firebase("https://mtdemo.firebaseio.com");
    var userRef = new Firebase("https://mtdemo.firebaseio.com/users");
    var users = $firebaseObject(userRef);
    var Auth=$firebaseAuth(ref);
    var currentUserId=null;
    var currentUser=null;
    var setCurrentUser =function(uid){
         var d = $q.defer();
         if(uid)
         {


                  currentUserRef = new Firebase("https://mtdemo.firebaseio.com/users/"+uid);
                  var result = $firebaseObject(currentUserRef);
                  //result.$loaded().then(function(data){
                    currentUserRef.on("value",function(data){
                      if(!$rootScope.MainUser){
                        $rootScope.MainUser = data.val();
                        currentUser=data.val();
                        $timeout(function() {$rootScope.$broadcast('MainUserSet');}, 50);
                        d.resolve(data.val());
                        }
                        else{
                          d.resolve($rootScope.MainUser);
                        }
                  });
          }
          else{
            d.reject();
          }
                  return d.promise;

          
      };
    var getCurrentUser =function(callback){
      if(typeof callback === 'function'){
        if(currentUser)
          callback(currentUser);    
        if($rootScope.MainUser)
          callback($rootScope.User);
        else
            callback();   
          }
          
      };
      //var ultraAuth = function()


    return{
      saveAuthTokenLocally: function(authToken,user_phone_number){
        if(!window.localStorage.getItem("authToken")||window.localStorage.getItem("authToken")=="user do not exist"){
          window.localStorage.setItem("authToken",authToken);
          window.localStorage.setItem("phoneNumber",user_phone_number);
        }
      },
      deleteLocalAuthToken: function(){
        window.localStorage.removeItem("authToken");
        window.localStorage.removeItem("phoneNumber");
        $rootScope.MainUser=null;
      },
      gotAuthToken:function(){

        return window.localStorage.getItem('authToken')&&window.localStorage.getItem('phoneNumber');
      },
      isAuth: function(){
         return Auth.$getAuth();

      },
      auth: function(){
        var d = $q.defer();
        Auth.$authWithCustomToken(window.localStorage.getItem('authToken')).then(function(authData){
              
                    TokensGenerator.getUidByPhoneNumber(window.localStorage.getItem('phoneNumber')).then(function(uid){
                       setCurrentUser(uid).then(function(user){
                        //$state.go('sing-in');
                        //reRequireTokens(user);
                        $state.go('test');
                        d.resolve(user);
                      });
                    })




          });
        return d.promise;
        
      },
      unauth: function(){
        Auth.$unauth();
        currentUser =null;
        currentUserId=null;
        $rootScope.User=null;
        window.localStorage.removeItem('phoneNumber');
        window.localStorage.removeItem('authToken');
        console.log("anauth!!!!");
        $state.go('welcome');
      },
      debugAuth: function()
      {
        Auth.$authWithCustomToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6Ii1KdG9XN2ZVeFFjdVBwSGZJdm9QIn0sImlhdCI6MTQzNjQ3MzkyMX0.oEkOclaBEkonPHzPr8iuD2l1JKGp2Lxz6Hyyvd71sp4")
        .then(function(user){
        	                   $rootScope.MainUser={
                                     country:"Israel",
                                     ionic_push_token:"DEV-329ccea3-5182-4f4a-9681-83a6a9028a12",
                                     phone_number: "+972-0544637999",
                                     propName: "eyJ0eXAiOi",                                     
                                     twilio_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6InNjb3BlOmNsaWVudDppbmNvbWluZz9jbGllbnROYW1lPSUyQjk3Mi0wNTQ0NjM3OTk5IHNjb3BlOmNsaWVudDpvdXRnb2luZz9hcHBTaWQ9QVAxY2FkZjUzOWE4M2QzNjU2MmJkZDI2OGJkOTZiODkwMyZjbGllbnROYW1lPSUyQjk3Mi0wNTQ0NjM3OTk5IiwiaXNzIjoiQUMxM2M4YmM1Y2RlNTYxM2M3MDZjZGU2NjM4NjY1ZDJkYiIsImV4cCI6MTQzNjcxMDE5M30.gJDwID4NM7PzvjQJ4ZzR1zF5qBcogtso5dd6FX3mpwU",//irelevant build new one on enter
                                     uid: "-Ju1NhqCQ2NLATxQZ-ER"

                                    };  
          $state.go("test");
        })
      },
      createUser: function(user){
      	var d = $q.defer();
      	Auth.$createUser(user).then(function(userData){
        //http to server merge accounts! no need to reauth yet
      	}).then(function(userData) {
           console.log("User " + userData.uid + " created successfully!");
           regularAuth(user.email,user.password).then(function(authData){
           	d.resolve(authData);
           },function(error){
           	d.reject();
           })
            });
      	return d.promise;
      },
      socialAuth:function(provider){
      	var d = $q.defer();
       Auth.$authWithOAuthPopup(provider).then(function(authData) {
        if(provider=="facebook")
        {
            var facebookData = authData.facebook;
    		  //http server first time merge,check if social data needs to update write to db then function(fullUser)
          //if(!fullUser.facebookData.coverPhoto)
          
          
         // var coverPhotoUrl = facebookService.getUserCoverPhoto(facebookData.id).then(function(cover){
           // facebookData.coverPhotoUrl=cover.source;
            //update cover photo in the db
         // })
          
          $rootScope.MainUser.facebookData=facebookData;
       }
		  d.resolve(authData/*all data user*/);
		}).catch(function(error) {
		  console.error("Authentication failed:", error);
		  d.reject(error);
		});
		return d.promise;
      },
      regularAuth:function(email,password){
      	var d = $q.defer();
      	    Auth.$authWithPassword({
			email:email,
            password:password

		}).then(function(authData){
			d.resolve(authData);
		})
		.catch(function(error){
			d.reject(error);
		});
		return d.promise;
      },


      getCurrentUser: getCurrentUser

    }


  }
])
.factory("TokensGenerator",['$http','$ionicUser','$ionicPush','$q',
	function($http,$ionicUser,$ionicPush,$q){


    return{
            	getTwilioToken:function (user_phone_number){
        			  var d = $q.defer();

        			   $http.get('http://188.226.198.99:3000/twilioTokenGen/'+user_phone_number)
        			             .success(function(twilioToken){
        			                d.resolve(twilioToken);
        			              },function(error){
        			                d.reject(error);
        			              });

                        return d.promise; 
                    },
                getFirebaseAuthToken: function (uid){
        				  var d = $q.defer();

        				   $http.get('http://188.226.198.99:3000/createFirebaseToken/'+uid)
        				             .success(function(firebaseAuthToken){
        				                d.resolve(firebaseAuthToken);
        				              },function(error){
        				                d.reject(error);
        				              });

        				    return d.promise;         

          			},   
                ionicIdentifyUser:function(user_phone_number,uuid) {
        			  var d = $q.defer();

        			    var user = $ionicUser.get();
        			    if(!user.user_id) {
        			      user.user_id = user_phone_number;
        			      user.uuid=uuid;
        			    };

        			    // Identify your user with the Ionic User Service
        			    $ionicUser.identify(user).then(function(){
        			      d.resolve();
        			    },function (error) {
        			      d.reject(error);
        			    });
        			    return d.promise;
                    },  
                ionicPushRegister: function() {
        			    var d =$q.defer();
        			  

        			    $ionicPush.register({
        			      canShowAlert: true, //Can pushes show an alert on your screen?
        			      canSetBadge: true, //Can pushes update app icon badges?
        			      canPlaySound: true, //Can notifications play a sound?
        			      canRunActionsOnWake: true, //Can run actions outside the app,
        			      onNotification: function(notification) {
        			        
        			         console.log(notification);
        			        return true;
        			      }
        			    }).then(function(){
        			      d.resolve();
        			    })

        			    return d.promise;

                 },
                createPhoneValidatedUser:function(user){
        				  var d = $q.defer();
        				  var usersRef= new Firebase("https://mtdemo.firebaseio.com/users");

        				 var userID =  usersRef.push().key();

        				 if(userID){
        				  user.uid=userID;
        				  usersRef.child(userID).set(user,function(error){
                    error? d.reject(error):d.resolve(userID);
                  });
        				  
        				 }
        				 else{
        				  d.reject();
        				 }

         				return d.promise;
        		 },
             getUidByPhoneNumber: function(phone_number){
              var d = $q.defer();
                         $http.get('http://188.226.198.99:3000/getUidByPhoneNumber/'+phone_number)
                     .success(function(uid){
                        d.resolve(uid);
                      },function(error){
                        d.reject(error);
                      });
                     return d.promise;
             }

        }
        }])
;