const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const axios = require('axios');

// ===================== INTEREST RATE =====================
/**
 * POST interest rate from API
 */
router.post('/:id', async (req, res) => {
    const api_key = process.env.MORTGAGE_CALCULATOR_API_KEY;
    const userId = req.user.id;
    const propertyId = req.params.id;
    let defaultLoanTerm = 30;
    let interestRate;
    let purchasePrice;
    let propertyTax;
    let downPayment;
    let closingCosts;
    let baseLoanAmount;
    let interestRateAnnual;
    let interestRateInsertedAt;
    let interestRateMonthly;
    let interestDecimalMonthly;
    let interestPaymentMonthly;
    let mortgageCalculationsId;

    console.log('propertyId:', propertyId);
    

    let connection;
    try { 
        connection = await pool.connect()
        await connection.query('BEGIN;')

        // ========================== CALLING API && CHECKING TIMESTAMP ==========================
        const checkTimeStampSqlText = `
            SELECT *, "default_mortgage_calculations".id AS "default_mortgage_calculations_id"
                FROM "default_mortgage_calculations"
                JOIN "properties"
                ON "properties".id = "default_mortgage_calculations".property_id
                    WHERE "default_mortgage_calculations".interest_rate_inserted_at 
                            >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
                    AND "properties".id = $1;
        `
        const checkTimeStampResults = await pool.query(checkTimeStampSqlText, [propertyId]);
        const checkTimeStampData = checkTimeStampResults.rows;
        console.log('checkTimeStampData is:', checkTimeStampData);


        if (checkTimeStampData.length === 0) {

            const propertyDataSqlText = `
                SELECT * FROM "properties"
                    WHERE "id" = $1;
            `
            const propertyDataResponse = await pool.query(propertyDataSqlText, [propertyId])
            purchasePrice = propertyDataResponse.rows[0].purchase_price;
            propertyTax = propertyDataResponse.rows[0].taxes_yearly;
            console.log('purchasePrice:', purchasePrice);
            console.log('propertyTax:', propertyTax);
            
            

            // ================ Axios for INTEREST RATE API
            const interestRateResponse = await axios({
                method: 'GET',
                url: `https://api.api-ninjas.com/v1/interestrate?country=United States`,
                headers: {
                    'accept': 'application/json',
                    'X-Api-Key': `${api_key}`
                }
            })
            interestRate = interestRateResponse.data.central_bank_rates[0].rate_pct;
            downPayment = purchasePrice * 0.2;
            closingCosts = purchasePrice * 0.03;
            baseLoanAmount = purchasePrice - downPayment;
            console.log('interestRate:', interestRate);
            console.log('downPayment:', downPayment);
            console.log('closingCosts:', closingCosts);
            console.log('baseLoanAmount:', baseLoanAmount);
            
            

            // ================ Axios for MORTGAGE CALCULATOR API
            const mortgageCalculatorResponse = await axios({
                method: 'GET',
                url: `https://api.api-ninjas.com/v1/mortgagecalculator?loan_amount=${purchasePrice}&interest_rate=${interestRate}&duration_years=${defaultLoanTerm}&downpayment=${downPayment}&annual_property_tax=${propertyTax}`,
                headers: {
                    'accept': 'application/json',
                    'X-Api-Key': `${api_key}`
                }
            })
            // monthlyPayment = mortgageCalculatorResponse.data.monthly_payment;
            // annualPayment = mortgageCalculatorResponse.data.annual_payment;
            totalInterestPaid = mortgageCalculatorResponse.data.total_interest_paid;
            console.log('mortgageCalculatorResponse:', mortgageCalculatorResponse.data);
            console.log('totalInterestPaid:', totalInterestPaid);
            

            interestRateAnnual = Number(((((totalInterestPaid / purchasePrice) / (defaultLoanTerm * 365)) * 365) * 100).toFixed(3));
            console.log('interestRateAnnual', interestRateAnnual);
            


            // ================ SQL insert into table: DEFAULT_MORTGAGE_CALCULATIONS
            const defaultCalculationsData = [
                propertyId,
                interestRate,
                baseLoanAmount,
                interestRateAnnual
            ]
            const defaultCalculationsSqlText = `
                INSERT INTO "default_mortgage_calculations"
                ("property_id", "interest_rate", "base_loan_amount", "interest_rate_annual")
                VALUES
                ($1, $2, $3, $4);
            `
            const defaultCalculationsResponse = await pool.query(defaultCalculationsSqlText, defaultCalculationsData)
            
        } else if (checkTimeStampData.length > 0) {
            const mostRecentCheck = checkTimeStampData.length - 1;
            interestRate = checkTimeStampData[mostRecentCheck].interest_rate;
            interestRateInsertedAt = checkTimeStampData[mostRecentCheck].interest_rate_inserted_at;
            purchasePrice = checkTimeStampData[mostRecentCheck].purchase_price;
            baseLoanAmount = checkTimeStampData[mostRecentCheck].base_loan_amount;
            interestRateAnnual = checkTimeStampData[mostRecentCheck].interest_rate_annual;
            downPayment = purchasePrice * 0.2;
            closingCosts = purchasePrice * 0.03;
        }



        // ================ SQL insert into table: MORTGAGE_CALCULATIONS
        interestRateMonthly = interestRateAnnual / 12;
        interestDecimalMonthly = interestRateMonthly / 100;
        interestPaymentMonthly = interestDecimalMonthly * baseLoanAmount;

        const mortgageCalculationsData = [
            propertyId,
            interestRate,
            interestRateInsertedAt,
            downPayment,
            baseLoanAmount,
            closingCosts,
            interestRateAnnual,
            interestRateMonthly,
            interestDecimalMonthly,
            interestPaymentMonthly
        ]
        const mortgageCalculationsSqlText = `
            INSERT INTO "mortgage_calculations"
            ("property_id", "interest_rate", "interest_rate_updated_at", "down_payment", "base_loan_amount",
            "closing_costs", "interest_rate_annual", "interest_rate_monthly", "interest_decimal_monthly", "interest_payment_monthly")
            VALUES
            ($1, $2, DATE($3), $4, $5, $6, $7, $8, $9, $10)
            RETURNING "id";
        `
        const mortgageCalculationsResponse = await pool.query(mortgageCalculationsSqlText, mortgageCalculationsData)
        mortgageCalculationsId = mortgageCalculationsResponse.rows[0].id;


        // ================ SQL get table: MORTGAGE_CALCULATIONS
        const getMortgageCalculationsSqlText = `
            SELECT * FROM "mortgage_calculations"
                WHERE "id" = $1;
        `
        const getMortgageCalculationsResponse = await pool.query(getMortgageCalculationsSqlText, [mortgageCalculationsId]);
        console.log('getMortgageCalculationsResponse:', getMortgageCalculationsResponse.rows);
        
        await connection.query('Commit;')
        res.send(getMortgageCalculationsResponse.rows[0]);

    } catch (error) {
        console.log('Add property failed: ', error);
        await connection.query('Rollback;')
        res.sendStatus(500);
    } finally {
        await connection.release()
    }
})


module.exports = router;