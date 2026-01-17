// PicoArt v67 - 교육 콘텐츠 통합
// 4개 파일로 분리:
// 1. movementsEducation.js - 서양 미술 10개 사조 (Overview + Education)
// 2. mastersEducation.js - 서양 거장 8명 (1차 교육)
// 3. orientalEducation.js - 동양화 6개 장르 (Overview + Education)

// 새로운 구조로 import
import { movementsOverview, movementsEducation } from './movementsEducation';
import { mastersEducation } from './mastersEducation';
import { orientalOverview, orientalEducation } from './orientalEducation';

// 하위 호환성을 위한 매핑 (옛 이름 → 새 이름)
const movementsPrimary = movementsOverview;
const movementsSecondary = movementsEducation;
const movementsStory = {};  // 더 이상 사용 안 함

const mastersPrimary = mastersEducation;
const mastersSecondary = mastersEducation;
const mastersStory = {};  // 더 이상 사용 안 함

const orientalPrimary = orientalOverview;
const orientalSecondary = orientalEducation;
const orientalStory = {};  // 더 이상 사용 안 함

// 기존 구조 유지 (하위 호환성)
export const educationContent = {
  // 사조
  movementsPrimary,
  movementsSecondary,
  movementsStory,
  // 거장
  mastersPrimary,
  mastersSecondary,
  mastersStory,
  // 동양화
  orientalPrimary,
  orientalSecondary,
  orientalStory,
  
  // v67 추가: 단일변환 로딩화면용 (ProcessingScreen에서 사용)
  // style.id로 직접 접근: educationContent.movements['renaissance']
  movements: movementsOverview,
  masters: mastersEducation,
  oriental: orientalOverview
};

// 개별 export
export { 
  movementsPrimary, movementsSecondary, movementsStory,
  mastersPrimary, mastersSecondary, mastersStory,
  orientalPrimary, orientalSecondary, orientalStory
};
