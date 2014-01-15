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
            console.log("SUCCESS CALLBACK FOR SESSION DESTROY");
            Backbone.history.navigate("welcome", {trigger: true});
          }, 
          error: function(response) {
            console.log("ERROR CALLBACK FOR SESSION DESTROY");
          }
        });
      };
    });
  },

  render: function() {
    this.$el.html(this.template());
    console.log("logout render logout-view");
  }

});