_.extend(Backbone.View.prototype, Backbone.Events, {
   render: function() {
      //console.log('This is a test');
    this.mynewevent();
    return this;
   },
   myrender: function() {
      console.log('Pre-render work');
      this.render();
   },
   mynewevent: function() {
      var event = new Event('rendered');
      this.addEventListener('build', this.createProgressBar);
      this.dispatchEvent(event);
   }
});

CoolioApp.Views.User = Backbone.View.extend({
  id: "user",

  template: _.template($("script#user-details").html()),

  initialize: function() {
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "sync", this.createProgressBar);
    this.render();
  },

  events: {
    "click #get-friends": "findFriends",
  },

  render: function() {
    this.$el.html(this.template());
    console.log("returning user", this.model.get("returning_user"));
    this.createProgressBar();
  },

  findFriends: function(e) {
    e.preventDefault();
    Backbone.history.navigate("user/" + this.model.get("id") + "/friendships", {trigger:true});
  }, 

  createProgressBar: function() {
        console.log("create progressbar");
     var self = this;
    if (!this.model.get("returning_user")) {
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
                    console.log("create function");
                    self.model.save({"returning_user": true}, {
                      success: function(response) {
                        console.log("returning user", self.model.get("returning_user"));
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
  }

});

