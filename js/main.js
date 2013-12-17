$.ionSound({
  sounds: [
	"Bell_0", "Bell_1", "Bell_2", "Bell_3", "Bell_4", "Bell_5", "Bell_6", "Bell_7", 
	"Amyleigh_0", "Amyleigh_1", "Amyleigh_2", "Amyleigh_3", "Amyleigh_4", "Amyleigh_5", "Amyleigh_6", "Amyleigh_7",
	"GrandPiano_0", "GrandPiano_1", "GrandPiano_2", "GrandPiano_3", "GrandPiano_4", "GrandPiano_5", "GrandPiano_6", "GrandPiano_7",
	"Marimba_0", "Marimba_1", "Marimba_2", "Marimba_3", "Marimba_4", "Marimba_5", "Marimba_6", "Marimba_7",
	"Marine_0", "Marine_1", "Marine_2", "Marine_3", "Marine_4", "Marine_5", "Marine_6", "Marine_7",
	"Tamal_0", "Tamal_1", "Tamal_2", "Tamal_3", "Tamal_4", "Tamal_5", "Tamal_6", "Tamal_7", 		
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
  // Is the help visible ?
  $scope.isHelpVisible = false;
  
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
  $scope.gridIndexArrays = [];
  
  // Period of 1 note.
  $scope.period = 700;
  
  // Number of beats
  $scope.beats = 8;
  
  //Sound to play
  $scope.soundToPlay = "Bell_";
  
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

  $scope.toggleGrid = function() {
    $scope.isGridVisible = !($scope.isGridVisible);
  };
  
  $scope.toggleHelp = function() {
    $scope.isHelpVisible = !($scope.isHelpVisible);
  };

  /*
   * Callback function of the form input.
   */
  $scope.onInputChange = function() {
    $scope.decompose($scope.beats);
    $scope.fillGrid(8);
  };
  
  /*
   * Callback function for beats
   */
  $scope.onBeatsChange = function() {
    $scope.resetGrid();
    $scope.decompose($scope.beats);
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
    
    //console.log('primeArrays = ' + $scope.primeArrays.join(' * '));
    //console.log('Indexes     = ' + $scope.primeArraysIndexes.join(' * '));
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
    
    // Broadcast to children for them to update themselves 
    // regarding the new values in gridIndexArrays
    $scope.$broadcast('UPDATE_GRID');
  };
  
  $scope.resetGrid = function() {
    $scope.$broadcast('RESET_GRID');
  }
  
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Initialization functions
// 

function initGrid(grid, height, width) {
  for(var rowIdx = 0; rowIdx < height; ++rowIdx) {
    var row = [];
    for(var colIdx = 0; colIdx < width; ++colIdx) {
      row.push({ row: rowIdx, col: colIdx, active: false });
    }
    grid.push(row);
  }
}

function initIndexes(array, height, width) {
  for(var colIdx = 0; colIdx < width; ++colIdx) {
    array[colIdx] = [];
    for(var rowIdx = 0; rowIdx < height; ++rowIdx) {
      //var offset = (j-i+height); // Regular repartition
      var offset = 2*height + Math.floor((height-1)/2);
      if(colIdx%2 === 0) {
        offset += (rowIdx-(colIdx/2));
      } else {
        offset += (rowIdx+((colIdx+1)/2));
      }
      if(rowIdx%2 === 0) {
        offset -= (rowIdx/2)*3;
      } else {
        offset -= ((rowIdx-1)/2);
      }
      array[colIdx][rowIdx] = offset%height;
    }
  }
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

function GridCtrl($scope) {
  //$scope.resetGrid();
  $scope.time = 0;
  $scope.grid = []; // This is the only [row][col] array in this file !
  $scope.gridIndexes = [];
  initGrid($scope.grid, 8, $scope.beats);
  initIndexes($scope.gridIndexes, 8, $scope.beats);

  $scope.onCellClick = function(row,col) {
    if($scope.$parent.isGridVisible === true) {
      $scope.grid[row][col].active = !($scope.grid[row][col].active);
      recompose();
    }
  };
  
  $scope.cleanGrid = function() {
    for(var rowIdx = 0; rowIdx < $scope.grid.length; ++rowIdx) {
      for(var colIdx = 0; colIdx < $scope.grid[rowIdx].length; ++colIdx) {
        this.disable(colIdx, rowIdx);
      }
    }
  };
  
  $scope.resetGrid = function() {
    $scope.time = 0;
    $scope.grid = []; // This is the only [row][col] array in this file !
    $scope.gridIndexes = [];
    initGrid($scope.grid, 8, $scope.beats);
    initIndexes($scope.gridIndexes, 8, $scope.beats);
    $scope.$digest();
  };
  
  $scope.enable = function(colIdx, rowIdx) {
    $scope.grid[rowIdx][colIdx].active = true;
  };
  
  $scope.disable = function(colIdx, rowIdx) {
    $scope.grid[rowIdx][colIdx].active = false;
  };
  
  $scope.isCellVisible = function(rowIdx, colIdx) {
    return $scope.grid[rowIdx][colIdx].active && ($scope.time == colIdx);
  };
  
  $scope.getPrimeNumberForCell = function(rowIdx, colIdx) {
    return Prime.primeArray[$scope.gridIndexes[colIdx].indexOf(rowIdx)];
  };
  
  var recompose = function() {
    var maxLength    = 0;
    var columnValues = []; // Values computed for each column
    
    // Compute the prime number recomposition for each column
    for(var colIdx = 0 ; colIdx < $scope.grid[0].length ; ++colIdx) {
      var columnValue = 1;
      for(var rowIdx = 0 ; rowIdx < $scope.grid.length ; ++rowIdx) {
        if($scope.grid[rowIdx][colIdx].active) {
          var index = $scope.gridIndexes[colIdx].indexOf(rowIdx);
          columnValue *= Prime.primeArray[index];
        }
      }
      
      if(columnValue == 1) {
          columnValue = 0;
      }
      
      columnValues[colIdx] = columnValue;
      if(columnValue.toString().length > maxLength) {
        maxLength = columnValue.toString().length;
      }
    }
    
    var globalNumber = "";
    for(var i = 0 ; i < columnValues.length ; ++i) {
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
    $scope.cleanGrid();
    for(var colIdx = 0; colIdx < arr.length; ++colIdx) {
      for(var iPrime = 0; iPrime < arr[colIdx].length; ++iPrime) {
        $scope.enable(colIdx, $scope.gridIndexes[colIdx][arr[colIdx][iPrime]]);
      }
    }
  });
  
  /*
   * Function called when receiving an 'RESET_GRID' message
   * Enables the grid boxes regarding $scope.$parent.gridIndexArrays
   */
  $scope.$on('RESET_GRID', function() {
    $scope.resetGrid();
  });
  
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Functions called periodically to animate the grid / play the sounds
  //
  
  
  // Plays the sounds and animations of column number i.
  var playColumn = function(colIdx) {
    //console.log("Playing column " + colIdx);
    for(var rowIdx = 0 ; rowIdx < 8; ++rowIdx) {
      if($scope.grid[rowIdx][colIdx].active) {       
		playSound($scope.sound + rowIdx);
        playAnimation(rowIdx, colIdx);
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
    playColumn($scope.time);
    $scope.$digest();
    
    $scope.time = ($scope.time + 1) % $scope.beats;
    setTimeout(update, $scope.$parent.period); // Call update() function every $scope.$parent.period ms
  };
  setTimeout(update, 0); // Call update() asap

}


