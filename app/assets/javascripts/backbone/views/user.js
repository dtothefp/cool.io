CoolioApp.Views.User = Backbone.View.extend({
  id: "user",

  template: _.template($("script#user-details").html()),

  initialize: function() {
    this.listenTo(this.model, "change", this.render);
    this.render();
  },

  events: {
    "click #get-friends": "findFriends",
  },

  render: function() {
    this.$el.html(this.template());
  },

  findFriends: function() {
    Backbone.history.navigate("user/" + this.model.get("id") + "/friendships", {trigger:true});
  }

});