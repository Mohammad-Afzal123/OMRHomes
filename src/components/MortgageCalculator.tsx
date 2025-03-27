import React, { useState, useEffect } from 'react';
import { Calculator, PieChart, TrendingUp, ArrowUp, ArrowDown, Info } from 'lucide-react';

const MortgageCalculator: React.FC = () => {
  const [propertyPrice, setPropertyPrice] = useState(8000000);
  const [downPayment, setDownPayment] = useState(1600000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTerm, setLoanTerm] = useState(20);
  const [interestRate, setInterestRate] = useState(7.5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Update down payment percentage when down payment amount changes
  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    setDownPaymentPercent(Math.round((value / propertyPrice) * 100));
  };

  // Update down payment amount when percentage changes
  const handleDownPaymentPercentChange = (percent: number) => {
    setDownPaymentPercent(percent);
    setDownPayment(Math.round((percent / 100) * propertyPrice));
  };

  // Calculate mortgage details
  useEffect(() => {
    const loanAmount = propertyPrice - downPayment;
    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;

    // Monthly payment formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const monthly = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    const total = monthly * numberOfPayments;
    const interest = total - loanAmount;
    
    setMonthlyPayment(isNaN(monthly) ? 0 : monthly);
    setTotalPayment(isNaN(total) ? 0 : total);
    setTotalInterest(isNaN(interest) ? 0 : interest);
  }, [propertyPrice, downPayment, loanTerm, interestRate]);

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    } else {
      return `₹${value.toLocaleString('en-IN')}`;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-electric/10 flex items-center justify-center mr-3">
          <Calculator className="w-5 h-5 text-electric" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-900">Mortgage Calculator</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="space-y-6">
            {/* Property Price */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Property Price
                </label>
                <span className="text-sm text-neutral-500">{formatCurrency(propertyPrice)}</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="30000000"
                step="100000"
                value={propertyPrice}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  setPropertyPrice(newValue);
                  // Maintain the same down payment percentage when property price changes
                  setDownPayment(Math.round((downPaymentPercent / 100) * newValue));
                }}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-electric"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>₹10L</span>
                <span>₹3Cr</span>
              </div>
            </div>
            
            {/* Down Payment */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Down Payment
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-neutral-500 mr-2">{formatCurrency(downPayment)}</span>
                  <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full">{downPaymentPercent}%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max={propertyPrice * 0.9}
                step="50000"
                value={downPayment}
                onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-electric"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>0%</span>
                <span>90%</span>
              </div>
            </div>
            
            {/* Preset Down Payment Percentages */}
            <div className="flex space-x-2">
              {[10, 15, 20, 25, 30].map((percent) => (
                <button
                  key={percent}
                  onClick={() => handleDownPaymentPercentChange(percent)}
                  className={`py-1 px-3 text-sm rounded-full ${
                    downPaymentPercent === percent
                      ? 'bg-electric text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  } transition-colors`}
                >
                  {percent}%
                </button>
              ))}
            </div>
            
            {/* Loan Term */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Loan Term
                </label>
                <span className="text-sm text-neutral-500">{loanTerm} years</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-electric"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>5 yrs</span>
                <span>30 yrs</span>
              </div>
            </div>
            
            {/* Interest Rate */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Interest Rate
                </label>
                <span className="text-sm text-neutral-500">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-electric"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>5%</span>
                <span>15%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          {/* Results */}
          <div className="bg-neutral-50 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-medium text-neutral-900 mb-4">Mortgage Summary</h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <div className="text-sm text-neutral-500 mb-1">Monthly Payment</div>
                <div className="text-2xl font-semibold text-neutral-900">
                  {formatCurrency(monthlyPayment)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-neutral-200">
                  <div className="text-sm text-neutral-500 mb-1">Loan Amount</div>
                  <div className="text-lg font-semibold text-neutral-900">
                    {formatCurrency(propertyPrice - downPayment)}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-neutral-200">
                  <div className="text-sm text-neutral-500 mb-1">Total Interest</div>
                  <div className="text-lg font-semibold text-neutral-900">
                    {formatCurrency(totalInterest)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart Visualization */}
          <div className="rounded-lg border border-neutral-200 p-5">
            <div className="flex items-center mb-4">
              <PieChart className="w-5 h-5 text-electric mr-2" />
              <h4 className="font-medium text-neutral-900">Payment Breakdown</h4>
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Principal Amount */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#4F46E5"
                    strokeWidth="20"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                    className="transform -rotate-90 origin-center"
                  />
                  {/* Interest Amount */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#C7D2FE"
                    strokeWidth="20"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - (totalInterest / totalPayment))}
                    className="transform -rotate-90 origin-center"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-neutral-500">Total</span>
                  <span className="text-sm font-semibold">{formatCurrency(totalPayment)}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-electric mr-2"></div>
                <div>
                  <div className="text-xs text-neutral-500">Principal</div>
                  <div className="text-sm font-medium">{formatCurrency(propertyPrice - downPayment)}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-electric/30 mr-2"></div>
                <div>
                  <div className="text-xs text-neutral-500">Interest</div>
                  <div className="text-sm font-medium">{formatCurrency(totalInterest)}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Financial Tips */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex">
              <Info className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
              <div>
                <h5 className="text-sm font-medium text-blue-900 mb-1">Pro Tip</h5>
                <p className="text-xs text-blue-700">
                  {interestRate > 7 ? (
                    <>Increasing your down payment by just 5% could save you {formatCurrency(totalInterest * 0.15)} in interest payments over the loan term.</>
                  ) : loanTerm > 20 ? (
                    <>Reducing your loan term from {loanTerm} to {loanTerm - 5} years could save you {formatCurrency(totalInterest * 0.22)} in interest, though your monthly payment would increase.</>
                  ) : (
                    <>With current interest rates at {interestRate}%, it's a good time to consider a fixed-rate mortgage for long-term stability.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
