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
    $('#dancefloor-main').append('<div class="cube ' + colors[row % 2][col % 2] + '"></div>')
  }
}