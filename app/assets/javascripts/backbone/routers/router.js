CoolioApp.Router = Backbone.Router.extend({
  routes: {
    "" : "checkLoginStatus",
    "welcome": "login",
    "user" : "fetchUser",
    "user/:id": "displayUserDetails",
    "user/:id/friendships": "displayFriends",
    "user/:id/loading": "loadingFriends", 
    "user/:id/shares": "displayShares"
  },

  initialize: function() {
    this.model = CoolioApp.currentUserModel;
    model = this.model;
    console.log("model length", this.model.length);
    console.log(this.model);
    this.checkLoginStatus();
  },

  login: function() {
   $(".right a").text("Sign-Up / Login");
   // TODO FIGURE OUT HOW TO PASS THE SESSION INTO THE VIEW
   this.loadView( new CoolioApp.Views.Hello() );
   this.loadNavView( new CoolioApp.Views.NewSession({model: CoolioApp.currentUserModel}) );
  },

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
    if(!this.model.get("returning_user")) {
      this.createProgressBar();
    }
  },

  loadNavView: function(view) {
    this.mainNav && this.mainNav.remove();
    this.mainNav = view;
    $("nav li.has-dropdown").append(view.el);
  },

  loadView: function(view) {
    console.log("load view");
    this.main && this.main.remove();
    this.main = view;
    $("body").append(view.el);
  }, 

  createProgressBar: function() {
    console.log("collection", this.collection);
    console.log("create progressbar");
    var self = this;
    var progressBar = $('#progressbar'), width = 2;
    progressBar.progressbar({
      value: 1, 
      create: function() {
        var progressBarWidth = $(".ui-progressbar-value");
        var interval = setInterval(function() {
            width += 2;
            progressBarWidth.css('width', width + '%');
            if (width >= 100) {
              console.log("width exceeds");
              clearInterval(interval);
              progressBar.progressbar({
                value: false
              });
              self.model.save({"returning_user": true}, {
                success: function(response) {
                  console.log("self collection", self.collection);
                  console.log("this collection", this.collection);
                  self.collection.fetch({reset: true});
                }, 
                error: function(response) {

              }
          });
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