var histoList = ["comments", "duration", "languages", "inspiringRating", "publishDate", "views", "funnyRating", "confusingRating", "informativeRating", "unconvincingRating"];
var defaultHisto = "#histolanguages";
var remoteMode = false;
//////////////////////////////////////////////////////////////////////////////

function startEmHisto(svg, svgSize, tedData) {
  $("#histo").addClass("disabled");
  $("#utilities").html(" ");

  if (window.location.hash) {
    var hash = window.location.hash;
    var category = hash.substring(6);

    if (hash.includes("#histo") && hash != "#histo" && histoList.indexOf(category) > -1) {
      if (category == "publishDate") {
        drawHistoData(svg, svgSize, tedData.data, category, 5, false, false);
      } else {
        drawHistoData(svg, svgSize, tedData.data, category, 20, false, false);
      }
    } else {
      window.location.hash = defaultHisto;
    }

  } else {
    window.location.hash = defaultHisto;
  }

}

//////////////////////////////////////////////////////////////////////////////

function drawHistoData(svg, svgSize, data, category, ticks, remote, timeline) {
  remoteMode = remote;
  switch (category) {
    case "comments":

      var xScale = d3.scaleLinear()
        .rangeRound([0, svgSize.width])
        .domain([d3.min(data, function(d) {
          return d.comments;
        }), d3.max(data, function(d) {
          return d.comments;
        })]);

      var histogram = d3.histogram()
        .value(function(d) {
          return d.comments;
        })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticks));

      var xLabel = "Comments";

      break;

    case "duration":

      var xScale = d3.scaleLinear()
        .rangeRound([0, svgSize.width])
        .domain([d3.min(data, function(d) {
          return d.duration;
        }), d3.max(data, function(d) {
          return d.duration;
        })]);

      var histogram = d3.histogram()
        .value(function(d) {
          return d.duration;
        })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticks));

      var xLabel = "Duration";

      break;

    case "languages":

      var xScale = d3.scaleLinear()
        .rangeRound([0, svgSize.width])
        .domain([d3.min(data, function(d) {
          return d.languages;
        }), d3.max(data, function(d) {
          return d.languages;
        })]);

      var histogram = d3.histogram()
        .value(function(d) {
          return d.languages;
        })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticks));

      var xLabel = "Languages";

      break;

    case "inspiringRating":

      var xScale = d3.scaleLinear()
        .rangeRound([0, svgSize.width])
        .domain([d3.min(data, function(d) {
          return d.inspiring;
        }), d3.max(data, function(d) {
          return d.inspiring;
        })]);

      var histogram = d3.histogram()
        .value(function(d) {
          return d.inspiring;
        })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticks));

      var xLabel = "Inspiring Rating Percentage";

      break;

    case "publishDate":

      var xScale = d3.scaleTime()
        .rangeRound([0, svgSize.width])
        .domain([d3.min(data, function(d) {
          return d.published_date;
        }), d3.max(data, function(d) {
          return d.published_date;
        })]);

      var histogram = d3.histogram()
        .value(function(d) {
          return d.published_date;
        })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticks));

      var xLabel = "Published Date";

      break;

    case "views":

      var xScale = d3.scaleLinear()
        .rangeRound([0, svgSize.width])
        .domain([d3.min(data, function(d) {
          return d.views;
        }), d3.max(data, function(d) {
          return d.views;
        })]);

      var histogram = d3.histogram()
        .value(function(d) {
          return d.views;
        })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticks));

      var xLabel = "Views";

      break;

    case "funnyRating":

      var xScale = d3.scaleLinear()
        .rangeRound([0, svgSize.width])
        .domain([d3.min(data, function(d) {
          return d.funny;
        }), d3.max(data, function(d) {
          return d.funny;
        })]);

      var histogram = d3.histogram()
        .value(function(d) {
          return d.funny;
        })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticks));

      var xLabel = "Funny Rating Percentage";

      break;

    case "confusingRating":

      var xScale = d3.scaleLinear()
        .rangeRound([0, svgSize.width])
        .domain([d3.min(data, function(d) {
          return d.confusing;
        }), d3.max(data, function(d) {
          return d.confusing;
        })]);

      var histogram = d3.histogram()
        .value(function(d) {
          return d.confusing;
        })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticks));

      var xLabel = "Confusing Rating Percentage";

      break;

    case "informativeRating":

      var xScale = d3.scaleLinear()
        .rangeRound([0, svgSize.width])
        .domain([d3.min(data, function(d) {
          return d.informative;
        }), d3.max(data, function(d) {
          return d.informative;
        })]);

      var histogram = d3.histogram()
        .value(function(d) {
          return d.informative;
        })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticks));

      var xLabel = "Informative Rating Percentage";

      break;

    case "unconvincingRating":

      var xScale = d3.scaleLinear()
        .rangeRound([0, svgSize.width])
        .domain([d3.min(data, function(d) {
          return d.unconvincing;
        }), d3.max(data, function(d) {
          return d.unconvincing;
        })]);

      var histogram = d3.histogram()
        .value(function(d) {
          return d.unconvincing;
        })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticks));

      var xLabel = "Unconvincing Rating Percentage";

      break;
  }

  var yScale = d3.scaleLinear()
    .range([svgSize.height, 0]);

  var bins = histogram(data);

  yScale.domain([0, d3.max(bins, function(d) {
    return d.length;
  })]);

  if (timeline == false) {
    svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("class", "bar dataFilter")
      .attr("x", function(d) {
        return xScale(d.x0);
      })
      .attr("y", function(d) {
        return yScale(d.length);
      })
      .attr("width", function(d) {
        return xScale(d.x1) - xScale(d.x0) - 1;
      })
      .attr("height", function(d) {
        return svgSize.height - yScale(d.length);
      })
      .attr("fill", function() {
        return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
      })
      .on("mouseover", histoMouseover)
      .on('mouseout', histoMouseout)
      .on("click", histoMouseclick);
  } else {
    svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("class", "bar timeline")
      .attr("x", function(d) {
        return xScale(d.x0);
      })
      .attr("y", function(d) {
        return yScale(d.length);
      })
      .attr("width", function(d) {
        return xScale(d.x1) - xScale(d.x0) - 1;
      })
      .attr("height", function(d) {
        return svgSize.height - yScale(d.length);
      })
      .attr("fill", function() {
        return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
      })
      .on("mouseover", histoMouseover)
      .on('mouseout', histoMouseout)
      .on("click", histoMouseclick);

    svg.append("g")
      .attr("class", "brush")
      .call(d3.brushX()
        .extent([
          [0, 0],
          [svgSize.width, svgSize.height]
        ])
        .on("start",brushshow)
        .on("end", brushended));

    function brushshow(){
      $(".selection").css("opacity",0.3);
    }

    function brushended() {
      if (!d3.event.sourceEvent) return; // Only transition after input.
      if (!d3.event.selection) return; // Ignore empty selections.
      var d0 = d3.event.selection.map(xScale.invert),
        d1 = d0.map(d3.timeMonth.round);

      // If empty when rounded, use floor & ceil instead.
      if (d1[0] >= d1[1]) {
        d1[0] = d3.timeDay.floor(d0[0]);
        d1[1] = d3.timeDay.offset(d1[0]);
      }

      d3.select(this).transition().call(d3.event.target.move, d1.map(xScale));
      updateStats(d1[0],d1[1]);
    }
  }

  svg.selectAll("text")
    .data(bins)
    .enter()
    .append("text")
    .attr("id", function(d, i) {
      return ("histoTick" + i);
    })
    .text(function(d) {
      return d.length;
    })
    .attr("x", function(d, i) {
      return (xScale(d.x0) + (((xScale(d.x1) - xScale(d.x0)) * 1.5) / 2));
    })
    .attr("y", function(d, i) {
      return (yScale(d.length) * 1.05);
    })
    .style("text-anchor", "middle")
    .attr("dy", "-2em")
    .attr("fill", "#ffffffff")
    .style('opacity', '0.0');

  if (timeline == false) {
    // add the x Axis
    svg.append("g")
      .attr("transform", "translate(0," + (svgSize.height) + ")")
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "start")
      .attr("dx", ".8em")
      .attr("dy", "-.15em")
      .attr("transform", "rotate(55)");
  } else {
    // add the x Axis
    svg.append("g")
      .attr("transform", "translate(0," + (svgSize.height) + ")")
      .call(d3.axisBottom(xScale)
        .ticks(d3.timeMonth)
        .tickPadding(0))
      .selectAll("text")
      .style("text-anchor", "start")
      .attr("dx", ".8em")
      .attr("dy", "-.15em")
      .attr("transform", "rotate(55)");
  }

  // add the y Axis
  svg.append("g")
    .call(d3.axisLeft(yScale))

  // text label for the y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - (svgSize.margin.left / 1.75))
    .attr("x", 0 - (svgSize.height / 2))
    .text("# of Ted Talks");

  // text label for the x axis
  svg.append("text")
    .attr("x", (svgSize.width / 2))
    .attr("y", (svgSize.height + (svgSize.margin.top / 1.75)))
    .style("text-anchor", "middle")
    .text(xLabel);

  weAllGoodHisto();
}

function histoMouseover(d, i) {
  if (remoteMode == false) {
    var shiftX = (d3.select(this).attr("width") * 1.5) - (d3.select(this).attr("width"));
    var shiftY = (d3.select(this).attr("height") * 1.05) - (d3.select(this).attr("height"));

    d3.select("#histoTick" + i).style('opacity', '1.0');

    var curr = i;

    d3.selectAll(".bar")
      .filter(function(d, i) {
        return i > curr;
      })
      .attr("transform", 'translate(' + shiftX + ',0)');

    d3.select(this)
      .attr("width", function(d) {
        return (d3.select(this).attr("width") * 1.5);
      })
      .attr("height", function(d) {
        return (d3.select(this).attr("height") * 1.05);
      })
      .attr("transform", 'translate(0,-' + shiftY + ')');
  }
}

function histoMouseout(d, i) {
  if (remoteMode == false) {
    var shift = (d3.select(this).attr("width")) - (d3.select(this).attr("width") / 1.5);

    d3.select("#histoTick" + i).style('opacity', '0.0');

    var curr = i;

    d3.selectAll(".bar")
      .filter(function(d, i) {
        return i > curr;
      })
      .attr("transform", 'translate(0,0)');

    d3.select(this)
      .attr("width", function(d) {
        return (d3.select(this).attr("width") / 1.5);
      })
      .attr("height", function(d) {
        return (d3.select(this).attr("height") / 1.05);
      })
      .attr("transform", 'translate(0,0)');
  }
}

function histoMouseclick() {
  if (remoteMode == false) {
    var hash = window.location.hash;
    var category = hash.substring(6);

    var index = histoList.indexOf(category);

    if (index == histoList.length - 1) {
      index = 0;
    } else {
      index++;
    }

    window.location.hash = "#histo" + histoList[index];
  }
}

function weAllGoodHisto() {
  $("#histo").removeClass("disabled");
}
