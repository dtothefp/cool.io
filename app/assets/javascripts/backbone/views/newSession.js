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
  },

  signUp: function() {
    FB.login(function(response) {
      if (response.authResponse) {
        CoolioApp.checkLoginStatus();
      }
    }, {scope: 'email,read_stream,user_photos,friends_likes'} );
  },

  login: function() {
    FB.login(function(response) {
      if (response.authResponse) {
        CoolioApp.checkLoginStatus();
      }
    }, {scope: 'email,read_stream,user_photos,friends_likes'} );
  }

  // requestFriends: function(e) {
  //   e.preventDefault();
  //   Backbone.history.navigate( "user/" + CoolioApp.session.get("session_id") + "/friends", {trigger:true});
  // }

});