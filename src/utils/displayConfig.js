// ========================================
// displayConfig.js - 매칭 시스템 컨트롤 타워
// v71 - 2026-01-18
// ========================================
// 
// 모든 키 정규화, 별칭 매핑, 표시 정보를 한 곳에서 관리
// API 응답 → 정규화 → 교육자료/UI 표시
//
// ========================================

// ========================================
// 1. 표준 키 목록
// ========================================
export const STANDARD_KEYS = {
  // 사조 (11개)
  movements: [
    'greco-roman',
    'medieval-art', 
    'renaissance',
    'baroque',
    'rococo',
    'neoclassicism-romanticism-realism',
    'impressionism',
    'post-impressionism',
    'fauvism',
    'expressionism',
    'modernism'
  ],
  
  // 거장 (7명)
  masters: [
    'vangogh',
    'klimt', 
    'munch',
    'matisse',
    'chagall',
    'frida',
    'lichtenstein'
  ],
  
  // 동양화 (6개)
  oriental: [
    'korean-minhwa',
    'korean-pungsokdo',
    'korean-jingyeong',
    'chinese-ink',
    'chinese-gongbi',
    'japanese-ukiyoe'
  ],
  
  // 사조별 화가 (37명)
  artists: [
    // 그리스·로마
    'classical-sculpture', 'roman-mosaic',
    // 중세
    'byzantine', 'gothic', 'islamic-miniature',
    // 르네상스
    'leonardo', 'michelangelo', 'raphael', 'botticelli', 'titian',
    // 바로크
    'caravaggio', 'rembrandt', 'velazquez', 'rubens',
    // 로코코
    'watteau', 'boucher',
    // 신고전·낭만·사실
    'david', 'ingres', 'turner', 'delacroix', 'courbet', 'manet',
    // 인상주의
    'monet', 'renoir', 'degas', 'caillebotte',
    // 후기인상주의
    'vangogh', 'gauguin', 'cezanne',
    // 야수파
    'matisse', 'derain', 'vlaminck',
    // 표현주의
    'munch', 'kirchner', 'kokoschka',
    // 모더니즘
    'picasso', 'magritte', 'miro', 'chagall', 'lichtenstein'
  ]
};

// ========================================
// 2. 별칭 테이블 (ALIASES)
// ========================================
// 어떤 입력이든 → 표준 키로 변환
export const ALIASES = {
  // ===== 사조 별칭 =====
  // 그리스·로마
  'ancient': 'greco-roman',
  'ancient-art': 'greco-roman',
  'greek-roman': 'greco-roman',
  'greco-roman': 'greco-roman',
  
  // 중세
  'medieval': 'medieval-art',
  'medieval-art': 'medieval-art',
  
  // 르네상스
  'renaissance': 'renaissance',
  
  // 바로크
  'baroque': 'baroque',
  
  // 로코코
  'rococo': 'rococo',
  
  // 신고전·낭만·사실
  'neoclassicism_vs_romanticism_vs_realism': 'neoclassicism-romanticism-realism',
  'neoclassicism-romanticism-realism': 'neoclassicism-romanticism-realism',
  'neoclassicism': 'neoclassicism-romanticism-realism',
  
  // 인상주의
  'impressionism': 'impressionism',
  
  // 후기인상주의
  'postImpressionism': 'post-impressionism',
  'post-impressionism': 'post-impressionism',
  'postimpressionism': 'post-impressionism',
  
  // 야수파
  'fauvism': 'fauvism',
  
  // 표현주의
  'expressionism': 'expressionism',
  
  // 모더니즘
  'modernism': 'modernism',
  
  // ===== 거장 별칭 =====
  // 반 고흐
  'vangogh': 'vangogh',
  'van gogh': 'vangogh',
  'vincent van gogh': 'vangogh',
  '반 고흐': 'vangogh',
  '빈센트 반 고흐': 'vangogh',
  'gogh': 'vangogh',
  
  // 클림트
  'klimt': 'klimt',
  'gustav klimt': 'klimt',
  '클림트': 'klimt',
  '구스타프 클림트': 'klimt',
  
  // 뭉크
  'munch': 'munch',
  'edvard munch': 'munch',
  '뭉크': 'munch',
  '에드바르 뭉크': 'munch',
  
  // 마티스
  'matisse': 'matisse',
  'henri matisse': 'matisse',
  '마티스': 'matisse',
  '앙리 마티스': 'matisse',
  
  // 샤갈
  'chagall': 'chagall',
  'marc chagall': 'chagall',
  '샤갈': 'chagall',
  '마르크 샤갈': 'chagall',
  
  // 프리다
  'frida': 'frida',
  'frida kahlo': 'frida',
  '프리다': 'frida',
  '프리다 칼로': 'frida',
  
  // 리히텐슈타인
  'lichtenstein': 'lichtenstein',
  'roy lichtenstein': 'lichtenstein',
  '리히텐슈타인': 'lichtenstein',
  '로이 리히텐슈타인': 'lichtenstein',
  
  // ===== 동양화 별칭 =====
  // 한국 - 민화
  'korean-minhwa': 'korean-minhwa',
  'korean_minhwa': 'korean-minhwa',
  'minhwa': 'korean-minhwa',
  '민화': 'korean-minhwa',
  
  // 한국 - 풍속도
  'korean-pungsokdo': 'korean-pungsokdo',
  'korean_pungsokdo': 'korean-pungsokdo',
  'korean-genre': 'korean-pungsokdo',
  'korean_genre': 'korean-pungsokdo',
  'pungsokdo': 'korean-pungsokdo',
  '풍속도': 'korean-pungsokdo',
  
  // 한국 - 진경산수
  'korean-jingyeong': 'korean-jingyeong',
  'korean_jingyeong': 'korean-jingyeong',
  'jingyeong': 'korean-jingyeong',
  '진경산수': 'korean-jingyeong',
  
  // 중국 - 수묵화
  'chinese-ink': 'chinese-ink',
  'chinese_ink': 'chinese-ink',
  'shuimohua': 'chinese-ink',
  '수묵화': 'chinese-ink',
  
  // 중국 - 공필화
  'chinese-gongbi': 'chinese-gongbi',
  'chinese_gongbi': 'chinese-gongbi',
  'gongbi': 'chinese-gongbi',
  '공필화': 'chinese-gongbi',
  
  // 일본 - 우키요에
  'japanese-ukiyoe': 'japanese-ukiyoe',
  'japanese_ukiyoe': 'japanese-ukiyoe',
  'ukiyoe': 'japanese-ukiyoe',
  '우키요에': 'japanese-ukiyoe',
  
  // ===== 화가 별칭 (37명) =====
  // 그리스·로마
  'classical sculpture': 'classical-sculpture',
  'classical-sculpture': 'classical-sculpture',
  'ancient-greek-sculpture': 'classical-sculpture',
  '고대 그리스 조각': 'classical-sculpture',
  
  'roman mosaic': 'roman-mosaic',
  'roman-mosaic': 'roman-mosaic',
  '로마 모자이크': 'roman-mosaic',
  
  // 중세
  'byzantine': 'byzantine',
  '비잔틴': 'byzantine',
  '비잔틴 미술': 'byzantine',
  
  'gothic': 'gothic',
  '고딕': 'gothic',
  '고딕 미술': 'gothic',
  
  'islamic miniature': 'islamic-miniature',
  'islamic-miniature': 'islamic-miniature',
  '이슬람 세밀화': 'islamic-miniature',
  
  // 르네상스
  'leonardo': 'leonardo',
  'leonardo da vinci': 'leonardo',
  '레오나르도': 'leonardo',
  '다빈치': 'leonardo',
  
  'michelangelo': 'michelangelo',
  '미켈란젤로': 'michelangelo',
  
  'raphael': 'raphael',
  '라파엘로': 'raphael',
  '라파엘': 'raphael',
  
  'botticelli': 'botticelli',
  '보티첼리': 'botticelli',
  
  'titian': 'titian',
  '티치아노': 'titian',
  
  // 바로크
  'caravaggio': 'caravaggio',
  '카라바조': 'caravaggio',
  
  'rembrandt': 'rembrandt',
  '렘브란트': 'rembrandt',
  
  'velazquez': 'velazquez',
  'velázquez': 'velazquez',
  '벨라스케스': 'velazquez',
  
  'rubens': 'rubens',
  '루벤스': 'rubens',
  
  // 로코코
  'watteau': 'watteau',
  '와토': 'watteau',
  
  'boucher': 'boucher',
  '부셰': 'boucher',
  
  // 신고전·낭만·사실
  'david': 'david',
  'jacques-louis david': 'david',
  '다비드': 'david',
  
  'ingres': 'ingres',
  '앵그르': 'ingres',
  
  'turner': 'turner',
  '터너': 'turner',
  
  'delacroix': 'delacroix',
  '들라크루아': 'delacroix',
  
  'courbet': 'courbet',
  '쿠르베': 'courbet',
  
  'manet': 'manet',
  '마네': 'manet',
  
  // 인상주의
  'monet': 'monet',
  'claude monet': 'monet',
  '모네': 'monet',
  
  'renoir': 'renoir',
  '르누아르': 'renoir',
  
  'degas': 'degas',
  '드가': 'degas',
  
  'caillebotte': 'caillebotte',
  '카유보트': 'caillebotte',
  
  // 후기인상주의
  'gauguin': 'gauguin',
  '고갱': 'gauguin',
  
  'cezanne': 'cezanne',
  'cézanne': 'cezanne',
  '세잔': 'cezanne',
  
  // 야수파
  'derain': 'derain',
  '드랭': 'derain',
  
  'vlaminck': 'vlaminck',
  '블라맹크': 'vlaminck',
  
  // 표현주의
  'kirchner': 'kirchner',
  '키르히너': 'kirchner',
  
  'kokoschka': 'kokoschka',
  '코코슈카': 'kokoschka',
  
  // 모더니즘
  'picasso': 'picasso',
  'pablo picasso': 'picasso',
  '피카소': 'picasso',
  
  'magritte': 'magritte',
  '마그리트': 'magritte',
  
  'miro': 'miro',
  'miró': 'miro',
  '미로': 'miro'
};

// ========================================
// 3. 정규화 함수
// ========================================
export function normalizeKey(input) {
  if (!input) return null;
  
  // 소문자 변환 + 앞뒤 공백 제거
  const lower = input.toLowerCase().trim();
  
  // 별칭 테이블에서 찾기
  if (ALIASES[lower]) {
    return ALIASES[lower];
  }
  
  // 언더스코어 → 하이픈 변환 후 다시 찾기
  const hyphenated = lower.replace(/_/g, '-');
  if (ALIASES[hyphenated]) {
    return ALIASES[hyphenated];
  }
  
  // 그대로 반환 (표준 키일 수 있음)
  return lower;
}

// ========================================
// 4. 표시 정보 (DISPLAY_INFO)
// ========================================
// 로딩 화면, 결과 화면에서 사용할 제목/부제목
export const DISPLAY_INFO = {
  // ===== 사조 =====
  movements: {
    'greco-roman': {
      loading: { title: '고대 그리스·로마', subtitle: '고대 그리스 조각 · 로마 모자이크' },
      result: { title: '고대 그리스·로마' }
    },
    'medieval-art': {
      loading: { title: '중세 미술', subtitle: '비잔틴 · 고딕 · 이슬람 세밀화' },
      result: { title: '중세 미술' }
    },
    'renaissance': {
      loading: { title: '르네상스', subtitle: '다빈치 · 미켈란젤로 · 보티첼리' },
      result: { title: '르네상스' }
    },
    'baroque': {
      loading: { title: '바로크', subtitle: '카라바조 · 렘브란트 · 벨라스케스' },
      result: { title: '바로크' }
    },
    'rococo': {
      loading: { title: '로코코', subtitle: '와토 · 부셰' },
      result: { title: '로코코' }
    },
    'neoclassicism-romanticism-realism': {
      loading: { title: '신고전·낭만·사실주의', subtitle: '다비드 · 들라크루아 · 쿠르베' },
      result: { title: '신고전·낭만·사실주의' }
    },
    'impressionism': {
      loading: { title: '인상주의', subtitle: '모네 · 르누아르 · 드가' },
      result: { title: '인상주의' }
    },
    'post-impressionism': {
      loading: { title: '후기인상주의', subtitle: '반 고흐 · 고갱 · 세잔' },
      result: { title: '후기인상주의' }
    },
    'fauvism': {
      loading: { title: '야수파', subtitle: '마티스 · 드랭 · 블라맹크' },
      result: { title: '야수파' }
    },
    'expressionism': {
      loading: { title: '표현주의', subtitle: '뭉크 · 키르히너 · 코코슈카' },
      result: { title: '표현주의' }
    },
    'modernism': {
      loading: { title: '모더니즘', subtitle: '피카소 · 마그리트 · 샤갈' },
      result: { title: '모더니즘' }
    }
  },
  
  // ===== 거장 =====
  masters: {
    'vangogh': {
      loading: { title: '빈센트 반 고흐', subtitle: 'Vincent van Gogh' },
      result: { title: '반 고흐' }
    },
    'klimt': {
      loading: { title: '구스타프 클림트', subtitle: 'Gustav Klimt' },
      result: { title: '클림트' }
    },
    'munch': {
      loading: { title: '에드바르 뭉크', subtitle: 'Edvard Munch' },
      result: { title: '뭉크' }
    },
    'matisse': {
      loading: { title: '앙리 마티스', subtitle: 'Henri Matisse' },
      result: { title: '마티스' }
    },
    'chagall': {
      loading: { title: '마르크 샤갈', subtitle: 'Marc Chagall' },
      result: { title: '샤갈' }
    },
    'frida': {
      loading: { title: '프리다 칼로', subtitle: 'Frida Kahlo' },
      result: { title: '프리다' }
    },
    'lichtenstein': {
      loading: { title: '로이 리히텐슈타인', subtitle: 'Roy Lichtenstein' },
      result: { title: '리히텐슈타인' }
    }
  },
  
  // ===== 동양화 =====
  oriental: {
    'korean-minhwa': {
      loading: { title: '한국 민화', subtitle: 'Korean Folk Painting' },
      result: { title: '민화' }
    },
    'korean-pungsokdo': {
      loading: { title: '한국 풍속도', subtitle: 'Korean Genre Painting' },
      result: { title: '풍속도' }
    },
    'korean-jingyeong': {
      loading: { title: '한국 진경산수', subtitle: 'Korean True-View Landscape' },
      result: { title: '진경산수' }
    },
    'chinese-ink': {
      loading: { title: '중국 수묵화', subtitle: 'Chinese Ink Painting' },
      result: { title: '수묵화' }
    },
    'chinese-gongbi': {
      loading: { title: '중국 공필화', subtitle: 'Chinese Gongbi' },
      result: { title: '공필화' }
    },
    'japanese-ukiyoe': {
      loading: { title: '일본 우키요에', subtitle: 'Japanese Ukiyo-e' },
      result: { title: '우키요에' }
    }
  },
  
  // ===== 화가 (37명) =====
  artists: {
    // 그리스·로마
    'classical-sculpture': { name: '고대 그리스 조각', fullName: 'Ancient Greek Sculpture' },
    'roman-mosaic': { name: '로마 모자이크', fullName: 'Roman Mosaic' },
    
    // 중세
    'byzantine': { name: '비잔틴 미술', fullName: 'Byzantine Art' },
    'gothic': { name: '고딕 미술', fullName: 'Gothic Art' },
    'islamic-miniature': { name: '이슬람 세밀화', fullName: 'Islamic Miniature' },
    
    // 르네상스
    'leonardo': { name: '레오나르도 다 빈치', fullName: 'Leonardo da Vinci' },
    'michelangelo': { name: '미켈란젤로', fullName: 'Michelangelo Buonarroti' },
    'raphael': { name: '라파엘로', fullName: 'Raphael Sanzio' },
    'botticelli': { name: '보티첼리', fullName: 'Sandro Botticelli' },
    'titian': { name: '티치아노', fullName: 'Titian' },
    
    // 바로크
    'caravaggio': { name: '카라바조', fullName: 'Caravaggio' },
    'rembrandt': { name: '렘브란트', fullName: 'Rembrandt van Rijn' },
    'velazquez': { name: '벨라스케스', fullName: 'Diego Velázquez' },
    'rubens': { name: '루벤스', fullName: 'Peter Paul Rubens' },
    
    // 로코코
    'watteau': { name: '와토', fullName: 'Jean-Antoine Watteau' },
    'boucher': { name: '부셰', fullName: 'François Boucher' },
    
    // 신고전·낭만·사실
    'david': { name: '다비드', fullName: 'Jacques-Louis David' },
    'ingres': { name: '앵그르', fullName: 'Jean-Auguste-Dominique Ingres' },
    'turner': { name: '터너', fullName: 'J.M.W. Turner' },
    'delacroix': { name: '들라크루아', fullName: 'Eugène Delacroix' },
    'courbet': { name: '쿠르베', fullName: 'Gustave Courbet' },
    'manet': { name: '마네', fullName: 'Édouard Manet' },
    
    // 인상주의
    'monet': { name: '모네', fullName: 'Claude Monet' },
    'renoir': { name: '르누아르', fullName: 'Pierre-Auguste Renoir' },
    'degas': { name: '드가', fullName: 'Edgar Degas' },
    'caillebotte': { name: '카유보트', fullName: 'Gustave Caillebotte' },
    
    // 후기인상주의
    'vangogh': { name: '반 고흐', fullName: 'Vincent van Gogh' },
    'gauguin': { name: '고갱', fullName: 'Paul Gauguin' },
    'cezanne': { name: '세잔', fullName: 'Paul Cézanne' },
    
    // 야수파
    'matisse': { name: '마티스', fullName: 'Henri Matisse' },
    'derain': { name: '드랭', fullName: 'André Derain' },
    'vlaminck': { name: '블라맹크', fullName: 'Maurice de Vlaminck' },
    
    // 표현주의
    'munch': { name: '뭉크', fullName: 'Edvard Munch' },
    'kirchner': { name: '키르히너', fullName: 'Ernst Ludwig Kirchner' },
    'kokoschka': { name: '코코슈카', fullName: 'Oskar Kokoschka' },
    
    // 모더니즘
    'picasso': { name: '피카소', fullName: 'Pablo Picasso' },
    'magritte': { name: '마그리트', fullName: 'René Magritte' },
    'miro': { name: '미로', fullName: 'Joan Miró' },
    'chagall': { name: '샤갈', fullName: 'Marc Chagall' },
    'lichtenstein': { name: '리히텐슈타인', fullName: 'Roy Lichtenstein' }
  }
};

// ========================================
// 5. 교육자료 키 매핑
// ========================================
// 어떤 교육자료 파일의 어떤 키를 사용할지
export const EDUCATION_KEY_MAP = {
  // 사조 → movementsEducation.js 키
  movements: {
    'greco-roman': 'greco-roman',
    'medieval-art': 'medieval-art',
    'renaissance': 'renaissance',
    'baroque': 'baroque',
    'rococo': 'rococo',
    'neoclassicism-romanticism-realism': 'neoclassicism-romanticism-realism',
    'impressionism': 'impressionism',
    'post-impressionism': 'post-impressionism',
    'fauvism': 'fauvism',
    'expressionism': 'expressionism',
    'modernism': 'modernism'
  },
  
  // 거장 → mastersEducation.js 키
  masters: {
    'vangogh': 'vangogh',
    'klimt': 'klimt',
    'munch': 'munch',
    'matisse': 'matisse',
    'chagall': 'chagall',
    'frida': 'frida',
    'lichtenstein': 'lichtenstein'
  },
  
  // 동양화 → orientalEducation.js 키
  oriental: {
    'korean-minhwa': 'korean-minhwa',
    'korean-pungsokdo': 'korean-pungsokdo',
    'korean-jingyeong': 'korean-jingyeong',
    'chinese-ink': 'chinese-ink',
    'chinese-gongbi': 'chinese-gongbi',
    'japanese-ukiyoe': 'japanese-ukiyoe'
  }
};

// ========================================
// 6. 유틸리티 함수
// ========================================

/**
 * 표시 정보 가져오기
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {string} key - 정규화된 키
 * @param {string} screen - 'loading' | 'result'
 */
export function getDisplayInfo(category, key, screen = 'loading') {
  const normalizedKey = normalizeKey(key);
  const categoryInfo = DISPLAY_INFO[category];
  
  if (!categoryInfo || !categoryInfo[normalizedKey]) {
    return { title: key, subtitle: '' };
  }
  
  return categoryInfo[normalizedKey][screen] || { title: key, subtitle: '' };
}

/**
 * 화가 이름 가져오기
 * @param {string} artistKey - 화가 키 (정규화 전/후 모두 가능)
 */
export function getArtistName(artistKey) {
  const normalizedKey = normalizeKey(artistKey);
  const artistInfo = DISPLAY_INFO.artists[normalizedKey];
  
  if (!artistInfo) {
    return { name: artistKey, fullName: artistKey };
  }
  
  return artistInfo;
}

/**
 * 교육자료 키 가져오기
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {string} key - 정규화 전 키
 */
export function getEducationKey(category, key) {
  const normalizedKey = normalizeKey(key);
  const categoryMap = EDUCATION_KEY_MAP[category];
  
  if (!categoryMap) return normalizedKey;
  
  return categoryMap[normalizedKey] || normalizedKey;
}

/**
 * 카테고리 판별
 * @param {string} key - 아무 키
 * @returns {string|null} - 'movements' | 'masters' | 'oriental' | 'artists' | null
 */
export function detectCategory(key) {
  const normalizedKey = normalizeKey(key);
  
  if (STANDARD_KEYS.movements.includes(normalizedKey)) return 'movements';
  if (STANDARD_KEYS.masters.includes(normalizedKey)) return 'masters';
  if (STANDARD_KEYS.oriental.includes(normalizedKey)) return 'oriental';
  if (STANDARD_KEYS.artists.includes(normalizedKey)) return 'artists';
  
  return null;
}

export default {
  STANDARD_KEYS,
  ALIASES,
  DISPLAY_INFO,
  EDUCATION_KEY_MAP,
  normalizeKey,
  getDisplayInfo,
  getArtistName,
  getEducationKey,
  detectCategory
};
