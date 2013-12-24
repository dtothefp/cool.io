CoolioApp.Views.Status = Backbone.View.extend({
  tagName: "ul",

  template: _.template($("script#status-html").html()),

  initialize: function() {
    // TODO add a message that this may take a while and a returning user? column in user table
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  }
});