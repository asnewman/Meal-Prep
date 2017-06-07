app.factory("food", ['$http', 'CORS', function($http, cors) {
   return {
      // Returns an array of JSON objects with recipe information
      // ingredients is optional array...will return random recipes without
      searchRecipes: function(ingredients) {
         console.log("http://food2fork.com/api/search?key=6c623c76c61436feae669486ad7aabc1");
         var recipes = cors.makeCORSRequest('GET', "http://food2fork.com/api/search?key=6c623c76c61436feae669486ad7aabc1");
         
         return recipes;
      }
   };
}]);
