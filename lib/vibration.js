/**
 * Vibration utility for haptic feedback on button clicks
 * Uses the Vibration API to provide vibrations on supported devices
 */

/**
 * Trigger a vibration effect on the device
 * @param {number|number[]} pattern 
 */
export function triggerVibration(pattern = 50) {
  // Check if Vibration API is supported
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Vibration API error:', error);
    }
  }
}


export function vibrateLightClick() {
  triggerVibration(30);
}

export function vibrateMediumClick() {
  triggerVibration(50);
}


export function vibrateHeavyClick() {
  triggerVibration([50, 50, 50]);
}


export function vibrateSuccess() {
  triggerVibration([50, 100, 50]);
}


export function vibrateWarning() {
  triggerVibration([100, 50, 100]);
}

export default {
  triggerVibration,
  vibrateLightClick,
  vibrateMediumClick,
  vibrateHeavyClick,
  vibrateSuccess,
  vibrateWarning,
};
