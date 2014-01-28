CoolioApp.Views.FriendsList = Backbone.View.extend({
  className: "friends-list",

  template: _.template($("script#friends-svg").html()),

  initialize: function() {
    this.listenTo(this.model, "change", this.render);
    // this.listenTo(this.model, "currentUserFetched", this.userFecthed);
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

  // Used if user refreshes the page
   userFecthed: function() {
     console.log("fetched user event fired");
     if (this.model.get("returning_user")) {
        this.collection.fetch({reset:true});
     }
   },

   render: function(model) {
    this.$el.html(this.template());
    console.log("render function in view");
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
      window.setTimeout(function(){
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

   var self = this;
   

   // for(var i=0; i < this.collection.models.length; i++) {
   //    if(this.collection.models[i].get("count") === 0) {
   //      delete this.collection.models[i];
   //    }
   // }

   this.newCollection = [];

   _.each(this.collection.models, function(model){
              if (model.get("count") !== 0) {
                this.newCollection.push(model);
              }
          }, this);

   var xScale = d3.scale.linear()
                     .domain([0, this.newCollection.length])
                     .rangeRound([padding, w - padding]);

   var yScale = d3.scale.linear()
                     .domain([0, d3.max(this.newCollection, function(d) { return d.get("count"); })])
                     .rangeRound([h - padding, padding]);

    extent = d3.extent(this.newCollection, function(d) { return d.get("count") });

    var colorScale = d3.scale.linear()
                     .domain([0, d3.max(this.newCollection, function(d) { return d.attributes.count; })])
                     .rangeRound([0, 360]).clamp(true);

    var color = d3.scale.category20c();

    // var tip = d3.tip()
    //   .attr('class', 'd3-tip')
    //   .style("background", function(d){ return d.get("count") })
    //   .offset([-10, 0])
    //   .html(function(d) {
    //     return "<span style='color:red'>" + "" + "</span>";
    // });

    // svg.call(tip);

    var toolTip = d3.select("body").append("div")
                    .attr('class', 'd3-tip')
                    .style({
                      opacity: 0,
                      position: "absolute",
                      width: "200px",
                      height: "100px"
                    });


    svg.selectAll("g")
     .data(this.newCollection)
     .enter()
     .append("g")
     .attr("class", "placeholder")
     .attr("transform", function(d, i) { return "translate(" + xScale(i) + "," + yScale(d.get("count")) + ")"; })
     .append("a")
     .attr("xlink:href", function(d){
      return "https://www.facebook.com/" + d.get("fb_id");
     })
     .attr("target", "_blank")
     .append("circle")
     .attr("r", function(d){return d.get("count") !== 0 ? (d.get("count") * 2) : 3})
     .attr("fill", function(d) {
      return color(d.get("count"));
     })
     .on("mouseover", function(d, i){
        d3.select(this).transition().duration(500).attr("r", 20);
        var position = $(this).position();
        toolTip
          .html("<span>" + d.get("name") + "</span><br><span>" + d.get("count") + "</span>")
          .transition()        
          .duration(500) 
          .style({
            opacity: 1,
            top: position.top + 10 + "px",
            left: position.left + 20 + "px",
            "background-image": "url(" + d.get("image_url") + ")",
            "background-repeat": "no-repeat",
            "background-position": "top center"
          })
        // tip.show();
     })
     .on("mouseout", function(d){
        d3.select(this).transition().duration(500).attr("r", d.get("count") !== 0 ? (d.get("count") * 2) : 3);
        // tip.hide();
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
    d3.selectAll(".x .tick").remove();


    //REMOVE ALL ELMENTS WITH A COUNT OF ZERO
    // var gElements = d3.selectAll("g.placeholder");

    // _.each(gElements[0], function(element){
    //   if (element.__data__.get("count") === 0) {
    //     element.remove();
    //   }
    // });

       // .on("mouseover", function(d){
      //    d3.select(this).append("image").attr("width", 0).attr("height", 0).transition().duration(500).attr("width", 75).attr("height", 75).attr("xlink:href", d.get("image_url") ).attr("x", 25);
     //    d3.select(this).append("text").attr("fill", "white").attr("font-size", 20).attr("y", -60).append("tspan").text( d.get("name") ).attr("x", 0).attr("dy", "1.2em");
     //    d3.select("text").append("tspan").text("Count: " + d.get("count")).attr("x", 20).attr("dy", "1.2em");
     // })
     // .on("mouseout", function(d){
     //    d3.select("g image").remove();
     //    d3.select("g text").remove();
     // })
  }
  
});