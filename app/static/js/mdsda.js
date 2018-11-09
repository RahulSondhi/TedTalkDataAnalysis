var cols = ["inspiring", "informative", "funny", "views", "comments", "languages", "duration", "published_date", "confusing", "unconvincing"];
//////////////////////////////////////////////////////////////////////////////

function startEmMdsda(svg, svgSize, tedData) {
  var redirect = "#mdsda";

  $("#mdsda").addClass("disabled");
  $("#utilities").html(" ");

  if (window.location.hash) {

    var hash = window.location.hash;
    if (hash == redirect) {
      drawMdsda(svg, svgSize, tedData.data, window.location.hash);
    } else {
      window.location.hash = redirect;
    }

  } else {
    window.location.hash = redirect;
  }

}

//////////////////////////////////////////////////////////////////////////////

function drawMdsda(svg, svgSize, data, category) {
  var margin = svgSize.margin;
  var width = svgSize.width;
  var height = svgSize.height;

  weAllGoodMdsda();
}

function weAllGoodMdsda() {
  $("#mdsda").removeClass("disabled");
}
