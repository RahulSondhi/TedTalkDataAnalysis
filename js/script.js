var config = {
	delimiter: "",	// auto-detect
	newline: "",	// auto-detect
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

function initData(data){
  var margin = {top: 50, right: 50, bottom: 50, left: 50};
  var width = 500 + margin.left + margin.right;
  var height = 500 + margin.top + margin.bottom;

	var x = d3.scaleBand()
		.range([0,width]);

	var y = d3.scaleLinear()
		.range([height,0]);

  var svg = d3.select("#visualization").append("svg")
    .attr("width",width)
    .attr("height",height)
    .append("g")
    .attr("transform",
          "translate("+margin.left+","+margin.top+")");

	processData(x,y,data);
}

function processData(x,y,data){
  var tedData = Papa.parse(data,config);

  for(var i = 0; i < tedData.data.length; i++){
    var rating = eval(tedData.data[i].ratings);
    var talks = eval(tedData.data[i].related_talks);
    var tags = eval(tedData.data[i].tags);
    tedData.data[i].ratings = rating;
    tedData.data[i].related_talks = talks;
    tedData.data[i].tags = tags;
  }

	console.log(tedData);
	drawData(x,y,data,"Languages")
}

function drawData(x,y,data,category){

	switch (category) {
		case "Languages":

			data.forEach(function(d){
				d.languages = +d.languages;
			});

			break;

		case "Duration":

			break;

		case "Views":

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

}
