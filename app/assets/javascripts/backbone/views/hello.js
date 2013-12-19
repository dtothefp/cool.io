CoolioApp.Views.Hello = Backbone.View.extend({
  id: "hello",

  template: _.template($("script#say-hello").html()),

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
    console.log("RENDER WELCOME MESSAGE");
  }

});