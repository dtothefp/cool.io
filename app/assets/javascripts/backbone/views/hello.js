CoolioApp.Views.Hello = Backbone.View.extend({
  id: "hello",

  template: _.template($("script#say-hello").html()),

  events: {
    "mouseenter": "cleanHumor",
    "mouseleave": "dirtyHumor"
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  }, 

  cleanHumor: function() {
    $("#dirty").text("IND");
  },

  dirtyHumor: function() {
    $("#dirty").text("$@%");
  }

});