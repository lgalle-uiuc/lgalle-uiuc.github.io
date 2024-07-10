//https://medium.com/@kj_schmidt/making-a-simple-scatter-plot-with-d3js-58cc894d7c97
//https://medium.com/@kj_schmidt/hover-effects-for-your-scatter-plot-447df80ea116
///https://d3-annotation.susielu.com/#examples

var margin = {
    top: 20,
    right: 40,
    bottom: 30,
    left: 60
}
async function loadAggregate(num_cylinders, screen) {

    d3.select("#aggregate_chart").html("");

    let raw_data = await d3.csv("../resources/cars2017.csv");

    //making graph responsive
    default_width = 500 - margin.left - margin.right;
    default_height = 500 - margin.top - margin.bottom;
    default_ratio = default_width / default_height;

    // Determine current size, which determines vars
    function set_size() {
        current_width = window.innerWidth;
        current_height = window.innerHeight;
        current_ratio = current_width / current_height;
        // desktop
        if (current_ratio > default_ratio) {
            h = default_height;
            w = default_width;
            // mobile
        } else {
            margin.left = 40
            w = current_width - 40;
            h = w / default_ratio;
        }
        // Set new width and height based on graph dimensions
        width = w - 50 - margin.right;
        height = h - margin.top - margin.bottom;
    };
    set_size();

    let data = [];

    // format the data
    raw_data.forEach(function (d) {
        d.AverageHighwayMPG = +d.AverageHighwayMPG;
        d.AverageCityMPG = +d.AverageCityMPG;
        data.push(d);
    });

    // so top elements are displayed
    data = data.sort((a, b) => {
        if (a.Fuel == screen && b.Fuel == screen) {
            if (num_cylinders == b.EngineCylinders) {
                return -1;
            }
        } else if (b.Fuel == screen) {
            return -1;
        } else {
            return 0;
        }
    })

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) {
        return d.AverageHighwayMPG;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.AverageCityMPG;
    })]);

    // append the svg object to the body of the page
    var svg = d3.select("#aggregate_chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add the data points

    var div = d3.select("body").append("div")
         .attr('id', 'car_mouse_over')
         .attr("class", "tooltip")
         .style("opacity", 0);

    var path = svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function (d) {
            return x(d.AverageHighwayMPG);
        })
        .attr("cy", function (d) {
            return y(d.AverageCityMPG);
        })
        .attr("stroke", function (d, i) {
            let color = '';
            switch (d.Fuel) {
                case "Gasoline":
                    color = isLoadable(d, screen, num_cylinders) ? "#669900" : "#f7ffe6"
                    break;
                case "Diesel":
                    color = isLoadable(d, screen, num_cylinders) ? "#ff0000" : "#ffe6e6";
                    break;
                case "Electricity":
                    color = isLoadable(d, screen, num_cylinders) ? "#3366ff" : "#e6ecff";
                    break;
            }
            return color;
        })
        .attr("stroke-width", 1.5)
        .attr("fill", "#FFFFFF");

    // Add the axis
    if (width < 500) {
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(5));
    } else {
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
    }

    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(function (d) {
            return d
        }));

    // https://stackoverflow.com/questions/11189284/d3-axis-labeling
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width / 2 + 35)
        .attr("y", height + 27)
        .attr("font-size", "11px")
        .text("mpg highway");

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", -27)
        .attr("writing-mode", "vertical-lr")
        .attr("y", height / 2)
        .attr("font-size", "11px")
        .text("mpg city");

    const annotations = getApplicableAnnotation(screen, num_cylinders);

    const makeAnnotations = d3.annotation()
      .type(d3.annotationLabel)
      .annotations(annotations)

    svg.append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations)

}

function isLoadable(d, screen, cylinders, make) {

    let validScreen = screen == d.Fuel;
    let validCylinders = cylinders == d.EngineCylinders || cylinders == 'All';
    let validMake = true;

    return validScreen && validCylinders && validMake;
}

function getApplicableAnnotation(screen, cylinders) {
    const gasoline_anno = [
    {
      type: d3.annotationCalloutRect,
      note: {
        label: "Gasoline powered vehicles perform on the low end of both highway and city mpg",
        wrap: 190
      },
      //settings for the subject, in this case the circle radius
      subject: {
        width: 120,
        height: 120
      },
      x: -10,
      y: 270,
      dy: -50,
      dx: 75
    }].map(function(d){ d.color = "#E8336D"; return d});

    const gasoline_anno_four = [
    {
      type: d3.annotationCalloutRect,
      note: {
        label: "4 cylinder vehicles perform the best for both highway and city mpg for Gasoline",
        wrap: 190
      },
      //settings for the subject, in this case the circle radius
      subject: {
        width: 90,
        height: 90
      },
      x: 12,
      y: 285,
      dy: -50,
      dx: 75
    }].map(function(d){ d.color = "#E8336D"; return d});

    const gasoline_anno_eight = [
    {
      type: d3.annotationCalloutRect,
      note: {
        label: "8 cylinder vehicles perform poorer than 4 cylinder Vehicles, but better than 12 for Gasoline",
        wrap: 190
      },
      //settings for the subject, in this case the circle radius
      subject: {
        width: 60,
        height: 60
      },
      x: -8,
      y: 325,
      dy: -50,
      dx: 75
    }].map(function(d){ d.color = "#E8336D"; return d});

    const gasoline_anno_twelve = [
    {
      type: d3.annotationCalloutRect,
      note: {
        label: "12 cylinder vehicles perform the worst for Gasoline vehicles",
        wrap: 190
      },
      //settings for the subject, in this case the circle radius
      subject: {
          width: 30,
          height: 30
        },
        x: -8,
        y: 355,
        dy: -50,
        dx: 75
    }].map(function(d){ d.color = "#E8336D"; return d});

    const diesel_anno = [
    {
      type: d3.annotationCalloutRect,
      note: {
        label: "Diesel powered vehicles perform on the low end of both highway and city mpg, with slightly higher mpg than Gasoline",
        wrap: 190
      },
      //settings for the subject, in this case the circle radius
      subject: {
          width: 80,
          height: 80
        },
      x: 30,
      y: 290,
      dy: -50,
      dx: 75
    }].map(function(d){ d.color = "#E8336D"; return d});

    const diesel_anno_four = [
    {
      type: d3.annotationCalloutRect,
      note: {
        label: "4 cylinder vehicles perform the best for Diesel vehicles",
        wrap: 190
      },
      //settings for the subject, in this case the circle radius
      subject: {
          width: 80,
          height: 80
        },
      x: 30,
      y: 290,
      dy: -50,
      dx: 75
    }].map(function(d){ d.color = "#E8336D"; return d});

    const diesel_anno_six = [
    {
      type: d3.annotationCalloutRect,
      note: {
        label: "6 cylinder vehicles perform the worst for Diesel vehicles",
        wrap: 190
      },
      //settings for the subject, in this case the circle radius
      subject: {
          width: 25,
          height: 25
        },
      x: 30,
      y: 328,
      dy: -50,
      dx: 75
    }].map(function(d){ d.color = "#E8336D"; return d});

    const electric_anno = [
    {
      type: d3.annotationCalloutRect,
      note: {
        label: "Electric powered vehicles greatly outperform gasoline and diesel vehicles on both city and highway mpg",
        wrap: 190
      },
      //settings for the subject, in this case the circle radius
      subject: {
              width: 180,
              height: 200
            },
      x: 200,
      y: -10,
      dy: 150,
      dx: -10
    }].map(function(d){ d.color = "#E8336D"; return d});

    let anno_map = {
        'Gasoline' : {
            'All': gasoline_anno,
            '4' : gasoline_anno_four,
            '8' : gasoline_anno_eight,
            '12' : gasoline_anno_twelve
        },
        'Diesel' : {
            'All' : diesel_anno,
            '4' : diesel_anno_four,
            '6' : diesel_anno_six
        },
        'Electricity' : {
            'All' : electric_anno
        }
    };

    return anno_map[screen][cylinders];
}

loadAggregate('All', 'Gasoline');

