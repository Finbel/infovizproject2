



var DataChart2 = function(container, data, current_conflict){
    d3.select(".land-name").html("");
    var data2 = data.values;
    var text = data.y_text;

    var local_conflict = {
        name : current_conflict.name,
        locations : current_conflict.locations,
        participants : current_conflict.participants,
        from : current_conflict.from,
        to: current_conflict.to,
        casualities: current_conflict.casualties,
        displaced: current_conflict.displaced
    };

    var local_data = []

    // remove countries from data that doesn't belong to the current conflict
    for(var i = 0; i < data2.length; i++){
        let exists = false;
        for(var j = 0; j <  local_conflict.participants.length; j++){
            if(data2[i].id == local_conflict.participants[j]){
                exists = true;
                break;
            }
        }
        if(exists){
            local_data.push(data2[i]);
        }
    }
    
    var start_year = new Date(1990,01,01)

    var end_year;
    var ongoing = true;
    if(local_conflict.to.length>0){
        ongoing = false;
        end_year = new Date((+local_conflict.to)+5,01,01);
        war_end = new Date((+local_conflict.to),01,01);
    } else{
        end_year = new Date(2018,01,01);        
    }



    function convert(d) {
        var obj = {
          date: new Date(d.date,01,01),
          value: +d.value         // convert string to number
        };
        if (data.y_reverse) {
            obj.wave = d.wave;
        }
        return obj;
    }
    
    var is_date = function(input) {
        if ( Object.prototype.toString.call(input) === "[object Date]" ) 
          return true;
        return false;   
          };

    max_year = start_year;
    min_year = end_year;
    for(var i = 0; i < local_data.length; i++){
        for(var j = 0; j < local_data[i].values.length; j++){
            if(!is_date(local_data[i].values[j].date)){
                local_data[i].values[j] = convert(local_data[i].values[j]);
            }
            if(local_data[i].values[j].date<start_year || local_data[i].values[j].date>end_year){
                local_data[i].values.splice(j,1);
                j--;
            }
            if(j < local_data[i].values.length  && j>-1){
                if(local_data[i].values[j].date>max_year){
                    max_year = local_data[i].values[j].date;
                }
                if(local_data[i].values[j].date<min_year){
                    min_year = local_data[i].values[j].date;
                }
            }
        } 
        if(local_data[i].values.length<1){
            local_data.splice(i,1);
            i--;
        }
    }
    if(max_year<end_year){
        end_year = max_year;
    }
    if(min_year>start_year){
        start_year = min_year;
    }
    var margin = {top: 20, right: 140, bottom: 0, left: 140},
        width = 1500 - margin.left - margin.right,
        height = 630 - margin.top - margin.bottom;
    
    this.g = container.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
    var x = d3.scaleTime().range([0, width]).domain([start_year,max_year]),
    
    y = d3.scaleLinear().range([height, 0]).domain([
        d3.min(local_data, function(c) { 
            return d3.min(c.values, function(d) { return d.value; }); }),
        d3.max(local_data, function(c) { 
            return d3.max(c.values, function(d) { return d.value; }); })
        ]);
    if (data.y_reverse) {
        y.domain([
            Math.ceil(d3.max(local_data, function(c) { 
                return d3.max(c.values, function(d) { return d.value; }); })),
            Math.floor(d3.min(local_data, function(c) { 
                    return d3.min(c.values, function(d) { return d.value; }); })
        )]);
        if(data.child){
            y.domain([
                Math.floor(d3.min(local_data, function(c) { 
                        return d3.min(c.values, function(d) { return d.value; }); })
            ),
                Math.ceil(d3.max(local_data, function(c) { 
                    return d3.max(c.values, function(d) { return d.value; }); }))]);
        }
    }

    var z = d3.scaleOrdinal(d3.schemeCategory10).domain(local_data.map(function(c) { return c.id; }));
    
    var line = d3.line()
    .curve(d3.curveMonotoneX)
    .x(function(d) {
        return x(d.date); })
    .y(function(d) { return y(d.value); });

    var coorporation = this.g.selectAll(".coorporation")
        .data(local_data)
        .enter().append("g")
        .attr("class", "coorporation");

    coorporation.append("path")
        .attr("class", "line")
        .attr("d", function(d) {
        return line(d.values); })
        .style("stroke", function(d) { 
            return color_map[d.id]; });

    coorporation.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("fill",function(d) { return color_map[d.id]; })
        .attr("transform", function(d) {
        return "translate(" + x(d.value.date) + "," + y(d.value.value) + ")"; })
        .attr("x", 6)
        .attr("dy", "0.35em")
        .attr("class", "impact_small")
        .text(function(d) { return d.id; });


    this.g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    if (data.y_reverse) {
        var scale = []
        var labels = []
        for(var i = 0; i < data.y_scale.values.length; i++){
            if(data.child){
                if(data.y_scale.values[i] >= y.domain()[0] && data.y_scale.values[i] <= y.domain()[1]){
                    scale.push(data.y_scale.values[i]);
                    labels.push(data.y_scale.label[i]);
                }
                scale.reverse()
                labels.reverse()
            } else {
                if(data.y_scale.values[i] >= y.domain()[1] && data.y_scale.values[i] <= y.domain()[0]){
                    scale.push(data.y_scale.values[i]);
                    labels.push(data.y_scale.label[i]);
                }
            }
        }
        var axis = d3.axisLeft(y)
        .tickValues(scale)
        .tickFormat(function(d,i){ return labels[i] });
    } else {
        var axis = d3.axisLeft(y);
    }
    this.g.append("g")
        .attr("class", "axis axis--y")
        .call(axis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 9)
        .attr("dy", "0.9em")
        .attr("fill", "#000")
        .text(text)
        .attr("class","impact");

    this.x = x;
    this.y = y;
    this.z = z;
 
    this.g.append("line")
    .attr("x1", x(local_conflict.from))  //<<== change your code here
    .attr("y1", margin.top)
    .attr("x2", x(local_conflict.from))  //<<== and here
    .attr("y2", height - margin.bottom)
    .style("stroke-width", 2)
    .style("stroke", "red")
    .style("fill", "none");

    this.g.append("g")
        .append("text")
        .attr("y", margin.top+11)
        .attr("x", x(local_conflict.from)+3)
        .attr("fill", "red")
        .text("Start of war");

    if(ongoing==false && war_end < max_year){
        this.g.append("line")
        .attr("x1", x(war_end))  //<<== change your code here
        .attr("y1", margin.top)
        .attr("x2", x(war_end))  //<<== and here
        .attr("y2", height - margin.bottom)
        .style("stroke-width", 2)
        .style("stroke", "red")
        .style("fill", "none");
    
        this.g.append("g")
            .append("text")
            .attr("y", margin.top+11)
            .attr("x", x(war_end)+3)
            .attr("fill", "red")
            .text("End of war");
    }


    var dot_data = [];
    for(let i = 0; i < local_data.length; i++){
        for(let j = 0; j < local_data[i].values.length; j++){
            dot_data.push({
                id : local_data[i].id,
                date : local_data[i].values[j].date,
                value : local_data[i].values[j].value,
                wave : local_data[i].values[j].wave,
            });
        }
    }

    var g = this.g;

    this.g.selectAll("circle").data(dot_data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return  x(d.date); })
        .attr("cy", function(d) { return y(d.value); })
        .attr('r', 5)
        .attr('fill', "#fff")
        .attr("stroke",function(d){ return color_map[d.id]; })
        .attr("stroke-width",3)
        .on("mouseover", function(d){
            g.append("rect")
            .attr("class","bottom_tooptip")
            .attr("x", x(d.date)+5 )
            .attr("y", function(){
                if(data.y_reverse){
                    return y(d.value)-45;
                }else {
                    return y(d.value)-35;
                }
            })
            .attr("width",(d.id + " , " + d3.format(".2f")(d.value)).length*10)
            .attr("height",
            function(d){
                if(data.y_reverse){
                    return 40;
                }else {
                    return 20;
                }
            })
            .attr("fill","white")
            .style("stroke","black")
            .style("stroke-width", 2);
            
            if(data.y_reverse){

                g.append("text")
                    .attr("class","bottom_tooptip")
                    .attr("x", x(d.date)+10 )
                    .attr("y",  y(d.value)-30 )
                    .attr("fill", color_map[d.id])
                    .text("wave: " + d.wave);  

                g.append("text")
                    .attr("class","bottom_tooptip")
                    .attr("x", x(d.date)+10 )
                    .attr("y",  y(d.value)-10 )
                    .attr("fill", color_map[d.id])
                    .text( d.id + " , " + d3.format(".2f")(d.value));  
            } else {
            g.append("text")
                .attr("class","bottom_tooptip")
                .attr("x", x(d.date)+10 )
                .attr("y",  y(d.value)-20 )
                .attr("fill", color_map[d.id])
                .text( d.id + " , " + d3.format(".2f")(d.value));  
            }

        })
        .on("mouseout",function(){
            d3.selectAll(".bottom_tooptip").remove();
        })
        .on("click",function(d){
            if(data.y_reverse){
                for(var i = 0; i < values_data.length; i++){
                    if(values_data[i].wave == d.wave){
                        for(var j = 0; j< values_data[i].countries.length; j++){
                            if(values_data[i].countries[j].name == d.id){
                                var value_list = Object.keys(values_data[i].countries[j].values);
                                for(var k = 0; k < value_list.length;k++){
                                    if(value_list[k] == text) {
                                        // turn the map into a scale
                                        scale_map = {}
                                        var labels = data.y_scale.label;
                                        var values = Object.values(values_data[i].countries[j].values[value_list[k]]);
                                        for(var p = 0; p < labels.length; p++){
                                            scale_map[labels[p]] = values[p];
                                        }
                                        var bar_data = values_data[i].countries[j].values[value_list[k]];

                                        data_object = {
                                            scale : scale_map,
                                            color: color_map[d.id],
                                            country : d.id,
                                            wave : d.wave,
                                            bar_data :  scale_map
                                        }
                                        BarChart(data_object);
                                    }
                                }
                            }
                        } 
                    }
                }
            }
        });

    if(data.y_reverse){
        g.append("text")
            .attr("x",10)
            .attr("y",600)
            .text("CLICK ON DOT TO GET MORE DETAILS");
    }
}