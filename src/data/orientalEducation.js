// ========================================
// 단독변환 동양화 교육 콘텐츠
// v68 - 2026-01-17 (4줄 구성, Full 버전 삭제)
// 로딩: 국가/전통 (어떤 미학인가)
// 결과: 스타일/특징 (어떤 장르인가)
// ----------------------------------------
// [다국어 변환 시 수정 필요]
// - orientalBasicInfo: 국가명, 스타일 목록
// - orientalOverview: 문화권 설명 4줄
// - orientalEducation: 스타일별 설명 4줄
// ========================================

// ========== 기본정보 ==========
// [다국어 변환 시 수정 필요]
export const orientalBasicInfo = {
  'korean': {
    loading: {
      name: '한국 전통회화(Korean Traditional Painting)',
      subtitle: '민화 · 풍속도 · 진경산수화'
    }
  },
  'chinese': {
    loading: {
      name: '중국 전통회화(Chinese Traditional Painting)',
      subtitle: '수묵화 · 공필화'
    }
  },
  'japanese': {
    loading: {
      name: '일본 전통회화(Japanese Traditional Painting)',
      subtitle: '우키요에'
    }
  }
};

// ========== 1차 교육: 문화권 로딩 (Overview) ==========
export const orientalOverview = {
  korean: {
    title: '한국 전통회화',
    desc: `선비는 먹으로, 민중은 색으로 그렸습니다.
여백이 말하고, 붓끝에 정신을 담았습니다.
민화, 풍속도, 진경산수화가 대표 장르입니다.
조선 500년 미학의 결정체입니다.`
  },
  
  chinese: {
    title: '중국 전통회화',
    desc: `먹의 농담으로 우주의 기운을 담았습니다.
산과 물 사이에서 천 년의 철학이 흘렀습니다.
수묵화와 공필화가 대표 장르입니다.
문인의 정신과 궁정의 기교가 공존한 예술입니다.`
  },
  
  japanese: {
    title: '일본 전통회화',
    desc: `덧없는 세상, 우키요를 그림으로 붙잡았습니다.
파도, 게이샤, 벚꽃이 선명한 색채로 피어납니다.
우키요에가 대표 장르입니다.
순간을 영원으로 새긴 에도의 대중 예술입니다.`
  }
};


// ========== 2차 교육: 장르별 결과 ==========
export const orientalEducation = {
  
  // ========== 기본값 (매칭 실패시) ==========
  korean_default: {
    name: '한국 전통회화',
    description: `선비는 먹으로, 민중은 색으로 그렸습니다.
여백이 말하고, 붓끝에 정신을 담았습니다.
민화, 풍속도, 진경산수화가 대표 장르입니다.
조선 500년 미학의 결정체입니다.`
  },
  
  chinese_default: {
    name: '중국 전통회화',
    description: `먹의 농담으로 우주의 기운을 담았습니다.
산과 물 사이에서 천 년의 철학이 흘렀습니다.
수묵화와 공필화가 대표 장르입니다.
문인의 정신과 궁정의 기교가 공존한 예술입니다.`
  },
  
  japanese_default: {
    name: '일본 전통회화',
    description: `덧없는 세상, 우키요를 그림으로 붙잡았습니다.
파도, 게이샤, 벚꽃이 선명한 색채로 피어납니다.
우키요에가 대표 장르입니다.
순간을 영원으로 새긴 에도의 대중 예술입니다.`
  },
  
  
  // ========== 한국 ==========
  
  'korean-minhwa': {
    name: '민화',
    style: 'minhwa',
    description: `민중은 삶의 소망을 그림에 담았습니다.
까치, 호랑이, 모란에 복과 장수를 빌었습니다.
원근법 없이 자유롭게, 색은 선명하게 칠했습니다.
집집마다 걸렸던 조선의 생활 미술입니다.`
  },
  
  'korean-pungsokdo': {
    name: '풍속도',
    style: 'genre_painting',
    description: `화가는 민중의 일상을 화폭에 담았습니다.
씨름하는 장정, 빨래하는 아낙, 서당의 아이들이 등장합니다.
빠르고 경쾌한 붓놀림과 담백한 채색이 특징입니다.
붓끝으로 민중의 삶을 기록한 조선의 리얼리즘입니다.`
  },
  
  'korean-jingyeong': {
    name: '진경산수화',
    style: 'true_view_landscape',
    description: `화가는 조선의 실제 산천을 직접 보고 그렸습니다.
금강산과 인왕산이 힘찬 필선으로 되살아납니다.
중국 관념 산수를 벗어난 조선만의 시선입니다.
겸재 정선이 완성한 진짜 풍경의 미학입니다.`
  },
  
  
  // ========== 중국 ==========
  
  'chinese-ink': {
    name: '수묵화',
    style: 'ink_wash',
    description: `문인은 먹의 농담만으로 세상을 그렸습니다.
산과 물, 안개와 구름이 번짐 속에 피어납니다.
여백은 그 자체로 무한한 공간이 됩니다.
천 년 문인화의 정수입니다.`
  },
  
  'chinese-gongbi': {
    name: '공필화',
    style: 'gongbi',
    description: `궁정 화가는 붓끝으로 정밀함을 추구했습니다.
꽃과 새, 인물이 한 올 한 올 세밀하게 그려집니다.
투명한 색을 여러 겹 쌓아 깊이를 만들었습니다.
황제의 눈을 사로잡은 동양 세밀화의 정점입니다.`
  },
  
  'chinese-huaniao': {
    name: '화조화',
    style: 'bird_and_flower',
    description: `꽃과 새, 나비와 물고기에 길상의 의미를 담았습니다.
모란은 부귀를, 매화는 고결함을, 연꽃은 청렴을 상징합니다.
작은 생명 하나에도 천지의 이치가 깃들어 있습니다.
자연 속 생명의 기운을 화폭에 담은 동양의 정물화입니다.`
  },
  
  
  // ========== 일본 ==========
  
  'japanese-ukiyoe': {
    name: '우키요에',
    style: 'ukiyoe',
    description: `떠도는 세상의 아름다움을 목판에 새겼습니다.
강렬한 윤곽선과 평면적 색면이 특징입니다.
호쿠사이의 파도, 히로시게의 명소가 대표작입니다.
인상파 화가들에게 영감을 준 일본의 시선입니다.`
  }
};

export default { orientalOverview, orientalEducation, orientalBasicInfo };
