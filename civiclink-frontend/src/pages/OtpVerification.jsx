import React, { useState, useRef } from 'react';

export default function OtpVerification({ length = 6, onVerify, onSubmit, mobile }) {
  const [values, setValues] = useState(Array.from({ length }, () => ''));
  const inputsRef = useRef([]);

  const focusInput = (index) => {
    if (inputsRef.current[index]) {
      inputsRef.current[index].focus();
      inputsRef.current[index].select();
    }
  };

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) {
      const next = [...values];
      next[index] = '';
      setValues(next);
      return;
    }

    const chars = val.split('');
    const next = [...values];
    let i = index;
    for (let c of chars) {
      if (i >= length) break;
      next[i] = c;
      i += 1;
    }
    setValues(next);
    if (i < length) {
      focusInput(i);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (values[index]) {
        const next = [...values];
        next[index] = '';
        setValues(next);
      } else if (index > 0) {
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (index, e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    e.preventDefault();
    const chars = pasted.slice(0, length - index).split('');
    const next = [...values];
    let i = index;
    for (let c of chars) {
      next[i] = c;
      i += 1;
      if (i >= length) break;
    }
    setValues(next);
    if (i < length) {
      focusInput(i);
    }
  };

  const code = values.join('');
  const isComplete = code.length === length && values.every((v) => v !== '');

  const handleVerify = () => {
    if (onVerify) return onVerify(code);
    if (onSubmit) return onSubmit(code);
  };

  const goBack = () => {
    if (window && window.history) {
      window.history.back();
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <button onClick={goBack} style={{ marginBottom: 16, background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: 14 }}>
        ← Back
      </button>
      <h2 style={{ margin: '0 0 8px 0' }}>OTP Verification</h2>
      <p style={{ margin: '0 0 16px 0', color: '#6b7280' }}>Enter the {length}-digit code sent to your device.</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
        {values.map((v, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={v}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            maxLength={length}
            style={{
              width: 44,
              height: 48,
              textAlign: 'center',
              fontSize: 18,
              border: '1px solid #d1d5db',
              borderRadius: 6,
            }}
          />
        ))}
      </div>
      <button
        disabled={!isComplete}
        onClick={handleVerify}
        style={{
          width: '100%',
          padding: '10px 12px',
          backgroundColor: isComplete ? '#2563eb' : '#93c5fd',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: isComplete ? 'pointer' : 'not-allowed',
          fontSize: 16,
        }}
      >
        Verify
      </button>
    </div>
  );
}
