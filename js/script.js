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
  $(window).bind('hashchange', initSite)

  initSite();
});


async function initSite() {
  $.ajax({
    type: "GET",
    url: "data/ted_main.csv",
    success: async function(data) {
      var hash = window.location.hash;
      var hashCategory = hash.substring(0, 6);

      var info = await initData(data);
      console.log(info)
      switch (hashCategory) {
        case "#histo":
          startEmHisto(info.svg, info.svgSize, info.data);
          break;

        case "#biSca":
          startEmBiSca(info.svg, info.svgSize, info.data);
          break;

        default:
          startEmHisto(info.svg, info.svgSize, info.data);
          break;
      }
    }
  })
}

//////////////////////////////////////////////////////////////////////////////

async function initData(data) {
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

  return await processData(svg, svgSize, data);
}

//////////////////////////////////////////////////////////////////////////////

async function processData(svg, svgSize, data) {
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

  var dataPacket = {
    svg: svg,
    svgSize: svgSize,
    data: tedData
  }
  return dataPacket;
}
