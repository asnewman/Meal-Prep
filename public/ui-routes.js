
app.config(['$stateProvider', '$urlRouterProvider',
   function($stateProvider, $router) {

      //redirect to home if path is not matched
      $router.otherwise("/");

      $stateProvider
      .state('home', {
         url: '/',
         templateUrl: 'Home/home.template.html',
         controller: 'homeController',
         // resolve: {
         //    rcps: ['$q', '$http', '$stateParams',
         //     function($q, $http, $stateParams) {
         //        console.log("HELLO");
         //       //  return $http.get("/Proxy/search?key=6c623c76c61436feae669486ad7aabc1")
         //       //   .then(function(response) {
         //       //      return response.data;
         //       //  });
         //     }]
         // }
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
