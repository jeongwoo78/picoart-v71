// ========================================
// educationMatcher.js - displayConfig 기반 교육자료 매칭
// v71 - 2026-01-18
// ========================================
//
// 모든 정규화는 displayConfig.js에서 처리
// 이 파일은 교육자료 연결만 담당
//
// ========================================

import { normalizeKey, getArtistName, ALIASES } from './displayConfig.js';

// ========================================
// 거장 작품별 교육자료 키 매핑
// ========================================
const MASTERS_WORK_MAP = {
  // 반 고흐
  'the starry night': 'vangogh-starrynight',
  'starry night': 'vangogh-starrynight',
  '별이 빛나는 밤': 'vangogh-starrynight',
  'sunflowers': 'vangogh-sunflowers',
  '해바라기': 'vangogh-sunflowers',
  'self-portrait': 'vangogh-selfportrait',
  '자화상': 'vangogh-selfportrait',
  'café terrace at night': 'vangogh-cafe',
  'cafe terrace': 'vangogh-cafe',
  '밤의 카페 테라스': 'vangogh-cafe',
  
  // 클림트
  'the kiss': 'klimt-kiss',
  'kiss': 'klimt-kiss',
  '키스': 'klimt-kiss',
  'the tree of life': 'klimt-treeoflife',
  'tree of life': 'klimt-treeoflife',
  '생명의 나무': 'klimt-treeoflife',
  'judith i': 'klimt-judith',
  'judith': 'klimt-judith',
  '유디트': 'klimt-judith',
  
  // 뭉크
  'the scream': 'munch-scream',
  'scream': 'munch-scream',
  '절규': 'munch-scream',
  'madonna': 'munch-madonna',
  '마돈나': 'munch-madonna',
  'jealousy': 'munch-jealousy',
  '질투': 'munch-jealousy',
  'anxiety': 'munch-anxiety',
  '불안': 'munch-anxiety',
  
  // 마티스
  'the dance': 'matisse-dance',
  'dance': 'matisse-dance',
  '춤': 'matisse-dance',
  'the red room': 'matisse-redroom',
  'red room': 'matisse-redroom',
  '붉은 방': 'matisse-redroom',
  'woman with a hat': 'matisse-womanhat',
  '모자를 쓴 여인': 'matisse-womanhat',
  'the green stripe': 'matisse-greenstripe',
  'green stripe': 'matisse-greenstripe',
  '초록 줄무늬': 'matisse-greenstripe',
  
  // 샤갈
  'lovers with flowers': 'chagall-lovers',
  '꽃다발과 연인들': 'chagall-lovers',
  'la branche': 'chagall-labranche',
  '나뭇가지': 'chagall-labranche',
  'la mariée': 'chagall-lamariee',
  'la mariee': 'chagall-lamariee',
  'the bride': 'chagall-lamariee',
  '신부': 'chagall-lamariee',
  
  // 프리다
  'me and my parrots': 'frida-parrots',
  '나와 앵무새들': 'frida-parrots',
  'self-portrait with thorn necklace': 'frida-thornnecklace',
  'thorn necklace': 'frida-thornnecklace',
  '가시 목걸이': 'frida-thornnecklace',
  'self-portrait with monkeys': 'frida-monkeys',
  '원숭이와 자화상': 'frida-monkeys',
  
  // 리히텐슈타인
  'in the car': 'lichtenstein-inthecar',
  '차 안에서': 'lichtenstein-inthecar',
  'drowning girl': 'lichtenstein-drowninggirl',
  '익사하는 소녀': 'lichtenstein-drowninggirl',
  'whaam!': 'lichtenstein-whaam',
  '콰앙!': 'lichtenstein-whaam'
};

// ========================================
// 거장 기본 키 (작품 매칭 실패시)
// ========================================
const MASTER_DEFAULT_KEYS = {
  'vangogh': 'vangogh-starrynight',
  'klimt': 'klimt-kiss',
  'munch': 'munch-scream',
  'matisse': 'matisse-dance',
  'chagall': 'chagall-lovers',
  'frida': 'frida-parrots',
  'lichtenstein': 'lichtenstein-inthecar'
};

// ========================================
// 메인 함수: 교육자료 키 가져오기
// ========================================

/**
 * 거장 교육자료 키 가져오기
 * @param {string} masterKey - 거장 키 (vangogh, klimt 등)
 * @param {string} selectedWork - AI가 선택한 작품명
 */
export function getMasterEducationKey(masterKey, selectedWork) {
  // 작품명으로 매칭 시도
  if (selectedWork) {
    const workLower = selectedWork.toLowerCase().trim();
    if (MASTERS_WORK_MAP[workLower]) {
      return MASTERS_WORK_MAP[workLower];
    }
  }
  
  // 작품 매칭 실패시 기본 키
  const normalizedMaster = normalizeKey(masterKey);
  return MASTER_DEFAULT_KEYS[normalizedMaster] || `${normalizedMaster}-default`;
}

/**
 * 사조 화가 교육자료 키 가져오기
 * @param {string} artistName - AI가 선택한 화가명
 */
export function getMovementEducationKey(artistName) {
  const normalized = normalizeKey(artistName);
  return normalized;
}

/**
 * 동양화 교육자료 키 가져오기
 * @param {string} styleId - 동양화 스타일 ID
 */
export function getOrientalEducationKey(styleId) {
  const normalized = normalizeKey(styleId);
  return normalized;
}

/**
 * 통합 함수: 카테고리별 교육자료 키 가져오기
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {object} apiResponse - API 응답 (aiSelectedArtist, selected_work 등)
 */
export function getEducationKey(category, apiResponse) {
  const { aiSelectedArtist, selected_work, styleId, masterId } = apiResponse;
  
  switch (category) {
    case 'masters':
      return getMasterEducationKey(masterId || aiSelectedArtist, selected_work);
      
    case 'movements':
      return getMovementEducationKey(aiSelectedArtist);
      
    case 'oriental':
      return getOrientalEducationKey(styleId || aiSelectedArtist);
      
    default:
      return normalizeKey(aiSelectedArtist || styleId || '');
  }
}

/**
 * 화가 표시 정보 가져오기
 * @param {string} artistName - 화가명 (어떤 형식이든)
 */
export function getArtistDisplayInfo(artistName) {
  return getArtistName(artistName);
}

// ========================================
// 하위 호환성 유지 (기존 코드 지원)
// ========================================

// 사조 화가명 → 교육자료 키 (레거시)
export function normalizeArtistKey(artistName) {
  return normalizeKey(artistName);
}

// 동양화 스타일 → 교육자료 키 (레거시)
export function normalizeOrientalKey(styleId) {
  return normalizeKey(styleId);
}

export default {
  getMasterEducationKey,
  getMovementEducationKey,
  getOrientalEducationKey,
  getEducationKey,
  getArtistDisplayInfo,
  normalizeArtistKey,
  normalizeOrientalKey,
  MASTERS_WORK_MAP,
  MASTER_DEFAULT_KEYS
};
