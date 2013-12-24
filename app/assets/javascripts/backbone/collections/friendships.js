CoolioApp.Collections.Friendships = Backbone.Collection.extend({
  initialize: function(options) {
    this.id = options.id;
  },

  model: CoolioApp.Models.Friend,

  url: function() {
    console.log("ID INSIDE THE FRIENDSHIPS COLLECTION", this.id);
    return "users/" + this.id + "/friendships";
  }
});