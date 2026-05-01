'use client';

import { useState } from 'react';
import { getPigmentsByCategory, rgbToCss } from '../../lib/pigmentData';
import PigmentControl from './PigmentControl';

/**
 * PigmentSelector Component
 * Displays all available pigments organized by category
 * Allows users to select and add pigments to their mix
 */
export default function PigmentSelector() {
  const pigmentsByCategory = getPigmentsByCategory();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedPigment, setSelectedPigment] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const selectPigment = (pigment) => {
    setSelectedPigment(selectedPigment?.id === pigment.id ? null : pigment);
  };

  return (
    <div className="h-full flex flex-col bg-slate-800 rounded-lg shadow-2xl overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex-shrink-0">
        <h2 className="text-xl font-bold">Pigment Laboratory</h2>
        <p className="text-sm text-blue-100 mt-1">Select pigments to mix</p>
      </div>

      {/* Pigment Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {Object.entries(pigmentsByCategory).map(([category, pigments]) => (
          <div key={category} className="border border-slate-600 rounded-lg overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-3 bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              <span className="font-semibold text-gray-100">{category}</span>
              <span className="text-gray-400">
                {expandedCategory === category ? '▼' : '▶'}
              </span>
            </button>

            {/* Category Content */}
            {expandedCategory === category && (
              <div className="p-2 space-y-1 bg-slate-800">
                {pigments.map((pigment) => (
                  <div key={pigment.id}>
                    {/* Pigment Item */}
                    <button
                      onClick={() => selectPigment(pigment)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                        selectedPigment?.id === pigment.id
                          ? 'bg-blue-900 border-2 border-blue-500'
                          : 'hover:bg-slate-700 border-2 border-transparent'
                      }`}
                    >
                      {/* Color Swatch */}
                      <div
                        className="w-10 h-10 rounded-md border-2 border-gray-600 flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: rgbToCss(pigment.rgb) }}
                      />

                      {/* Pigment Info */}
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-100 text-sm">
                          {pigment.name}
                        </div>
                        <div className="text-xs text-gray-400">{pigment.code}</div>
                      </div>

                      {/* Selection Indicator */}
                      {selectedPigment?.id === pigment.id && (
                        <div className="text-blue-400 font-bold">✓</div>
                      )}
                    </button>

                    {/* Pigment Control Panel */}
                    {selectedPigment?.id === pigment.id && (
                      <div className="mt-2 ml-2 pl-3 border-l-2 border-blue-500">
                        <PigmentControl
                          pigment={pigment}
                          onClose={() => setSelectedPigment(null)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-900 border-t border-slate-600 flex-shrink-0">
        <p className="text-xs text-gray-400 text-center">
          {Object.keys(pigmentsByCategory).reduce(
            (sum, cat) => sum + pigmentsByCategory[cat].length,
            0
          )}{' '}
          professional pigments available
        </p>
      </div>
    </div>
  );
}
