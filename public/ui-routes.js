
app.config(['$stateProvider', '$urlRouterProvider',
   function($stateProvider, $router) {

      //redirect to home if path is not matched
      $router.otherwise("/home");

      $stateProvider
      .state('home', {
         url: '/home',
         templateUrl: 'Home/home.template.html',
         controller: 'homeController',
      })
      .state('register', {
         url: '/register',
         templateUrl: 'Register/register.template.html',
         controller: 'registerController',
      });
   }]);
