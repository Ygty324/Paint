'use client';

import { usePaint } from '../../context/PaintContext';
import { generateRecipeCard } from '../../lib/paintCalculations';
import { rgbToCss } from '../../lib/pigmentData';
import CoverageCalculator from './CoverageCalculator';

/**
 * RecipePanel Component
 * Displays the current recipe and provides copy functionality
 * Includes coverage calculator
 */
export default function RecipePanel() {
  const { basePaint, addedPigments, resultColor, hasPigments, removePigment } = usePaint();

  const handleCopyRecipe = () => {
    const recipe = generateRecipeCard(basePaint, addedPigments);
    navigator.clipboard.writeText(recipe).then(
      () => {
        alert('Recipe copied to clipboard!');
      },
      (err) => {
        console.error('Failed to copy recipe:', err);
        alert('Failed to copy recipe. Please try again.');
      }
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-800 rounded-lg shadow-2xl overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex-shrink-0">
        <h2 className="text-xl font-bold">Recipe Card</h2>
        <p className="text-sm text-green-100 mt-1">Your custom paint formula</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Color Summary */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-lg border-2 border-gray-600 shadow-md flex-shrink-0"
              style={{ backgroundColor: rgbToCss(resultColor) }}
            />
            <div className="flex-1">
              <div className="text-lg font-bold text-gray-100">{resultColor.hex}</div>
              <div className="text-sm text-gray-300">
                RGB({Math.round(resultColor.r)}, {Math.round(resultColor.g)},{' '}
                {Math.round(resultColor.b)})
              </div>
            </div>
          </div>
        </div>

        {/* Base Paint */}
        <div className="border-2 border-slate-600 rounded-lg p-4">
          <h3 className="font-bold text-gray-100 mb-2">Base Paint</h3>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white border-2 border-gray-600 rounded" />
            <div>
              <div className="font-medium text-gray-100">
                {(basePaint.amount / 1000).toFixed(1)} L White Base
              </div>
              <div className="text-xs text-gray-400">Titanium White (PW6)</div>
            </div>
          </div>
        </div>

        {/* Added Pigments */}
        <div className="border-2 border-slate-600 rounded-lg p-4">
          <h3 className="font-bold text-gray-100 mb-3">
            Pigments Added ({addedPigments.length})
          </h3>

          {!hasPigments && (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">🎨</div>
              <div className="text-sm">No pigments added yet</div>
              <div className="text-xs mt-1">Select pigments from the left panel</div>
            </div>
          )}

          {hasPigments && (
            <div className="space-y-2">
              {addedPigments.map((pigment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded border-2 border-gray-600 flex-shrink-0"
                    style={{ backgroundColor: rgbToCss(pigment.color) }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-100 truncate">
                      {pigment.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {pigment.amount} {pigment.unit} • {pigment.code}
                    </div>
                  </div>

                  <button
                    onClick={() => removePigment(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950 rounded px-2 py-1 transition-colors text-sm font-medium"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Copy Recipe Button */}
        {hasPigments && (
          <button
            onClick={handleCopyRecipe}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            📋 Copy Recipe to Clipboard
          </button>
        )}

        {/* Coverage Calculator */}
        <div className="border-t-2 border-slate-600 pt-4">
          <CoverageCalculator />
        </div>
      </div>
    </div>
  );
}
