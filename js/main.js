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
  $scope.primeArrays  = [];
  $scope.primeArraysIndexes = [];
  $scope.gridIndexArrays = [];
  $scope.period = 1000;

  $scope.toggleGrid = function() {
    $scope.isGridVisible = !($scope.isGridVisible);
  };
  
  $scope.onInputChange = function() {
    $scope.decompose(8);
    $scope.fillGrid(8);
  };
  
  /*
   * decompose number in n subnumbers
   */
  $scope.decompose = function(n) {
    // reset
    $scope.primeArrays = [];
    $scope.primeArraysIndexes = [];
    
    var totalLen = $scope.number.length;
    var tmpNumber = $scope.number;
    for(var i = 0; i < n; ++i) {
      var iLength = Math.floor(totalLen / (n - i));
      Prime.decompose(tmpNumber.substr(0, iLength));
      
      var primeArray = Prime.getPrimeDecomposition();
      var primeArrayIndexes = Prime.getPrimeDecompositionIndexes();
      $scope.primeArrays.push(primeArray);
      $scope.primeArraysIndexes.push(primeArrayIndexes);
      
      totalLen = totalLen-iLength;
      tmpNumber = tmpNumber.substr(iLength, totalLen);
    }
    
    console.log('primeArrays = ' + $scope.primeArrays.join(' * '));
    console.log('Indexes     = ' + $scope.primeArraysIndexes.join(' * '));
  };
  
  $scope.fillGrid = function(height) {
    $scope.gridIndexArrays = [];
    for(var i = 0; i < $scope.primeArraysIndexes.length; ++i) {
      $scope.gridIndexArrays[i] = [];
      for(var j = 0; j < $scope.primeArraysIndexes[i].length; ++j) {
        // Avoid duplicated values
        if($scope.primeArraysIndexes[i][j] != -1
        && $scope.gridIndexArrays[i].indexOf($scope.primeArraysIndexes[i][j] % height) == -1) {
          $scope.gridIndexArrays[i].push($scope.primeArraysIndexes[i][j] % height);
        }
      }
    }
    
    console.log('%%Indexes%% = ' + $scope.gridIndexArrays.join(' * '));
    
    $scope.$broadcast('UPDATE_GRID');
  };
  
}

function initGrid(grid, height, width) {
  for(var i = 0; i < height; ++i) {
    var row = [];
    for(var j = 0; j < width; ++j) {
      row.push({ row: i, col: j, active: false });
    }
    grid.push(row);
  }
}

function initIndexes(array, height, width) {
  for(var i = 0; i < height; ++i) {
    array[i] = [];
    for(var j = 0; j < width; ++j) {
      //var offset = (j-i+height); // Regular repartition
      var offset = 2*height + Math.floor((height-1)/2);
      if(i%2 === 0) {
        offset += (j-(i/2));
      } else {
        offset += (j+((i+1)/2));
      }
      if(j%2 === 0) {
        offset -= (j/2)*3;
      } else {
        offset -= ((j-1)/2);
      }
      array[i][j] = offset%height;
    }
  }
}

function GridCtrl($scope) {
  $scope.grid = [];
  $scope.gridIndexes = [];
  initGrid($scope.grid, 8, 8);
  initIndexes($scope.gridIndexes, 8, 8);

  $scope.onCellClick = function(row,col) {
    $scope.grid[row][col].active = !($scope.grid[row][col].active);
    recompose();
  };
  
  $scope.reset = function() {
    for(var i = 0; i < $scope.grid.length; ++i) {
      for(var j = 0; j < $scope.grid[i].length; ++j) {
        this.disable(i, j);
      }
    }
  };
  
  $scope.enable = function(x, y) {
    $scope.grid[y][x].active = true;
  };
  
  $scope.disable = function(x, y) {
    $scope.grid[y][x].active = false;
  };

  var recompose = function() {
    var maxLength = 0;
    var columnValues = []; // Values computed for each column
    
    // Compute the prime number recomposition for each column
    for(var i = 0 ; i < $scope.grid.length ; ++i) {
        var columnValue = 1;
        for(var j = 0 ; j < $scope.grid[i].length ; ++j) {
            if($scope.grid[i][j].active) {
                columnValue *= $scope.grid[i][j];
            }
        }
        columnValues[i] = columnValue;
        if(columnValue.length > maxLength) {
            maxLength = columnValue.length;
        }
    }
    
    // Add zeros to smaller numbers
    for(i = 0 ; i < columnValues.length ; ++i) {
        for(var n = columnValues[i].length ; n < maxLength ; ++n) {
            columnValues[i] = "0" + columnValues[i];
        }
    }
    
    // Concatenate all the computed values
    var globalNumber = "";
    for(i = 0 ; i < columnValues.length ; ++i) {
        globalNumber += columnValues[i];   
    }
    
    $scope.$parent.number = globalNumber;
  }
  
  $scope.$on('UPDATE_GRID', function() {
    var arr = $scope.$parent.gridIndexArrays;
    $scope.reset();
    for(var i = 0; i < arr.length; ++i) {
      for(var j = 0; j < arr[i].length; ++j) {
        console.log('* enable ' + i + ',' + arr[i][j] + ' => ' + i + ',' + $scope.gridIndexes[i][arr[i][j]]);
        $scope.enable(i, $scope.gridIndexes[i][arr[i][j]]);
      }
    }
  });

  var update = function() {
    // Your code
    setTimeout(update, $scope.$parent.period); // Call update() function every $scope.$parent.period ms
  };
  setTimeout(update, 0); // Call update() asap

}

