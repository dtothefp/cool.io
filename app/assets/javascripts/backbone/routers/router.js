CoolioApp.Router = Backbone.Router.extend({
  routes: {
    "login": "login",
    "authenticated": "displayLogout",
    "friends": "getFriends"
  },

  initialize: function() {

  },

  login: function() {
   this.loadView( new CoolioApp.Views.Login() );
  },

  displayLogout: function() {
   // CREATE A VIEW FOR CREATING/GETTING FRIENDS 
   new CoolioApp.Views.GetFriends();
   this.loadView( new CoolioApp.Views.Logout() );
  },

  loadView: function(view) {
    this.main && this.main.remove();
    this.main = view;
    $("body").append(view.el);
  }
});