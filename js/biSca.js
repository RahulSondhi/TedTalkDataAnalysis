var BiScaList = ["comments", "duration", "languages", "inspiringRating", "publishDate", "views", "funnyRating", "confusingRating", "informativeRating", "unconvincingRating"];
var defaultBiSca = "#biScacomments-views";
//////////////////////////////////////////////////////////////////////////////

function startEmBiSca(svg, svgSize, tedData) {
  $("#biSca").addClass("disabled");

  if (window.location.hash) {

    makeABiScaDropdown();
    var hash = window.location.hash;
    if (hash.includes("#biSca") && hash != "#biSca") {
      drawBiScaData(svg, svgSize, tedData.data, window.location.hash);
    } else {
      window.location.hash = defaultBiSca;
    }

  } else {
    window.location.hash = defaultBiSca;
  }

}

function makeABiScaDropdown() {
  var xAxis = $('<div id="xAxisChoice" class="dropdown"></div>');
  var yAxis = $('<div id="yAxisChoice" class="dropdown"></div>');

  var dropdownButtonX = $('<button id="xAxisButton" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"></button>');
  var dropdownButtonY = $('<button id="yAxisButton" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"></button>');

  dropdownButtonX.html("X-Axis Var");
  xAxis.append(dropdownButtonX);
  dropdownButtonY.html("Y-Axis Var");
  yAxis.append(dropdownButtonY);

  var dropdownMenuListX = $('<div id="xAxisMenu" class="dropdown-menu"></div>');
  var dropdownMenuListY = $('<div id="yAxisMenu" class="dropdown-menu"></div>');

  for (var i = 0; i < BiScaList.length; i++) {
    dropdownMenuListX.append($('<a class="dropdown-item" id="xChoice' + i + '" onclick="selectCategories(' + "'" + 'xChoice' + i + "'" + ',' + i + ')">' + BiScaList[i] + '</a>'));
    dropdownMenuListY.append($('<a class="dropdown-item" id="yChoice' + i + '" onclick="selectCategories(' + "'" + 'yChoice' + i + "'" + ',' + i + ')">' + BiScaList[i] + '</a>'));
  }

  xAxis.append(dropdownMenuListX);
  yAxis.append(dropdownMenuListY);

  $("#utilities").html(" ");

  var xContainer = $('<div id="xAxisContainer"><div id="xAxisContainerText">X-Axis</div></div>');
  xContainer.append(xAxis);

  var yContainer = $('<div id="yAxisContainer"><div id="yAxisContainerText">Y-Axis</div></div>');
  yContainer.append(yAxis);

  $("#utilities").append(xContainer);
  $("#utilities").append(yContainer);
}

function selectCategories(id, num) {

  var check = "" + id + "";

  if (check.includes("xChoice")) {
    $("#xAxisMenu a").each(function(index) {
      $(this).removeClass("active");
    })

    $("#" + id + "").addClass("active");
    $("#xAxisButton").html(BiScaList[num]);

  } else if (check.includes("yChoice")) {
    $("#yAxisMenu a").each(function(index) {
      $(this).removeClass("active");
    })

    $("#" + id + "").addClass("active");
    $("#yAxisButton").html(BiScaList[num]);

  }

  window.location.hash = "#biSca" + $("#xAxisButton").html() + "-" + $("#yAxisButton").html();

}

//////////////////////////////////////////////////////////////////////////////

function drawBiScaData(svg, svgSize, data, category) {

  var categoryList = (category.substring(6)).split("-");

  var categoryX = categoryList[0];
  var categoryY = categoryList[1];



  if (categoryList.length > 2 && (BiScaList.indexOf(categoryX) > -1) && (BiScaList.indexOf(categoryY) > -1)) {
    window.location.hash = defaultBiSca;
  } else {
    $("#xChoice" + BiScaList.indexOf(categoryX) + "").addClass("active");
    $("#yChoice" + BiScaList.indexOf(categoryY) + "").addClass("active");
    $("#xAxisButton").html(categoryX);
    $("#yAxisButton").html(categoryY);
  }

  svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 5)
    .attr("fill", function() {
      return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    });

  switch (categoryX) {
    case "comments":

      var xScale = d3.scaleLinear()
        .range([0, svgSize.width])
        .domain([0, d3.max(data, function(d) {
          return d.comments;
        })]);

      var xLabel = "Comments";

      svg.selectAll(".dot")
        .attr("cx", function(d) {
          return xScale(d.comments);
        });

      break;
    case "duration":

      var xScale = d3.scaleLinear()
        .range([0, svgSize.width])
        .domain([0, d3.max(data, function(d) {
          return d.duration;
        })]);

      var xLabel = "Duration";

      svg.selectAll(".dot")
        .attr("cx", function(d) {
          return xScale(d.duration);
        });

      break;
    case "languages":

      var xScale = d3.scaleLinear()
        .range([0, svgSize.width])
        .domain([0, d3.max(data, function(d) {
          return d.languages;
        })]);

      var xLabel = "# of Languages";

      svg.selectAll(".dot")
        .attr("cx", function(d) {
          return xScale(d.languages);
        });

      break;
      case "inspiringRating":
        var xScale = d3.scaleLinear()
          .range([0, svgSize.width])
          .domain([0, d3.max(data, function(d) {
            return d.inspiring;
          })]);

        var xLabel = "Inspiring Rating Percentage";

        svg.selectAll(".dot")
          .attr("cx", function(d) {
            return xScale(d.inspiring);
          });

        break;
    case "publishDate":

      var xScale = d3.scaleLinear()
        .range([0, svgSize.width])
        .domain([0, d3.max(data, function(d) {
          return d.published_date;
        })]);

      var xLabel = "Published Date";

      svg.selectAll(".dot")
        .attr("cx", function(d) {
          return xScale(d.published_date);
        });

      break;
    case "views":

      var xScale = d3.scaleLinear()
        .range([0, svgSize.width])
        .domain([0, d3.max(data, function(d) {
          return d.views;
        })]);

      var xLabel = "Views";

      svg.selectAll(".dot")
        .attr("cx", function(d) {
          return xScale(d.views);
        });

      break;

    case "funnyRating":
      var xScale = d3.scaleLinear()
        .range([0, svgSize.width])
        .domain([0, d3.max(data, function(d) {
          return d.funny;
        })]);

      var xLabel = "Funny Rating Percentage";

      svg.selectAll(".dot")
        .attr("cx", function(d) {
          return xScale(d.funny);
        });

      break;
    case "confusingRating":
      var xScale = d3.scaleLinear()
        .range([0, svgSize.width])
        .domain([0, d3.max(data, function(d) {
          return d.confusing;
        })]);

      var xLabel = "Confusing Rating Percentage";

      svg.selectAll(".dot")
        .attr("cx", function(d) {
          return xScale(d.confusing);
        });

      break;
    case "informativeRating":
      var xScale = d3.scaleLinear()
        .range([0, svgSize.width])
        .domain([0, d3.max(data, function(d) {
          return d.informative;
        })]);

      var xLabel = "Informative Rating Percentage";

      svg.selectAll(".dot")
        .attr("cx", function(d) {
          return xScale(d.informative);
        });

      break;
    case "unconvincingRating":
      var xScale = d3.scaleLinear()
        .range([0, svgSize.width])
        .domain([0, d3.max(data, function(d) {
          return d.unconvincing;
        })]);

      var xLabel = "Unconvincing Rating Percentage";

      svg.selectAll(".dot")
        .attr("cx", function(d) {
          return xScale(d.unconvincing);
        });

      break;

  }

  switch (categoryY) {
    case "comments":

      var yScale = d3.scaleLinear()
        .range([svgSize.height, 0])
        .domain([0, d3.max(data, function(d) {
          return d.comments;
        })]);

      var yLabel = "Comments";

      svg.selectAll(".dot")
        .attr("cy", function(d) {
          return yScale(d.comments);
        });

      break;
    case "duration":

      var yScale = d3.scaleLinear()
        .range([svgSize.height, 0])
        .domain([0, d3.max(data, function(d) {
          return d.duration;
        })]);

      var yLabel = "Duration";

      svg.selectAll(".dot")
        .attr("cy", function(d) {
          return yScale(d.duration);
        });

      break;
    case "languages":

      var yScale = d3.scaleLinear()
        .range([svgSize.height, 0])
        .domain([0, d3.max(data, function(d) {
          return d.languages;
        })]);

      var yLabel = "# of Languages";

      svg.selectAll(".dot")
        .attr("cy", function(d) {
          return yScale(d.languages);
        });

      break;
      case "inspiringRating":
        var yScale = d3.scaleLinear()
          .range([svgSize.height, 0])
          .domain([0, d3.max(data, function(d) {
            return d.inspiring;
          })]);

        var yLabel = "Inspiring Rating Percentage";

        svg.selectAll(".dot")
          .attr("cy", function(d) {
            return yScale(d.inspiring);
          });

        break;
    case "publishDate":

      var yScale = d3.scaleLinear()
        .range([svgSize.height, 0])
        .domain([0, d3.max(data, function(d) {
          return d.published_date;
        })]);

      var yLabel = "Published Date";

      svg.selectAll(".dot")
        .attr("cy", function(d) {
          return yScale(d.published_date);
        });

      break;

    case "views":

      var yScale = d3.scaleLinear()
        .range([svgSize.height, 0])
        .domain([0, d3.max(data, function(d) {
          return d.views;
        })]);

      var yLabel = "Views";

      svg.selectAll(".dot")
        .attr("cy", function(d) {
          return yScale(d.views);
        });

      break;
    case "funnyRating":
      var yScale = d3.scaleLinear()
        .range([svgSize.height, 0])
        .domain([0, d3.max(data, function(d) {
          return d.funny;
        })]);

      var yLabel = "Funny Rating Percentage";

      svg.selectAll(".dot")
        .attr("cy", function(d) {
          return yScale(d.funny);
        });
      break;

    case "confusingRating":
      var yScale = d3.scaleLinear()
        .range([svgSize.height, 0])
        .domain([0, d3.max(data, function(d) {
          return d.confusing;
        })]);

      var yLabel = "Confusing Rating Percentage";

      svg.selectAll(".dot")
        .attr("cy", function(d) {
          return yScale(d.confusing);
        });
      break;

    case "informativeRating":
      var yScale = d3.scaleLinear()
        .range([svgSize.height, 0])
        .domain([0, d3.max(data, function(d) {
          return d.informative;
        })]);

      var yLabel = "Informative Rating Percentage";

      svg.selectAll(".dot")
        .attr("cy", function(d) {
          return yScale(d.informative);
        });
      break;

    case "unconvincingRating":
      var yScale = d3.scaleLinear()
        .range([svgSize.height, 0])
        .domain([0, d3.max(data, function(d) {
          return d.unconvincing;
        })]);

      var yLabel = "Unconvincing Rating Percentage";

      svg.selectAll(".dot")
        .attr("cy", function(d) {
          return yScale(d.unconvincing);
        });
      break;

  }

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
    .attr("y", 0 - (svgSize.margin.left / 1.75))
    .attr("x", 0 - (svgSize.height / 2))
    .text(yLabel);

  // text label for the x axis
  svg.append("text")
    .attr("x", (svgSize.width / 2))
    .attr("y", (svgSize.height + (svgSize.margin.top / 1.75)))
    .style("text-anchor", "middle")
    .text(xLabel);

  weAllGoodBiSca();
}

function weAllGoodBiSca() {
  $("#biSca").removeClass("disabled");
}
