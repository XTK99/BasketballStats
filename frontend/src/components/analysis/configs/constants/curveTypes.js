// D3 curve types for line/path interpolation
export const CURVE_TYPE_LINEAR = "linear";
export const CURVE_TYPE_BASIS = "basis";
export const CURVE_TYPE_BASIS_OPEN = "basisOpen";
export const CURVE_TYPE_BASIS_CLOSED = "basisClosed";
export const CURVE_TYPE_BUNDLE = "bundle";
export const CURVE_TYPE_CARDINAL = "cardinal";
export const CURVE_TYPE_CARDINAL_OPEN = "cardinalOpen";
export const CURVE_TYPE_CARDINAL_CLOSED = "cardinalClosed";
export const CURVE_TYPE_CATMULL_ROM = "catmullRom";
export const CURVE_TYPE_CATMULL_ROM_OPEN = "catmullRomOpen";
export const CURVE_TYPE_CATMULL_ROM_CLOSED = "catmullRomClosed";
export const CURVE_TYPE_MONOTONE_X = "monotoneX";
export const CURVE_TYPE_MONOTONE_Y = "monotoneY";
export const CURVE_TYPE_NATURAL = "natural";
export const CURVE_TYPE_STEP = "step";
export const CURVE_TYPE_STEP_BEFORE = "stepBefore";
export const CURVE_TYPE_STEP_AFTER = "stepAfter";
export const DEFAULT_CURVE_TYPE = CURVE_TYPE_LINEAR;

export const CURVE_TYPES = [
  CURVE_TYPE_LINEAR,
  CURVE_TYPE_BASIS,
  CURVE_TYPE_BASIS_OPEN,
  CURVE_TYPE_BASIS_CLOSED,
  CURVE_TYPE_BUNDLE,
  CURVE_TYPE_CARDINAL,
  CURVE_TYPE_CARDINAL_OPEN,
  CURVE_TYPE_CARDINAL_CLOSED,
  CURVE_TYPE_CATMULL_ROM,
  CURVE_TYPE_CATMULL_ROM_OPEN,
  CURVE_TYPE_CATMULL_ROM_CLOSED,
  CURVE_TYPE_MONOTONE_X,
  CURVE_TYPE_MONOTONE_Y,
  CURVE_TYPE_NATURAL,
  CURVE_TYPE_STEP,
  CURVE_TYPE_STEP_BEFORE,
  CURVE_TYPE_STEP_AFTER,
  DEFAULT_CURVE_TYPE,
];
