CoolioApp.Views.Loading = Backbone.View.extend({
  id: "loading-friends",

  template: _.template($("script#loading").html()),

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  }

});