import {useSelector, useDispatch} from 'react-redux';
import { useState, useEffect } from 'react';
import { TextField, Button, Input } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';

function ModalMortgageCalculator() {
    const dispatch = useDispatch();
    // const propertyOfInterest = useSelector((store) => store.propertyOfInterest);
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
                        <InputLabel htmlFor='downPayment' >Down Payment</InputLabel>
                        <Input id='downPayment'
                                placeholder={mortgageCalculator.down_payment}
                                size='small'
                                value={downPayment}
                                onChange={e => {
                                    // e.target.querySelector('#downPaymentPercentage').value = `{(e.target.value / purchasePrice) * 100}%`;
                                    setDownPayment(e.target.value)
                                }}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                sx={{width: '160px', margin: '5px 5px 5px 0px'}}  />
                        {/* <InputLabel htmlFor='downPaymentPercentage' >Percent</InputLabel> */}
                        <Input id='downPaymentPercentage'
                                placeholder={mortgageCalculator.down_payment_percentage}
                                size='small'
                                value={downPaymentPercentage}
                                onChange={e => {
                                    // e.target.querySelector('#downPayment').value = `${(e.target.value * 100)}`;
                                    setDownPaymentPercentage(e.target.value)
                                }}
                                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                sx={{width: '60px'}}  />
                        <InputLabel htmlFor='interestRate' >Interest Rate</InputLabel>
                        <Input id='interestRate'
                                placeholder={mortgageCalculator.interest_rate}
                                size='small'
                                value={interestRate}
                                onChange={e => setInterestRate(e.target.value)}
                                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                sx={{width: '160px', margin: '5px 5px 5px 0px'}}  />
                        <InputLabel htmlFor='closingCosts' >Closing Costs</InputLabel>
                        <Input id='closingCosts'
                                placeholder={mortgageCalculator.closing_costs}
                                size='small' 
                                value={closingCosts}
                                onChange={e => setClosingCosts(e.target.value)}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                sx={{width: '160px', margin: '5px 5px 5px 0px'}} />
                        {/* <InputLabel htmlFor='closingCostsPercentage' >Percent</InputLabel> */}
                        <Input id='closingCostsPercentage'
                                placeholder={mortgageCalculator.closing_costs_percentage}
                                size='small'
                                value={closingCostsPercentage}
                                onChange={e => setClosingCostsPercentage(e.target.value)}
                                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                sx={{width: '60px'}}  />

                        <form size='small' variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <label>Loan Term <br /></label>
                            <select labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={loanTerm}
                                onChange={e => setLoanTerm(e.target.value)}>
                                <option value=""></option>
                                <option value={15}>15 Yr</option>
                                <option value={20}>20 Yr</option>
                                <option value={30}>30 Yr</option>
                            </select>
                        </form>
                        <Button variant="contained"
                                sx={{width: '195px'}}
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch({
                                        type: 'UPDATE_CALCULATIONS',
                                        payload: {
                                            downPayment: downPayment,
                                            downPaymentPercentage: downPaymentPercentage,
                                            interestRate: interestRate,
                                            closingCosts: closingCosts,
                                            closingCostsPercentage: closingCostsPercentage,
                                            loanTerm: loanTerm,
                                            propertyId: propertyId
                                        }
                                    })
                                    setDownPayment('')
                                    setDownPaymentPercentage('')
                                    setInterestRate('')
                                    setClosingCosts('')
                                    setClosingCostsPercentage('')
                                }}
                            >Calculate</Button>
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