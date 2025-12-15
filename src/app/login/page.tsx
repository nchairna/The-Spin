'use client';

import { useState, useRef, useEffect, useCallback, KeyboardEvent, ClipboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isLoadingRef = useRef(isLoading);

  // Keep the ref in sync with state
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const clearPin = useCallback(() => {
    setPin(['', '', '', '']);
    inputRefs.current[0]?.focus();
  }, []);

  const handleSubmit = useCallback(async (pinValue: string) => {
    if (isLoadingRef.current) return;

    setIsLoading(true);
    const toastId = toast.loading('Verifying...');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: pinValue }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.dismiss(toastId);
        router.push('/admin');
      } else {
        toast.error(data.error || 'Invalid PIN', { id: toastId });
        triggerShake();
        clearPin();
      }
    } catch {
      toast.error('Something went wrong. Please try again.', { id: toastId });
      triggerShake();
      clearPin();
    } finally {
      setIsLoading(false);
    }
  }, [router, triggerShake, clearPin]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Auto-submit when all 4 digits are entered
  useEffect(() => {
    const fullPin = pin.join('');
    if (fullPin.length === 4 && pin.every(digit => digit !== '')) {
      handleSubmit(fullPin);
    }
  }, [pin, handleSubmit]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (pin[index] === '' && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
        const newPin = [...pin];
        newPin[index - 1] = '';
        setPin(newPin);
      } else {
        // Clear current input
        const newPin = [...pin];
        newPin[index] = '';
        setPin(newPin);
      }
      e.preventDefault();
    }

    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle right arrow
    if (e.key === 'ArrowRight' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);

    if (pastedData.length > 0) {
      const newPin = ['', '', '', ''];
      for (let i = 0; i < pastedData.length; i++) {
        newPin[i] = pastedData[i];
      }
      setPin(newPin);

      // Focus the appropriate input
      const focusIndex = Math.min(pastedData.length, 3);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-12">
        <Image
          src="/assets/The spin icon.svg"
          alt="The Spin"
          width={120}
          height={120}
          priority
        />
      </div>

      {/* Title */}
      <h1 className="font-eb-garamond text-3xl md:text-4xl text-gray-900 mb-2 text-center">
        Admin Access
      </h1>
      <p className="font-outfit text-gray-500 mb-10 text-center">
        Enter your 4-digit PIN to continue
      </p>

      {/* PIN Input */}
      <div
        className={`flex gap-3 md:gap-4 mb-6 ${shake ? 'animate-shake' : ''}`}
      >
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isLoading}
            className={`
              w-14 h-16 md:w-16 md:h-20
              text-center text-2xl md:text-3xl font-outfit font-medium
              border-2 rounded-lg
              outline-none transition-all duration-200
              ${shake
                ? 'border-red-400 bg-red-50'
                : digit
                  ? 'border-gray-400 bg-gray-50'
                  : 'border-gray-200 bg-white'
              }
              ${!isLoading && !shake && 'focus:border-primary-red focus:ring-2 focus:ring-primary-red/20'}
              ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}
            `}
            aria-label={`PIN digit ${index + 1}`}
          />
        ))}
      </div>

      {/* Help Text */}
      <p className="font-outfit text-gray-400 text-xs mt-8 text-center">
        Contact an administrator if you need access
      </p>
    </div>
  );
}
