import {useSelector, useDispatch} from 'react-redux';
import { useState, useEffect } from 'react';
import { TextField, Button, Input } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function ModalMortgageCalculator() {
    const dispatch = useDispatch();
    const propertyOfInterest = useSelector((store) => store.propertyOfInterest);
    const mortgageCalculator = useSelector(store => store.mortgageCalculator);
    const [downPayment, setDownPayment] = useState('');
    const [downPaymentPercentage, setDownPaymentPercentage] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [closingCosts, setClosingCosts] = useState('');
    const [closingCostsPercentage, setClosingCostsPercentage] = useState('');
    const [loanTerm, setLoanTerm] = useState(30);

    const formattedCurrency = (value) => {
        const number = parseFloat(value);
        return `$${number.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    const propertyId = (Object.keys(propertyOfInterest).length && propertyOfInterest.property[0].id)
    const purchasePrice = (Object.keys(propertyOfInterest).length && propertyOfInterest.property[0].purchase_price);
    const loanAmount = (Object.keys(propertyOfInterest).length && 
                        formattedCurrency(Number(purchasePrice)));

    console.log('mortgage calculator:', mortgageCalculator);
    

    return (
        <div className="container">
            <div className="mortgageCalculatorDiv">

                <div className="mortgageCalculatorFormDiv">
                    {Object.keys(mortgageCalculator) && 
                    <form className="mortgageCalculatorForm">
                        <label>Down Payment:</label>
                        <br />
                        <input placeholder="Down Payment"
                                value={downPayment}
                                onChange={e => setDownPayment(e.target.value)} />
                        <br />
                        <label>Down Payment Percentage:</label>
                        <br />
                        <input placeholder="Down Payment %"
                                value={downPaymentPercentage}
                                onChange={e => setDownPaymentPercentage(e.target.value)} />
                        <br />
                        <label>Interest Rate:</label>
                        <br />
                        <input placeholder="Interest Rate" 
                                value={interestRate}
                                onChange={e => setInterestRate(e.target.value)} />
                        <br />
                        <label>Closing Costs:</label>
                        <br />
                        <input placeholder="Closing Costs" 
                                value={closingCosts}
                                onChange={e => setClosingCosts(e.target.value)} />
                        <br />
                        <label> Closing Cost Percentage:</label>
                        <br />
                        <input placeholder="Closing Costs %"
                                value={closingCostsPercentage}
                                onChange={e => setClosingCostsPercentage(e.target.value)} />
                                <br />
                            <label>Loan Term </label>
                            <select
                                id="demo-simple-select-standard"
                                value={loanTerm}
                                onChange={e => setLoanTerm(e.target.value)}>
                                <option value=""></option>
                                <option value={15}>15 Yr</option>
                                <option value={20}>20 Yr</option>
                                <option value={30}>30 Yr</option>
                            </select>
                        <button className="modal-btn-2">Calculate</button>
                    </form>
                    }
                </div>

                <div className="mortgageCalculatorLoan">
                    {Object.keys(mortgageCalculator) && 
                        <>
                        <p className="mortgageCalculatorLoanItems">Loan Amount: {loanAmount}</p>
                        <p className="mortgageCalculatorLoanItems">Base Loan Amount: {mortgageCalculator.base_loan_amount}</p>
                        <p className="mortgageCalculatorLoanItems">Loan Interest Rate (Annual): {mortgageCalculator.interest_rate_annual}</p>
                        <p className="mortgageCalculatorLoanItems">Loan Interest Rate (Monthly): {mortgageCalculator.interest_rate_monthly}</p>
                        <p className="mortgageCalculatorLoanItems">Interest Payment (Monthly): {mortgageCalculator.interest_payment_monthly}</p>
                        </>
                    }
                </div>

            </div>
        </div>
    )

}

export default ModalMortgageCalculator;

// store: 'mortgageCalculator'
// propertyId = propertyOfInterest.property[0].id