app.controller('recipeController', ['$scope','$http', '$location', 'recipeData',
 'ratingData', 'liked', 'disliked',
function($scope, $http, $location, recipeData, ratingData, liked, disliked) {
   var rId = recipeData.recipe.recipe_id; // Getting recipeId from url

   $scope.newComment = "";
   $scope.rTitle = recipeData.recipe.title;
   $scope.link = recipeData.recipe.source_url;
   $scope.likes = ratingData.likes;
   $scope.dislikes = ratingData.dislikes;
   $scope.comments = ratingData.comments;
   $scope.userLiked = liked && liked[0] && liked[0]._id;
   $scope.userDisliked = disliked && disliked[0] && disliked[0]._id;

   // Submitting a new comment
   $scope.submit = function() {
      $http.post("/Rat/" + rId + "/Cmts", {comment: $scope.newComment})
       .then(function() {
         return $http.get("/Rat/" + rId);
      })
       .then(function(response) {
         $scope.comments = response.data.comments;
         $scope.newComment = "";
      });
   };

   $scope.liked = function() {
      if (!$scope.userLiked) {
         $http.post("Rat/" + rId + "/Lkes")
         .then(function(response) {
            console.log(response.headers('Location'));
            $scope.userLiked = response.headers('Location').split('/')[4];
            return $http.get("/Rat/" + rId);
         })
         .then(function(response) {
            $scope.likes = response.data.likes;
         })
         .catch(function(err) {
            console.log(JSON.stringify(err));
         });
      }
      else {
         $http.delete("Rat/" + rId + "/Lkes/" + $scope.userLiked)
         .then(function() {
            $scope.userLiked = false;
            return $http.get("/Rat/" + rId);
         })
         .then(function(response) {
            $scope.likes = response.data.likes;
         });
      }

   };

   $scope.disliked = function() {
      if (!$scope.userDisliked) {
         $http.post("Rat/" + rId + "/Dlks")
         .then(function(response, ) {
            $scope.userDisliked = response.headers('Location')
             .split('/')[4];
            return $http.get("/Rat/" + rId);
         })
         .then(function(response) {
            $scope.dislikes = response.data.dislikes;
         })
         .catch(function(err) {
         });
      }

      else {
         $http.delete("Rat/" + rId + "/Dlks/" + $scope.userDisliked)
         .then(function() {
            $scope.userDisliked = false;
            return $http.get("/Rat/" + rId);
         })
         
         .then(function(response) {
            $scope.dislikes = response.data.dislikes;
         });
      }
   };
}
]);
