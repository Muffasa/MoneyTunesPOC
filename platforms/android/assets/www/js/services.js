angular.module('starter.services', [])

.factory('Weather', ['$q', '$http', 
  function($q,  $http) {
  var url = 'https://api.forecast.io/forecast/' + '803fccd23763a6555da6b83cbc7a2a4f' + '/';



  return {
    //getAtLocation: function(lat, lng) {
    getCurrentWeather: function(lat, lng) {
      return $http.jsonp(url + lat + ',' + lng + '?callback=JSON_CALLBACK');
    }
  }
}])

.factory('MediaSrv', function($q, $ionicPlatform, $window){
  window.Media = function(src, mediaSuccess, mediaError, mediaStatus){
        // src: A URI containing the audio content. (DOMString)
        // mediaSuccess: (Optional) The callback that executes after a Media object has completed the current play, record, or stop action. (Function)
        // mediaError: (Optional) The callback that executes if an error occurs. (Function)
        // mediaStatus: (Optional) The callback that executes to indicate status changes. (Function)

        if (typeof Audio !== "function" && typeof Audio !== "object") {
          console.warn("HTML5 Audio is not supported in this browser");
        }
        var sound = new Audio();
        sound.src = src;
        sound.addEventListener("ended", mediaSuccess, false);
        sound.load();

        return {
          // Returns the current position within an audio file (in seconds).
          getCurrentPosition: function(mediaSuccess, mediaError){ mediaSuccess(sound.currentTime); },
          // Returns the duration of an audio file (in seconds) or -1.
          getDuration: function(){ return isNaN(sound.duration) ? -1 : sound.duration; },
          // Start or resume playing an audio file.
          play: function(){ sound.play(); },
          // Pause playback of an audio file.
          pause: function(){ sound.pause(); },
          // Releases the underlying operating system's audio resources. Should be called on a ressource when it's no longer needed !
          release: function(){},
          // Moves the position within the audio file.
          seekTo: function(milliseconds){}, // TODO
          // Set the volume for audio playback (between 0.0 and 1.0).
          setVolume: function(volume){ sound.volume = volume; },
          // Start recording an audio file.
          startRecord: function(){},
          // Stop recording an audio file.
          stopRecord: function(){},
          // Stop playing an audio file.
          stop: function(){ sound.pause(); if(mediaSuccess){mediaSuccess();} } // TODO
        };
};
  var service = {
    loadMedia: loadMedia,
    getStatusMessage: getStatusMessage,
    getErrorMessage: getErrorMessage
  };

  function loadMedia(src, onError, onStatus, onStop){
    var defer = $q.defer();
    $ionicPlatform.ready(function(){
      var mediaSuccess = function(){
        if(onStop){onStop();}
      };
      var mediaError = function(err){
        _logError(src, err);
        if(onError){onError(err);}
      };
      var mediaStatus = function(status){
        if(onStatus){onStatus(status);}
      };

      if($ionicPlatform.is('android')){src = '/android_asset/www/' + src;}
      defer.resolve(new $window.Media(src, mediaSuccess, mediaError, mediaStatus));
    });
    return defer.promise;
  }

  function _logError(src, err){
    console.error('media error', {
      code: err.code,
      message: getErrorMessage(err.code)
    });
  }

  function getStatusMessage(status){
    if(status === 0){return 'Media.MEDIA_NONE';}
    else if(status === 1){return 'Media.MEDIA_STARTING';}
    else if(status === 2){return 'Media.MEDIA_RUNNING';}
    else if(status === 3){return 'Media.MEDIA_PAUSED';}
    else if(status === 4){return 'Media.MEDIA_STOPPED';}
    else {return 'Unknown status <'+status+'>';}
  }

  function getErrorMessage(code){
    if(code === 1){return 'MediaError.MEDIA_ERR_ABORTED';}
    else if(code === 2){return 'MediaError.MEDIA_ERR_NETWORK';}
    else if(code === 3){return 'MediaError.MEDIA_ERR_DECODE';}
    else if(code === 4){return 'MediaError.MEDIA_ERR_NONE_SUPPORTED';}
    else {return 'Unknown code <'+code+'>';}
  }

  return service;
})

.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://mtdemo.firebaseio.com");
    return $firebaseAuth(ref);
  }
])

.factory("User", ["$firebaseObject","$firebaseAuth","$rootScope","$q","$state",
  function($firebaseObject,$firebaseAuth,$rootScope,$q,$state) {
    var ref = new Firebase("https://mtdemo.firebaseio.com");
    var userRef = new Firebase("https://mtdemo.firebaseio.com/users");
    var users = $firebaseObject(userRef);
    var Auth=$firebaseAuth(ref);
    var currentUserId=null;
    var currentUser=null;
    var setCurrentUser =function(uid){
         var d = $q.defer();
                  currentUserRef = new Firebase("https://mtdemo.firebaseio.com/users/"+uid);
                  var result = $firebaseObject(currentUserRef);
                  result.$loaded().then(function(data){
                    $rootScope.User = data;
                    currentUser=data;
                    d.resolve(data);
                  });
                  return d.promise;

          
      };
    var getCurrentUser =function(callback){
      if(typeof callback === 'function'){
        if(currentUser)
          callback(currentUser);    
        if($rootScope.User)
          callback($rootScope.User);
        else
            callback();   
          }
          
      };

      var setUid = function(uid){
        currentUserId=uid;
        window.localStorage.setItem("uid",uid);
      };

    return{
      saveAuthTokenLocally: function(authToken){
        if(!window.localStorage.getItem("authToken")||window.localStorage.getItem("authToken")=="user do no exist"){
          window.localStorage.setItem("authToken",authToken)
        }
      },
      deleteLocalAuthToken: function(){
        window.localStorage.removeItem("authToken");
        window.localStorage.removeItem("uid");
        $rootScope.user_phone_number=null;
        $rootScope.User=null;
      },
      gotAuthToken:function(){

        return window.localStorage.getItem('authToken');
      },
      isAuth: function(){
         var authData = Auth.$getAuth();
         if(authData){
          setCurrentUser(authData.uid);
          return true;
         }
         else{
          return false;
         }

      },
      auth: function(){
        var d = $q.defer();
        Auth.$authWithCustomToken(window.localStorage.getItem('authToken')).then(function(authData){
              setCurrentUser(authData.uid).then(function(user){
                $state.go('tab.twilio-client');
                d.resolve(user);
              });
          });
        return d.promise;
        
      },
      unauth: function(){
        Auth.$unauth();
        currentUser =null;
        currentUserId=null;
        $rootScope.User=null;
        window.localStorage.removeItem('uid');
        window.localStorage.removeItem('authToken');
        console.log("anauth!!!!");
        $state.go('welcome');
      },
      debugAuth: function()
      {
        Auth.$authWithCustomToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6Ii1KdG9XN2ZVeFFjdVBwSGZJdm9QIn0sImlhdCI6MTQzNjQ3MzkyMX0.oEkOclaBEkonPHzPr8iuD2l1JKGp2Lxz6Hyyvd71sp4")
        .then(function(user){
          //$state.go('tab.dash');
        })
      },


      getCurrentUser: getCurrentUser,
      setId:setUid

    }


  }
])

.factory('socket',function(socketFactory,$rootScope,$ionicModal){
        
         var myIoSocket = io.connect('http://188.226.198.99:3000');
        
          mySocket = socketFactory({
            ioSocket: myIoSocket
          });
          if($rootScope.User){
            mySocket.emit('identify',$rootScope.User.phone_number);
          }
          
          mySocket.on('incomingCall',function(fromUser){

            console.log("incoming call from incoming call modal will pop in 2 seconds..");

            //$rootScope.callerUser=fromUser;
            //$rootScope.currentCampaign=
            
            $ionicModal.fromTemplateUrl('modals/incoming-call-modal.html', {
              scope: $rootScope,
              animation: 'slide-in-up',
              backdropClickToClose: false,
              hardwareBackButtonClose: false
            }).then(function(modal) {
              $rootScope.incomingCallModal = modal;

            });

            setTimeout(function() {$rootScope.incomingCallModal.show();$rootScope.$broadcast('incomingCallModal.show')}, 3000);



            
            

            
          })

        return mySocket;
    })

.factory('Countries', function() {
  var countries_data = [{"name":"Afghanistan","dial_code":"+93","code":"AF"},
  {"name":"Albania","dial_code":"+355","code":"AL"},
  {"name":"Algeria","dial_code":"+213","code":"DZ"},
  {"name":"AmericanSamoa","dial_code":"+1 684","code":"AS"},
  {"name":"Andorra","dial_code":"+376","code":"AD"},
  {"name":"Angola","dial_code":"+244","code":"AO"},
  {"name":"Anguilla","dial_code":"+1 264","code":"AI"},
  {"name":"Antarctica","dial_code":"+672","code":"AQ"},
  {"name":"Antigua and Barbuda","dial_code":"+1268","code":"AG"},
  {"name":"Argentina","dial_code":"+54","code":"AR"},
  {"name":"Armenia","dial_code":"+374","code":"AM"},
  {"name":"Aruba","dial_code":"+297","code":"AW"},
  {"name":"Australia","dial_code":"+61","code":"AU"},
  {"name":"Austria","dial_code":"+43","code":"AT"},
  {"name":"Azerbaijan","dial_code":"+994","code":"AZ"},
  {"name":"Bahamas","dial_code":"+1 242","code":"BS"},
  {"name":"Bahrain","dial_code":"+973","code":"BH"},
  {"name":"Bangladesh","dial_code":"+880","code":"BD"},
  {"name":"Barbados","dial_code":"+1 246","code":"BB"},
  {"name":"Belarus","dial_code":"+375","code":"BY"},
  {"name":"Belgium","dial_code":"+32","code":"BE"},
  {"name":"Belize","dial_code":"+501","code":"BZ"},
  {"name":"Benin","dial_code":"+229","code":"BJ"},
  {"name":"Bermuda","dial_code":"+1 441","code":"BM"},
  {"name":"Bhutan","dial_code":"+975","code":"BT"},
  {"name":"Bolivia, Plurinational State of","dial_code":"+591","code":"BO"},
  {"name":"Bosnia and Herzegovina","dial_code":"+387","code":"BA"},
  {"name":"Botswana","dial_code":"+267","code":"BW"},
  {"name":"Brazil","dial_code":"+55","code":"BR"},
  {"name":"British Indian Ocean Territory","dial_code":"+246","code":"IO"},
  {"name":"Brunei Darussalam","dial_code":"+673","code":"BN"},
  {"name":"Bulgaria","dial_code":"+359","code":"BG"},
  {"name":"Burkina Faso","dial_code":"+226","code":"BF"},
  {"name":"Burundi","dial_code":"+257","code":"BI"},
  {"name":"Cambodia","dial_code":"+855","code":"KH"},
  {"name":"Cameroon","dial_code":"+237","code":"CM"},
  {"name":"Canada","dial_code":"+1","code":"CA"},
  {"name":"Cape Verde","dial_code":"+238","code":"CV"},
  {"name":"Cayman Islands","dial_code":"+ 345","code":"KY"},
  {"name":"Central African Republic","dial_code":"+236","code":"CF"},
  {"name":"Chad","dial_code":"+235","code":"TD"},
  {"name":"Chile","dial_code":"+56","code":"CL"},
  {"name":"China","dial_code":"+86","code":"CN"},
  {"name":"Christmas Island","dial_code":"+61","code":"CX"},
  {"name":"Cocos (Keeling) Islands","dial_code":"+61","code":"CC"},
  {"name":"Colombia","dial_code":"+57","code":"CO"},
  {"name":"Comoros","dial_code":"+269","code":"KM"},
  {"name":"Congo","dial_code":"+242","code":"CG"},
  {"name":"Congo, The Democratic Republic of the","dial_code":"+243","code":"CD"},
  {"name":"Cook Islands","dial_code":"+682","code":"CK"},
  {"name":"Costa Rica","dial_code":"+506","code":"CR"},
  {"name":"Cote d'Ivoire","dial_code":"+225","code":"CI"},
  {"name":"Croatia","dial_code":"+385","code":"HR"},
  {"name":"Cuba","dial_code":"+53","code":"CU"},
  {"name":"Cyprus","dial_code":"+357","code":"CY"},
  {"name":"Czech Republic","dial_code":"+420","code":"CZ"},
  {"name":"Denmark","dial_code":"+45","code":"DK"},
  {"name":"Djibouti","dial_code":"+253","code":"DJ"},
  {"name":"Dominica","dial_code":"+1 767","code":"DM"},
  {"name":"Dominican Republic","dial_code":"+1 849","code":"DO"},
  {"name":"Ecuador","dial_code":"+593","code":"EC"},
  {"name":"Egypt","dial_code":"+20","code":"EG"},
  {"name":"El Salvador","dial_code":"+503","code":"SV"},
  {"name":"Equatorial Guinea","dial_code":"+240","code":"GQ"},
  {"name":"Eritrea","dial_code":"+291","code":"ER"},
  {"name":"Estonia","dial_code":"+372","code":"EE"},
  {"name":"Ethiopia","dial_code":"+251","code":"ET"},
  {"name":"Falkland Islands (Malvinas)","dial_code":"+500","code":"FK"},
  {"name":"Faroe Islands","dial_code":"+298","code":"FO"},
  {"name":"Fiji","dial_code":"+679","code":"FJ"},
  {"name":"Finland","dial_code":"+358","code":"FI"},
  {"name":"France","dial_code":"+33","code":"FR"},
  {"name":"French Guiana","dial_code":"+594","code":"GF"},
  {"name":"French Polynesia","dial_code":"+689","code":"PF"},
  {"name":"Gabon","dial_code":"+241","code":"GA"},
  {"name":"Gambia","dial_code":"+220","code":"GM"},
  {"name":"Georgia","dial_code":"+995","code":"GE"},
  {"name":"Germany","dial_code":"+49","code":"DE"},
  {"name":"Ghana","dial_code":"+233","code":"GH"},
  {"name":"Gibraltar","dial_code":"+350","code":"GI"},
  {"name":"Greece","dial_code":"+30","code":"GR"},
  {"name":"Greenland","dial_code":"+299","code":"GL"},
  {"name":"Grenada","dial_code":"+1 473","code":"GD"},
  {"name":"Guadeloupe","dial_code":"+590","code":"GP"},
  {"name":"Guam","dial_code":"+1 671","code":"GU"},
  {"name":"Guatemala","dial_code":"+502","code":"GT"},
  {"name":"Guernsey","dial_code":"+44","code":"GG"},
  {"name":"Guinea","dial_code":"+224","code":"GN"},
  {"name":"Guinea-Bissau","dial_code":"+245","code":"GW"},
  {"name":"Guyana","dial_code":"+595","code":"GY"},
  {"name":"Haiti","dial_code":"+509","code":"HT"},
  {"name":"Holy See (Vatican City State)","dial_code":"+379","code":"VA"},
  {"name":"Honduras","dial_code":"+504","code":"HN"},
  {"name":"Hong Kong","dial_code":"+852","code":"HK"},
  {"name":"Hungary","dial_code":"+36","code":"HU"},
  {"name":"Iceland","dial_code":"+354","code":"IS"},
  {"name":"India","dial_code":"+91","code":"IN"},
  {"name":"Indonesia","dial_code":"+62","code":"ID"},
  {"name":"Iran, Islamic Republic of","dial_code":"+98","code":"IR"},
  {"name":"Iraq","dial_code":"+964","code":"IQ"},
  {"name":"Ireland","dial_code":"+353","code":"IE"},
  {"name":"Isle of Man","dial_code":"+44","code":"IM"},
  {"name":"Israel","dial_code":"+972","code":"IL"},
  {"name":"Italy","dial_code":"+39","code":"IT"},
  {"name":"Jamaica","dial_code":"+1 876","code":"JM"},
  {"name":"Japan","dial_code":"+81","code":"JP"},
  {"name":"Jersey","dial_code":"+44","code":"JE"},
  {"name":"Jordan","dial_code":"+962","code":"JO"},
  {"name":"Kazakhstan","dial_code":"+7 7","code":"KZ"},
  {"name":"Kenya","dial_code":"+254","code":"KE"},
  {"name":"Kiribati","dial_code":"+686","code":"KI"},
  {"name":"Korea, Democratic People's Republic of","dial_code":"+850","code":"KP"},
  {"name":"Korea, Republic of","dial_code":"+82","code":"KR"},
  {"name":"Kuwait","dial_code":"+965","code":"KW"},
  {"name":"Kyrgyzstan","dial_code":"+996","code":"KG"},
  {"name":"Lao People's Democratic Republic","dial_code":"+856","code":"LA"},
  {"name":"Latvia","dial_code":"+371","code":"LV"},
  {"name":"Lebanon","dial_code":"+961","code":"LB"},
  {"name":"Lesotho","dial_code":"+266","code":"LS"},
  {"name":"Liberia","dial_code":"+231","code":"LR"},
  {"name":"Libyan Arab Jamahiriya","dial_code":"+218","code":"LY"},
  {"name":"Liechtenstein","dial_code":"+423","code":"LI"},
  {"name":"Lithuania","dial_code":"+370","code":"LT"},
  {"name":"Luxembourg","dial_code":"+352","code":"LU"},
  {"name":"Macao","dial_code":"+853","code":"MO"},
  {"name":"Macedonia, The Former Yugoslav Republic of","dial_code":"+389","code":"MK"},
  {"name":"Madagascar","dial_code":"+261","code":"MG"},
  {"name":"Malawi","dial_code":"+265","code":"MW"},
  {"name":"Malaysia","dial_code":"+60","code":"MY"},
  {"name":"Maldives","dial_code":"+960","code":"MV"},
  {"name":"Mali","dial_code":"+223","code":"ML"},
  {"name":"Malta","dial_code":"+356","code":"MT"},
  {"name":"Marshall Islands","dial_code":"+692","code":"MH"},
  {"name":"Martinique","dial_code":"+596","code":"MQ"},
  {"name":"Mauritania","dial_code":"+222","code":"MR"},
  {"name":"Mauritius","dial_code":"+230","code":"MU"},
  {"name":"Mayotte","dial_code":"+262","code":"YT"},
  {"name":"Mexico","dial_code":"+52","code":"MX"},
  {"name":"Micronesia, Federated States of","dial_code":"+691","code":"FM"},
  {"name":"Moldova, Republic of","dial_code":"+373","code":"MD"},
  {"name":"Monaco","dial_code":"+377","code":"MC"},
  {"name":"Mongolia","dial_code":"+976","code":"MN"},
  {"name":"Montenegro","dial_code":"+382","code":"ME"},
  {"name":"Montserrat","dial_code":"+1664","code":"MS"},
  {"name":"Morocco","dial_code":"+212","code":"MA"},
  {"name":"Mozambique","dial_code":"+258","code":"MZ"},
  {"name":"Myanmar","dial_code":"+95","code":"MM"},
  {"name":"Namibia","dial_code":"+264","code":"NA"},
  {"name":"Nauru","dial_code":"+674","code":"NR"},
  {"name":"Nepal","dial_code":"+977","code":"NP"},
  {"name":"Netherlands","dial_code":"+31","code":"NL"},
  {"name":"Netherlands Antilles","dial_code":"+599","code":"AN"},
  {"name":"New Caledonia","dial_code":"+687","code":"NC"},
  {"name":"New Zealand","dial_code":"+64","code":"NZ"},
  {"name":"Nicaragua","dial_code":"+505","code":"NI"},
  {"name":"Niger","dial_code":"+227","code":"NE"},
  {"name":"Nigeria","dial_code":"+234","code":"NG"},
  {"name":"Niue","dial_code":"+683","code":"NU"},
  {"name":"Norfolk Island","dial_code":"+672","code":"NF"},
  {"name":"Northern Mariana Islands","dial_code":"+1 670","code":"MP"},
  {"name":"Norway","dial_code":"+47","code":"NO"},
  {"name":"Oman","dial_code":"+968","code":"OM"},
  {"name":"Pakistan","dial_code":"+92","code":"PK"},
  {"name":"Palau","dial_code":"+680","code":"PW"},
  {"name":"Palestinian Territory, Occupied","dial_code":"+970","code":"PS"},
  {"name":"Panama","dial_code":"+507","code":"PA"},
  {"name":"Papua New Guinea","dial_code":"+675","code":"PG"},
  {"name":"Paraguay","dial_code":"+595","code":"PY"},
  {"name":"Peru","dial_code":"+51","code":"PE"},
  {"name":"Philippines","dial_code":"+63","code":"PH"},
  {"name":"Pitcairn","dial_code":"+872","code":"PN"},
  {"name":"Poland","dial_code":"+48","code":"PL"},
  {"name":"Portugal","dial_code":"+351","code":"PT"},
  {"name":"Puerto Rico","dial_code":"+1 939","code":"PR"},
  {"name":"Qatar","dial_code":"+974","code":"QA"},
  {"name":"Romania","dial_code":"+40","code":"RO"},
  {"name":"Russia","dial_code":"+7","code":"RU"},
  {"name":"Rwanda","dial_code":"+250","code":"RW"},
  {"name":"Réunion","dial_code":"+262","code":"RE"},
  {"name":"Saint Barthélemy","dial_code":"+590","code":"BL"},
  {"name":"Saint Helena, Ascension and Tristan Da Cunha","dial_code":"+290","code":"SH"},
  {"name":"Saint Kitts and Nevis","dial_code":"+1 869","code":"KN"},
  {"name":"Saint Lucia","dial_code":"+1 758","code":"LC"},
  {"name":"Saint Martin","dial_code":"+590","code":"MF"},
  {"name":"Saint Pierre and Miquelon","dial_code":"+508","code":"PM"},
  {"name":"Saint Vincent and the Grenadines","dial_code":"+1 784","code":"VC"},
  {"name":"Samoa","dial_code":"+685","code":"WS"},
  {"name":"San Marino","dial_code":"+378","code":"SM"},
  {"name":"Sao Tome and Principe","dial_code":"+239","code":"ST"},
  {"name":"Saudi Arabia","dial_code":"+966","code":"SA"},
  {"name":"Senegal","dial_code":"+221","code":"SN"},
  {"name":"Serbia","dial_code":"+381","code":"RS"},
  {"name":"Seychelles","dial_code":"+248","code":"SC"},
  {"name":"Sierra Leone","dial_code":"+232","code":"SL"},
  {"name":"Singapore","dial_code":"+65","code":"SG"},
  {"name":"Slovakia","dial_code":"+421","code":"SK"},
  {"name":"Slovenia","dial_code":"+386","code":"SI"},
  {"name":"Solomon Islands","dial_code":"+677","code":"SB"},
  {"name":"Somalia","dial_code":"+252","code":"SO"},
  {"name":"South Africa","dial_code":"+27","code":"ZA"},
  {"name":"South Georgia and the South Sandwich Islands","dial_code":"+500","code":"GS"},
  {"name":"Spain","dial_code":"+34","code":"ES"},
  {"name":"Sri Lanka","dial_code":"+94","code":"LK"},
  {"name":"Sudan","dial_code":"+249","code":"SD"},
  {"name":"Suriname","dial_code":"+597","code":"SR"},
  {"name":"Svalbard and Jan Mayen","dial_code":"+47","code":"SJ"},
  {"name":"Swaziland","dial_code":"+268","code":"SZ"},
  {"name":"Sweden","dial_code":"+46","code":"SE"},
  {"name":"Switzerland","dial_code":"+41","code":"CH"},
  {"name":"Syrian Arab Republic","dial_code":"+963","code":"SY"},
  {"name":"Taiwan","dial_code":"+886","code":"TW"},
  {"name":"Tajikistan","dial_code":"+992","code":"TJ"},
  {"name":"Tanzania, United Republic of","dial_code":"+255","code":"TZ"},
  {"name":"Thailand","dial_code":"+66","code":"TH"},
  {"name":"Timor-Leste","dial_code":"+670","code":"TL"},
  {"name":"Togo","dial_code":"+228","code":"TG"},
  {"name":"Tokelau","dial_code":"+690","code":"TK"},
  {"name":"Tonga","dial_code":"+676","code":"TO"},
  {"name":"Trinidad and Tobago","dial_code":"+1 868","code":"TT"},
  {"name":"Tunisia","dial_code":"+216","code":"TN"},
  {"name":"Turkey","dial_code":"+90","code":"TR"},
  {"name":"Turkmenistan","dial_code":"+993","code":"TM"},
  {"name":"Turks and Caicos Islands","dial_code":"+1 649","code":"TC"},
  {"name":"Tuvalu","dial_code":"+688","code":"TV"},
  {"name":"Uganda","dial_code":"+256","code":"UG"},
  {"name":"Ukraine","dial_code":"+380","code":"UA"},
  {"name":"United Arab Emirates","dial_code":"+971","code":"AE"},
  {"name":"United Kingdom","dial_code":"+44","code":"GB"},
  {"name":"United States","dial_code":"+1","code":"US"},
  {"name":"Uruguay","dial_code":"+598","code":"UY"},
  {"name":"Uzbekistan","dial_code":"+998","code":"UZ"},
  {"name":"Vanuatu","dial_code":"+678","code":"VU"},
  {"name":"Venezuela, Bolivarian Republic of","dial_code":"+58","code":"VE"},
  {"name":"Viet Nam","dial_code":"+84","code":"VN"},
  {"name":"Virgin Islands, British","dial_code":"+1 284","code":"VG"},
  {"name":"Virgin Islands, U.S.","dial_code":"+1 340","code":"VI"},
  {"name":"Wallis and Futuna","dial_code":"+681","code":"WF"},
  {"name":"Yemen","dial_code":"+967","code":"YE"},
  {"name":"Zambia","dial_code":"+260","code":"ZM"},
  {"name":"Zimbabwe","dial_code":"+263","code":"ZW"},
  {"name":"Åland Islands","dial_code":"+358","code":"AX"}];
return {
    all: function() {
      return JSON.parse(JSON.stringify(countries_data));
    },
    getByName: function(name) {
      for (var i = 0; i < countries_data.length; i++) {
        if (countries_data[i].name == name) {
          return countries_data[i];
        }
      }
      return null;
    },
    getByDialCode: function(prefix){
      for (var i = 0; i < countries_data.length; i++) {
        if (countries_data[i].dial_code == prefix) {
          return countries_data[i].name;
        }
      }
      return null;
    }
  };
 })

.factory('Contacts',['$firebaseArray','$cordovaContacts',function($firebaseArray,$cordovaContacts){

    var userRef = new Firebase("https://mtdemo.firebaseio.com/users");
    return{
      allUsers: function(){
        return $firebaseArray(userRef);
      },
      allContacts: function(){
        $cordovaContacts.find({filter: ''}).then(function(result) {
            return result;
        }, function(error) {
            console.log("ERROR: " + error);
        });
      },
      allContactsWithNumber: function(){
        $cordovaContacts.find({filter: ''}).then(function(result) {
            return result;
        }, function(error) {
            console.log("ERROR: " + error);
        });
      }
    } 


}])
.factory('Users', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var users = [{
    id: 0,
    name: 'Ben Sparrow',
    phone_number: '+972-0544446644',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    phone_number: '+972-0544333333',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    phone_number: '+972-0544546644',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    phone_number: '+972-0544776644',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    phone_number: '+972-0545446554',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return users;
    },
    remove: function(chat) {
      users.splice(users.indexOf(users), 1);
    },
    get: function(Id) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === parseInt(Id)) {
          return users[i];
        }
      }
      return null;
    },
    getUserByPhoneNumber: function(user_phone_number){

    }
  };
})
.factory('Campaigns', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var campaigns = [{
    id: 0,
    name: 'Dayatsu',
    length:'14',
    pps: '0.02',
    ppfl: '0.5',
    audioUrl:'./Assets/dayatsu_14s.mp3',
    face: './Assets/logo.jpg'
  }/*, {
    id: 1,
    name: 'Max Lynx',
    phone_number: '+972-0544333333',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    phone_number: '+972-0544546644',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    phone_number: '+972-0544776644',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    phone_number: '+972-0545446554',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }*/];

  return {
    all: function() {
      return campaigns;
    },
    remove: function(campaign) {
      campaigns.splice(users.indexOf(campaign), 1);
    },
    get: function(Id) {
      for (var i = 0; i < campaigns.length; i++) {
        if (campaigns[i].id === parseInt(Id)) {
          return campaigns[i];
        }
      }
      return null;
    }
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
