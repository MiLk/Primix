(function() {

var Prime = function() {
    
};

Prime.prototype.primeArray = [2,3,5,7,11];
Prime.prototype.primeDecomposition = [];
Prime.prototype.primeDecompositionIndexes = [];

Prime.prototype.decompose = function(n) {
  this.primeDecomposition = [];
  this.primeDecompositionIndexes = [];
  
  var upperLimit = Math.sqrt(n);
  var currentPrimeIndex = 0;
  
  while(n !== 1 && this.primeArray[currentPrimeIndex] <= upperLimit) {
    if((n % this.primeArray[currentPrimeIndex]) === 0) {
      this.primeDecomposition.push(this.primeArray[currentPrimeIndex]);
      this.primeDecompositionIndexes.push(currentPrimeIndex);
      n = n / this.primeArray[currentPrimeIndex];
      upperLimit = Math.sqrt(n);
      currentPrimeIndex = 0;
    } else {
      ++currentPrimeIndex;
    }
  }
  if(n !== 1) {
    this.primeDecomposition.push(n);
  }
  
  console.log('n = ' + this.primeDecomposition.join(' * '));
};

Prime.prototype.getPrimeDecomposition = function() {
  return this.primeDecomposition;
}

Prime.prototype.getPrimeDecompositionIndexes = function() {
  return this.primeDecompositionIndexes;
}

this.Prime = new Prime();

}).call(this);