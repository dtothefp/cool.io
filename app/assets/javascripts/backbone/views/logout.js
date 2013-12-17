CoolioApp.Views.Logout = Backbone.View.extend({
  id: "sign_out",

  initialize: function() {
  },

  events: {
    "click": "logoutFB"
  },

  logoutFB: function() {
    FB.logout(function(response) {
      CoolioApp.checkAuthentication();
    });
  }

});