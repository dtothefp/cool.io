CoolioApp.Router = Backbone.Router.extend({
  routes: {
    "welcome": "login",
    "user/:id": "displayUserDetails",
    "user/:id/friendships": "displayFriends"
  },

  initialize: function() {

  },

  login: function() {
   // this.loadNavView( new CoolioApp.Views.Login() );
   // TODO FIGURE OUT HOW TO PASS THE SESSION INTO THE VIEW
   console.log("LOGIN FUNCTION IN ROUTER", CoolioApp.Session);
   this.loadView( new CoolioApp.Views.Hello() );
   this.loadNavView( new CoolioApp.Views.NewSession({model: CoolioApp.currentUserModel, session: CoolioApp.Session}) );
  },

  displayUserDetails: function(fbID) {
   this.loadNavView( new CoolioApp.Views.Logout() );
   // // CREATE A VIEW FOR DISPLAYING USER DATA AND GETTING FRIENDS 
   this.loadView( new CoolioApp.Views.User({model: CoolioApp.currentUserModel}) );
  },

  displayFriends: function(opts) {
    console.log("friends clicked", opts);
    CoolioApp.Friendships = new CoolioApp.Collections.Friendships
    this.loadView(new CoolioApp.Views.FriendsList({collection: CoolioApp.Friendships}));
  },

  loadNavView: function(view) {
    this.mainNav && this.mainNav.remove();
    this.mainNav = view;
    $("nav li.has-dropdown").append(view.el);
  },

  loadView: function(view) {
    this.main && this.main.remove();
    this.main = view;
    $("body").append(view.el);
  }
});