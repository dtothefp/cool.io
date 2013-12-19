CoolioApp.Views.Logout = Backbone.View.extend({
  tagName: "ul",
  className: "dropdown",

  template: _.template($("script#logout-view").html()),

  initialize: function() {
    console.log("instantiate logout view");
    this.render();
  },

  events: {
    "click li#sign_out": "logoutFB"
  },

  logoutFB: function() {
    FB.logout(function(response) {
      location.reload();
      // CoolioApp.checkAuthentication();
    });
  },

  render: function() {
    this.$el.html(this.template());
  }

});