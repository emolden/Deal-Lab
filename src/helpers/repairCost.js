
//repairCost takes in one parameter
    //repairItems is an array of objects of the form
            // [{name: 'roof', cost: 20000}...]
//and returns one number of the form 23457

function repairCost (repairItems) {
    let totalRepairCost = 0;
    for(let item of repairItems) {
        totalRepairCost =totalRepairCost + Number(item.repair_cost);
    }
    return totalRepairCost;
}

export default repairCost;