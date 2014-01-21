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
    var self = this;
    if (!this.model.get("returning_user")) {
      console.log("returning user function");
      var progressBar = $('#progressbar'), width = 2;
      progressBar.progressbar({
        value: 1, 
        create: function() {
          var progressBarWidth = $(".ui-progressbar-value");
          var interval = setInterval(function() {
              width += 1;
              progressBarWidth.css('width', width + '%');
              if (width >= 100) {
                clearInterval(interval);
                progressBar.progressbar({
                  value: false,
                  create: function() {
                    console.log("create function in progressbar");
                    self.model.save({"returning_user": true}, {
                      success: function(response) {

                      }, 
                      error: function(response) {

                      }
                    });
                  }
                });
              }
          }, 100);
        }
      });
    }
  },

  findFriends: function(e) {
    e.preventDefault();
    Backbone.history.navigate("user/" + this.model.get("id") + "/friendships", {trigger:true});
  }

});

