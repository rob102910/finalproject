//page 297 is geo stuff
var geoP = d3.json("world.geojson")
var happyP = d3.csv("2017.csv")

Promise.all([geoP,happyP])
       .then(function(values)
{
  var geoData = values[0]
  var happyData = values[1]

  var happyDict = {}
  happyData.forEach(function(happy)
  {

  happyDict[happy.Country.trim()] = happy;
  })
  // state.Dict.Alabama gives you Alabama
  // stateDict.['New York']  gives you New York
  geoData.features.forEach(function(country)
{
  //console.log(country.properties);
  if (happyDict[country.properties.name] != null)
  {
  country.properties.rank = happyDict[country.properties.name].HappinessRank
  country.properties.happiness = happyDict[country.properties.name].HappinessScore
  country.properties.GDP = happyDict[country.properties.name].EconomyGDPperCapita
  country.properties.family = happyDict[country.properties.name].Family
  country.properties.health = happyDict[country.properties.name].HealthLifeExpectancy
  country.properties.freedom = happyDict[country.properties.name].Freedom
  country.properties.generosity = happyDict[country.properties.name].Generosity
  country.properties.gov = happyDict[country.properties.name].TrustGovernmentCorruption
  country.properties.distopia = happyDict[country.properties.name].DystopiaResidual}
  else
  {
  country.properties.rank = "none"
  country.properties.happiness = "none"
  country.properties.GDP = "none"
  country.properties.family = "none"
  country.properties.health = "none"
  country.properties.freedom = "none"
  country.properties.generosity = "none"
  country.properties.gov = "none"
  country.properties.distopia = "none"}

})
//console.log(geoData)
drawMap(geoData)
drawButtons(geoData)
//drawMap(geoData)

})

var drawButtons = function(geoData)
{
  d3.select("#buttons")
    .append("button")
    .text("Happiness Map")
    .attr("id","first")
    .attr("style","width:60px;height:30px;")
    .on("click",function(){drawMap2(geoData)});

  d3.select("#buttons")
    .append("button")
    .text("Economy Map")
    .attr("id","GDP")
    .on("click",function(){drawEconomy(geoData)});

  d3.select("#buttons")
    .append("button")
    .text("Family Map")
    .attr("id","GDP")
    .on("click",function(){drawFamily(geoData)});

  d3.select("#buttons")
    .append("button")
    .text("Health Map")
    .attr("id","GDP")
    .on("click",function(){drawHealth(geoData)});

  d3.select("#buttons")
    .append("button")
    .text("Freedom Map")
    .attr("id","GDP")
    .on("click",function(){drawFreedom(geoData)});

  d3.select("#buttons")
    .append("button")
    .text("Generosity Map")
    .attr("id","GDP")
    .on("click",function(){drawGenerosity(geoData)});

  d3.select("#buttons")
    .append("button")
    .text("Gov.Trust Map")
    .attr("id","GDP")
    .on("click",function(){drawTrust(geoData)});

  d3.select("#buttons")
    .append("button")
    .text("Others Map")
    .attr("id","GDP")
    .on("click",function(){drawOther(geoData)});
}

var drawMap = function(geoData)
{

  var screen = {width:1750,height:920}
  var projection = d3.geoEquirectangular()
                     .translate([screen.width/2,(screen.height/2)+20])
                     .scale([275]);
  var svg = d3.select("svg")
              .attr("width",screen.width)
              .attr("height",screen.height)
              .attr("style","background-color:darkblue;");

svg.append("text")
   .text("Happiness Map")
   .attr("font-size","40px")
   .attr("x",750)
   .attr("y",40)
   .attr("stroke","white");

  var country = svg.append("g").attr("id","c")
                  .selectAll("g")
                  .data(geoData.features)
                  .enter()
                  .append("g")
                  .classed("c",true);


var countryGenerator = d3.geoPath()
                         .projection(projection);
console.log(geoData.features)
  country.append("path")
  .attr("d",countryGenerator)
  .attr("stroke","black")
  .attr("stroke-width","3.5")
  .attr("fill",function(d){
    console.log(d.properties.happiness)
    if(d.properties.happiness >= 7)
    { return "#ffff00";}
    if(d.properties.happiness >= 6 && d.properties.happiness < 7)
    { return "#ff9900";}
    if(d.properties.happiness >= 5 && d.properties.happiness < 6)
    { return "#d62929";}
    if(d.properties.happiness >= 4 && d.properties.happiness < 5)
    { return "#6b1414";}
    if(d.properties.happiness < 4)
    { return "#000000";}
    if(d.properties.happiness == "none")
    { return "lightgrey";}
    else
    {return "blue"}
  })
  .on("mouseover", function(d) {
            d3.select("#tool")
              .transition()
              .duration(200)
              .style("opacity", .9)
              .style("left",countryGenerator.centroid(d)[0]-100+"px")
              .style("top",countryGenerator.centroid(d)[1]+275+"px");

            d3.select("#c")
              .text(d.properties.name);

            d3.select("#h")
              .text((d.properties.happiness).substring(0,4));

            d3.select("#p")
              .text("Happiness Rank: ");

            d3.select("#n")
              .text(d.properties.rank);

            })

  .on("mouseout", function(d) {
            d3.select("#tool")
              .transition()
              .duration(200)
              .style("opacity", 0)});


// country.append("text")
//       .text(function(d) {return d.properties.name;})
//       .attr("font-size","10px")
//       .attr("x",function(d) {return countryGenerator.centroid(d)[0];})
//       .attr("y",function(d) {return countryGenerator.centroid(d)[1];})
//       .attr("fill","grey");

var keydata = [{num:"7 +",color:"#ffff00"},{num:"6-7",color:"#ff9900"},{num:"5-6",color:"#d62929"},{num:"4-5",color:"#6b1414"},{num:"4 -",color:"#000000"},{num:"No Info",color:"lightgrey"}]


var keyg = svg.append("g").attr("id","legend");

var largerect = keyg.append("rect")
                    .attr("x",80)
                    .attr("y",460)
                    .attr("width",175)
                    .attr("height",200)
                    .attr("fill","#0D1B3E");

keyg.append("text")
    .text("Happiness Score (1-10)")
    .attr("x",105)
    .attr("y",480)
    .attr("stroke","white")
    .attr("font-size","14px");

var key = keyg.selectAll("g")
              .data(keydata)
              .enter()
              .append("g")
              .attr("id","key");

key.append("rect")
   .attr("width",20)
   .attr("height",20)
   .attr("x",100)
   .attr("y",function(d,i){
     return 510+(i*22)
   })
   .attr("fill",function(d,i){
 return d.color});

key.append("text")
   .text(function(d){return d.num})
   .attr("x",130)
   .attr("y",function(d,i){
     return 525+(i*22)
   })
   .attr("stroke","white")
   .attr("stroke-width","1")
   .attr("font-size","14px");
             // .append("rect")
             // .attr("width",200)
             // .attr("height",400)
             // .attr("x",200)
             // .attr("y",500);



}

var drawMap2 = function(geoData)
{
  d3.select("svg").select("text")
     .text("Happiness Map");

  d3.selectAll(".c").select("path")
                  .data(geoData.features)
                  .transition()
                  .duration(1000)
                  .attr("stroke","black")
                  .attr("fill",function(d){
                    //console.log(d.properties.happiness)
                    if(d.properties.happiness >= 7)
                    { return "#ffff00";}
                    if(d.properties.happiness >= 6 && d.properties.happiness < 7)
                    { return "#ff9900";}
                    if(d.properties.happiness >= 5 && d.properties.happiness < 6)
                    { return "#d62929";}
                    if(d.properties.happiness >= 4 && d.properties.happiness < 5)
                    { return " #6b1414";}
                    if(d.properties.happiness < 4)
                    { return "#000000";}
                    if(d.properties.happiness == "none")
                    { return "lightgrey";}
                    else
                    {return "blue"}
                  });

}

var drawEconomy = function(geoData)
{
  d3.select("svg").select("text")
     .text("Economy Map");

  d3.selectAll(".c").select("path")
                  .data(geoData.features)
                  .transition()
                  .duration(1000)
                  .attr("fill",function(d){
                  //console.log(d.properties.GDP/d.properties.happiness)
                  if(d.properties.GDP/d.properties.happiness >= .3)
                  { return "#001a00";}
                  if(d.properties.GDP/d.properties.happiness >= .25 && d.properties.GDP/d.properties.happiness < .3)
                  { return "#006600";}
                  if(d.properties.GDP/d.properties.happiness >= .2 && d.properties.GDP/d.properties.happiness < .25)
                  { return "#00cc00";}
                  if(d.properties.GDP/d.properties.happiness >= .15 && d.properties.GDP/d.properties.happiness < .2)
                  { return "#00ff99";}
                  if(d.properties.GDP/d.properties.happiness >= .1 && d.properties.GDP/d.properties.happiness < .15)
                  { return "#66ffcc";}
                  if(d.properties.GDP/d.properties.happiness >= .05 && d.properties.GDP/d.properties.happiness < .1)
                  { return "#66ffff";}
                  if(d.properties.GDP/d.properties.happiness < .05)
                  { return "#b3ffff";}
                  if(d.properties.GDP == "none")
                  { return "lightgrey";}
                  })
                  .attr("stroke",function(d){
                      if(d.properties.happiness >= 7)
                      { return "#ffff00";}
                      if(d.properties.happiness >= 6 && d.properties.happiness < 7)
                      { return "#ff9900";}
                      if(d.properties.happiness >= 5 && d.properties.happiness < 6)
                      { return "#d62929";}
                      if(d.properties.happiness >= 4 && d.properties.happiness < 5)
                      { return " #6b1414";}
                      if(d.properties.happiness < 4)
                      { return "#000000";}
                      if(d.properties.happiness == "none")
                      { return "white";}
                    });

var keydata2 = [{num:"30% +",color:"#001a00"},{num:"25-30%",color:"#006600"},{num:"20-25%",color:"#00cc00"},{num:"15-20%",color:"#00ff99"},{num:"10-15%",color:"#66ffcc"},{num:"5-10%",color:"#66ffff"},{num:"5% -",color:"#b3ffff"},{num:"No Info",color:"lightgrey"}]


var keyg2 = d3.select("svg").append("g").attr("id","legend2");

var largerect2 = keyg2.append("rect")
                    .attr("x",280)
                    .attr("y",460)
                    .attr("width",175)
                    .attr("height",240)
                    .attr("fill","#0D1B3E");

keyg2.append("text")
    .text("Percent of Happiness Score")
    .attr("x",290)
    .attr("y",480)
    .attr("stroke","white")
    .attr("font-size","14px");

keyg2.append("text")
    .text("Attributed to Factor")
    .attr("x",315)
    .attr("y",500)
    .attr("stroke","white")
    .attr("font-size","14px");


var key2 = keyg2.selectAll("g")
              .data(keydata2)
              .enter()
              .append("g")
              .attr("id","key");

key2.append("rect")
   .attr("width",20)
   .attr("height",20)
   .attr("x",300)
   .attr("y",function(d,i){
     return 510+(i*22)
   })
   .attr("fill",function(d,i){
 return d.color});

key2.append("text")
   .text(function(d){return d.num})
   .attr("x",330)
   .attr("y",function(d,i){
     return 525+(i*22)
   })
   .attr("stroke","white")
   .attr("stroke-width","1")
   .attr("font-size","14px");


}

var drawFamily = function(geoData)
{
  d3.select("svg").select("text")
     .text("Family Map");

  d3.selectAll(".c").select("path")
                  .data(geoData.features)
                  .transition()
                  .duration(1000)
                  .attr("fill",function(d){
                  console.log(d.properties.family/d.properties.happiness)
                  if(d.properties.family/d.properties.happiness >= .3)
                  { return "#001a00";}
                  if(d.properties.family/d.properties.happiness >= .25 && d.properties.family/d.properties.happiness < .3)
                  { return "#006600";}
                  if(d.properties.family/d.properties.happiness >= .2 && d.properties.family/d.properties.happiness < .25)
                  { return "#00cc00";}
                  if(d.properties.family/d.properties.happiness >= .15 && d.properties.family/d.properties.happiness < .2)
                  { return "#00ff99";}
                  if(d.properties.family/d.properties.happiness >= .1 && d.properties.family/d.properties.happiness < .15)
                  { return "#66ffcc";}
                  if(d.properties.family/d.properties.happiness >= .05 && d.properties.family/d.properties.happiness < .1)
                  { return "#66ffff";}
                  if(d.properties.family/d.properties.happiness < .05)
                  { return "#b3ffff";}
                  if(d.properties.family == "none")
                  { return "lightgrey";}
                  else
                  {return "blue"}
                })
                .attr("stroke",function(d){
                    if(d.properties.happiness >= 7)
                    { return "#ffff00";}
                    if(d.properties.happiness >= 6 && d.properties.happiness < 7)
                    { return "#ff9900";}
                    if(d.properties.happiness >= 5 && d.properties.happiness < 6)
                    { return "#d62929";}
                    if(d.properties.happiness >= 4 && d.properties.happiness < 5)
                    { return " #6b1414";}
                    if(d.properties.happiness < 4)
                    { return "#000000";}
                    if(d.properties.happiness == "none")
                    { return "white";}
                  });

                  var keydata2 = [{num:"30% +",color:"#001a00"},{num:"25-30%",color:"#006600"},{num:"20-25%",color:"#00cc00"},{num:"15-20%",color:"#00ff99"},{num:"10-15%",color:"#66ffcc"},{num:"5-10%",color:"#66ffff"},{num:"5% -",color:"#b3ffff"},{num:"No Info",color:"lightgrey"}]


                  var keyg2 = d3.select("svg").append("g").attr("id","legend2");

                  var largerect2 = keyg2.append("rect")
                                      .attr("x",280)
                                      .attr("y",460)
                                      .attr("width",175)
                                      .attr("height",240)
                                      .attr("fill","#0D1B3E");

                  keyg2.append("text")
                      .text("Percent of Happiness Score")
                      .attr("x",290)
                      .attr("y",480)
                      .attr("stroke","white")
                      .attr("font-size","14px");

                  keyg2.append("text")
                      .text("Attributed to Factor")
                      .attr("x",315)
                      .attr("y",500)
                      .attr("stroke","white")
                      .attr("font-size","14px");


                  var key2 = keyg2.selectAll("g")
                                .data(keydata2)
                                .enter()
                                .append("g")
                                .attr("id","key");

                  key2.append("rect")
                     .attr("width",20)
                     .attr("height",20)
                     .attr("x",300)
                     .attr("y",function(d,i){
                       return 510+(i*22)
                     })
                     .attr("fill",function(d,i){
                   return d.color});

                  key2.append("text")
                     .text(function(d){return d.num})
                     .attr("x",330)
                     .attr("y",function(d,i){
                       return 525+(i*22)
                     })
                     .attr("stroke","white")
                     .attr("stroke-width","1")
                     .attr("font-size","14px");

}

var drawHealth = function(geoData)
{
  d3.select("svg").select("text")
     .text("Health Map");

  d3.selectAll(".c").select("path")
                  .data(geoData.features)
                  .transition()
                  .duration(1000)
                  .attr("fill",function(d){
                  console.log(d.properties.health)
                  if(d.properties.health/d.properties.happiness >= .3)
                  { return "#001a00";}
                  if(d.properties.health/d.properties.happiness >= .25 && d.properties.health/d.properties.happiness < .3)
                  { return "#006600";}
                  if(d.properties.health/d.properties.happiness >= .2 && d.properties.health/d.properties.happiness < .25)
                  { return "#00cc00";}
                  if(d.properties.health/d.properties.happiness >= .15 && d.properties.health/d.properties.happiness < .2)
                  { return "#00ff99";}
                  if(d.properties.health/d.properties.happiness >= .1 && d.properties.health/d.properties.happiness < .15)
                  { return "#66ffcc";}
                  if(d.properties.health/d.properties.happiness >= .05 && d.properties.health/d.properties.happiness < .1)
                  { return "#66ffff";}
                  if(d.properties.health/d.properties.happiness < .05)
                  { return "#b3ffff";}
                  if(d.properties.health == "none")
                  { return "lightgrey";}
                  })
                  .attr("stroke",function(d){
                      if(d.properties.happiness >= 7)
                      { return "#ffff00";}
                      if(d.properties.happiness >= 6 && d.properties.happiness < 7)
                      { return "#ff9900";}
                      if(d.properties.happiness >= 5 && d.properties.happiness < 6)
                      { return "#d62929";}
                      if(d.properties.happiness >= 4 && d.properties.happiness < 5)
                      { return " #6b1414";}
                      if(d.properties.happiness < 4)
                      { return "#000000";}
                      if(d.properties.happiness == "none")
                      { return "white";}
                    });

                    var keydata2 = [{num:"30% +",color:"#001a00"},{num:"25-30%",color:"#006600"},{num:"20-25%",color:"#00cc00"},{num:"15-20%",color:"#00ff99"},{num:"10-15%",color:"#66ffcc"},{num:"5-10%",color:"#66ffff"},{num:"5% -",color:"#b3ffff"},{num:"No Info",color:"lightgrey"}]


                    var keyg2 = d3.select("svg").append("g").attr("id","legend2");

                    var largerect2 = keyg2.append("rect")
                                        .attr("x",280)
                                        .attr("y",460)
                                        .attr("width",175)
                                        .attr("height",240)
                                        .attr("fill","#0D1B3E");

                    keyg2.append("text")
                        .text("Percent of Happiness Score")
                        .attr("x",290)
                        .attr("y",480)
                        .attr("stroke","white")
                        .attr("font-size","14px");

                    keyg2.append("text")
                        .text("Attributed to Factor")
                        .attr("x",315)
                        .attr("y",500)
                        .attr("stroke","white")
                        .attr("font-size","14px");


                    var key2 = keyg2.selectAll("g")
                                  .data(keydata2)
                                  .enter()
                                  .append("g")
                                  .attr("id","key");

                    key2.append("rect")
                       .attr("width",20)
                       .attr("height",20)
                       .attr("x",300)
                       .attr("y",function(d,i){
                         return 510+(i*22)
                       })
                       .attr("fill",function(d,i){
                     return d.color});

                    key2.append("text")
                       .text(function(d){return d.num})
                       .attr("x",330)
                       .attr("y",function(d,i){
                         return 525+(i*22)
                       })
                       .attr("stroke","white")
                       .attr("stroke-width","1")
                       .attr("font-size","14px");

}

var drawFreedom = function(geoData)
{
  d3.select("svg").select("text")
     .text("Freedom Map");

  d3.selectAll(".c").select("path")
                  .data(geoData.features)
                  .transition()
                  .duration(1000)
                  .attr("fill",function(d){
                  console.log(d.properties.freedom)
                  if(d.properties.freedom/d.properties.happiness >= .3)
                  { return "#001a00";}
                  if(d.properties.freedom/d.properties.happiness >= .25 && d.properties.freedom/d.properties.happiness < .3)
                  { return "#006600";}
                  if(d.properties.freedom/d.properties.happiness >= .2 && d.properties.freedom/d.properties.happiness < .25)
                  { return "#00cc00";}
                  if(d.properties.freedom/d.properties.happiness >= .15 && d.properties.freedom/d.properties.happiness < .2)
                  { return "#00ff99";}
                  if(d.properties.freedom/d.properties.happiness >= .1 && d.properties.freedom/d.properties.happiness < .15)
                  { return "#66ffcc";}
                  if(d.properties.freedom/d.properties.happiness >= .05 && d.properties.freedom/d.properties.happiness < .1)
                  { return "#66ffff";}
                  if(d.properties.freedom/d.properties.happiness < .05)
                  { return "#b3ffff";}
                  if(d.properties.freedom == "none")
                  { return "lightgrey";}
                  })
                  .attr("stroke",function(d){
                      if(d.properties.happiness >= 7)
                      { return "#ffff00";}
                      if(d.properties.happiness >= 6 && d.properties.happiness < 7)
                      { return "#ff9900";}
                      if(d.properties.happiness >= 5 && d.properties.happiness < 6)
                      { return "#d62929";}
                      if(d.properties.happiness >= 4 && d.properties.happiness < 5)
                      { return " #6b1414";}
                      if(d.properties.happiness < 4)
                      { return "#000000";}
                      if(d.properties.happiness == "none")
                      { return "white";}
                    });

                    var keydata2 = [{num:"30% +",color:"#001a00"},{num:"25-30%",color:"#006600"},{num:"20-25%",color:"#00cc00"},{num:"15-20%",color:"#00ff99"},{num:"10-15%",color:"#66ffcc"},{num:"5-10%",color:"#66ffff"},{num:"5% -",color:"#b3ffff"},{num:"No Info",color:"lightgrey"}]


                    var keyg2 = d3.select("svg").append("g").attr("id","legend2");

                    var largerect2 = keyg2.append("rect")
                                        .attr("x",280)
                                        .attr("y",460)
                                        .attr("width",175)
                                        .attr("height",240)
                                        .attr("fill","#0D1B3E");

                    keyg2.append("text")
                        .text("Percent of Happiness Score")
                        .attr("x",290)
                        .attr("y",480)
                        .attr("stroke","white")
                        .attr("font-size","14px");

                    keyg2.append("text")
                        .text("Attributed to Factor")
                        .attr("x",315)
                        .attr("y",500)
                        .attr("stroke","white")
                        .attr("font-size","14px");


                    var key2 = keyg2.selectAll("g")
                                  .data(keydata2)
                                  .enter()
                                  .append("g")
                                  .attr("id","key");

                    key2.append("rect")
                       .attr("width",20)
                       .attr("height",20)
                       .attr("x",300)
                       .attr("y",function(d,i){
                         return 510+(i*22)
                       })
                       .attr("fill",function(d,i){
                     return d.color});

                    key2.append("text")
                       .text(function(d){return d.num})
                       .attr("x",330)
                       .attr("y",function(d,i){
                         return 525+(i*22)
                       })
                       .attr("stroke","white")
                       .attr("stroke-width","1")
                       .attr("font-size","14px");

}

var drawGenerosity = function(geoData)
{
  d3.select("svg").select("text")
     .text("Generosity Map");

  d3.selectAll(".c").select("path")
                  .data(geoData.features)
                  .transition()
                  .duration(1000)
                  .attr("fill",function(d){
                  console.log(d.properties.generosity)
                  if(d.properties.generosity/d.properties.happiness >= .3)
                  { return "#001a00";}
                  if(d.properties.generosity/d.properties.happiness >= .25 && d.properties.generosity/d.properties.happiness < .3)
                  { return "#006600";}
                  if(d.properties.generosity/d.properties.happiness >= .2 && d.properties.generosity/d.properties.happiness < .25)
                  { return "#00cc00";}
                  if(d.properties.generosity/d.properties.happiness >= .15 && d.properties.generosity/d.properties.happiness < .2)
                  { return "#00ff99";}
                  if(d.properties.generosity/d.properties.happiness >= .1 && d.properties.generosity/d.properties.happiness < .15)
                  { return "#66ffcc";}
                  if(d.properties.generosity/d.properties.happiness >= .05 && d.properties.generosity/d.properties.happiness < .1)
                  { return "#66ffff";}
                  if(d.properties.generosity/d.properties.happiness < .05)
                  { return "#b3ffff";}
                  if(d.properties.generosity == "none")
                  { return "lightgrey";}
                  })
                  .attr("stroke",function(d){
                      if(d.properties.happiness >= 7)
                      { return "#ffff00";}
                      if(d.properties.happiness >= 6 && d.properties.happiness < 7)
                      { return "#ff9900";}
                      if(d.properties.happiness >= 5 && d.properties.happiness < 6)
                      { return "#d62929";}
                      if(d.properties.happiness >= 4 && d.properties.happiness < 5)
                      { return " #6b1414";}
                      if(d.properties.happiness < 4)
                      { return "#000000";}
                      if(d.properties.happiness == "none")
                      { return "white";}
                    });

                    var keydata2 = [{num:"30% +",color:"#001a00"},{num:"25-30%",color:"#006600"},{num:"20-25%",color:"#00cc00"},{num:"15-20%",color:"#00ff99"},{num:"10-15%",color:"#66ffcc"},{num:"5-10%",color:"#66ffff"},{num:"5% -",color:"#b3ffff"},{num:"No Info",color:"lightgrey"}]


                    var keyg2 = d3.select("svg").append("g").attr("id","legend2");

                    var largerect2 = keyg2.append("rect")
                                        .attr("x",280)
                                        .attr("y",460)
                                        .attr("width",175)
                                        .attr("height",240)
                                        .attr("fill","#0D1B3E");

                    keyg2.append("text")
                        .text("Percent of Happiness Score")
                        .attr("x",290)
                        .attr("y",480)
                        .attr("stroke","white")
                        .attr("font-size","14px");

                    keyg2.append("text")
                        .text("Attributed to Factor")
                        .attr("x",315)
                        .attr("y",500)
                        .attr("stroke","white")
                        .attr("font-size","14px");


                    var key2 = keyg2.selectAll("g")
                                  .data(keydata2)
                                  .enter()
                                  .append("g")
                                  .attr("id","key");

                    key2.append("rect")
                       .attr("width",20)
                       .attr("height",20)
                       .attr("x",300)
                       .attr("y",function(d,i){
                         return 510+(i*22)
                       })
                       .attr("fill",function(d,i){
                     return d.color});

                    key2.append("text")
                       .text(function(d){return d.num})
                       .attr("x",330)
                       .attr("y",function(d,i){
                         return 525+(i*22)
                       })
                       .attr("stroke","white")
                       .attr("stroke-width","1")
                       .attr("font-size","14px");

}

var drawTrust = function(geoData)
{
  d3.select("svg").select("text")
     .text("Government Trust Map");

  d3.selectAll(".c").select("path")
                  .data(geoData.features)
                  .transition()
                  .duration(1000)
                  .attr("fill",function(d){
                  console.log(d.properties.gov)
                  if(d.properties.gov/d.properties.happiness >= .3)
                  { return "#001a00";}
                  if(d.properties.gov/d.properties.happiness >= .25 && d.properties.gov/d.properties.happiness < .3)
                  { return "#006600";}
                  if(d.properties.gov/d.properties.happiness >= .2 && d.properties.gov/d.properties.happiness < .25)
                  { return "#00cc00";}
                  if(d.properties.gov/d.properties.happiness >= .15 && d.properties.gov/d.properties.happiness < .2)
                  { return "#00ff99";}
                  if(d.properties.gov/d.properties.happiness >= .1 && d.properties.gov/d.properties.happiness < .15)
                  { return "#66ffcc";}
                  if(d.properties.gov/d.properties.happiness >= .05 && d.properties.gov/d.properties.happiness < .1)
                  { return "#66ffff";}
                  if(d.properties.gov/d.properties.happiness < .05)
                  { return "#b3ffff";}
                  if(d.properties.gov == "none")
                  { return "lightgrey";}
                  })
                  .attr("stroke",function(d){
                      if(d.properties.happiness >= 7)
                      { return "#ffff00";}
                      if(d.properties.happiness >= 6 && d.properties.happiness < 7)
                      { return "#ff9900";}
                      if(d.properties.happiness >= 5 && d.properties.happiness < 6)
                      { return "#d62929";}
                      if(d.properties.happiness >= 4 && d.properties.happiness < 5)
                      { return " #6b1414";}
                      if(d.properties.happiness < 4)
                      { return "#000000";}
                      if(d.properties.happiness == "none")
                      { return "white";}
                    });

                    var keydata2 = [{num:"30% +",color:"#001a00"},{num:"25-30%",color:"#006600"},{num:"20-25%",color:"#00cc00"},{num:"15-20%",color:"#00ff99"},{num:"10-15%",color:"#66ffcc"},{num:"5-10%",color:"#66ffff"},{num:"5% -",color:"#b3ffff"},{num:"No Info",color:"lightgrey"}]


                    var keyg2 = d3.select("svg").append("g").attr("id","legend2");

                    var largerect2 = keyg2.append("rect")
                                        .attr("x",280)
                                        .attr("y",460)
                                        .attr("width",175)
                                        .attr("height",240)
                                        .attr("fill","#0D1B3E");

                    keyg2.append("text")
                        .text("Percent of Happiness Score")
                        .attr("x",290)
                        .attr("y",480)
                        .attr("stroke","white")
                        .attr("font-size","14px");

                    keyg2.append("text")
                        .text("Attributed to Factor")
                        .attr("x",315)
                        .attr("y",500)
                        .attr("stroke","white")
                        .attr("font-size","14px");


                    var key2 = keyg2.selectAll("g")
                                  .data(keydata2)
                                  .enter()
                                  .append("g")
                                  .attr("id","key");

                    key2.append("rect")
                       .attr("width",20)
                       .attr("height",20)
                       .attr("x",300)
                       .attr("y",function(d,i){
                         return 510+(i*22)
                       })
                       .attr("fill",function(d,i){
                     return d.color});

                    key2.append("text")
                       .text(function(d){return d.num})
                       .attr("x",330)
                       .attr("y",function(d,i){
                         return 525+(i*22)
                       })
                       .attr("stroke","white")
                       .attr("stroke-width","1")
                       .attr("font-size","14px");

}

var drawOther = function(geoData)
{
  d3.select("svg").select("text")
     .text("Other Factors Map");

  d3.selectAll(".c").select("path")
                  .data(geoData.features)
                  .transition()
                  .duration(1000)
                  .attr("fill",function(d){
                  console.log(d.properties.distopia)
                  if(d.properties.distopia/d.properties.happiness >= .3)
                  { return "#001a00";}
                  if(d.properties.distopia/d.properties.happiness >= .25 && d.properties.distopia/d.properties.happiness < .3)
                  { return "#006600";}
                  if(d.properties.distopia/d.properties.happiness >= .2 && d.properties.distopia/d.properties.happiness < .25)
                  { return "#00cc00";}
                  if(d.properties.distopia/d.properties.happiness >= .15 && d.properties.distopia/d.properties.happiness < .2)
                  { return "#00ff99";}
                  if(d.properties.distopia/d.properties.happiness >= .1 && d.properties.distopia/d.properties.happiness < .15)
                  { return "#66ffcc";}
                  if(d.properties.distopia/d.properties.happiness >= .05 && d.properties.distopia/d.properties.happiness < .1)
                  { return "#66ffff";}
                  if(d.properties.distopia/d.properties.happiness < .05)
                  { return "#b3ffff";}
                  if(d.properties.distopia == "none")
                  { return "lightgrey";}
                  })
                  .attr("stroke",function(d){
                      if(d.properties.happiness >= 7)
                      { return "#ffff00";}
                      if(d.properties.happiness >= 6 && d.properties.happiness < 7)
                      { return "#ff9900";}
                      if(d.properties.happiness >= 5 && d.properties.happiness < 6)
                      { return "#d62929";}
                      if(d.properties.happiness >= 4 && d.properties.happiness < 5)
                      { return " #6b1414";}
                      if(d.properties.happiness < 4)
                      { return "#000000";}
                      if(d.properties.happiness == "none")
                      { return "white";}
                    });

                    var keydata2 = [{num:"30% +",color:"#001a00"},{num:"25-30%",color:"#006600"},{num:"20-25%",color:"#00cc00"},{num:"15-20%",color:"#00ff99"},{num:"10-15%",color:"#66ffcc"},{num:"5-10%",color:"#66ffff"},{num:"5% -",color:"#b3ffff"},{num:"No Info",color:"lightgrey"}]


                    var keyg2 = d3.select("svg").append("g").attr("id","legend2");

                    var largerect2 = keyg2.append("rect")
                                        .attr("x",280)
                                        .attr("y",460)
                                        .attr("width",175)
                                        .attr("height",240)
                                        .attr("fill","#0D1B3E");

                    keyg2.append("text")
                        .text("Percent of Happiness Score")
                        .attr("x",290)
                        .attr("y",480)
                        .attr("stroke","white")
                        .attr("font-size","14px");

                    keyg2.append("text")
                        .text("Attributed to Factor")
                        .attr("x",315)
                        .attr("y",500)
                        .attr("stroke","white")
                        .attr("font-size","14px");


                    var key2 = keyg2.selectAll("g")
                                  .data(keydata2)
                                  .enter()
                                  .append("g")
                                  .attr("id","key");

                    key2.append("rect")
                       .attr("width",20)
                       .attr("height",20)
                       .attr("x",300)
                       .attr("y",function(d,i){
                         return 510+(i*22)
                       })
                       .attr("fill",function(d,i){
                     return d.color});

                    key2.append("text")
                       .text(function(d){return d.num})
                       .attr("x",330)
                       .attr("y",function(d,i){
                         return 525+(i*22)
                       })
                       .attr("stroke","white")
                       .attr("stroke-width","1")
                       .attr("font-size","14px");

}
// .on("mouseover",function(d){
//   d3.select(this).attr("stroke","yellow")
//
// })
