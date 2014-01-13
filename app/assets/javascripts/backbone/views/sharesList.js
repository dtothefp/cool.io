CoolioApp.Views.SharesList = Backbone.View.extend({
  className: "SHARE-list",

  initialize: function() {
    this.listenTo(this.collection, "reset", this.addAll);
    console.log("COLLECTION ID INSIDE THE SHARELIST VIEW", this.collection.id);
    this.collection.fetch({ 
      reset: true,
      success: function() {
        // Backbone.history.navigate("user/" + CoolioApp.Session.get("session_id"), {trigger:true});
        console.log("SHARE COLLECTION FETCHED", console.log(this.collection));
      }, 
      error: function() {
        console.log("SHARE COLLECTION FETCH ERROR");
        // Backbone.history.navigate("user/" + this.collection.id + "/loading", {trigger:true});
      } 
    });
  },

  addAll: function() {
    console.log("ADD ALL FUNCTION FOR COLLECTION");
    this.$el.html("");
    this.collection.each(this.addOne, this);
  },

  addOne: function(friend) {
    var view = new CoolioApp.Views.Friends({model: friend});
    this.$el.append(view.el);
  }
  
});