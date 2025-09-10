import { useState, useEffect } from 'react';
import { validateVINInput, formatVIN } from '../utils/vinValidation';
import './VINInput.css';

/**
 * Secure VIN input component with real-time validation
 * Implements ISO 3779 standard validation with enhanced UX
 */
export default function VINInput({ 
  onVINChange, 
  onValidationChange, 
  placeholder = "Enter 17-character VIN",
  disabled = false,
  required = false,
  autoFocus = false 
}) {
  const [value, setValue] = useState('');
  const [validation, setValidation] = useState({ isValid: null, error: '', suggestion: '' });
  const [isFocused, setIsFocused] = useState(false);
  const [showFormatted, setShowFormatted] = useState(false);

  // Real-time validation
  useEffect(() => {
    const validationResult = validateVINInput(value);
    setValidation(validationResult);
    
    // Notify parent components
    if (onValidationChange) {
      onValidationChange(validationResult);
    }
    
    if (onVINChange) {
      onVINChange(value.replace(/[^A-HJ-NPR-Z0-9]/gi, '').toUpperCase());
    }
  }, [value]); // Only depend on value, not on callback functions

  const handleInputChange = (e) => {
    let inputValue = e.target.value;
    
    // Remove invalid characters and convert to uppercase
    inputValue = inputValue.replace(/[^A-HJ-NPR-Z0-9\s]/gi, '').toUpperCase();
    
    // Limit to 17 characters (excluding spaces)
    const cleanValue = inputValue.replace(/\s/g, '');
    if (cleanValue.length <= 17) {
      setValue(inputValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowFormatted(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Format the VIN when user finishes typing
    if (value.trim()) {
      const formatted = formatVIN(value);
      setValue(formatted);
    }
  };

  const handleKeyDown = (e) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].includes(e.keyCode)) {
      return;
    }
    
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88) && e.ctrlKey) {
      return;
    }
    
    // Prevent invalid characters
    const char = String.fromCharCode(e.keyCode);
    if (!/[A-HJ-NPR-Z0-9]/i.test(char)) {
      e.preventDefault();
    }
  };

  const getInputClassName = () => {
    let className = 'vin-input';
    
    if (validation.isValid === true) {
      className += ' vin-input--valid';
    } else if (validation.isValid === false && value.length > 0) {
      className += ' vin-input--invalid';
    }
    
    if (isFocused) {
      className += ' vin-input--focused';
    }
    
    if (disabled) {
      className += ' vin-input--disabled';
    }
    
    return className;
  };

  const displayValue = showFormatted && !isFocused ? formatVIN(value) : value;

  return (
    <div className="vin-input-container">
      <div className="vin-input-wrapper">
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          className={getInputClassName()}
          autoComplete="off"
          spellCheck="false"
          maxLength={20} // 17 chars + 3 spaces
          aria-label="Vehicle Identification Number"
          aria-describedby="vin-help vin-error"
        />
        
        {/* Validation indicator */}
        <div className="vin-input-indicator">
          {validation.isValid === true && (
            <span className="vin-indicator vin-indicator--valid" aria-label="Valid VIN">
              ✓
            </span>
          )}
          {validation.isValid === false && value.length > 0 && (
            <span className="vin-indicator vin-indicator--invalid" aria-label="Invalid VIN">
              ✗
            </span>
          )}
        </div>
      </div>
      
      {/* Help text and validation feedback */}
      <div className="vin-input-feedback">
        {validation.error && (
          <div id="vin-error" className="vin-error" role="alert">
            {validation.error}
          </div>
        )}
        
        {validation.suggestion && !validation.error && (
          <div id="vin-help" className="vin-help">
            {validation.suggestion}
          </div>
        )}
        
        {value.length > 0 && (
          <div className="vin-character-count">
            {value.replace(/\s/g, '').length}/17 characters
          </div>
        )}
      </div>
      
      {/* Security notice */}
      <div className="vin-security-notice">
        <small>
          🔒 VIN data is processed securely according to privacy standards
        </small>
      </div>
    </div>
  );
}
