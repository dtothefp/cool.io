CoolioApp.Views.FriendsList = Backbone.View.extend({
  className: "friends-list",

  initialize: function() {
    // this.listenTo(this.collection, "reset", this.addAll);
    this.listenTo(this.collection, "reset", this.plotData);
    console.log("COLLECTION ID INSIDE THE STATUSLIST VIEW", this.collection.id);
    var self = this;
    collection = this.collection;
    this.collection.fetch({ 
      reset: true,
      success: function() {
        // Backbone.history.navigate("user/" + CoolioApp.Session.get("session_id"), {trigger:true});
        console.log("STATUS COLLECTION FETCHED", self.collection.toJSON());
      }, 
      error: function() {
        console.log("STATUS COLLECTION FETCH ERROR");
        // Backbone.history.navigate("user/" + this.collection.id + "/loading", {trigger:true});
      } 
    });
  },

  addAll: function() {
    console.log("ADD ALL FUNCTION FOR COLLECTION", this.collection);
    this.$el.html("");
    this.collection.each(this.addOne, this);
  },

  addOne: function(friend) {
    var view = new CoolioApp.Views.Friends({model: friend});
    this.$el.append(view.el);
  },

  plotData: function() {
    //circles = d3.selectAll("circle")
    var h = 960;
    var w = 1200;

    var svg = d3.select(this.el)
            .append("svg")
            .attr("width", w)
            .attr("height", h);

   var padding = 100;

   var xScale = d3.scale.linear()
                     .domain([d3.min(this.collection.models, function(d){ return d.attributes.id}), d3.max(collection.models, function(d) { return d.attributes.id; })])
                     .rangeRound([padding, w - padding]).clamp(true);

   var yScale = d3.scale.linear()
                     .domain([0, d3.max(this.collection.models, function(d) { return d.attributes.count; })])
                     .rangeRound([h - padding, padding]).clamp(true);

    var colorScale = d3.scale.linear()
                     .domain([0, d3.max(this.collection.models, function(d) { return d.attributes.count; })])
                     .rangeRound([0, 360]).clamp(true);

     circles = svg.selectAll(".node")
     .data(this.collection.models)
     .enter()
     .append("g")
     .on("mouseover", function(d){
        console.log("this in g", this); 
        d3.select(this).append("image").attr("width", 75).attr("height", 75).attr("xlink:href", d.get("image_url") ).attr("x", 25);
        d3.select(this).append("text").attr("fill", "white").attr("font-size", 20).attr("y", -60).append("tspan").text( d.get("name") ).attr("x", 0).attr("dy", "1.2em");
        d3.select("text").append("tspan").text("Count: " + d.get("count")).attr("x", 20).attr("dy", "1.2em");
     })
     .on("mouseout", function(d){
        console.log("this in g", this); 
        d3.select("g image").remove();
        d3.select("g text").remove();
     })
     .attr("transform", function(d) { return "translate(" + xScale(d.attributes.id) + "," + yScale(d.attributes.count) + ")"; })
     .append("circle")
     .attr("r", function(d){return d.attributes.count !== 0 ? d.attributes.count : 2})
     .attr("fill", function(d) {
      return "hsla(" + colorScale(d.attributes.count) + ", 100%, 50%, .7)"})
     .on("mouseover", function(d){
        d3.select(this).attr("r", 20);
     })
     .on("mouseout", function(d){
        d3.select(this).attr("r", d.attributes.count !== 0 ? d.attributes.count : 2);
     });
  }
  
});