var period = moment('201609','YYYYMM').format('YYYYMM');
window.getMonetary(period).then(function (flatData) {

  var root = d3.stratify()
      .id(function(d) { return d.id; })
      .parentId(function(d) { return d.parentId; })
      (flatData);
  root.sum(function(d) { return d.value; });
      //.sort(function(a, b) { return b.value - a.value; });
  /*
  var width=100, height=100;
  var treemap = d3.treemap()
      .size([100, 100])
      .padding(1)
      .round(true);
  treemap(root);
  
  var div = d3.select("#d3-treemap").append("div");
  console.log(div)
    //  .style("position", "relative")
    //  .style("width", (width + margin.left + margin.right) + "px")
    //  .style("height", (height + margin.top + margin.bottom) + "px")
    //  .style("left", margin.left + "px")
    //  .style("top", margin.top + "px");
    var node = div.datum(root).data(treemap.nodes)//.enter().append("div");
    //    .attr("class", "node");
  
    svg.selectAll("path")
        .data(partition(root).descendants())
      .enter().append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color((d.children ? d : d.parent).data.name); })
        .on("click", click)
      .append("title")
        .text(function(d) { return d.data.name + "\n" + formatNumber(d.value); });


  //  node
  //      .data(treemap.value(value).nodes)



  console.log(root)
  */



  var svg = d3.select("svg"),
      diameter = +svg.attr("width"),
      g = svg.append("g").attr("transform", "translate(2,2)"),
      format = d3.format("d");

      var pack = d3.pack()
          .size([diameter - 4, diameter - 4]);


    var node = g.selectAll(".node")
      .data(pack(root).descendants())
      .enter().append("g")
        .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.data.text + "\n" + format(d.value / 1000) + " млрд грн"; });

    node.append("circle")
        .attr("r", function(d) { return d.r; });

    node.filter(function(d) { return !d.children; }).append("text")
        .attr("dy", "0.3em")
        .text(function(d) { return d.data.text.substring(0, d.r / 3); });


});

/*
var width = 500,
    height = 500,
    radius = (Math.min(width, height) / 2) - 10;

var formatNumber = d3.format(",d");

var x = d3.scaleLinear()
    .range([0, 2 * Math.PI]);

var y = d3.scaleSqrt()
    .range([0, radius]);

var color = d3.scaleOrdinal(d3.schemeCategory20c);
//var color = d3.scale.category20c();

var partition = d3.partition();

var arc = d3.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y1)); });


var svg = d3.select("#d3-treemap").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");


  svg.selectAll("path")
      .data(partition(root).descendants())
    .enter().append("path")
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", function(d) { return color(d.children ? d.depth + d.data.text : d.data.text); })
      .style("fill-rule", "evenodd")
      .on("click", click)
    .append("title")
      .text(function(d) { return d.data.text + "\n" + formatNumber(d.value); });

  svg.selectAll("path").append("text")
      .attr("dy", "0.3em")
      .text(function(d) { return d.data.text.substring(0, d.r / 3); });

function click(d) {
  svg.transition()
      .duration(750)
      .tween("scale", function() {
        var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]),
            yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
      })
    .selectAll("path")
      .attrTween("d", function(d) { return function() { return arc(d); }; });
}

d3.select(self.frameElement).style("height", height + "px");
*/
