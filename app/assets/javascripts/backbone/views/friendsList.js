CoolioApp.Views.FriendsList = Backbone.View.extend({
  className: "friends-list",

  template: _.template($("script#friends-svg").html()),

  initialize: function() {
    // this.listenTo(this.collection, "reset", this.addAll);
    model = this.model;
    this.listenTo(this.model, "sync", this.render);
    this.listenTo(this.collection, "reset", this.plotData);
    collection = this.collection;
    console.log("model in friendships", this.model);
    if (this.model.get("id")) {
      console.log("id render");
      this.render();
    }
    var self = this;
    this.collection.fetch({ 
      reset: true,
      success: function() {
        console.log("friendship collection fetched");
      }, 
      error: function() {
        console.log("friendship collection fetch error");
        // Backbone.history.navigate("user/" + this.collection.id + "/loading", {trigger:true});
      } 
    });
  },

  render: function() {
    // this.$el.html(this.template());
    if(this.model.get("returning_user")) {
      this.$el.html("<svg></svg>");
    } else {
      this.$el.html("<div id='message-container'><h3>You are a new User. Please wait while your Facebook Data is Loaded</h3><div id='progressbar'></div></div>");
    }
  },

  addAll: function() {
    this.$el.html("");
    this.collection.each(this.addOne, this);
  },

  addOne: function(friend) {
    var view = new CoolioApp.Views.Friends({model: friend});
    this.$el.append(view.el);
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
              progressBar.progressbar({
                value: false
              });
            }
        }, 100);
      }
    });
  },

  plotData: function() {
    console.log("plotData function");
    var h = 800;
    var w = 1060;

    var svg = d3.select("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("fill", "rgba(0, 0, 255, 0.75)");

   var padding = 100;

   // var xScale = d3.scale.linear()
   //                   .domain([d3.min(this.collection.models, function(d){ return d.attributes.id}), d3.max(this.collection.models, function(d) { return d.attributes.id; })])
   //                   .rangeRound([padding, w - padding]).clamp(true);

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
  }
  
});