CoolioApp.Views.User = Backbone.View.extend({
  id: "user",

  template: _.template($("script#user-details").html()),

  initialize: function() {
    this.listenTo(this.model, "sync", this.render);
    if (this.model.get("id")) {
      console.log("id render");
      this.render();
    }
  },

  events: {
    "click #get-friends": "findFriends",
  },

  render: function() {
    this.$el.html(this.template());
    console.log("returning user", this.model.get("returning_user"));
    // if (!this.model.get("returning_user")) {
    //   this.createProgressBar();
    // }
  },

  findFriends: function(e) {
    e.preventDefault();
    Backbone.history.navigate("user/" + this.model.get("id") + "/friendships", {trigger:true});
  }, 

  createProgressBar: function() {
    console.log("create progressbar");
    var self = this;
    var progressBar = $('#progressbar'), width = 2;
    progressBar.progressbar({
      value: 1, 
      create: function() {
        var progressBarWidth = $(".ui-progressbar-value");
        var interval = setInterval(function() {
            width += 1;
            progressBarWidth.css('width', width + '%');
            if (width >= 100) {
              console.log("width exceeds");
              clearInterval(interval);
              // self.model.save({"returning_user": true}, {
              //       success: function(response) {
              //         console.log("returning user", self.model.get("returning_user"));
              //       }, 
              //       error: function(response) {

              //       }
              //     });
              progressBar.progressbar({
                value: false
              });
            }
        }, 100);
      }
    });
  }

});

