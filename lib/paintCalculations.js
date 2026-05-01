// Paint coverage and material calculations

import { convertToMl, convertFromMl } from './colorMixing';

// Industry standard: 1 liter of paint covers 10 m² (average for matte wall paint)
export const COVERAGE_PER_LITER = 10; // m²

// Standard packaging sizes
const TUBE_SIZE_ML = 20; // ml per tube
const BASE_PAINT_SIZES = [1, 2.5, 5, 10]; // Available liter sizes

/**
 * Calculate how many liters of paint are needed for a given wall area
 * @param {number} wallAreaM2 - Wall area in square meters
 * @returns {number} Liters of paint needed
 */
export const calculateLitersNeeded = (wallAreaM2) => {
  if (!wallAreaM2 || wallAreaM2 <= 0) {
    return 0;
  }

  return wallAreaM2 / COVERAGE_PER_LITER;
};

/**
 * Round up to the nearest standard paint size
 * @param {number} liters - Exact liters needed
 * @returns {number} Rounded to standard packaging size
 */
export const roundToStandardSize = (liters) => {
  // Find the smallest standard size that fits the requirement
  for (const size of BASE_PAINT_SIZES) {
    if (size >= liters) {
      return size;
    }
  }

  // If larger than all standard sizes, round up to nearest multiple of largest size
  const largestSize = BASE_PAINT_SIZES[BASE_PAINT_SIZES.length - 1];
  return Math.ceil(liters / largestSize) * largestSize;
};

/**
 * Calculate how many tubes of pigment are needed
 * @param {number} mlNeeded - Milliliters of pigment needed
 * @returns {Object} { tubes, exactMl }
 */
export const calculateTubesNeeded = (mlNeeded) => {
  const tubes = Math.ceil(mlNeeded / TUBE_SIZE_ML);
  return {
    tubes,
    exactMl: mlNeeded,
  };
};

/**
 * Scale a recipe proportionally for a given wall area
 * @param {Object} basePaint - Base paint object with amount (ml)
 * @param {Array} addedPigments - Array of pigment objects with amount, unit
 * @param {number} wallAreaM2 - Target wall area in square meters
 * @returns {Object} Scaled recipe with shopping list
 */
export const scaleRecipeForArea = (basePaint, addedPigments, wallAreaM2) => {
  if (!wallAreaM2 || wallAreaM2 <= 0) {
    return {
      scaleFactor: 0,
      basePaint: {
        litersNeeded: 0,
        litersToBuy: 0,
      },
      pigments: [],
      totalCost: null, // Cost calculation could be added later
    };
  }

  // Calculate liters needed
  const litersNeeded = calculateLitersNeeded(wallAreaM2);
  const litersToBuy = roundToStandardSize(litersNeeded);

  // Calculate scale factor
  // Original recipe is based on basePaint.amount (e.g., 1000ml = 1L)
  const originalLiters = (basePaint?.amount || 1000) / 1000;
  const scaleFactor = litersToBuy / originalLiters;

  // Scale each pigment proportionally
  const scaledPigments = addedPigments.map((pigment) => {
    // Convert to ml
    const originalMl = convertToMl(pigment.amount, pigment.unit);

    // Scale up
    const scaledMl = originalMl * scaleFactor;

    // Calculate tubes needed
    const tubesInfo = calculateTubesNeeded(scaledMl);

    return {
      id: pigment.id,
      name: pigment.name,
      code: pigment.code,
      originalAmount: pigment.amount,
      originalUnit: pigment.unit,
      scaledMl: scaledMl,
      tubesNeeded: tubesInfo.tubes,
      // Also provide in original unit for display
      scaledInOriginalUnit: convertFromMl(scaledMl, pigment.unit),
    };
  });

  return {
    wallArea: wallAreaM2,
    scaleFactor,
    basePaint: {
      litersNeeded: Number(litersNeeded.toFixed(2)),
      litersToBuy,
      originalLiters,
    },
    pigments: scaledPigments,
  };
};

/**
 * Generate a shopping list string from scaled recipe
 * @param {Object} scaledRecipe - Output from scaleRecipeForArea
 * @returns {string} Formatted shopping list
 */
export const generateShoppingList = (scaledRecipe) => {
  if (!scaledRecipe || scaledRecipe.scaleFactor === 0) {
    return 'Enter wall area to calculate materials needed.';
  }

  const { basePaint, pigments, wallArea } = scaledRecipe;

  let list = `Shopping List for ${wallArea} m²:\n\n`;

  // Base paint
  list += `✓ White Base Paint: ${basePaint.litersToBuy} L\n`;
  if (basePaint.litersToBuy > basePaint.litersNeeded) {
    list += `  (${basePaint.litersNeeded} L needed, buying ${basePaint.litersToBuy} L)\n`;
  }
  list += '\n';

  // Pigments
  if (pigments.length > 0) {
    list += 'Pigments:\n';
    pigments.forEach((pigment) => {
      list += `✓ ${pigment.name} (${pigment.code}): `;
      list += `${pigment.tubesNeeded} tube${pigment.tubesNeeded > 1 ? 's' : ''} `;
      list += `(${pigment.scaledMl.toFixed(1)} ml)\n`;
    });
  } else {
    list += 'No pigments added yet.\n';
  }

  return list;
};

/**
 * Generate a recipe card text from current mix
 * @param {Object} basePaint - Base paint object
 * @param {Array} addedPigments - Array of pigment objects
 * @returns {string} Formatted recipe card
 */
export const generateRecipeCard = (basePaint, addedPigments) => {
  const baseAmount = (basePaint?.amount || 1000) / 1000; // Convert to liters

  let recipe = `Recipe Card\n${'='.repeat(40)}\n\n`;
  recipe += `Base: ${baseAmount} L of White Base (Titanium White)\n\n`;

  if (addedPigments.length === 0) {
    recipe += 'No pigments added yet.\n';
  } else {
    recipe += 'Add the following pigments:\n\n';

    addedPigments.forEach((pigment, index) => {
      recipe += `${index + 1}. ${pigment.name} (${pigment.code})\n`;
      recipe += `   Amount: ${pigment.amount} ${pigment.unit}\n`;

      // Also show in ml for reference
      const inMl = convertToMl(pigment.amount, pigment.unit);
      if (pigment.unit !== 'ml') {
        recipe += `   (${inMl.toFixed(2)} ml)\n`;
      }

      recipe += '\n';
    });
  }

  recipe += `\n${'='.repeat(40)}\n`;
  recipe += 'Mix thoroughly until color is uniform.\n';

  return recipe;
};

/**
 * Format a number with commas for readability
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
export const formatNumber = (num) => {
  return num.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
};

export default {
  calculateLitersNeeded,
  roundToStandardSize,
  calculateTubesNeeded,
  scaleRecipeForArea,
  generateShoppingList,
  generateRecipeCard,
  formatNumber,
  COVERAGE_PER_LITER,
  TUBE_SIZE_ML,
};
