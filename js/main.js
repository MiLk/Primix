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
  //setTimeout(updateBg,500);
});

function GlobalCtrl($scope) {
  $scope.isGridVisible = false;
  $scope.numbersArray = [];
  $scope.primesArrays = [];

  $scope.toggleGrid = function() {
    $scope.isGridVisible = !($scope.isGridVisible);
  }
  
  $scope.onInputChange = function() {
    $scope.decompose(8);
    console.log("Changed.");
  }
  
  /*
   * decompose number in n subnumbers
   */
  $scope.decompose = function(n) {
    // reset
    $scope.numbersArray = [];
    
    var totalLen = $scope.number.length;
    console.log('$scope.number = ' + $scope.number);
    var tmpNumber = $scope.number;
    for(var i = 0; i < n; ++i) {
      var iLength = Math.floor(totalLen / (n-i));
      $scope.numbersArray.push(tmpNumber.substr(0, iLength));
      totalLen = totalLen-iLength;
      tmpNumber = tmpNumber.substr(iLength, totalLen);
    }
    
    console.log('numbersArray = ' + $scope.numbersArray.join(' * '));
  }
  
}

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

