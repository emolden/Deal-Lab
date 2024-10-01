import React from 'react';

function PropertyCard({property}) {
  // 20000 is the repair number.
  const upfrontCost = Number(property.purchase_price) + 20000; 
  const holdingCost = ((Number(property.taxes_yearly) / 12) + 100) * Number(property.holding_period);
  const totalCost = upfrontCost + holdingCost;
  const profit = Number(property.after_repair_value) - totalCost;
  const annualProfit = (profit / Number(property.holding_period)) * 12;
  
  return (
    <div className="container">
      <p>Property Card:</p>

      <table className='rentCastTable'>
          <thead className='rentCastHeader'>
              <tr className='rentCastHeaderRow'>
                  <th className='rentCastHeadTitle'>Address</th>
                  <th className='rentCastHeadTitle'>Purchase Price</th>
                  <th className='rentCastHeadTitle'>Upfront Cost</th>
                  <th className='rentCastHeadTitle'>Holding Period Cost</th>
                  <th className='rentCastHeadTitle'>Total Cost</th>
                  <th className='rentCastHeadTitle'>Profit</th>
                  <th className='rentCastHeadTitle'>Annualized Profit</th>
              </tr>
          </thead>

          <tbody className='rentCastBody'>
            <tr>
                <td>{property.address}</td>
                <td>${property.purchase_price}</td>
                <td>${upfrontCost}</td>
                <td>${holdingCost}</td>
                <td>${totalCost}</td>
                <td>${profit}</td>
                <td>${annualProfit}</td>
            </tr>
          </tbody>
      </table>

    </div>
  );
}

export default PropertyCard;