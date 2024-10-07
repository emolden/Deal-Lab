import repairCost from "./repairCost";

//upfrontCost takes in two parameters
    //repairCost is a number of the form 23457
    //purchasePrice is a number of the form 325529
//and returns one number of the form 348986

function upfrontCost (totalRepairCost, purchasePrice) {
    let totalUpfrontCost = Number(totalRepairCost) + Number(purchasePrice);
    
    return totalUpfrontCost;
}

export default upfrontCost;