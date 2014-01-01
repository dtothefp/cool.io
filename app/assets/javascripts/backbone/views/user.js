CoolioApp.Views.User = Backbone.View.extend({
  id: "user",

  template: _.template($("script#user-details").html()),

  initialize: function() {
    this.listenTo(this.model, "change", this.render);
    this.render();
  },

  events: {
    "click #get-friends": "findFriends",
    "click #get-shares": "getShares"
  },

  render: function() {
    this.$el.html(this.template());
  },

  findFriends: function() {
    Backbone.history.navigate("user/" + this.model.get("id") + "/friendships", {trigger:true});
  },

  getShares: function() {
    console.log("SHARES FUNCTION IN USER VIEW");
    Backbone.history.navigate("user/" + this.model.get("id") + "/shares", {trigger:true});
  }

});