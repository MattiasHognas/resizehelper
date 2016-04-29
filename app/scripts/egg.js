var rows = 8;
var cols = 8;
var colors = [
  [
    'blue',
    'pink'
  ],
  [
    'red',
    'green'
  ]
]

for (var row = rows; row > 0; row--) {
  for (var col = cols; col > 0; col--) {
    $('#dancefloor-main').append('<div class="cube ' + colors[row % 2][col % 2] + '"></div>');
  }

  $('#dancefloor-left').append('<div class="cube ' + colors[1][row % 2] + '"></div>');
  $('#dancefloor-right').append('<div class="cube ' + colors[row % 2][1] + '"></div>');
}