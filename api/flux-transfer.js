// PicoArt v74 - Kontext 프롬프트 최소화
// v76: Kontext 프롬프트 공식 권장 구조 적용
// "ONLY ${correctionPrompt} while keeping the same painting style"
//      - 불필요한 보존 명령어 제거
//      - Kontext가 자동으로 나머지 유지 (이미지 편집 모델 특성)
//
// v70: 재변환 시 artistStyles.js 화풍 연동
//
// v64: 자연어 문장형 프롬프트 적용
//      - "by [Artist], [Artist] art style" 패턴 적용
//      - 핵심 내용 유지하면서 더 명확한 전달
//
// v63: 대전제 v2 + 화가별 프롬프트 개선
//      - 대전제: 스타일 우선 + 사진 제외어 강화
//      - 화가: "by XY, XY art style" 패턴 적용
//      - 기법: 구체적 묘사 추가 (impasto, palette knife 등)
//      - FLUX는 부정어 미지원으로 긍정 표현만 사용
//
// v62.5: FLUX Pro 테스트 (반 고흐/피카소/워홀)
//      - 결과: 비용 2배, 효과 없음 → 포기
//
// v62.1: 대전제 PREFIX 위치 수정
//      - 환각 방지 강화: "If 1 person in photo, output must have EXACTLY 1 person"
//      - 스타일 적용 강화: "people must look PAINTED not photographic"
//
// v62: artistEnhancements.js 연동 + 프롬프트 순서 최적화
//      - 대전제 6개 규칙 → 프롬프트 맨 앞으로 이동 (AI 우선순위)
//      - 거장 대표작별 세부 프롬프트 실제 적용 (20개)
//      - avoidFor 관계 체크 (부모-자녀 → The Kiss 금지 등)
//      - expressionRule 적용 (뭉크 NO bright NO smiling 등)
//      - artistEnhancements.js에서 프롬프트 import
//
// v61: 의상 변환 체계화 + 붓터치 강화 + 거장 표정 규칙
//      - 대전제 6개 규칙 (신원/관계/매력/환각/스타일+붓터치/텍스트)
//      - 사조별 강화 프롬프트 53개 (체계화)
//      - 거장 대표작별 강화 프롬프트 20개 (신규)
//      - 붓터치 필수 규칙 공통 적용
//      - 거장 모드: 사조 개인 + 대표작 프롬프트 결합

// ========================================
// v62: artistEnhancements.js → v66에서 삭제됨 (artistStyles.js로 통합)
// ========================================

// ========================================
// v64: 사조별 대표작 매칭 시스템
// ========================================
import {
  getMovementMasterwork,
  getMasterworkGuideForAI,
  getArtistMasterworkList,
  getMovementMasterworkGuide,
  getArtistMasterworkGuide,
  allMovementMasterworks,
  masterworkNameMapping
} from './masterworks.js';

// ========================================
// v66: 통합 화풍 프롬프트
// ========================================
import {
  ARTIST_STYLES,
  PAINT_TEXTURE,
  getArtistStyle,
  getArtistStyleByName
} from './artistStyles.js';

// ========================================
// v65: 리히텐슈타인 말풍선 텍스트 (50개)
// 짧은 감탄사 + 대화체 + 독백체 + 긴 문장 혼합
// ========================================
const LICHTENSTEIN_SPEECH_BUBBLES = {
  // 감탄/기쁨 (12개) - 그룹/밝은 분위기
  excited: [
    "WOW!", "AMAZING!", "INCREDIBLE!", "PERFECT!", "YES!",
    "THIS IS THE BEST DAY EVER!", "I CAN'T BELIEVE THIS IS HAPPENING!",
    "EVERYTHING IS GOING TO BE ALRIGHT!", "WE DID IT!", "THIS IS SO EXCITING!",
    "I KNEW WE COULD DO IT!", "NOTHING CAN STOP US NOW!"
  ],
  // 로맨틱 (10개) - 커플
  romantic: [
    "I LOVE YOU!", "KISS ME!", "MY DARLING!", "YOU'RE THE ONE!",
    "I'VE BEEN WAITING FOR THIS MOMENT!", "MY HEART BEATS ONLY FOR YOU!",
    "I NEVER WANT THIS TO END!", "YOU MAKE EVERYTHING BETTER!",
    "STAY WITH ME FOREVER!", "THIS FEELS LIKE A DREAM!"
  ],
  // 드라마틱 (10개) - 강렬한 감정/여성
  dramatic: [
    "I CAN'T BELIEVE IT!", "HOW COULD THIS HAPPEN?!", "IT'S OVER!",
    "I DON'T CARE ANYMORE!", "WHY DIDN'T ANYONE TELL ME?!",
    "I SHOULD HAVE KNOWN!", "EVERYTHING HAS CHANGED NOW!",
    "I NEVER THOUGHT IT WOULD END LIKE THIS!", "THIS CAN'T BE REAL!",
    "I WON'T LET THIS STOP ME!"
  ],
  // 대화체/독백 (10개) - 원작 스타일
  dialogue: [
    "MAYBE HE'LL CALL ME TOMORROW...", "I WONDER WHAT HAPPENS NEXT...",
    "THEY SAID IT COULDN'T BE DONE!", "SHE TOLD ME TO WAIT HERE!",
    "HE PROMISED HE WOULD COME BACK!", "I THOUGHT I SAW SOMETHING!",
    "SOMEONE HAS TO DO SOMETHING!", "THAT'S EXACTLY WHAT I NEEDED!",
    "I KNEW SOMETHING WAS DIFFERENT TODAY!", "THIS CHANGES EVERYTHING!"
  ],
  // 놀람/생각 (8개) - 중립
  surprised: [
    "WHAT?!", "OH MY!", "REALLY?!", "WAIT... WHAT?!",
    "I NEVER EXPECTED THIS!", "COULD IT BE TRUE?!",
    "SOMETHING DOESN'T FEEL RIGHT...", "WHAT JUST HAPPENED?!"
  ]
};

// 말풍선 텍스트 선택 함수
function selectSpeechBubbleText(visionData) {
  let category = 'excited'; // 기본값
  
  if (visionData) {
    const personCount = visionData.person_count || 1;
    const gender = visionData.gender;
    
    // 3명 이상 그룹이면 감탄
    if (personCount >= 3) {
      category = 'excited';
    }
    // 2명 커플이면 로맨틱
    else if (personCount === 2) {
      category = 'romantic';
    }
    // 여성 단독이면 드라마틱/대화체/로맨틱 랜덤
    else if (gender === 'female') {
      const rand = Math.random();
      if (rand < 0.4) category = 'dramatic';
      else if (rand < 0.7) category = 'dialogue';
      else category = 'romantic';
    }
    // 남성 단독이면 감탄/대화체 랜덤
    else if (gender === 'male') {
      category = Math.random() > 0.5 ? 'excited' : 'dialogue';
    }
    // 기본은 랜덤
    else {
      const categories = ['excited', 'dialogue', 'surprised'];
      category = categories[Math.floor(Math.random() * categories.length)];
    }
  }
  
  const texts = LICHTENSTEIN_SPEECH_BUBBLES[category];
  return texts[Math.floor(Math.random() * texts.length)];
}

// ========================================
// v70: 화가별 설정 통합 관리
// 🎯 수정 위치: 여기서 화가별 control_strength, 붓터치 크기 조정!
// 
// [control] 낮을수록 화풍 강하게, 높을수록 원본 유지
//   - 0.10~0.30: 매우 강함 (피카소, 모네, 르누아르)
//   - 0.40~0.50: 강함 (반 고흐, 카라바조, 마티스)
//   - 0.55~0.65: 중간 (클림트, 세잔, 마그리트)
//   - 0.70~0.80: 약함 (프리다, 동양화, 보티첼리)
//
// [brush] 붓터치 크기 (null = 붓터치 없음)
//   - null: 조각, 스테인드글라스, 동양화, 팝아트
//   - '8mm': 점묘법 (시냑)
//   - '15mm': 세밀화 (이슬람 미니어처)
//   - '20mm': 섬세 (르네상스, 바로크, 로코코)
//   - '25mm': 중간 (신고전, 낭만, 사실, 클림트)
//   - '30mm': 굵음 (인상주의, 후기인상, 모더니즘)
//   - '35mm': 더 굵음 (야수파, 표현주의)
//   - '50mm': 임파스토 (반 고흐, 모자이크)
//
// [2025.01 기준값 예시]
//   피카소:   { control: 0.10, brush: '30mm' }  ← 화풍 매우 강함
//   반 고흐:  { control: 0.45, brush: '50mm' }  ← 두꺼운 임파스토
//   레오나르도: { control: 0.40, brush: '20mm' }  ← 섬세한 스푸마토
//   시냑:     { control: 0.55, brush: '8mm' }   ← 점묘법
//   워홀:     { control: 0.45, brush: null }    ← 실크스크린 (붓터치 없음)
//   한국화:   { control: 0.75, brush: null }    ← 먹선 (붓터치 없음)
// ========================================
const ARTIST_CONFIG = {
  // === 고대/중세 ===
  'classical-sculpture': { control: 0.55, brush: null },      // 조각
  'sculpture':           { control: 0.55, brush: null },
  'roman-mosaic':        { control: 0.60, brush: '75mm' },    // 모자이크 타일
  'mosaic':              { control: 0.60, brush: '75mm' },
  'byzantine':           { control: 0.60, brush: null },      // 모자이크/아이콘
  'gothic':              { control: 0.50, brush: null },      // 스테인드글라스
  'islamic-miniature':   { control: 0.80, brush: '25mm' },    // 세밀화
  
  // === 르네상스 ===
  'botticelli':          { control: 0.70, brush: '75mm' },
  'leonardo':            { control: 0.65, brush: '75mm' },
  'titian':              { control: 0.70, brush: '75mm' },
  'michelangelo':        { control: 0.70, brush: '75mm' },
  'raphael':             { control: 0.70, brush: '75mm' },
  
  // === 바로크 ===
  'caravaggio':          { control: 0.50, brush: '75mm' },
  'rubens':              { control: 0.50, brush: '75mm' },
  'rembrandt':           { control: 0.50, brush: '75mm' },
  'velazquez':           { control: 0.50, brush: '75mm' },
  
  // === 로코코 ===
  'watteau':             { control: 0.45, brush: '75mm' },
  'boucher':             { control: 0.45, brush: '75mm' },
  
  // === 신고전/낭만/사실 ===
  'david':               { control: 0.50, brush: '75mm' },
  'ingres':              { control: 0.45, brush: '75mm' },
  'turner':              { control: 0.45, brush: '75mm' },
  'delacroix':           { control: 0.50, brush: '75mm' },
  'courbet':             { control: 0.50, brush: '75mm' },
  'manet':               { control: 0.50, brush: '75mm' },
  
  // === 인상주의 ===
  'renoir':              { control: 0.30, brush: '75mm' },
  'monet':               { control: 0.30, brush: '75mm' },
  'degas':               { control: 0.50, brush: '75mm' },
  'caillebotte':         { control: 0.50, brush: '75mm' },
  
  // === 후기인상주의 ===
  'vangogh':             { control: 0.45, brush: '75mm' },
  'gauguin':             { control: 0.60, brush: '75mm' },
  'cezanne':             { control: 0.65, brush: '75mm' },
  
  // === 야수파 ===
  'matisse':             { control: 0.45, brush: '75mm' },
  'derain':              { control: 0.45, brush: '75mm' },
  'vlaminck':            { control: 0.45, brush: '75mm' },
  
  // === 표현주의 ===
  'munch':               { control: 0.40, brush: '75mm' },
  'kirchner':            { control: 0.1, brush: '75mm' },
  'kokoschka':           { control: 0.1, brush: '75mm' },
  
  // === 모더니즘/팝아트 ===
  'picasso':             { control: 0.10, brush: '75mm' },
  'magritte':            { control: 0.40, brush: '75mm' },
  'miro':                { control: 0.40, brush: '75mm' },
  'chagall':             { control: 0.40, brush: '75mm' },
  'lichtenstein':        { control: 0.30, brush: null },      // 벤데이 점, 스타일 강화
  
  // === 거장 ===
  'klimt':               { control: 0.65, brush: '25mm' },    // 세밀 금박
  'frida':               { control: 0.80, brush: '25mm' },    // 세밀 상징
  
  // === 동양화 ===
  'korean':              { control: 0.75, brush: null },      // 먹선 별도
  'chinese':             { control: 0.75, brush: null },
  'japanese':            { control: 0.75, brush: null },      // 판화 별도
};

// 사조별 기본값 (화가 매칭 안 될 때 fallback)
const MOVEMENT_DEFAULTS = {
  'ancient-greek-sculpture':              { control: 0.55, brush: null },
  'roman-mosaic':                         { control: 0.60, brush: '75mm' },
  'byzantine':                            { control: 0.55, brush: null },      // 모자이크/아이콘
  'islamic-miniature':                    { control: 0.80, brush: '25mm' },    // 세밀화
  'gothic':                               { control: 0.50, brush: null },
  'renaissance':                          { control: 0.80, brush: '75mm' },
  'baroque':                              { control: 0.70, brush: '75mm' },
  'rococo':                               { control: 0.70, brush: '75mm' },
  'neoclassicism':                        { control: 0.80, brush: '75mm' },
  'neoclassicism_vs_romanticism_vs_realism': { control: 0.80, brush: '75mm' },
  'romanticism':                          { control: 0.80, brush: '75mm' },
  'impressionism':                        { control: 0.60, brush: '75mm' },
  'post-impressionism':                   { control: 0.55, brush: '75mm' },
  'pointillism':                          { control: 0.55, brush: '25mm' },    // 점
  'fauvism':                              { control: 0.45, brush: '75mm' },
  'expressionism':                        { control: 0.45, brush: '75mm' },
  'modernism':                            { control: 0.50, brush: '75mm' },
  'korean':                               { control: 0.75, brush: null },
  'chinese':                              { control: 0.75, brush: null },
  'japanese':                             { control: 0.75, brush: null },
};

// 화가명 정규화 매핑
const ARTIST_NAME_MAPPING = {
  'leonardodavinci': 'leonardo',
  'davinci': 'leonardo',
  '레오나르도': 'leonardo',
  '다빈치': 'leonardo',
  '레오나르도다빈치': 'leonardo',
  'vincentvangogh': 'vangogh',
  'vincent': 'vangogh',
  'gogh': 'vangogh',
  '반고흐': 'vangogh',
  '고흐': 'vangogh',
  '빈센트': 'vangogh',
  '빈센트반고흐': 'vangogh',
  'pierreaugusterenoir': 'renoir',
  '르누아르': 'renoir',
  '피에르오귀스트르누아르': 'renoir',
  'claudemonet': 'monet',
  '모네': 'monet',
  '클로드모네': 'monet',
  'edgardegas': 'degas',
  '드가': 'degas',
  '에드가드가': 'degas',
  'gustavecaillebotte': 'caillebotte',
  '카유보트': 'caillebotte',
  '귀스타브카유보트': 'caillebotte',
  'paulcezanne': 'cezanne',
  '세잔': 'cezanne',
  '폴세잔': 'cezanne',
  'henrimatisse': 'matisse',
  '마티스': 'matisse',
  '앙리마티스': 'matisse',
  'andrederain': 'derain',
  '드랭': 'derain',
  'mauricedevlaminck': 'vlaminck',
  '블라맹크': 'vlaminck',
  'edvardmunch': 'munch',
  '뭉크': 'munch',
  '에드바르뭉크': 'munch',
  'ernstludwigkirchner': 'kirchner',
  '키르히너': 'kirchner',
  'oskarkokoschka': 'kokoschka',
  '코코슈카': 'kokoschka',
  'pablopicasso': 'picasso',
  '피카소': 'picasso',
  '파블로피카소': 'picasso',
  'renemagritte': 'magritte',
  '마그리트': 'magritte',
  '르네마그리트': 'magritte',
  'joanmiro': 'miro',
  '미로': 'miro',
  '호안미로': 'miro',
  'marcchagall': 'chagall',
  '샤갈': 'chagall',
  '마르크샤갈': 'chagall',
  'roylichtenstein': 'lichtenstein',
  '리히텐슈타인': 'lichtenstein',
  '로이리히텐슈타인': 'lichtenstein',
  'gustavklimt': 'klimt',
  '클림트': 'klimt',
  '구스타프클림트': 'klimt',
  'fridakahlo': 'frida',
  '프리다': 'frida',
  '프리다칼로': 'frida',
  'antoinewatteau': 'watteau',
  '와토': 'watteau',
  'francoisboucher': 'boucher',
  '부셰': 'boucher',
  'jacqueslouisdavid': 'david',
  '다비드': 'david',
  'jeanaugustdominiqueingres': 'ingres',
  'jeanaugustedominiqueingres': 'ingres',
  '앵그르': 'ingres',
  'jmwturner': 'turner',
  '터너': 'turner',
  'eugenedelacroix': 'delacroix',
  '들라크루아': 'delacroix',
  'gustavecourbet': 'courbet',
  '쿠르베': 'courbet',
  'edouardmanet': 'manet',
  '마네': 'manet',
  'caravaggio': 'caravaggio',
  '카라바조': 'caravaggio',
  'peterpaulrubens': 'rubens',
  '루벤스': 'rubens',
  'rembrandt': 'rembrandt',
  '렘브란트': 'rembrandt',
  'diegovelazquez': 'velazquez',
  '벨라스케스': 'velazquez',
  'sandrobotticelli': 'botticelli',
  '보티첼리': 'botticelli',
  'titian': 'titian',
  '티치아노': 'titian',
  'michelangelo': 'michelangelo',
  '미켈란젤로': 'michelangelo',
  'raphael': 'raphael',
  '라파엘로': 'raphael',
  'paulgauguin': 'gauguin',
  '고갱': 'gauguin',
  '폴고갱': 'gauguin',
  'classicalsculpture': 'classical-sculpture',
  'sculpture': 'sculpture',
  'romanmosaic': 'roman-mosaic',
  'mosaic': 'mosaic',
  'byzantine': 'byzantine',
  '비잔틴': 'byzantine',
  'gothic': 'gothic',
  '고딕': 'gothic',
};

// 화가명 정규화 함수
function normalizeArtistKey(artist) {
  if (!artist) return '';
  const normalized = artist.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .replace(/[^a-z가-힣]/g, '');
  
  return ARTIST_NAME_MAPPING[normalized] || normalized;
}

// 화가 설정 가져오기 (통합)
function getArtistConfig(artist, styleId, category) {
  const artistKey = normalizeArtistKey(artist);
  
  // 1. 화가별 설정 확인
  if (artistKey && ARTIST_CONFIG[artistKey]) {
    return ARTIST_CONFIG[artistKey];
  }
  
  // 2. 사조별 기본값 확인
  if (styleId && MOVEMENT_DEFAULTS[styleId]) {
    return MOVEMENT_DEFAULTS[styleId];
  }
  
  // 3. 카테고리별 기본값
  if (category === 'oriental') {
    return { control: 0.75, brush: null };
  } else if (category === 'modernism') {
    return { control: 0.50, brush: '75mm' };
  } else if (category === 'masters') {
    // 거장 모드: 화가별 설정이 없으면 중간값
    return { control: 0.55, brush: '75mm' };
  }
  
  // 4. 최종 기본값
  return { control: 0.80, brush: '75mm' };
}

// control_strength 결정 함수
function getControlStrength(artist, styleId, category) {
  return getArtistConfig(artist, styleId, category).control;
}

// 붓터치 크기 결정 함수
function getBrushstrokeSize(artist, styleId, category) {
  return getArtistConfig(artist, styleId, category).brush;
}

// ========================================
// v67: 대표작 키 변환 함수 (간소화)
// "The Kiss" → "klimt-kiss"
// "The Starry Night" → "vangogh-starrynight"
// masterworks.js의 masterworkNameMapping 사용
// ========================================
function convertToWorkKey(artistName, workTitle) {
  if (!artistName || !workTitle) return null;
  
  // 작품명으로 직접 조회 (masterworks.js에서 관리)
  const normalized = workTitle.toLowerCase().trim();
  const directKey = masterworkNameMapping[normalized];
  
  if (directKey) return directKey;
  
  // 매핑에 없으면 null 반환 (fallback 처리는 호출하는 쪽에서)
  return null;
}

//
// v64: 20세기 모더니즘 5명으로 축소 (워홀, 해링 제거)
//      - 5명: 피카소, 마그리트, 미로, 샤갈, 리히텐슈타인
//      - 제외: 브라크(피카소 중복), 달리(완전 삭제), 워홀(품질 이슈), 해링(실루엣화로 얼굴 보존 안됨)
//
// v58: 20세기 모더니즘 가이드라인 단순화 (네가티브 원칙)
//      - 거장 7명 강화 프롬프트 한글 감지 추가
//        (샤갈, 반 고흐, 모네, 클림트, 뭉크, 마티스, 피카소, 프리다, 마그리트)
//
// v51: 20세기 모더니즘 추가 (11번째 사조)
//      - 입체주의: 피카소
//      - 초현실주의: 마그리트, 미로, 샤갈
//      - 팝아트: 리히텐슈타인
//      ⛔ 제외: 만 레이(사진작가), 프리다(마스터 전용), 뒤샹(개념미술), 폴록/로스코(완전추상), 달리(삭제), 브라크(중복), 워홀(품질이슈)
//
// v57: 중세 미술 회화 느낌 방지 강화
//      
//      고딕 (Gothic):
//        "FLAT TWO-DIMENSIONAL medieval style"
//        "NOT realistic smooth oil painting"
//        "angular linear forms with hard edges"
//        "like stained glass panels + manuscripts"
//      
//      로마네스크 (Romanesque):
//        "FLAT MURAL FRESCO style like church walls"
//        "NOT smooth realistic painting"
//        "solid block-like forms with heavy outlines"
//        "simple colors and bold shapes like stone carvings"
//      
//      목표: 스테인드글라스/필사본/프레스코 느낌
//      금지: 사실적 유화, 부드러운 회화
//
// v56: 40% 구성 기준 + 순백 대리석
//
// v47: 고대 그리스 대리석 조각 + 생동감 있는 눈동자
//
// v46: 르네상스 남성 초상화 최적화
//      남성 상반신 → 티치아노 70% (베네치아 초상화 전통)
//      여성 상반신 → 다 빈치 80% (모나리자 스푸마토)
//      남성 전신 → 미켈란젤로 (다비드 영웅성)
//
// v45: 중세 미술에 이슬람 미술 추가 (로마네스크 제거)
//      인물 사진: 비잔틴 55% / 고딕 25% / 이슬람 세밀화 20%
//      풍경 사진: 비잔틴 / 고딕 / 이슬람 기하학 (AI 선택, 세밀화 금지)
//
// 미술사조 11개 (시간순):
//   1. 고대 그리스-로마 (BC 800~AD 500) - 유지
//   2. 중세 미술 (4~15세기) - 비잔틴·고딕·로마네스크·이슬람
//      → Islamic Miniature: 인물 전용 (페르시아 세밀화, 궁정 우아함)
//      → Islamic Geometric: 풍경 전용 (기하학 패턴, 아라베스크)
//   3. 르네상스 (1400~1600) - 5명 화가 선택 ⭐ 남성 초상화 최적화
//   4. 바로크 (1600~1750) - 5명 화가 선택
//   5. 로코코 (1720~1780) - 2명 화가 선택
//   6. 신고전 vs 낭만 vs 사실주의 (1770~1870) - 7명 화가 선택 (AI가 3개 중 선택)
//      → David, Ingres (신고전주의)
//      → Turner, Delacroix (낭만주의)
//      → Courbet, Manet (사실주의)
//   7. 인상주의 (1860~1890) - 4명 화가 선택
//   8. 후기인상주의 (1880~1910) - 4명 화가 선택
//   9. 야수파 (1905~1908) - 3명 화가 선택
//  10. 표현주의 (1905~1920) - 4명 화가 선택
//  11. 20세기 모더니즘 (1907~1970) - 6명 화가 선택 ⭐ v64 업데이트
//      → 입체주의: 피카소
//      → 초현실주의: 마그리트, 미로(풍경/정물전용), 샤갈
//      → 팝아트: 리히텐슈타인
//      ⛔ 제외: 브라크(피카소중복), 달리(삭제), 만 레이(사진작가), 워홀(품질이슈)
//
// 거장 7명 (시간순 + 생사연도):
//   1. 반 고흐 (1853-1890, 후기인상주의)
//   2. 클림트 (1862-1918, 아르누보)
//   3. 뭉크 (1863-1944, 표현주의)
//   4. 마티스 (1869-1954, 야수파)
//   5. 샤갈 (1887-1985, 초현실주의)
//   6. 프리다 칼로 (1907-1954, 멕시코)
//   7. 리히텐슈타인 (1923-1997, 팝아트)


// ========================================
// 사조별 화가 가이드라인 함수
// ========================================

// ========================================
// 🎯 대전제: 가중치 기반 랜덤 화가 선택 시스템
// ========================================
// 비중이 설정된 사조에서는 AI에게 맡기지 않고
// 코드에서 비율대로 랜덤 선택 → AI에게 지정
// ========================================

// 가중치 기반 랜덤 선택 함수
function weightedRandomSelect(weightedOptions) {
  const totalWeight = weightedOptions.reduce((sum, opt) => sum + opt.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const option of weightedOptions) {
    random -= option.weight;
    if (random <= 0) {
      return option.name;
    }
  }
  return weightedOptions[0].name; // fallback
}

// 사진 유형 감지 함수
function detectPhotoType(photoAnalysis) {
  const { count, subject } = photoAnalysis;
  
  // 풍경 감지
  const isLandscape = subject && (
    subject.includes('landscape') || subject.includes('nature') || 
    subject.includes('mountain') || subject.includes('sea') || 
    subject.includes('sky') || subject.includes('scenery') ||
    subject.includes('building') || subject.includes('city')
  ) && (!count || count === 0);
  
  // 정물 감지
  const isStillLife = subject && (
    subject.includes('food') || subject.includes('flower') || 
    subject.includes('object') || subject.includes('still') ||
    subject.includes('fruit') || subject.includes('bottle') ||
    subject.includes('table')
  ) && (!count || count === 0);
  
  // 동물 감지
  const isAnimal = subject && (
    subject.includes('animal') || subject.includes('pet') || 
    subject.includes('dog') || subject.includes('cat') || 
    subject.includes('bird') || subject.includes('horse')
  ) && (!count || count === 0);
  
  if (isLandscape) return 'landscape';
  if (isStillLife) return 'stillLife';
  if (isAnimal) return 'animal';
  if (count >= 3) return 'group';
  if (count === 2) return 'couple';
  if (count === 1) return 'portrait';
  
  return 'default';
}

// ========================================
// 사조별 가중치 테이블
// ========================================

const ARTIST_WEIGHTS = {
  // 모더니즘 (5명) - v70: 피카소↓ 샤갈↑, 키스해링 삭제, 마그리트↓
  modernism: {
    portrait: [
      { name: 'LICHTENSTEIN', weight: 30 },
      { name: 'CHAGALL', weight: 25 },
      { name: 'PICASSO', weight: 25 },
      { name: 'MAGRITTE', weight: 20 }
    ],
    couple: [
      { name: 'CHAGALL', weight: 35 },
      { name: 'LICHTENSTEIN', weight: 25 },
      { name: 'PICASSO', weight: 20 },
      { name: 'MAGRITTE', weight: 20 }
    ],
    group: [
      { name: 'CHAGALL', weight: 35 },
      { name: 'LICHTENSTEIN', weight: 35 },
      { name: 'PICASSO', weight: 30 }
    ],
    landscape: [
      { name: 'CHAGALL', weight: 30 },
      { name: 'PICASSO', weight: 30 },
      { name: 'MAGRITTE', weight: 20 },
      { name: 'MIRÓ', weight: 20 }
    ],
    stillLife: [
      { name: 'PICASSO', weight: 40 },
      { name: 'LICHTENSTEIN', weight: 25 },
      { name: 'MIRÓ', weight: 20 },
      { name: 'MAGRITTE', weight: 15 }
    ],
    default: [
      { name: 'CHAGALL', weight: 30 },
      { name: 'LICHTENSTEIN', weight: 30 },
      { name: 'PICASSO', weight: 25 },
      { name: 'MAGRITTE', weight: 15 }
    ]
  },
  
  // 르네상스
  renaissance: {
    portrait: [
      { name: 'BOTTICELLI', weight: 30 },
      { name: 'LEONARDO DA VINCI', weight: 25 },
      { name: 'TITIAN', weight: 25 },
      { name: 'RAPHAEL', weight: 20 }
    ],
    femaleFace: [
      { name: 'BOTTICELLI', weight: 50 },
      { name: 'LEONARDO DA VINCI', weight: 30 },
      { name: 'RAPHAEL', weight: 20 }
    ],
    maleFace: [
      { name: 'BOTTICELLI', weight: 23 },
      { name: 'TITIAN', weight: 23 },
      { name: 'RAPHAEL', weight: 22 },
      { name: 'LEONARDO DA VINCI', weight: 22 },
      { name: 'MICHELANGELO', weight: 10 }
    ],
    landscape: [
      { name: 'TITIAN', weight: 30 },
      { name: 'LEONARDO DA VINCI', weight: 20 },
      { name: 'BOTTICELLI', weight: 20 },
      { name: 'RAPHAEL', weight: 15 },
      { name: 'MICHELANGELO', weight: 15 }
    ],
    default: [
      { name: 'BOTTICELLI', weight: 20 },
      { name: 'LEONARDO DA VINCI', weight: 20 },
      { name: 'TITIAN', weight: 20 },
      { name: 'RAPHAEL', weight: 20 },
      { name: 'MICHELANGELO', weight: 20 }
    ]
  },
  
  // 바로크
  baroque: {
    portrait: [
      { name: 'CARAVAGGIO', weight: 45 },
      { name: 'REMBRANDT', weight: 35 },
      { name: 'VELÁZQUEZ', weight: 12 },
      { name: 'RUBENS', weight: 8 }
    ],
    elderly: [
      { name: 'REMBRANDT', weight: 70 },
      { name: 'CARAVAGGIO', weight: 20 },
      { name: 'VELÁZQUEZ', weight: 10 }
    ],
    femaleWindow: [
      { name: 'REMBRANDT', weight: 60 },
      { name: 'VELÁZQUEZ', weight: 25 },
      { name: 'RUBENS', weight: 15 }
    ],
    formal: [
      { name: 'VELÁZQUEZ', weight: 60 },
      { name: 'REMBRANDT', weight: 25 },
      { name: 'CARAVAGGIO', weight: 15 }
    ],
    couple: [
      { name: 'RUBENS', weight: 60 },
      { name: 'REMBRANDT', weight: 25 },
      { name: 'CARAVAGGIO', weight: 15 }
    ],
    group: [
      { name: 'RUBENS', weight: 50 },
      { name: 'REMBRANDT', weight: 30 },
      { name: 'CARAVAGGIO', weight: 20 }
    ],
    default: [
      { name: 'CARAVAGGIO', weight: 35 },
      { name: 'REMBRANDT', weight: 30 },
      { name: 'VELÁZQUEZ', weight: 20 },
      { name: 'RUBENS', weight: 15 }
    ]
  },
  
  // 로코코
  rococo: {
    outdoor: [
      { name: 'WATTEAU', weight: 70 },
      { name: 'BOUCHER', weight: 30 }
    ],
    default: [
      { name: 'BOUCHER', weight: 70 },
      { name: 'WATTEAU', weight: 30 }
    ]
  },
  
  // 중세 - v67: 비잔틴 주력 
  medieval: {
    default: [
      { name: 'BYZANTINE', weight: 50 },
      { name: 'GOTHIC', weight: 20 },
      { name: 'ISLAMIC MINIATURE', weight: 30 }
    ]
  },
  
  // 신고전주의
  neoclassicism: {
    formal: [
      { name: 'JACQUES-LOUIS DAVID', weight: 70 },
      { name: 'INGRES', weight: 30 }
    ],
    femaleFace: [
      { name: 'INGRES', weight: 65 },
      { name: 'JACQUES-LOUIS DAVID', weight: 35 }
    ],
    landscape: [
      { name: 'JACQUES-LOUIS DAVID', weight: 60 },
      { name: 'INGRES', weight: 40 }
    ],
    default: [
      { name: 'JACQUES-LOUIS DAVID', weight: 60 },
      { name: 'INGRES', weight: 40 }
    ]
  },
  
  // 신고전 vs 낭만 vs 사실주의 (프론트엔드 카테고리명)
  neoclassicism_vs_romanticism_vs_realism: {
    portrait: [
      { name: 'INGRES', weight: 35 },
      { name: 'MANET', weight: 35 },
      { name: 'JACQUES-LOUIS DAVID', weight: 30 }
    ],
    movement: [  // 스포츠/액션
      { name: 'DELACROIX', weight: 60 },       // 역동적 군중, 격렬한 동작
      { name: 'JACQUES-LOUIS DAVID', weight: 25 },  // 영웅적 포즈
      { name: 'TURNER', weight: 15 }
    ],
    landscape: [
      { name: 'TURNER', weight: 50 },        // 낭만주의 풍경 대표
      { name: 'DELACROIX', weight: 20 },     // 낭만주의
      { name: 'COURBET', weight: 20 },       // 사실주의 풍경
      { name: 'MANET', weight: 10 }          // 사실주의
    ],
    dramatic: [
      { name: 'DELACROIX', weight: 50 },
      { name: 'TURNER', weight: 30 },
      { name: 'COURBET', weight: 20 }
    ],
    default: [
      { name: 'JACQUES-LOUIS DAVID', weight: 20 },
      { name: 'DELACROIX', weight: 20 },
      { name: 'TURNER', weight: 20 },
      { name: 'MANET', weight: 15 },
      { name: 'COURBET', weight: 15 },
      { name: 'INGRES', weight: 10 }
    ]
  },
  
  // 고대 그리스-로마 (스타일 선택)
  ancient: {
    indoor: [
      { name: 'CLASSICAL SCULPTURE', weight: 80 },
      { name: 'ROMAN MOSAIC', weight: 20 }
    ],
    outdoor: [
      { name: 'ROMAN MOSAIC', weight: 80 },
      { name: 'CLASSICAL SCULPTURE', weight: 20 }
    ],
    sports: [
      { name: 'CLASSICAL SCULPTURE', weight: 90 },
      { name: 'ROMAN MOSAIC', weight: 10 }
    ],
    animal: [
      { name: 'ROMAN MOSAIC', weight: 95 },
      { name: 'CLASSICAL SCULPTURE', weight: 5 }
    ],
    default: [
      { name: 'CLASSICAL SCULPTURE', weight: 50 },
      { name: 'ROMAN MOSAIC', weight: 50 }
    ]
  },
  
  // 인상주의 (4명) - 피사로→칼리보트 교체 (도시풍경/남성인물 차별화)
  impressionism: {
    portrait: [
      { name: 'RENOIR', weight: 35 },      // 여성/아이 인물 (AI힌트로 분기)
      { name: 'MONET', weight: 30 },
      { name: 'CAILLEBOTTE', weight: 35 }  // 남성 인물 (AI힌트로 분기)
    ],
    movement: [
      { name: 'DEGAS', weight: 50 },
      { name: 'RENOIR', weight: 30 },
      { name: 'MONET', weight: 15 },
      { name: 'CAILLEBOTTE', weight: 5 }
    ],
    landscape_nature: [  // 자연 풍경 (산, 숲, 바다, 정원)
      { name: 'MONET', weight: 85 },       // 자연 풍경 전문
      { name: 'RENOIR', weight: 15 }       // 야외 장면
      // 드가/칼리보트 제외
    ],
    landscape_urban: [   // 도시 풍경 (건물, 거리)
      { name: 'CAILLEBOTTE', weight: 70 }, // 도시 풍경 전문
      { name: 'MONET', weight: 30 }
    ],
    landscape: [  // 기본 풍경 (분류 불가 시)
      { name: 'MONET', weight: 70 },
      { name: 'RENOIR', weight: 20 },
      { name: 'CAILLEBOTTE', weight: 10 }
      // 드가 제외 (발레/실내 전문)
    ],
    default: [
      { name: 'RENOIR', weight: 35 },
      { name: 'MONET', weight: 35 },
      { name: 'CAILLEBOTTE', weight: 20 },
      { name: 'DEGAS', weight: 10 }
    ]
  },
  
  // 후기인상주의 (3명) - 시냐크 삭제
  postImpressionism: {
    portrait: [
      { name: 'VAN GOGH', weight: 50 },
      { name: 'GAUGUIN', weight: 50 }
      // CÉZANNE 제외 - 정물/풍경 전문
    ],
    landscape: [
      { name: 'VAN GOGH', weight: 35 },
      { name: 'GAUGUIN', weight: 35 },
      { name: 'CÉZANNE', weight: 30 }
    ],
    stillLife: [
      { name: 'CÉZANNE', weight: 60 },
      { name: 'VAN GOGH', weight: 20 },
      { name: 'GAUGUIN', weight: 20 }
    ],
    default: [
      { name: 'VAN GOGH', weight: 35 },
      { name: 'GAUGUIN', weight: 35 },
      { name: 'CÉZANNE', weight: 30 }
    ]
  },
  
  // 야수파 (3명)
  fauvism: {
    portrait: [
      { name: 'MATISSE', weight: 45 },
      { name: 'DERAIN', weight: 30 },
      { name: 'VLAMINCK', weight: 25 }
    ],
    landscape: [
      { name: 'DERAIN', weight: 45 },
      { name: 'VLAMINCK', weight: 35 },
      { name: 'MATISSE', weight: 20 }
    ],
    default: [
      { name: 'MATISSE', weight: 35 },
      { name: 'DERAIN', weight: 35 },
      { name: 'VLAMINCK', weight: 30 }
    ]
  },
  
  // 표현주의 (3명) - 칸딘스키 제외
  expressionism: {
    portrait: [
      { name: 'MUNCH', weight: 40 },
      { name: 'KOKOSCHKA', weight: 35 },
      { name: 'KIRCHNER', weight: 25 }
    ],
    urban: [
      { name: 'KIRCHNER', weight: 50 },
      { name: 'KOKOSCHKA', weight: 30 },
      { name: 'MUNCH', weight: 20 }
    ],
    default: [
      { name: 'MUNCH', weight: 40 },
      { name: 'KOKOSCHKA', weight: 35 },
      { name: 'KIRCHNER', weight: 25 }
    ]
  }
};

// 사조별 가중치 선택 함수
function selectArtistByWeight(category, photoAnalysis) {
  const weights = ARTIST_WEIGHTS[category];
  if (!weights) return null; // 가중치 없으면 AI 자유 선택
  
  const photoType = detectPhotoType(photoAnalysis);
  
  // 특수 케이스 처리 (성별 등)
  if (category === 'renaissance') {
    if (photoAnalysis.gender === 'female' && photoType === 'portrait') {
      return weightedRandomSelect(weights.femaleFace);
    }
    if (photoAnalysis.gender === 'male' && photoType === 'portrait') {
      return weightedRandomSelect(weights.maleFace);
    }
  }
  
  if (category === 'baroque') {
    if (photoAnalysis.age === 'elderly') {
      return weightedRandomSelect(weights.elderly);
    }
  }
  
  if (category === 'rococo') {
    if (photoAnalysis.background?.includes('outdoor') || photoAnalysis.background?.includes('garden')) {
      return weightedRandomSelect(weights.outdoor);
    }
  }
  
  // 고대 그리스-로마 특수 처리
  if (category === 'ancient') {
    const subject = (photoAnalysis.subject || '').toLowerCase();
    const background = (photoAnalysis.background || '').toLowerCase();
    
    // 동물 → 모자이크
    if (subject.includes('animal') || subject.includes('pet') || subject.includes('dog') || subject.includes('cat')) {
      return weightedRandomSelect(weights.animal);
    }
    // 스포츠/액션 → 조각
    if (subject.includes('sport') || subject.includes('action') || subject.includes('running') || subject.includes('athletic')) {
      return weightedRandomSelect(weights.sports);
    }
    // 야외 → 모자이크
    if (background.includes('outdoor') || background.includes('nature') || background.includes('landscape')) {
      return weightedRandomSelect(weights.outdoor);
    }
    // 실내 → 조각
    if (background.includes('indoor') || background.includes('studio') || background.includes('room')) {
      return weightedRandomSelect(weights.indoor);
    }
  }
  
  // 인상주의 특수 처리
  if (category === 'impressionism') {
    const subject = (photoAnalysis.subject || '').toLowerCase();
    const background = (photoAnalysis.background || '').toLowerCase();
    
    // 움직임/액션 → 드가
    if (subject.includes('dance') || subject.includes('movement') || subject.includes('action') || subject.includes('sport')) {
      return weightedRandomSelect(weights.movement);
    }
    
    // 인물 사진 + 배경 체크 → 카유보트 조건부 제외
    if (subject.includes('person') || subject.includes('portrait') || subject === 'person') {
      // 단색/단순 배경이면 카유보트 제외 (르누아르/모네/드가만)
      const isSimpleBackground = background.includes('plain') || background.includes('solid') || 
                                  background.includes('studio') || background.includes('simple') ||
                                  background.includes('white') || background.includes('gray') ||
                                  background.includes('neutral') || background === '' ||
                                  !background || background.includes('indoor');
      
      // 도시/거리/건물 배경이면 카유보트 포함
      const isUrbanBackground = background.includes('city') || background.includes('urban') || 
                                 background.includes('street') || background.includes('building') ||
                                 background.includes('paris') || background.includes('cafe');
      
      if (isSimpleBackground && !isUrbanBackground) {
        // 단순 배경: 카유보트 제외 (르누아르 60%, 모네 35%, 드가 5%)
        // console.log('🎨 Impressionism portrait: Simple background → Caillebotte excluded');
        return weightedRandomSelect([
          { name: 'RENOIR', weight: 60 },
          { name: 'MONET', weight: 35 },
          { name: 'DEGAS', weight: 5 }
        ]);
      }
      // 도시/복잡한 배경이면 기존 portrait 비중 사용 (카유보트 포함)
    }
    
    // 풍경 분기: 자연 vs 도시
    // 'landscape' 또는 ('object'인데 outdoor 배경)이면 풍경으로 처리
    const isOutdoorBackground = background.includes('outdoor') || background.includes('nature') || 
                                 background.includes('park') || background.includes('garden') ||
                                 background.includes('tree') || background.includes('sky') ||
                                 background.includes('path') || background.includes('road') ||
                                 background.includes('forest') || background.includes('mountain');
    
    const isLandscapeScene = subject.includes('landscape') || subject === 'landscape' ||
                             (subject === 'object' && isOutdoorBackground);
    
    if (isLandscapeScene) {
      // 도시/건물/거리 → 칼리보트
      if (background.includes('city') || background.includes('urban') || background.includes('building') || 
          background.includes('street') || subject.includes('city') || subject.includes('urban') || subject.includes('building')) {
        return weightedRandomSelect(weights.landscape_urban);
      }
      // 자연 풍경 (산, 숲, 바다, 정원 등) → 모네
      return weightedRandomSelect(weights.landscape_nature);
    }
  }
  
  // 신고전 vs 낭만 vs 사실주의 특수 처리
  if (category === 'neoclassicism_vs_romanticism_vs_realism') {
    const subject = (photoAnalysis.subject || '').toLowerCase();
    
    // 스포츠/액션/움직임 → 들라크루아, 고야
    if (subject.includes('sport') || subject.includes('action') || subject.includes('movement') || 
        subject.includes('running') || subject.includes('dance') || subject.includes('athletic')) {
      return weightedRandomSelect(weights.movement);
    }
  }
  
  // 표현주의 특수 처리
  if (category === 'expressionism') {
    const subject = (photoAnalysis.subject || '').toLowerCase();
    const background = (photoAnalysis.background || '').toLowerCase();
    // 도시/도심 → 키르히너
    if (background.includes('city') || background.includes('urban') || background.includes('street')) {
      return weightedRandomSelect(weights.urban);
    }
  }
  
  // 후기인상주의 특수 처리 - 세잔은 정물/풍경 전문
  if (category === 'postImpressionism') {
    const subject = (photoAnalysis.subject || '').toLowerCase();
    
    // 정물 → 세잔 강력 추천 
    if (subject.includes('still') || subject.includes('object') || subject.includes('fruit') || 
        subject.includes('flower') || subject.includes('food') || subject.includes('bottle')) {
      return weightedRandomSelect(weights.stillLife);
    }
    // 풍경 → 세잔 포함
    if (subject.includes('landscape') || subject === 'landscape') {
      return weightedRandomSelect(weights.landscape);
    }
    // 인물 → 세잔 제외 (반 고흐 50%, 고갱 35%, 시냑 15%)
    if (subject.includes('person') || subject.includes('portrait') || subject === 'person') {
      return weightedRandomSelect(weights.portrait);
    }
  }
  
  // 일반 사진 유형별 선택
  const typeWeights = weights[photoType] || weights.default;
  return weightedRandomSelect(typeWeights);
}

// ========================================
// 끝: 가중치 기반 랜덤 화가 선택 시스템
// ========================================

// 고대 그리스-로마 (2가지 스타일)
function getAncientGreekRomanGuidelines() {
  return `
🚫🚫🚫 CRITICAL RESTRICTION 🚫🚫🚫
YOU MUST ONLY SELECT FROM THE ARTISTS/STYLES LISTED BELOW!
DO NOT select artists from other movements (Renaissance, Baroque, Impressionism, etc.)
ONLY "CLASSICAL SCULPTURE" or "ROMAN MOSAIC" are allowed!

Available Ancient Greek-Roman Styles (2가지):

⭐ STYLE 1: CLASSICAL SCULPTURE (고대 그리스-로마 조각)
   - For: INDOOR PORTRAITS or SPORTS/ACTION PHOTOS ONLY
   - PRIORITY: Sports/athletic action OR indoor portrait settings
   - Examples: Sports action shots (running, jumping, throwing)
              Indoor portraits (studio, home, office settings)
              Athletic poses, gym photos
              Indoor group photos
   - NOT for: Outdoor portraits, casual outdoor photos, landscapes with people
   - Material: Pure white marble only (classical aesthetic)
   - Technique: Dynamic poses for sports, classical poses for indoor portraits
   - Background: Simple plain neutral background (museum-like)
   - Aesthetic: Classical Greek/Roman white marble sculpture

⭐ STYLE 2: ROMAN MOSAIC (로마 모자이크)
   - For: ALL OTHER PHOTOS (outdoor portraits, landscapes, nature, etc.)
   - Examples: Outdoor portraits (any setting)
              All landscape shots (with or without people)
              Nature scenes, flowers, plants
              City scenes, buildings
              Beach photos, mountain photos
              ANY outdoor photos with people
   - Technique: LARGE VISIBLE tesserae tiles 50mm, THICK DARK GROUT LINES between tiles
   - CRITICAL: Each tile must be CLEARLY DISTINGUISHABLE as individual square/rectangular pieces
   - Aesthetic: Roman floor/wall mosaic with chunky stone tiles, jewel-tone colors
   📚 ROMAN MOSAIC MASTERWORKS - Select one matching photo characteristics:
   • Alexander Mosaic (알렉산더 모자이크) → Battle/action, dynamic diagonal, earth tones
   • Cave Canem (카베 카넴) → Animals (dogs, cats, pets), bold graphic contrast
   • Dionysus Mosaic (디오니소스 모자이크) → Mythological, wine/grape imagery, celebratory
   • Oceanus and Tethys (오케아노스와 테티스) → Sea/water themes, blue-turquoise palette
   • Four Seasons (사계절 모자이크) → Portrait busts, seasonal themes, elegant female
   • Nile Mosaic (닐 모자이크) → Landscape panorama, exotic wildlife, river scenes

🎯 KEY DECISION RULE - SIMPLIFIED:
1. SPORTS/ATHLETIC ACTION? → SCULPTURE (highest priority!)
2. INDOOR PORTRAIT/GROUP? → SCULPTURE
3. OUTDOOR PORTRAIT? → MOSAIC
4. LANDSCAPE/NATURE? → MOSAIC
5. ANY OTHER OUTDOOR SCENE? → MOSAIC

Examples:
- Volleyball game = SCULPTURE (sports action)
- Indoor portrait at home = SCULPTURE (indoor setting)
- Gym workout = SCULPTURE (athletic/indoor)
- Office team photo = SCULPTURE (indoor group)
- Couple at beach = MOSAIC (outdoor portrait)
- Person in garden = MOSAIC (outdoor setting)
- Mountain hiking = MOSAIC (outdoor landscape)
- Street portrait = MOSAIC (outdoor)
- Sunflower = MOSAIC (nature)
`;
}

function getAncientGreekRomanHints(photoAnalysis) {
  // 고대 그리스/로마: 특별한 안전장치 없음 - AI가 자유롭게 선택
  return '';
}

// 르네상스 (5명)
function getRenaissanceGuidelines() {
  return `
🚫🚫🚫 CRITICAL RESTRICTION 🚫🚫🚫
YOU MUST ONLY SELECT FROM THE ARTISTS LISTED BELOW!
DO NOT select artists from other movements (Baroque, Impressionism, Expressionism, etc.)
ONLY Renaissance artists: LEONARDO, TITIAN, MICHELANGELO, RAPHAEL, BOTTICELLI!

⭐⭐⭐ FEMALE PORTRAIT SELECTION RULE ⭐⭐⭐
STOP thinking "female portrait = Mona Lisa = Leonardo"!
For FEMALE subjects, you MUST randomize between artists:
- BOTTICELLI: 50% (default choice for most female portraits)
- LEONARDO: 30% (only if mysterious/contemplative mood)
- RAPHAEL: 20% (only if peaceful/serene scene)

🎲 RANDOMIZATION REQUIRED: Do NOT always pick Leonardo for women!

Available Renaissance Artists (5명):

1. BOTTICELLI (보티첼리) - ⭐ DEFAULT for female portraits
   - Specialty: Flowing elegant lines, ethereal beauty, graceful movement
   - Best for: Young women, beauty, fashion, elegance, graceful poses
   - Masterworks: "Primavera", "Venus and Mars" ← SELECT ONE ONLY!
   - ⭐ SELECT BOTTICELLI when: Female subject (any pose, any mood) - 50% of cases!
   - Botticelli is NOT just for "dance poses" - he excels at ALL female portraits

2. LEONARDO DA VINCI (레오나르도 다 빈치) - female with mysterious atmosphere ONLY
   - Specialty: Sfumato technique, mysterious smile, soft transitions
   - Best for: ONLY when photo has mysterious/contemplative/enigmatic mood
   - Masterworks: "Virgin of the Rocks", "The Last Supper" ← SELECT ONE ONLY!
   - ⚠️ DO NOT default to Leonardo just because subject is female!
   - Select Leonardo ONLY if: mysterious expression, contemplative mood, dark background

3. TITIAN (티치아노) - male portraits & landscapes
   - Specialty: Venetian golden color, luminous flesh tones, ARISTOCRATIC MALE PORTRAITS
   - Best for: MALE upper body portraits, landscapes with sky/sunset, noble dignified men
   - Masterworks: "Bacchus and Ariadne", "Assumption of the Virgin" ← SELECT ONE ONLY!

4. MICHELANGELO (미켈란젤로) - ADULT male, dynamic/heroic, group scenes
   - Specialty: Sculptural powerful anatomy, heroic masculine figures
   - Best for: ADULT male (age 18+) with full body, athletic, dynamic, heroic poses
   - Masterworks: "Creation of Adam", "Last Judgment" ← SELECT ONE ONLY!
   - When to prioritize: Adult male with masculine energy, sports, action, heroic subject
   - CRITICAL: NEVER for children, teenagers, women, or elderly - ONLY adult men

5. RAPHAEL (라파엘로) - peaceful scenes, group scenes
   - Specialty: Harmonious balanced composition, graceful figures, serene beauty
   - Best for: Peaceful family scenes, gentle relationships, group compositions
   - Masterworks: "School of Athens", "Sistine Madonna", "Galatea" ← SELECT ONE ONLY!
   - When to prioritize: Peaceful multi-person scene or group composition

⚠️ CRITICAL: You MUST select a masterwork from the exact list above! Do NOT invent new titles!
`;
}

function getRenaissanceHints(photoAnalysis) {
  const { count, gender, shot_type, subject, age_range } = photoAnalysis;
  
  // 아동/청소년 → 미켈란젤로 절대 금지 (안전장치)
  if (age_range === 'child' || age_range === 'teen' || subject.includes('child') || subject.includes('boy') || subject.includes('girl')) {
    return `
⚠️ SAFETY RULE: NEVER select Michelangelo for children or teenagers.
Choose from: Botticelli, Raphael, Leonardo, or Titian instead.
`;
  }
  
  return '';
}

// 바로크 (4명)
function getBaroqueGuidelines() {
  return `
🚫🚫🚫 CRITICAL RESTRICTION 🚫🚫🚫
YOU MUST ONLY SELECT FROM THE ARTISTS LISTED BELOW!
DO NOT select artists from other movements (Renaissance, Impressionism, Expressionism, etc.)
ONLY Baroque artists: CARAVAGGIO, RUBENS, REMBRANDT, VELÁZQUEZ!

Available Baroque Artists (4명):

1. CARAVAGGIO (카라바조) ⭐ Best - default choice for single portraits
   - Specialty: Dramatic chiaroscuro, tenebrism, theatrical spotlight effect
   - Best for: Single person portraits, dramatic mood, strong expressions
   - Masterworks: "The Calling of St Matthew", "Supper at Emmaus" ← SELECT ONE ONLY!
   - When to prioritize: Most single portraits 

2. RUBENS (루벤스) ⭐ Best for couples & groups
   - Specialty: Warm sensual flesh, dynamic movement, voluptuous forms
   - Best for: Couples, romantic scenes, multi-person compositions, warm energy
   - Masterworks: "Descent from the Cross", "The Garden of Love" ← SELECT ONE ONLY!
   - When to prioritize: 2+ people, romantic/intimate mood, dynamic poses

3. REMBRANDT (렘브란트) - Best for elderly subjects & window light
   - Specialty: Warm golden light, psychological depth, soft window illumination
   - Best for: Elderly subjects (60+), contemplative mood, female with natural light
   - Masterworks: "The Night Watch", "Self-Portrait", "Return of the Prodigal Son" ← SELECT ONE ONLY!
   - When to prioritize: Clear elderly subject or window light scenes

4. VELÁZQUEZ (벨라스케스) - Best for formal portraits
   - Specialty: Courtly dignity, Spanish formality
   - Best for: Formal clothing, aristocratic mood
   - Masterworks: "Las Meninas", "Portrait of Pope Innocent X", "The Surrender of Breda" ← SELECT ONE ONLY!
   - When to prioritize: Formal/official context

⚠️ CRITICAL: You MUST select a masterwork from the exact list above! Do NOT invent new titles!
`;
}

function getBaroqueHints(photoAnalysis) {
  // 바로크: 특별한 안전장치 없음 - AI가 자유롭게 선택
  return '';
}

// 로코코 (2명)
function getRococoGuidelines() {
  return `
🚫🚫🚫 CRITICAL RESTRICTION 🚫🚫🚫
YOU MUST ONLY SELECT FROM THE ARTISTS LISTED BELOW!
DO NOT select artists from other movements (Baroque, Impressionism, Expressionism, etc.)
ONLY Rococo artists: BOUCHER, WATTEAU!

Available Rococo Artists (2명):

1. BOUCHER (부셰) ⭐ Best for Rococo 
   - Specialty: Playful sensual charm, soft pink and blue pastels, ornate decoration
   - Best for: Most photos - quintessential Rococo style
   - Masterworks: "Madame de Pompadour", "Le Déjeuner" ← SELECT ONE ONLY!
   - When to prioritize: Most cases (DEFAULT 70%)

2. WATTEAU (와토) - Best for romantic outdoor scenes 
   - Specialty: Fêtes galantes (elegant outdoor parties), romantic gardens
   - Best for: Outdoor scenes specifically, romantic atmosphere, leisure activities
   - Masterworks: "Pilgrimage to Cythera", "Pierrot", "Fête galante" ← SELECT ONE ONLY!
   - When to prioritize: Clear outdoor/garden/romantic settings 

⚠️ CRITICAL: You MUST select a masterwork from the exact list above! Do NOT invent new titles!
`;
}

function getRococoHints(photoAnalysis) {
  // 로코코: 특별한 안전장치 없음 - AI가 자유롭게 선택
  return '';
}

// 중세 미술 (비잔틴·고딕·이슬람) ⭐ v59 로마네스크 삭제
function getMedievalGuidelines() {
  return `
🚫🚫🚫 CRITICAL RESTRICTION 🚫🚫🚫
YOU MUST ONLY SELECT FROM THE STYLES LISTED BELOW!
DO NOT select artists from other movements (Renaissance, Baroque, Impressionism, etc.)
ONLY Medieval styles: BYZANTINE, GOTHIC, ISLAMIC MINIATURE!

Available Medieval Art Styles:

📍 FOR PORTRAITS/PEOPLE (인물화) - 3 styles available:

1. BYZANTINE (비잔틴) ⭐ 
   - Specialty: SACRED GOLDEN MOSAIC backgrounds, flat iconic forms, divine transcendence
   - Best for: Formal dignified portraits - Byzantine spirituality and eternal presence
   - Signature: GOLDEN HALO behind head, Gold leaf backgrounds, hieratic frontal poses
   - CRITICAL: Must have CIRCULAR GOLDEN NIMBUS (halo) behind subject's head
   📚 BYZANTINE MASTERWORKS - Select one matching photo characteristics:
   • Emperor Justinian (유스티니아누스 황제) → Male/group, imperial majesty, dignified
   • Empress Theodora (테오도라 황후) → Female, jeweled crown, opulent splendor
   • Deesis (데이시스) → Gentle expression, compassionate, sacred presence
   • Christ Pantocrator (판토크라토르) → Intense gaze, monumental, divine judgment

2. ISLAMIC MINIATURE (이슬람 세밀화) ⭐ 
   - Specialty: Persian/Ottoman COURT MINIATURE painting, intricate delicate details, vibrant jewel colors
   - Best for: Courtly elegant portraits, delicate graceful figures, ornamental backgrounds
   - Signature: Persian manuscript illumination style, flat decorative composition, rich jewel tones, intricate patterns
   - Also good for: Animals (hunting scenes, garden scenes)
   📚 ISLAMIC MINIATURE MASTERWORKS - Select one matching photo characteristics:
   • Youth Holding a Flower (꽃을 든 귀족) → Single portrait, elegant S-curve posture
   • Miraj Night Journey (미라지) → Mystical/fantasy, celestial atmosphere
   • Simurgh (시무르그) → Animals, mythical phoenix with elaborate plumage
   • Lovers in a Garden (정원의 연인) → Couples, romantic moonlit garden
   • Rustam Slaying Dragon (루스탐과 용) → Action/battle, epic heroic scene

3. GOTHIC (고딕) ⭐ 
   - Specialty: CATHEDRAL STAINED GLASS with thick BLACK LEAD LINES dividing colored glass sections
   - Reference: Chartres Cathedral stained glass windows style
   - Best for: Religious atmosphere with jewel-tone translucent colors
   - Signature: ENTIRE IMAGE composed of colored glass pieces separated by BLACK LEAD CAMES
   - CRITICAL: Must show THICK BLACK LINES between EVERY color section like real stained glass
   - Glass colors: Deep ruby red, sapphire blue, emerald green, amber yellow, purple
   - Key features: Flat 2D figures, no perspective, translucent glass effect, light passing through
   - NOT a painting - must look like actual STAINED GLASS WINDOW with lead dividers
   📚 GOTHIC MASTERWORKS - Select one matching photo characteristics:
   • Blue Virgin of Chartres (샤르트르 푸른 성모) → Madonna/child, dominant cobalt blue
   • Notre-Dame Rose Window (노트르담 장미창) → Radial circular, kaleidoscopic symmetry
   • Sainte-Chapelle (생트샤펠) → Tall vertical, dominant ruby red, biblical narrative

📍 FOR LANDSCAPES/NON-PORTRAITS (풍경/사물):
Choose: Byzantine or Gothic

🎯 SELECTION:
IF photo has PEOPLE:
  → Byzantine , Islamic Miniature , Gothic 
  
IF photo has ANIMALS:
  → Islamic Miniature preferred
  
IF photo has NO people AND NO animals (landscape only):
  → Byzantine or Gothic
`;
}

function getMedievalHints(photoAnalysis) {
  const { subject } = photoAnalysis;
  
  // 동물 있으면 → 무조건 이슬람 세밀화 (신성모독 방지 안전장치!)
  if (subject === 'animal' || subject === 'pet' || subject === 'dog' || subject === 'cat' || 
      subject === 'horse' || subject === 'bird' || subject === 'fish' || 
      subject.includes('animal') || subject.includes('pet') || subject.includes('dog') || 
      subject.includes('cat') || subject.includes('horse') || subject.includes('bird')) {
    return `
⚠️ SAFETY RULE: Animals detected - MUST use Islamic Miniature.
NEVER use Byzantine or Gothic for animals (religious context inappropriate).
`;
  }
  
  return '';
}

// 신고전 vs 낭만 vs 사실주의 (7명) ⭐ v42 통합
function getNeoclassicismVsRomanticismVsRealismGuidelines() {
  return `
🚫🚫🚫 CRITICAL RESTRICTION 🚫🚫🚫
YOU MUST ONLY SELECT FROM THE ARTISTS LISTED BELOW!
DO NOT select artists from other movements (Baroque, Impressionism, Expressionism, etc.)
ONLY these 6 artists: DAVID, INGRES, TURNER, DELACROIX, COURBET, MANET!

Available Artists (6명) - AI will choose BEST style (Neoclassicism vs Romanticism vs Realism):

⚖️ NEOCLASSICISM (신고전주의) - Reason and Order:

1. DAVID (다비드) ⭐ BEST for formal/heroic portraits
   - Specialty: Classical heroic compositions, clear lines, dignified formality
   - Best for: Formal portraits, static balanced poses, heroic subjects
   - Masterworks: "Death of Marat", "Coronation of Napoleon", "Oath of the Horatii" ← SELECT ONE ONLY!
   - When to prioritize: Formal/static/balanced photos 

2. INGRES (앵그르) - BEST for elegant female portraits
   - Specialty: Perfect smooth contours, classical beauty, refined elegance
   - Best for: Female portraits, graceful poses, elegant beauty
   - Masterworks: "Princesse de Broglie", "Napoleon on his Imperial Throne" ← SELECT ONE ONLY!
   - When to prioritize: Elegant female subjects (65%)

⚡ ROMANTICISM (낭만주의) - Emotion and Passion:

3. TURNER (터너) ⭐ Best for landscapes
   - Specialty: Atmospheric light effects, misty dreamlike landscapes, sublime nature
   - Best for: Landscapes, fog/mist, atmospheric effects, natural scenery
   - Masterworks: "Rain, Steam and Speed", "Fighting Temeraire", "Slave Ship" ← SELECT ONE ONLY!
   - When to prioritize: Landscape photos (80%)

4. DELACROIX (들라크루아) - BEST for dramatic action, intense emotions
   - Specialty: Vivid passionate colors, dynamic movement, revolutionary energy
   - Best for: Action scenes, dramatic expressions, multiple people in motion
   - Masterworks: "Liberty Leading the People", "Death of Sardanapalus", "Women of Algiers" ← SELECT ONE ONLY!
   - When to prioritize: Action/drama/multiple people in motion 

🎨 REALISM (사실주의) - Honest Truth:

5. COURBET (쿠르베) ⭐ Best for rural/landscape realism
   - Specialty: Honest rural reality, landscapes, everyday life, anti-idealized truth
   - Best for: Rural settings, landscapes, working class subjects, realistic portrayal
   - Masterworks: "The Stone Breakers", "A Burial at Ornans", "Bonjour Monsieur Courbet" ← SELECT ONE ONLY!
   - When to prioritize: Rural/landscape/working class subjects (80%)

6. MANET (마네) - BEST for urban/modern scenes
   - Specialty: Modern Paris life, café scenes, urban sophistication
   - Best for: Urban settings, modern atmosphere, café/city backgrounds
   - Masterworks: "Bar at the Folies-Bergère", "The Fifer" ← SELECT ONE ONLY!
   - When to prioritize: Clear urban/modern/city context 

⚠️ CRITICAL: You MUST select a masterwork from the exact list above! Do NOT invent new titles!

🎯 CRITICAL DECISION LOGIC:
- Photo is STATIC, BALANCED, FORMAL → Choose Neoclassicism (David or Ingres)
- Photo is DYNAMIC, EMOTIONAL, DRAMATIC → Choose Romanticism (Turner/Delacroix)
- Photo is RURAL, PEACEFUL → Choose Realism - Courbet 
- Photo is URBAN, MODERN → Choose Realism - Manet 
- Landscape → ALWAYS Romanticism (Turner 80%)
`;
}

function getNeoclassicismVsRomanticismVsRealismHints(photoAnalysis) {
  // 신고전/낭만/사실: 특별한 안전장치 없음 - AI가 자유롭게 선택
  return '';
}

// 인상주의 (4명)
function getImpressionismGuidelines() {
  return `
🚫🚫🚫 CRITICAL RESTRICTION 🚫🚫🚫
YOU MUST ONLY SELECT FROM THE ARTISTS LISTED BELOW!
DO NOT select artists from other movements (Post-Impressionism, Expressionism, Fauvism, etc.)
ONLY Impressionism artists: RENOIR, MONET, DEGAS, CAILLEBOTTE!

Available Impressionism Artists (4명):

1. RENOIR (르누아르) ⭐ Best - Best for portraits 
   - Specialty: SOFT WARM figures in dappled sunlight, joyful atmosphere, peachy skin tones
   - Best for: ALL portraits (indoor/outdoor), happy people, sunlit gatherings, festive scenes
   - Masterworks: "Luncheon of the Boating Party", "Bal du moulin de la Galette", "The Swing" ← SELECT ONE ONLY!
   - When to prioritize: Most portrait cases 

2. DEGAS (드가) ⭐ Best for movement AND composition 
   - Specialty: Movement capture, unusual angles, dynamic compositions, ballet dancers
   - Best for: Action shots, dance, sports, movement, diagonal compositions, interesting angles
   - Masterworks: "The Dance Class", "The Star", "L'Absinthe" ← SELECT ONE ONLY!
   - When to prioritize: Movement/action/dance OR unique compositional angles 

3. MONET (모네) ⭐ Good for landscapes 
   - Specialty: Light effects, outdoor atmosphere, water reflections
   - Best for: Landscapes, gardens, water scenes (NOT portraits)
   - Masterworks: "Water Lilies", "Impression, Sunrise", "Woman with a Parasol" ← SELECT ONE ONLY!
   - When to prioritize: Pure landscapes without people 

4. CAILLEBOTTE (칼리보트) ⭐ Urban specialist 
   - Specialty: Modern urban scenes, dramatic perspective, city life
   - Best for: City backgrounds, male portraits, geometric compositions
   - Masterworks: "Paris Street, Rainy Day", "The Floor Scrapers", "Man at the Window" ← SELECT ONE ONLY!
   - When to prioritize: Urban/city scenes , male portraits 

⚠️ CRITICAL: You MUST select a masterwork from the exact list above! Do NOT invent new titles!

🎯 CRITICAL DECISION LOGIC:
- Female/child portraits → RENOIR  ⭐ PRIMARY
- Male portraits → CAILLEBOTTE  ⭐ (modern urban men)
- Movement/action/interesting angles → DEGAS  ⭐
- Natural landscapes (no people) → MONET  ⭐
- Urban/city scenes → CAILLEBOTTE  ⭐
`;
}

function getImpressionismHints(photoAnalysis) {
  // 인상파: 특별한 안전장치 없음 - AI가 자유롭게 선택
  return '';
}

// 후기인상주의 (4명) - v48 간소화
function getPostImpressionismGuidelines() {
  return `
🚫🚫🚫 CRITICAL RESTRICTION 🚫🚫🚫
YOU MUST ONLY SELECT FROM THE ARTISTS LISTED BELOW!
DO NOT select artists from other movements (Impressionism, Fauvism, Expressionism, etc.)
ONLY Post-Impressionism artists: VAN GOGH, GAUGUIN, CÉZANNE!

Available Post-Impressionism Artists (3명) + MASTERWORKS:

1. VAN GOGH (반 고흐) - Swirling impasto brushstrokes, intense emotional colors
   ⭐ BEST FOR: Portraits, emotional scenes, night scenes
   📚 MASTERWORKS:
   - "The Starry Night" (별이 빛나는 밤) → night, sky, landscape, FEMALE portrait | SWIRLING SPIRALS, cobalt blue + yellow
   - "Sunflowers" (해바라기) → flowers, still life | THICK IMPASTO, chrome yellow dominates
   - "Self-Portrait" (자화상) → MALE portrait ONLY | turquoise swirling background, intense gaze
   - "Café Terrace at Night" (밤의 카페 테라스) → outdoor evening, cafe, street | yellow gas lamp, cobalt blue night
   
2. GAUGUIN (고갱) - Flat bold colors, primitive exotic Tahitian style
   ⭐ BEST FOR: Portraits, tropical scenes, exotic mood
   📚 MASTERWORKS:
   - "Tahitian Women" (타히티 여인들) → FEMALE, exotic, tropical | flat bold colors, decorative
   - "Where Do We Come From?" (우리는 어디서 왔는가) → philosophical, group | Tahitian paradise, primitivism
   - "Yellow Christ" (황색 그리스도) → religious, emotional | flat yellow, Breton folk art
   
3. CÉZANNE (세잔) - Geometric structured forms, analytical approach
   ⭐ BEST FOR: Still life, landscapes, geometric compositions
   ⚠️ NOT FOR PORTRAITS!
   📚 MASTERWORKS:
   - "Still Life with Apples" (사과 정물) → still life | geometric forms, structured color patches
   - "Mont Sainte-Victoire" (생트빅투아르 산) → landscape | geometric mountain, analytical brushwork
   - "Card Players" (카드 놀이하는 사람들) → group activity | geometric figures, muted colors

🎯 CRITICAL MATCHING RULES:
- PORTRAITS/PEOPLE → VAN GOGH or GAUGUIN (NEVER Cézanne!)
- MALE portrait → Van Gogh Self-Portrait
- FEMALE portrait → Van Gogh Starry Night or Gauguin Tahitian
- STILL LIFE → CÉZANNE (Still Life with Apples)
- NIGHT/EVENING → Van Gogh (Starry Night or Café Terrace)
`;
}

function getPostImpressionismHints(photoAnalysis) {
  const subject = (photoAnalysis?.subject || '').toLowerCase();
  
  // 인물 사진 → 세잔 금지 (안전장치: 세잔은 정물/풍경 전문)
  if (subject.includes('person') || subject.includes('portrait') || subject === 'person') {
    return `
⚠️ SAFETY RULE: Portrait detected - avoid CÉZANNE (still life/landscape specialist).
Choose from: Van Gogh or Gauguin instead.
`;
  }
  
  return '';
}

// 야수파 (3명) ⭐ v42 NEW
function getFauvismGuidelines() {
  return `
🚫🚫🚫 CRITICAL RESTRICTION 🚫🚫🚫
YOU MUST ONLY SELECT FROM THE ARTISTS LISTED BELOW!
DO NOT select artists from other movements (Expressionism, Post-Impressionism, etc.)
ONLY Fauvism artists: MATISSE, DERAIN, VLAMINCK!
⚠️ Expressionism artists (Munch, Kirchner, Kokoschka, Kandinsky) are FORBIDDEN here!

Available Fauvism Artists (3명):

1. MATISSE (마티스) ⭐ for portraits and interiors 
   - Specialty: Pure bold colors, decorative flat patterns, joyful harmonious compositions
   - Best for: Most photos, especially people, interiors, calm atmosphere
   - Masterworks: "The Green Stripe", "Woman in a Purple Coat", "The Dance", "The Red Room" ← SELECT ONE ONLY!
   - When to prioritize: Most Fauvism cases 

2. DERAIN (드랭) ⭐ for landscapes 
   - Specialty: Bold landscape colors, vivid natural scenery, strong contrasts
   - Best for: Landscapes, trees, outdoor nature, bright scenery
   - Masterworks: "Mountains at Collioure", "Charing Cross Bridge", "Portrait of Matisse" ← SELECT ONE ONLY!
   - When to prioritize: Clear landscape/outdoor scene 

3. VLAMINCK (블라맹크) ⭐ for dramatic colors 
   - Specialty: Violent expressive colors, turbulent brushwork, emotional intensity
   - Best for: Dramatic mood, intense emotions, stormy atmosphere
   - Masterworks: "The River Seine at Chatou", "Red Trees", "Bougival" ← SELECT ONE ONLY!
   - When to prioritize: Dramatic/intense emotional mood 

⚠️ CRITICAL: You MUST select a masterwork from the exact list above! Do NOT invent new titles!

🎯 CRITICAL DECISION LOGIC - BALANCED DISTRIBUTION:
- Most photos/portraits → MATISSE  - versatile, harmonious
- Landscape/outdoor → DERAIN  - landscape specialist
- Dramatic/intense mood → VLAMINCK  - most emotional
All three artists equally represent Fauvism's bold colors!
`;
}

function getFauvismHints(photoAnalysis) {
  // 야수파: 특별한 안전장치 없음 - AI가 자유롭게 선택
  return '';
}

// 표현주의 (5명)
function getExpressionismGuidelines() {
  return `
🚫🚫🚫 CRITICAL RESTRICTION 🚫🚫🚫
YOU MUST ONLY SELECT FROM THE ARTISTS LISTED BELOW!
DO NOT select artists from other movements (Fauvism, Post-Impressionism, Impressionism, etc.)
ONLY Expressionism artists: MUNCH, KOKOSCHKA, KIRCHNER!
⚠️ FORBIDDEN: Derain, Matisse, Vlaminck (they are FAUVISM, NOT Expressionism!)

Available Expressionism Artists (3명):

1. MUNCH (뭉크) ⭐ for emotional portraits 
   - Specialty: Existential anxiety, psychological tension, swirling distorted forms
   - Best for: Emotional portraits with depth, anxious expressions, dramatic scenes
   - Masterworks: "The Scream", "Madonna", "Jealousy" ← SELECT ONE ONLY!
   - When to prioritize: Emotional/dramatic portraits 

2. KOKOSCHKA (코코슈카) ⭐ for psychological portraits 
   - Specialty: Intense psychological portraits, violent brushstrokes, inner turmoil
   - Best for: Deep character portraits, emotional intensity, raw expression
   - Masterworks: "The Bride of the Wind", "Degenerate Art", "Double Portrait" ← SELECT ONE ONLY!
   - When to prioritize: Portraits needing psychological depth 

3. KIRCHNER (키르히너) ⭐ for urban expressionism 
   - Specialty: JAGGED ANGULAR FORMS, urban anxiety, street energy
   - Best for: Urban settings, bold color contrasts, city scenes, angular compositions
   - Masterworks: "Berlin Street Scene", "Self-Portrait as a Soldier", "Two Women with a Sink" ← SELECT ONE ONLY!
   - When to prioritize: Urban/city backgrounds or angular aesthetic 

⚠️ CRITICAL: You MUST select a masterwork from the exact list above! Do NOT invent new titles!

🎯 CRITICAL DECISION LOGIC - 3 ARTISTS ONLY:
- Emotional portraits → MUNCH (35%, also in Masters)
- Psychological depth → KOKOSCHKA 
- Urban/city/angular → KIRCHNER 
⚠️ NEVER select Fauvism artists (Derain, Matisse, Vlaminck) for Expressionism!
`;
}

function getExpressionismHints(photoAnalysis) {
  // 표현주의: 특별한 안전장치 없음 - AI가 자유롭게 선택
  return '';
}

// 20세기 모더니즘 (7명 - 3개 세부 사조)
// 제외: 뒤샹(개념미술), 폴록/로스코(완전추상), 만 레이(사진작가), 프리다/달리(마스터 전용), 브라크(피카소 중복)
function getModernismGuidelines() {
  return `
🚫🚫🚫 CRITICAL RESTRICTION 🚫🚫🚫
YOU MUST ONLY SELECT FROM THE 6 ARTISTS LISTED BELOW!
DO NOT select artists from other movements (Expressionism, Fauvism, Impressionism, etc.)
ONLY these 6 artists: PICASSO, MAGRITTE, MIRÓ, CHAGALL, LICHTENSTEIN, HARING!
⚠️ FORBIDDEN: Boccioni, Mondrian, Man Ray, Dalí, Frida Kahlo, Braque, Munch, Matisse, Warhol, etc.

Available 20th Century Modernism Artists (6명):

=== CUBISM 입체주의 ===
1. PICASSO (피카소) - Geometric fragmented forms, multiple perspectives
   - Masterworks: "Guernica", "The Old Guitarist", "Three Musicians", "Portrait of Dora Maar" ← SELECT ONE ONLY!

=== SURREALISM 초현실주의 ===
2. MAGRITTE (마그리트) - Philosophical paradox, multiplication of figures
   - Masterworks: "Son of Man", "Golconda", "The Man in the Bowler Hat", "The Human Condition", "Empire of Light" ← SELECT ONE ONLY!
3. MIRÓ (미로) - Playful biomorphic forms, childlike symbols, primary colors (LANDSCAPE/STILL LIFE ONLY)
   - Masterworks: "Catalan Landscape", "Constellations", "Blue Star" ← SELECT ONE ONLY!
4. CHAGALL (샤갈) - Soft dreamy floating figures, muted pastel colors
   - Masterworks: "Lovers with Flowers", "La Branche" ← SELECT ONE ONLY!

=== POP ART 팝아트 ===
5. LICHTENSTEIN (리히텐슈타인) - Ben-Day dots, comic book style
   - Masterworks: "Drowning Girl", "Whaam!", "Hopeless" ← SELECT ONE ONLY!

⚠️ CRITICAL: You MUST select a masterwork from the exact list above! Do NOT invent new titles!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PHOTO TYPE WEIGHT GUIDE (사진 유형별 비중)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧑 SINGLE PORTRAIT (단독 인물):
   PICASSO 30%, MAGRITTE 35%, LICHTENSTEIN 35%
   ❌ CHAGALL, MIRÓ 제외

💑 COUPLE (커플 2인):
   PICASSO 25%, CHAGALL 30%, MAGRITTE 20%, LICHTENSTEIN 25%
   ❌ MIRÓ 제외

👥 GROUP 3+ (단체 3명 이상):
   PICASSO 30%, CHAGALL 35%, LICHTENSTEIN 35%
   ❌ MAGRITTE, MIRÓ 제외

🏞️ LANDSCAPE (풍경):
   PICASSO 25%, MAGRITTE 30%, CHAGALL 20%, MIRÓ 25%
   ❌ LICHTENSTEIN 제외

🍎 STILL LIFE (정물):
   PICASSO 30%, MAGRITTE 35%, MIRÓ 35%
   ❌ CHAGALL, LICHTENSTEIN 제외

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ FINAL REMINDER: ONLY these 5 artists are valid:
PICASSO, MAGRITTE, MIRÓ, CHAGALL, LICHTENSTEIN
`;
}

function getModernismHints(photoAnalysis) {
  // 모더니즘: 특별한 안전장치 없음 - AI가 자유롭게 선택
  return '';
}


// ========================================
// v66: 화풍 프롬프트는 artistStyles.js로 통합됨
// getArtistStyle(artistKey) 또는 getArtistStyleByName(artistName) 사용
// ========================================

// ========================================
// Fallback 프롬프트 (AI 실패시 사용)
// ========================================
const fallbackPrompts = {
  ancient: {
    name: '그리스·로마',
    prompt: 'Transform this image into ancient Greek-Roman art. STRICT RULES: 1) ANY SPORTS/ATHLETIC ACTION (soccer, football, running, jumping, throwing, catching ball, ANY physical activity) → ALWAYS Greek/Roman MARBLE SCULPTURE in style of Discobolus or ancient Olympic athletes, pure white Carrara marble with visible carved muscles and dynamic frozen movement, classical athletic proportions, museum display style. CRITICAL: Ball games = SCULPTURE, NOT mosaic. 2) INDOOR PORTRAITS (no sports) → Greek/Roman marble sculpture with classical poses, ENTIRE FIGURE INCLUDING ALL CLOTHING must be PURE WHITE MARBLE, NO colored clothing, convert ALL fabric to carved white marble drapery folds. 3) OUTDOOR SCENES WITHOUT SPORTS → Roman mosaic with LARGE CHUNKY TESSERAE TILES 50mm, THICK BLACK GROUT LINES clearly visible between EVERY tile, LIMITED COLORS (terracotta, ochre, umber, ivory, slate blue), Pompeii villa floor style. PRIORITY: Sports/athletic = ALWAYS SCULPTURE regardless of indoor/outdoor. CRITICAL FOR ALL SCULPTURES: Convert ALL clothing colors to pure white marble, no original clothing colors preserved, entire figure is carved from single block of white Carrara marble. MANDATORY: ALL nipples and private areas must be covered with carved marble fabric draping or strategic arm positioning. Ancient masterpiece quality'
  },
  
  medieval: {
    name: '중세 미술',
    prompt: 'Medieval art style selection: 1) ANIMALS → ALWAYS ISLAMIC MINIATURE, 2) PEOPLE → ISLAMIC MINIATURE 50% OR BYZANTINE 50%, 3) STILL LIFE/OBJECTS → ISLAMIC MINIATURE, 4) LANDSCAPE/BUILDING only → GOTHIC STAINED GLASS. ISLAMIC MINIATURE: Persian Ottoman court painting, intricate delicate details, vibrant jewel colors ruby sapphire emerald gold, flat decorative composition, ornamental floral patterns, courtly elegant aesthetic, garden or hunting scenes. BYZANTINE: GOLDEN MOSAIC sacred background, shimmering gold leaf, CIRCULAR GOLDEN HALO behind head, flat hieratic frontal iconic figures, divine transcendent atmosphere. GOTHIC: CATHEDRAL STAINED GLASS jewel tones, THICK BLACK LEAD LINES dividing colored segments, vertical elongated figures, FLAT TWO-DIMENSIONAL medieval aesthetic. Medieval masterpiece quality'
  },
  
  renaissance: {
    name: 'Leonardo da Vinci',
    prompt: 'Renaissance painting by Leonardo da Vinci, Leonardo art style, EXTREME sfumato technique, PRESERVE original person face and features exactly, apply Leonardo PAINTING TECHNIQUE ONLY with sfumato haze, apply Leonardo STYLE not any specific portrait LIKENESS, apply very strong soft atmospheric haze throughout, all edges must be completely blurred, no sharp outlines anywhere in entire painting, mysterious smoky depth with sfumato technique, every boundary softly dissolved into atmosphere, warm golden Renaissance colors, harmonious balanced composition, unified composition all figures together NOT separated, preserve facial identity, Renaissance masterpiece quality'
  },
  
  baroque: {
    name: 'Caravaggio',
    prompt: 'Baroque painting by Caravaggio, Caravaggio art style, DRAMATIC chiaroscuro lighting with extreme light-dark contrast, theatrical spotlight effect, deep black shadows, tenebrism technique, rich deep colors, dynamic diagonal composition, theatrical emotional atmosphere, single unified composition with all figures together in one cohesive continuous scene NOT separated into multiple groups, Baroque masterpiece quality'
  },
  
  rococo: {
    name: 'Antoine Watteau',
    prompt: 'Rococo oil painting by Watteau, Watteau art style, VISIBLE BRUSHSTROKES with oil paint texture throughout, light pastel colors, playful ornate decoration, soft delicate brushwork, romantic elegant atmosphere, graceful curved lines, whimsical charm, single unified composition with all figures together in one cohesive scene NOT separated into multiple groups, painted on canvas with VISIBLE PAINT TEXTURE, Rococo masterpiece quality'
  },
  
  neoclassicism_vs_romanticism_vs_realism: {
    name: '신고전 vs 낭만 vs 사실주의',
    prompt: 'Choose best style based on photo: if static balanced formal use Neoclassical style by Jacques-Louis David, David art style, with cold perfection and clear lines, if dynamic emotional landscape use Romantic style by J.M.W. Turner, Turner art style, with atmospheric sublime effects, if rural peaceful use Realist style by Gustave Courbet, Courbet art style, with honest rural reality, if urban modern use Realist style by Édouard Manet, Manet art style, with sophisticated Paris realism, masterpiece quality with single unified composition NOT separated'
  },
  
  impressionism: {
    name: 'Claude Monet',
    prompt: 'Impressionist painting by Claude Monet, Monet art style, ROUGH VISIBLE BROKEN brushstrokes, SOFT HAZY atmospheric effects like morning mist, colors BLENDED and DISSOLVED into each other, NO sharp edges, dreamy blurred boundaries, dappled light filtering through atmosphere, Woman with a Parasol style atmospheric haze, everything slightly out of focus and impressionistic, Impressionist masterpiece quality'
  },
  
  postImpressionism: {
    name: 'Vincent van Gogh',
    prompt: 'Post-Impressionist painting, Post-Impressionist art style, bold expressive colors, personal artistic vision, emotional depth and symbolic meaning, visible distinctive brushwork, Post-Impressionist masterpiece quality'
  },
  
  fauvism: {
    name: 'Henri Matisse',
    prompt: 'Fauvist painting by Henri Matisse, Matisse Fauvist art style, pure bold unmixed colors, flat decorative patterns, intense color contrasts, liberation of color from reality, simplified forms, joyful energetic atmosphere, The Dance-like pure color harmony, Fauvist masterpiece quality'
  },
  
  expressionism: {
    name: 'Edvard Munch',
    prompt: 'MUNCH_EXPRESSIONISM',  // 기본값 - 실제로는 artistStyles.js에서 동적 생성
    dynamicPrompt: true
  },
  
  modernism: {
    name: 'Pablo Picasso',
    prompt: 'PICASSO_CUBIST',  // 기본값 - 실제로는 artistStyles.js에서 동적 생성
    dynamicPrompt: true  // 동적 프롬프트 플래그
  },
  
  // ========================================
  // 거장 11명 (시간순 정렬 + 생사연도 + 사조)
  // ========================================
  // 원칙: 사용자가 거장 선택 → 어떤 사진이든 그 거장의 화풍으로 변환
  // ========================================
  
  vangogh: {
    name: '반 고흐',
    artist: 'Vincent van Gogh (1853-1890)',
    movement: '후기인상주의 (Post-Impressionism)',
    defaultWork: 'The Starry Night',
    prompt: 'painting by Vincent van Gogh, Van Gogh art style, THICK SWIRLING IMPASTO brushstrokes visible throughout, VIBRANT INTENSE emotional colors, cobalt blue, chrome yellow, emerald green, dynamic energetic turbulent sky and background, Starry Night style spiraling movement, passionate expressive emotional power, preserve subject identity, Van Gogh masterpiece quality'
  },
  
  klimt: {
    name: '클림트',
    artist: 'Gustav Klimt (1862-1918)',
    movement: '아르누보 (Art Nouveau)',
    defaultWork: 'The Kiss',
    prompt: 'painting by Gustav Klimt, Klimt Golden Phase art style, GOLD LEAF decorative patterns throughout background, Byzantine mosaic geometric ornaments, The Kiss style intimate sensuous atmosphere, MYSTERIOUS ALLURING EXPRESSION, femme fatale for women, homme fatale for men, jewel-like rich colors, gold, bronze, deep reds, flowing organic Art Nouveau lines, symbolic decorative elements, golden glow on skin, preserve subject identity, Klimt masterpiece quality'
  },
  
  munch: {
    name: '뭉크',
    artist: 'Edvard Munch (1863-1944)',
    movement: '표현주의 (Expressionism)',
    defaultWork: 'The Scream',
    prompt: 'painting by Edvard Munch, Munch Expressionist art style, INTENSE PSYCHOLOGICAL emotional depth, The Scream style existential anxiety atmosphere, WAVY DISTORTED flowing lines throughout background AND on figure, haunting symbolic colors, blood red orange sky, sickly yellows, deep blues, TRANSFORM expression to melancholic anxious mood, raw emotional vulnerability exposed, visible brushwork, preserve subject identity, Munch Expressionist masterpiece quality'
  },
  
  matisse: {
    name: '마티스',
    artist: 'Henri Matisse (1869-1954)',
    movement: '야수파 (Fauvism)',
    defaultWork: 'The Dance',
    prompt: 'painting by Henri Matisse, Matisse Fauvist art style, PURE BOLD UNMIXED COLORS in flat decorative areas, The Dance style simplified joyful forms, complete liberation of color from reality, saturated intense primary colors, red, blue, green, APPLY UNREALISTIC COLORS TO FACE AND SKIN, green purple red on face OK, simplified facial features, rhythmic flowing harmonious lines, ROUGH FAUVIST BRUSHSTROKES clearly visible throughout including on skin textured, life-affirming energetic atmosphere, preserve subject identity, Matisse Fauvist masterpiece quality'
  },
  
  picasso: {
    name: '피카소',
    artist: 'Pablo Picasso (1881-1973)',
    movement: '입체주의 (Cubism)',
    defaultWork: 'Les Demoiselles d\'Avignon',
    prompt: 'Cubist painting by Pablo Picasso, Picasso Cubism art style, MOST IMPORTANT THE FACE MUST BE CUBIST DECONSTRUCTED NOT REALISTIC, REQUIRED DISTORTIONS: show PROFILE NOSE side view while BOTH EYES face FORWARD on same face, FRAGMENT face into FLAT ANGULAR GEOMETRIC PLANES, break JAW FOREHEAD CHEEKS into separate angular shapes like shattered glass, Les Demoiselles d Avignon African mask angular style, Earth tones, ochre, brown, olive, grey, If the face looks normal or realistic YOU ARE DOING IT WRONG faces must look abstracted and geometrically impossible, Picasso Cubist masterpiece quality'
  },
  
  frida: {
    name: '프리다 칼로',
    artist: 'Frida Kahlo (1907-1954)',
    movement: '멕시코 초현실주의 (Mexican Surrealism)',
    defaultWork: 'Me and My Parrots',
    prompt: 'painting by Frida Kahlo, Frida Kahlo art style, INTENSE DIRECT GAZE portrait style, vibrant Mexican folk art colors, symbolic personal imagery, flowers, animals, vines, hearts, emotional raw vulnerability, Mexican traditional dress and floral headpiece, lush tropical green foliage background, autobiographical symbolic elements, rich saturated colors, detailed oil painting brushwork visible, preserve subject identity, Frida Kahlo masterpiece quality'
  },
  
  // ========================================
  // 동양화 - AI가 스타일 자동 선택
  // v60: 텍스트는 A가 생성 → F가 그림 (텍스트 금지 규칙 제거)
  // ========================================
  korean: {
    name: '한국 전통화',
    prompt: 'Korean traditional painting, Joseon Dynasty art style, GENDER PRESERVATION preserve exact gender and facial features from original photo, Choose appropriate Korean style: Minhwa folk art for animals and flowers with light subtle Obangsaek colors and soft gentle pigments, Pungsokdo genre painting for people with LIGHT INK WASH technique and subtle colors over ink lines in Kim Hong-do and Shin Yun-bok style, Jingyeong landscape for nature with expressive ink and minimal color, SINGLE UNIFIED COMPOSITION, VISIBLE BRUSH TEXTURE 20mm+'
  },
  
  chinese: {
    name: '중국 전통화',
    prompt: 'Chinese traditional painting, classical Chinese art style, GENDER PRESERVATION preserve exact gender and facial features from original photo, Choose appropriate Chinese style: Shuimohua ink wash for landscapes with monochrome gradations, Gongbi meticulous painting for people with fine detailed brushwork and rich colors, Huaniao bird-and-flower for animals with precise naturalistic rendering, Chinese aesthetic principles, SINGLE UNIFIED COMPOSITION, VISIBLE INK BRUSH TEXTURE 20mm+'
  },
  
  japanese: {
    name: '일본 우키요에',
    prompt: 'Japanese Ukiyo-e woodblock print, Ukiyo-e art style, flat areas of bold solid colors, strong clear black outlines, completely flat two-dimensional composition, CLOTHING: MUST transform to traditional Japanese attire (elegant kimono for women, hakama pants with haori jacket for men), decorative patterns, stylized simplified forms, elegant refined Japanese aesthetic, authentic Japanese ukiyo-e masterpiece quality, CRITICAL ANTI-HALLUCINATION preserve EXACT number of people from original photo, if 1 person then ONLY 1 person in result, simple scenic background ONLY Mt Fuji or cherry blossom or waves or sky, VISIBLE WOODBLOCK PRINT TEXTURE 20mm+'
  },
  
  masters: {
    name: '거장 화풍',
    prompt: 'Master artist painting, master artist art style, exceptional technical skill, distinctive artistic vision, profound emotional depth, timeless masterpiece quality'
  },
  
  oriental: {
    name: '동양화',
    prompt: 'Traditional East Asian painting, East Asian art style, ink wash brushwork, minimalist composition, harmony with nature, philosophical contemplation, classical Oriental masterpiece quality, VISIBLE INK BRUSH TEXTURE 20mm+'
  }
};

// ========================================
// 간단한 사진 분석 함수
// ========================================
function analyzePhoto() {
  // 실제로는 이미지를 보고 AI가 분석하지만,
  // 프롬프트에서 AI가 직접 분석하도록 함
  // 이 함수는 필요시 확장 가능
  return {
    analyzed: false,
    note: 'AI will analyze photo directly in prompt'
  };
}

// ========================================
// AI 화가 자동 선택 (타임아웃 포함)
// ========================================
async function selectArtistWithAI(imageBase64, selectedStyle, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  // 변수 선언을 함수 최상단으로 이동 (스코프 문제 해결)
  const categoryName = selectedStyle.name;
  // v74: 미술사조는 id를 사용 (rococo, impressionism 등), 거장/동양화는 category 사용
  const categoryType = (selectedStyle.category === 'movements') 
    ? selectedStyle.id 
    : selectedStyle.category;
  
  try {
    let promptText;
    
    if (categoryType === 'masters') {
      // ========================================
      // v62.1: 거장별 분기 처리
      // - 반 고흐/뭉크: 대표작 선택 방식 (AI가 사진에 맞는 작품 선택)
      // - 나머지 4명: 화풍 프롬프트 방식
      // ========================================
      const masterId = selectedStyle.id.replace('-master', '');
      
      // ========== 모든 거장: 대표작 선택 방식 (masterworks.js 사용) ==========
      // v68: 하드코딩 제거, getArtistMasterworkGuide 함수 사용
      const masterWorks = getArtistMasterworkGuide(masterId);
      
      if (masterWorks) {
        // 대표작 가이드가 있는 경우 - 대표작 선택 방식
        promptText = `You are selecting the BEST masterwork from ${categoryName}'s collection for this photo.

AVAILABLE MASTERWORKS (YOU MUST SELECT FROM THIS LIST ONLY):
${masterWorks}

⚠️ CRITICAL: You MUST select ONLY from the works listed above. Do NOT select any other works not in this list. If you select a work not listed above, the system will fail.

CRITICAL MATCHING RULES:
- If SINGLE person (1) → NEVER select "The Kiss" (requires couple)
- If PARENT with CHILD (adult + child/baby together) → NEVER select "The Kiss" (romantic couple only, NOT for family)

STYLE APPLICATION RULE:
- Apply the artwork's TECHNIQUE, COLOR, MOOD to the subject.
- Do NOT literally copy figures from the artwork onto the subject.

INSTRUCTIONS:
1. Analyze the photo THOROUGHLY:
   - Subject type (person/landscape/animal/object)
   - If PERSON: gender (male/female), age, physical features (jaw shape, hair, build)
   - PERSON COUNT: How many people are in the photo? (1, 2, 3+)
   - BACKGROUND: What's in the background? (simple/complex/outdoor/indoor)
   - Mood, composition
2. Apply CRITICAL MATCHING RULES above - eliminate unsuitable works first
3. From remaining works, select the MOST SUITABLE one
4. Generate a FLUX prompt that STARTS with detailed subject description
5. IMPORTANT: Preserve the original subject - if it's a baby, keep it as a baby; if elderly, keep elderly
6. CRITICAL: If only 1 person in photo, add "DO NOT add extra people in background"

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief photo analysis",
  "subject_type": "person" or "landscape" or "animal" or "object",
  "gender": "male" or "female" or "both" or null,
  "age_range": "baby/child/teen/young_adult/adult/middle_aged/elderly" or null,
  "ethnicity": "asian" or "caucasian" or "african" or "hispanic" or "middle_eastern" or "mixed" or null,
  "physical_description": "for MALE: strong jaw, angular face, short hair, broad shoulders etc. For FEMALE: soft features, delicate face etc. ALWAYS include skin tone and ethnic features." or null,
  "person_count": 1 or 2 or 3 (number of people in photo),
  "background_type": "simple" or "complex" or "outdoor" or "indoor" or "studio",
  "selected_artist": "${categoryName}",
  "selected_work": "exact title of the masterwork you selected",
  "reason": "why this masterwork matches this photo (mention gender/count compatibility)",
  "prompt": "Start with 'MALE/FEMALE SUBJECT with [physical features]' if person, then 'painting by ${categoryName} in the style of [selected work title], [that work's distinctive techniques]'. If person_count=1, END with 'DO NOT add extra people, NO hallucinated figures in background'"
}`;
        
      } else {
        // ========== 대표작 가이드가 없는 화가: 화풍 프롬프트 방식 ==========
        // v68: masterworks.js에 가이드가 없으면 artistStyles.js 사용
        const masterStylePrompt = getArtistStyleByName(masterId);
        
        // AI에게는 단순 사진 분석만 요청
        promptText = `Analyze this photo for ${categoryName}'s painting style transformation.

IMPORTANT: The user has ALREADY SELECTED ${categoryName} as their preferred master artist.
Your job is ONLY to analyze the photo - NOT to select a different artist or artwork.

STYLE TO APPLY (FIXED - DO NOT CHANGE):
${masterStylePrompt}

INSTRUCTIONS:
1. Analyze the photo:
   - Subject type (person/landscape/animal/object)
   - If PERSON: gender (male/female), age, physical features
   - Number of people in photo
   - Background type
   - Mood and composition
2. Generate a FLUX prompt that applies ${categoryName}'s style to THIS specific photo
3. CRITICAL: Preserve the original subject's identity, gender, age, and ethnicity

GENDER PRESERVATION RULE:
- If MALE subject → MUST preserve MASCULINE features (strong jaw, angular face, male body)
- If FEMALE subject → MUST preserve FEMININE features (soft features, female body)
- NEVER change the subject's gender

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief photo analysis",
  "subject_type": "person" or "landscape" or "animal" or "object",
  "gender": "male" or "female" or "both" or null,
  "age_range": "baby/child/teen/young_adult/adult/middle_aged/elderly" or null,
  "ethnicity": "asian" or "caucasian" or "african" or "hispanic" or "middle_eastern" or "mixed" or null,
  "physical_description": "for MALE: strong jaw, angular face, short hair, broad shoulders etc. For FEMALE: soft features, delicate face etc. ALWAYS include skin tone and ethnic features." or null,
  "person_count": 1 or 2 or 3,
  "background_type": "simple" or "complex" or "outdoor" or "indoor" or "studio",
  "selected_artist": "${categoryName}",
  "selected_work": null,
  "reason": "applying ${categoryName}'s distinctive painting style",
  "prompt": "Start with subject description (gender, age, features), then '${masterStylePrompt.substring(0, 200)}...'. If person_count=1, END with 'DO NOT add extra people'"
}`;
      }
      
    } else if (categoryType === 'oriental') {
      // 동양화: 한국/중국/일본 스타일 선택 (기존 로직 유지)
      const styleId = selectedStyle.id;
      
      if (styleId === 'korean') {
        // 한국 - Claude가 3가지 스타일 중 선택
        promptText = `Analyze this photo and select the BEST Korean traditional painting style.

You must choose ONE of these THREE styles:

Style 1: Korean Minhwa Folk Painting (민화)
- Best for: animals (tiger, magpie, fish), flowers (peony), birds, simple subjects
- Characteristics: Folk painting on ROUGH THICK HANJI PAPER with PROMINENT FIBER TEXTURE visible throughout, UNEVEN PIGMENT ABSORPTION creating patchy color areas, genuinely FADED OLD colors (like 200-year museum piece), TREMBLING UNSTEADY brushlines (amateur folk artist quality), thick black outlines but IRREGULAR and wobbly, colors pooling in paper fibers, authentic Joseon folk artifact NOT illustration
- When: Photo has animals, flowers, or needs folk art treatment

Style 2: Korean Pungsokdo Genre Painting (풍속도)
- Best for: people, portraits, daily life, couples, festivals, human activities  
- Characteristics: KOREAN INK PAINTING on ROUGH TEXTURED HANJI, BLACK INK BRUSHWORK for outlines, visible hanji fiber texture throughout, spontaneous confident ink strokes, Kim Hong-do and Shin Yun-bok style
- CLOTHING: MUST transform modern clothing to traditional Joseon hanbok (저고리/치마 for women, 도포/갓 for men) with ELEGANT SOFT colors (soft pink, light blue, pale green, gentle coral, muted red)
- When: Photo has people, faces, human subjects

Style 3: Korean Jingyeong Landscape (진경산수)
- Best for: mountains, nature, rocks, landscapes, scenery
- Characteristics: Bold expressive brushwork, dramatic angular forms, monochrome ink with strong contrasts, REAL Korean scenery (not idealized Chinese mountains)
- When: Photo has natural landscapes, mountains, rocks

Analyze the photo and choose the MOST suitable style.

CRITICAL INSTRUCTIONS FOR PROMPT GENERATION:

1. KOREAN VS CHINESE DISTINCTION:
   - Korean Pungsokdo: ROUGH hanji paper, spontaneous loose brushwork, ink outlines with ELEGANT hanbok
   - Chinese Gongbi: meticulous tight brushwork, Korean is loose spontaneous
   - Korean hanbok colors: SOFT and ELEGANT (soft pink, light blue, pale green)

2. GENDER PRESERVATION (MANDATORY IN PROMPT):
   - FIRST identify if photo has person(s) and their gender
   - If MALE in photo → prompt MUST start with "CRITICAL GENDER RULE: This photo shows MALE person, PRESERVE MASCULINE FEATURES - strong jaw, masculine face, male body structure, KEEP MALE GENDER."
   - If FEMALE in photo → prompt MUST start with "CRITICAL GENDER RULE: This photo shows FEMALE person, PRESERVE FEMININE FEATURES - soft face, feminine features, female body structure, KEEP FEMALE GENDER."
   - This gender instruction MUST be the FIRST thing in your generated prompt

3. CALLIGRAPHY TEXT (POSITIVE MEANING ONLY):
   - Choose appropriate positive text (1-4 characters) that makes the viewer feel GOOD
   - MUST be positive, auspicious, beautiful meaning - consumer will see this!
   - MUST use ONLY Chinese characters (Hanja/漢字) for Korean art
   - Single characters: "福" (blessing), "壽" (longevity), "喜" (joy), "美" (beauty), "和" (harmony), "愛" (love), "樂" (happiness), "春" (spring), "花" (flower), "夢" (dream)
   - Two characters: "吉祥" (good fortune), "平安" (peace), "幸福" (happiness), "長壽" (long life), "富貴" (wealth)
   - Phrases: "花開富貴" (blooming prosperity), "萬事如意" (all wishes fulfilled), "百年好合" (eternal harmony)
   - For landscapes: "山水" (mountain water), "江山" (rivers mountains), "風流" (elegance)

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief photo description including gender if person present (1 sentence)",
  "subject_type": "person" or "landscape" or "animal" or "object",
  "gender": "male" or "female" or null,
  "age_range": "baby/child/teen/young_adult/adult/middle_aged/elderly" or null,
  "physical_description": "for MALE: strong jaw, angular face, short hair, broad shoulders etc. For FEMALE: soft features, delicate face etc." or null,
  "selected_artist": "Korean Minhwa" or "Korean Pungsokdo" or "Korean Jingyeong Landscape",
  "selected_style": "minhwa" or "pungsokdo" or "landscape",
  "calligraphy_text": "positive text you chose (Chinese characters only)",
  "reason": "why this style fits (1 sentence)",
  "prompt": "KEEP UNDER 150 WORDS. [Gender rule] Korean [style] with key characteristics. Calligraphy text '[your calligraphy_text]' in Chinese characters (Hanja) only."
}

CRITICAL: Keep prompt field UNDER 150 WORDS to avoid truncation.`;
      }
      
      if (styleId === 'chinese') {
        // 중국 - Claude가 3가지 스타일 중 선택
        promptText = `Analyze this photo and select the BEST Chinese traditional painting style.

You must choose ONE of these THREE styles:

Style 1: Chinese Ink Wash Painting (水墨畫 Shuimohua)
- Best for: landscapes, mountains, nature, trees, contemplative subjects, simple compositions
- Characteristics: Monochrome black ink with gradations (deep black to light grey), soft flowing brushstrokes, minimalist composition with elegant empty space, misty atmosphere
- When: Photo has landscapes, nature, or needs meditative serene treatment
- CLOTHING: If people present, MUST dress in traditional Chinese hanfu (long flowing dress with wide sleeves for women, scholar's robe with wide sleeves for men)

Style 2: Chinese Gongbi Meticulous Painting (工筆畫)
- Best for: portraits, people, detailed subjects, colorful compositions
- Characteristics: EXTREMELY FINE detailed brushwork with DELICATE HAIR-THIN brush lines, SILK SURFACE TEXTURE throughout (not paper), rich MINERAL PIGMENT colors (malachite green, azurite blue, cinnabar red), ornate decorative patterns, TRADITIONAL PAINTED FEEL not digital, imperial court quality, VISIBLE FINE BRUSHSTROKES showing meticulous hand-painted technique
- When: Photo has people, faces, or needs detailed colorful treatment
- CRITICAL: Must look like TRADITIONAL HAND-PAINTED silk painting, VISIBLE brush texture, traditional painted quality
- CLOTHING: MUST dress in traditional Chinese hanfu (long flowing dress with wide sleeves for women, scholar's robe with wide sleeves for men), NOT modern clothing

Style 3: Chinese Huaniao Bird-and-Flower Painting (花鳥畫)
- Best for: birds, flowers, animals (dogs, cats, rabbits), fish, insects, any natural creatures
- Characteristics: Traditional genre includes "flowers, birds, fish, insects" (花鳥魚蟲) PLUS animals, detailed naturalistic rendering, precise brushwork for fur/feathers/petals, delicate colors, symbolic meanings
- When: Photo has birds, flowers, animals, or plants

Analyze the photo and choose the MOST suitable style.

CRITICAL INSTRUCTIONS FOR PROMPT GENERATION:

1. GENDER PRESERVATION (MANDATORY IN PROMPT):
   - FIRST identify if photo has person(s) and their gender
   - If MALE in photo → prompt MUST start with "CRITICAL GENDER RULE: This photo shows MALE person, PRESERVE MASCULINE FEATURES - strong jaw, masculine face, male body structure, KEEP MALE GENDER."
   - If FEMALE in photo → prompt MUST start with "CRITICAL GENDER RULE: This photo shows FEMALE person, PRESERVE FEMININE FEATURES - soft face, feminine features, female body structure, KEEP FEMALE GENDER."
   - This gender instruction MUST be the FIRST thing in your generated prompt

2. TRADITIONAL CLOTHING (MANDATORY FOR PEOPLE):
   - If photo has people → MUST dress in traditional Chinese hanfu
   - Women: long flowing dress with wide sleeves
   - Men: scholar's robe with wide sleeves
   - NEVER keep modern clothing (hoodies, jeans, t-shirts, etc.)
   - This is essential for authentic Chinese traditional painting aesthetic

3. CALLIGRAPHY TEXT (POSITIVE MEANING ONLY):
   - Choose appropriate positive text (1-4 characters) that makes the viewer feel GOOD
   - MUST be positive, auspicious, beautiful meaning - consumer will see this!
   - MUST use ONLY Chinese characters (Hanzi/漢字) for Chinese art
   - Single characters: "福" (blessing), "壽" (longevity), "喜" (joy), "美" (beauty), "和" (harmony), "愛" (love), "樂" (happiness), "春" (spring), "花" (flower), "夢" (dream)
   - Two characters: "吉祥" (good fortune), "平安" (peace), "幸福" (happiness), "長壽" (long life), "富貴" (wealth)
   - Phrases: "花開富貴" (blooming prosperity), "萬事如意" (all wishes fulfilled), "百年好合" (eternal harmony)
   - For landscapes: "山水" (mountain water), "江山" (rivers mountains), "風流" (elegance)

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief photo description including gender if person present (1 sentence)",
  "subject_type": "person" or "landscape" or "animal" or "object",
  "gender": "male" or "female" or null,
  "age_range": "baby/child/teen/young_adult/adult/middle_aged/elderly" or null,
  "physical_description": "for MALE: strong jaw, angular face, short hair, broad shoulders etc. For FEMALE: soft features, delicate face etc." or null,
  "selected_artist": "Chinese Ink Wash" or "Chinese Gongbi" or "Chinese Huaniao",
  "selected_style": "ink_wash" or "gongbi" or "huaniao",
  "calligraphy_text": "positive text you chose (Chinese characters only)",
  "reason": "why this style fits (1 sentence)",
  "prompt": "KEEP UNDER 150 WORDS. [Gender rule] Chinese [style] with key characteristics. Traditional hanfu clothing. Calligraphy text '[your calligraphy_text]' in Chinese characters (Hanzi) only."
}

CRITICAL: Keep prompt field UNDER 150 WORDS to avoid truncation.`;
      }
      
      if (styleId === 'japanese') {
        // 일본 - 우키요에 (서예 텍스트 선택 추가)
        promptText = `You are converting a photo to Japanese Ukiyo-e woodblock print style.

Select an appropriate POSITIVE calligraphy text for this image.

CALLIGRAPHY TEXT (POSITIVE MEANING ONLY):
- Choose appropriate positive text (1-4 characters) that makes the viewer feel GOOD
- MUST be positive, auspicious, beautiful meaning - consumer will see this!
- Single characters: "福" (blessing), "壽" (longevity), "喜" (joy), "美" (beauty), "和" (harmony), "愛" (love), "樂" (happiness), "春" (spring), "花" (flower), "夢" (dream)
- Two characters: "吉祥" (good fortune), "平安" (peace), "幸福" (happiness), "浮世" (ukiyo/floating world)
- Japanese style: "粋" (iki/stylish), "雅" (miyabi/elegant), "桜" (sakura/cherry blossom), "波" (nami/wave), "富士" (Fuji)

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief photo description",
  "selected_artist": "Japanese Ukiyo-e",
  "calligraphy_text": "positive text you chose",
  "prompt": "Japanese Ukiyo-e woodblock print style with flat bold colors, strong black outlines, CLOTHING: traditional Japanese attire (elegant kimono for women, hakama pants with haori jacket for men), decorative patterns, Mt Fuji or cherry blossom or waves background. Include ONLY the calligraphy text '[your calligraphy_text]' in vertical brushwork style."
}`;
      }
      
    } else {
      // ========================================
      // 미술사조: v33 업그레이드된 화가 선택
      // ========================================
      
      // 사조별 가이드라인 가져오기
      let guidelines = '';
      let hints = '';
      
      // 간단한 사진 분석 (AI가 직접 하지만 힌트용)
      const photoAnalysis = {
        count: 1,  // AI가 실제 분석
        gender: 'unknown',
        shot_type: 'portrait',
        subject: 'person',
        background: 'neutral',
        mood: 'neutral',
        age_range: 'adult',
        lighting: 'normal',
        expression: 'neutral',
        composition: 'normal'
      };
      
      if (categoryType === 'ancient') {
        guidelines = getAncientGreekRomanGuidelines();
        hints = getAncientGreekRomanHints(photoAnalysis);
      } else if (categoryType === 'renaissance') {
        guidelines = getRenaissanceGuidelines();
        hints = getRenaissanceHints(photoAnalysis);
      } else if (categoryType === 'baroque') {
        guidelines = getBaroqueGuidelines();
        hints = getBaroqueHints(photoAnalysis);
      } else if (categoryType === 'rococo') {
        guidelines = getRococoGuidelines();
        hints = getRococoHints(photoAnalysis);
      } else if (categoryType === 'medieval') {
        guidelines = getMedievalGuidelines();
        hints = getMedievalHints(photoAnalysis);
      } else if (categoryType === 'neoclassicism_vs_romanticism_vs_realism') {
        guidelines = getNeoclassicismVsRomanticismVsRealismGuidelines();
        hints = getNeoclassicismVsRomanticismVsRealismHints(photoAnalysis);
      } else if (categoryType === 'impressionism') {
        guidelines = getImpressionismGuidelines();
        hints = getImpressionismHints(photoAnalysis);
      } else if (categoryType === 'postImpressionism') {
        guidelines = getPostImpressionismGuidelines();
        hints = getPostImpressionismHints(photoAnalysis);
      } else if (categoryType === 'fauvism') {
        guidelines = getFauvismGuidelines();
        hints = getFauvismHints(photoAnalysis);
      } else if (categoryType === 'expressionism') {
        guidelines = getExpressionismGuidelines();
        hints = getExpressionismHints(photoAnalysis);
      } else if (categoryType === 'modernism') {
        guidelines = getModernismGuidelines();
        hints = getModernismHints(photoAnalysis);
      } else {
        // 고대 그리스-로마, 중세 미술 등 - 기본 로직
        promptText = `Analyze this photo and select the BEST artist from ${categoryName} period/style to transform it.

Instructions:
1. Analyze: subject, age, mood, composition, lighting
2. Select the MOST SUITABLE ${categoryName} artist for THIS specific photo
3. Generate a detailed prompt for FLUX Depth in that artist's style
4. IMPORTANT: Preserve the original subject - if it's a baby, keep it as a baby; if elderly, keep elderly

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief photo description",
  "selected_artist": "Artist Full Name",
  "reason": "why this artist fits this photo",
  "prompt": "painting by [Artist], [artist's technique], [artist's characteristics], depicting the subject while preserving original features and age"
}

Keep it concise and accurate.`;
      }
      
      // 상세 가이드라인이 있는 사조
      if (guidelines) {
        // 고대 그리스-로마는 스타일 선택 (화가 아님)
        if (categoryType === 'ancient') {
          // v67: 로마 모자이크 대표작 가이드 추가
          const ancientMasterworkGuide = getMovementMasterworkGuide('ancient') || '';
          
          promptText = `Select the BEST ${categoryName} STYLE for this photo.

${guidelines}

${ancientMasterworkGuide}

${hints}

Instructions - PRIORITY ORDER:
1. FIRST check: Are there ANIMALS in this photo?
   - Dogs, cats, horses, birds, fish, any animals → ROMAN MOSAIC
   - Historical accuracy: Romans excelled at animal mosaics (Pompeii Cave Canem)
   - Animals = MOSAIC priority!
2. SECOND check: Is there DYNAMIC MOVEMENT/ACTION/SPORTS in this photo?
   - If YES → CLASSICAL SCULPTURE (even if landscape/stadium visible!)
   - Sports, jumping, running, athletic action = SCULPTURE priority!
3. THIRD check: Is it a STATIC photo WITH landscape/nature elements?
   - If YES → ROMAN MOSAIC
4. FOURTH: Portrait without landscape → CLASSICAL SCULPTURE
5. If ROMAN MOSAIC selected, also choose the BEST MASTERWORK from the list above
6. Follow RECOMMENDATIONS (80% weight)
7. Preserve subject identity

Return JSON only:
{
  "analysis": "brief - note if animals/dynamic/static (1 sentence)",
  "selected_artist": "Classical Sculpture" or "Roman Mosaic",
  "selected_work": "If Roman Mosaic, select best masterwork from list above (e.g. 'Alexander Mosaic'). If Classical Sculpture, use null",
  "reason": "why this style fits, mention animals/dynamic/static (1 sentence)",
  "prompt": "Ancient Greek-Roman art in [chosen style], [style characteristics - for Sculpture mention material choice, for Mosaic mention tesserae tiles and selected masterwork style], depicting subject while preserving original facial features"
}`;
        } else if (categoryType === 'medieval') {
          // 중세 미술 - 동물/사람/정물/풍경 분기
          const medievalMasterworkGuide = getMovementMasterworkGuide('medieval') || '';
          
          promptText = `Select the BEST ${categoryName} style for this photo.

${guidelines}

${medievalMasterworkGuide}

${hints}

Instructions:
1. 🚨 ANIMALS in photo? → MUST choose Islamic Miniature
2. PEOPLE in photo? → Choose Islamic Miniature 50% OR Byzantine 50% (NEVER Gothic for people!)
3. STILL LIFE/OBJECTS (food, items)? → Choose Islamic Miniature
4. LANDSCAPE/BUILDING only? → Choose Gothic Stained Glass

Style characteristics:
- Islamic Miniature: "Persian Ottoman court painting, vibrant jewel colors ruby sapphire emerald gold, ornamental floral patterns, courtly elegant aesthetic"
- Byzantine: "golden mosaic background with shimmering gold leaf, CIRCULAR GOLDEN HALO behind head, flat hieratic frontal figures"
- Gothic: "cathedral stained glass jewel tones with THICK BLACK LEAD LINES, geometric patterns, FLAT TWO-DIMENSIONAL"

Return JSON only:
{
  "analysis": "brief (1 sentence)",
  "selected_artist": "Islamic Miniature or Byzantine or Gothic",
  "selected_work": null,
  "reason": "why (1 sentence)",
  "prompt": "Medieval art in [style name], [style characteristics], depicting subject while preserving original features"
}`;
        } else {
          // 다른 사조들 (표현주의, 르네상스, 바로크 등)
          // v67: 화가 + 대표작 동시 선택 방식
          
          // 사조별 대표작 가이드 가져오기
          const masterworkGuide = getMovementMasterworkGuide(categoryType) || '';
          
          promptText = `Select the BEST ${categoryName} artist AND their BEST MASTERWORK for this photo.

${guidelines}

${masterworkGuide}

${hints}

Instructions:
1. FIRST analyze the photo THOROUGHLY:
   - Subject type (person/landscape/animal/object)
   - If PERSON: gender (male/female), age, physical features (jaw shape, hair, build)
   - PERSON COUNT: How many people are in the photo? (1, 2, 3+)
   - BACKGROUND: What's in the background? (simple/complex/outdoor/indoor)
   - Mood, composition
2. Follow RECOMMENDATIONS (70-80% weight)
3. Choose most DISTINCTIVE artist for THIS specific photo
4. CRITICAL: Select the BEST MASTERWORK from that artist's list above that matches this photo
5. Preserve facial identity and original features
6. Include the masterwork's SPECIFIC style characteristics in your prompt
7. IMPORTANT: Start prompt with subject description if person
8. CRITICAL: If only 1 person in photo, add "DO NOT add extra people in background, keep background clean"

Return JSON only:
{
  "analysis": "brief (1 sentence)",
  "subject_type": "person" or "landscape" or "animal" or "object",
  "gender": "male" or "female" or "both" or null,
  "age_range": "baby/child/teen/young_adult/adult/middle_aged/elderly" or null,
  "ethnicity": "asian" or "caucasian" or "african" or "hispanic" or "middle_eastern" or "mixed" or null,
  "physical_description": "for MALE: strong jaw, angular face, short hair, broad shoulders etc. For FEMALE: soft features, delicate face etc. ALWAYS include skin tone and ethnic features." or null,
  "person_count": 1 or 2 or 3 (number of people in photo),
  "background_type": "simple" or "complex" or "outdoor" or "indoor" or "studio",
  "selected_artist": "Artist Full Name",
  "selected_work": "EXACT masterwork title from the list above",
  "reason": "why this artist AND this masterwork fit (1 sentence)",
  "prompt": "Start with 'MALE/FEMALE SUBJECT with [physical features]' if person, then 'painting by [Artist] in the style of [selected_work], [that work's distinctive techniques and colors]'. If person_count=1, END with 'DO NOT add extra people, NO hallucinated figures in background, keep background CLEAN'"
}`;
        }
      }
    }
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',  // Claude Sonnet 4.5 (최신)
        max_tokens: 1000,  // 500 → 1000 (JSON 잘림 방지)
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64.split(',')[1]
              }
            },
            {
              type: 'text',
              text: promptText
            }
          ]
        }]
      })
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }
    
    const data = await response.json();
    const text = data.content[0].text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const result = JSON.parse(text);
    
    // 검증
    if (!result.prompt || !result.selected_artist) {
      throw new Error('Invalid AI response format');
    }
    
    return {
      success: true,
      artist: result.selected_artist,
      work: result.selected_work,  // 거장 모드: 선택된 대표작
      reason: result.reason,
      prompt: result.prompt,
      analysis: result.analysis,
      calligraphy_text: result.calligraphy_text || null,  // v70: 동양화 서예 텍스트
      // Vision 분석 결과 (통합됨)
      visionData: {
        subject_type: result.subject_type || null,
        gender: result.gender || null,
        age_range: result.age_range || null,
        physical_description: result.physical_description || null,
        person_count: result.person_count || null,
        background_type: result.background_type || null
      }
    };
    
  } catch (error) {
    clearTimeout(timeout);
    console.error('AI selection failed:', error.message);
    return { success: false, error: error.message };
  }
}

// ========================================
// A 방안: 상세 분석 결과를 프롬프트로 변환
// ========================================
function buildIdentityPrompt(visionAnalysis) {
  if (!visionAnalysis || visionAnalysis.subject_type !== 'person') {
    return '';
  }
  
  const parts = [];
  
  // 성별 강조 (가장 중요)
  if (visionAnalysis.gender === 'male') {
    parts.push('MALE SUBJECT with MASCULINE features');
    if (visionAnalysis.physical_description) {
      parts.push(visionAnalysis.physical_description);
    } else {
      parts.push('strong angular jaw, male bone structure, masculine build');
    }
    parts.push('DO NOT feminize, DO NOT soften features, KEEP AS MAN');
  } else if (visionAnalysis.gender === 'female') {
    parts.push('FEMALE SUBJECT with FEMININE features');
    if (visionAnalysis.physical_description) {
      parts.push(visionAnalysis.physical_description);
    } else {
      parts.push('soft delicate features, female bone structure, feminine build');
    }
    parts.push('DO NOT masculinize, KEEP AS WOMAN');
  } else if (visionAnalysis.gender === 'both') {
    // 남녀 혼합 (커플, 그룹 등)
    parts.push('MIXED GENDER GROUP - PRESERVE BOTH GENDERS EXACTLY');
    if (visionAnalysis.physical_description) {
      parts.push(visionAnalysis.physical_description);
    }
    parts.push('MALE figures MUST remain MASCULINE with strong jaw and male bone structure');
    parts.push('FEMALE figures MUST remain FEMININE with soft features and female bone structure');
    parts.push('DO NOT swap genders, DO NOT feminize males, DO NOT masculinize females');
  }
  
  // 나이
  if (visionAnalysis.age_range) {
    const ageMap = {
      'baby': 'BABY infant',
      'child': 'CHILD young kid',
      'teen': 'TEENAGER adolescent',
      'young_adult': 'young adult in 20s',
      'adult': 'adult in 30s-40s',
      'middle_aged': 'middle-aged person in 50s',
      'elderly': 'ELDERLY senior person'
    };
    parts.push(ageMap[visionAnalysis.age_range] || visionAnalysis.age_range);
  }
  
  // 머리
  if (visionAnalysis.hair) {
    parts.push(visionAnalysis.hair);
  }
  
  // 민족성 (매우 중요!)
  if (visionAnalysis.ethnicity) {
    const ethnicityMap = {
      'asian': 'ASIAN ethnicity with East Asian facial features, monolid or double eyelid eyes, warm golden-brown skin tone',
      'caucasian': 'CAUCASIAN ethnicity with European facial features, light skin tone',
      'african': 'AFRICAN ethnicity with African facial features, dark brown skin tone',
      'hispanic': 'HISPANIC/LATINO ethnicity with Latin American features, warm tan skin tone',
      'middle_eastern': 'MIDDLE EASTERN ethnicity with Middle Eastern features, olive skin tone',
      'mixed': 'MIXED ethnicity preserving original mixed heritage features'
    };
    const ethnicDesc = ethnicityMap[visionAnalysis.ethnicity] || `${visionAnalysis.ethnicity} ethnicity`;
    parts.push(ethnicDesc);
    parts.push('DO NOT change race, DO NOT alter skin color, PRESERVE original ethnicity EXACTLY');
  }
  
  return parts.join(', ');
}

// ========================================
// B 방안: 성별에 맞지 않는 화가 필터링
// ========================================
const FEMALE_BIASED_ARTISTS = [
  'BOUCHER', 'WATTEAU', 'BOTTICELLI', 'RENOIR'
];

const MALE_BIASED_ARTISTS = [
  'REMBRANDT', 'CARAVAGGIO', 'TITIAN', 'VELÁZQUEZ', 'VELAZQUEZ'
];

// 사조별 남성 적합 화가 목록 (여성 편향 화가 제외)
// 여성 편향: BOUCHER, WATTEAU, BOTTICELLI, RENOIR
const MALE_SUITABLE_ARTISTS_BY_CATEGORY = {
  'impressionism': [
    // RENOIR 제외
    { name: 'CAILLEBOTTE', weight: 50 },  // 도시 남성 전문
    { name: 'MONET', weight: 30 },
    { name: 'DEGAS', weight: 20 }
  ],
  'postImpressionism': [
    // 시냐크 삭제
    { name: 'VAN GOGH', weight: 45 },
    { name: 'CÉZANNE', weight: 30 },
    { name: 'GAUGUIN', weight: 25 }
  ],
  'baroque': [
    { name: 'CARAVAGGIO', weight: 45 },
    { name: 'REMBRANDT', weight: 40 },
    { name: 'VELÁZQUEZ', weight: 15 }
  ],
  'renaissance': [
    // BOTTICELLI 제외
    { name: 'LEONARDO DA VINCI', weight: 45 },
    { name: 'TITIAN', weight: 30 },
    { name: 'MICHELANGELO', weight: 15 },
    { name: 'RAPHAEL', weight: 10 }
  ],
  'rococo': [
    // WATTEAU, BOUCHER 둘 다 여성 편향 - 로코코는 원래 여성적 사조
    // 남성 사진엔 로코코 자체가 부적합하지만, 그래도 와토가 그나마 나음
    { name: 'WATTEAU', weight: 70 },
    { name: 'BOUCHER', weight: 30 }
  ],
  'fauvism': [
    // 여성 편향 없음
    { name: 'MATISSE', weight: 40 },
    { name: 'DERAIN', weight: 35 },
    { name: 'VLAMINCK', weight: 25 }
  ],
  'expressionism': [
    // 여성 편향 없음
    { name: 'MUNCH', weight: 30 },
    { name: 'KIRCHNER', weight: 30 },
    { name: 'KOKOSCHKA', weight: 25 },
    { name: 'KANDINSKY', weight: 15 }
  ],
  'modernism': [
    // v70: 키스해링 삭제, 피카소↓ 샤갈 추가
    { name: 'CHAGALL', weight: 30 },
    { name: 'LICHTENSTEIN', weight: 25 },
    { name: 'PICASSO', weight: 25 },
    { name: 'MAGRITTE', weight: 20 }
  ],
  'neoclassicism': [
    // 여성 편향 없음 (INGRES는 여성 인물 잘 그리지만 남성도 잘 그림)
    { name: 'JACQUES-LOUIS DAVID', weight: 45 },
    { name: 'INGRES', weight: 25 },
    { name: 'DELACROIX', weight: 20 }
  ],
  'neoclassicism_vs_romanticism_vs_realism': [
    // neoclassicism과 동일 (별칭)
    { name: 'JACQUES-LOUIS DAVID', weight: 25 },
    { name: 'DELACROIX', weight: 20 },
    { name: 'TURNER', weight: 20 },
    { name: 'COURBET', weight: 15 },
    { name: 'MANET', weight: 10 },
    { name: 'INGRES', weight: 10 }
  ]
};

function filterArtistByGender(artistName, gender, category = null) {
  const upperArtist = artistName.toUpperCase();
  
  if (gender === 'male') {
    // 남자 사진인데 여성 편향 화가 선택됨
    for (const femaleArtist of FEMALE_BIASED_ARTISTS) {
      if (upperArtist.includes(femaleArtist)) {
        // console.log(`⚠️ Gender filter: ${artistName} is female-biased, but subject is MALE`);
        
        // 사조에 맞는 남성 적합 화가 중 가중치 랜덤 선택
        const maleSuitable = MALE_SUITABLE_ARTISTS_BY_CATEGORY[category];
        if (maleSuitable) {
          const suggestion = weightedRandomSelect(maleSuitable);
          // console.log(`🔄 [GENDER-FILTER] Category: ${category}, weight-selected: ${suggestion}`);
          return {
            filtered: true,
            reason: `${artistName} specializes in female subjects`,
            suggestion: suggestion
          };
        }
        
        // fallback
        return {
          filtered: true,
          reason: `${artistName} specializes in female subjects`,
          suggestion: 'REMBRANDT'
        };
      }
    }
  } else if (gender === 'female') {
    // 여자 사진인데 남성 편향 화가는 괜찮음 (여성도 잘 그림)
    // 필터링 안 함
  }
  
  return { filtered: false };
}

// ========================================
// 메인 핸들러
// ========================================
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const startTime = Date.now();
    const { image, selectedStyle, correctionPrompt } = req.body;
    
    // v68.3: 변수 초기화 (스코프 문제 해결) - v68: 긍정 명령어로 통일
    let coreRulesPrefix = 'Female nipples MUST be covered by clothing. Preserve identity, gender, ethnicity exactly. Keep only original elements from photo. Clean artwork, text-free, signature-free, watermark-free. ';
    let genderPrefixCommon = '';

    // v66: 구조화된 로그 수집 객체
    const logData = {
      vision: { count: 0, gender: '', age: '', subjectType: '' },
      selection: { category: '', movement: '', artist: '', masterwork: '', reason: '' },
      prompt: { 
        wordCount: 0, 
        applied: { 
          coreRules: false, gender: false, artist: false, masterwork: false, sandwich: false, 
          identity: false, attractive: false, painting: false, brushwork: false, sandwich: false 
        }
      },
      flux: { model: 'flux-depth-dev', control: 0 }
    };

    // 디버깅 로그 (v66: 주석처리)
    // console.log('=== FLUX Transfer v33 Debug ===');
    // console.log('Has REPLICATE_API_KEY:', !!process.env.REPLICATE_API_KEY);
    // console.log('Has ANTHROPIC_API_KEY:', !!process.env.ANTHROPIC_API_KEY);
    // console.log('Has image:', !!image);
    // console.log('Image length:', image ? image.length : 0);
    // console.log('Image starts with:', image ? image.substring(0, 50) : 'N/A');
    // console.log('Has selectedStyle:', !!selectedStyle);
    // console.log('selectedStyle:', selectedStyle);

    if (!process.env.REPLICATE_API_KEY) {
      console.error('ERROR: REPLICATE_API_KEY not configured');
      return res.status(500).json({ error: 'Replicate API key not configured' });
    }

    if (!image || !selectedStyle) {
      console.error('ERROR: Missing image or selectedStyle');
      console.error('image exists:', !!image);
      console.error('selectedStyle:', JSON.stringify(selectedStyle, null, 2));
      return res.status(400).json({ error: 'Missing image or style' });
    }

    // selectedStyle 구조 검증
    if (!selectedStyle.name || !selectedStyle.category) {
      console.error('ERROR: Invalid selectedStyle structure');
      console.error('selectedStyle:', JSON.stringify(selectedStyle, null, 2));
      return res.status(400).json({ 
        error: 'Invalid style structure',
        details: 'Missing name or category'
      });
    }

    let finalPrompt;
    let selectedArtist;
    let selectedWork;  // 거장 모드: 선택된 대표작
    let selectionMethod;
    let selectionDetails = {};
    let controlStrength = 0.80; // 기본값 (getControlStrength에서 덮어씀)
    const categoryType = selectedStyle.category; // categoryType 변수 추가
    
    // ========================================
    // v70: 재변환 모드 (correctionPrompt 있으면)
    // artistStyles.js 화풍 연동 + MODIFY 먼저 순서
    // ========================================
    if (correctionPrompt) {
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔄 재변환 모드 (FLUX Kontext Pro) v75');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📝 수정 요청: ${correctionPrompt}`);
      console.log(`🖼️ 입력 이미지: ${typeof image === 'string' ? image.substring(0, 100) + '...' : 'base64 data'}`);
      console.log(`📐 이미지 타입: ${typeof image}, 길이: ${image?.length || 'N/A'}`);
      
      
      // v70: 거장 키 → artistStyles 키 매핑
      const MASTER_TO_ARTIST_KEY = {
        'VAN GOGH': 'vangogh',
        'VANGOGH': 'vangogh',
        'KLIMT': 'klimt',
        'MUNCH': 'munch',
        'PICASSO': 'picasso',
        'MATISSE': 'matisse',
        'FRIDA': 'frida',
        'LICHTENSTEIN': 'lichtenstein'
      };
      
      // 거장 키 추출 (selectedStyle.id 또는 name에서)
      let masterKey = selectedStyle.id?.toUpperCase() || selectedStyle.name?.toUpperCase() || '';
      // v70.1: '-MASTER' 접미사 제거
      masterKey = masterKey.replace('-MASTER', '');
      const artistKey = MASTER_TO_ARTIST_KEY[masterKey];
      
      // v70.1: 요청 내용 분석해서 동적으로 보존 항목 결정 (충돌 방지)
      const lowerPrompt = correctionPrompt.toLowerCase();
      const hasColorChange = /color|colour|blue|red|yellow|green|orange|purple|pink|gold|silver|bright|dark|light|warm|cool|tone/i.test(correctionPrompt);
      const hasBackgroundChange = /background/i.test(correctionPrompt);
      const hasFaceChange = /face|expression|eye|nose|mouth|smile|frown/i.test(correctionPrompt);
      const hasPoseChange = /pose|position|body|arm|leg|hand/i.test(correctionPrompt);
      
      let keepUnchanged = [];
      if (!hasColorChange) keepUnchanged.push('overall colors and tones');
      if (!hasBackgroundChange) keepUnchanged.push('background');
      if (!hasFaceChange) keepUnchanged.push('face identity');
      if (!hasPoseChange) keepUnchanged.push('body pose');
      keepUnchanged.push('composition');
      
      const keepUnchangedStr = keepUnchanged.join(', ');
      console.log(`🔒 보존 항목: ${keepUnchangedStr}`);
      
      // v76: FLUX Kontext 프롬프트 - 화가 이름 포함
      // "ONLY" + 수정 요청 + "while keeping the same [화가] painting style"
      
      // 화가 키 → 이름 변환
      const ARTIST_DISPLAY_NAMES = {
        'vangogh': 'Van Gogh',
        'klimt': 'Klimt',
        'munch': 'Munch',
        'picasso': 'Picasso',
        'matisse': 'Matisse',
        'frida': 'Frida Kahlo',
        'lichtenstein': 'Lichtenstein'
      };
      
      const artistDisplayName = ARTIST_DISPLAY_NAMES[artistKey] || 'painting';
      
      // pants → lower garment 치환 (FLUX가 다리 피부와 혼동 방지)
      const sanitizedPrompt = correctionPrompt.replace(/pants/gi, 'lower garment');
      const kontextPrompt = `ONLY ${sanitizedPrompt} while keeping the same facial features, composition, background, pose, and ${artistDisplayName} painting style`;
      
      console.log(`👨‍🎨 거장: ${masterKey} → ${artistDisplayName}`);
      console.log(`📜 Kontext 프롬프트: ${kontextPrompt}`);
      
      // FLUX Kontext Pro API 호출 (스타일 유지하며 부분 수정) - 재시도 로직 포함
      const MAX_RETRIES = 3;
      let response;
      let lastError;
      
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          response = await fetch(
            'https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions',
            {
              method: 'POST',
              headers: {
                'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'wait'
              },
              body: JSON.stringify({
                input: {
                  input_image: image,
                  prompt: kontextPrompt
                }
              })
            }
          );
          
          // 502/503 에러 시 재시도
          if (response.status === 502 || response.status === 503) {
            console.log(`🔄 FLUX Kontext 재시도 (${attempt}/${MAX_RETRIES})... ${response.status} 에러`);
            if (attempt < MAX_RETRIES) {
              await new Promise(r => setTimeout(r, 2000 * attempt)); // 2초, 4초 대기
              continue;
            }
          }
          
          // 성공 또는 다른 에러면 루프 탈출
          break;
        } catch (err) {
          lastError = err;
          console.log(`🔄 FLUX Kontext 재시도 (${attempt}/${MAX_RETRIES})... 네트워크 에러`);
          if (attempt < MAX_RETRIES) {
            await new Promise(r => setTimeout(r, 2000 * attempt));
            continue;
          }
        }
      }

      if (!response || !response.ok) {
        const errorText = response ? await response.text() : 'No response';
        const statusCode = response ? response.status : 500;
        console.error('FLUX Kontext error (retransform):', statusCode, errorText);
        return res.status(statusCode).json({ 
          error: `FLUX Kontext API error: ${statusCode}`,
          details: errorText
        });
      }

      const data = await response.json();
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(1);
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`✅ 재변환 완료 (${duration}초)`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      
      // 클라이언트가 기대하는 형식으로 응답 (1차 변환과 동일)
      return res.status(200).json({
        status: 'succeeded',
        output: data.output,
        selected_artist: '재변환',
        selected_work: correctionPrompt,
        isRetransform: true
      });
    }
    
    // ========================================
    // 1차 변환 모드 (기존 로직)
    // ========================================
    
    // 🎨 풍경/정물/동물일 때 control_strength 높여서 원본 구도 유지
    // (나중에 visionAnalysis 확인 후 조정됨)
    let landscapeStrengthBoost = false;
    
    if (selectedStyle.category === 'oriental' && selectedStyle.id === 'japanese') {
      // 일본 우키요에 (고정)
      // console.log('Japanese Ukiyo-e - using fixed style');
      
      const fallback = fallbackPrompts.japanese;
      finalPrompt = fallback.prompt;
      selectedArtist = fallback.name;
      selectionMethod = 'oriental_fixed';
      selectionDetails = {
        style: 'japanese_ukiyoe'
      };
      
    } else if (process.env.ANTHROPIC_API_KEY) {
      // console.log(`Trying AI artist selection for ${selectedStyle.name}...`);
      
      // ========================================
      // 🎯 통합된 AI 호출 (화가 선택 + Vision 분석)
      // ========================================
      const aiResult = await selectArtistWithAI(
        image, 
        selectedStyle,
        25000 // 25초 타임아웃 (v68.3: 15초→25초 증가)
      );
      
      // Vision 분석 결과 추출 (통합됨)
      let visionAnalysis = null;
      let identityPrompt = '';
      
      if (aiResult.success && aiResult.visionData) {
        visionAnalysis = aiResult.visionData;
        identityPrompt = buildIdentityPrompt(visionAnalysis);
        // console.log('📸 Vision data (integrated):', visionAnalysis);
        // console.log('📸 Identity prompt:', identityPrompt);
        
        // v66: Vision 로그 수집
        logData.vision.count = visionAnalysis.person_count || 0;
        logData.vision.gender = visionAnalysis.gender || '';
        logData.vision.age = visionAnalysis.age_range || '';
        logData.vision.subjectType = visionAnalysis.subject_type || '';
      }
      
      // ========================================
      // 🎯 대전제: 가중치 기반 화가 사전 선택
      // ========================================
      let preSelectedArtist = null;
      const photoAnalysis = {}; // AI가 분석하기 전 기본 분석
      
      // Vision 분석 결과를 photoAnalysis에 반영
      if (visionAnalysis) {
        photoAnalysis.gender = visionAnalysis.gender;
        photoAnalysis.age_range = visionAnalysis.age_range;
        photoAnalysis.count = visionAnalysis.person_count || 0;
      }
      
      // 이미지에서 기본 정보 추출 시도 (카테고리별 가중치 테이블이 있는 경우)
      const categoryForWeight = selectedStyle.category;
      if (ARTIST_WEIGHTS[categoryForWeight]) {
        preSelectedArtist = selectArtistByWeight(categoryForWeight, photoAnalysis);
        if (preSelectedArtist) {
          // console.log(`🎲 [WEIGHT-BASED] Pre-selected artist: ${preSelectedArtist} (category: ${categoryForWeight})`);
          
          // ========================================
          // 🔴 B 방안: 성별에 맞지 않는 화가 필터링
          // ========================================
          if (visionAnalysis && visionAnalysis.gender) {
            const filterResult = filterArtistByGender(preSelectedArtist, visionAnalysis.gender, categoryForWeight);
            if (filterResult.filtered) {
              // console.log(`🚫 [GENDER-FILTER] ${filterResult.reason}`);
              // console.log(`🔄 [GENDER-FILTER] Suggesting: ${filterResult.suggestion}`);
              preSelectedArtist = filterResult.suggestion;
            }
          }
        }
      }
      
      if (aiResult.success) {
        // AI 성공!
        finalPrompt = aiResult.prompt;
        selectedArtist = aiResult.artist;
        selectedWork = aiResult.work;  // 거장 모드: 선택된 대표작
        selectionMethod = 'ai_auto';
        selectionDetails = {
          analysis: aiResult.analysis,
          reason: aiResult.reason
        };
        // console.log('✅✅✅ [V41-TEST-SUCCESS] AI selected:', selectedArtist);
        // console.log('✅✅✅ [V48] Selected work:', selectedWork);
        
        // v66: AI 선택 결과 로그 수집
        logData.selection.category = selectedStyle.category || '';
        logData.selection.artist = selectedArtist || '';
        logData.selection.masterwork = selectedWork || '';
        logData.selection.reason = aiResult.reason || '';
        
        // v70: 동양화 calligraphy_text 로그 추가
        if (selectedStyle.category === 'oriental' && aiResult.calligraphy_text) {
          logData.selection.calligraphy = aiResult.calligraphy_text;
        }
        
        // 반 고흐/뭉크 대표작 선택 결과 강조 로그
        const masterId = selectedStyle?.id?.replace('-master', '') || '';
        if (masterId === 'vangogh' || masterId === 'munch') {
          // console.log('');
          // console.log('🖼️🖼️🖼️ [V62.1] 대표작 선택 결과 🖼️🖼️🖼️');
          // console.log('   화가:', selectedArtist);
          // console.log('   선택된 작품:', selectedWork);
          // console.log('   선택 이유:', aiResult.reason);
          // console.log('🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️');
          // console.log('');
        }
        
        // ========================================
        // 🎯 대전제: AI 분석 후 가중치 기반 화가 재선택
        // ========================================
        const categoryForWeight = selectedStyle.category;
        if (ARTIST_WEIGHTS[categoryForWeight]) {
          // AI 분석 결과에서 사진 정보 추출
          const analysisText = (aiResult.analysis || '').toLowerCase();
          const photoAnalysisFromAI = {
            count: 0,
            subject: analysisText,
            gender: null,
            age: null,
            background: analysisText
          };
          
          // 🚨 Vision이 landscape/animal/object로 판단했으면 count=0 유지
          if (visionAnalysis && (visionAnalysis.subject_type === 'landscape' || 
                                  visionAnalysis.subject_type === 'animal' || 
                                  visionAnalysis.subject_type === 'object')) {
            photoAnalysisFromAI.count = 0;
            photoAnalysisFromAI.subject = visionAnalysis.subject_type;
            // console.log(`📸 [VISION-OVERRIDE] Subject is ${visionAnalysis.subject_type}, keeping count=0`);
          } else {
            // 인원수 추출 (인물 사진일 때만)
            if (analysisText.includes('group') || analysisText.includes('people') || analysisText.includes('family')) {
              photoAnalysisFromAI.count = 3;
            } else if (analysisText.includes('couple') || analysisText.includes('two') || analysisText.includes('pair')) {
              photoAnalysisFromAI.count = 2;
            } else if (analysisText.includes('person') || analysisText.includes('portrait') || analysisText.includes('face') || 
                       analysisText.includes('man') || analysisText.includes('woman') || analysisText.includes('child')) {
              photoAnalysisFromAI.count = 1;
            }
          }
          
          // 성별 추출
          if (analysisText.includes('woman') || analysisText.includes('female') || analysisText.includes('girl')) {
            photoAnalysisFromAI.gender = 'female';
          } else if (analysisText.includes('man') || analysisText.includes('male') || analysisText.includes('boy')) {
            photoAnalysisFromAI.gender = 'male';
          }
          
          // 나이 추출
          if (analysisText.includes('elderly') || analysisText.includes('old') || analysisText.includes('aged')) {
            photoAnalysisFromAI.age = 'elderly';
          }
          
          // 가중치 기반 화가 선택
          let weightSelectedArtist = selectArtistByWeight(categoryForWeight, photoAnalysisFromAI);
          
          // ========================================
          // 🔴 B 방안: 성별에 맞지 않는 화가 필터링 (가중치 선택 후)
          // ========================================
          if (weightSelectedArtist && visionAnalysis && visionAnalysis.gender) {
            const filterResult = filterArtistByGender(weightSelectedArtist, visionAnalysis.gender, categoryForWeight);
            if (filterResult.filtered) {
              // console.log(`🚫 [GENDER-FILTER] ${weightSelectedArtist} filtered: ${filterResult.reason}`);
              // console.log(`🔄 [GENDER-FILTER] Replacing with: ${filterResult.suggestion}`);
              weightSelectedArtist = filterResult.suggestion;
            }
          }
          
          if (weightSelectedArtist) {
            // console.log(`🎲 [WEIGHT-OVERRIDE] Changing from "${selectedArtist}" to "${weightSelectedArtist}"`);
            // console.log(`   Photo analysis: count=${photoAnalysisFromAI.count}, gender=${photoAnalysisFromAI.gender}, age=${photoAnalysisFromAI.age}`);
            
            // 화가 교체
            const oldArtist = selectedArtist;
            selectedArtist = weightSelectedArtist;
            selectionMethod = 'weight_random';
            selectionDetails.weightOverride = {
              original: oldArtist,
              selected: weightSelectedArtist,
              photoType: detectPhotoType(photoAnalysisFromAI)
            };
            
            // v66: 모든 사조 - artistStyles.js에서 통합 관리
            const artistStyle = getArtistStyleByName(weightSelectedArtist);
            
            if (artistStyle) {
              // subjectType 전달 (풍경/정물/동물일 때 인물 관련 프롬프트 제거)
              const subjectType = visionAnalysis ? visionAnalysis.subject_type : 'person';
              finalPrompt = artistStyle;
              // console.log(`🎨 [${categoryForWeight.toUpperCase()}] Applied ${weightSelectedArtist} style from artistStyles.js (subjectType: ${subjectType})`);
            } else {
              // 프롬프트 없는 화가: 기존 방식 (화가 이름만 교체)
              finalPrompt = finalPrompt.replace(new RegExp(oldArtist, 'gi'), weightSelectedArtist);
            }
            
            // 🚨 성별 감지 기반 강력한 프롬프트 삽입 (맨 앞)
            // E 방안: Vision 분석 결과가 있으면 더 상세한 프롬프트 사용
            let genderPrefix = '';
            
            // 풍경/정물/동물일 때는 성별 프롬프트 건너뛰기
            const isNonPerson = visionAnalysis && (
              visionAnalysis.subject_type === 'landscape' || 
              visionAnalysis.subject_type === 'animal' || 
              visionAnalysis.subject_type === 'object'
            );
            
            if (isNonPerson) {
              // console.log(`📸 [NON-PERSON] Subject is ${visionAnalysis.subject_type}, skipping gender prefix`);
              // 풍경/정물용 프롬프트
              genderPrefix = `CRITICAL: This is a ${visionAnalysis.subject_type.toUpperCase()} photo - DO NOT add any people or human figures. Keep as pure ${visionAnalysis.subject_type}. `;
              
              // 🎨 풍경/정물일 때 control_strength boost 플래그 설정 (마지막에 적용)
              landscapeStrengthBoost = true;
              
              // 🎨 [방법 C] 풍경일 때 프롬프트에서 사람 관련 표현 제거
              const originalPromptLength = finalPrompt.length;
              finalPrompt = finalPrompt
                // 들라크루아 - 사람/액션 관련
                .replace(/Liberty Leading the People style dramatic action,?\s*/gi, '')
                .replace(/dramatic gestures and heroic romantic intensity,?\s*/gi, 'dramatic romantic intensity, ')
                .replace(/heroic idealized figures in classical poses,?\s*/gi, '')
                .replace(/heroic idealized figures,?\s*/gi, '')
                // 다비드 - 영웅적 인물
                .replace(/heroic idealized figures in classical poses,?\s*/gi, '')
                // 밀레 - 농민
                .replace(/monumental peasant figures,?\s*/gi, '')
                .replace(/DIGNIFIED RURAL LABOR with monumental peasant figures,?\s*/gi, 'DIGNIFIED RURAL SCENE, ')
                // 마네 - 도시인물
                .replace(/sophisticated urban café society atmosphere,?\s*/gi, 'sophisticated urban atmosphere, ')
                .replace(/frank direct confrontational gaze,?\s*/gi, '')
                // 고야 - 시선/인물
                .replace(/penetrating gaze and inner truth revealed,?\s*/gi, '')
                .replace(/La Maja Vestida style Spanish elegance for portraits,?\s*/gi, '')
                .replace(/court painter sophistication with underlying tension,?\s*/gi, 'sophisticated composition with underlying tension, ')
                // 르누아르 - 살결
                .replace(/rosy pink flesh tones with pearly highlights,?\s*/gi, 'rosy pink tones with pearly highlights, ')
                .replace(/warm flesh tones,?\s*/gi, 'warm tones, ')
                // 로코코 - 귀족/인물
                .replace(/aristocratic.*?gathering,?\s*/gi, 'elegant gathering, ')
                .replace(/elegant figures in shimmering silk costumes,?\s*/gi, '')
                .replace(/theatrical graceful poses,?\s*/gi, 'theatrical graceful composition, ')
                // 인상주의 - 인물
                .replace(/elegant bourgeois figures in urban settings,?\s*/gi, 'elegant urban settings, ')
                .replace(/capturing movement and gesture,?\s*/gi, 'capturing movement, ')
                // 바로크 - 인물
                .replace(/intense emotional realism,?\s*/gi, 'intense emotional atmosphere, ')
                // 르네상스 - 인물
                .replace(/faces emerging from smoky darkness,?\s*/gi, 'forms emerging from smoky darkness, ')
                .replace(/idealized graceful figures,?\s*/gi, 'idealized graceful forms, ')
                .replace(/HEROIC SCULPTURAL FIGURES with powerful muscular anatomy,?\s*/gi, 'HEROIC SCULPTURAL FORMS, ')
                .replace(/elegant elongated figures,?\s*/gi, 'elegant elongated forms, ')
                // 야수파/표현주의 - 인물
                .replace(/simplified joyful forms,?\s*/gi, 'joyful forms, ')
                // 연속 쉼표/공백 정리
                .replace(/,\s*,/g, ',')
                .replace(/,\s*\./g, '.')
                .replace(/\s{2,}/g, ' ')
                .trim();
              
              // console.log(`🎨 [LANDSCAPE-FILTER] Removed human-related expressions: ${originalPromptLength} → ${finalPrompt.length} chars`);
            } else if (identityPrompt && identityPrompt.length > 0) {
              // Vision 분석 결과 사용 (더 상세함)
              genderPrefix = `ABSOLUTE REQUIREMENT: ${identityPrompt}. `;
              // console.log('🚨 Using Vision-based identity prompt');
            } else if (photoAnalysisFromAI.gender === 'male') {
              genderPrefix = 'ABSOLUTE REQUIREMENT: MALE subject - MUST have MASCULINE face with strong jaw, male bone structure, masculine features only, KEEP AS MAN. ';
              // console.log('🚨 Detected MALE - Added MASCULINE enforcement');
            } else if (photoAnalysisFromAI.gender === 'female') {
              genderPrefix = 'ABSOLUTE REQUIREMENT: FEMALE subject - MUST have FEMININE face with soft features, female bone structure, KEEP AS WOMAN. ';
              // console.log('🚨 Detected FEMALE - Added FEMININE enforcement');
            } else if (photoAnalysisFromAI.gender === 'both' || (visionAnalysis && visionAnalysis.gender === 'both')) {
              genderPrefix = 'ABSOLUTE REQUIREMENT: MIXED GENDER GROUP - MALE figures MUST remain MASCULINE with strong jaw and male bone structure, FEMALE figures MUST remain FEMININE with soft features, each person keeps original gender exactly. ';
              // console.log('🚨 Detected BOTH genders - Added MIXED preservation rule');
            } else {
              // v68: 성별 미감지 - 대전제에서 처리 (중복 제거)
              genderPrefix = '';
            }
            
            // v68: genderPrefix는 뒤에서 genderPrefixCommon으로 통합 처리
            if (genderPrefix) {
              finalPrompt = finalPrompt + ' ' + genderPrefix;
            }
            logData.prompt.applied.gender = true;
            
            // ========================================
            // 🚫 환각 방지: 원본 요소만 유지
            // ========================================
            let antiHallucinationRule = ' STRICT COMPOSITION: Keep ONLY elements from original photo. ';
            
            if (visionAnalysis) {
              const count = visionAnalysis.person_count;
              const subjectType = visionAnalysis.subject_type;
              
              if (subjectType === 'person' && count) {
                if (count === 1) {
                  antiHallucinationRule += 'Maintain EXACTLY 1 PERSON only, background must stay empty of people. ';
                } else if (count === 2) {
                  antiHallucinationRule += 'Maintain EXACTLY 2 PEOPLE only, background must stay empty of additional people. ';
                } else {
                  antiHallucinationRule += `Maintain EXACTLY ${count} PEOPLE only, background must stay empty of additional people. `;
                }
              } else if (subjectType === 'landscape') {
                antiHallucinationRule += 'LANDSCAPE only, keep scene free of people and figures. ';
              } else if (subjectType === 'animal') {
                antiHallucinationRule += 'ANIMAL photo only, keep scene free of humans. ';
              } else if (subjectType === 'object') {
                antiHallucinationRule += 'OBJECT/STILL LIFE only, keep scene free of people. ';
              }
              
              antiHallucinationRule += 'Keep composition faithful to original photo.';
            }
            
            finalPrompt = finalPrompt + antiHallucinationRule;
            // console.log('🚫 Anti-hallucination rule added:', antiHallucinationRule);
            
            // console.log(`✅ [WEIGHT-BASED] Final artist: ${selectedArtist}`);
          }
        }
        // ========================================
        // 끝: 가중치 기반 화가 재선택
        // ========================================
        
        // ========================================
        // v67: 대전제 - 스타일별 분기 (고대/중세는 유화 아님)
        // ========================================
        
        // 고대/중세 스타일 체크
        const isAncientStyle = categoryType === 'ancient' || 
          (selectedArtist && (selectedArtist.toUpperCase().includes('SCULPTURE') || 
           selectedArtist.toUpperCase().includes('CLASSICAL') || 
           selectedArtist.toUpperCase().includes('MOSAIC') ||
           selectedArtist.toUpperCase().includes('MARBLE')));
        
        const isMedievalStyle = categoryType === 'medieval' || 
          (selectedArtist && (selectedArtist.toUpperCase().includes('BYZANTINE') || 
           selectedArtist.toUpperCase().includes('GOTHIC') || 
           selectedArtist.toUpperCase().includes('ISLAMIC')));
        
        // v67: 피카소/입체주의 체크
        const isPicassoCubist = selectedArtist && (
          selectedArtist.toUpperCase().includes('PICASSO') || 
          selectedArtist.toUpperCase().includes('피카소') ||
          selectedArtist.toUpperCase().includes('CUBIST') ||
          selectedArtist.toUpperCase().includes('CUBISM'));
        
        // v67: 동양화 체크
        const isOrientalStyle = categoryType === 'oriental' || 
          (selectedArtist && (
            selectedArtist.toUpperCase().includes('MINHWA') || 
            selectedArtist.toUpperCase().includes('민화') ||
            selectedArtist.toUpperCase().includes('PUNGSOKDO') || 
            selectedArtist.toUpperCase().includes('풍속도') ||
            selectedArtist.toUpperCase().includes('JINGYEONG') ||
            selectedArtist.toUpperCase().includes('진경') ||
            selectedArtist.toUpperCase().includes('SHUIMOHUA') ||
            selectedArtist.toUpperCase().includes('수묵') ||
            selectedArtist.toUpperCase().includes('GONGBI') ||
            selectedArtist.toUpperCase().includes('공필') ||
            selectedArtist.toUpperCase().includes('HUANIAOHUA') ||
            selectedArtist.toUpperCase().includes('화조') ||
            selectedArtist.toUpperCase().includes('UKIYOE') ||
            selectedArtist.toUpperCase().includes('우키요에') ||
            selectedArtist.toUpperCase().includes('KOREAN') ||
            selectedArtist.toUpperCase().includes('CHINESE') ||
            selectedArtist.toUpperCase().includes('JAPANESE')));
        
        // ========================================
        // v68: 순서 변경
        // [화풍 + 대표작] + [대전제] + [성별] + [매력]
        // 대전제와 성별은 대표작 적용 후에 추가 (아래에서 처리)
        // ========================================
        // v68.3: coreRulesPrefix는 handler 시작에서 초기화됨
        
        // v68.2: 피부색 변환이 화풍 핵심인 작가들 (ethnicity 보존 제외)
        const skinColorTransformArtists = ['gauguin', 'matisse', 'derain', 'vlaminck'];
        const artistLower = (selectedArtist || '').toLowerCase();
        const skipEthnicityPreserve = skinColorTransformArtists.some(a => artistLower.includes(a));
        
        // v70: 샤갈 - 환영 허용 (원본만 그리기 제외)
        const allowExtraImagery = artistLower.includes('chagall') || artistLower.includes('샤갈');
        
        // ========================================
        // v68 대전제 (긍정 명령어로 통일)
        // FLUX는 부정어 미지원 → 긍정형으로 변환
        // ========================================
        let CORE_RULES_BASE;
        if (skipEthnicityPreserve) {
          // 고갱/마티스/드랭/블라맹크: 피부색 변환이 화풍이라 ethnicity 제외
          CORE_RULES_BASE = 'Female nipples MUST be covered by clothing. ' +
            'Preserve identity, gender exactly. ' +
            'Keep only original elements from photo.';
        } else if (allowExtraImagery) {
          // 샤갈: 환영/꿈 이미지 허용 (원본만 규칙 제외)
          CORE_RULES_BASE = 'Female nipples MUST be covered by clothing. ' +
            'Preserve identity, gender, ethnicity exactly.';
        } else {
          // 기본값
          CORE_RULES_BASE = 'Female nipples MUST be covered by clothing. ' +
            'Preserve identity, gender, ethnicity exactly. ' +
            'Keep only original elements from photo.';
        }
        
        if (isOrientalStyle) {
          // 동양화 - 낙관/시문 허용
          coreRulesPrefix = CORE_RULES_BASE + ' ';
        } else {
          // 서양화 - 텍스트 없는 깨끗한 화면
          coreRulesPrefix = CORE_RULES_BASE + ' Clean artwork, text-free, signature-free, watermark-free. ';
        }
        
        // v68: 성별 보존 프롬프트 (간소화) - 나중에 적용
        // v68.3: genderPrefixCommon은 handler 시작에서 초기화됨
        
        // 풍경/정물/동물일 때는 성별 프롬프트 건너뛰기
        const isNonPersonSubject = visionAnalysis && (
          visionAnalysis.subject_type === 'landscape' || 
          visionAnalysis.subject_type === 'animal' || 
          visionAnalysis.subject_type === 'object'
        );
        
        if (isNonPersonSubject) {
          genderPrefixCommon = `This is a ${visionAnalysis.subject_type} - no people. `;
        } else if (identityPrompt && identityPrompt.length > 0) {
          genderPrefixCommon = `${identityPrompt}. `;
        } else if (visionAnalysis && visionAnalysis.gender === 'male') {
          genderPrefixCommon = 'MALE subject with masculine features. ';
        } else if (visionAnalysis && visionAnalysis.gender === 'female') {
          genderPrefixCommon = 'FEMALE subject with feminine features. ';
        } else if (visionAnalysis && visionAnalysis.gender === 'both') {
          genderPrefixCommon = 'Mixed gender group - preserve each gender. ';
        }
        // 대전제와 성별은 대표작 적용 후 아래에서 추가됨
        
        // ========================================
        // v62: 거장 대표작별 세부 프롬프트 적용
        // v64: 고흐/뭉크/마티스는 masterworks 사용
        // ========================================
        if (categoryType === 'masters' && selectedWork) {
          // console.log('🎨 [V62] Masters mode - applying masterwork enhancement');
          // console.log('   Artist:', selectedArtist);
          // console.log('   Work:', selectedWork);
          
          // 대표작 키 변환 (예: "KLIMT" + "The Kiss" → "klimt-kiss")
          const workKey = convertToWorkKey(selectedArtist, selectedWork);
          // console.log('   WorkKey:', workKey);
          
          if (workKey) {
            const artistKey = workKey.split('-')[0];
            
            // v70: 거장 7명 모두 masterworks에서 가져오기
            if (['vangogh', 'munch', 'klimt', 'matisse', 'chagall', 'frida', 'lichtenstein'].includes(artistKey)) {
              const movementMasterwork = getMovementMasterwork(workKey);
              if (movementMasterwork) {
                console.log('');
                console.log('🎨🎨🎨 거장 대표작 매칭 🎨🎨🎨');
                console.log('   👤 화가:', selectedArtist);
                console.log('   🖼️ 대표작:', movementMasterwork.name, `(${movementMasterwork.nameEn})`);
                console.log('   📝 특징:', movementMasterwork.feature);
                console.log('');
                
                // v66: 화가 프롬프트 먼저 (artistStyles.js)
                const artistStylePrompt1 = getArtistStyle(artistKey);
                if (artistStylePrompt1) {
                  finalPrompt = finalPrompt + ', ' + artistStylePrompt1;
                  logData.prompt.applied.artist = true;
                  // console.log('🎨 [v66] 화가 프롬프트 적용:', artistKey);
                }
                
                // 대표작 프롬프트 (우선)
                finalPrompt = finalPrompt + ', ' + movementMasterwork.prompt;
                logData.prompt.applied.masterwork = true;
                // console.log('🖼️ [v65] 대표작 프롬프트 적용:', movementMasterwork.nameEn);
                
                // expressionRule 적용 (뭉크 등)
                if (movementMasterwork.expressionRule) {
                  finalPrompt = finalPrompt + ', ' + movementMasterwork.expressionRule;
                  // console.log('🎭 [v65] Applied expressionRule:', movementMasterwork.expressionRule);
                }
              } else {
                console.log('⚠️ 대표작 매칭 실패:', workKey);
              }
            }
            
            // v66: artistEnhancements.js 삭제됨
            // 피카소/프리다/워홀 등은 대표작 매칭 없이 화풍만 적용 (artistStyles.js)
          }
        }
        
        // ========================================
        // v64: 사조 모드 대표작 매칭 시스템
        // ========================================
        if (categoryType !== 'masters' && categoryType !== 'oriental') {
          // 화가명 → artistKey 변환
          const artistNameToKey = {
            // 스타일
            'roman mosaic': 'roman-mosaic', 'mosaic': 'roman-mosaic',
            'gothic': 'gothic', 'stained glass': 'gothic',
            'byzantine': 'byzantine', '비잔틴': 'byzantine',
            'islamic miniature': 'islamic-miniature', 'islamic': 'islamic-miniature', '이슬람': 'islamic-miniature', '이슬람 세밀화': 'islamic-miniature',
            // 르네상스
            'botticelli': 'botticelli', 'sandro botticelli': 'botticelli',
            'leonardo': 'leonardo', 'leonardo da vinci': 'leonardo', 'da vinci': 'leonardo',
            'titian': 'titian', 'tiziano': 'titian',
            'michelangelo': 'michelangelo',
            'raphael': 'raphael', 'raffaello': 'raphael',
            // 바로크
            'caravaggio': 'caravaggio',
            'rubens': 'rubens', 'peter paul rubens': 'rubens',
            'rembrandt': 'rembrandt', 'rembrandt van rijn': 'rembrandt',
            'velázquez': 'velazquez', 'velazquez': 'velazquez', 'diego velázquez': 'velazquez',
            // 로코코
            'watteau': 'watteau', 'antoine watteau': 'watteau',
            'boucher': 'boucher', 'françois boucher': 'boucher',
            // 신고전/낭만/사실
            'david': 'david', 'jacques-louis david': 'david',
            'ingres': 'ingres',
            'turner': 'turner', 'j.m.w. turner': 'turner',
            'delacroix': 'delacroix', 'eugène delacroix': 'delacroix',
            'courbet': 'courbet', 'gustave courbet': 'courbet',
            'manet': 'manet', 'édouard manet': 'manet',
            // 인상주의
            'renoir': 'renoir', 'pierre-auguste renoir': 'renoir',
            'degas': 'degas', 'edgar degas': 'degas',
            'monet': 'monet', 'claude monet': 'monet',
            'caillebotte': 'caillebotte', 'gustave caillebotte': 'caillebotte',
            // 후기인상주의
            'van gogh': 'vangogh', 'vincent van gogh': 'vangogh', 'vangogh': 'vangogh',
            'gauguin': 'gauguin', 'paul gauguin': 'gauguin',
            'cézanne': 'cezanne', 'cezanne': 'cezanne', 'paul cézanne': 'cezanne',
            // 야수파
            'matisse': 'matisse', 'henri matisse': 'matisse',
            'derain': 'derain', 'andré derain': 'derain',
            'vlaminck': 'vlaminck', 'maurice de vlaminck': 'vlaminck',
            // 표현주의
            'munch': 'munch', 'edvard munch': 'munch',
            'kokoschka': 'kokoschka', 'oskar kokoschka': 'kokoschka',
            'kirchner': 'kirchner', 'ernst ludwig kirchner': 'kirchner',
            // 모더니즘 (피카소/프리다 포함)
            'picasso': 'picasso', 'pablo picasso': 'picasso',
            'frida': 'frida', 'frida kahlo': 'frida',
            'magritte': 'magritte', 'rené magritte': 'magritte', 'rene magritte': 'magritte',
            'miro': 'miro', 'miró': 'miro', 'joan miro': 'miro', 'joan miró': 'miro',
            'chagall': 'chagall', 'marc chagall': 'chagall',
            'lichtenstein': 'lichtenstein', 'roy lichtenstein': 'lichtenstein'
          };
          
          const artistLower = selectedArtist.toLowerCase().trim();
          const artistKey = artistNameToKey[artistLower];
          
          if (artistKey) {
            const masterworkList = getArtistMasterworkList(artistKey);
            if (masterworkList && masterworkList.length > 0) {
              // v67: AI가 선택한 대표작 사용 (랜덤 대신)
              let selectedMasterworkKey = null;
              let masterwork = null;
              
              // AI가 대표작을 선택했으면 그것 사용
              if (selectedWork) {
                selectedMasterworkKey = convertToWorkKey(selectedArtist, selectedWork);
                if (selectedMasterworkKey) {
                  masterwork = getMovementMasterwork(selectedMasterworkKey);
                }
              }
              
              // AI 선택이 없거나 찾을 수 없으면 fallback으로 랜덤 선택
              if (!masterwork) {
                const randomIndex = Math.floor(Math.random() * masterworkList.length);
                selectedMasterworkKey = masterworkList[randomIndex];
                masterwork = getMovementMasterwork(selectedMasterworkKey);
                console.log('⚠️ AI 대표작 선택 없음, 랜덤 fallback:', selectedMasterworkKey);
              }
              
              if (masterwork) {
                console.log('');
                console.log('🎨🎨🎨 사조 대표작 매칭 🎨🎨🎨');
                console.log('   👤 화가:', selectedArtist);
                console.log('   🤖 AI 선택:', selectedWork || '(없음 - 랜덤)');
                console.log('   🖼️ 적용 대표작:', masterwork.name, `(${masterwork.nameEn})`);
                console.log('   📝 특징:', masterwork.feature);
                console.log('');
                
                // v66: 화가 프롬프트 먼저 (artistStyles.js)
                const artistStylePrompt2 = getArtistStyle(artistKey);
                if (artistStylePrompt2) {
                  finalPrompt = finalPrompt + ', ' + artistStylePrompt2;
                  logData.prompt.applied.artist = true;
                  // console.log('🎨 [v66] 화가 프롬프트 적용:', artistKey);
                }
                
                // 대표작 프롬프트 (우선)
                finalPrompt = finalPrompt + ', ' + masterwork.prompt;
                logData.prompt.applied.masterwork = true;
                // console.log('🖼️ [v67] 대표작 프롬프트 적용:', masterwork.nameEn);
              }
            }
          }
        }
        
        // ========================================
        // v65: 리히텐슈타인 말풍선 추가
        // ========================================
        if (selectedArtist.toUpperCase().trim().includes('LICHTENSTEIN') || 
            selectedArtist.includes('리히텐슈타인')) {
          console.log('🎯 Lichtenstein detected - adding speech bubble...');
          
          // 말풍선 텍스트 선택 (사진 분석 결과 기반)
          const speechText = selectSpeechBubbleText(visionAnalysis);
          console.log(`💬 Speech bubble text: "${speechText}"`);
          
          // 프롬프트에 말풍선 + 스타일 강화 추가
          if (!finalPrompt.includes('speech bubble')) {
            finalPrompt = finalPrompt + `, WHITE SPEECH BUBBLE with THICK BLACK OUTLINE containing ONLY text "${speechText}" in BOLD COMIC FONT, EXTREMELY LARGE Ben-Day dots 15mm+ halftone pattern on ALL skin and surfaces, ULTRA THICK BLACK OUTLINES 20mm+, COMIC PANEL FRAME with THICK BLACK BORDER around entire image`;
          }
        }
        
      } else {
        // AI 실패 → Fallback
        // console.log('⚠️ AI failed, using fallback');
        
        let fallbackKey = selectedStyle.category;
        
        if (selectedStyle.category === 'movements') {
          // 미술사조: id를 사용 (renaissance, baroque, impressionism 등)
          fallbackKey = selectedStyle.id;
          
          // v66: 누락된 fallback 키 매핑
          const fallbackKeyMap = {
            'neoclassicism': 'neoclassicism_vs_romanticism_vs_realism',
            'romanticism': 'neoclassicism_vs_romanticism_vs_realism',
            'realism': 'neoclassicism_vs_romanticism_vs_realism',
            'artNouveau': 'fauvism'  // 아르누보 → 야수파로 매핑 (유사한 장식적 스타일)
          };
          if (fallbackKeyMap[fallbackKey]) {
            fallbackKey = fallbackKeyMap[fallbackKey];
          }
        } else if (selectedStyle.category === 'masters') {
          fallbackKey = selectedStyle.id.replace('-master', '');
        } else if (selectedStyle.category === 'oriental') {
          fallbackKey = selectedStyle.id;
        }
        
        // console.log('Using fallback key:', fallbackKey);
        const fallback = fallbackPrompts[fallbackKey];
        
        if (!fallback) {
          console.error('ERROR: No fallback found for key:', fallbackKey);
          console.error('Available categories:', Object.keys(fallbackPrompts));
          throw new Error(`No fallback prompt for: ${fallbackKey}`);
        }
        
        finalPrompt = fallback.prompt;
        selectedArtist = fallback.name;
        selectedWork = fallback.defaultWork || null;  // 거장 기본 작품
        selectionMethod = 'fallback';
        selectionDetails = {
          ai_error: aiResult.error
        };
        
        // v68.3: fallback에서도 로그 데이터 설정
        logData.selection.category = selectedStyle.category || '';
        logData.selection.movement = selectedStyle.id || '';
        logData.selection.artist = selectedArtist || '';
        logData.selection.masterwork = selectedWork || '';
        logData.prompt.applied.artist = true;
        if (selectedWork) logData.prompt.applied.masterwork = true;
        // fallback 프롬프트에 포함된 요소들 플래그
        if (fallback.prompt.includes('BRUSHSTROKE') || fallback.prompt.includes('brushstroke')) {
          logData.prompt.applied.brushwork = true;
        }
        if (fallback.prompt.includes('painting') || fallback.prompt.includes('PAINTING')) {
          logData.prompt.applied.painting = true;
        }
        
        // Renaissance fallback도 control_strength 0.65
        if (fallbackKey === 'renaissance') {
          // console.log('✅ Renaissance fallback: control_strength 0.65');
        }
      }
    } else {
      // ANTHROPIC_API_KEY 없음 → Fallback
      // console.log('ℹ️ No AI key, using fallback');
      
      let fallbackKey = selectedStyle.category;
      
      if (selectedStyle.category === 'movements') {
        // 미술사조: id를 사용 (renaissance, baroque, impressionism 등)
        fallbackKey = selectedStyle.id;
        
        // v66: 누락된 fallback 키 매핑
        const fallbackKeyMap = {
          'neoclassicism': 'neoclassicism_vs_romanticism_vs_realism',
          'romanticism': 'neoclassicism_vs_romanticism_vs_realism',
          'realism': 'neoclassicism_vs_romanticism_vs_realism',
          'artNouveau': 'fauvism'  // 아르누보 → 야수파로 매핑 (유사한 장식적 스타일)
        };
        if (fallbackKeyMap[fallbackKey]) {
          fallbackKey = fallbackKeyMap[fallbackKey];
        }
      } else if (selectedStyle.category === 'masters') {
        fallbackKey = selectedStyle.id.replace('-master', '');
      } else if (selectedStyle.category === 'oriental') {
        fallbackKey = selectedStyle.id;
      }
      
      // console.log('Using fallback key:', fallbackKey);
      const fallback = fallbackPrompts[fallbackKey];
      
      if (!fallback) {
        console.error('ERROR: No fallback found for key:', fallbackKey);
        console.error('Available categories:', Object.keys(fallbackPrompts));
        throw new Error(`No fallback prompt for: ${fallbackKey}`);
      }
      
      finalPrompt = fallback.prompt;
      selectedArtist = fallback.name;
      selectedWork = fallback.defaultWork || null;  // 거장 기본 작품
      selectionMethod = 'fallback_no_key';
      
      // v68.3: fallback에서도 로그 데이터 설정
      logData.selection.category = selectedStyle.category || '';
      logData.selection.movement = selectedStyle.id || '';
      logData.selection.artist = selectedArtist || '';
      logData.selection.masterwork = selectedWork || '';
      logData.prompt.applied.artist = true;
      if (selectedWork) logData.prompt.applied.masterwork = true;
      if (fallback.prompt.includes('BRUSHSTROKE') || fallback.prompt.includes('brushstroke')) {
        logData.prompt.applied.brushwork = true;
      }
      if (fallback.prompt.includes('painting') || fallback.prompt.includes('PAINTING')) {
        logData.prompt.applied.painting = true;
      }
      
      // Renaissance fallback (no key)도 control_strength 0.65
      if (fallbackKey === 'renaissance') {
        // console.log('✅ Renaissance fallback (no key): control_strength 0.65');
      }
    }

    // console.log('Final prompt:', finalPrompt);
    
    // ========================================
    // PicoArt 핵심 원칙: Level 3 회화 강조 + 다시 그리기 + 얼굴 보존
    // ========================================
    
    // 동양 미술 체크 (한국/중국)
    const isOrientalArt = finalPrompt.toLowerCase().includes('korean') || 
                          finalPrompt.toLowerCase().includes('chinese') ||
                          categoryType === 'oriental';
    
    // 모자이크는 타일(tesserae)로 만드는 것이므로 brushstrokes 제외
    const isMosaic = finalPrompt.toLowerCase().includes('mosaic') || 
                     finalPrompt.toLowerCase().includes('tesserae');
    
    // 점묘법은 점(dots)으로 만드는 것이므로 brushstrokes 완전 금지
    const isPointillism = finalPrompt.toLowerCase().includes('pointillist') ||
                          finalPrompt.toLowerCase().includes('pointillism');
    
    // v68.2: 샌드위치 삭제 - 긍정 표현으로 충분
    
    // ========================================
    // 20세기 모더니즘: 대전제 적용 제외!
    // (얼굴 분해, 복제, 녹아내림 등 허용 위해)
    // ========================================
    
    // ========================================
    // 매력적 표현 대전제 (Attractive Enhancement)
    // 고통/왜곡이 핵심인 작품은 제외
    // ========================================
    const excludeAttractive = [
      'munch-scream',      // 절규 - 공포/불안 왜곡
      'picasso-guernica',  // 게르니카 - 전쟁 참상
      'picasso-weepingwoman', // 우는 여인 - 슬픔 왜곡
      'frida-brokencolumn' // 부러진 기둥 - 고통 시각화
    ];
    
    // v66: artistEnhancements.js 삭제됨 - excludeAttractive 리스트만 사용
    const workKey = categoryType === 'masters' && selectedWork ? 
      convertToWorkKey(selectedArtist, selectedWork) : null;
    const hasAttractiveException = excludeAttractive.includes(workKey);
    
    const shouldApplyAttractive = !hasAttractiveException;
    
    // ========================================
    // v71: 붓터치 크기 적용 (화풍 바로 다음, 대전제 앞)
    // 순서: [화풍 + 대표작] + [붓터치] + [대전제] + [성별] + [매력]
    // ========================================
    const brushSize = getBrushstrokeSize(selectedArtist, selectedStyle.id, categoryType);
    if (brushSize) {
      // 기존 붓터치 명령어 모두 제거 후 새로 추가
      finalPrompt = finalPrompt
        .replace(/,?\s*VISIBLE THICK BRUSHSTROKES \d+mm\+?/gi, '')
        .replace(/,?\s*VISIBLE THICK OIL PAINT BRUSHSTROKES \(\d+mm\+?[^)]*\)?/gi, '')
        .replace(/,?\s*VISIBLE BRUSH TEXTURE \d+mm\+?/gi, '')
        .replace(/,?\s*VISIBLE INK BRUSH TEXTURE \d+mm\+?/gi, '')
        .replace(/,?\s*THICK BRUSHSTROKES \d+mm\+?/gi, '')
        .replace(/,?\s*VISIBLE BRUSHSTROKES \d+mm\+?/gi, '')
        .replace(/,?\s*CHUNKY WIDE BRUSH MARKS \(\d+mm\+?[^)]*\)?/gi, '')
        .replace(/,?\s*TURBULENT VISIBLE BRUSHSTROKES \d+mm\+?/gi, '')
        .replace(/,?\s*LARGE VISIBLE DOTS \d+mm[^,]*/gi, '')
        .replace(/,?\s*VISIBLE WOODBLOCK PRINT TEXTURE \d+mm\+?/gi, '')
        .replace(/,?\s*ROUGH THICK OIL PAINT TEXTURE,?\s*/gi, '');
      finalPrompt = finalPrompt + `, ROUGH THICK OIL PAINT TEXTURE, VISIBLE THICK BRUSHSTROKES ${brushSize}+`;
      logData.prompt.applied.brushwork = true;
    } else {
      // brush가 null인 경우 (동양화, 팝아트 등) - 기존 붓터치 명령어만 제거
      finalPrompt = finalPrompt
        .replace(/,?\s*VISIBLE THICK BRUSHSTROKES \d+mm\+?/gi, '')
        .replace(/,?\s*VISIBLE THICK OIL PAINT BRUSHSTROKES \(\d+mm\+?[^)]*\)?/gi, '')
        .replace(/,?\s*VISIBLE BRUSH TEXTURE \d+mm\+?/gi, '')
        .replace(/,?\s*VISIBLE INK BRUSH TEXTURE \d+mm\+?/gi, '')
        .replace(/,?\s*THICK BRUSHSTROKES \d+mm\+?/gi, '')
        .replace(/,?\s*VISIBLE BRUSHSTROKES \d+mm\+?/gi, '')
        .replace(/,?\s*CHUNKY WIDE BRUSH MARKS \(\d+mm\+?[^)]*\)?/gi, '')
        .replace(/,?\s*TURBULENT VISIBLE BRUSHSTROKES \d+mm\+?/gi, '')
        .replace(/,?\s*VISIBLE WOODBLOCK PRINT TEXTURE \d+mm\+?/gi, '')
        .replace(/,?\s*ROUGH THICK OIL PAINT TEXTURE,?\s*/gi, '');
    }

    // ========================================
    // v68: 대전제 + 성별 추가 (화풍+대표작 뒤에)
    // 순서: [화풍 + 대표작] + [붓터치] + [대전제] + [성별] + [매력]
    // ========================================
    finalPrompt = finalPrompt + ' ' + coreRulesPrefix;
    logData.prompt.applied.coreRules = true;
    
    if (genderPrefixCommon) {
      finalPrompt = finalPrompt + genderPrefixCommon;
    }
    logData.prompt.applied.gender = true;
    
    // ========================================
    // v68: 매력 조항 (간소화)
    // ========================================
    if (shouldApplyAttractive) {
      const attractiveEnhancement = ' Render stunningly beautiful - male as handsome, dignified; female as gorgeous, elegant, graceful. Idealized flattering portrait.';
      finalPrompt = finalPrompt + attractiveEnhancement;
      logData.prompt.applied.attractive = true;
    }
    
    // ========================================
    // v68: 텍스트 금지 (서양화만)
    // ========================================
    const promptLower = finalPrompt.toLowerCase();
    
    // 동양화 체크 (텍스트 허용)
    const isOriental = promptLower.includes('minhwa') || 
      promptLower.includes('pungsokdo') ||
      promptLower.includes('jingyeong') ||
      promptLower.includes('shuimohua') ||
      promptLower.includes('gongbi') ||
      promptLower.includes('huaniaohua') ||
      promptLower.includes('ukiyoe') ||
      promptLower.includes('ink wash') ||
      promptLower.includes('korean folk') ||
      promptLower.includes('korean genre');
    
    // v68: 텍스트 금지는 대전제에서 처리 (서양화만)
    
    // ========================================
    // v68: 붓터치 제외 조건 (skipBrushstrokeRules)
    // ========================================
    const isMosaicStyle = promptLower.includes('mosaic') || promptLower.includes('tesserae');
    const isPointillismStyle = promptLower.includes('pointillist');
    const isSculpture = promptLower.includes('sculpture') || promptLower.includes('marble');
    const isByzantine = promptLower.includes('byzantine');
    const isGothicGlass = promptLower.includes('stained glass') || promptLower.includes('gothic');
    const isPicasso = promptLower.includes('picasso') || promptLower.includes('cubist');
    const isIslamicMiniature = promptLower.includes('persian miniature') ||
      promptLower.includes('islamic miniature') ||
      promptLower.includes('ottoman');
    
    const skipBrushstrokeRules = isMosaicStyle || isPointillismStyle || 
      isSculpture || isByzantine || isGothicGlass || isPicasso || 
      isOriental || isIslamicMiniature;
    
    // v68.2: 샌드위치 삭제됨 (대전제+화풍에서 커버)
    
    // ========================================
    // v66: 구조화된 콘솔 로그 출력
    // ========================================
    
    // v70: 최종 control_strength 설정 (모든 분기 완료 후)
    controlStrength = getControlStrength(selectedArtist, selectedStyle.id, categoryType);
    // console.log(`📊 Final control_strength: ${controlStrength} (artist: ${selectedArtist})`);
    
    // 풍경/정물일 때 boost 적용 (이미 landscapeStrengthBoost가 true면)
    if (landscapeStrengthBoost) {
      const originalStrength = controlStrength;
      controlStrength = Math.min(controlStrength + 0.15, 0.90);
      // console.log(`📊 [LANDSCAPE-BOOST] control_strength: ${originalStrength} → ${controlStrength}`);
    }
    
    logData.prompt.wordCount = finalPrompt.split(/\s+/).length;
    logData.flux.control = controlStrength;
    // v70: 프론트엔드 콘솔용 추가 정보
    const artistKey = normalizeArtistKey(selectedArtist);
    const configSource = ARTIST_CONFIG[artistKey] ? 'ARTIST_CONFIG' : (MOVEMENT_DEFAULTS[selectedStyle?.id] ? 'MOVEMENT_DEFAULTS' : 'DEFAULT');
    logData.flux.mapping = `"${selectedArtist}" → "${artistKey}" (${configSource})`;
    logData.flux.brush = brushSize || 'none';
    logData.flux.boost = landscapeStrengthBoost;
    
    // 사조 정보 추출 (movements 카테고리인 경우)
    if (selectedStyle.category === 'movements' && selectedStyle.id) {
      const movementMap = {
        'ancient': '고대', 
        'medieval': '중세', 
        'renaissance': '르네상스', 
        'baroque': '바로크',
        'rococo': '로코코', 
        'neoclassicism': '신고전주의', 
        'romanticism': '낭만주의', 
        'realism': '사실주의',
        'neoclassicism_vs_romanticism_vs_realism': '신고전 vs 낭만 vs 사실주의',
        'impressionism': '인상주의', 
        'postImpressionism': '후기인상주의', 
        'fauvism': '야수파',
        'expressionism': '표현주의', 
        'artNouveau': '아르누보',
        'modernism': '20세기 모더니즘'
      };
      logData.selection.movement = movementMap[selectedStyle.id] || selectedStyle.name || '';
    }
    
    const appliedList = Object.entries(logData.prompt.applied)
      .map(([key, val]) => val ? `${key}✓` : `${key}✗`)
      .join(' ');
    
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📍 FLUX Transfer v66');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('1️⃣ Vision 분석');
    console.log(`   👤 인물: ${logData.vision.count}명 (${logData.vision.gender || '?'}, ${logData.vision.age || '?'})`);
    console.log(`   📷 피사체: ${logData.vision.subjectType || 'unknown'}`);
    console.log('');
    console.log('2️⃣ AI 화가 선택');
    console.log(`   📂 카테고리: ${logData.selection.category}`);
    if (logData.selection.movement) console.log(`   🎨 사조: ${logData.selection.movement}`);
    console.log(`   👨‍🎨 화가: ${logData.selection.artist}`);
    if (logData.selection.masterwork) console.log(`   🖼️ 대표작: ${logData.selection.masterwork}`);
    if (logData.selection.calligraphy) console.log(`   ✍️ 서예: ${logData.selection.calligraphy}`);
    if (logData.selection.reason) console.log(`   💬 선택 이유: ${logData.selection.reason}`);
    console.log('');
    console.log('3️⃣ 프롬프트 조립');
    console.log(`   📝 최종 길이: ${logData.prompt.wordCount} 단어`);
    console.log(`   ${appliedList}`);
    console.log('');
    console.log('4️⃣ FLUX API 호출');
    console.log(`   🔄 모델: ${logData.flux.model}`);
    console.log(`   🎯 매핑: ${logData.flux.mapping}`);
    console.log(`   ⚙️ Control: ${logData.flux.control}${landscapeStrengthBoost ? ' (풍경 +0.15 boost)' : ''}`);
    console.log(`   🖌️ Brush: ${brushSize || 'none'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    
    // v70: FLUX에 전달되는 실제 프롬프트 로그
    console.log('📜 FLUX 프롬프트 (처음 500자):');
    console.log(`   ${finalPrompt.substring(0, 500)}...`);
    console.log('');
    
    // FLUX Depth Dev 변환 - 재시도 로직 포함
    const MAX_RETRIES = 3;
    let response;
    let lastError;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        response = await fetch(
          'https://api.replicate.com/v1/models/black-forest-labs/flux-depth-dev/predictions',
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'wait'
            },
            body: JSON.stringify({
              input: {
                control_image: image,
                prompt: finalPrompt,
                num_inference_steps: 24,
                guidance: 12,
                control_strength: controlStrength,
                output_format: 'jpg',
                output_quality: 90
              }
            })
          }
        );
        
        // 502/503 에러 시 재시도
        if (response.status === 502 || response.status === 503) {
          console.log(`🔄 FLUX Depth 재시도 (${attempt}/${MAX_RETRIES})... ${response.status} 에러`);
          if (attempt < MAX_RETRIES) {
            await new Promise(r => setTimeout(r, 2000 * attempt)); // 2초, 4초 대기
            continue;
          }
        }
        
        // 성공 또는 다른 에러면 루프 탈출
        break;
      } catch (err) {
        lastError = err;
        console.log(`🔄 FLUX Depth 재시도 (${attempt}/${MAX_RETRIES})... 네트워크 에러`);
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 2000 * attempt));
          continue;
        }
      }
    }

    if (!response || !response.ok) {
      const errorText = await response.text();
      console.error('FLUX Depth error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `FLUX API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    
    // v66: 완료 로그
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ 완료 (${elapsedTime}초)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    
    // 결과에 선택 정보 포함
    res.status(200).json({
      ...data,
      selected_artist: selectedArtist,
      selected_work: selectedWork,  // 거장 모드: 선택된 대표작
      selection_method: selectionMethod,
      selection_details: selectionDetails,
      // v66: 프론트엔드 로그용 데이터
      _debug: {
        version: 'v66',
        elapsed: elapsedTime,
        vision: logData.vision,
        selection: logData.selection,
        prompt: {
          wordCount: logData.prompt.wordCount,
          applied: appliedList
        },
        flux: logData.flux
      }
    });
    
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
