import repairCost from "./repairCost";

//upfrontCost takes in two parameters
    //repairCost is a number of the form 23457
    //purchasePrice is a number of the form 325529
//and returns one number of the form 348986

function upfrontCost (repairItems, purchasePrice) {
    let totalUpfrontCost = Number(repairCost(repairItems)) + Number(purchasePrice);
    
    return totalUpfrontCost;
}

export default upfrontCost;