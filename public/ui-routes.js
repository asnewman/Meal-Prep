
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
            load: ['$q', '$http', 'cookie',
             function($q, $http, cookie) {
                cookie.checkUser();
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
