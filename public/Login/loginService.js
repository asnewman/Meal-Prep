app.factory("login", ["$http", "$rootScope", "$cookies",
function($http, $rootScope, $cookies) {
   var cookie;
   var user;
   var storeUser;

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
            return $http.get('/Prss');
         })
         .then(function(response) {
            user = response.data[0];
            return response.data[0];
         });
      },
      logout: function() {
         return $http.delete("Ssns/" + cookie)
         .then(function() {
            user = null;
            cookie = null;
         });
      },
      getUser: function() {
         return user;
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
			storeUser = null;
			$cookies.remove("user");
		}
   };
}]);
