CoolioApp.Views.Friends = Backbone.View.extend({
  tagName: "ul",

  template: _.template($("script#friends-html").html()),

  initialize: function() {
    console.log("friend view initialize");
    // TODO add a message that this may take a while and a returning user? column in user table
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  }
});