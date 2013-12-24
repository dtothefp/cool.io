CoolioApp.Views.User = Backbone.View.extend({
  id: "user",

  template: _.template($("script#user-details").html()),

  initialize: function() {
    this.render();
  },

  events: {
    "click": "findFriends"
  },

  render: function() {
    this.$el.html(this.template());
  },

  findFriends: function() {
    Backbone.history.navigate("user/" + this.model.get("id") + "/friendships", {trigger:true});
  }

});