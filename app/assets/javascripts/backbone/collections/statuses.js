CoolioApp.Collections.Statuses = Backbone.Collection.extend({
  initialize: function(options) {
    this.id = options.id;
  },

  model: CoolioApp.Models.Status,

  url: function() {
    console.log("ID INSIDE THE STATUSES COLLECTION", this.id);
    return "users/" + this.id + "/statuses";
  }
});