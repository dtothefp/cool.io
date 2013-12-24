CoolioApp.Views.FriendsList = Backbone.View.extend({
  className: "friends-list",

  initialize: function() {
    this.listenTo(this.collection, "reset", this.addAll);
    this.collection.fetch({ 
      reset: true,
      success: function() {
        // Backbone.history.navigate("user/" + CoolioApp.Session.get("session_id"), {trigger:true});
        console.log("COLLECTION FETCHED");
      }, 
      error: function() {
        console.log("FRIENDSHIP COLLECTION FETCH ERROR");
      } 
    });
    // Backbone.history.navigate("user/" + this.collection.id + "/loading", {trigger:true});
  },

  addAll: function() {
    this.$el.html("");
    this.collection.each(this.addOne, this);
  },

  addOne: function(friend) {
    var view = new CoolioApp.Views.Friends({model: friend});
    this.$el.append(view.el);
  }
  
});