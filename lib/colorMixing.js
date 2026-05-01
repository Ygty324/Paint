// Color mixing algorithm with subtractive approximation

// Unit conversion constants
const UNIT_CONVERSIONS = {
  drop: 0.05,  // 1 drop = 0.05 ml
  ml: 1,       // Base unit
  tube: 20,    // 1 tube = 20 ml
};

/**
 * Convert different units to milliliters (ml)
 * @param {number} amount - Amount in the given unit
 * @param {string} unit - Unit type: 'drop', 'ml', or 'tube'
 * @returns {number} Amount in milliliters
 */
export const convertToMl = (amount, unit) => {
  const unitLower = unit.toLowerCase();
  const conversion = UNIT_CONVERSIONS[unitLower];

  if (!conversion) {
    console.warn(`Unknown unit: ${unit}, defaulting to ml`);
    return amount;
  }

  return amount * conversion;
};

/**
 * Convert milliliters to a specific unit
 * @param {number} ml - Amount in milliliters
 * @param {string} unit - Target unit: 'drop', 'ml', or 'tube'
 * @returns {number} Amount in target unit
 */
export const convertFromMl = (ml, unit) => {
  const unitLower = unit.toLowerCase();
  const conversion = UNIT_CONVERSIONS[unitLower];

  if (!conversion) {
    console.warn(`Unknown unit: ${unit}, defaulting to ml`);
    return ml;
  }

  return ml / conversion;
};

/**
 * Calculate concentration of a pigment relative to the total mix
 * Uses a logarithmic-like scaling to prevent color from becoming too dark too quickly
 * @param {number} pigmentMl - Amount of pigment in ml
 * @param {number} totalMl - Total amount of paint in ml
 * @param {number} strength - Pigment strength factor (0-1)
 * @returns {number} Effective concentration (0-1)
 */
const calculateConcentration = (pigmentMl, totalMl, strength) => {
  const rawRatio = pigmentMl / totalMl;

  // Apply strength multiplier
  const strengthAdjusted = rawRatio * strength;

  // Use a curve to prevent immediate saturation
  // This simulates how paint doesn't instantly become the pigment color
  // Formula: concentration = 1 - exp(-k * ratio)
  // This gives diminishing returns as more pigment is added
  const k = 8; // Tuning constant (higher = faster saturation)
  const concentration = 1 - Math.exp(-k * strengthAdjusted);

  return Math.min(concentration, 1); // Cap at 1
};

/**
 * Blend two RGB colors with a given weight
 * Uses multiplicative blending to simulate subtractive color mixing
 * @param {Object} baseRgb - Base color {r, g, b}
 * @param {Object} pigmentRgb - Pigment color {r, g, b}
 * @param {number} concentration - How much pigment affects the base (0-1)
 * @returns {Object} Blended color {r, g, b}
 */
const blendColors = (baseRgb, pigmentRgb, concentration) => {
  // Normalize RGB to 0-1 range
  const baseNorm = {
    r: baseRgb.r / 255,
    g: baseRgb.g / 255,
    b: baseRgb.b / 255,
  };

  const pigmentNorm = {
    r: pigmentRgb.r / 255,
    g: pigmentRgb.g / 255,
    b: pigmentRgb.b / 255,
  };

  // Subtractive mixing approximation:
  // Mix multiplicatively (darker colors dominate) with linear interpolation
  // This simulates how real pigments absorb light
  const mix = (base, pigment) => {
    // Multiplicative component (subtractive)
    const multiplicative = base * pigment;

    // Linear interpolation component (additive)
    const linear = base * (1 - concentration) + pigment * concentration;

    // Blend both approaches (favor multiplicative for more realistic paint mixing)
    const subtractiveWeight = 0.7;
    return multiplicative * subtractiveWeight + linear * (1 - subtractiveWeight);
  };

  const blended = {
    r: mix(baseNorm.r, pigmentNorm.r),
    g: mix(baseNorm.g, pigmentNorm.g),
    b: mix(baseNorm.b, pigmentNorm.b),
  };

  // Convert back to 0-255 range
  return {
    r: Math.round(blended.r * 255),
    g: Math.round(blended.g * 255),
    b: Math.round(blended.b * 255),
  };
};

/**
 * Mix base paint with multiple pigments
 * @param {Object} basePaint - Base paint object with color and amount
 * @param {Array} addedPigments - Array of pigment objects with color, amount, unit, and strength
 * @returns {Object} Resulting color {r, g, b, hex}
 */
export const mixColor = (basePaint, addedPigments) => {
  if (!basePaint || !addedPigments || addedPigments.length === 0) {
    // No pigments added, return base color
    const baseColor = basePaint?.color || { r: 255, g: 255, b: 255 };
    return {
      ...baseColor,
      hex: rgbToHex(baseColor),
    };
  }

  // Start with base paint color
  let currentColor = { ...basePaint.color };
  const baseAmount = basePaint.amount || 1000; // ml

  // Calculate total amount of paint (base + all pigments)
  const totalPigmentMl = addedPigments.reduce((sum, pigment) => {
    return sum + convertToMl(pigment.amount, pigment.unit);
  }, 0);

  const totalAmount = baseAmount + totalPigmentMl;

  // Apply each pigment sequentially
  // This simulates adding pigments one by one to the mix
  addedPigments.forEach((pigment) => {
    const pigmentMl = convertToMl(pigment.amount, pigment.unit);
    const concentration = calculateConcentration(
      pigmentMl,
      totalAmount,
      pigment.strength || 0.5 // Default strength if not provided
    );

    // Blend current color with this pigment
    currentColor = blendColors(currentColor, pigment.color, concentration);
  });

  return {
    ...currentColor,
    hex: rgbToHex(currentColor),
  };
};

/**
 * Convert RGB object to hex string
 * @param {Object} rgb - Color object {r, g, b}
 * @returns {string} Hex color string (e.g., "#FF5733")
 */
export const rgbToHex = (rgb) => {
  const toHex = (n) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0').toUpperCase();
  };

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
};

/**
 * Convert RGB object to CSS rgb() string
 * @param {Object} rgb - Color object {r, g, b}
 * @returns {string} CSS rgb string (e.g., "rgb(255, 87, 51)")
 */
export const rgbToCss = (rgb) => {
  const r = Math.max(0, Math.min(255, Math.round(rgb.r)));
  const g = Math.max(0, Math.min(255, Math.round(rgb.g)));
  const b = Math.max(0, Math.min(255, Math.round(rgb.b)));

  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Calculate total amount of pigment in mix (in ml)
 * @param {Array} addedPigments - Array of pigment objects
 * @returns {number} Total pigment volume in ml
 */
export const getTotalPigmentVolume = (addedPigments) => {
  return addedPigments.reduce((sum, pigment) => {
    return sum + convertToMl(pigment.amount, pigment.unit);
  }, 0);
};

/**
 * Get total mix volume (base + pigments) in ml
 * @param {Object} basePaint - Base paint object
 * @param {Array} addedPigments - Array of pigment objects
 * @returns {number} Total volume in ml
 */
export const getTotalMixVolume = (basePaint, addedPigments) => {
  const baseAmount = basePaint?.amount || 1000;
  const pigmentAmount = getTotalPigmentVolume(addedPigments);
  return baseAmount + pigmentAmount;
};

export default {
  convertToMl,
  convertFromMl,
  mixColor,
  rgbToHex,
  rgbToCss,
  getTotalPigmentVolume,
  getTotalMixVolume,
};
