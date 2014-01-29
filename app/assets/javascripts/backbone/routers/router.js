CoolioApp.Router = Backbone.Router.extend({
  routes: {
    "" : "checkLoginStatus",
    "welcome": "login",
    "user" : "fetchUser",
    "user/:id": "displayUserDetails",
    "user/:id/friendships": "displayFriends"
  },

  initialize: function() {
    this.model = CoolioApp.currentUserModel;
    this.checkLoginStatus();
  },

  login: function() {
   $(".right a").text("Sign-Up / Login");
   // TODO FIGURE OUT HOW TO PASS THE SESSION INTO THE VIEW
   this.loadView( new CoolioApp.Views.Hello() );
   this.loadNavView( new CoolioApp.Views.NewSession({model: CoolioApp.currentUserModel}) );
  },

  // Checks the login status and starts a session for the current user
  fetchUser: function() {
    this.checkLoginStatus();
  }, 

  displayUserDetails: function(userid) {
    $(".right a").text("Logout");
    this.loadNavView( new CoolioApp.Views.Logout() );
    this.loadView( new CoolioApp.Views.User({model: this.model, modelId: userid}) );
  },

  displayFriends: function(userid) {
    this.loadNavView( new CoolioApp.Views.Logout() );
    this.collection = new CoolioApp.Collections.Friendships({id: userid});
    this.loadView(new CoolioApp.Views.FriendsList({collection: this.collection, model: this.model}));
    this.listenTo(this, "loaded", (function(){
      if(!this.model.get("returning_user")) {
        this.createProgressBar();
      } else {
        this.collection.fetch({reset:true});
        console.log("loaded event in router fetching collection");
        console.log(this);
      }
    }).call(this));
    // this.listenTo(this.model, "currentUserFetched", (function(){
    //   if(!this.model.get("returning_user")) {
    //     this.createProgressBar();
    //   } else {
    //     this.collection.fetch({reset:true});
    //     console.log(this);
    //   }
    // }).call(this));
  },

  loadNavView: function(view) {
    this.mainNav && this.mainNav.remove();
    this.mainNav = view;
    $("nav .nav-bar-right").append(view.el);
  },

  loadView: function(view) {
    var tooltip = document.querySelector(".d3-tip");
    if( tooltip ) {
      $(tooltip).remove();
    }
    this.main && this.main.remove();
    this.main = view;
    $("body").append(view.el);
    this.trigger("loaded");
  }, 

  createProgressBar: function() {
    var self = this;
    var progressBar = $('#progressbar'), width = 2;
    progressBar.progressbar({
      value: 1, 
      create: function() {
        var progressBarWidth = $(".ui-progressbar-value");
        var interval = setInterval(function() {
            width += 5;
            progressBarWidth.css('width', width + '%');
            if (width >= 100) {
              clearInterval(interval);
              progressBar.progressbar({
                value: false
              });
              self.collection.fetch({reset:true});
            }
        }, 1000);
      }
    });
  },

  checkLoginStatus: function() {
    var self = this;
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // SET THE SESSION -- WE KNOW THE USER ALREADY EXISTS
        var token = response.authResponse.accessToken;
        var tokenExpires = response.authResponse.expiresIn;
        CoolioApp.Session.save({fb_id: response.authResponse.userID, oauth_token: response.authResponse.accessToken, oauth_expires_at: response.authResponse.expiresIn}, {
          success: function(response) {
            // FETCH THE CURRENT USER DATA
            CoolioApp.currentUserModel.set({id: response.get("id"), oauth_token: token, oauth_expires_at: tokenExpires, returning_user: response.get("returning_user")});
            CoolioApp.currentUserModel.fetch({
              success: function(response) {
                // console.log("route", route);
                console.log("user fetched", self.model);
                self.model.trigger("currentUserFetched");
                Backbone.history.navigate("user/" + self.model.get("id"), {trigger: true});
              },
              error: function(response) {
              }
            });
          }, 
          error: function(response) {
            alert("User Does Not Exist, Please Signup");
          }
        });
      } else if (response.status === 'not_authorized') {
        Backbone.history.navigate("/welcome", {trigger: true});
      } else {
        Backbone.history.navigate("/welcome", {trigger: true});
      }
    });
  }

});