// (function (global) {
    // var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    // height = Math.max(document.documentElement.clientHeight, window.innerHeight ||0); 
var	margin = {top: 50, right: 20, bottom: 30, left: 50},
	width = 700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    // Define the div for the tooltip
    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var svg = d3.select("#details")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// svg.attr("viewBox", "0 0 " + width + " " + height )
//     .attr("preserveAspectRatio", "xMinYMin");
// var zoom = d3.zoom()
//     .on("zoom", function () {
//         var transform = d3.zoomTransform(this);
//         map.attr("transform", "transform(" +
//                 d3.event.scale + ")");
//     });
 
//svg.call(zoom);
 
var map = svg.append("g")
    .attr("class", "map");
 
d3.queue()
    .defer(d3.json,"us-states.json")
    .defer(d3.json,"drivingdata.json")
    .await(function (error, us, data){
        if (error){
            console.error('oh dear, something went wrong: '+ error);
         }
        else {
            drawMap(us, data);
        }
    });
 
function drawMap(us, data){
 
    var projection = d3.geoAlbersUsa()
        .scale(800)
        .translate([width/2, height/3]);
 
    var path = d3.geoPath().projection(projection);
 
    var color = d3.scaleThreshold()
        .domain([2293, 4462, 6631, 8800, 10969, 13138])
        .range(["#034e7b", "#0570b0", "#74a9cf", "#fb6a4a", "#de2d26", "#b2182b"]);
 
    var features = us.features;
    var totalById = {};
    i=0;
    data.forEach(function (d) {
        totalById[d.state] = {Total: d.total, Prevalence: d.prevalence }
        if(d.state == us.features[i].properties.name){
            d.geometry=us.features[i].geometry;
        }
        i+=1;
       
        }  
    );
 
    us.features.forEach(function(d){
        d.details = totalById[d.properties.name] ? totalById[d.properties.name] : {};
    });
 
 
    map.append("g")
        .selectAll("path")
        .data(us.features)
        .enter().append("path")
        .attr("name", function (d) {
            return d.properties.name;
        })
        .attr("id", function (d) {
            return d.id;
        })
        .attr("d", path)
        .style("fill", function (d) {
            return d.details && d.details.Total ? color(d.details.Total) : undefined;
            })                             
        .on('mouseover', function (d) {
            d3.select(this)
                .style("stroke", "white")
                .style("stroke-width", 1)
                .style("cursor", "pointer");
 
            d3.select(".State")
                .text(d.properties.name);
 
            d3.select(".Total")
                .text(d.details && d.details.Total && "Total Fatalities: " + d.details.Total || "¯\\_(ツ)_/¯");
           
            d3.select(".Prevalence")
                .text(d.details && d.details.Prevalence && "Prevalence%: " + d.details.Prevalence || "¯\\_(ツ)_/¯");
 
            d3.select('.details')
                .style('visibility', "visible");
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .style("stroke", null)
                .style("stroke-width", 0.25);
 
            d3.select(".details")
                .style('visibility', "hidden");
        });
 
        svg.selectAll("circle")
        .data(data) 
        .enter()
        .append("circle") 
        .attr("cx", function(d){
                 return projection([d.longitude, d.latitude])[0];
                })
        .attr("cy",  function(d){
                return projection([d.longitude, d.latitude])[1];
                })
        .attr("r", function(d){
                return Math.sqrt(d.prevalance) * 4;
                } 
              )
        .style("fill", "#FDCC08")
        .style("opacity", 1)
        .on("mouseover", function(d) {		
            div.transition()
                .duration(100)		
                .style("opacity", 1);		
            div	.html(d.state  +  "<br/>Total Deaths:" + d.total + "<br/>Prevalance:" + d.prevalence )	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

   
     
        dsBarChart(data)
    }
/*
############# BAR CHART ###################
-------------------------------------------
*/

var 	formatAsPercentage = d3.format("%"),
		formatAsInteger = d3.format(",");


var datasetBarChart = [
    {state:"Texas",	latitude:  31.054487,	longitude: -97.563461,	prevalance: 2.1,	Total: 13138	},
    {state:"California",	latitude:36.116203,	longitude:-119.681564,	prevalance:1.8,	Total:10327	},
    {state:"Florida",	latitude:27.766279,	longitude:-81.686783,	prevalance:2.1,	Total:8476	},
    {state:"Pennsylvania",	latitude:40.590752,	longitude:-77.209755,	prevalance:1.8,	Total:4663	},
    {state:"North Carolina",	latitude:35.630066,	longitude:-79.806419,	prevalance:1.4,	Total:4102	},
    {state:"South Carolina",	latitude:33.856892,	longitude:-80.945007,	prevalance:1.6,	Total:3870	},
    {state:"Illinois",	latitude:40.349457,	longitude:-88.986137,	prevalance:2.2,	Total:3866	},
    {state:"New York",	latitude:42.165726,	longitude:-74.948051,	prevalance:1.4,	Total:3752	},
    {state:"Georgia",	latitude:33.040619,	longitude:-83.643074,	prevalance:1.4,	Total:3699	},
    {state:"Ohio",	latitude:40.388783,	longitude:-82.764915,	prevalance:2.2,	Total:3637	}   				

];

    
    function datasetBarChosen(data) {
        var ds = [];
        for (x in datasetBarChart) {
             if(datasetBarChart[x].state==group){
                 ds.push(datasetLineChart[x]);
             } 
            }
        return ds;
    }
    
    
    function dsBarChartBasics() {
    
            var margin = {top: 50, right: 20, bottom: 30, left: 20},
            width = 700 - margin.left - margin.right,
           height = 500 - margin.top - margin.bottom,
            barPadding = 1
            ;
            
            return {
                margin : margin, 
                width : width, 
                height : height, 
                barPadding : barPadding
            }			
            ;
    }
    
    function dsBarChart(data) {
    
                 	
        // cdata = crossfilter(data);
        
        // totalDeaths = cdata.dimension(function(d){
        //                                 return d["Total"]}
        //                             )
        //                     .group()
        //                     .top(10);

//        var totalDeaths = [];
        // data.forEach(function(d){
        //     totalDeaths.push(d.Total);
        //   });

        var firstDatasetBarChart = datasetBarChart;

        var basics = dsBarChartBasics();
        
        var margin = basics.margin,
            width = basics.width,
           height = basics.height,
            colorBar = basics.colorBar,
            barPadding = basics.barPadding;
                        
        
        var xScale = d3.scaleLinear()                           
                            .domain([0,firstDatasetBarChart.length])
                            .range([0, width]); 

        // Create linear y scale 
        // Purpose: No matter what the data is, the bar should fit into the svg area; bars should not
        // get higher than the svg height. Hence incoming data needs to be scaled to fit into the svg area.  
        var yScale = d3.scaleLinear()
                // use the max funtion to derive end point of the domain (max value of the dataset)
                // do not use the min value of the dataset as min of the domain as otherwise you will not see the first bar
               .domain([0, d3.max(firstDatasetBarChart, function(d) { return d.Total; })])
               // As coordinates are always defined from the top left corner, the y position of the bar
               // is the svg height minus the data value. So you basically draw the bar starting from the top. 
               // To have the y position calculated by the range function
               .range([height, 0])
               ;
        
        //Create SVG element
        
        var svg = d3.select("#chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("id","barChart");
                //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        var plot = svg
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
                    
        plot.selectAll("rect")
               .data(firstDatasetBarChart)
               .enter()
               .append("rect")
                .attr("x", function(d, i) {
                    return xScale(i);
                })
               .attr("width", width / firstDatasetBarChart.length - barPadding)   
                .attr("y", function(d) {
                    return yScale(d.Total);
                })  
                .attr("height", function(d) {
                    return height-yScale(d.Total);
                })
                .attr("fill", "lightblue");
        
            
        // Add y labels to plot	
        
        plot.selectAll("text")
        .data(firstDatasetBarChart)
        .enter()
        .append("text")
        .text(function(d) {
                return formatAsInteger(d.Total);
        })
        .attr("text-anchor", "middle")
        // Set x position to the left edge of each bar plus half the bar width
        .attr("x", function(d, i) {
                return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
        })
        .attr("y", function(d) {
                return yScale(d.Total) + 14;
        })
        .attr("class", "yAxis")
       	   
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");
        
        // Add x labels to chart	
        
        var xLabels = svg
                .append("g")
                .attr("transform", "translate("+ margin.left + "," + (margin.top+height) +")" );
        
        xLabels.selectAll("text.Axis")
              .data(firstDatasetBarChart)
              .enter()
              .append("text")
              .text(function(d) { return d.state;})
              .style("text-anchor", "start")
                // Set x position to the left edge of each bar plus half the bar width
              .attr("x", function(d, i) {  return xScale(i); })
              .attr("y",-20)
              .attr("class", "xAxis")
              .attr("style", "font-size: 12; font-family: Helvetica, sans-serif");			
         
        // Title
        
        svg.append("text")
            .attr("x", (width + margin.left + margin.right)/2)
            .attr("y", 15)
            .attr("class","title")				
            .attr("text-anchor", "middle")
            .text("Top States for accidents")
            ;
    }
    
    
     /* ** UPDATE CHART ** */
     
    /* updates bar chart on request */
    
    function updateBarChart(group, colorChosen) {
        
            var currentDatasetBarChart = datasetBarChosen(group);
            
            var basics = dsBarChartBasics();
        
            var margin = basics.margin,
                width = basics.width,
               height = basics.height,
                colorBar = basics.colorBar,
                barPadding = basics.barPadding
                ;
            
            var 	xScale = d3.scale.linear()
                .domain([0, currentDatasetBarChart.length])
                .range([0, width])
                ;
            
                
            var yScale = d3.scale.linear()
              .domain([0, d3.max(currentDatasetBarChart, function(d) { return d.measure; })])
              .range([height,0])
              ;
              
           var svg = d3.select("#barChart svg");
              
           var plot = d3.select("#barChartPlot")
               .datum(currentDatasetBarChart)
               ;
        
                  /* Note that here we only have to select the elements - no more appending! */
              plot.selectAll("rect")
              .data(currentDatasetBarChart)
              .transition()
                .duration(750)
                .attr("x", function(d, i) {
                    return xScale(i);
                })
               .attr("width", width / currentDatasetBarChart.length - barPadding)   
                .attr("y", function(d) {
                    return yScale(d.measure);
                })  
                .attr("height", function(d) {
                    return height-yScale(d.measure);
                })
                .attr("fill", colorChosen)
                ;
            
            plot.selectAll("text.yAxis") // target the text element(s) which has a yAxis class defined
                .data(currentDatasetBarChart)
                .transition()
                .duration(750)
               .attr("text-anchor", "middle")
               .attr("x", function(d, i) {
                       return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
               })
               .attr("y", function(d) {
                       return yScale(d.measure) + 14;
               })
               .text(function(d) {
                    return formatAsInteger(d3.round(d.measure));
               })
               .attr("class", "yAxis")					 
            ;
            
    
            svg.selectAll("text.title") // target the text element(s) which has a title class defined
                .attr("x", (width + margin.left + margin.right)/2)
                .attr("y", 15)
                .attr("class","title")				
                .attr("text-anchor", "middle")
                .text(group + "'s Sales Breakdown 2012")
            ;
    }
    
    