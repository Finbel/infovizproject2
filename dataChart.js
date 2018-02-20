



var DataChart = function(container, data){

    function convert(d) {
        return {
          date: new Date(d.date),
          close: +d.value         // convert string to number
        };
    }
      
    for(var i = 0; i < data.length; i++){
        for(var j = 0; j < data[i].values.length; j++){
            data[i].values[j] = convert(data[i].values[j]);
        } 
    }

    var margin = {top: 20, right: 80, bottom: 0, left: 50},
        width = 1500 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom;
    
    this.g = container.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime().range([0, width]).domain([new Date(1992,01,01),new Date(2018,02,01)]),
    
    y = d3.scaleLinear().range([height, 0]).domain([
        d3.min(data, function(c) { 
            return d3.min(c.values, function(d) { return d.close; }); }),
        d3.max(data, function(c) { 
            return d3.max(c.values, function(d) { return d.close; }); })
        ]),
    
    z = d3.scaleOrdinal(d3.schemeCategory10).domain(data.map(function(c) { return c.id; }));
    
    var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) {
        return x(d.date); })
    .y(function(d) { return y(d.close); });

    var coorporation = this.g.selectAll(".coorporation")
        .data(data)
        .enter().append("g")
        .attr("class", "coorporation");

    coorporation.append("path")
        .attr("class", "line")
        .attr("d", function(d) {
        return line(d.values); })
        .style("stroke", function(d) { return z(d.id); });

    coorporation.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("fill",function(d) { return z(d.id); })
        .attr("transform", function(d) {
        return "translate(" + x(d.value.date) + "," + y(d.value.close) + ")"; })
        .attr("x", function(d){
        return -d.id.length*19;
        })
        .attr("dy", "0.35em")
        .attr("class", "impact")
        .text(function(d) { return d.id; });


    this.g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    this.g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 9)
        .attr("dy", "0.9em")
        .attr("fill", "#000")
        .text("closing price, USD")
        .attr("class","impact");

    this.x = x;
    this.y = y;
    this.z = z;
    
}