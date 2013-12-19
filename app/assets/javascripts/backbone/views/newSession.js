CoolioApp.Views.NewSession = Backbone.View.extend({
  tagName: "ul",
  className: "dropdown",

  events: {
    "click #sign_up": "signUp",
    "click #sign_in": "login"
  },

  template: _.template($("script#new-session").html()),

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
    console.log("RENDER NEW SESSION BUTTONS");
  },

  signUp: function() {
    var self = this;
    FB.login(function(response) {
      if (response.authResponse) {
        // GET THE OAUTH TOKEN AND SET IN THE USER MODEL
        var ouath_token = response.authResponse.accessToken;
        var oauth_expires_at = response.authResponse.expiresIn;
        console.log("login response");
        FB.api('/me?fields=id,name,picture,email', function(response) {
          // SET THE ADDITIONAL PERSONAL INFORMATION IN THE MODEL
          var attr = {name: response.name, email: response.email, fb_id: response.id, image_url: response.picture.data.url, oauth_expires_at: oauth_expires_at, ouath_token: ouath_token};
          console.log("ATTRIBUTES IN SIGNUP", attr);
          self.model.save(attr, {
            success: function(newUserJSON) {
              console.log("new USER json callback", newUserJSON);
              // CREATE A SESSION
              // TODO SET CURRENT USER MODEL IF IT HAS NOT BEEN SET BY LOGIN
             self.startSession(newUserJSON.get("fb_id"));
             Backbone.history.navigate("user/" + CoolioApp.Session.get("session_id"), {trigger:true});
            }, 

            error: function() {
              console.log("error hit new user callback");
            }
          });
        });
      }
      // CHECK AUTHENTICATION IN ORDER TO ROUTE TO THE APPROPRIATE ACTION AND 
      // APPEND/REMOVE THE APPROPRIATE VIEWS
    }, {scope: 'email,read_stream,user_photos,friends_likes'} );
  },

  login: function() {
    var self = this;
    FB.login(function(response) {
      if (response.authResponse) {
        console.log("login response");
        FB.api('/me', function(response) {
          // SET THE ADDITIONAL PERSONAL INFORMATION IN THE MODEL
          self.startSession(response.id);
          self.model.set( {id: CoolioApp.Session.get("session_id")} );
          self.model.fetch();
          // TO DO FIGURE OUT WHY URL HAS FACEBOOK ID RATHER THAN DATABASE ID
          Backbone.history.navigate("user/" + CoolioApp.Session.get("session_id"), {trigger:true});
        });
      // CHECK AUTHENTICATION IN ORDER TO ROUTE TO THE APPROPRIATE ACTION AND 
      // APPEND/REMOVE THE APPROPRIATE VIEWS
      }
    }, {scope: 'email,read_stream,user_photos,friends_likes'} );
  },

  startSession: function(id) {
    var self = this;
    console.log("new session options", id);
    CoolioApp.Session.save({session_id: id}, {
      success: function(newSessionJSON) {
        console.log("SESSION SET", newSessionJSON);
      }, 

      error: function() {
        console.log("SESSION SET ERROR");
      }
    });
  },

  requestFriends: function(e) {
    e.preventDefault();
    Backbone.history.navigate( "user/" + CoolioApp.session.get("session_id") + "/friends", {trigger:true});
  }

});