var screen_index = 0;
var screens = ['Gasoline', 'Diesel' , 'Electricity'];

const gasoline_explanation = 'Fuel efficiency in gasoline vehicles is typically lower compared to diesel and '
+ 'electric vehicles. Gasoline engines operate by igniting a mixture of fuel and air, which generates power through '
+ 'a series of controlled explosions. This process tends to be less efficient because a significant amount of energy '
+ 'is lost as heat. On average, gasoline vehicles achieve about 25-30 miles per gallon (MPG) for standard cars, though '
+ 'this can vary widely based on the make and model.';

const diesel_explanation = 'Diesel vehicles, on the other hand, are generally more fuel-efficient than their gasoline '
+ 'counterparts. Diesel engines use compression ignition, which results in a more efficient combustion process. This '
+ 'allows diesel vehicles to extract more energy from the same amount of fuel. Consequently, diesel cars often achieve '
+ 'higher fuel efficiency, averaging around 30-40 MPG or more. Additionally, diesel fuel contains more energy per gallon '
+ 'than gasoline, further contributing to better mileage.'

const electric_explanation = 'Electric vehicles (EVs) represent a different paradigm in terms of fuel efficiency. '
+ 'Instead of burning fuel, EVs convert electrical energy stored in batteries into mechanical energy using electric motors. '
+ 'This process is highly efficient, with electric vehicles often achieving the equivalent of over 100 MPG in terms of '
+ 'energy use. Moreover, electric motors provide instant torque and have fewer moving parts, which reduces energy losses '
+ 'and increases overall efficiency. The primary limiting factor for EVs is the energy density of batteries, but '
+ 'advancements in battery technology continue to improve their range and efficiency.'

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
}

function isNextDisabled() {
    return screen_index == 2;
}

function isPreviousDisabled() {
    return screen_index == 0;
}





