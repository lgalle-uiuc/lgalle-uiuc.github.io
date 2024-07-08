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


const type = d3.annotationLabel

const annotations = [{
  note: {
    label: "Longer text to show text wrapping",
    bgPadding: 20,
    title: "Annotations :)"
  },
  //can use x, y directly instead of data
  data: { date: "18-Sep-09", close: 185.02 },
  className: "show-bg",
  dy: 137,
  dx: 162
}]

const parseTime = d3.timeParse("%d-%b-%y")
const timeFormat = d3.timeFormat("%d-%b-%y")

//Skipping setting domains for sake of example
const x = d3.scaleTime().range([0, 800])
const y = d3.scaleLinear().range([300, 0])

const makeAnnotations = d3.annotation()
  .editMode(true)
  //also can set and override in the note.padding property
  //of the annotation object
  .notePadding(15)
  .type(type)
  //accessors & accessorsInverse not needed
  //if using x, y in annotations JSON
  .accessors({
    x: d => x(parseTime(d.date)),
    y: d => y(d.close)
  })
  .accessorsInverse({
     date: d => timeFormat(x.invert(d.x)),
     close: d => y.invert(d.y)
  })
  .annotations(annotations)

d3.select("svg")
  .append("g")
  .attr("class", "annotation-group")
  .call(makeAnnotations)


