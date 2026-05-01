'use client';

import { usePaint } from '../../context/PaintContext';
import { generateShoppingList, COVERAGE_PER_LITER } from '../../lib/paintCalculations';

/**
 * CoverageCalculator Component
 * Calculates paint and pigment needs based on wall area
 */
export default function CoverageCalculator() {
  const { wallArea, updateWallArea, calculatedNeeds, hasPigments } = usePaint();

  const handleAreaChange = (e) => {
    const value = e.target.value;
    updateWallArea(value);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-bold text-gray-100 mb-1">Coverage Calculator</h3>
        <p className="text-xs text-gray-400">
          Calculate materials needed for your project
        </p>
      </div>

      {/* Wall Area Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Wall Area (m²)
        </label>
        <div className="relative">
          <input
            type="number"
            value={wallArea || ''}
            onChange={handleAreaChange}
            min="0"
            step="0.1"
            placeholder="Enter wall area"
            className="w-full px-4 py-3 border-2 border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg placeholder:text-gray-500"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
            m²
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Coverage rate: 1 liter covers {COVERAGE_PER_LITER} m²
        </p>
      </div>

      {/* Results */}
      {wallArea > 0 && calculatedNeeds && (
        <div className="bg-green-900 border-2 border-green-700 rounded-lg p-4 space-y-3">
          <div className="font-bold text-green-100 mb-2">
            📦 Shopping List for {wallArea} m²
          </div>

          {/* Base Paint */}
          <div className="bg-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-200">White Base Paint</span>
              <span className="text-xl font-bold text-gray-100">
                {calculatedNeeds.basePaint.litersToBuy} L
              </span>
            </div>
            {calculatedNeeds.basePaint.litersToBuy >
              calculatedNeeds.basePaint.litersNeeded && (
              <div className="text-xs text-gray-400">
                ({calculatedNeeds.basePaint.litersNeeded.toFixed(2)} L needed, rounded
                up to standard size)
              </div>
            )}
          </div>

          {/* Pigments */}
          {hasPigments && calculatedNeeds.pigments.length > 0 && (
            <div className="space-y-2">
              <div className="font-medium text-gray-200 text-sm">Pigments:</div>
              {calculatedNeeds.pigments.map((pigment, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-200 text-sm">
                        {pigment.name}
                      </div>
                      <div className="text-xs text-gray-400">{pigment.code}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-100">
                        {pigment.tubesNeeded} tube{pigment.tubesNeeded > 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-400">
                        ({pigment.scaledMl.toFixed(1)} ml)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Scale Factor Info */}
          {calculatedNeeds.scaleFactor > 1 && (
            <div className="text-xs text-gray-300 text-center pt-2 border-t border-green-700">
              Recipe scaled {calculatedNeeds.scaleFactor.toFixed(1)}× from original
            </div>
          )}
        </div>
      )}

      {/* No Area Entered */}
      {(!wallArea || wallArea === 0) && (
        <div className="bg-slate-700 border-2 border-slate-600 rounded-lg p-4 text-center text-gray-400">
          <div className="text-3xl mb-2">📏</div>
          <div className="text-sm">Enter your wall area to calculate materials</div>
        </div>
      )}

      {/* No Pigments Warning */}
      {wallArea > 0 && !hasPigments && (
        <div className="bg-yellow-900 border-2 border-yellow-700 rounded-lg p-3 text-center">
          <div className="text-sm text-yellow-200">
            Add pigments to see complete shopping list
          </div>
        </div>
      )}
    </div>
  );
}
