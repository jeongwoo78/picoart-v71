// =====================================================
// masterData.js - 마스터 데이터 (Single Source of Truth)
// =====================================================
// 모든 사조, 거장, 동양화 정보를 한 곳에서 관리
// StyleSelection, ProcessingScreen, ResultScreen 등에서 import해서 사용
// =====================================================

// ========== 카테고리 아이콘 (원클릭용) ==========
export const CATEGORY_ICONS = {
  movements: '🎨',
  masters: '⭐',
  oriental: '🎎'
};

// ========== 사조 데이터 ==========
export const MOVEMENTS = {
  ancient: {
    id: 'ancient',
    ko: '그리스·로마',
    en: 'Greek & Roman',
    period: 'BC 800~AD 500',
    icon: '🏛️',
    description: '완벽한 비례와 균형미',
    subtitle: '고대 그리스 조각 · 로마 모자이크'
  },
  medieval: {
    id: 'medieval',
    ko: '중세 미술',
    en: 'Medieval Art',
    period: '5~15세기',
    icon: '⛪',
    description: '비잔틴·고딕·이슬람의 신성함',
    subtitle: '비잔틴 · 고딕 · 이슬람 세밀화'
  },
  renaissance: {
    id: 'renaissance',
    ko: '르네상스',
    en: 'Renaissance',
    period: '14~16세기',
    icon: '🎭',
    description: '인간 중심의 이상적 아름다움',
    subtitle: '다빈치 · 미켈란젤로 · 보티첼리'
  },
  baroque: {
    id: 'baroque',
    ko: '바로크',
    en: 'Baroque',
    period: '17~18세기',
    icon: '👑',
    description: '극적이고 웅장한 표현',
    subtitle: '카라바조 · 렘브란트 · 벨라스케스'
  },
  rococo: {
    id: 'rococo',
    ko: '로코코',
    en: 'Rococo',
    period: '18세기',
    icon: '🌸',
    description: '우아하고 장식적인 취향',
    subtitle: '와토 · 부셰'
  },
  neoclassicism_vs_romanticism_vs_realism: {
    id: 'neoclassicism_vs_romanticism_vs_realism',
    ko: '신고전 vs 낭만 vs 사실주의',
    en: 'Neoclassicism·Romanticism·Realism',
    period: '19세기',
    icon: '⚖️',
    description: '이성 vs 감성 vs 현실',
    subtitle: '다비드 · 들라크루아 · 쿠르베'
  },
  impressionism: {
    id: 'impressionism',
    ko: '인상주의',
    en: 'Impressionism',
    period: '19세기 후반',
    icon: '🌅',
    description: '빛의 순간을 포착',
    subtitle: '모네 · 르누아르 · 드가'
  },
  postImpressionism: {
    id: 'postImpressionism',
    ko: '후기인상주의',
    en: 'Post-Impressionism',
    period: '19세기 말',
    icon: '🌻',
    description: '감정과 구조의 탐구',
    subtitle: '반 고흐 · 고갱 · 세잔'
  },
  fauvism: {
    id: 'fauvism',
    ko: '야수파',
    en: 'Fauvism',
    period: '20세기 초',
    icon: '🎨',
    description: '순수 색채의 해방',
    subtitle: '마티스 · 드랭 · 블라맹크'
  },
  expressionism: {
    id: 'expressionism',
    ko: '표현주의',
    en: 'Expressionism',
    period: '20세기 초',
    icon: '😱',
    description: '내면의 불안과 고독',
    subtitle: '뭉크 · 키르히너 · 코코슈카'
  },
  modernism: {
    id: 'modernism',
    ko: '20세기 모더니즘',
    en: 'Modernism',
    period: '20세기',
    icon: '🔮',
    description: '입체·초현실·팝아트',
    subtitle: '피카소 · 마그리트 · 샤갈'
  }
};

// 20세기 모더니즘 세부 사조 (화가별 분류용)
export const MODERNISM_SUB = {
  cubism: { ko: '입체주의', en: 'Cubism', period: '20세기 초' },
  surrealism: { ko: '초현실주의', en: 'Surrealism', period: '20세기 초중반' },
  popArt: { ko: '팝아트', en: 'Pop Art', period: '20세기 중반' }
};

// 19세기 세부 사조 (화가별 분류용)
export const NINETEENTH_CENTURY_SUB = {
  neoclassicism: { ko: '신고전주의', en: 'Neoclassicism', period: '18~19세기' },
  romanticism: { ko: '낭만주의', en: 'Romanticism', period: '19세기' },
  realism: { ko: '사실주의', en: 'Realism', period: '19세기' }
};

// 아르누보 (클림트용)
export const ART_NOUVEAU = {
  ko: '아르누보',
  en: 'Art Nouveau',
  period: '19세기 말~20세기 초'
};

// ========== 거장 데이터 ==========
export const MASTERS = {
  'vangogh-master': {
    id: 'vangogh-master',
    key: 'vangogh',  // 교육자료 키
    ko: '빈센트 반 고흐',
    en: 'Vincent van Gogh',
    years: '1853~1890',
    movement: '후기인상주의',
    movementEn: 'Post-Impressionism',
    icon: '🌻',
    description: '1853-1890 | 후기인상주의',
    aliases: ['van gogh', 'gogh', 'vincent', '고흐', '반 고흐'],
    works: {
      'starrynight': ['The Starry Night', '별이 빛나는 밤', 'Starry Night'],
      'sunflowers': ['Sunflowers', '해바라기'],
      'selfportrait': ['Self-Portrait', '자화상', 'Van Gogh Self-Portrait']
    }
  },
  'klimt-master': {
    id: 'klimt-master',
    key: 'klimt',
    ko: '구스타프 클림트',
    en: 'Gustav Klimt',
    years: '1862~1918',
    movement: '아르누보',
    movementEn: 'Art Nouveau',
    icon: '✨',
    description: '1862-1918 | 아르누보',
    aliases: ['gustav', 'gustav klimt', '클림트'],
    works: {
      'kiss': ['The Kiss', '키스', 'Kiss'],
      'treeoflife': ['The Tree of Life', '생명의 나무', 'Tree of Life'],
      'judith': ['Judith I', 'Judith', '유디트']
    }
  },
  'munch-master': {
    id: 'munch-master',
    key: 'munch',
    ko: '에드바르 뭉크',
    en: 'Edvard Munch',
    years: '1863~1944',
    movement: '표현주의',
    movementEn: 'Expressionism',
    icon: '😱',
    description: '1863-1944 | 표현주의',
    aliases: ['edvard', 'edvard munch', '뭉크'],
    works: {
      'scream': ['The Scream', '절규', 'Scream'],
      'madonna': ['Madonna', '마돈나', 'Munch Madonna'],
      'jealousy': ['Jealousy', '질투', 'The Jealousy']
    }
  },
  'matisse-master': {
    id: 'matisse-master',
    key: 'matisse',
    ko: '앙리 마티스',
    en: 'Henri Matisse',
    years: '1869~1954',
    movement: '야수파',
    movementEn: 'Fauvism',
    icon: '🎭',
    description: '1869-1954 | 야수파',
    aliases: ['henri', 'henri matisse', '마티스'],
    works: {
      'dance': ['The Dance', '춤', 'Dance', 'La Danse'],
      'redroom': ['The Red Room', '붉은 방', 'Red Room', 'Harmony in Red'],
      'womanhat': ['Woman with a Hat', '모자를 쓴 여인', 'Femme au Chapeau'],
      'greenstripe': ['The Green Stripe', '녹색 줄무늬', 'Green Stripe', 'Portrait of Madame Matisse']
    }
  },
  'chagall-master': {
    id: 'chagall-master',
    key: 'chagall',
    ko: '마르크 샤갈',
    en: 'Marc Chagall',
    years: '1887~1985',
    movement: '초현실주의',
    movementEn: 'Surrealism',
    icon: '🎠',
    description: '1887-1985 | 초현실주의',
    aliases: ['marc', 'marc chagall', '샤갈', '마르크 샤갈'],
    works: {
      'lovers': ['Lovers with Flowers', '꽃다발과 연인들', 'Lovers'],
      'labranche': ['La Branche', '나뭇가지', 'The Branch'],
      'lamariee': ['La Mariée', 'La Mariee', '신부', 'The Bride']
    }
  },
  'frida-master': {
    id: 'frida-master',
    key: 'frida',
    ko: '프리다 칼로',
    en: 'Frida Kahlo',
    years: '1907~1954',
    movement: '초현실주의',
    movementEn: 'Surrealism',
    icon: '🌺',
    description: '1907-1954 | 초현실주의',
    aliases: ['kahlo', 'frida kahlo', '프리다', '프리다 칼로'],
    works: {
      'parrots': ['Me and My Parrots', '나와 내 앵무새들', 'Self-Portrait with Parrots'],
      'brokencolumn': ['The Broken Column', '부러진 기둥', 'Broken Column'],
      'thornnecklace': ['Self-Portrait with Thorn Necklace', '가시 목걸이와 벌새', 'Thorn Necklace', 'Self-Portrait with Thorn Necklace and Hummingbird'],
      'monkeys': ['Self-Portrait with Monkeys', '원숭이와 자화상', 'Monkeys'],
      'diegoandi': ['Diego and I', '디에고와 나']
    }
  },
  'picasso-master': {
    id: 'picasso-master',
    key: 'picasso',
    ko: '파블로 피카소',
    en: 'Pablo Picasso',
    years: '1881~1973',
    movement: '입체주의',
    movementEn: 'Cubism',
    icon: '🎨',
    description: '1881-1973 | 입체주의',
    aliases: ['pablo', 'pablo picasso', '피카소'],
    works: {
      'demoiselles': ["Les Demoiselles d'Avignon", '아비뇽의 처녀들', 'Demoiselles', "Demoiselles d'Avignon"],
      'guernica': ['Guernica', '게르니카']
    }
  },
  'lichtenstein-master': {
    id: 'lichtenstein-master',
    key: 'lichtenstein',
    ko: '로이 리히텐슈타인',
    en: 'Roy Lichtenstein',
    years: '1923~1997',
    movement: '팝아트',
    movementEn: 'Pop Art',
    icon: '💥',
    description: '1923-1997 | 팝아트',
    aliases: ['roy', 'roy lichtenstein', '리히텐슈타인', '로이 리히텐슈타인'],
    works: {
      'inthecar': ['In the Car', '차 안에서', 'In Car'],
      'mmaybe': ['M-Maybe', '아마도', 'Maybe'],
      'forgetit': ['Forget It!', 'Forget It', '날 잊어'],
      'ohhhalright': ['Ohhh...Alright...', 'Ohhh Alright', '오 알았어'],
      'stilllife': ['Still Life with Crystal Bowl', 'Still Life', '정물화']
    }
  }
};

// ========== 동양화 데이터 ==========
export const ORIENTAL = {
  korean: {
    id: 'korean',
    ko: '한국 전통회화',
    en: 'Korean Traditional Painting',
    icon: '🎎',
    description: '여백의 미와 절제미',
    styles: {
      'minhwa': { 
        ko: '민화', 
        en: 'Minhwa',
        aliases: ['korean minhwa', 'korean-minhwa', '한국 민화', '민화']
      },
      'pungsokdo': { 
        ko: '풍속도', 
        en: 'Pungsokdo',
        aliases: ['korean pungsokdo', 'korean-pungsokdo', 'korean-genre', '풍속화', '한국 풍속도']
      },
      'jingyeong': { 
        ko: '진경산수화', 
        en: 'Jingyeong',
        aliases: ['korean jingyeong', 'korean-jingyeong', '진경산수', '한국 진경산수화']
      }
    }
  },
  chinese: {
    id: 'chinese',
    ko: '중국 전통회화',
    en: 'Chinese Traditional Painting',
    icon: '🐉',
    description: '기운생동의 수묵화',
    styles: {
      'gongbi': { 
        ko: '공필화', 
        en: 'Gongbi',
        aliases: ['chinese gongbi', 'chinese-gongbi', '중국 공필화', '공필화']
      },
      'ink-wash': { 
        ko: '수묵화', 
        en: 'Ink Wash',
        aliases: ['chinese ink wash', 'chinese-ink', 'chinese-ink-wash', '중국 수묵화', '수묵화']
      }
    }
  },
  japanese: {
    id: 'japanese',
    ko: '일본 전통회화',
    en: 'Japanese Traditional Painting',
    icon: '🗾',
    description: '섬세한 관찰과 대담한 생략',
    styles: {
      'ukiyoe': { 
        ko: '우키요에', 
        en: 'Ukiyo-e',
        aliases: ['japanese ukiyo-e', 'japanese-ukiyoe', 'ukiyo-e', '일본 우키요에', '우키요에']
      }
    }
  }
};

// ========== 사조별 화가 데이터 (AI 선택용) ==========
export const MOVEMENT_ARTISTS = {
  ancient: {
    'greek-sculpture': { 
      ko: '고대 그리스 조각', 
      en: 'Greek Sculpture',
      aliases: ['classical sculpture', 'polykleitos', 'phidias', 'myron', 'praxiteles', '그리스 조각']
    },
    'roman-mosaic': { 
      ko: '로마 모자이크', 
      en: 'Roman Mosaic',
      aliases: ['mosaic', '모자이크']
    }
  },
  medieval: {
    'byzantine': { 
      ko: '비잔틴', 
      en: 'Byzantine',
      aliases: ['byzantine art', '비잔틴 미술']
    },
    'gothic': { 
      ko: '고딕', 
      en: 'Gothic',
      aliases: ['gothic art', 'limbourg brothers', '고딕 미술', '랭부르 형제']
    },
    'islamic-miniature': { 
      ko: '이슬람 세밀화', 
      en: 'Islamic Miniature',
      aliases: ['islamic', 'persian miniature', '페르시아 세밀화']
    }
  },
  renaissance: {
    'leonardo': { 
      ko: '레오나르도 다 빈치', 
      en: 'Leonardo da Vinci', 
      years: '1452~1519',
      aliases: ['da vinci', '다빈치', '레오나르도']
    },
    'michelangelo': { 
      ko: '미켈란젤로 부오나로티', 
      en: 'Michelangelo', 
      years: '1475~1564',
      aliases: ['michelangelo buonarroti', '미켈란젤로']
    },
    'raphael': { 
      ko: '라파엘로 산치오', 
      en: 'Raphael', 
      years: '1483~1520',
      aliases: ['raphael sanzio', 'raffaello', '라파엘로']
    },
    'botticelli': { 
      ko: '산드로 보티첼리', 
      en: 'Botticelli', 
      years: '1445~1510',
      aliases: ['sandro botticelli', '보티첼리']
    },
    'titian': { 
      ko: '티치아노 베첼리오', 
      en: 'Titian', 
      years: '1488~1576',
      aliases: ['tiziano', '티치아노']
    }
  },
  baroque: {
    'caravaggio': { 
      ko: '미켈란젤로 메리시 다 카라바조', 
      en: 'Caravaggio', 
      years: '1571~1610',
      aliases: ['카라바조']
    },
    'rembrandt': { 
      ko: '렘브란트 판 레인', 
      en: 'Rembrandt', 
      years: '1606~1669',
      aliases: ['rembrandt van rijn', '렘브란트']
    },
    'vermeer': { 
      ko: '요하네스 페르메이르', 
      en: 'Vermeer', 
      years: '1632~1675',
      aliases: ['johannes vermeer', 'jan vermeer', '페르메이르', '베르메르']
    },
    'velazquez': { 
      ko: '디에고 벨라스케스', 
      en: 'Velázquez', 
      years: '1599~1660',
      aliases: ['velázquez', 'diego velázquez', '벨라스케스']
    },
    'rubens': { 
      ko: '피터 파울 루벤스', 
      en: 'Rubens', 
      years: '1577~1640',
      aliases: ['peter paul rubens', '루벤스']
    }
  },
  rococo: {
    'watteau': { 
      ko: '장 앙투안 와토', 
      en: 'Watteau', 
      years: '1684~1721',
      aliases: ['antoine watteau', 'jean-antoine watteau', '와토']
    },
    'boucher': { 
      ko: '프랑수아 부셰', 
      en: 'Boucher', 
      years: '1703~1770',
      aliases: ['françois boucher', 'francois boucher', '부셰']
    },
    'fragonard': { 
      ko: '장 오노레 프라고나르', 
      en: 'Fragonard', 
      years: '1732~1806',
      aliases: ['jean-honoré fragonard', '프라고나르']
    }
  },
  neoclassicism: {
    'david': { 
      ko: '자크 루이 다비드', 
      en: 'Jacques-Louis David', 
      years: '1748~1825',
      aliases: ['jacques-louis david', '다비드']
    },
    'ingres': { 
      ko: '장 오귀스트 도미니크 앵그르', 
      en: 'Ingres', 
      years: '1780~1867',
      aliases: ['jean-auguste-dominique ingres', '앵그르']
    }
  },
  romanticism: {
    'delacroix': { 
      ko: '외젠 들라크루아', 
      en: 'Delacroix', 
      years: '1798~1863',
      aliases: ['eugène delacroix', 'eugene delacroix', '들라크루아']
    },
    'turner': { 
      ko: '조지프 말러드 윌리엄 터너', 
      en: 'Turner', 
      years: '1775~1851',
      aliases: ['j.m.w. turner', 'joseph mallord william turner', 'william turner', '터너']
    },
    'goya': { 
      ko: '프란시스코 고야', 
      en: 'Goya', 
      years: '1746~1828',
      aliases: ['francisco goya', 'francisco de goya', '고야']
    }
  },
  realism: {
    'courbet': { 
      ko: '귀스타브 쿠르베', 
      en: 'Courbet', 
      years: '1819~1877',
      aliases: ['gustave courbet', '쿠르베']
    },
    'millet': { 
      ko: '장 프랑수아 밀레', 
      en: 'Millet', 
      years: '1814~1875',
      aliases: ['jean-françois millet', 'jean-francois millet', '밀레']
    }
  },
  impressionism: {
    'monet': { 
      ko: '클로드 모네', 
      en: 'Claude Monet', 
      years: '1840~1926',
      aliases: ['모네']
    },
    'renoir': { 
      ko: '피에르 오귀스트 르누아르', 
      en: 'Renoir', 
      years: '1841~1919',
      aliases: ['pierre-auguste renoir', 'auguste renoir', '르누아르']
    },
    'degas': { 
      ko: '에드가 드가', 
      en: 'Degas', 
      years: '1834~1917',
      aliases: ['edgar degas', '드가']
    },
    'manet': { 
      ko: '에두아르 마네', 
      en: 'Manet', 
      years: '1832~1883',
      aliases: ['édouard manet', 'edouard manet', '마네']
    },
    'morisot': { 
      ko: '베르트 모리조', 
      en: 'Morisot', 
      years: '1841~1895',
      aliases: ['berthe morisot', '모리조']
    },
    'caillebotte': { 
      ko: '귀스타브 카유보트', 
      en: 'Caillebotte', 
      years: '1848~1894',
      aliases: ['gustave caillebotte', '카유보트']
    }
  },
  postImpressionism: {
    'vangogh': { 
      ko: '빈센트 반 고흐', 
      en: 'Vincent van Gogh', 
      years: '1853~1890',
      aliases: ['van gogh', 'gogh', '고흐', '반 고흐']
    },
    'gauguin': { 
      ko: '폴 고갱', 
      en: 'Paul Gauguin', 
      years: '1848~1903',
      aliases: ['고갱']
    },
    'cezanne': { 
      ko: '폴 세잔', 
      en: 'Paul Cézanne', 
      years: '1839~1906',
      aliases: ['cézanne', 'paul cézanne', '세잔']
    }
  },
  fauvism: {
    'matisse': { 
      ko: '앙리 마티스', 
      en: 'Henri Matisse', 
      years: '1869~1954',
      aliases: ['henri matisse', '마티스']
    },
    'derain': { 
      ko: '앙드레 드랭', 
      en: 'André Derain', 
      years: '1880~1954',
      aliases: ['andré derain', 'andre derain', '드랭']
    },
    'vlaminck': { 
      ko: '모리스 드 블라맹크', 
      en: 'Maurice de Vlaminck', 
      years: '1876~1958',
      aliases: ['maurice de vlaminck', '블라맹크']
    }
  },
  expressionism: {
    'munch': { 
      ko: '에드바르 뭉크', 
      en: 'Edvard Munch', 
      years: '1863~1944',
      aliases: ['edvard munch', '뭉크']
    },
    'kirchner': { 
      ko: '에른스트 루트비히 키르히너', 
      en: 'Ernst Ludwig Kirchner', 
      years: '1880~1938',
      aliases: ['ernst ludwig kirchner', '키르히너']
    },
    'kokoschka': { 
      ko: '오스카 코코슈카', 
      en: 'Oskar Kokoschka', 
      years: '1886~1980',
      aliases: ['oskar kokoschka', '코코슈카']
    }
  },
  modernism: {
    'picasso': { 
      ko: '파블로 피카소', 
      en: 'Pablo Picasso', 
      years: '1881~1973', 
      sub: 'cubism',
      aliases: ['pablo picasso', '피카소']
    },
    'lichtenstein': { 
      ko: '로이 리히텐슈타인', 
      en: 'Roy Lichtenstein', 
      years: '1923~1997', 
      sub: 'popArt',
      aliases: ['roy lichtenstein', '리히텐슈타인']
    },
    'haring': { 
      ko: '키스 해링', 
      en: 'Keith Haring', 
      years: '1958~1990', 
      sub: 'popArt',
      aliases: ['keith haring', '해링']
    },
    'miro': { 
      ko: '호안 미로', 
      en: 'Joan Miró', 
      years: '1893~1983', 
      sub: 'surrealism',
      aliases: ['joan miró', 'joan miro', 'miró', '미로']
    },
    'magritte': { 
      ko: '르네 마그리트', 
      en: 'René Magritte', 
      years: '1898~1967', 
      sub: 'surrealism',
      aliases: ['rené magritte', 'rene magritte', '마그리트']
    },
    'chagall': { 
      ko: '마르크 샤갈', 
      en: 'Marc Chagall', 
      years: '1887~1985', 
      sub: 'surrealism',
      aliases: ['marc chagall', '샤갈']
    }
  }
};

// ========== 유틸리티 함수 ==========

/**
 * 사조 전체 이름 생성: 한글명(영문명, 시기)
 */
export const getMovementFullName = (movementId) => {
  const m = MOVEMENTS[movementId];
  if (!m) return movementId;
  return `${m.ko}(${m.en}, ${m.period})`;
};

/**
 * 거장 전체 이름 생성: 한글명(영문명, 생몰연도)
 */
export const getMasterFullName = (masterId) => {
  const m = MASTERS[masterId];
  if (!m) return masterId;
  return `${m.ko}(${m.en}, ${m.years})`;
};

/**
 * 동양화 전체 이름 생성: 한글명(영문명)
 */
export const getOrientalFullName = (orientalId) => {
  const o = ORIENTAL[orientalId];
  if (!o) return orientalId;
  return `${o.ko}(${o.en})`;
};

/**
 * ID로 사조 정보 찾기 (한글명으로도 검색 가능)
 */
export const findMovement = (nameOrId) => {
  // ID로 직접 찾기
  if (MOVEMENTS[nameOrId]) return MOVEMENTS[nameOrId];
  
  // 한글명으로 찾기
  const normalized = nameOrId?.toLowerCase().trim();
  for (const key in MOVEMENTS) {
    const m = MOVEMENTS[key];
    if (m.ko === nameOrId || m.ko.toLowerCase() === normalized) {
      return m;
    }
  }
  return null;
};

/**
 * ID로 거장 정보 찾기 (한글명으로도 검색 가능)
 */
export const findMaster = (nameOrId) => {
  // ID로 직접 찾기
  if (MASTERS[nameOrId]) return MASTERS[nameOrId];
  
  // 한글명으로 찾기
  for (const key in MASTERS) {
    const m = MASTERS[key];
    if (m.ko === nameOrId || m.en.toLowerCase() === nameOrId?.toLowerCase()) {
      return m;
    }
  }
  return null;
};

/**
 * StyleSelection용 배열 생성
 */
export const getStyleSelectionArray = () => {
  const styles = [];
  
  // 사조
  Object.values(MOVEMENTS).forEach(m => {
    styles.push({
      id: m.id,
      name: m.ko,
      category: 'movements',
      icon: m.icon,
      description: m.description
    });
  });
  
  // 거장
  Object.values(MASTERS).forEach(m => {
    styles.push({
      id: m.id,
      name: m.ko,
      nameEn: m.en,
      category: 'masters',
      icon: m.icon,
      description: m.description
    });
  });
  
  // 동양화
  Object.values(ORIENTAL).forEach(o => {
    styles.push({
      id: o.id,
      name: o.ko,
      nameEn: o.en,
      category: 'oriental',
      icon: o.icon,
      description: o.description
    });
  });
  
  return styles;
};

/**
 * 화가명(영문 다양한 형태)으로 정보 찾기
 * aliases 배열 활용한 검색
 */
export const findArtistByName = (artistName) => {
  if (!artistName) return null;
  const normalized = artistName.toLowerCase().trim();
  
  // MOVEMENT_ARTISTS에서 검색
  for (const [movementId, artists] of Object.entries(MOVEMENT_ARTISTS)) {
    for (const [artistId, info] of Object.entries(artists)) {
      // ID 매칭
      if (artistId === normalized) {
        return { ...info, movementId, artistId };
      }
      // 영문명 매칭
      if (info.en?.toLowerCase() === normalized) {
        return { ...info, movementId, artistId };
      }
      // 한글명 매칭
      if (info.ko === artistName) {
        return { ...info, movementId, artistId };
      }
      // aliases 매칭
      if (info.aliases) {
        for (const alias of info.aliases) {
          if (alias.toLowerCase() === normalized) {
            return { ...info, movementId, artistId };
          }
        }
      }
      // 부분 매칭 (leonardo da vinci → leonardo)
      if (normalized.includes(artistId) || artistId.includes(normalized)) {
        return { ...info, movementId, artistId };
      }
    }
  }
  return null;
};

/**
 * 거장(MASTERS)에서 화가명/작품명으로 검색
 * @returns { master, workKey } 또는 null
 */
export const findMasterByNameOrWork = (artistName, workName) => {
  if (!artistName && !workName) return null;
  const normalizedArtist = artistName?.toLowerCase().trim();
  const normalizedWork = workName?.toLowerCase().trim();
  
  for (const [masterId, master] of Object.entries(MASTERS)) {
    // 화가명 매칭 (aliases 포함)
    const artistMatch = 
      master.key === normalizedArtist ||
      master.en?.toLowerCase() === normalizedArtist ||
      master.ko === artistName ||
      master.aliases?.some(a => a.toLowerCase() === normalizedArtist);
    
    if (artistMatch) {
      // 작품명도 있으면 작품 매칭
      if (workName && master.works) {
        for (const [workKey, workNames] of Object.entries(master.works)) {
          if (workNames.some(w => w.toLowerCase() === normalizedWork || normalizedWork?.includes(w.toLowerCase()))) {
            return { master, workKey, masterId };
          }
        }
      }
      // 작품명 없으면 화가만 반환
      return { master, workKey: null, masterId };
    }
    
    // 작품명으로만 검색
    if (workName && master.works) {
      for (const [workKey, workNames] of Object.entries(master.works)) {
        if (workNames.some(w => w.toLowerCase() === normalizedWork || normalizedWork?.includes(w.toLowerCase()))) {
          return { master, workKey, masterId };
        }
      }
    }
  }
  return null;
};

/**
 * 동양화 스타일 검색 (aliases 활용)
 * @returns { country, style, styleId } 또는 null
 */
export const findOrientalStyle = (styleName) => {
  if (!styleName) return null;
  const normalized = styleName.toLowerCase().trim();
  
  for (const [countryId, country] of Object.entries(ORIENTAL)) {
    // 국가 이름으로 검색 (한국 전통회화, 중국 전통회화 등)
    // 부분 매칭도 포함 (한국 전통화 → 한국 전통회화)
    if (country.ko === styleName || 
        country.ko.includes(styleName) ||
        styleName.includes(country.ko) ||
        country.en?.toLowerCase() === normalized ||
        countryId === normalized ||
        normalized.includes(countryId) ||
        styleName.includes('한국') && countryId === 'korean' ||
        styleName.includes('중국') && countryId === 'chinese' ||
        styleName.includes('일본') && countryId === 'japanese') {
      // 국가 매칭 시 첫 번째 스타일 반환
      const firstStyleId = Object.keys(country.styles)[0];
      const firstStyle = country.styles[firstStyleId];
      return {
        country,
        style: firstStyle,
        styleId: firstStyleId,
        key: `${countryId}-${firstStyleId}`
      };
    }
    
    // 스타일 이름으로 검색
    if (country.styles) {
      for (const [styleId, style] of Object.entries(country.styles)) {
        if (styleId === normalized ||
            style.ko === styleName ||
            style.en?.toLowerCase() === normalized ||
            style.aliases?.some(a => a.toLowerCase() === normalized)) {
          return { 
            country, 
            style, 
            styleId,
            key: `${countryId}-${styleId}`  // 교육자료 키 형식
          };
        }
      }
    }
  }
  return null;
};

/**
 * 교육자료 키 생성 (educationMatcher 대체)
 * @param {string} category - 'masters' | 'movements' | 'oriental'
 * @param {string} artist - 화가/스타일명
 * @param {string} work - 작품명 (거장만)
 * @returns {string|null} 교육자료 키
 */
export const getEducationKey = (category, artist, work) => {
  if (!category) return null;
  
  // 거장
  if (category === 'masters') {
    const result = findMasterByNameOrWork(artist, work);
    if (result) {
      // 작품별 키: vangogh-starrynight
      if (result.workKey) {
        return `${result.master.key}-${result.workKey}`;
      }
      // 화가 키만: vangogh
      return result.master.key;
    }
    return null;
  }
  
  // 미술사조
  if (category === 'movements') {
    const result = findArtistByName(artist);
    if (result) {
      return result.artistId;  // monet, vangogh 등
    }
    return null;
  }
  
  // 동양화
  if (category === 'oriental') {
    const result = findOrientalStyle(artist);
    if (result) {
      return result.key;  // korean-minhwa 등
    }
    return null;
  }
  
  return null;
};

/**
 * 사조 표시 정보 생성 (ResultScreen용)
 * @returns { title: '르네상스(Renaissance, 14~16세기)', subtitle: '레오나르도 다 빈치' }
 */
export const getMovementDisplayInfo = (styleName, artistName) => {
  // 1. 사조 정보 찾기
  let movement = findMovement(styleName);
  let actualMovementName = styleName;
  
  // "신고전 vs 낭만 vs 사실주의" 특수 처리
  if (styleName === '신고전 vs 낭만 vs 사실주의' && artistName) {
    const artist = findArtistByName(artistName);
    if (artist) {
      if (artist.movementId === 'neoclassicism') {
        movement = MOVEMENTS.neoclassicism_vs_romanticism_vs_realism;
        actualMovementName = '신고전주의';
        const neo = NINETEENTH_CENTURY_SUB?.neoclassicism;
        if (neo) movement = { ...movement, en: neo.en, period: neo.period };
      } else if (artist.movementId === 'romanticism') {
        movement = MOVEMENTS.neoclassicism_vs_romanticism_vs_realism;
        actualMovementName = '낭만주의';
        const rom = NINETEENTH_CENTURY_SUB?.romanticism;
        if (rom) movement = { ...movement, en: rom.en, period: rom.period };
      } else if (artist.movementId === 'realism') {
        movement = MOVEMENTS.neoclassicism_vs_romanticism_vs_realism;
        actualMovementName = '사실주의';
        const real = NINETEENTH_CENTURY_SUB?.realism;
        if (real) movement = { ...movement, en: real.en, period: real.period };
      }
    }
  }
  
  // "20세기 모더니즘" 특수 처리
  if (styleName === '20세기 모더니즘' && artistName) {
    const artist = findArtistByName(artistName);
    if (artist?.sub) {
      const subInfo = MODERNISM_SUB?.[artist.sub];
      if (subInfo) {
        actualMovementName = subInfo.ko;
        movement = { ...movement, en: subInfo.en, period: subInfo.period };
      }
    }
  }
  
  // 2. 화가 정보 찾기
  const artist = findArtistByName(artistName);
  
  // 3. 결과 생성
  const mvEn = movement?.en || styleName;
  const mvPeriod = movement?.period || '';
  const title = mvPeriod ? `${actualMovementName}(${mvEn}, ${mvPeriod})` : `${actualMovementName}(${mvEn})`;
  const subtitle = artist?.ko || artistName || '';
  
  return { title, subtitle };
};

/**
 * 동양화 표시 정보 생성 (ResultScreen용)
 * @returns { title: '한국 전통회화(Korean Traditional Painting)', subtitle: '민화' }
 */
export const getOrientalDisplayInfo = (artistName) => {
  if (!artistName) return { title: '동양화', subtitle: '' };
  const normalized = artistName.toLowerCase().trim();
  
  // ORIENTAL에서 검색
  for (const [countryId, country] of Object.entries(ORIENTAL)) {
    // 1. 국가 매칭 (예: "한국 전통화", "Korean", "중국 전통회화")
    if (country.ko === artistName || 
        country.en?.toLowerCase() === normalized ||
        artistName.includes(country.ko?.replace(' 전통회화', '')) ||
        artistName.includes('한국') && countryId === 'korean' ||
        artistName.includes('중국') && countryId === 'chinese' ||
        artistName.includes('일본') && countryId === 'japanese') {
      // 국가 매칭 시: 국가명(영문) + 스타일 목록
      const styleList = country.styles 
        ? Object.values(country.styles).map(s => s.ko).join(' · ')
        : '';
      return {
        title: `${country.ko}(${country.en})`,
        subtitle: styleList
      };
    }
    
    // 2. 스타일 매칭 (예: "민화", "Minhwa")
    if (country.styles) {
      for (const [styleId, style] of Object.entries(country.styles)) {
        if (styleId === normalized || 
            style.ko === artistName || 
            style.en?.toLowerCase() === normalized ||
            normalized.includes(styleId) ||
            normalized.includes(style.ko)) {
          return {
            title: `${country.ko}(${country.en})`,
            subtitle: style.ko
          };
        }
      }
    }
  }
  
  return { title: '동양화', subtitle: artistName };
};

// ========== 기본 export ==========
export default {
  CATEGORY_ICONS,
  MOVEMENTS,
  MODERNISM_SUB,
  NINETEENTH_CENTURY_SUB,
  ART_NOUVEAU,
  MASTERS,
  ORIENTAL,
  MOVEMENT_ARTISTS,
  getMovementFullName,
  getMasterFullName,
  getOrientalFullName,
  findMovement,
  findMaster,
  findArtistByName,
  findMasterByNameOrWork,
  findOrientalStyle,
  getEducationKey,
  getMovementDisplayInfo,
  getOrientalDisplayInfo,
  getStyleSelectionArray
};
