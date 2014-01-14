
// What programming languages have you used this year?
// http://code2013.herokuapp.com/

// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});

var drawChart = function(data) {
  // Create and populate the data table.
  var dataTable = google.visualization.arrayToDataTable(data, true);

  var options = {
    pieSliceText: 'value',
    'backgroundColor': '#ded',
    'width':700,
    'height':400
  };
  // Create and draw the visualization.
  new google.visualization.PieChart(document.getElementById('chart')).
      draw(dataTable, options);
}

$(document).ready(function() {

	$.get("/data.json", drawChart);

});

