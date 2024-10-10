
import upfrontCost from "./upfrontCost";
import totalHoldingCost from "./totalHoldingCost";

//totalCost takes in two parameters
    //repairCost is a number of the form 20500
    //holdingCost is a number of the form 2100
//and returns one number of the form 22600

function totalCost (totalRepairCost, purchasePrice, holdingPeriod, monthlyTaxes, monthlyHoldingCost) {
    let cost = upfrontCost(totalRepairCost, purchasePrice) + totalHoldingCost(holdingPeriod, monthlyTaxes, monthlyHoldingCost);
    
    return cost;
}

module.exports = totalCost;