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

function startEmHisto(){
	$("#histo").addClass("disabled");
	$.ajax({
		type: "GET",
		url: "data/ted_main.csv",
		success: function(data) {
			var histoList = ["#histoLanguages","#histoDuration","#histoViews","#histoComments"];
			if(window.location.hash){
				if(histoList.indexOf(window.location.hash) > -1){
					initData(data,window.location.hash,20);
				}else{
					initData(data,"#histoLanguages",20);
				}
			}else{
				initData(data,"#histoLanguages",20);
			}
		}
	})
}

function weAllGood(){
	$("#histo").removeClass("disabled");
}

//////////////////////////////////////////////////////////////////////////////

function initData(data,category,ticks) {
  var margin = {
    top: 50,
    right: 20,
    bottom: 100,
    left: 50
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

  processData(svg, svgSize, data, category,ticks);
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
      	})
			]);

			var histogram = d3.histogram()
				.value(function(d){return d.languages;})
				.domain(xScale.domain())
				.thresholds(xScale.ticks(ticks));

      break;

    case "#histoDuration":

		var xScale = d3.scaleLinear()
			.rangeRound([0, svgSize.width])
			.domain([d3.min(data, function(d) {
				return d.duration;
			}), d3.max(data, function(d) {
				return d.duration;
			})
		]);

		var histogram = d3.histogram()
			.value(function(d){return d.duration;})
			.domain(xScale.domain())
			.thresholds(xScale.ticks(ticks));

      break;

		case "#histoViews":

		var xScale = d3.scaleLinear()
			.rangeRound([0, svgSize.width])
			.domain([d3.min(data, function(d) {
				return d.views;
			}), d3.max(data, function(d) {
				return d.views;
			})
		]);

		var histogram = d3.histogram()
			.value(function(d){return d.views;})
			.domain(xScale.domain())
			.thresholds(xScale.ticks(ticks));

			break;

    case "#histoComments":

		var xScale = d3.scaleLinear()
			.rangeRound([0, svgSize.width])
			.domain([d3.min(data, function(d) {
				return d.comments;
			}), d3.max(data, function(d) {
				return d.comments;
			})
		]);

		var histogram = d3.histogram()
			.value(function(d){return d.comments;})
			.domain(xScale.domain())
			.thresholds(xScale.ticks(ticks));

      break;
  }

	var yScale = d3.scaleLinear()
		.range([svgSize.height, 0]);

	var bins = histogram(data);

	yScale.domain([0, d3.max(bins, function(d) { return d.length; })]);

	svg.selectAll("rect")
		.data(bins)
		.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("x", function(d) {return xScale(d.x0); })
		.attr("y", function(d) {return yScale(d.length); })
		.attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) -1 ; })
		.attr("height", function(d){ return svgSize.height - yScale(d.length);})
		.attr("fill", function() {return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);})
		.on("mouseover", mouseover)
		.on('mouseout',mouseout);

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

	weAllGood();
}

//////////////////////////////////////////////////////////////////////////////

function mouseover(data,index){

}

function mouseout(data,index){

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
