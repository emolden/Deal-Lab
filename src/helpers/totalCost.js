import upfrontCost from "./upfrontCost";
import totalHoldingCost from "./totalHoldingCost";

//totalCost takes in two parameters
    //repairCost is a number of the form 20500
    //holdingCost is a number of the form 2100
//and returns one number of the form 22600

function totalCost (repairItems, purchasePrice, holdingPeriod, monthlyTaxes, holdingItems) {
    let cost = upfrontCost(repairItems, purchasePrice) + totalHoldingCost(holdingPeriod, monthlyTaxes, holdingItems);
    
    return cost;
}

export default totalCost;