angular.module("entities.controllers",['entities.services'])

    .controller("contactsCtrl", ['$scope', '$ionicActionSheet','ContactsService', function($scope,$ionicActionSheet, ContactsService) {

    $scope.selectedContact=null;    

        $scope.pickContact = function() {

            ContactsService.pickContact().then(
                function(contact) {
                    $scope.selectedContact=contact;

                    $scope.data.selectedContacts.push(contact);
                    console.log("Selected contacts=");
                    console.log($scope.data.selectedContacts);

                },
                function(failure) {
                    console.log("Bummer.  Failed to pick a contact");
                }
            );

        };

    //$scope.pickContact();
        $scope.data = {
            selectedContacts : []
        };



        $scope.showContactOptions = function() {

               // Show the action sheet
               var contactOptions = $ionicActionSheet.show({
                 buttons: [
                   { text: '<i class="ion-social-usd-outline"></i>MoneyTunes Call' },
                   { text: '<i class="ion-ios-telephone"></i>Call' },
                   { text: '<i class="ion-android-textsms"></i>Messege' }
                 ],
                 destructiveText: 'Remove',
                 titleText: $scope.selectedContact.displayName,
                 cancelText: 'Close',
                 cancel: function() {
                      // add cancel code..
                    },
                 buttonClicked: function(index) {
                   if(index==0){//money tunes call
                          
                         // isMoneyTunesMember($scope.selectedContact.formattedPhoneNumber).then(function(isMember)
                           // {
                                 Twilio.Device.connect({ 
                                  CallerId:'+97243741132', 
                                  callFrom: $rootScope.User.phone_number,
                                  callTo:$scope.selectedContact.formattedPhoneNumber 
                                 });
                           // });
                            


                   }
                   if(index==1){//call
                   

                   }
                   if(index==2){//messeg
                   

                   }
                 }
                });

               // For example's sake, hide the sheet after two seconds
               /* $timeout(function() {
                 contactOptions();
               }, 4000);*/

          };


    }])

    .controller("usersCtrl", ['$scope','$rootScope', '$ionicActionSheet','UsersService',
     function($scope,$rootScope,$ionicActionSheet, UsersService) {

      
       
      /*$rootScope.show();
      var allUsers = UsersService.getAllAppUsers();

      allUsers.$loaded().then(function(data){
        $scope.allAppUsers=data;
        $rootScope.hide();
      });*/


      $scope.allAppUsers = UsersService.getAllAppUsers();

       // $scope.selectedUser=null;    

        $scope.showUserOptions = function(selectedUser) {

               // Show the action sheet
               var contactOptions = $ionicActionSheet.show({
                 buttons: [
                   { text: '<i class="ion-social-usd-outline"></i>MoneyTunes Call' },
                   { text: '<i class="ion-ios-telephone"></i>Call' },
                   { text: '<i class="ion-android-textsms"></i>Messege' }
                 ],
                 destructiveText: 'Remove',
                 titleText: selectedUser.phone_number,
                 cancelText: 'Close',
                 cancel: function() {
                      // add cancel code..
                    },
                 buttonClicked: function(index) {
                   if(index==0){//money tunes call     
                                $rootScope.connection = Twilio.Device.connect({ 
                                  CallerId:'+97243741132', 
                                  callFrom: $rootScope.MainUser.phone_number,
                                  callTo:$scope.selectedUser.phone_number 
                                 }); 
                                 //$state.go("calling");                          
                   }
                   if(index==1){//call
                   

                   }
                   if(index==2){//messeg
                   

                   }
                 }
                });

          };


    }])

    ;