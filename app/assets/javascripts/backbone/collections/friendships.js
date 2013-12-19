CoolioApp.Collections.Friendships = Backbone.Collection.extend({
  model: CoolioApp.Models.Friend,

  url: function() {
    return "users/" + CoolioApp.currentUserModel.get("id") + "/friendships";
  }
});