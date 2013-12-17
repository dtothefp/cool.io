CoolioApp.Views.Login = Backbone.View.extend({
  id: "sign_in",

  initialize: function() {
  },

  events: {
    "click": "loginFB"
  },

  loginFB: function() {
    FB.login(function(response) {
      if (response.authResponse) {
        var new_user = new CoolioApp.Models.User({oauth_expires_at: response.authResponse.expiresIn, ouath_token: response.authResponse.accessToken});
        FB.api('/me', function(response) {
          new_user.set({name: response.name, email: response.email, fb_id: response.id});
          console.log(new_user);
          usersCollection.create(new_user, {
            success: function(newUserJSON) {
              console.log("new user json callback", newUserJSON);
            }, 

            error: function() {
              console.log("error hit new user callback");
            }
          });
          var sessionModel = new CoolioApp.Models.Session({fb_id: response.id}, {
            success: function(newSessionJSON) {
              console.log("new session json callback", newSessionJSON);
            }, 

            error: function() {
              console.log("error hit session callback");
            }
          });
          sessionModel.save();
          console.log("session model", sessionModel);
        });
      }
      CoolioApp.checkAuthentication();
    }, {scope: 'email,read_stream,user_photos,friends_likes'} );
  }
});