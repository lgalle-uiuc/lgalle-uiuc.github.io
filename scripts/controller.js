var screen_index = 0;
var screens = ['Gasoline', 'Diesel' , 'Electricity'];

// https://www.trustauto.com/blog/diesel-vs-gasoline
const gasoline_explanation = 'The fuel efficiency in gasoline vehicles tends to be lower when compared to diesel and'
+ ' electric vehicles. Gasoline is mixed with air and then compressed by a piston, causing a series of small explosions'
+ ' which powers the vehicle. Gasoline has a lower compression ratio than Diesel, making it less efficient. Most Gasoline'
+ ' powered vehicles average between 20 and 30 miles per gallon, but this can very greatly.';

const diesel_explanation = 'Diesel vehicles, tend to be more efficient than gasoline. Diesel also uses combustion to '
+ 'power the vehicle, but has a hgh compression ratio which makes it more efficient than Gasoline and produces more energy. '
+ 'Because of this, Diesel vehicles are show here to at times have over 40 mpg highway.';

const electric_explanation = 'Electric vehicles are by far the most efficient in terms of fuel efficiency. Instead of '
+ 'burning fuel or using combustion, electric vehicles are powered by batteries. Batteries are more energy efficient '
+ 'than both Gasoline and Diesel vehicles, with many achieving 100 MPH in terms of overall energy use.';

let e_map = { 'Gasoline' : gasoline_explanation, 'Diesel' : diesel_explanation, 'Electricity' : electric_explanation };

function onChangeCylinder() {
    var selectBox = document.getElementById("filter_cylinders");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    loadDynamic(selectedValue, screens[screen_index])
    loadAggregate(selectedValue, screens[screen_index])
}

function onPressNext() {
    if (!isNextDisabled()) {
        screen_index = (screen_index + 1) % 3;
        loadDynamic('All', screens[screen_index]);
        loadAggregate('All', screens[screen_index]);
    }

    d3.select("#next").attr("disabled", isNextDisabled() ? "true" : null);
    d3.select("#previous").attr("disabled", null);
    d3.select("#dynamic_title").html("2017 Cars With " + screens[screen_index] + " Fuel");
    d3.select("#explanations").html(e_map[screens[screen_index]]);
    getCylinderOptions(screens[screen_index]);
}

function onPressPrevious() {
    if (!isPreviousDisabled()) {
        screen_index = (screen_index - 1) % 3;
        loadDynamic('All', screens[screen_index]);
        loadAggregate('All', screens[screen_index]);
    }

    d3.select("#previous").attr("disabled", isPreviousDisabled() ? "true" : null);
    d3.select("#next").attr("disabled", null);
    d3.select("#dynamic_title").html("2017 Cars With " + screens[screen_index] + " Fuel");
    d3.select("#explanations").html(e_map[screens[screen_index]]);
    getCylinderOptions(screens[screen_index]);
}

function isNextDisabled() {
    return screen_index == 2;
}

function isPreviousDisabled() {
    return screen_index == 0;
}

function getCylinderOptions(page) {

    options = [];

    if (page == 'Gasoline') {
        options = [{val: 'All'}, {val: '4'}, {val: '8'}, {val: '12'}];
    } else if (page == 'Diesel') {
        options = [{val: 'All'}, {val: '4'}, {val: '6'}];
    } else {
        options = [{val: 'All'}];
    }

    d3.select("#filter_cylinders").html("");
    d3.select("#filter_cylinders")
        .selectAll("option")
        .data(options)
        .enter()
        .append("option")
        .property("value", function(d) { return d.val; })
        .html(function(d) { return d.val; });

}

getCylinderOptions('Gasoline');