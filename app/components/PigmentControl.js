'use client';

import { useState } from 'react';
import { usePaint } from '../../context/PaintContext';
import { rgbToCss } from '../../lib/pigmentData';

/**
 * PigmentControl Component
 * Controls for adding a specific pigment to the mix
 * Allows selecting amount and unit
 */
export default function PigmentControl({ pigment, onClose }) {
  const { addPigment } = usePaint();
  const [amount, setAmount] = useState('10');
  const [unit, setUnit] = useState('ml');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);

    // Validation
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }

    // Add pigment to mix
    addPigment(pigment, numAmount, unit);

    // Show success feedback
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 1000);

    // Reset amount for next addition
    setAmount('10');
  };

  return (
    <div className="bg-slate-900 rounded-lg p-3 space-y-3 border border-blue-600">
      {/* Pigment Info */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded border-2 border-gray-600 flex-shrink-0"
          style={{ backgroundColor: rgbToCss(pigment.rgb) }}
        />
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-100">{pigment.name}</div>
          <div className="text-xs text-gray-400">{pigment.description}</div>
        </div>
      </div>

      {/* Add Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-2">
          {/* Amount Input */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
              placeholder="Enter amount"
            />
          </div>

          {/* Unit Selector */}
          <div className="w-24">
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Unit
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-2 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="drop">Drops</option>
              <option value="ml">ml</option>
              <option value="tube">Tubes</option>
            </select>
          </div>
        </div>

        {/* Unit Info */}
        <div className="text-xs text-gray-300 bg-slate-800 rounded p-2 border border-slate-700">
          <div className="font-medium mb-1">Unit Reference:</div>
          <div>1 drop = 0.05 ml</div>
          <div>1 tube = 20 ml</div>
          <div className="mt-1 text-blue-400">
            Strength: {Math.round(pigment.strength * 100)}% (
            {pigment.strength >= 0.8
              ? 'Very strong - use less'
              : pigment.strength >= 0.6
              ? 'Moderate'
              : 'Mild - need more'}
            )
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              showSuccess
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {showSuccess ? '✓ Added!' : 'Add to Mix'}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-200 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
