CoolioApp.Views.NewSession = Backbone.View.extend({
  tagName: "ul",
  className: "dropdown",

  events: {
    "click #sign_up": "signUp",
    "click #sign_in": "login"
  },

  template: _.template($("script#new-session").html()),

  initialize: function() {
    this.listenTo(this.model, "change:name", this.navigateToUserPath);
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  },

  signUp: function() {
    FB.login(function(response) {
      if (response.authResponse) {
        console.log("response in the signup function", response);
        CoolioApp.currentUserModel.save({fb_id: response.authResponse.userID, oauth_token: response.authResponse.accessToken, oauth_expires_at: response.authResponse.expiresIn}, {
          success: function(response) {
            console.log("SUCCESS SAVING THE CURRENT USER IN THE SIGNUP FUNCTION", response.attributes);
            CoolioApp.Session.save({fb_id: response.get("fb_id"), oauth_token: response.get("oauth_token"), oauth_expires_at: response.get("oauth_expires_at")});
          },
          error: function(response) {
            console.log("ERROR SAVING THE CURRENT USER IN THE SIGNUP FUNCTION", response.attributes);
          }
        });
      }
    }, {scope: 'email,read_stream,user_photos,friends_likes'} );
  },

  login: function() {
    FB.login(function(response) {
      if (response.authResponse) {
        CoolioApp.checkLoginStatus();
      }
    }, {scope: 'email,read_stream,user_photos,friends_likes'} );
  },

  navigateToUserPath: function() {
    console.log("REDIRECT FROM LISTENER IN THE LOGIN VIEW", this.model.get("id"));
    Backbone.history.navigate("user/" + this.model.get("id"), {trigger: true});
  }

  // requestFriends: function(e) {
  //   e.preventDefault();
  //   Backbone.history.navigate( "user/" + CoolioApp.session.get("session_id") + "/friends", {trigger:true});
  // }

});