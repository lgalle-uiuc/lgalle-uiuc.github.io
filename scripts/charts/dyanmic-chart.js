//https://medium.com/@kj_schmidt/making-a-simple-scatter-plot-with-d3js-58cc894d7c97
//https://medium.com/@kj_schmidt/hover-effects-for-your-scatter-plot-447df80ea116

var screen_index = 0;
var screens = ['Gasoline', 'Diesel' , 'Electricity'];

var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
}
async function load(num_cylinders, screen) {

    console.log(num_cylinders)
    console.log(screen)

    d3.select("#dynamic_chart").html("");

    let raw_data = await d3.csv("../resources/cars2017.csv");

    //making graph responsive
    default_width = 700 - margin.left - margin.right;
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
        if ((num_cylinders == 'All' || d.EngineCylinders == num_cylinders) && d.Fuel == screen) {
            d.AverageHighwayMPG = +d.AverageHighwayMPG;
            d.AverageCityMPG = +d.AverageCityMPG;
            data.push(d);
        }
    });

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
    var svg = d3.select("#dynamic_chart").append("svg")
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
            let color = '#99ff66';
            console.log(d.Fuel);
            switch (d.Fuel) {
                case "Gasoline":
                    color = "#99ff66";
                    break;
                case "Diesel":
                    color = "#ff0000";
                    break;
                case "Electricity":
                    color = "#3366ff";
                    break;
            }
            return color;
        })
        .attr("stroke-width", 1.5)
        .attr("fill", "#FFFFFF")
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('100')
                .attr("r", 7);
            div.transition()
                .duration(100)
                .style("opacity", 1);
            div.html('<div><p>Make: ' + d.Make + '</p><p>Average Highway MPG: ' + d.AverageHighwayMPG
                                + '</p><p>Average City MPG: ' + d.AverageCityMPG + '</p><p>Cylinders: ' + d.EngineCylinders
                                + '</p><p>Fuel: ' + d.Fuel + '</p></div>')
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px");
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('200')
                .attr("r", 5);
            div.transition()
                .duration('200')
                .style("opacity", 0);
        });

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

}

function onChangeCylinder() {
    var selectBox = document.getElementById("filter_cylinders");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    load(selectedValue, screens[screen_index])
}

function onPressNext() {
    if (!isNextDisabled()) {
        screen_index = (screen_index + 1) % 3;
        load('All', screens[screen_index]);
    }

    d3.select("#next").attr("disabled", isNextDisabled() ? "true" : null);
    d3.select("#previous").attr("disabled", null);
}

function onPressPrevious() {
    if (!isPreviousDisabled()) {
        screen_index = (screen_index - 1) % 3;
        load('All', screens[screen_index]);
    }

    d3.select("#previous").attr("disabled", isPreviousDisabled() ? "true" : null);
    d3.select("#next").attr("disabled", null);
}

function isNextDisabled() {
    return screen_index == 2;
}

function isPreviousDisabled() {
    return screen_index == 0;
}

load('All', 'Gasoline');

