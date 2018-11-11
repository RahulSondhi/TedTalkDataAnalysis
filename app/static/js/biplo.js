var cols = ["inspiring", "informative", "funny", "views", "comments", "languages", "duration", "published_date", "confusing", "unconvincing"];
//////////////////////////////////////////////////////////////////////////////

function startEmBiplo(svg, svgSize, tedData) {
  var redirect = "#biplo";

  $("#biplo").addClass("disabled");
  $("#utilities").html(" ");

  if (window.location.hash) {

    var hash = window.location.hash;
    if (hash == redirect) {
      drawBiplo(svg, svgSize, JSON.parse(JSON.stringify(tedData.data)), window.location.hash);
    } else {
      window.location.hash = redirect;
    }

  } else {
    window.location.hash = redirect;
  }

}

//////////////////////////////////////////////////////////////////////////////

function drawBiplo(svg, svgSize, data, category) {
  var margin = svgSize.margin;
  var width = svgSize.width;
  var height = svgSize.height;
  var angle = Math.PI * 0;

  var axis = d3.axisLeft();
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var x = d3.scaleLinear().range([width, 0]); // switch to match how R biplot shows it
  var y = d3.scaleLinear().range([height, 0]);

  x.domain([-3.5, 3.5]).nice()
  y.domain([-3.5, 3.5]).nice()

  var xAxis = d3.axisBottom()
    .scale(x);

  var yAxis = d3.axisLeft()
    .scale(y);

  data.forEach(function(v){
    var keys = Object.keys(v);
    keys.forEach(function(x){
      if(!cols.includes(x) && x != "title"){
        delete v[x];
      }else if(x == "title"){
        v["AATitle"] = v[x];
        delete v[x];
      }
    });
  });

  var matrix = data.map(function(d) {
      var shit = d3.values(d);
      shit.pop();
      return shit.map(parseFloat);
  });

  var pcab = new PCAB();
  matrix = pcab.scale(matrix, true, true);


  pc = pcab.pcab(matrix, 2)

  var A = pc[0];
  var B = pc[1];

  var attr_names = Object.keys(data[0]);
  attr_names = attr_names.filter(function(ele){
       return cols.includes(ele);
   });

  data.map(function(d, i) {
    label: d.title,
    d.pc1 = A[i][0];
    d.pc2 = A[i][1];
  });

  var brands = attr_names
    .map(function(key, i) {
      return {
        brand: key,
        pc1: B[i][0] * 4,
        pc2: B[i][1] * 4
      }
    });

  data.map(function(d) {
    var xy = rotate(d.pc1, d.pc2, angle);
    d.pc1 = xy.x;
    d.pc2 = xy.y;
  });

  brands.map(function(d) {
    var xy = rotate(d.pc1, d.pc2, angle);
    d.pc1 = xy.x;
    d.pc2 = xy.y;
  });

  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
      return d;
    });

  svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 3.5)
    .attr("cx", function(d) {
      return x(d.pc1);
    })
    .attr("cy", function(d) {
      return y(d.pc2);
    })
    .style("fill", function(d) {
      return color(d['species']);
    })
    .on('mouseover', onMouseOverAttribute)
    .on('mouseleave', onMouseLeave);



  svg.selectAll("circle.brand")
    .data(brands)
    .enter().append("circle")
    .attr("class", "square")
    .attr("r", 7)
    .attr("cx", function(d) {
      return x(d.pc1);
    })
    .attr("cy", function(d) {
      return y(d.pc2);
    })
    .style("fill", function(d) {
      return color(d['brand']);
    })
    .on('mouseover', onMouseOverBrand)
    .on('mouseleave', onMouseLeave);


  svg.selectAll("text.brand")
    .data(brands)
    .enter().append("text")
    .attr("class", "label-brand")
    .attr("x", function(d) {
      return x(d.pc1) + 10;
    })
    .attr("y", function(d) {
      return y(d.pc2) + 0;
    })
    .text(function(d) {
      return d['brand']
    })


  svg.selectAll(".line")
    .data(brands)
    .enter().append("line")
    .attr("class", "square")
    .attr('x1', function(d) {
      return x(-d.pc1);
    })
    .attr('y1', function(d) {
      return y(-d.pc2);
    })
    .attr("x2", function(d) {
      return x(d.pc1);
    })
    .attr("y2", function(d) {
      return y(d.pc2);
    })
    .style("stroke", function(d) {
      return color(d['brand']);
    })
    .on('mouseover', onMouseOverBrand)
    .on('mouseleave', onMouseLeave);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([10, 20])
    .direction('e')
    .html(function(values, title) {
      var str = ''
      str += '<h3>' + (title.length == 1 ? 'Title ' : '') + title + '</h3>'
      str += "<table>";
      for (var i = 0; i < values.length; i++) {
        if (values[i].key != 'AATitle' && values[i].key != 'pc1' && values[i].key != 'pc2') {
          str += "<tr>";
          str += "<td>" + values[i].key + "</td>";
          str += "<td class=pct>" + values[i].value + "</td>";
          str + "</tr>";
        }
      }
      str += "</table>";

      return str;
    });

  svg.call(tip);

  function getSpPoint(A, B, C) {
    var x1 = A.x,
      y1 = A.y,
      x2 = B.x,
      y2 = B.y,
      x3 = C.x,
      y3 = C.y;
    var px = x2 - x1,
      py = y2 - y1,
      dAB = px * px + py * py;
    var u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
    var x = x1 + u * px,
      y = y1 + u * py;
    return {
      x: x,
      y: y
    }; //this is D
  }

  function rotate(x, y, dtheta) {

    var r = Math.sqrt(x * x + y * y);
    var theta = Math.atan(y / x);
    if (x < 0) theta += Math.PI;

    return {
      x: r * Math.cos(theta + dtheta),
      y: r * Math.sin(theta + dtheta)
    }
  }

  function onMouseOverAttribute(a, j) {

    brands.forEach(function(b, idx) {
      var A = {
        x: 0,
        y: 0
      };
      var B = {
        x: b.pc1,
        y: b.pc2
      };
      var C = {
        x: a.pc1,
        y: a.pc2
      };

      b.D = getSpPoint(A, B, C);
    });

    svg.selectAll('.tracer')
      .data(brands)
      .enter()
      .append('line')
      .attr('class', 'tracer')
      .attr('x1', function(b, i) {
        return x(a.pc1);
        return x1;
      })
      .attr('y1', function(b, i) {
        return y(a.pc2);
        return y1;
      })
      .attr('x2', function(b, i) {
        return x(b.D.x);
        return x2;
      })
      .attr('y2', function(b, i) {
        return y(b.D.y);
        return y2;
      })
      .style("stroke", function(d) {
        return "#aaa"
      });

    delete a.D;
    var tipText = d3.entries(a);
    tip.show(tipText, a.AATitle);
  };

  function onMouseOverBrand(b, j) {

    data.forEach(function(a, idx) {
      var A = {
        x: 0,
        y: 0
      };
      var B = {
        x: b.pc1,
        y: b.pc2
      };
      var C = {
        x: a.pc1,
        y: a.pc2
      };

      a.D = getSpPoint(A, B, C);
    });

    svg.selectAll('.tracer')
      .data(data)
      .enter()
      .append('line')
      .attr('class', 'tracer')
      .attr('x1', function(a, i) {
        return x(a.D.x);
      })
      .attr('y1', function(a, i) {
        return y(a.D.y);
      })
      .attr('x2', function(a, i) {
        return x(a.pc1);
      })
      .attr('y2', function(a, i) {
        return y(a.pc2);
      })
      .style("stroke", function(d) {
        return "#aaa"
      });

    var tipText = data.map(function(d) {
      return {
        key: d.AATitle,
        value: d[b['brand']]
      }
    })
    tip.show(tipText, b.brand);
  };

  function onMouseLeave(b, j) {
    svg.selectAll('.tracer').remove()
    tip.hide();
  }

  weAllGoodBiplo();
}

function weAllGoodBiplo() {
  $("#biplo").removeClass("disabled");
}
