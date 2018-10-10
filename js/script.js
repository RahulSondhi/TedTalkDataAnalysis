var config = {
  delimiter: "", // auto-detect
  newline: "", // auto-detect
  quoteChar: '"',
  escapeChar: '"',
  header: true,
  trimHeaders: false,
  dynamicTyping: false,
  preview: 0,
  encoding: "",
  worker: false,
  comments: false,
  step: undefined,
  complete: undefined,
  error: undefined,
  download: false,
  skipEmptyLines: false,
  chunk: undefined,
  fastMode: undefined,
  beforeFirstChunk: undefined,
  withCredentials: undefined,
  transform: undefined
};

$(function() {

  $(window).bind('hashchange', function() {
    startEmHisto();
  })

  startEmHisto();

});

//////////////////////////////////////////////////////////////////////////////

function startEmHisto() {
  $("#histo").addClass("disabled");
  $.ajax({
    type: "GET",
    url: "data/ted_main.csv",
    success: function(data) {
      var histoList = ["#histoLanguages", "#histoDuration", "#histoViews", "#histoComments"];
      if (window.location.hash) {
        if (histoList.indexOf(window.location.hash) > -1) {
          initData(data, window.location.hash, 20);
        } else {
          initData(data, "#histoLanguages", 20);
        }
      } else {
        initData(data, "#histoLanguages", 20);
      }
    }
  })
}

function weAllGood() {
  $("#histo").removeClass("disabled");
}

//////////////////////////////////////////////////////////////////////////////

function initData(data, category, ticks) {
  var margin = {
    top: 80,
    right: 80,
    bottom: 80,
    left: 80
  };
  var width = 600;
  var height = 600;
  var svgSize = {
    width: width,
    height: height,
    margin: margin
  }
  $("#visualization").html(" ");
  var svg = d3.select("#visualization").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
		.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  processData(svg, svgSize, data, category, ticks);
}

//////////////////////////////////////////////////////////////////////////////

function processData(svg, svgSize, data, category, ticks) {
  var tedData = Papa.parse(data, config);

  for (var i = 0; i < tedData.data.length; i++) {
    tedData.data[i].ratings = eval(tedData.data[i].ratings);
    tedData.data[i].related_talks = eval(tedData.data[i].related_talks);
    tedData.data[i].tags = eval(tedData.data[i].tags);
    tedData.data[i].languages = eval(tedData.data[i].languages);
    tedData.data[i].views = eval(tedData.data[i].views);
    tedData.data[i].comments = eval(tedData.data[i].comments);
    tedData.data[i].duration = eval(tedData.data[i].duration);
  }

  for (var x = 0; x < tedData.errors.length; x++) {
    tedData.data.pop();
  }

  drawData(svg, svgSize, tedData.data, category, ticks);
}

//////////////////////////////////////////////////////////////////////////////

function drawData(svg, svgSize, data, category, ticks) {

  switch (category) {
    case "#histoLanguages":

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

    case "#histoDuration":

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

    case "#histoViews":

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

    case "#histoComments":

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
  }

  var yScale = d3.scaleLinear()
    .range([svgSize.height, 0]);

  var bins = histogram(data);

  yScale.domain([0, d3.max(bins, function(d) {
    return d.length;
  })]);

  svg.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("class", "bar")
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
    .on("mouseover", mouseover)
    .on('mouseout', mouseout);

  svg.selectAll("text")
    .data(bins)
    .enter()
    .append("text")
		.attr("id",function(d, i) {
      return ("histoTick"+i );
    })
    .text(function(d) {
      return d.length;
    })
    .attr("x", function(d, i) {
      return (xScale(d.x0) + ((xScale(d.x1) - xScale(d.x0))/2) );
    })
    .attr("y", function(d, i) {
      return (yScale(d.length));
    })
    .style("text-anchor", "middle")
		.attr("dy","-0.8em")
		.attr("fill","#ffffffff")
		.style('opacity','0.0');

  // add the x Axis
  svg.append("g")
    .attr("transform", "translate(0," + (svgSize.height) + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "start")
    .attr("dx", ".8em")
    .attr("dy", "-.15em")
    .attr("transform", "rotate(55)");

  // add the y Axis
  svg.append("g")
    .call(d3.axisLeft(yScale))

  // text label for the y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - (svgSize.margin.left/1.75))
    .attr("x", 0 - (svgSize.height / 2))
    .text("# of Ted Talks");

  // text label for the x axis
  svg.append("text")
    .attr("x",(svgSize.width / 2))
    .attr("y",(svgSize.height + (svgSize.margin.top/1.75) ))
    .style("text-anchor", "middle")
    .text(xLabel);

  weAllGood();
}

//////////////////////////////////////////////////////////////////////////////
function mouseover(d,i){
	d3.select("#histoTick"+i).style('opacity','1.0');
}

function mouseout(d,i){
	d3.select("#histoTick"+i).style('opacity','0.0');
}

function compareView(a, b) {
  const genreA = a.views;
  const genreB = b.views;

  let comparison = 0;
  if (genreA > genreB) {
    comparison = 1;
  } else if (genreA < genreB) {
    comparison = -1;
  }
  return comparison;
}
