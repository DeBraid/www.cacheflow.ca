d3.csv('nhldata.csv', function(data){
  
var dataset = d3.nest()
        .key(function(d) { return d.Team; })
        .sortKeys(d3.ascending)
        .entries(data);


  console.log("dataset below")
  console.log(dataset);
  
  // fetch a value in the nested data

  console.log( dataset[0].values[0].CA );

  // goals against
  console.log( dataset[0].values[0].GA );

  // Save percentages

  // categ (y-value of horiz bar chart)
  var team = function (dataset) { return d.Team; };

  // dollars (x-value - lengths of bars)
  // sortable: can pick any metric
  var bars = [ data = some_metric ];

  //style, color array 
  var colors = ['#fff', '#e0e0e0', '#e8e8e8', ...];
  


});


