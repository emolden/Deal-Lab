//annualizedProfit takes in two parameters
    //profit is a number of the form 32000
    //holdingPeriod is a number of the form 6
//and returns one number of the form 64000

function annualizedProfit (profit, holdingPeriod) {
    let totalAnnualizedProfit = (profit / holdingPeriod) * 12;
    
    return totalAnnualizedProfit;
}

export default annualizedProfit;