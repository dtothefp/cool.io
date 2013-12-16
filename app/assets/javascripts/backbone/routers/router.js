CoolioApp.Router = Backbone.Router.extend({
  routes: {
    "login": "login"
  },

  initialize: function() {

  },

  login: function() {
    console.log("loginfunction");
    FB.api('/me', function(response) {
      console.log("api response", response);
      user = new UserModel({name: response.name, email: response.email, fb_id: response.id});
    });
  },

  loadView: function(view) {
    this.main && this.main.remove();
    this.main = view;
    $("body").append(view.el);
  }
});