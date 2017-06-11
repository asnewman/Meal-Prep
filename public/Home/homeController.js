app.controller('homeController', ['$scope', 'login', '$http', '$state', 'rcps',
 function($scope, login, $http, $state, rcps) {
   $scope.loadPage = function() {
      var cookie = login.getCookie();
      var user = login.getCookieData();
      var loginDate, nowDate;

      // If there is a cookie stored, check if the time has expired
      // If time is over two hours then clear the cookie
      if (cookie) {
         (function() {
            return $http.get("Ssns/" + cookie)
             .then(function(response) {
                return response.data.loginTime;
             })
             .then (function(loginTime) {
                loginDate = new Date(loginTime);
                nowDate = new Date();
                // if check the time difference and clear cookie info if needed
                if ((nowDate.getTime() - loginDate.getTime()) >
                 (2 * 60 * 60 * 1000)) {
                    login.clearCookieData();
                    $state.go('home');
                    window.location.reload();
                }
             })
         })();
      }

      // if ($scope.user) {
      //    (function() {
      //       return $http.get("/Proxy/search?key=6c623c76c61436feae669486ad7aabc1")
      //        .then(function(response){
      //           $scope.allRecipes = response.data.recipes;
      //           console.log($scope.allRecipes.length);
      //           return response.data;
      //        });
      //    })();
      // }

      // force Clear cookies
      // login.clearCookieData();

      if (cookie && user)
         $scope.user = JSON.parse(user);
      }
}]);
