import React, { useState } from 'react';
import { Window } from '../win95/Window';

export const CalculatorWindow: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const toggleSign = () => {
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (left: number, right: number, op: string): number => {
    switch (op) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return right !== 0 ? left / right : 0;
      default: return right;
    }
  };

  const equals = () => {
    if (operation && previousValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const sqrt = () => {
    const value = parseFloat(display);
    setDisplay(String(Math.sqrt(value)));
  };

  const Button = ({ 
    label, 
    onClick, 
    className = '' 
  }: { 
    label: string; 
    onClick: () => void; 
    className?: string;
  }) => (
    <button
      className={`win95-button h-7 text-sm font-bold ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <Window id="calculator" icon={<span>🧮</span>}>
      <div className="p-2 bg-[#c0c0c0]">
        {/* Display */}
        <div className="win95-border-inset bg-white p-1 mb-2">
          <div className="text-right text-lg font-mono pr-1 overflow-hidden">
            {display.length > 15 ? parseFloat(display).toExponential(8) : display}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-5 gap-1">
          {/* Row 1 */}
          <div className="col-span-2" />
          <Button label="MC" onClick={() => {}} className="text-red-600" />
          <Button label="CE" onClick={clearEntry} className="text-red-600" />
          <Button label="C" onClick={clear} className="text-red-600" />

          {/* Row 2 */}
          <Button label="7" onClick={() => inputDigit('7')} className="text-blue-800" />
          <Button label="8" onClick={() => inputDigit('8')} className="text-blue-800" />
          <Button label="9" onClick={() => inputDigit('9')} className="text-blue-800" />
          <Button label="/" onClick={() => performOperation('/')} className="text-red-600" />
          <Button label="√" onClick={sqrt} className="text-blue-800" />

          {/* Row 3 */}
          <Button label="4" onClick={() => inputDigit('4')} className="text-blue-800" />
          <Button label="5" onClick={() => inputDigit('5')} className="text-blue-800" />
          <Button label="6" onClick={() => inputDigit('6')} className="text-blue-800" />
          <Button label="*" onClick={() => performOperation('*')} className="text-red-600" />
          <Button label="%" onClick={inputPercent} className="text-blue-800" />

          {/* Row 4 */}
          <Button label="1" onClick={() => inputDigit('1')} className="text-blue-800" />
          <Button label="2" onClick={() => inputDigit('2')} className="text-blue-800" />
          <Button label="3" onClick={() => inputDigit('3')} className="text-blue-800" />
          <Button label="-" onClick={() => performOperation('-')} className="text-red-600" />
          <Button label="1/x" onClick={() => setDisplay(String(1 / parseFloat(display)))} className="text-blue-800" />

          {/* Row 5 */}
          <Button label="0" onClick={() => inputDigit('0')} className="text-blue-800" />
          <Button label="+/-" onClick={toggleSign} className="text-blue-800" />
          <Button label="." onClick={inputDecimal} className="text-blue-800" />
          <Button label="+" onClick={() => performOperation('+')} className="text-red-600" />
          <Button label="=" onClick={equals} className="text-red-600" />
        </div>
      </div>
    </Window>
  );
};
