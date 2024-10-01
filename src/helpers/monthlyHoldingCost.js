
//monthlyHoldingCost takes in two parameters 
    //monthlyTaxes and holdingItems
        //monthlyTaxes is a number of the form 211.35
        //holdingItems is an array of objects of the form
            // [{name: 'utilities', cost: 200}...]
//and returns one number of the form 411.35

function monthlyHoldingCost (monthlyTaxes, holdingItems) {
    let totalMonthlyHoldingCost = monthlyTaxes;
    for(let item of holdingItems) {
        totalMonthlyHoldingCost + item.cost;
    }
    return totalMonthlyHoldingCost;
}

export default monthlyHoldingCost;