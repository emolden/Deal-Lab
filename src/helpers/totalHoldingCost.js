import monthlyHoldingCost from "./monthlyHoldingCost";
//totalHoldingCost takes in two parameters
    //holdingPeriod is a number of the form 6
    //monthlyHoldingCost is a number of the form 350
//and returns one number of the form 2100

function totalHoldingCost (holdingPeriod, monthlyTaxes, holdingItems) {
    let holdingCost = monthlyHoldingCost(monthlyTaxes, holdingItems) * holdingPeriod;
    
    return holdingCost;
}

export default totalHoldingCost;