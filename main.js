window.onload = function () {


    d3.selectAll(".pdf")
    .attr("width",((window.innerWidth*2.5)/3)+"px")
    .attr("height","2100px");

    $(".pdf").css("padding-left",window.innerWidth/6);
      
    $(".pdf").hide();

    $("#learn-button").click(function(){
        console.log("this");
        $(".pdf").hide();        
        $("#learning").show();    
    });

    $("#trail1-button").click(function(){
        console.log("this");
        $(".pdf").hide();        
        $("#trail1").show();    
    });

    $("#trail2-button").click(function(){
        console.log("this");
        $(".pdf").hide();        
        $("#trail2").show();    
    });

  /*
   * START OF TOP CHART 
   *
   *
   *
   */ 



    var svg = d3.select(".top-chart");
    
    data = [
            {
                "id" : "Lockheed",
                "values" : lockheed_data
            },
            {
                "id" : "Boeing",
                "values" : boing_data
        }
    ]

    topChart = new DataChart(svg,data);

    for(var i = 0; i < conflict_data.length; i++){
        conflict_data[i].from = new Date(conflict_data[i].from,01,01)
        for(var j = 0; j < data[0].values.length; j++){
            a = conflict_data[i].from.getFullYear();
            b = data[0].values[j].date.getFullYear();
            if(a === b){
                conflict_data[i].y_value =  (data[0].values[j].close + data[1].values[j].close)/2;
            }
        }
        conflict_data[i].selected = false
    }
    
    var x = topChart.x, y = topChart.y, z = topChart.z;
    
      topChart.g.selectAll(".displaced")
      .data(conflict_data)
      .enter()
      .append("circle")
      .attr("class","displaced")
      .attr("cx", function(d) { return  x(d.from); })
      .attr("cy", function(d) { return y(d.y_value); })
      .attr('r', function(d) { 
        d.displaced_r = Math.sqrt(d.casualties/500)+Math.sqrt(d.displaced/1500);  
        return d.displaced_r; })
      .attr('fill', 'gray')
      .attr("opacity", 0.6);

      topChart.g.selectAll(".casualties")
      .data(conflict_data)
      .enter()
      .append("circle")
      .attr("class","casualties")
      .attr("cx", function(d) { return  x(d.from); })
      .attr("cy", function(d) { return y(d.y_value); })
      .attr('r', function(d) { return Math.sqrt(d.casualties/500); })
      .attr('fill', 'red')
      .attr("opacity", 1)
      .on("mouseover", handleConflictMouseOver)
      .on("mouseout", handleConflictMouseOut)
      .on("click", handleConflictClick);

  /*
   * DONE WITH TOP CHART
   *
   * FOLLOWING ARE THE MOUSELOVER AND 
   * MOUSEOUT FUNCTIONS FOR THE DATAPOINTS
   *
   *
   *
   */ 
    var current_conflict = {participants:[]};
    var selected = false;
    // Create Event Handlers for mouse
    function handleConflictMouseOver(d, i) {  // Add interactivity
        // Use D3 to select element, change color and size
        d3.select(this).attr("opacity", 0.5);


        var length = [("Casualties: " + d.casualties), 
            ("Displaced: " + d.displaced),
            d.name].sort(function (a, b) { return b.length - a.length; })[0].length;

        var y_product = Math.sqrt(d.casualties/500);

        var rect = topChart.g.append("rect")
        .attr("class","tooltip2")
        .attr("x", function(){ return x(d.from) - 50} )
        .attr("y", function(){ return y(d.y_value) - 120})
        .attr("width", length*11+10 )
        .attr("height", 80)
        .attr("fill","lightgray");

        topChart.g.append("text")
            .attr("class", "tooltip2")
            .attr("x", function(){ return x(d.from) - 45} )
            .attr("y", function(){ return y(d.y_value) - 100})
            .text(function(){ return d.name })

        topChart.g.append("text")
        .attr("class", "tooltip2")
        .attr("id","casualties")
            .attr("x", function(){ return x(d.from) - 45} )
            .attr("y", function(){ return y(d.y_value) - 75})
            .text(function(){ return "Casualties: " + d3.format(",.2r")(d.casualties) })

        topChart.g.append("text")
            .attr("class", "tooltip2")
            .attr("id","displaced")
            .attr("x", function(){ return x(d.from) - 45} )
            .attr("y", function(){ return y(d.y_value) - 50})
            .text(function(){ return "Displaced: " + d3.format(",.2r")(d.displaced) })

        var locations = d.locations;
        var participants = d.participants;
        // Alter country data
        var countries = d3.select(".countries")
            .selectAll("path")
            .transition()
            .delay(50)
            .style("fill",function(d){
                if(locations.indexOf(d.properties.name) > -1){
                    return "#800000";
                }
                else if(participants.indexOf(d.properties.name) > -1){
                    return "#D13C17";
                } else if(countries_data.indexOf(d.properties.name) > -1){
                    return "#AE6451";
                } else {
                    return "gray";
                }
            });
    }


    function handleConflictMouseOut(d, i) {
        // Use D3 to select element, change color back to normal
        // Select text by id and then remove
        var countries = d3.select(".countries")
        .selectAll("path")
        .transition()
        .delay(50)
        .style("fill",function(d){
            if(!selected){ 
                if(countries_data.indexOf(d.properties.name) > -1){
                    return "#AE6451";
                } else {
                    return "gray";
                }
            } else {
                if(current_conflict.locations.indexOf(d.properties.name) > -1){
                    return "#800000";
                }
                else if(current_conflict.participants.indexOf(d.properties.name) > -1){
                    return "#D13C17";
                } else if(countries_data.indexOf(d.properties.name) > -1){
                    return "#AE6451";
                } else {
                    return "gray";
                }
            }   
        });
        topChart.g.selectAll(".tooltip2").remove();  // Remove text location
        d3.select(this).attr("opacity", 0.8);
    }

    function handleConflictClick(d, i){
        
        if(d.selected){
            $("#buttons").hide();            
            $(".bottom-chart").hide();
            selected = false;
            d.selected = false;
            current_conflict = {participants:[]};
        } else {

            $('html, body').animate({
                scrollTop: $("#chart").offset().top
            }, 1000);

            $(".btn-group").show();
            $(".bottom-chart").show();
            selected = true;
            d.selected = true;
            current_conflict = {
                name : d.name,
                locations : d.locations,
                participants : d.participants,
                from : d.from,
                to: d.to,
                casualities: d.casualties,
                displaced: d.displaced
            };
            //window.scrollTo(0, 800);
            if(current_data.values.length>0){
                d3.select(".bottom-chart").attr("height",900);
                draw_chart();
            }
        }
        for(var i = 0; i < conflict_data.length; i++){
            if(conflict_data[i].name != d.name){
                conflict_data[i].selected = false
            }
        }
        d3.select(".war-name").html(current_conflict.name + " (" + current_conflict.from.getFullYear() + " - " + current_conflict.to + " )");
        d3.selectAll(".casualties")
            .attr("fill",function(d){
                if(d.selected){
                    return "darkred";
                } else {
                    return "red";
                }
            });
        
    }


  /*
   * START OF WORLD MAP
   *
   */ 

    var format = d3.format(",");

    // Set tooltips
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset(function(d){
            if(d.properties.name == "Russia"){
                return [150, 160];
            } else if (d.properties.name == "Canada"){
                return [210,110];
            } else if (d.properties.name == "Norway"){
                return [160,-100];
            }
            else {
                return [-10,0];
            }
        })
        .html(function(d) {
            return "<strong>Country: </strong><span class='details'>" + d.properties.name + "</span>";
        });

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 1700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    var path = d3.geoPath();

    var svg = d3.select(".world-map")
    .attr("width", width)
    .attr("height", height)
    .append('g')
    .attr('class', 'map');

    var projection = d3.geoMercator()
        .scale(200)
        .translate( [width / 2, height / 1.6]);

    var path = d3.geoPath().projection(projection);

    svg.call(tip);


    data = polygon_data;
    

    svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d){
        if(countries_data.indexOf(d.properties.name) > -1){
            return "#AE6451";
        } else {
            return "gray";
        }
      } )
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
            if(countries_data.indexOf(d.properties.name) > -1){
                d3.select(this)
                .style("opacity", 1)
                .style("stroke","white")
                .style("stroke-width",3);
                var name = d.properties.name;
            tip.show(d);
          d3.select(this)
              .attr("fill","#D13C17");
          d3.selectAll(".displaced")
          .transition()
          .ease(d3.easeBack)
          .duration(700)
          .attr("opacity",function(d){  
            if(d.participants.indexOf(name) > -1){
                return 0.85;
            } else {
                return 0.8;
            }
          })
          .attr("r",function(d){
            if(d.participants.indexOf(name) > -1){
                return d.displaced_r*1.5;
            } else {
                return d.displaced_r;
            }
          });
        }
        })
        .on('mouseout', function(d){
            tip.hide(d);
            d3.select(this)
                .style("opacity", 0.8)
                .style("stroke","white")
                .style("stroke-width",0.3);
            d3.selectAll(".displaced")
            .transition()
            .duration(200)
            .attr("opacity",0.8)
            .attr("r",function(d){ return d.displaced_r; });
        });

    svg.append("path")
        .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
         // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
        .attr("class", "names")
        .attr("d", path);


    /*
     *
     *
     * DONE WITH MAP DATA
     *
     * NOW STARTING WITH GAPMINDER
     *
     *
     */
    var container = d3.select(".bottom-chart").attr("height",0);

    var clear = function() {
        var container = d3.select(".bottom-chart").attr("height",900);
        var container = d3.select(".bottom-chart");
        container.selectAll("*").remove();
        return container;
    }

    var current_data = {
        values : []
    };

    $("#aid").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");
        current_data.y_reverse = false;
        current_data.y_text = "Aid Received";
        current_data.values = aid_received_data;
        draw_chart();
    });
    $("#arms").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");
        current_data.y_reverse = false;
        current_data.y_text = "Arms export";
        current_data.values = arms_export_data;
        draw_chart();
    });
    $("#birth").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");
        current_data.y_reverse = false;
        current_data.y_text = "Birth Rate";
        current_data.values = birth_rate_data;
        draw_chart();
    });
    $("#childmort").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");
        current_data.y_reverse = false;
        current_data.y_text = "Child Mortality";
        current_data.values = child_mortality_data;
        draw_chart();
    });
    $("#debt").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");
        current_data.y_reverse = false;
        current_data.y_text = "Debt";
        current_data.values = debt_data;
        draw_chart();
    });
    $("#gdp").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");
        current_data.y_reverse = false;
        current_data.y_text = "GDP";
        current_data.values = GDP_data;
        draw_chart();
    });
    $("#age").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");
        current_data.y_reverse = false;
        current_data.y_text = "Median Age";
        current_data.values = median_age_data;
        draw_chart();
    });
    $("#cindep").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");
        current_data.y_reverse = true;
        current_data.child = true
        current_data.y_scale = {
            values: [1,2],
            label: ["not mentioned","mentioned"]};

        current_data.y_text = "child_independence";
        current_data.values = child_independence_data;
        draw_chart(y);
    });
    $("#family").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");
        current_data.y_reverse =true;

        current_data.y_scale = {
            values: [1,2,3,4],
            label: ['Very important',
            'Rather important',
            'Not very important',
            'Not at all important']};

        current_data.y_text = "family";
        current_data.values = family_data;
        draw_chart();
    });
    $("#happiness").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");
        current_data.y_reverse = true;

        current_data.y_scale = {
            values: [1,2,3,4],
            label: ["Very happy",
            "Rather happy",
            "Not very happy",
            "Not at all happy"]};

        current_data.y_text = "happiness";
        current_data.values = happiness_data;
        draw_chart();
    });
    $("#health").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");

        current_data.y_scale = {
            values: [1,2,3,4],
            label: ["Very good",
            "Good",
            "Fair",
            "Poor"]};
    
        current_data.y_reverse = true;
        current_data.y_text = "health";
        current_data.values = health_data;
        draw_chart();
    });
    $("#leasure").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");
        current_data.y_reverse = true;

        current_data.y_scale = {
            values: [1,2,3,4],
            label: ['Very important',
            'Rather important',
            'Not very important',
            'Not at all important']};

        current_data.y_text = "leasure time";
        current_data.values = leasure_time_data;
        draw_chart();
    });
    $("#politics").click(function(){
        $(".btn").removeClass("active");
        current_data.y_reverse = true;

        current_data.y_scale = {
            values: [1,2,3,4],
            label: ['Very important',
            'Rather important',
            'Not very important',
            'Not at all important']};

        current_data.y_text = "politics";
        current_data.values = politics_data;
        draw_chart();
    });
    $("#religion").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");
        current_data.y_reverse = true;

        current_data.y_scale = {
            values: [1,2,3,4],
            label: ['Very important',
            'Rather important',
            'Not very important',
            'Not at all important']};

        current_data.y_text = "religion";
        current_data.values = religion_data;
        draw_chart();
    });
    $("#work").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");
        current_data.y_reverse = true;

        current_data.y_scale = {
            values: [1,2,3,4],
            label: ['Very important',
            'Rather important',
            'Not very important',
            'Not at all important']};

        current_data.y_text = "work";
        current_data.values = work_data;
        draw_chart();
    });
    
    var draw_chart = function(y){
        var container = clear();
        d3.select(".chart").select("svg").remove();
        $('html, body').animate({
            scrollTop: $("#war-name").offset().top
        }, 1000);
        var bottomChart = new DataChart2(container,current_data,current_conflict);
        //window.scrollTo(0, 1600);
    }


}