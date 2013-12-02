$.ionSound({
  sounds: [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7"
  ],
	path: "sounds/",
	multiPlay: true,  // Allows playing multiple sounds at the same time.
  volume: "1.0"
});

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
  
  // Scope variables
  // -------------------------------------
  //
  // Is the grid visible ?
  $scope.isGridVisible = false;
  
  // Contains X subarrays with the prime decomposition on each column
  $scope.primeArrays  = [];
  
  // Contains X subarrays with the indexes of the prime numbers 
  // of $scope.primeArrays in Prime.primeArray
  // For instance, if $scope.primeArrays is [[2], [3,7]]
  // then primeArraysIndexes should be [[0], [1,3]]
  $scope.primeArraysIndexes = [];
  
  // gridIndexArrays is close to primeArraysIndexes
  // It contains the indexes modulo the height of the grid.
  // Moreover, there is no double in the subarrays.
  $scope.gridIndexArrays
  
  // Period of 1 note.
  $scope.period = 1000;
  
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

  $scope.toggleGrid = function() {
    $scope.isGridVisible = !($scope.isGridVisible);
  };
  
  /*
   * Callback function of the form input.
   */
  $scope.onInputChange = function() {
    $scope.decompose(8);
    $scope.fillGrid(8);
  };
  
  /*
   * Decomposes a string in n substrings of equal length
   * If this is not strictly possible, the substrings of the end
   * are 1 character longer.
   */
  $scope.decompose = function(n) {
    // reset
    $scope.primeArrays = [];
    $scope.primeArraysIndexes = [];
    
    var totalLen  = $scope.number.length;
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
        // Avoids duplicated values and applies a modulo
        if($scope.primeArraysIndexes[i][j] != -1
        && $scope.gridIndexArrays[i].indexOf($scope.primeArraysIndexes[i][j] % height) == -1) {
          $scope.gridIndexArrays[i].push($scope.primeArraysIndexes[i][j] % height);
        }
      }
    }
    
    console.log('%%Indexes%% = ' + $scope.gridIndexArrays.join(' * '));
    
    // Broadcast to children for them to update themselves 
    // regarding the new values in gridIndexArrays
    $scope.$broadcast('UPDATE_GRID');
  };
  
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Initialization functions
// 

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

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

function GridCtrl($scope) {
  $scope.time = 0;
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
    var maxLength    = 0;
    var columnValues = []; // Values computed for each column
    
    // Compute the prime number recomposition for each column
    for(var i = 0 ; i < $scope.grid.length ; ++i) {
      var columnValue = 1;
      for(var j = 0 ; j < $scope.grid[i].length ; ++j) {
        if($scope.grid[j][i].active) {
          var index = $scope.gridIndexes[i].indexOf(j);
          columnValue *= Prime.primeArray[index];
        }
      }
      
      if(columnValue == 1) {
          columnValue = 0;
      }
      
      columnValues[i] = columnValue;
      if(columnValue.toString().length > maxLength) {
        maxLength = columnValue.toString().length;
      }
    }
    
    var globalNumber = "";
    for(i = 0 ; i < columnValues.length ; ++i) {
      // Add zeros to smaller numbers
      for(var n = columnValues[i].toString().length ; n < maxLength ; ++n) {
        columnValues[i] = "0" + columnValues[i];
      }
      // Concatenate all the computed values
      globalNumber += columnValues[i]; 
    }
    
    $scope.$parent.number = globalNumber;
  };
  
  /*
   * Function called when receiving an 'UPDATE_GRID' message
   * Enables the grid boxes regarding $scope.$parent.gridIndexArrays
   */
  $scope.$on('UPDATE_GRID', function() {
    var arr = $scope.$parent.gridIndexArrays;
    $scope.reset();
    for(var i = 0; i < arr.length; ++i) {
      for(var j = 0; j < arr[i].length; ++j) {
        //console.log('* enable ' + i + ',' + arr[i][j] + ' => ' + i + ',' + $scope.gridIndexes[i][arr[i][j]]);
        $scope.enable(i, $scope.gridIndexes[i][arr[i][j]]);
      }
    }
  });
  
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Functions called periodically to animate the grid / play the sounds
  //
  
  
  // Plays the sounds and animations of column number i.
  var playColumn = function(colIdx) {
    console.log("Playing column " + colIdx);
    for(var i = 0 ; i < 8 ; ++i) {
      if($scope.grid[i][colIdx].active) {
        playSound(i);
        playAnimation(i, colIdx);
      }
    }
  };
  
  // Play the animation for 1 box
  var playAnimation = function(rowIdx, colIdx) {
    var primeIdx = $scope.gridIndexes[colIdx].indexOf(rowIdx);
    //console.log(primeIdx);
  };
  
  // Play the sound for 1 box
  var playSound = function(rowIdx) {
    console.log("play sound " + rowIdx);
    $.ionSound.play(rowIdx.toString());
  };

  /*
   * Periodic method for the reading a column of the grid
   * and play the associated sounds.
   */
  var update = function() {
    playColumn($scope.time++);
    $scope.time %= 8;
    setTimeout(update, $scope.$parent.period); // Call update() function every $scope.$parent.period ms
  };
  setTimeout(update, 0); // Call update() asap

}


