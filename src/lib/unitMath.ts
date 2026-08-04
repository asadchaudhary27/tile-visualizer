export type UnitSystem = 'meters' | 'feet' | 'cm' | 'inches';

const METERS_TO_FEET_FACTOR = 3.28084;
const METERS_TO_INCHES_FACTOR = 39.3701;
const METERS_TO_CM_FACTOR = 100;

const SQ_METERS_TO_SQ_FEET_FACTOR = 10.7639;
const SQ_METERS_TO_SQ_INCHES_FACTOR = 1550.0031;
const SQ_METERS_TO_SQ_CM_FACTOR = 10000;

export function metersToFeet(meters: number): number {
  return meters * METERS_TO_FEET_FACTOR;
}

export function feetToMeters(feet: number): number {
  return feet / METERS_TO_FEET_FACTOR;
}

export function metersToCm(meters: number): number {
  return meters * METERS_TO_CM_FACTOR;
}

export function metersToInches(meters: number): number {
  return meters * METERS_TO_INCHES_FACTOR;
}

export function cmToMeters(cm: number): number {
  return cm / METERS_TO_CM_FACTOR;
}

export function inchesToMeters(inches: number): number {
  return inches / METERS_TO_INCHES_FACTOR;
}

export function sqMToSqFt(sqM: number): number {
  return sqM * SQ_METERS_TO_SQ_FEET_FACTOR;
}

export function sqMToSqIn(sqM: number): number {
  return sqM * SQ_METERS_TO_SQ_INCHES_FACTOR;
}

export function sqMToSqCm(sqM: number): number {
  return sqM * SQ_METERS_TO_SQ_CM_FACTOR;
}

export function formatUnit(valueMeters: number, unitSystem: UnitSystem): string {
  if (unitSystem === 'feet') return metersToFeet(valueMeters).toFixed(2);
  if (unitSystem === 'cm') return metersToCm(valueMeters).toFixed(2);
  if (unitSystem === 'inches') return metersToInches(valueMeters).toFixed(2);
  return valueMeters.toFixed(2);
}

export function formatArea(valueSqM: number, unitSystem: UnitSystem): string {
  if (unitSystem === 'feet') return sqMToSqFt(valueSqM).toFixed(2) + ' sq. ft.';
  if (unitSystem === 'cm') return sqMToSqCm(valueSqM).toFixed(2) + ' cm²';
  if (unitSystem === 'inches') return sqMToSqIn(valueSqM).toFixed(2) + ' sq. in.';
  return valueSqM.toFixed(2) + ' m²';
}

// Strictly returns raw numeric values without strings, to be used in calculations
export function getDisplayArea(valueSqM: number, unitSystem: UnitSystem): number {
  if (unitSystem === 'feet') return sqMToSqFt(valueSqM);
  if (unitSystem === 'cm') return sqMToSqCm(valueSqM);
  if (unitSystem === 'inches') return sqMToSqIn(valueSqM);
  return valueSqM;
}
