CoolioApp.Views.FriendsList = Backbone.View.extend({
  className: "friends-list",

  initialize: function() {
    this.listenTo(this.collection, "reset", this.addAll);
    this.addAll();

    this.collection.fetch({ reset: true });
  },

  addAll: function() {
    this.$el.html("");
    this.collection.each(this.addOne, this);
  },

  addOne: function(friend) {
    console.log("add one function", friend);
    var view = new CoolioApp.Views.Friends({model: friend});
    this.$el.append(view.el);
  }
  
});