angular.module("entities.services",[])

  .service("ContactsService", ['$q','PhoneNumberFormater', function($q,PhoneNumberFormater) {



        var formatContact = function(contact) {
             var formated_phone_nember = PhoneNumberFormater.format(contact.phoneNumbers[0].value);
            return {
                "displayName"   : contact.name.formatted || contact.name.givenName + " " + contact.name.familyName || "Mystery Person",
                "emails"        : contact.emails || [],
                "phones"        : contact.phoneNumbers || [],
                "photos"        : contact.photos || [],
                "formattedPhoneNumber" : formated_phone_nember
            };

        };

        var pickContact = function() {

            var deferred = $q.defer();

            if(navigator && navigator.contacts) {

                navigator.contacts.pickContact(function(contact){

                    deferred.resolve( formatContact(contact) );
                });

            } else {
                deferred.reject("Bummer.  No contacts in desktop browser");
            }

            return deferred.promise;
        };

        return {
            pickContact : pickContact
        };
    }])
.factory('PhoneNumberFormater',function($rootScope,Countries){ 
        
         return{
          format: function(phone_number)
          {
            console.log("try to format this number:" + phone_number);
            var result = phone_number;
            var fullNumber;
            var shortNumber;
            var prefix=Countries.getPrefixByName($rootScope.MainUser.country);

            if(phone_number.charAt(0)=='0'){

                if(phone_number.charAt(1)=='0')//number with 00 insted of "+" prefix
                    result = "+"+phone_number.slice(2,phone_number.lenght);

                else// number number without prefix
                   prefix = Countries.getPrefixByName($rootScope.MainUser.country);

            }


            result.replace(new RegExp("-", "gi"),"");
            result.trim();

            if(result.charAt(0)=='+'){


              
              result = result.slice(0,prefix.lenght);

              if(result.charAt(0)!='0')
                result='0'+result;

              return prefix+"-"+result;

              
            }

            else{
               return prefix+"-"+result;
            }

            

          }
         }
    })
 
  .service("UsersService", ['$q','$firebaseArray', function($q,$firebaseArray) {

    var userRef = new Firebase("https://mtdemo.firebaseio.com/users");
    
        
      
        return {

            getAllAppUsers: function(){  

              return $firebaseArray(userRef);
              /*var d = $q.defer();
              

              allUsers.$loaded().then(function(allAppUsers){
                d.resolve(allAppUsers);
              })
              .catch(function(error){
                console.log("Error on UsersService:", error);
                d.reject(error);
              });

              return d.promise();*/


            }
        };
    }])
    ;