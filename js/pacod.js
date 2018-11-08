var cols = ["inspiring", "informative", "funny", "views", "comments", "languages", "duration", "published_date", "confusing", "unconvincing"];
var sortingArr = ["inspiring", "informative", "funny", "views", "comments", "languages", "duration", "published_date", "confusing", "unconvincing"];
var redirect = "#pacod";
//////////////////////////////////////////////////////////////////////////////

function startEmPacod(svg, svgSize, tedData) {
  $("#pacod").addClass("disabled");
  $("#utilities").html(" ");

  if (window.location.hash) {

    var hash = window.location.hash;
    if (hash == redirect) {
      drawPacod(svg, svgSize, tedData.data, window.location.hash);
    } else {
      window.location.hash = redirect;
    }

  } else {
    window.location.hash = redirect;
  }

}

//////////////////////////////////////////////////////////////////////////////

function drawPacod(svg, svgSize, data, category) {

  var width = svgSize.width;
  var height = svgSize.height;
  var margin = svgSize.margin;

  var xRange = d3.scalePoint()
    .range([0, width])
    .padding(.1);
  var y = {};
  var dragging = {};

  var line = d3.line();
  var axis = d3.axisLeft();
  var color = d3.scaleOrdinal(d3.schemeCategory10);


  xRange.domain(dimensions = d3.keys(data[0]).filter(function(d) {
    return cols.includes(d) && (y[d] = d3.scaleLinear()
      .domain(d3.extent(data, function(p) {
        return +p[d];
      }))
      .range([height, 0]));
  }));

  dimensions.sort(function(a, b){
        return sortingArr.indexOf(a) - sortingArr.indexOf(b);
    });

  console.log(y,dimensions)

  var background = svg.append("g")
    .attr("class", "pacodBackground")
    .selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("d", path);

  var foreground = svg.append("g")
    .attr("class", "pacodForeground")
    .selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("d", path)
    .style("stroke", function(d) { return color(d.title); });

  var g = svg.selectAll(".dimension")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function(d) {
      return "translate(" + xRange(d) + ")";
    });

    g.append("g")
      .attr("class", "pacodAxis")
      .each(function(d) { console.log(d,y[d]); d3.select(this).call(axis.scale(y[d])); });

     svg.selectAll(".dimension")
     .append("text")
     .style("text-anchor", "end")
     .attr("dx", ".1em")
     .attr("transform", "rotate(45)")
      .attr("y", -9)
      .text(function(d) { return d; });

  function position(d) {
    var v = dragging[d];
    return v == null ? xRange(d) : v;
  }

  function transition(g) {
    return g.transition().duration(500);
  }

  // Returns the path for a given data point.
  function path(d) {
    return line(dimensions.map(function(p) {
      return [position(p), y[p](d[p])];
    }));
  }



  weAllGoodPacod();
}

function weAllGoodPacod() {
  $("#pacod").removeClass("disabled");
}
