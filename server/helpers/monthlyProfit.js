import profit from "./profit";
//annualizedProfit takes in two parameters
    //profit is a number of the form 32000
    //holdingPeriod is a number of the form 6
//and returns one number of the form 64000

function annualizedProfit (afterRepairValue, totalRepairCost, purchasePrice, holdingPeriod, monthlyTaxes, monthlyHoldingCost) {
    let totalAnnualizedProfit = (profit(afterRepairValue, totalRepairCost, purchasePrice, holdingPeriod, monthlyTaxes, monthlyHoldingCost) / holdingPeriod);
    
    return totalAnnualizedProfit;
}

export default annualizedProfit;