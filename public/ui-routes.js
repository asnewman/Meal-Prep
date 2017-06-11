
app.config(['$stateProvider', '$urlRouterProvider',
   function($stateProvider, $router) {

      //redirect to home if path is not matched
      $router.otherwise("/");

      $stateProvider
      .state('home', {
         url: '/',
         templateUrl: 'Home/home.template.html',
         controller: 'homeController',
         resolve: {
            load: ['$q', 'login', '$http', '$state', '$rootScope',
             function($q, login, $http, $state, $rootScope) {
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
                         // if check the time difference and
                         // clear cookie info if needed
                         if ((nowDate.getTime() - loginDate.getTime()) >
                          (2 * 60 * 60 * 1000)) {
                             login.clearCookieData();
                             $state.go('home');
                             window.location.reload();
                         }
                      })
                  })();
               }
               // force Clear cookies
               // login.clearCookieData();
               if (cookie && user)
                  $rootScope.user = JSON.parse(user);
            }],
            rcps: ['$q', '$http', '$rootScope',
             function($q, $http, $rootScope) {
                if (!$rootScope.user) {
                   return $http.get("/Proxy/search?key=6c623c76c61436feae669486ad7aabc1&sort=t")
                    .then(function(response){
                       $rootScope.allRecipes = response.data.recipes;
                       return response.data.recipes;
                    });
                }
             }]
         }
      })
      .state('register', {
         url: '/register',
         templateUrl: 'Register/register.template.html',
         controller: 'registerController',
      })
      .state('fridge', {
          url: '/fridge',
          templateUrl: 'Fridge/fridge.template.html',
          controller: 'fridgeController'
      });
   }]);
