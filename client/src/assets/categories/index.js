import React from 'react';
import ComputersIllustration from './ComputersIllustration';
import NetworkingIllustration from './NetworkingIllustration';
import ElectronicsIllustration from './ElectronicsIllustration';
import MeasuringInstrumentsIllustration from './MeasuringInstrumentsIllustration';
import SoftwareIllustration from './SoftwareIllustration';
import PeripheralsIllustration from './PeripheralsIllustration';

export {
  ComputersIllustration,
  NetworkingIllustration,
  ElectronicsIllustration,
  MeasuringInstrumentsIllustration,
  SoftwareIllustration,
  PeripheralsIllustration
};

/**
 * Returns the matching risograph category SVG illustration component
 * Supports category IDs (1-6) or string identifiers/names
 */
export function getCategoryIllustration(category, props = {}) {
  const identifier = String(typeof category === 'object' ? (category.id || category.name) : category).toLowerCase();

  if (identifier.includes('comput') || identifier === '1') {
    return React.createElement(ComputersIllustration, props);
  }
  if (identifier.includes('network') || identifier === '2') {
    return React.createElement(NetworkingIllustration, props);
  }
  if (identifier.includes('electron') || identifier.includes('test') || identifier === '3') {
    return React.createElement(ElectronicsIllustration, props);
  }
  if (identifier.includes('measur') || identifier.includes('micro') || identifier.includes('iot') || identifier === '4') {
    return React.createElement(MeasuringInstrumentsIllustration, props);
  }
  if (identifier.includes('fabricat') || identifier.includes('proto') || identifier.includes('periph') || identifier.includes('mech') || identifier === '5') {
    return React.createElement(PeripheralsIllustration, props);
  }
  if (identifier.includes('soft') || identifier.includes('licen') || identifier === '6') {
    return React.createElement(SoftwareIllustration, props);
  }

  // Default fallback
  return React.createElement(ComputersIllustration, props);
}

export default getCategoryIllustration;
