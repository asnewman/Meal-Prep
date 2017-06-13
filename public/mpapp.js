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
      return errMap[err.tag] +
       (err.params && err.params.length ? err.params[0] : "");
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

app.directive('rcpInformation', [function() {
   return {
      restrict: 'E',
      scope: {
         rcp: "=toInfo",
         user: "="
      },
      templateUrl: "SearchRecipes/newRecipeSummary.template.html"
   }
}])

app.directive('ingrSummary', [function() {
   return {
      restrict: 'E',
      scope: {
         ingredient: "=toSummarize",
         user: "=",
         delIngr: '&',
      },
      template:
       '<span layout="row" layout-align="start center" flex>{{ingredient.name}}'+
       '<div><md-button type="button" class="md-primary md-warn"' +
       'ng-show="user && user.id == cnv.ownerId" ng-click="delIngr({ingr: ingr})">' +
       'Remove' +
       '</md-button></div><span flex></span>'
   };
}]);
