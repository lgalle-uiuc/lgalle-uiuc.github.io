var screen_index = 0;
var screens = ['Gasoline', 'Diesel' , 'Electricity'];

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
}

function isNextDisabled() {
    return screen_index == 2;
}

function isPreviousDisabled() {
    return screen_index == 0;
}





