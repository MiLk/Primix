$(document).ready(function() {
  // Background
  var updateBg = function() {
    var bgColor = '';
    bgColor += (Math.ceil(Math.random() * 255)).toString(16);
    bgColor += (Math.ceil(Math.random() * 255)).toString(16);
    bgColor += (Math.ceil(Math.random() * 255)).toString(16);
    $('body').css('background-color','#'+bgColor);
    setTimeout(updateBg,500);
  };
  setTimeout(updateBg,500);
});

function initGrid(grid, height, width) {
  for(var i = 0; i < height; i++) {
    var row = [];
    for(var j = 0; j < width; j++) {
      row.push({ row: i, col: j, active: false });
    }
    grid.push(row);
  }
}

function GridCtrl($scope) {
  $scope.grid = [];
  initGrid($scope.grid, 8, 8);

  $scope.onCellClick = function(row,col) {
    $scope.grid[row][col].active = !($scope.grid[row][col].active);
  }
}
