class Historic{

  constructor(firstTradeTime){ // TODO set current time for bot

    if(!firstTradeTime)
    throw new Error(`[ERROR][Historic.constructor] firstTradeTime null, firstTradeTime=${firstTradeTime}`)

    this.lastTradeTime = firstTradeTime - (firstTradeTime % 1000)
    this.setDefault();
  }

  setDefault(){
      this.maxPriceSecond = 0;
      this.maxPrices60Seconds = [0];
      this.maxPrice60Seconds = 0;
  }

  update(currentTradePrice, currentTradeTime){

      // On retire les Millisecondes
      var tradeTime =  currentTradeTime - (currentTradeTime % 1000);
      var changeSecond = currentTradeTime != this.lastTradeTime;
      // Si la seconde n'est pas la même que le dernier trade traité

      while(this.lastTradeTime < tradeTime){
          if(this.maxPrices60Seconds.length == 59){
              this.maxPrices60Seconds.pop(); // Retire dernier élément
          }
          this.maxPrices60Seconds.unshift(this.maxPriceSecond); // Ajoute début de tableau
          this.lastTradeTime += 1000; // + 1sec
          this.maxPriceSecond = 0
      }
      if(currentTradePrice > this.maxPriceSecond){
          this.maxPriceSecond = currentTradePrice;
      }
      if(changeSecond){
          this.maxPrice60Seconds = Math.max.apply(null, this.maxPrices60Seconds);
      }
      if(this.maxPriceSecond > this.maxPrice60Seconds){
          this.maxPrice60Seconds = this.maxPriceSecond;
      }
  }

  getMax60seconds(){
      return this.maxPrice60Seconds;
  }

}

module.exports = Historic;
