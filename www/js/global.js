Global = {};

Global.rootRef= new Firebase("https://mtdemo.firebaseio.com");
Global.CurrentUser = null;
Global.setCurrentUser = function(user){
    $rootScope.CurrentUser=user;
 };