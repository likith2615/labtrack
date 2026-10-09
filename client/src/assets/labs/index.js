import React from 'react';
import ComputerLabBanner from './ComputerLabBanner';
import NetworkingLabBanner from './NetworkingLabBanner';
import ElectronicsLabBanner from './ElectronicsLabBanner';
import IoTLabBanner from './IoTLabBanner';
import MechanicalLabBanner from './MechanicalLabBanner';

export {
  ComputerLabBanner,
  NetworkingLabBanner,
  ElectronicsLabBanner,
  IoTLabBanner,
  MechanicalLabBanner
};

/**
 * Returns the matching risograph lab header banner SVG component
 * Supports lab IDs (1-5) or string identifiers/names
 */
export function getLabBanner(lab, props = {}) {
  const identifier = String(typeof lab === 'object' ? (lab.id || lab.name) : lab).toLowerCase();

  if (identifier.includes('comput') || identifier === '1') {
    return React.createElement(ComputerLabBanner, props);
  }
  if (identifier.includes('network') || identifier === '2') {
    return React.createElement(NetworkingLabBanner, props);
  }
  if (identifier.includes('electron') || identifier === '3') {
    return React.createElement(ElectronicsLabBanner, props);
  }
  if (identifier.includes('iot') || identifier.includes('embed') || identifier === '4') {
    return React.createElement(IoTLabBanner, props);
  }
  if (identifier.includes('mech') || identifier.includes('work') || identifier.includes('hangar') || identifier === '5') {
    return React.createElement(MechanicalLabBanner, props);
  }

  // Default fallback
  return React.createElement(ComputerLabBanner, props);
}

export default getLabBanner;
