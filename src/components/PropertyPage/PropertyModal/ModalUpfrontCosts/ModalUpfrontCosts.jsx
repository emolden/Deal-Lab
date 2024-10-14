import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useState } from 'react';


function ModalUpfrontCosts() {

  const dispatch = useDispatch();

  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);
  const mortgageCalculator = useSelector(store => store.mortgageCalculator);

  const [repairName, setRepairName] = useState("");
  const [repairItemCost, setRepairItemCost] = useState("");
  const [downPayment, setDownPayment] = useState('');
  const [downPaymentPercentage, setDownPaymentPercentage] = useState('');
  const [closingCosts, setClosingCosts] = useState('');
  const [closingCostsPercentage, setClosingCostsPercentage] = useState('');

  const [showText, setShowText] = useState(false);
  const [showLoanText, setShowLoanText] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const purchasePrice = (Object.keys(propertyOfInterest).length && propertyOfInterest.property[0].purchase_price);
  const propertyId = (Object.keys(propertyOfInterest).length && propertyOfInterest.property[0].id)


  const addRepairItem = () => {
      dispatch ({
          type: 'ADD_PROPERTY_REPAIR_ITEM',
          payload: {propertyId: propertyOfInterest.property[0].id, repairName: repairName, repairCost: repairItemCost }
      })
      setRepairName("");
      setRepairItemCost("");
  }

  const deleteRepairItem = (itemId) => {
    dispatch ({
        type: 'DELETE_PROPERTY_REPAIR_ITEM',
        payload: {itemId: itemId, propertyId: propertyOfInterest.property[0].id}
    })
  }

  const formattedCurrency = (value) => {
    const number = parseFloat(value);
    return `$${number.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const RepairItemsInputOne = () => {
    setRepairName('Paint');
    setRepairItemCost('500');
  }

  const RepairItemsInputTwo = () => {
    setRepairName('Paint');
    setRepairItemCost('500');
  }

  const updatePurchasePrice = () => {
    dispatch({
      type: 'UPDATE_PROPERTY_PURCHASE_PRICE', 
      payload: '450000'
    })
  }

  const updateMortgageCalculator = () => {
    setDownPayment('10000')
    setDownPaymentPercentage('5')
    setInterestRate('6.5')
    setClosingCosts('50000')
    setClosingCostsPercentage('10')
  }

  const handleDownPayment = (e) => {
    const newPercentage = Number((e.target.value / purchasePrice) * 100).toFixed(2);
    setDownPayment(e.target.value)
    setDownPaymentPercentage(newPercentage)
  }

  const handleDownPaymentPercentage = (e) => {
    const newNumber = Number((e.target.value / 100) * purchasePrice).toFixed(2);
    setDownPaymentPercentage(e.target.value)
    setDownPayment(newNumber)
  }

  const handleClosingCosts = (e) => {
    const newPercentage = Number((e.target.value / purchasePrice) * 100).toFixed(2);
    setClosingCosts(e.target.value)
    setClosingCostsPercentage(newPercentage)
  }

  const handleClosingCostsPercentage = (e) => {
    const newNumber = Number((e.target.value / 100) * purchasePrice).toFixed(2);
    setClosingCostsPercentage(e.target.value)
    setClosingCosts(newNumber)
  }

  const handleUpdateCalculations = () => {
      dispatch({
        type: 'UPDATE_CALCULATIONS',
        payload: {
          propertyId: propertyId,
          downPayment: downPayment,
          downPaymentPercentage: downPaymentPercentage,
          closingCosts: closingCosts,
          closingCostsPercentage: closingCostsPercentage
        }
      })
  }

const handleMouseMove = (e) => {
  setPosition({ x: e.clientX, y: e.clientY });
  // console.log('handlemousemove', e.clientX, e.clientY)
};

  return (
    <div className="container">
      {Object.keys(propertyOfInterest).length && 
      <>

        <div className = "property-data">
          <div onMouseMove={handleMouseMove}>
            <img className='info-icon-data' src='info.png'onMouseEnter={() => setShowText(true)} onMouseLeave={() => setShowText(false)}/>
            {showText && (
              <div 
                className='info-text'
                style={{
                  position: 'absolute', 
                  left: position.x - 240, 
                  top: position.y - 110 
                }}>
                  The current listing price for the property selected
              </div>
            )}
          </div>
          <p onClick={updatePurchasePrice}> Purchase Price:</p> 
          <input
            className = "property-data-input" 
            placeholder="Purchase Price"
            value= {formattedCurrency(Number(propertyOfInterest.property[0].purchase_price))}
            onChange={e => {e.preventDefault; dispatch({type: 'UPDATE_PROPERTY_PURCHASE_PRICE', payload: e.target.value})}}
          />
        </div>

        <div className = "property-data">
          <label onClick={updateMortgageCalculator}>Down Payment:</label>
          <div className="label">
            <input 
              placeholder="Down Payment"
              className="mortgage-input"
              value={downPayment}
              onChange={handleDownPayment} 
            />
            <label className="label">at</label>
            <input 
              placeholder="%"
              className="percentage-input"
              value={downPaymentPercentage}
              onChange={handleDownPaymentPercentage} 
            />
            <label className="label">%</label>
          </div>
        </div>
        <div className = "property-data">
          <div onMouseMove={handleMouseMove}>
              <img className='info-icon-data' src='info.png'onMouseEnter={() => setShowLoanText(true)} onMouseLeave={() => setShowLoanText(false)}/>
              {showLoanText && (
                <div 
                  className='info-text'
                  style={{
                    position: 'absolute', 
                    left: position.x - 240, 
                    top: position.y - 110 
                  }}>
                    Purchase Price - Down Payment
                </div>
              )}
            </div>
          <p className="mortgageCalculatorLoanItems">Loan Amount: {mortgageCalculator.base_loan_amount}</p>
        </div>
        <div className = "property-data">
          <label>Closing Costs:</label>
            <div className="label">
              <input 
                placeholder="Closing Costs" 
                className="mortgage-input"
                value={closingCosts}
                onChange={handleClosingCosts}
              />
              <label className="label">at</label>
              <input 
                placeholder="%"
                className="percentage-input"
                value={closingCostsPercentage}
                onChange={handleClosingCostsPercentage} 
              />
              <label> % </label>
            </div>
          </div>
          <button className="modal-btn-2"
                  onClick={handleUpdateCalculations} >Calculate</button>

      {/* ***************** REMOVE SPANS AND ONCLICKS*************** */}
      <p className="top-border"> <span onClick={RepairItemsInputOne}>Repair</span> <span onClick={RepairItemsInputTwo}>Items:</span></p>
      <div className = 'item-form'>
        <input 
          type='text'
          placeholder='Repair Name'
          value={repairName}
          onChange={e => setRepairName(e.target.value)}
        />
        <input
          type='text'
          placeholder='Repair Cost'
          value={repairItemCost}
          onChange={e => setRepairItemCost(e.target.value)}
        />
        <button className="modal-btn-2"onClick={addRepairItem}>Add</button>
      </div>

      <table className="table">
      {propertyOfInterest.repairItems.map((item) => {
        return (
          <div key = {item.id} className="unordered-list">
            <tr>
              <td className="list-items" >{item.repair_name}: </td>
              <td className="list-cost">{formattedCurrency(item.repair_cost)} </td>
              <td className="list-delete"><img className="deleteBtn" onClick={() => {deleteRepairItem(item.id)}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgy6cH4pk8uBtQ-_MBHx5MtDO8ms62KxR0UQ&s" /></td>
            </tr>
          </div>
        )
      })}
      </table>

      {/* this should be .total_repair_cost */}
      <p className = "item-list-total">Total Repair Cost: {formattedCurrency(propertyOfInterest.property[0].total_repair_cost)}</p>
      
        <p className="section-totals">
          <span className="bold-text">Total Upfront Cost: {formattedCurrency(propertyOfInterest.property[0].total_upfront_cost)}</span>
        </p>
        <p className="calculation-explanation">(Purchase Price + Total Repair Cost)</p>
      </>
      }

    </div>
  );
}

export default ModalUpfrontCosts;