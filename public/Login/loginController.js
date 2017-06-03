app.controller('loginController',
 ['$scope', '$state', 'login', 'notifyDlg', '$filter', '$rootScope',
 function($scope, $state, login, nDlg, $filter, $rootScope) {

   $scope.login = function() {
      login.login($scope.user)
      .then(function(user) {
         $scope.$parent.user = user;
         $state.go('home');
      })
      .catch(function(err) {
         if (err && err.data)
            nDlg.show($scope, $filter('tagError')(err.data[0], $rootScope),
             "Error");
      });
   };

   $scope.logout = function() {
      login.logout()
      .then(function() {
         return nDlg.show($scope, "Logout successful", "Logout");
      })
      .then(function() {
         $state.go('home');
         window.location.reload();
      })
      .catch(function() {
         nDlg.show($scope, "Failed to logout", "Error");
      })
   };
}]);
