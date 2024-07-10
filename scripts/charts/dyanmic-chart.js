var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
}
async function loadDynamic(num_cylinders, screen) {

    d3.select("#dynamic_chart").html("");

    let raw_data = await d3.csv("../resources/cars2017.csv");

    // https://medium.com/@kj_schmidt/making-a-simple-scatter-plot-with-d3js-58cc894d7c97
    // simple scatter plot influenced by above tutorial
    width = 500 - margin.left - margin.right - 50 - margin.right;
    height = 500 - margin.top - margin.bottom - margin.top - margin.bottom;

    let data = [];

    raw_data.forEach(function (d) {
        if ((num_cylinders == 'All' || d.EngineCylinders == num_cylinders) && d.Fuel == screen) {
            d.AverageHighwayMPG = +d.AverageHighwayMPG;
            d.AverageCityMPG = +d.AverageCityMPG;
            data.push(d);
        }
    });

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(data, function (d) {
        return d.AverageHighwayMPG;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.AverageCityMPG;
    })]);

    var svg = d3.select("#dynamic_chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

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
                    color = "#669900";
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
        // https://medium.com/@kj_schmidt/hover-effects-for-your-scatter-plot-447df80ea116
        // mouse over events influences by tutorial above
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
}

function onChangeCylinder() {
    var selectBox = document.getElementById("filter_cylinders");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    loadDynamic(selectedValue, screens[screen_index])
}

function onPressNext() {
    if (!isNextDisabled()) {
        screen_index = (screen_index + 1) % 3;
        loadDynamic('All', screens[screen_index]);
    }

    d3.select("#next").attr("disabled", isNextDisabled() ? "true" : null);
    d3.select("#previous").attr("disabled", null);
}

function onPressPrevious() {
    if (!isPreviousDisabled()) {
        screen_index = (screen_index - 1) % 3;
        loadDynamic('All', screens[screen_index]);
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

loadDynamic('All', 'Gasoline');

