app.controller('searchController', ['$scope', 'login', '$http', '$state', 'ingr', '$mdDialog', '$rootScope',
 function($scope, login, $http, $state, ingr, $mdDialog, $rootScope) {
    $scope.ingr = ingr;
    $scope.selected = [];

    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        }
        else {
          list.push(item);
        }
    };

    $scope.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    $scope.newRecipe = function() {
      var searchString = "";
      $scope.selected.forEach(function(item, idx, list) {
         if (idx === list.length - 1)
            searchString += item.name;
         else
            searchString += (item.name + ",");
      });

      $mdDialog.show({
         controller: DialogController,
         templateUrl: '/SearchRecipes/newRecipe.template.html',
         clickOutsideToClose: true,
         locals: {userId: $rootScope.user._id},
         resolve: {
            rcps: ['$q', '$http', '$rootScope',
             function($q, $http, $rootScope) {
                return $http.get("/Proxy/search?key=6c623c76c61436feae669486ad7aabc1&q=" + searchString)
                 .then(function(response){
                    $rootScope.allRecipes = response.data.recipes;
                    return response.data.recipes;
                 });
             }]
         }
      })

      .catch(function(err) {
         // Display any errors if there are any
         if (err && err.data) {
            alert = $mdDialog.alert({
               title: "Error",
               textContent: $filter('tagError')(err.data[0]),
               ok: 'Close'
            });

            return $mdDialog.show(alert)
            .finally(function() {
             alert = undefined;
           });
         }
      });
   };

   function DialogController($scope, $mdDialog, rcps, userId, $filter) {
      $scope.rcps = rcps;
      $scope.hide = function() {
         $mdDialog.hide();
      };
      $scope.cancel = function() {
          $mdDialog.cancel();
      };
      $scope.schedule = function (rcp, date) {
         var meal = {recipeId: rcp.recipe_id, date: date};

         $http.post("Prss/" + $rootScope.user._id + '/Mels', meal)
         .then(function(response) {
         })
         .catch(function(err) {
            if (err && err.data) {
               alert = $mdDialog.alert({
                  title: "Error",
                  textContent: $filter('tagError')(err.data[0]),
                  ok: 'Close'
               });

               return $mdDialog.show(alert)
               .finally(function() {
                alert = undefined;
              });
            }
         });
      };
      $scope.answer = function(answer) {
         var data = {'name': $scope.name};
         $mdDialog.hide(data);
      };
   }

}]);
