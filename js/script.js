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

  $.ajax({
    type: "GET",
    url: "data/ted_main.csv",
    success: function(data) {
      initData(data);
    }
  });

});

function initData(data) {
  var margin = {
    top: 0,
    right: 20,
    bottom: 100,
    left: 20
  };
  var width = 100000;
  var height = 700;
  var svgSize = {
    width: width,
    height: height,
    margin: margin
  }

  var svg = d3.select("#visualization").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  processData(svg, svgSize, data);
}

function processData(svg, svgSize, data) {
  var tedData = Papa.parse(data, config);

  for (var i = 0; i < tedData.data.length; i++) {
    var rating = eval(tedData.data[i].ratings);
    var talks = eval(tedData.data[i].related_talks);
    var tags = eval(tedData.data[i].tags);
    var languages = eval(tedData.data[i].languages);
    tedData.data[i].ratings = rating;
    tedData.data[i].related_talks = talks;
    tedData.data[i].tags = tags;
    tedData.data[i].languages = languages;
  }

  for (var x = 0; x < tedData.errors.length; x++) {
    tedData.data.pop();
  }

  drawData(svg, svgSize, tedData.data, "Languages");
}

function drawData(svg, svgSize, data, category) {

  switch (category) {
    case "Languages":

      var xScale = d3.scaleBand()
        .range([0, svgSize.width])
        .padding(0.1);

      var yScale = d3.scaleLinear()
        .range([svgSize.height, 0]);

      xScale.domain(data.map(function(d) {
        return d.title;
      }));

      yScale.domain([0, d3.max(data, function(d) {
        return d.languages;
      })]);

      svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          return xScale(d.title);
        })
        .attr("width", xScale.bandwidth())
        .attr("y", function(d) {
          return yScale(d.languages);
        })
        .attr("height", function(d) {
          return svgSize.height - yScale(d.languages);
        })
        .attr("fill", function() {
          return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        });

      break;

    case "Duration":

      break;

    case "Comments":

      break;

    case "Tags":

      break;

    case "NumSpeakers":

      break;

    case "SpeakerOccupation":

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
    .attr("transform", "rotate(65)");

  // add the y Axis
  svg.append("g")
    .call(d3.axisLeft(yScale));

}
