app.controller('recipeController', 
   ['$scope','$http', '$location',
   function($scope, $http, $location) {
      var rId = $location.search().recipeId; // Getting recipeId from url
      $scope.rTitle; 
      $scope.comments;
      $scope.link;
      $scope.newComment = "";
      $scope.likes;
      $scope.dislikes;
      
      // Getting recipe title and link
      $http.get("/Proxy/get?key=6c623c76c61436feae669486ad7aabc1&rId=" + rId)
       .then(function(response) {
         $scope.rTitle = response.data.recipe.title;
         $scope.link = response.data.recipe.source_url;
         console.log($scope.link);
      });
      
      // Getting recipe comments, likes, and dislikes
      $http.get("/Rat/" + rId)
       .then(function(response) {
         $scope.likes = response.data.likes;
         $scope.dislikes = response.data.dislikes;
         $scope.comments = response.data.comments;
      });

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
         $http.post("Rat/" + rId + "/Lkes")
          .then(function() {
            return $http.get("/Rat/" + rId);
         })
          .then(function(response) {
            $scope.likes = response.data.likes;     
         })
          .catch(function(err) {
            console.log(err);
         });
      };

      $scope.disliked = function() {
         $http.post("Rat/" + rId + "/Dlks")
          .then(function() {
            return $http.get("/Rat/" + rId);
         })
          .then(function(response) {
            $scope.dislikes = response.data.dislikes;     
         })
          .catch(function(err) {
            console.log(err);
         });
      };
   }
]);













