CoolioApp.Router = Backbone.Router.extend({
  routes: {
    "welcome": "login",
    "user/:id": "displayUserDetails",
    "user/:id/friendships": "displayFriends",
    "user/:id/loading": "loadingFriends", 
    "user/:id/shares": "displayShares"
  },

  // initialize: function() {

  // },

  login: function() {
    console.log("LOGIN FUNCTION IN THE ROUTER");
   // this.loadNavView( new CoolioApp.Views.Login() );
   // TODO FIGURE OUT HOW TO PASS THE SESSION INTO THE VIEW
   this.loadView( new CoolioApp.Views.Hello() );
   this.loadNavView( new CoolioApp.Views.NewSession({model: CoolioApp.currentUserModel}) );
  },

  displayUserDetails: function(userid) {
    this.loadNavView( new CoolioApp.Views.Logout() );
    this.loadView( new CoolioApp.Views.User({model: CoolioApp.currentUserModel}) );
  },

  displayFriends: function(userid) {
    CoolioApp.Friendships = new CoolioApp.Collections.Friendships({id: userid});
    this.loadView(new CoolioApp.Views.FriendsList({collection: CoolioApp.Friendships}));
  },

  displayShares: function(userid) {
    CoolioApp.Shares = new CoolioApp.Collections.Shares({id: userid});
    this.loadView(new CoolioApp.Views.SharesList({collection: CoolioApp.Shares}));
  },

  loadingFriends: function(userid) {
    console.log("LOADING FUNCTION IN ROUTER");
    this.loadView(new CoolioApp.Views.Loading({model: CoolioApp.currentUserModel}));
  },

  loadNavView: function(view) {
    console.log("LOAD NAV VIEW IN THE ROUTER", view.el);
    this.mainNav && this.mainNav.remove();
    this.mainNav = view;
    $("nav li.has-dropdown").append(view.el);
  },

  loadView: function(view) {
    console.log("LOAD VIEW IN THE ROUTER", view.el);
    this.main && this.main.remove();
    this.main = view;
    $("body").append(view.el);
  }
});