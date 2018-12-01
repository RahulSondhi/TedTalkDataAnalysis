function startEmDashb(tedData) {
  var redirect = "#dashb";

  $("#mdsda").addClass("disabled");
  $("#visualization").html(" ");
  $("#utilities").html(" ");

  if (window.location.hash) {

    var hash = window.location.hash;
    if (hash == redirect) {
      drawDashb(tedData.data);
    } else {
      window.location.hash = redirect;
    }

  } else {
    window.location.hash = redirect;
  }

}

//////////////////////////////////////////////////////////////////////////////
var statsdata;
var currentY;
var currentX;
var curticksX = 20;
var curticksY = 20;
var currsvgSize;

function drawDashb(data) {

  var xAxisHisto = $('<div id="xAxisHisto" class="histoContainer"></div>');
  var yAxisHisto = $('<div id="yAxisHisto" class="histoContainer"></div>');
  var correl = $('<div id="correlDash" class="correlContainer"></div>');
  var biSca = $('<div id="biScaDash" class="biscaContainer"></div>');
  var timeline = $('<div id="biScaTimeline" class="biscaContainer"></div>');

  var row0 = $('<div id="row0" class="rowContainer"></div>');
  var row1 = $('<div id="row1" class="rowContainer"></div>');
  var row2 = $('<div id="row2" class="rowContainer"></div>');

  row0.append(timeline);
  row1.append(correl);
  row1.append(xAxisHisto);
  row2.append(yAxisHisto);
  row2.append(biSca);

  $("#dashboard").append(row0);
  $("#dashboard").append(row1);
  $("#dashboard").append(row2);

  var marginT = {
    top: 70,
    right: 70,
    bottom: 70,
    left: 70
  };
  var widthT = 1160;
  var heightT = 500;
  var svgSizeT = {
    width: widthT,
    height: heightT,
    margin: marginT
  }

  var margin = {
    top: 70,
    right: 70,
    bottom: 70,
    left: 70
  };
  var width = 500;
  var height = 500;
  var svgSize = {
    width: width,
    height: height,
    margin: margin
  }

  currsvgSize = svgSize;

  var svgX = d3.select("#xAxisHisto").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "visualizationSVG")
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var svgY = d3.select("#yAxisHisto").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "visualizationSVG")
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var svgC = d3.select("#correlDash").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "visualizationSVG")
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var svgB = d3.select("#biScaDash").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "visualizationSVG")
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var svgT = d3.select("#biScaTimeline").append("svg")
    .attr("width", widthT + marginT.left + marginT.right)
    .attr("height", heightT + marginT.top + marginT.bottom)
    .attr("id", "visualizationSVG")
    .append("g")
    .attr("transform",
      "translate(" + marginT.left + "," + marginT.top + ")");

  currentY = "views";
  currentX = "languages";

  drawHistoData(svgT, svgSizeT, data, "publishDate", 20, true, true);
  drawHistoData(svgX, svgSize, data, "languages", 20, true, false);
  drawHistoData(svgY, svgSize, data, "views", 20, true, false);
  drawCorrel(svgC, svgSize, data);
  drawBiScaData(svgB, svgSize, data, "languages", "views", true);

  d3.selectAll(".correlRect")
    .on("click", function(d) {

      $("#yAxisHisto").html(" ");
      $("#xAxisHisto").html(" ");
      $("#biScaDash").html(" ");

      svgX = d3.select("#xAxisHisto").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "visualizationSVG")
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

      svgY = d3.select("#yAxisHisto").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "visualizationSVG")
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

      svgB = d3.select("#biScaDash").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "visualizationSVG")
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

      var columnX = d.column_x;
      var columnY = d.column_y;
      var ticksX = 20;
      var ticksY = 20;

      if (columnX == "published_date") {
        ticksX = 5;
        columnX = "publishDate";
      } else if (columnX == "inspiring") {
        columnX = "inspiringRating";
      } else if (columnX == "funny") {
        columnX = "funnyRating";
      } else if (columnX == "confusing") {
        columnX = "confusingRating";
      } else if (columnX == "informative") {
        columnX = "informativeRating";
      } else if (columnX == "unconvincing") {
        columnX = "unconvincingRating";
      } else {
        columnX = d.column_x;
      }

      if (columnY == "published_date") {
        ticksY = 5;
        columnY = "publishDate";
      } else if (columnY == "inspiring") {
        columnY = "inspiringRating";
      } else if (columnY == "funny") {
        columnY = "funnyRating";
      } else if (columnY == "confusing") {
        columnY = "confusingRating";
      } else if (columnY == "informative") {
        columnY = "informativeRating";
      } else if (columnY == "unconvincing") {
        columnY = "unconvincingRating";
      } else {
        columnY = d.column_y;
      }

      currentY = columnY;
      currentX = columnX;
      curticksX = ticksX;
      curticksY = ticksY;

      drawHistoData(svgX, svgSize, data, columnX, ticksX, true, false);
      drawHistoData(svgY, svgSize, data, columnY, ticksY, true, false);
      drawBiScaData(svgB, svgSize, data, columnX, columnY, true);
    })

  statsdata = data;

  weAllGoodDashb();
}

function updateStats(start, end) {
  var width = currsvgSize.width;
  var height = currsvgSize.height;
  var margin = currsvgSize.margin;

  $("#yAxisHisto").html(" ");
  $("#xAxisHisto").html(" ");
  $("#biScaDash").html(" ");

  var svgX = d3.select("#xAxisHisto").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "visualizationSVG")
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var svgY = d3.select("#yAxisHisto").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "visualizationSVG")
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var svgB = d3.select("#biScaDash").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "visualizationSVG")
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var data = [];

  for (var i = 0; i < statsdata.length; i++) {
    if(statsdata[i].published_date >= start && statsdata[i].published_date <= end){
      data.push(statsdata[i]);
    }
  }


  drawHistoData(svgX, currsvgSize, data, currentX, curticksX, true, false);
  drawHistoData(svgY, currsvgSize, data, currentY, curticksY, true, false);
  drawBiScaData(svgB, currsvgSize, data, currentX, currentY, true);
}

function weAllGoodDashb() {
  $("#mdsda").removeClass("disabled");
}
