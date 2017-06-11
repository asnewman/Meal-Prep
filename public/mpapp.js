var app = angular.module('mainApp', [
   'ui.router',
   'ngMaterial',
   'ngCookies'
]);

app.constant("errMap", {
   queryFailed: 'Query failed (server problem)',
   noPermission: 'Login lacks permission.',
   forbiddenField: 'Field not allowed in the body',
   missingField: 'Field missing from the request',
   badValue: 'Field has bad value',
   notFound: 'Entity not found in the database',
   badLogin: 'Email/password combination invalid, for errors logging.',
   dupEmail: 'Email duplicates an existing email',
   noTerms: 'Acceptance of terms is required',
   noOldPwd: 'Change of password requires an old password',
   oldPwdMismatch: 'Old password that was provided is incorrect.',
   dupIngredient: 'Ingredient already exists in the database'
});

app.filter('tagError', ['errMap', function(errMap, language) {
   return function(err) {
      return errMap[err.tag] + (err.params && err.params.length ? err.params[0] : "");
   };
}]);

app.directive('rcpSummary', [function() {
   return {
      restrict: 'E',
      scope: {
         rcp: "=toSummarize",
         user: "="
      },
      templateUrl: "Home/recipeSummary.template.html"
   };
}]);

app.directive('ingrSummary', [function() {
   return {
      restrict: 'E',
      scope: {
         ingredient: "=toSummarize",
         user: "=",
         delIngr: '&',
      },
      template:
       '<span layout="row" layout-align="start center" flex>{{ingredient.ingredient}}'+
       '<md-button type="button" class="btn"' +
       'ng-show="user && user.id == cnv.ownerId" ng-click="delIngr({ingr: ingr})">' +
       'Remove' +
       '</md-button><span flex></span>'
   };
}]);

app.controller("AppCtrl", function($scope, $timeout, $mdSidenav, $log) {
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      };
    }
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
  })
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
});
