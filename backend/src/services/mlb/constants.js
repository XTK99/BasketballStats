// MLB Game Type Codes
const GAME_TYPE_REGULAR = "R"; // Regular season
const GAME_TYPE_SPRING = "S"; // Spring training
const GAME_TYPE_POSTSEASON = "P"; // Postseason
const GAME_TYPE_FINALS = "F"; // Wild Card / Finals

// SportType to ID mapping
const SPORT_TYPE_MLB = 1; // Major League Baseball
const SPORT_TYPE_AAA = 11; // Triple-A
const SPORT_TYPE_AAX = 12; // Double-A
const SPORT_TYPE_AFA = 13; // High-A
const SPORT_TYPE_AFX = 14; // Single-A
const SPORT_TYPE_ROK = 16; // Rookie
const SPORT_TYPE_WIN = 17; // Winter Leagues
const SPORT_TYPE_MIN = 21; // Minor League Baseball
const SPORT_TYPE_IND = 23; // Independent Leagues
const SPORT_TYPE_NLB = 61; // Negro League Baseball
const SPORT_TYPE_KOR = 32; // Korean Baseball Organization
const SPORT_TYPE_JML = 31; // Nippon Professional Baseball
const SPORT_TYPE_INT = 51; // International Baseball
const SPORT_TYPE_NAE = 509; // International Baseball (18U)
const SPORT_TYPE_NAS = 510; // International Baseball (16 and under)
const SPORT_TYPE_AME = 6005; // International Baseball (amateur)
const SPORT_TYPE_OLY = 52; // Olympic Baseball
const SPORT_TYPE_BBC = 22; // College Baseball
const SPORT_TYPE_HSB = 586; // High School Baseball
const SPORT_TYPE_WPS = 576; // Women's Professional Softball

const GAME_TYPES = {
  REGULAR: GAME_TYPE_REGULAR,
  SPRING: GAME_TYPE_SPRING,
  POSTSEASON: GAME_TYPE_POSTSEASON,
  FINALS: GAME_TYPE_FINALS,
};

const SPORT_TYPES = {
  MLB: SPORT_TYPE_MLB,
  AAA: SPORT_TYPE_AAA,
  AAX: SPORT_TYPE_AAX,
  AFA: SPORT_TYPE_AFA,
  AFX: SPORT_TYPE_AFX,
  ROK: SPORT_TYPE_ROK,
  WIN: SPORT_TYPE_WIN,
  MIN: SPORT_TYPE_MIN,
  IND: SPORT_TYPE_IND,
  NLB: SPORT_TYPE_NLB,
  KOR: SPORT_TYPE_KOR,
  JML: SPORT_TYPE_JML,
  INT: SPORT_TYPE_INT,
  NAE: SPORT_TYPE_NAE,
  NAS: SPORT_TYPE_NAS,
  AME: SPORT_TYPE_AME,
  OLY: SPORT_TYPE_OLY,
  BBC: SPORT_TYPE_BBC,
  HSB: SPORT_TYPE_HSB,
  WPS: SPORT_TYPE_WPS,
};

module.exports = {
  GAME_TYPE_REGULAR,
  GAME_TYPE_SPRING,
  GAME_TYPE_POSTSEASON,
  GAME_TYPE_FINALS,
  SPORT_TYPE_MLB,
  SPORT_TYPE_AAA,
  SPORT_TYPE_AAX,
  SPORT_TYPE_AFA,
  SPORT_TYPE_AFX,
  SPORT_TYPE_ROK,
  SPORT_TYPE_WIN,
  SPORT_TYPE_MIN,
  SPORT_TYPE_IND,
  SPORT_TYPE_NLB,
  SPORT_TYPE_KOR,
  SPORT_TYPE_JML,
  SPORT_TYPE_INT,
  SPORT_TYPE_NAE,
  SPORT_TYPE_NAS,
  SPORT_TYPE_AME,
  SPORT_TYPE_OLY,
  SPORT_TYPE_BBC,
  SPORT_TYPE_HSB,
  SPORT_TYPE_WPS,
  GAME_TYPES,
  SPORT_TYPES,
};
