app.factory("CORS", [function() {
   function createCORSRequest(method, url) {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
         xhr.open(method, url, true);
      }

      else if(typeof XDomainRequest != "undefined") {
         xhr = new XDomainRequest();
         xhr.open(method, url);
      }

      else {
         xhr = null;
      }
      return xhr;
   }

   function getTitle(text) {
      return text.match('<title>(.*)?</title>')[1];
   }

   return {

      makeCORSRequest: function(request, url) {
         var xhr = createCORSRequest('GET', url);
         if (!xhr) {
            alert('CORS not supported');
            return;
         }

         console.log(xhr);

         // Response handlers
         xhr.onload = function() {
            var text = xhr.responseText;
            var title = getTitle(text);
            alert('Response from CORS request to ' + url + ': ' + title);
         };

         xhr.onerror = function() {
            alert('Woops, there was an error making the request.');
         };
         xhr.send();
      }
   };
}]);
