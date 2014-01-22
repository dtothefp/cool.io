CoolioApp.Views.Logout = Backbone.View.extend({
  tagName: "ul",
  className: "dropdown",

  template: _.template($("script#logout-view").html()),

  initialize: function() {
    this.render();
  },

  events: {
    "click li#sign_out": "logoutFB"
  },

  logoutFB: function() {
    FB.logout(function(response) {
      if (response) {
        // CLEARS THE NAMESPACED CURRENT USER MODEL
        CoolioApp.currentUserModel.clear();
        // DESTROYS THE SESSION ON THE SERVER
        CoolioApp.Session.destroy({
          success: function(response) {
            // CLEARS THE NAMESPACED SESSION MODEL
            CoolioApp.Session.clear();
            Backbone.history.navigate("welcome", {trigger: true});
          }, 
          error: function(response) {
          }
        });
      };
    });
  },

  render: function() {
    this.$el.html(this.template());
  }

});