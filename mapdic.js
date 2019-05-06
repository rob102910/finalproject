// This shows how to merge sets of data?

var geoP = d3.json("idk yet")
var stateP = d3.json("state data")

Promise.all([geoP,stateP])
       .then(function(geoData)
{
  var geoData = values[0];
  var stateData = values[1];

  var stateDict = {}
  stateData.forEach(function(state)
  {
  stateDict[state.NAME.trim()] = state;
  })
  // state.Dict.Alabama gives you Alabama
  // stateDict.['New York']  gives you New York

  geoData.features.forEach(function(state)
{
  state.properties.ABBR = stateDict[state.properties.name].ABBR
})

})

var drawMap = function(geoData)
{

  var screen = {width:700,height:600}
  var projection = d3.geoAlbersUsa();
  var svg = d3.select("svg")
              .attr("width")
              .attr("height");

  var states = svg.append("g").attr("id","states")
                  .selectAll("g")
                  .data(geoData)
                  .enter()
                  .append("g")
                  .classed("state",true);


var stateGenerator = d3.geoPath()
                       .projection(projection);

  states.append("path")
  .attr("d",function(d)
{
  return stateGenerator
})
  .attr("stoke","red")
  .attr("fill","none");

  states.append("text")
        .text(function(d) {return d.properties.ABBR;}
        .attr("x",function(d) {return stateGenerator.centroid(d)[0];})
        .attr("y",function(d) {return stateGenerator.centroid(d)[1];})

}
