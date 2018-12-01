var dataCols = ["comments", "duration", "languages", "views", "inspiring", "funny", "confusing", "informative", "unconvincing"];

//////////////////////////////////////////////////////////////////////////////

async function startEmCorrel(svg, svgSize, tedData) {
  $("#corre").addClass("disabled");
  $("#utilities").html(" ");

  if (window.location.hash) {

    var hash = window.location.hash;
    if (hash == "#corre") {
      var data = jQuery.extend(true, {}, JSON.parse(JSON.stringify(tedData.data)));
      drawCorrel(svg, svgSize, data);
    } else {
      window.location.hash = "#corre";
    }
  } else {
    window.location.hash = "#corre";
  }

}

//////////////////////////////////////////////////////////////////////////////

function drawCorrel(svg, svgSize, data) {
  d3.select("#visualization").append("div").attr("class", "tip").style("display", "none");

  var correlationMatrix = jz.arr.correlationMatrix(data, dataCols);
  var extent = d3.extent(correlationMatrix.map(function(d) {
    return d.correlation;
  }).filter(function(d) {
    return d !== 1;
  }));

  var grid = data2grid.grid(correlationMatrix);
  var rows = d3.max(grid, function(d) {
    return d.row;
  });

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

  var chromaticRange = chroma.scale(["tomato", "white", "steelblue"])
    .domain([extent[0], 0, extent[1]]);

  var xAxis = d3.axisTop(yRange).tickFormat(function(d, i) {
    return dataCols[i];
  });
  var yAxis = d3.axisLeft(xRange).tickFormat(function(d, i) {
    return dataCols[i];
  });

  svg.append("g")
    .attr("class", "xAxis correlAxis")
    .call(xAxis);

  svg.append("g")
    .attr("class", "yAxis correlAxis")
    .call(yAxis);

  svg.selectAll("rect")
    .data(grid, function(d) {
      return d.column_a + d.column_b;
    })
    .enter().append("rect")
    .attr("class", "correlRect")
    .attr("x", function(d) {
      return xRange(d.column);
    })
    .attr("y", function(d) {
      return yRange(d.row);
    })
    .attr("width", xRange.bandwidth())
    .attr("height", yRange.bandwidth())
    .style("fill", function(d) {
      return chromaticRange(d.correlation);
    })
    .style("opacity", 1e-6)
    .transition()
    .style("opacity", 1);


  d3.selectAll(".correlRect")
    .on("mouseover", function(d) {

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
      var top = grid_top + row_pos + margin - (tip_height / 2);

      d3.select(".tip")
        .style("display", "block")
        .html(d.correlation.toFixed(2))
        .style("left", left + "px")
        .style("top", top + "px")
        .style("cursor", "none");


      d3.select(".xAxis.correlAxis .tick:nth-of-type(" + d.column + ") text").classed("selected", true);
      d3.select(".yAxis.correlAxis .tick:nth-of-type(" + d.row + ") text").classed("selected", true);
      d3.select(".xAxis.correlAxis .tick:nth-of-type(" + d.column + ") line").classed("selected", true);
      d3.select(".yAxis.correlAxis .tick:nth-of-type(" + d.row + ") line").classed("selected", true);

    })

    .on("mousemove" , function(d) {
      var x = d3.event.pageX + 15;
      var y = d3.event.pageY + 15;

      d3.select(".tip")
        .style("left", x + "px")
        .style("top", y + "px")
    })

    .on("mouseleave", function() {
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
