var cols = ["inspiring", "informative", "funny", "views", "comments", "languages", "duration", "published_date", "confusing", "unconvincing"];
//////////////////////////////////////////////////////////////////////////////

function startEmMdsat(svg, svgSize, tedData) {
  var redirect = "#mdsat";

  $("#mdsat").addClass("disabled");
  $("#utilities").html(" ");

  if (window.location.hash) {

    var hash = window.location.hash;
    if (hash == redirect) {
      drawMdsat(svg, svgSize, tedData.data, window.location.hash);
    } else {
      window.location.hash = redirect;
    }

  } else {
    window.location.hash = redirect;
  }

}

//////////////////////////////////////////////////////////////////////////////

function drawMdsat(svg, svgSize, data, category) {
  var margin = svgSize.margin;
  var width = svgSize.width;
  var height = svgSize.height;

  weAllGoodMdsat();
}

function weAllGoodMdsat() {
  $("#mdsat").removeClass("disabled");
}
