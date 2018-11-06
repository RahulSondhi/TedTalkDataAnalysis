var cols = ["comments", "duration", "languages", "published_date", "views", "inspiring", "funny", "confusing", "informative", "unconvincing"];

//////////////////////////////////////////////////////////////////////////////

function startEmCorrel(svg, svgSize, tedData) {
  $("#corre").addClass("disabled");
  $("#utilities").html(" ");
  d3.select("#visualization").append("div").attr("class", "tip").style("display", "none");

  if (window.location.hash) {

    var hash = window.location.hash;
    if (hash == "#corre") {
      drawCorrel(svg, svgSize, tedData.data, window.location.hash);
    } else {
      window.location.hash = "#corre";
    }

  } else {
    window.location.hash = "#corre";
  }

}

//////////////////////////////////////////////////////////////////////////////

function drawCorrel(svg, svgSize, data, category) {

  var correlationMatrix = jz.arr.correlationMatrix(data, cols);
  var extent = d3.extent(correlationMatrix.map(function(d){ return d.correlation; }).filter(function(d){ return d !== 1; }));

  var grid = data2grid.grid(correlationMatrix);
  var rows = d3.max(grid, function(d){ return d.row; });

  var width = svgSize.width;
  var height = svgSize.height;
  var margin = svgSize.margin.top;

  var xRange = d3.scaleBand()
    .range([0, width])
    .paddingInner(.15)
    .domain(d3.range(1, rows + 1));

  var yRange = d3.scaleBand()
    .range([0, height])
    .paddingInner(.15)
    .domain(d3.range(1, rows + 1));

  var chromaticRange = chroma.scale(["tomato", "white", "green"])
    .domain([extent[0], 0, extent[1]]);

  var xAxis = d3.axisTop(yRange).tickFormat(function(d, i){ return cols[i]; });
  var yAxis = d3.axisLeft(xRange).tickFormat(function(d, i){ return cols[i]; });

  svg.append("g")
      .attr("class", "xAxis correlAxis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "yAxis correlAxis")
      .call(yAxis);

  svg.selectAll("rect")
      .data(grid, function(d){ return d.column_a + d.column_b; })
      .enter().append("rect")
      .attr("class","correlRect")
      .attr("x", function(d){ return xRange(d.column); })
      .attr("y", function(d){ return yRange(d.row); })
      .attr("width", xRange.bandwidth())
      .attr("height", yRange.bandwidth())
      .style("fill", function(d){ return chromaticRange(d.correlation); })
      .style("opacity", 1e-6)
    .transition()
      .style("opacity", 1);


  d3.selectAll("rect")
    .on("mouseover", function(d){

      d3.select(this).classed("selected", true);

      var row_pos = yRange(d.row);
      var col_pos = xRange(d.column);
      var tip_pos = d3.select(".tip").node().getBoundingClientRect();
      var tip_width = tip_pos.width;
      var tip_height = tip_pos.height;
      var grid_pos = d3.select("#visualization").node().getBoundingClientRect();
      var grid_left = grid_pos.left;
      var grid_top = grid_pos.top;

      var left = grid_left + col_pos + margin + (xRange.bandwidth() / 4) - (tip_width / 2);
      var top = grid_top + row_pos + margin + (yRange.bandwidth() / 1.5) - (tip_height / 2);

      d3.select(".tip")
          .style("display", "block")
          .html(d.correlation.toFixed(2))
          .style("left", left + "px")
          .style("top", top + "px");

      d3.select(".xAxis.correlAxis .tick:nth-of-type(" + d.column + ") text").classed("selected", true);
      d3.select(".yAxis.correlAxis .tick:nth-of-type(" + d.row + ") text").classed("selected", true);
      d3.select(".xAxis.correlAxis .tick:nth-of-type(" + d.column + ") line").classed("selected", true);
      d3.select(".yAxis.correlAxis .tick:nth-of-type(" + d.row + ") line").classed("selected", true);

    })

    .on("mouseout", function(){
      d3.selectAll("rect").classed("selected", false);
      d3.select(".tip").style("display", "none");
      d3.selectAll(".correlAxis .tick text").classed("selected", false);
      d3.selectAll(".correlAxis .tick line").classed("selected", false);
    });

  weAllGoodCorrel();
}

function weAllGoodCorrel() {
  $("#corre").removeClass("disabled");
}
