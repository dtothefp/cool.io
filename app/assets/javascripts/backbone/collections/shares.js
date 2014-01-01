CoolioApp.Collections.Shares = Backbone.Collection.extend({
  initialize: function(options) {
    this.id = options.id;
  },

  model: CoolioApp.Models.Status,

  url: function() {
    console.log("ID INSIDE THE SHARES COLLECTION", this.id);
    return "users/" + this.id + "/shares";
  }
});