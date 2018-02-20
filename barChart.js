

var BarChart = function(data){
    var draw_chart = function(){
        $('html, body').animate({
            scrollTop: $("#bottom-chart").offset().top
        }, 1000);
        d3.select(".land-name").html(data.country + ", wave " + data.wave);
        // implementing convetional margins
        // set the dimensions and margins of the graph
        var margin = {top: 50, right: 40, bottom: 20, left: 40},
            width = window.innerWidth/1.5 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;
        // bada bing bada boom, put it in place
        d3.select(".chart").select("svg").remove();
        var svg = d3.select(".chart").append("svg");        
        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g");
            //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        // set the scales/ranges
        // mapping directly from our data values
        var x = d3.scaleBand()
            .domain(Object.keys(data.bar_data))
            .range([0,width])
            .padding(0.5);
        // mapping from data values
        var y = d3.scaleLinear()
            .domain([0,d3.max(Object.values(data.bar_data))])
            .range([height,0]);
        // Now we make the axes!
        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        var yAxis = d3.axisRight(y)
            .tickSize(width)
            .tickFormat(d3.format("d"));
            // .ticks(d3.max(Object.values(data.bar_data)));
        svg.append("g")
            .call(customYAxis);
        function customYAxis(g) {
            g.call(yAxis);
            g.select(".domain").remove();
            g.selectAll(".tick:not(:first-of-type) line")
                .attr("stroke", "#777")
                .attr("stroke-dasharray", "2,2");
            g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
        }
        var leftAxis = d3.axisLeft(y)
            .tickSize(0)
            .ticks(0);
        svg.append("g")
            .call(leftAxis);

        return {"svg":svg,"x":x,"y":y,"height":height}
    }

    var chart_object = draw_chart();

    var svg = chart_object.svg;
    var x = chart_object.x;
    var y = chart_object.y;
    var height = chart_object.height;
    var svg = chart_object.svg;

    var update_data = function(){

        // Shitty code for object
        // TODO
        var thisdata = [];
        var keys = Object.keys(data.bar_data);
        for(var i = 0; i < keys.length; i++){
            let o = {
                id : keys[i],
                value : data.bar_data[keys[i]]
            }
            thisdata.push(o);
        }

        var t = d3.transition()
            .duration(750);
        var bar = svg.selectAll(".bar")
            .data(thisdata);

        bar.exit().remove();
        
        bar.enter().append("rect")
            .attr("class", "bar")
            .attr("width", x.bandwidth())
            .attr("fill",data.color)
            .merge(bar)
            // .transition(t)
            // .delay(function(d, i) {
            //     return i / thisdata.length * 500;  // Dynamic delay (each item delays a little longer)
            // })
            .attr("x", function(d) { return x(d.id); })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });

    }
    update_data();
}

/*

    one reason sweden gave his dad a nobel price
    "how can you dislike a country that does something like that"

*/