CoolioApp.Views.GetFriends = Backbone.View.extend({
  id: "get-friends",

  events: {
    "click": "requestFriends"
  },

  template: _.template($("script#find-friends").html()),

  initialize: function() {
    this.render();
    // Backbone.history.navigate("friends", {trigger: true});
  },

  render: function() {
    this.$el.html(this.template());
    this.$el.appendTo($('body'));
  },

  requestFriends: function(e) {
    e.preventDefault();
    FB.api('/me', function(response) {
      // CREATE FRIENDS MODEL AND SEND TO THE SERVER ON THE USERS/FRIENDS PATH
      var friendModel = new CoolioApp.Models.Friend({fb_id: response.id});
      var friendsCollection = new CoolioApp.Collections.Friends;
      // TRY TO GET THE RESPONSE FROM FRIENDS??
      friendsCollection.create(friendModel, {
        success: function(friendsJSON) {
          console.log("friends json callback", friendsJSON);
        }, 

        error: function() {
          console.log("error hit");
        }
      });
    });
  }

});