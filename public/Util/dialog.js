// Declare a service that allows an error message.
app.factory("dialog", ["$mdDialog", function(mdDlg) {
   return {
      show: function(scp, msg, hdr, btns, sz) {
         scp.msg = msg;
         scp.hdr = hdr;
         scp.buttons = btns || ['OK'];
         return mdDlg.show({
            templateUrl: 'Util/dialog.template.html'
         }).result;
      }
   };
}]);
