CoolioApp.Collections.Friendships = Backbone.Collection.extend({
  initialize: function(options) {
    this.id = options.id;
  },

  model: CoolioApp.Models.Friend,

  url: function() {
    return "users/" + this.id + "/friendships";
  }
});