var histoList = ["#histoLanguages", "#histoDuration", "#histoViews", "#histoComments"];

//////////////////////////////////////////////////////////////////////////////

function startEmHisto(svg, svgSize, tedData) {
  $("#histo").addClass("disabled");

      if (window.location.hash) {
        if (histoList.indexOf(window.location.hash) > -1) {
          drawHistoData(svg, svgSize, tedData.data, window.location.hash, 20);
        } else {
          window.location.hash = "#histoLanguages";
        }
      } else {
        window.location.hash = "#histoLanguages";
      }

}

//////////////////////////////////////////////////////////////////////////////

function drawHistoData(svg, svgSize, data, category, ticks) {

  switch (category) {
    case "#histoLanguages":

      var xScale = d3.scaleLinear()
        .rangeRound([0, svgSize.width])
        .domain([d3.min(data, function(d) {
          return d.languages;
        }), d3.max(data, function(d) {
          return d.languages;
        })]);

      var histogram = d3.histogram()
        .value(function(d) {
          return d.languages;
        })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticks));

			var xLabel = "Languages";

      break;

    case "#histoDuration":

      var xScale = d3.scaleLinear()
        .rangeRound([0, svgSize.width])
        .domain([d3.min(data, function(d) {
          return d.duration;
        }), d3.max(data, function(d) {
          return d.duration;
        })]);

      var histogram = d3.histogram()
        .value(function(d) {
          return d.duration;
        })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticks));

			var xLabel = "Duration";

      break;

    case "#histoViews":

      var xScale = d3.scaleLinear()
        .rangeRound([0, svgSize.width])
        .domain([d3.min(data, function(d) {
          return d.views;
        }), d3.max(data, function(d) {
          return d.views;
        })]);

      var histogram = d3.histogram()
        .value(function(d) {
          return d.views;
        })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticks));

			var xLabel = "Views";

      break;

    case "#histoComments":

      var xScale = d3.scaleLinear()
        .rangeRound([0, svgSize.width])
        .domain([d3.min(data, function(d) {
          return d.comments;
        }), d3.max(data, function(d) {
          return d.comments;
        })]);

      var histogram = d3.histogram()
        .value(function(d) {
          return d.comments;
        })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticks));

			var xLabel = "Comments";

      break;
  }

  var yScale = d3.scaleLinear()
    .range([svgSize.height, 0]);

  var bins = histogram(data);

  yScale.domain([0, d3.max(bins, function(d) {
    return d.length;
  })]);

  svg.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) {
      return xScale(d.x0);
    })
    .attr("y", function(d) {
      return yScale(d.length);
    })
    .attr("width", function(d) {
      return xScale(d.x1) - xScale(d.x0) - 1;
    })
    .attr("height", function(d) {
      return svgSize.height - yScale(d.length);
    })
    .attr("fill", function() {
      return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    })
    .on("mouseover", histoMouseover)
    .on('mouseout', histoMouseout)
		.on("click", histoMouseclick);

  svg.selectAll("text")
    .data(bins)
    .enter()
    .append("text")
		.attr("id",function(d, i) {
      return ("histoTick"+i );
    })
    .text(function(d) {
      return d.length;
    })
    .attr("x", function(d, i) {
      return (xScale(d.x0) + (( (xScale(d.x1) - xScale(d.x0))*1.5 )/2) );
    })
    .attr("y", function(d, i) {
      return (yScale(d.length)*1.05);
    })
    .style("text-anchor", "middle")
		.attr("dy","-2em")
		.attr("fill","#ffffffff")
		.style('opacity','0.0');

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
    .attr("y", 0 - (svgSize.margin.left/1.75))
    .attr("x", 0 - (svgSize.height / 2))
    .text("# of Ted Talks");

  // text label for the x axis
  svg.append("text")
    .attr("x",(svgSize.width / 2))
    .attr("y",(svgSize.height + (svgSize.margin.top/1.75) ))
    .style("text-anchor", "middle")
    .text(xLabel);

  weAllGoodHisto();
}

function histoMouseover(d,i){
	var shiftX = (d3.select(this).attr("width")*1.5)-(d3.select(this).attr("width"));
	var shiftY = (d3.select(this).attr("height")*1.05)-(d3.select(this).attr("height"));

	d3.select("#histoTick"+i).style('opacity','1.0');

	var curr = i;

	d3.selectAll(".bar")
		.filter(function(d,i){return i > curr;})
		.attr("transform", 'translate('+shiftX+',0)');

	d3.select(this)
		.attr("width", function(d) {
			return (d3.select(this).attr("width")*1.5);
		})
		.attr("height", function(d) {
			return (d3.select(this).attr("height")*1.05);
		})
		.attr("transform", 'translate(0,-'+shiftY+')');
}

function histoMouseout(d,i){
	var shift = (d3.select(this).attr("width"))-(d3.select(this).attr("width")/1.5);

	d3.select("#histoTick"+i).style('opacity','0.0');

	var curr = i;

	d3.selectAll(".bar")
		.filter(function(d,i){return i > curr;})
		.attr("transform", 'translate(0,0)');

	d3.select(this)
		.attr("width", function(d) {
			return (d3.select(this).attr("width")/1.5);
		})
		.attr("height", function(d) {
			return (d3.select(this).attr("height")/1.05);
		})
		.attr("transform", 'translate(0,0)');
}

function histoMouseclick(){
	var index = histoList.indexOf(window.location.hash);

	if(index == histoList.length-1){
		index = 0;
	}else{
		index++;
	}

	window.location.hash = histoList[index];
}

function weAllGoodHisto() {
  $("#histo").removeClass("disabled");
}
