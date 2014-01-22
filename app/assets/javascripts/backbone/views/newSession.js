CoolioApp.Views.NewSession = Backbone.View.extend({
  tagName: "ul",
  className: "dropdown",

  events: {
    "click #sign_up": "signUp",
    "click #sign_in": "login"
  },

  template: _.template($("script#new-session").html()),

  initialize: function() {
    this.listenTo(this.model, "sync", this.navigateToUserPath);
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  },

  signUp: function() {
    FB.login(function(response) {
      if (response.authResponse) {
        CoolioApp.currentUserModel.save({fb_id: response.authResponse.userID, oauth_token: response.authResponse.accessToken, oauth_expires_at: response.authResponse.expiresIn}, {
          success: function(response) {
            CoolioApp.Session.save({fb_id: response.get("fb_id"), oauth_token: response.get("oauth_token"), oauth_expires_at: response.get("oauth_expires_at")});
          },
          error: function(response) {
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
    Backbone.history.navigate("user/" + this.model.get("id"), {trigger: true});
  }

});