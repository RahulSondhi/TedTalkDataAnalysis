var cols = ["inspiring", "informative", "funny", "views", "comments", "languages", "duration", "published_date", "confusing", "unconvincing"];
//////////////////////////////////////////////////////////////////////////////

function startEmPcapl(svg, svgSize, tedData) {
  var redirect = "#pcapl";

  $("#pcapl").addClass("disabled");
  $("#utilities").html(" ");

  if (window.location.hash){

    var hash = window.location.hash;
    if (hash == redirect) {
      drawPcapl(svg, svgSize, JSON.parse(JSON.stringify(tedData.data)), window.location.hash);
    } else {
      window.location.hash = redirect;
    }

  } else {
    window.location.hash = redirect;
  }

}

//////////////////////////////////////////////////////////////////////////////

async function drawPcapl(svg, svgSize, data, category) {
  var margin = svgSize.margin;
  var width = svgSize.width;
  var height = svgSize.height;

  data.forEach(function(v){
    var keys = Object.keys(v);
    keys.forEach(function(x){
      if(!cols.includes(x) && x != "title"){
        delete v[x];
      }
    });
  });

  var csv = Papa.unparse(data);

  await initPCA(csv,svg);

  weAllGoodPcapl();
}

//////////////////////////////////////////////////////////////////////////////

async function initPCA(csv,svg) {
  $.ajax({
    type: "GET",
    url: "/pca",
    data: {'data':csv},
    success: async function(data) {

      var imgs = svg.selectAll("image").data([0]);
                imgs.enter()
                .append("svg:image")
                .attr("xlink:href", data)
                .attr("x", "50")
                .attr("y", "50")
                .attr("width", "500")
                .attr("height", "500");

    }
  })
}

function weAllGoodPcapl() {
  $("#pcapl").removeClass("disabled");
}
