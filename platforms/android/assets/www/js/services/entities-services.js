angular.module("entities.services",[])

  .service("ContactsService", ['$q','PhoneNumberFormater', function($q) {



        var formatContact = function(contact) {
             var formated_phone_nember = PhoneNumberFormater.format(contact.phoneNumbers[0]);
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
.factory('PhoneNumberFormater',function(){
        
         return{
          format: function(phone_number)
          {
            var result = phone_number;
            var fullNumber;
            var shortNumber;
            var prefix;
            if(phone_number.charAt(0)=='0'||phone_number.charAt(1)=='0')
                result = "+"+phone_number.slice(2,phone_number.lenght);


            if(result.charAt(0)=='+'){

              if(result.indexOf('-')==-1||result.split('-').lenght>2){
                return "not valid";
              }
                

              prefix=result.split('-')[0].trim();
              shortNumber=result.split('-')[1].trim();
              fullNumber=result.trim();

              return fullNumber;





            }
            else{
              return "not valid";
            }

            

          }
         }
    })
    ;