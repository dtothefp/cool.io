CoolioApp.Views.Logout = Backbone.View.extend({
  id: "sign_out",

  initialize: function() {
    console.log("instantiate logout view");
  },

  events: {
    "click": "logoutFB"
  },

  logoutFB: function() {
    FB.logout(function(response) {
      location.reload();
      // CoolioApp.checkAuthentication();
    });
  }

});