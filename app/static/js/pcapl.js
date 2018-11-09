var cols = ["inspiring", "informative", "funny", "views", "comments", "languages", "duration", "published_date", "confusing", "unconvincing"];
//////////////////////////////////////////////////////////////////////////////

function startEmPacod(svg, svgSize, tedData) {
  var redirect = "#pcapl";

  $("#pcapl").addClass("disabled");
  $("#utilities").html(" ");

  if (window.location.hash) {

    var hash = window.location.hash;
    if (hash == redirect) {
      drawPcapl(svg, svgSize, tedData.data, window.location.hash);
    } else {
      window.location.hash = redirect;
    }

  } else {
    window.location.hash = redirect;
  }

}

//////////////////////////////////////////////////////////////////////////////

function drawPcapl(svg, svgSize, data, category) {
  var margin = svgSize.margin;
  var width = svgSize.width;
  var height = svgSize.height;

  weAllGoodPcapl();
}

function weAllGoodPcapl() {
  $("#pcapl").removeClass("disabled");
}
