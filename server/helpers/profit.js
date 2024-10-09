const totalCost = require('./totalCost);
//profit takes in two parameters
    //afterRepairValue is a number of the form 410000
    //totalCost is a number of the form 378000
//and returns one number of the form 32000

function profit (afterRepairValue, totalRepairCost, purchasePrice, holdingPeriod, monthlyTaxes, monthlyHoldingCost) {
    let totalProfit = afterRepairValue - totalCost(totalRepairCost, purchasePrice, holdingPeriod, monthlyTaxes, monthlyHoldingCost);
    
    return totalProfit;
}

module.exports = profit;