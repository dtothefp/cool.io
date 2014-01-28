CoolioApp.Router = Backbone.Router.extend({
  routes: {
    "" : "checkLoginStatus",
    "welcome": "login",
    "user" : "fetchUser",
    "user/:id": "displayUserDetails",
    "user/:id/friendships": "displayFriends"
  },

  initialize: function() {
    this.model = CoolioApp.currentUserModel;
    this.checkLoginStatus();
  },

  login: function() {
   $(".right a").text("Sign-Up / Login");
   // TODO FIGURE OUT HOW TO PASS THE SESSION INTO THE VIEW
   this.loadView( new CoolioApp.Views.Hello() );
   this.loadNavView( new CoolioApp.Views.NewSession({model: CoolioApp.currentUserModel}) );
  },

  // Checks the login status and starts a session for the current user
  fetchUser: function() {
    this.checkLoginStatus();
  }, 

  displayUserDetails: function(userid) {
    $(".right a").text("Logout");
    this.loadNavView( new CoolioApp.Views.Logout() );
    this.loadView( new CoolioApp.Views.User({model: this.model, modelId: userid}) );
  },

  displayFriends: function(userid) {
    this.loadNavView( new CoolioApp.Views.Logout() );
    this.collection = new CoolioApp.Collections.Friendships({id: userid});
    this.loadView(new CoolioApp.Views.FriendsList({collection: this.collection, model: this.model}));
    this.listenTo(this, "loaded", (function(){
      if(!this.model.get("returning_user")) {
        this.createProgressBar();
      } else {
        this.collection.fetch({reset:true});
        console.log(this);
      }
    }).call(this));
  },

  loadNavView: function(view) {
    this.mainNav && this.mainNav.remove();
    this.mainNav = view;
    $("nav li.has-dropdown").append(view.el);
  },

  loadView: function(view) {
    this.main && this.main.remove();
    this.main = view;
    $("body").append(view.el);
    this.trigger("loaded");
  }, 

  createProgressBar: function() {
    var self = this;
    var progressBar = $('#progressbar'), width = 2;
    progressBar.progressbar({
      value: 1, 
      create: function() {
        var progressBarWidth = $(".ui-progressbar-value");
        var interval = setInterval(function() {
            width += 5;
            progressBarWidth.css('width', width + '%');
            if (width >= 100) {
              clearInterval(interval);
              progressBar.progressbar({
                value: false
              });
              self.collection.fetch({reset:true});
            }
        }, 1000);
      }
    });
  },

  plotData: function() {
    console.log("plotData function in router");
    var h = 800;
    var w = 1060;

    var svg = d3.select("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("fill", "rgba(0, 0, 255, 0.75)");

   var padding = 100;

   var xScale = d3.scale.linear()
   .domain([0, this.collection.length])
   .rangeRound([padding, w - padding]).clamp(true);

   var yScale = d3.scale.linear()
                     .domain([0, d3.max(this.collection.models, function(d) { return d.attributes.count; })])
                     .rangeRound([h - padding, padding]).clamp(true);

    var colorScale = d3.scale.linear()
                     .domain([0, d3.max(this.collection.models, function(d) { return d.attributes.count; })])
                     .rangeRound([0, 360]).clamp(true);

     svg.selectAll("g")
     .data(this.collection.models)
     .enter()
     .append("a")
     .attr("xlink:href", function(d){
      return "https://www.facebook.com/" + d.get("fb_id");
     })
     .attr("target", "_blank")
     .append("g")
     .attr("class", "placeholder")
     .on("mouseover", function(d){
        d3.select(this).append("image").attr("width", 0).attr("height", 0).transition().duration(500).attr("width", 75).attr("height", 75).attr("xlink:href", d.get("image_url") ).attr("x", 25);
        d3.select(this).append("text").attr("fill", "white").attr("font-size", 20).attr("y", -60).append("tspan").text( d.get("name") ).attr("x", 0).attr("dy", "1.2em");
        d3.select("text").append("tspan").text("Count: " + d.get("count")).attr("x", 20).attr("dy", "1.2em");
     })
     .on("mouseout", function(d){
        d3.select("g image").remove();
        d3.select("g text").remove();
     })
     .attr("transform", function(d, i) { return "translate(" + xScale(i) + "," + yScale(d.get("count")) + ")"; })
     .append("circle")
     .attr("r", function(d){return d.get("count") !== 0 ? (d.get("count") * 2) : 3})
     .attr("fill", function(d) {
      return "hsla(" + colorScale(d.get("count")) + ", 100%, 50%, .7)"
     })
     .on("mouseover", function(d){
        d3.select(this).transition().duration(500).attr("r", 20);
     })
     .on("mouseout", function(d){
        d3.select(this).transition().duration(500).attr("r", d.get("count") !== 0 ? (d.get("count") * 2) : 3);
     });
    
    // CREATE THE X AND Y AXIS
    var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left")
                      .ticks(5);

    svg.append("g")
      .attr("class", "axis y")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(5);

    svg.append("g")
      .attr("class", "axis x")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);

    // REMOVE TEXT FROM X AXIS
    d3.selectAll(".x text").remove();


    //REMOVE ALL ELMENTS WITH A COUNT OF ZERO
    var gElements = d3.selectAll("g.placeholder");

    _.each(gElements[0], function(element){
      if (element.__data__.get("count") === 0) {
        element.remove();
      }
    });
  },

  checkLoginStatus: function() {
    var self = this;
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // SET THE SESSION -- WE KNOW THE USER ALREADY EXISTS
        var token = response.authResponse.accessToken;
        var tokenExpires = response.authResponse.expiresIn;
        CoolioApp.Session.save({fb_id: response.authResponse.userID, oauth_token: response.authResponse.accessToken, oauth_expires_at: response.authResponse.expiresIn}, {
          success: function(response) {
            // FETCH THE CURRENT USER DATA
            CoolioApp.currentUserModel.set({id: response.get("id"), oauth_token: token, oauth_expires_at: tokenExpires, returning_user: response.get("returning_user")});
            CoolioApp.currentUserModel.fetch({
              success: function(response) {
                // console.log("route", route);
                console.log("user fetched", self.model);
                Backbone.history.navigate("user/" + self.model.get("id"), {trigger: true});
              },
              error: function(response) {
              }
            });
          }, 
          error: function(response) {
            alert("User Does Not Exist, Please Signup");
          }
        });
      } else if (response.status === 'not_authorized') {
        Backbone.history.navigate("/welcome", {trigger: true});
      } else {
        Backbone.history.navigate("/welcome", {trigger: true});
      }
    });
  }

});