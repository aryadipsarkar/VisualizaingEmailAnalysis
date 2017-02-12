/**
 * Created by arya on 9/14/2016.
 */

//fixing the canvas of the SVG element
var outerWidth=1000;
var outerHeight=500;

//fixing the margin of the SVG element
var margin = {top: 20, right: 20, bottom: 100, left: 100};

//Calculating the real area (after deducting the margins from all the 4 sides) where the SVG element will reside
width = outerWidth - margin.left - margin.right;
height = outerHeight - margin.top - margin.bottom;

//Parsing the time format into a format that will be feasible for calculation
var parseTime = d3.time.format.utc("%H:%M").parse;
midnight = parseTime("00:00");

//Appending the SVG elment to the canvas that we have created before (to the body of the HTML)
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Fixing the scale of the X-Axis (range and domain of the X-Axis)
var xScale = d3.time.scale.utc()
    .domain([midnight, d3.time.day.utc.offset(midnight,1)])
    .range([0, width]);

//Fixing the scale of the Y-Axis (range and domain of the Y-Axis)
var yScale = d3.scale.ordinal()
    .domain(["Sunday", "Monday","Tuesday", "Wednesday","Thursday","Friday","Saturday",""])
    .rangePoints([0, height]);

//Fixing the Color-Scale
var colorScale =d3.scale.category10();

//Fixing the values of the both the axis as well as the color
var cValue = function(d) { return d.mail;};
var yValue = function(d) { return d.day;};
var xValue = function(d) { return d.time;};

var yMap = function(d) { return yScale(yValue(d));};
var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(7)
    .orient("left");

var xMap = function(d) { return xScale(xValue(d));};
var xAxis = d3.svg.axis()
    .scale(xScale)
    .ticks(24)
    .tickFormat(d3.time.format.utc("%I %p"))
    .orient("bottom");

//Fixing the hover functionality
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


function render(data) {

    //Appending the <g> element to the x-axis of the graphics and giving label to the axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(2," + height + ")")
        .call(xAxis)    //calling the xAxis value that we have created earlier
        .append("text")
        .attr("class", "label")
        .attr("x", 25)
        .attr("y", 55)
        .style("text-anchor", "middle")
        .text("TIME =>");

    //Appending the <g> element to the y-axis of the graphics and giving label to the axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)   //calling the xAxis value that we have created earlier
        .append("text")
        .attr("class", "label")
        .attr("transform", "translate(-" + 65 + "," + 325 + ") rotate(-90)")
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("DAY=>");

    //Creating the circle in the graphics and appending the data to the circle
    svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 2.0)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return colorScale(cValue(d));})
        .on("mouseover", function(d) {          //mouseover actions
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d["mail"]+ "<br/> "+ d["date"] + "<br/> " + d["time_final"]) //Assigning what will pop up when the mousebutton hovers
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {           //mouseover actions
            tooltip.transition()
                .duration(500)
                .style("opacity", 0)
        });


    //Creating Legend in the graphics
    var legend = svg.selectAll("legend")
        .data(colorScale.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")               //creating the objects for the legends with color
        .attr("x", width - 13)
        .attr("y",415)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorScale);

    legend.append("text")               //creating the text for the legend
        .attr("x", width - 20)
        .attr("y", 425)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-family", "Georgia")
        .text(function(d) { return d;})
};

//Parsing the time format to bring into the format feasible for calculation
function type(d) {
    d.time = parseTime(d.time);
    d.time.setUTCHours((d.time.getUTCHours()));
    return d;
};

//Calling the function "render" with the values from the CSV File
d3.csv("email.csv",type,render);