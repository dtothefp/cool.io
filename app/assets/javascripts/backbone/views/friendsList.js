CoolioApp.Views.FriendsList = Backbone.View.extend({
  className: "friends-list",

  template: _.template($("script#friends-svg").html()),

  initialize: function() {
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.collection, "reset", this.checkCount);
    this.listenTo(this, "returningUserSet", this.makePlot);
    // var self = this;
    // this.listenTo(this, "loaded", (function() {
    //   if (this.model.get("returning_user")) {
    //     this.collection.fetch({reset:true});
    //   } else {
    //     this.createProgressBar();
    //     console.log(this.rendered);
    //   }
    // }).call(this));
    // _.bindAll(this, 'beforeRender', 'render', 'afterRender'); 
    //   var _this = this; 
    //   this.render = _.wrap(this.render, function(render) { 
    //       _this.beforeRender(); 
    //       render(); 
    //       _this.afterRender(); 
    //       return _this; 
    // });
    this.render();
  },

  html: function() {
    if (this.model.get("returning_user")) { 
        return "<svg></svg>"
    } else { 
        return "<div id='message-container'><h3>You are a new User. Please wait while your Facebook Data is Loaded</h3><div id='progressbar'></div></div>"
    } 
  },

   render: function(model) {
    this.$el.html(this.template());
    console.log("render function in view");
    // this.$el.html(this.html());
    this.trigger("rendered");
  },

  // beforeRender: function() {
  //   console.log("before render");
  // },

  // afterRender: function() {
  //   console.log("after render");
  //   this.createProgressBar();
  // },

 

  // createProgressBar: function() {
  //   console.log("create progressbar in view");
  //   var self = this;
  //   var progressBar = document.querySelector("#progressbar");
  //   console.log(progressBar);
  //   var width = 2;
  //   $(progressBar).progressbar({
  //               value: false
  //             });
  //   $(progressBar).progressbar({
  //     value: 1, 
  //     create: function() {
  //       var progressBarWidth = $(".ui-progressbar-value");
  //       var interval = setInterval(function() {
  //           width += 2;
  //           progressBarWidth.css('width', width + '%');
  //           if (width >= 100) {
  //             clearInterval(interval);
  //             progressBar.progressbar({
  //               value: false
  //             });
  //             self.model.save({"returning_user": true}, {
  //               success: function(response) {
  //                 console.log("responseid", response.get("id"));
  //               }, 
  //               error: function(response) {

  //             }
  //         });
  //           }
  //       }, 1000);
  //     }
  //   });
  // },

  checkCount: function() {
    var self = this;
    var countRange = _.uniq( d3.extent(this.collection.models, function(d){ return d.get("count")}) );
    console.log("count range", countRange);
    if ( countRange.length === 1 && countRange[0] === 0 ) {
      setTimeout(function(){
        self.collection.fetch({reset:true});
      }, 2000);
    } else {
     if (!this.model.get("returning_user")) {
        this.model.save({"returning_user": true}, {
              success: function(response) {
                self.trigger("returningUserSet");
              }, 
              error: function(response) {
            }
        });
      } else {
        this.makePlot();
      }
    }
  }, 

  makePlot: function() {
    console.log("plotData function in view");
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

                     console.log(d3.extent(this.collection.models, function(d){ return d.get("count")}));
                     console.log(d3.max(this.collection.models, function(d){ return d.get("fb_id")}));
                     console.log(d3.min(this.collection.models, function(d){ return d.get("fb_id")}));
                     console.log(this.collection);

    var colorScale = d3.scale.linear()
                     .domain([0, d3.max(this.collection.models, function(d) { return d.attributes.count; })])
                     .rangeRound([0, 360]).clamp(true);
     svg.selectAll("a")
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
    // var gElements = d3.selectAll("g.placeholder");

    // _.each(gElements[0], function(element){
    //   if (element.__data__.get("count") === 0) {
    //     element.remove();
    //   }
    // });
  }
  
});