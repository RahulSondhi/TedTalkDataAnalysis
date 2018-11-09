var scplmCols = ["inspiring", "views", "languages", "comments", "confusing"];
//////////////////////////////////////////////////////////////////////////////

function startEmScplm(svg, svgSize, tedData) {
  var reroute = "#scplm";
  
  $("#scplm").addClass("disabled");
  $("#utilities").html(" ");
  d3.select("#visualization").append("div").attr("class", "tip").style("display", "none");

  if (window.location.hash) {

    var hash = window.location.hash;
    if (hash == reroute) {
      drawScplm(svg, svgSize, tedData.data, window.location.hash);
    } else {
      window.location.hash = reroute;
    }

  } else {
    window.location.hash = reroute;
  }

}

//////////////////////////////////////////////////////////////////////////////

function drawScplm(svg, svgSize, data, category) {

  var padding = 20;
  var size = ( (svgSize.width) / 5);

  var xRange = d3.scaleLinear()
    .range([padding / 2, size - padding / 2]);

  var yRange = d3.scaleLinear()
    .range([size - padding / 2, padding / 2]);

  var xAxis = d3.axisBottom(xRange).ticks(8);
  var yAxis = d3.axisLeft(yRange).ticks(8);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var domainByTrait = {},
      traits = d3.keys(data[0]).filter(function(d) { return scplmCols.includes(d); }),
      n = traits.length;

  traits.forEach(function(trait) {
    domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
  });

  xAxis.tickSize(size * n);
  yAxis.tickSize(-size * n);

  svg.selectAll(".xScplm.scplmAxis")
    .data(traits)
  .enter().append("g")
    .attr("class", "xScplm scplmAxis")
    .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
    .each(function(d) { xRange.domain(domainByTrait[d]); d3.select(this).call(xAxis); })

svg.selectAll(".yScplm.scplmAxis")
    .data(traits)
  .enter().append("g")
    .attr("class", "yScplm scplmAxis")
    .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
    .each(function(d) { yRange.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

var cell = svg.selectAll(".scplmCell")
    .data(cross(traits, traits))
  .enter().append("g")
    .attr("class", "scplmCell")
    .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
    .each(plot);

// Titles for the diagonal.
cell.filter(function(d) { return d.i === d.j; }).append("text")
    .attr("x", padding)
    .attr("y", padding)
    .attr("dy", ".71em")
    .text(function(d) { return d.x; });

function plot(p) {
  var cell = d3.select(this);
  xRange.domain(domainByTrait[p.x]);
  yRange.domain(domainByTrait[p.y]);

  cell.append("rect")
      .attr("class", "scplmFrame")
      .attr("x", padding / 2)
      .attr("y", padding / 2)
      .attr("width", size - padding)
      .attr("height", size - padding)
      .style("fill","#ffffff");

  cell.selectAll("circle")
      .data(data)
    .enter().append("circle")
      .attr("cx", function(d) {  return xRange(d[p.x]); })
      .attr("cy", function(d) { return yRange(d[p.y]); })
      .attr("r", 2)
      .style("fill", function(d) { return color(d.title); });
}

  weAllGoodScplm();

}

function cross(a, b) {
  var c = [], n = a.length, m = b.length, i, j;
  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
  return c;
}

function weAllGoodScplm() {
  $("#scplm").removeClass("disabled");
}
