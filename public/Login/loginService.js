app.factory("login", ["$http", "$rootScope", "$cookies",
function($http, $rootScope, $cookies) {
   var cookie;
   var user;
   var storeUser;
   var storeCookie;

   return {
      login: function(loginData) {
         return $http.post("Ssns", loginData)
         .then(function(response) {
            var location = response.headers().location.split('/');

            cookie = location[location.length - 1];
            $rootScope.cookie = cookie;
            return $http.get("Ssns/" + cookie);
         })
         .then(function(response) {
            return $http.get('/Prss/' + response.data.prsId);
         })
         .then(function(response) {
            user = response.data;
            return response.data;
         });
      },
      logout: function(deleteCookie) {
         return $http.delete("Ssns/" + deleteCookie)
         .then(function() {
            user = null;
            cookie = null;
         });
      },
      getUser: function() {
         return user;
      },
      setCookie: function(cookie) {
         storeCookie = cookie;
         $cookies.put("cookie", storeCookie);
      },
      getCookie: function() {
         storeCookie = $cookies.get("cookie");
         return storeCookie;
      },
      setCookieData: function(userInfo) {
         storeUser = userInfo;
         $cookies.put("user", storeUser);
      },
      getCookieData: function() {
			storeUser = $cookies.get("user");
			return storeUser;
		},
		clearCookieData: function() {
         storeCookie = null;
			storeUser = null;
			$cookies.remove("user");
         $cookies.remove("cookie");
		}
   };
}]);
