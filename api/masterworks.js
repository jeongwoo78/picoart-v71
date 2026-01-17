// ========================================
// PicoArt v68.1 - 대표작 프롬프트 (작품명+연도 패턴)
// v68.1 원칙:
//   - 패턴: [화가] "[작품명]" ([연도]), [색감/구도/특징]
//   - 15~25단어로 간소화
//   - 인종/인물 묘사 제거 (대전제가 담당)
//   - NOT photograph 제거 (화풍에 있음)
// ========================================

// ========================================
// 거장 대표작 작품명 매핑
// ========================================
export const masterworkNameMapping = {
  // 반 고흐
  'the starry night': 'vangogh-starrynight', '별이 빛나는 밤': 'vangogh-starrynight', 'starry night': 'vangogh-starrynight',
  'sunflowers': 'vangogh-sunflowers', '해바라기': 'vangogh-sunflowers',
  'self-portrait with grey felt hat': 'vangogh-selfportrait', '회색 펠트 모자 자화상': 'vangogh-selfportrait', 'grey felt hat': 'vangogh-selfportrait',
  'café terrace at night': 'vangogh-cafe', 'cafe terrace': 'vangogh-cafe', '밤의 카페 테라스': 'vangogh-cafe',
  'seascape near les saintes-maries-de-la-mer': 'vangogh-seascape', '생트마리 바다': 'vangogh-seascape', 'seascape': 'vangogh-seascape',
  'wheat field with cypresses': 'vangogh-wheatfield', '사이프러스 밀밭': 'vangogh-wheatfield', 'cypresses': 'vangogh-wheatfield',
  
  // 클림트
  'the kiss': 'klimt-kiss', '키스': 'klimt-kiss',
  'the tree of life': 'klimt-treeoflife', '생명의 나무': 'klimt-treeoflife',
  'judith i': 'klimt-judith', 'judith': 'klimt-judith', '유디트': 'klimt-judith',
  
  // 뭉크
  'the scream': 'munch-scream', '절규': 'munch-scream',
  'madonna': 'munch-madonna', '마돈나': 'munch-madonna',
  'the dance of life': 'munch-danceoflife', '생의 춤': 'munch-danceoflife',
  
  // 마티스
  'the dance': 'matisse-dance', '춤': 'matisse-dance',
  'the red room': 'matisse-redroom', '붉은 방': 'matisse-redroom',
  'the green stripe': 'matisse-greenstripe', '초록 줄무늬': 'matisse-greenstripe',
  'woman in a purple coat': 'matisse-purplecoat', '보라색 코트': 'matisse-purplecoat',
  
  // 피카소
  'guernica': 'picasso-guernica', '게르니카': 'picasso-guernica',
  'three musicians': 'picasso-musicians', '세 명의 음악가': 'picasso-musicians', '세명의 음악가': 'picasso-musicians',
  'portrait of dora maar': 'picasso-doramaar', 'dora maar': 'picasso-doramaar', '도라 마르': 'picasso-doramaar', '도라 마르의 초상': 'picasso-doramaar',
  
  // 프리다 칼로
  'me and my parrots': 'frida-parrots', '나와 앵무새들': 'frida-parrots',
  'self-portrait with thorn necklace': 'frida-thornnecklace', '가시 목걸이': 'frida-thornnecklace',
  'self-portrait with monkeys': 'frida-monkeys', '원숭이와 자화상': 'frida-monkeys',
  
  // 로마 모자이크
  'alexander mosaic': 'mosaic-alexander', '알렉산더 모자이크': 'mosaic-alexander',
  'cave canem': 'mosaic-cave-canem', '카베 카넴': 'mosaic-cave-canem',
  'dionysus mosaic': 'mosaic-dionysus', '디오니소스': 'mosaic-dionysus',
  'oceanus and tethys': 'mosaic-oceanus', '오케아노스': 'mosaic-oceanus',
  'four seasons mosaic': 'mosaic-seasons', '사계절 모자이크': 'mosaic-seasons',
  'nile mosaic': 'mosaic-nile', '나일 모자이크': 'mosaic-nile',
  
  // 고딕/비잔틴/이슬람
  'blue virgin of chartres': 'gothic-chartres', 'notre-dame rose window': 'gothic-notredame',
  'sainte-chapelle': 'gothic-saintechapelle',
  'emperor justinian': 'byzantine-justinian', 'empress theodora': 'byzantine-theodora',
  'deesis': 'byzantine-deesis', 'christ pantocrator': 'byzantine-pantocrator',
  'youth holding a flower': 'islamic-youth', 'miraj': 'islamic-miraj',
  'simurgh': 'islamic-simurgh', 'lovers in a garden': 'islamic-lovers',
  'rustam slaying the dragon': 'islamic-rustam',
  
  // 르네상스
  'primavera': 'botticelli-primavera', '프리마베라': 'botticelli-primavera',
  'venus and mars': 'botticelli-venusmars',
  // 모나리자 제거 (얼굴 합성 문제)
  'the last supper': 'leonardo-lastsupper', '최후의 만찬': 'leonardo-lastsupper',
  'virgin of the rocks': 'leonardo-virginrocks', '암굴의 성모': 'leonardo-virginrocks',
  'bacchus and ariadne': 'titian-bacchus', '바쿠스와 아리아드네': 'titian-bacchus',
  'assumption of the virgin': 'titian-assumption', '성모 승천': 'titian-assumption',
  'creation of adam': 'michelangelo-adam', '아담의 창조': 'michelangelo-adam',
  'the last judgment': 'michelangelo-lastjudgment', '최후의 심판': 'michelangelo-lastjudgment',
  'school of athens': 'raphael-athens', '아테네 학당': 'raphael-athens',
  'sistine madonna': 'raphael-sistinamadonna', 'triumph of galatea': 'raphael-galatea',
  
  // 바로크
  'calling of saint matthew': 'caravaggio-matthew', 'saint matthew': 'caravaggio-matthew',
  'supper at emmaus': 'caravaggio-supper', '엠마오의 저녁식사': 'caravaggio-supper',
  'descent from the cross': 'rubens-descent', '십자가에서 내려지심': 'rubens-descent',
  'the garden of love': 'rubens-garden', '사랑의 정원': 'rubens-garden',
  'the night watch': 'rembrandt-nightwatch', '야경': 'rembrandt-nightwatch',
  'return of the prodigal son': 'rembrandt-prodigal',
  'las meninas': 'velazquez-meninas', '시녀들': 'velazquez-meninas',
  'portrait of pope innocent x': 'velazquez-pope', 'surrender of breda': 'velazquez-breda',
  
  // 로코코
  'pilgrimage to cythera': 'watteau-cythera', 'pierrot': 'watteau-pierrot',
  'the pleasures of the ball': 'watteau-fete', '사랑의 축제': 'watteau-fete',
  'madame de pompadour': 'boucher-pompadour', '퐁파두르 부인': 'boucher-pompadour',
  'le dejeuner': 'boucher-breakfast', '아침 식사': 'boucher-breakfast',
  
  // 신고전/낭만/사실
  'death of marat': 'david-marat', '마라의 죽음': 'david-marat',
  'coronation of napoleon': 'david-coronation', 'oath of the horatii': 'david-horatii',
  'princesse de broglie': 'ingres-broglie', '드 브로이 공주': 'ingres-broglie',
  'napoleon on his imperial throne': 'ingres-napoleon', '왕좌의 나폴레옹': 'ingres-napoleon',
  'rain, steam and speed': 'turner-rain', 'fighting temeraire': 'turner-temeraire',
  'slave ship': 'turner-slaveship',
  'liberty leading the people': 'delacroix-liberty', '민중을 이끄는 자유의 여신': 'delacroix-liberty',
  'death of sardanapalus': 'delacroix-sardanapalus',
  'the stone breakers': 'courbet-stonebreakers', 'a burial at ornans': 'courbet-burial',
  'bonjour monsieur courbet': 'courbet-bonjour',
  'bar at the folies-bergère': 'manet-bar', 'bar at the folies-bergere': 'manet-bar', '폴리베르제르의 바': 'manet-bar',
  'the fifer': 'manet-fifer', '피리 부는 소년': 'manet-fifer',
  
  // 인상주의
  'luncheon of the boating party': 'renoir-boating', 'bal du moulin de la galette': 'renoir-moulin',
  'the swing': 'renoir-swing', '그네': 'renoir-swing',
  'the dance class': 'degas-danceclass', 'the star': 'degas-star', 'l\'absinthe': 'degas-absinthe',
  'water lilies': 'monet-waterlilies', '수련': 'monet-waterlilies',
  'impression, sunrise': 'monet-impression', 'woman with a parasol': 'monet-parasol',
  'paris street, rainy day': 'caillebotte-paris', 'the floor scrapers': 'caillebotte-floor',
  'man at the window': 'caillebotte-window',
  
  // 후기인상주의
  'tahitian women': 'gauguin-tahitian', '타히티 여인들': 'gauguin-tahitian',
  'where do we come from?': 'gauguin-where', 'yellow christ': 'gauguin-christ',
  'basket of apples': 'cezanne-apples', 'mont sainte-victoire': 'cezanne-montagne',
  'the card players': 'cezanne-cards',
  
  // 야수파
  'port of collioure': 'derain-collioure', 'charing cross bridge': 'derain-charingcross',
  'portrait of matisse': 'derain-matisse',
  'houses at chatou': 'vlaminck-chatou', 'red trees': 'vlaminck-redtrees',
  'restaurant at bougival': 'vlaminck-bougival',
  
  // 표현주의
  'bride of the wind': 'kokoschka-bride', 'self-portrait of a degenerate artist': 'kokoschka-degenerate',
  'double portrait': 'kokoschka-double', '이중 초상': 'kokoschka-double',
  'berlin street scene': 'kirchner-berlin', 'self-portrait as a soldier': 'kirchner-soldier',
  'three old women': 'kirchner-oldwomen', '세 명의 노부인들': 'kirchner-oldwomen',
  
  // 모더니즘
  'the son of man': 'magritte-sonofman', 'golconda': 'magritte-golconda',
  'man in a bowler hat': 'magritte-bowlerhat', 'the human condition': 'magritte-humancondition',
  'the empire of light': 'magritte-empireoflight',
  'the catalan landscape': 'miro-catalan', 'constellations': 'miro-constellation',
  'woman in front of the sun': 'miro-bluestar',
  'lovers with flowers': 'chagall-lovers', '사랑하는 연인들과 꽃': 'chagall-lovers', 'la branche': 'chagall-labranche', '나뭇가지': 'chagall-labranche', 'la mariée': 'chagall-lamariee', 'la mariee': 'chagall-lamariee', '신부': 'chagall-lamariee', 'the bride': 'chagall-lamariee',
  'in the car': 'lichtenstein-inthecar', 'm-maybe': 'lichtenstein-mmaybe', 'ohhh alright': 'lichtenstein-ohhhalright', '오 알았어': 'lichtenstein-ohhhalright', 'still life': 'lichtenstein-stilllife', 'still life with palette': 'lichtenstein-stilllife', '정물화': 'lichtenstein-stilllife', 'forget it': 'lichtenstein-forgetit', '날 잊어': 'lichtenstein-forgetit'
};

// ========================================
// 1. 로마 모자이크 (6개)
// ========================================
export const romanMosaicMasterworks = {
  'mosaic-alexander': {
    name: '알렉산더 모자이크',
    nameEn: 'Alexander Mosaic',
    prompt: 'Roman "Alexander Mosaic" (c.100 BCE), Pompeii battle scene, dramatic diagonal movement, warrior armor and horses, earth tones terracotta ochre umber ivory.',
    feature: '전투, 역동적'
  },
  'mosaic-cave-canem': {
    name: '카베 카넴',
    nameEn: 'Cave Canem',
    prompt: 'Roman "Cave Canem" (1st century), bold black dog silhouette on light background, strong graphic contrast, terracotta black white palette.',
    feature: '동물, 경고'
  },
  'mosaic-dionysus': {
    name: '디오니소스 모자이크',
    nameEn: 'Dionysus Mosaic',
    prompt: 'Roman "Dionysus Mosaic" (2nd century), grape vines and wine imagery, banquet atmosphere, rich purple green gold on terracotta.',
    feature: '신화, 인물'
  },
  'mosaic-oceanus': {
    name: '오케아노스와 테티스',
    nameEn: 'Oceanus and Tethys',
    prompt: 'Roman "Oceanus and Tethys" (2nd century), sea god portrait bust, dominant ocean blue and turquoise, flowing water with fish.',
    feature: '바다신, 블루톤'
  },
  'mosaic-seasons': {
    name: '사계절 모자이크',
    nameEn: 'Four Seasons Mosaic',
    prompt: 'Roman "Four Seasons Mosaic" (2nd century), portrait bust in circular medallion, seasonal attributes flowers wheat grapes, warm earth tones.',
    feature: '계절, 얼굴'
  },
  'mosaic-nile': {
    name: '나일 모자이크',
    nameEn: 'Nile Mosaic',
    prompt: 'Roman "Nile Mosaic" (c.100 BCE), panoramic landscape with river, exotic wildlife hippos crocodiles ibis, ochre terracotta blue-green.',
    feature: '풍경, 동물'
  }
};

// ========================================
// 2. 고딕 스테인드글라스 (3개)
// ========================================
export const gothicMasterworks = {
  'gothic-chartres': {
    name: '샤르트르 푸른 성모',
    nameEn: 'Blue Virgin of Chartres',
    prompt: 'Gothic "Blue Virgin of Chartres" (c.1150), dominant Chartres cobalt blue, Madonna and child central, jewel-tone translucent, ruby red accents.',
    feature: '성모자, 코발트'
  },
  'gothic-notredame': {
    name: '노트르담 장미창',
    nameEn: 'Notre-Dame Rose Window',
    prompt: 'Gothic "Notre-Dame Rose Window" (c.1260), radial circular composition, kaleidoscopic symmetry, ruby sapphire emerald gold jewel tones.',
    feature: '방사형, 화려'
  },
  'gothic-saintechapelle': {
    name: '생트샤펠',
    nameEn: 'Sainte-Chapelle',
    prompt: 'Gothic "Sainte-Chapelle" (c.1248), tall vertical composition, dominant ruby red and deep blue, biblical scenes in vertical registers.',
    feature: '성경, 붉은색'
  }
};

// ========================================
// 3. 비잔틴 모자이크 (4개)
// ========================================
export const byzantineMasterworks = {
  'byzantine-justinian': {
    name: '유스티니아누스 황제',
    nameEn: 'Emperor Justinian',
    prompt: 'Byzantine "Emperor Justinian" (c.547), imperial court scene, shimmering gold leaf background, royal purple robes, circular golden halo.',
    feature: '황제, 위엄'
  },
  'byzantine-theodora': {
    name: '테오도라 황후',
    nameEn: 'Empress Theodora',
    prompt: 'Byzantine "Empress Theodora" (c.547), jeweled crown and pearl collar, shimmering gold background, luxurious purple and gold robes.',
    feature: '황후, 화려'
  },
  'byzantine-deesis': {
    name: '데이시스',
    nameEn: 'Deesis',
    prompt: 'Byzantine "Deesis" (c.1261), Christ at center with large circular golden halo, shimmering gold background, deep blue and burgundy robes.',
    feature: '그리스도, 성스러움'
  },
  'byzantine-pantocrator': {
    name: '판토크라토르',
    nameEn: 'Christ Pantocrator',
    prompt: 'Byzantine "Christ Pantocrator" (c.1148), monumental half-length figure, massive golden halo with cross, deep blue and gold, intense gaze.',
    feature: '장엄, 정면'
  }
};

// ========================================
// 4. 이슬람 세밀화 (5개)
// ========================================
export const islamicMiniatureMasterworks = {
  'islamic-youth': {
    name: '꽃을 든 귀족',
    nameEn: 'Youth Holding a Flower',
    prompt: 'Reza Abbasi "Youth Holding a Flower" (c.1625), elegant S-curved posture, elaborate turban with feather, jewel tones ruby sapphire emerald gold.',
    feature: '개인 초상, 우아'
  },
  'islamic-miraj': {
    name: '미라지 (승천도)',
    nameEn: 'Miraj (Night Journey)',
    prompt: 'Persian "Miraj" (c.1540), celestial ascension through swirling clouds and flames, angels with colorful wings, gold lapis blue ruby emerald.',
    feature: '환상, 천상'
  },
  'islamic-simurgh': {
    name: '시무르그',
    nameEn: 'Simurgh',
    prompt: 'Persian "Simurgh" (c.1590), magnificent giant bird with peacock-like plumage, iridescent colors, garden paradise, turquoise gold ruby emerald.',
    feature: '동물, 신화'
  },
  'islamic-lovers': {
    name: '정원의 연인들',
    nameEn: 'Lovers in a Garden',
    prompt: 'Persian "Lovers in a Garden" (c.1625), moonlit garden scene, cypress trees and flowering shrubs, soft jewel tones gold blue rose.',
    feature: '로맨스, 정원'
  },
  'islamic-rustam': {
    name: '루스탐과 용',
    nameEn: 'Rustam Slaying the Dragon',
    prompt: 'Persian "Rustam Slaying the Dragon" (c.1535), epic battle warrior on rearing horse fighting dragon, dynamic diagonal, gold vermillion lapis emerald.',
    feature: '액션, 전투'
  }
};

// ========================================
// 5. 보티첼리 (3개)
// ========================================
export const botticelliMasterworks = {
  'botticelli-primavera': {
    name: '프리마베라',
    nameEn: 'Primavera',
    prompt: 'Sandro Botticelli "Primavera" (c.1482), orange grove setting, flowing diaphanous gowns, flowers scattered in meadow, sweet melancholic expressions, ethereal graceful beauty.',
    feature: '여성, 우아'
  },
  'botticelli-venusmars': {
    name: '비너스와 마르스',
    nameEn: 'Venus and Mars',
    prompt: 'Sandro Botticelli "Venus and Mars" (c.1485), reclining couple composition, intimate romantic scene, elongated elegant figures, flowing drapery.',
    feature: '커플'
  }
};

// ========================================
// 6. 레오나르도 다 빈치 (3개)
// ========================================
export const leonardoMasterworks = {
  'leonardo-monalisa': {
    name: '모나리자',
    nameEn: 'Mona Lisa',
    prompt: 'Leonardo da Vinci "Mona Lisa" (c.1503-1519), extreme sfumato edges dissolving like smoke, warm golden-brown tones. CRITICAL: Paint ONLY the subject from original photo, PRESERVE original face and facial features exactly.',
    feature: '스푸마토'
  },
  'leonardo-lastsupper': {
    name: '최후의 만찬',
    nameEn: 'The Last Supper',
    prompt: 'Leonardo da Vinci "The Last Supper" (c.1495-1498), dramatic group composition centered on main figure, gesturing figures emotional reactions, symmetrical perspective.',
    feature: '그룹, 드라마'
  },
  'leonardo-virginrocks': {
    name: '암굴의 성모',
    nameEn: 'Virgin of the Rocks',
    prompt: 'Leonardo da Vinci "Virgin of the Rocks" (c.1483-1486), mysterious grotto rocky cave, pyramidal composition, extreme sfumato, eerie underwater atmosphere.',
    feature: '동굴, 신비'
  }
};

// ========================================
// 7. 티치아노 (2개) - v69: 누드 작품 제거
// ========================================
export const titianMasterworks = {
  'titian-bacchus': {
    name: '바쿠스와 아리아드네',
    nameEn: 'Bacchus and Ariadne',
    prompt: 'Titian "Bacchus and Ariadne" (1520-1523), dynamic mythological scene, swirling drapery, wild procession leopards satyrs, brilliant ultramarine blue sky.',
    feature: '역동, 신화'
  },
  'titian-assumption': {
    name: '성모 승천',
    nameEn: 'Assumption of the Virgin',
    prompt: 'Titian "Assumption of the Virgin" (1516-1518), Madonna ascending in brilliant red robe into golden light, apostles gesturing amazement, dynamic upward movement.',
    feature: '종교, 상승'
  }
};

// ========================================
// 8. 미켈란젤로 (2개) - v69: 조각 작품 제거
// ========================================
export const michelangeloMasterworks = {
  'michelangelo-adam': {
    name: '아담의 창조',
    nameEn: 'Creation of Adam',
    prompt: 'Michelangelo "Creation of Adam" (c.1512), iconic reaching hands nearly touching, God floating in billowing cloak with angels, heroic muscular anatomy, divine spark.',
    feature: '손, 창조'
  },
  'michelangelo-lastjudgment': {
    name: '최후의 심판',
    nameEn: 'The Last Judgment',
    prompt: 'Michelangelo "The Last Judgment" (1536-1541), monumental apocalyptic scene, Christ central in judgment, swirling masses ascending descending, powerful muscular bodies.',
    feature: '심판, 군중'
  }
};

// ========================================
// 9. 라파엘로 (3개)
// ========================================
export const raphaelMasterworks = {
  'raphael-athens': {
    name: '아테네 학당',
    nameEn: 'School of Athens',
    prompt: 'Raphael "School of Athens" (1509-1511), grand architectural perspective vaulted Roman arches, philosophers animated discussion, balanced harmonious composition.',
    feature: '건축, 철학'
  },
  'raphael-sistinamadonna': {
    name: '시스티나 마돈나',
    nameEn: 'Sistine Madonna',
    prompt: 'Raphael "Sistine Madonna" (1512), Madonna descending from clouds holding infant Christ, dramatically parted green curtains, famous cherubs at bottom.',
    feature: '성모, 천상'
  },
  'raphael-galatea': {
    name: '갈라테아의 승리',
    nameEn: 'Triumph of Galatea',
    prompt: 'Raphael "Triumph of Galatea" (c.1512), sea nymph riding shell chariot pulled by dolphins, swirling cupids above, joyful mythological, bright Mediterranean colors.',
    feature: '신화, 바다'
  }
};

// ========================================
// 10. 카라바조 (2개) - v69: 폭력적 작품 제거
// ========================================
export const caravaggioMasterworks = {
  'caravaggio-matthew': {
    name: '성 마태의 소명',
    nameEn: 'Calling of Saint Matthew',
    prompt: 'Caravaggio "Calling of Saint Matthew" (1599-1600), dramatic beam of light cutting through darkness pointing at figure, theatrical spotlight, Baroque diagonal composition.',
    feature: '빛줄기, 드라마'
  },
  'caravaggio-supper': {
    name: '엠마오의 저녁식사',
    nameEn: 'Supper at Emmaus',
    prompt: 'Caravaggio "Supper at Emmaus" (1601), intimate tavern scene figures around table, extreme tenebrism dramatic spotlight, gesturing hands, warm earth tones against black.',
    feature: '식사, 극적 명암'
  }
};

// ========================================
// 11. 루벤스 (2개) - v69: 누드 작품 제거
// ========================================
export const rubensMasterworks = {
  'rubens-descent': {
    name: '십자가에서 내려지심',
    nameEn: 'Descent from the Cross',
    prompt: 'Peter Paul Rubens "Descent from the Cross" (1612-1614), dramatic diagonal composition, pale body being lowered, rich red white drapery contrast, warm flesh dark background.',
    feature: '종교, 드라마'
  },
  'rubens-garden': {
    name: '사랑의 정원',
    nameEn: 'The Garden of Love',
    prompt: 'Peter Paul Rubens "The Garden of Love" (c.1633), aristocratic couples in lush garden, elegant silk costumes, warm golden light, romantic Baroque celebration.',
    feature: '연인, 정원'
  }
};

// ========================================
// 12. 렘브란트 (3개)
// ========================================
export const rembrandtMasterworks = {
  'rembrandt-nightwatch': {
    name: '야경',
    nameEn: 'The Night Watch',
    prompt: 'Rembrandt "The Night Watch" (1642), dramatic group portrait emerging from darkness, golden spotlight illuminating central figures, deep chiaroscuro rich blacks.',
    feature: '그룹, 빛'
  },
  'rembrandt-selfportrait': {
    name: '자화상',
    nameEn: 'Self-Portrait',
    prompt: 'Rembrandt "Self-Portrait" (1659), penetrating psychological gaze, warm golden light on face emerging from darkness, rich brown and gold palette.',
    feature: '자화상, 심리'
  },
  'rembrandt-prodigal': {
    name: '돌아온 탕자',
    nameEn: 'Return of the Prodigal Son',
    prompt: 'Rembrandt "Return of the Prodigal Son" (c.1668), kneeling son embraced by father in warm golden light against deep darkness, tender reunion, glowing reds golds.',
    feature: '용서, 감동'
  }
};

// ========================================
// 13. 벨라스케스 (3개)
// ========================================
export const velazquezMasterworks = {
  'velazquez-meninas': {
    name: '시녀들',
    nameEn: 'Las Meninas',
    prompt: 'Diego Velázquez "Las Meninas" (1656), complex spatial arrangement, Infanta center with maids, artist at easel, mirror reflection, silver-grey palette.',
    feature: '궁정, 공간'
  },
  'velazquez-pope': {
    name: '교황 인노켄티우스 10세',
    nameEn: 'Portrait of Pope Innocent X',
    prompt: 'Diego Velázquez "Portrait of Pope Innocent X" (1650), intense penetrating gaze, crimson papal robes and cap, psychological intensity, rich reds muted background.',
    feature: '초상, 위엄'
  },
  'velazquez-breda': {
    name: '브레다의 항복',
    nameEn: 'Surrender of Breda',
    prompt: 'Diego Velázquez "Surrender of Breda" (1634-1635), gracious surrender scene, forest of lances behind troops, atmospheric landscape, subtle silver-grey palette.',
    feature: '역사, 항복'
  }
};

// ========================================
// 14. 와토 (3개)
// ========================================
export const watteauMasterworks = {
  'watteau-cythera': {
    name: '키테라 섬으로의 순례',
    nameEn: 'Pilgrimage to Cythera',
    prompt: 'Antoine Watteau "Pilgrimage to Cythera" (1717), fête galante aristocratic couples departing, dreamy pastoral landscape, shimmering silk pale pastel rose gold.',
    feature: '연인, 출발'
  },
  'watteau-pierrot': {
    name: '피에로',
    nameEn: 'Pierrot (Gilles)',
    prompt: 'Antoine Watteau "Pierrot" (c.1718-1719), solitary clown in white satin standing frontally, melancholic dreamy expression, soft silvery light, poetic mood.',
    feature: '광대, 고독'
  },
  'watteau-fete': {
    name: '사랑의 축제',
    nameEn: 'The Pleasures of the Ball',
    prompt: 'Antoine Watteau "The Pleasures of the Ball" (c.1717), elegant outdoor gathering shimmering silk musicians, dreamy parkland, pale pastel palette.',
    feature: '축제, 우아'
  }
};

// ========================================
// 15. 부셰 (2개) - v69: 누드 작품 제거
// ========================================
export const boucherMasterworks = {
  'boucher-pompadour': {
    name: '퐁파두르 부인',
    nameEn: 'Madame de Pompadour',
    prompt: 'François Boucher "Madame de Pompadour" (1756), aristocratic portrait luxurious setting, elaborate silk gown with roses, powder blue pink palette.',
    feature: '초상, 귀족'
  },
  'boucher-breakfast': {
    name: '아침 식사',
    nameEn: 'Le Déjeuner',
    prompt: 'François Boucher "Le Déjeuner" (1739), elegant family breakfast scene Rococo interior, mother with children, soft pastel pink blue cream, intimate domestic.',
    feature: '가족, 실내'
  }
};

// ========================================
// 16. 다비드 (3개)
// ========================================
export const davidMasterworks = {
  'david-marat': {
    name: '마라의 죽음',
    nameEn: 'Death of Marat',
    prompt: 'Jacques-Louis David "Death of Marat" (1793), single figure in bathtub against plain dark background, dramatic martyrdom pose, stark simplicity, cool restrained palette.',
    feature: '단독 드라마'
  },
  'david-coronation': {
    name: '나폴레옹 대관식',
    nameEn: 'Coronation of Napoleon',
    prompt: 'Jacques-Louis David "Coronation of Napoleon" (1805-1807), grand ceremonial Neoclassical monumental composition, rich imperial reds golds, elaborate court costumes.',
    feature: '그룹 격식'
  },
  'david-horatii': {
    name: '호라티우스 형제의 맹세',
    nameEn: 'Oath of the Horatii',
    prompt: 'Jacques-Louis David "Oath of the Horatii" (1784), three brothers raising arms toward swords, Roman architecture arches, stark geometric composition.',
    feature: '그룹 맹세'
  }
};

// ========================================
// 17. 앵그르 (2개) - v69: 누드 작품 제거
// ========================================
export const ingresMasterworks = {
  'ingres-broglie': {
    name: '드 브로이 공주',
    nameEn: 'Princesse de Broglie',
    prompt: 'Jean-Auguste-Dominique Ingres "Princesse de Broglie" (1851-1853), aristocratic portrait luxurious blue satin gown, elaborate jewelry lace, formal three-quarter pose.',
    feature: '격식 초상'
  },
  'ingres-napoleon': {
    name: '왕좌의 나폴레옹',
    nameEn: 'Napoleon on his Imperial Throne',
    prompt: 'Jean-Auguste-Dominique Ingres "Napoleon on his Imperial Throne" (1806), imperial majesty frontal symmetrical pose, rich crimson velvet gold embroidery, regal authority.',
    feature: '황제, 위엄'
  }
};

// ========================================
// 18. 터너 (3개)
// ========================================
export const turnerMasterworks = {
  'turner-rain': {
    name: '비, 증기, 속도',
    nameEn: 'Rain, Steam and Speed',
    prompt: 'J.M.W. Turner "Rain, Steam and Speed" (1844), forms dissolving in atmospheric mist, train emerging from golden haze, swirling mist rain, luminous golden yellows.',
    feature: '풍경 속도'
  },
  'turner-temeraire': {
    name: '전함 테메레르',
    nameEn: 'Fighting Temeraire',
    prompt: 'J.M.W. Turner "Fighting Temeraire" (1839), ghost ship being towed at sunset, luminous orange gold sky reflected on water, melancholic twilight atmosphere.',
    feature: '풍경 석양'
  },
  'turner-slaveship': {
    name: '노예선',
    nameEn: 'Slave Ship',
    prompt: 'J.M.W. Turner "Slave Ship" (1840), turbulent dramatic seascape, blood-red sunset sky, churning waves, swirling atmospheric chaos, intense emotional color.',
    feature: '드라마틱 풍경'
  }
};

// ========================================
// 19. 들라크루아 (2개)
// ========================================
export const delacroixMasterworks = {
  'delacroix-liberty': {
    name: '민중을 이끄는 자유의 여신',
    nameEn: 'Liberty Leading the People',
    prompt: 'Eugène Delacroix "Liberty Leading the People" (1830), allegorical figure holding French tricolor flag, dynamic diagonal, revolutionary crowd surging, dramatic smoke chaos.',
    feature: '역동 그룹'
  },
  'delacroix-sardanapalus': {
    name: '사르다나팔루스의 죽음',
    nameEn: 'Death of Sardanapalus',
    prompt: 'Eugène Delacroix "Death of Sardanapalus" (1827), dramatic chaotic scene red bed, swirling figures horses, rich jewel colors, dynamic diagonal composition.',
    feature: '드라마 혼돈'
  }
};

// ========================================
// 20. 쿠르베 (3개)
// ========================================
export const courbetMasterworks = {
  'courbet-stonebreakers': {
    name: '돌 깨는 사람들',
    nameEn: 'The Stone Breakers',
    prompt: 'Gustave Courbet "The Stone Breakers" (1849), working-class laborers breaking rocks, honest unidealized portrayal, earthy palette browns ochres muted greens.',
    feature: '노동/그룹'
  },
  'courbet-burial': {
    name: '오르낭의 매장',
    nameEn: 'A Burial at Ornans',
    prompt: 'Gustave Courbet "A Burial at Ornans" (1849-1850), rural funeral procession, ordinary villagers monumental scale, dark somber palette blacks browns.',
    feature: '그룹/장례'
  },
  'courbet-bonjour': {
    name: '안녕하세요 쿠르베씨',
    nameEn: 'Bonjour Monsieur Courbet',
    prompt: 'Gustave Courbet "Bonjour Monsieur Courbet" (1854), artist meeting patron country road, outdoor sunlight, bright natural palette blue sky greens earthy browns.',
    feature: '야외/만남'
  }
};

// ========================================
// 21. 마네 (2개) - v69: 누드 작품 제거
// ========================================
export const manetMasterworks = {
  'manet-bar': {
    name: '폴리베르제르의 바',
    nameEn: 'Bar at the Folies-Bergère',
    prompt: 'Édouard Manet "Bar at the Folies-Bergère" (1882), barmaid facing viewer behind marble counter, mirror reflection crowded café, bottles oranges, bold blacks bright accents.',
    feature: '도시'
  },
  'manet-fifer': {
    name: '피리 부는 소년',
    nameEn: 'The Fifer',
    prompt: 'Édouard Manet "The Fifer" (1866), young boy in military uniform playing fife, flat bold color areas, minimal background, strong silhouette red trousers black jacket.',
    feature: '인물, 단순'
  }
};

// ========================================
// 22. 르누아르 (3개)
// ========================================
export const renoirMasterworks = {
  'renoir-boating': {
    name: '보트 파티의 점심',
    nameEn: 'Luncheon of the Boating Party',
    prompt: 'Pierre-Auguste Renoir "Luncheon of the Boating Party" (1880-1881), joyful group restaurant terrace, dappled sunlight through awning, warm peachy flesh rosy highlights.',
    feature: '그룹 햇빛'
  },
  'renoir-moulin': {
    name: '물랭 드 라 갈레트',
    nameEn: 'Bal du moulin de la Galette',
    prompt: 'Pierre-Auguste Renoir "Bal du moulin de la Galette" (1876), outdoor dance party, dappled sunlight through trees, couples dancing socializing, soft warm flesh tones.',
    feature: '축제'
  },
  'renoir-swing': {
    name: '그네',
    nameEn: 'The Swing',
    prompt: 'Pierre-Auguste Renoir "The Swing (La Balançoire)" (1876), young woman standing on swing in garden, dappled sunlight through trees, flirtatious conversation, soft warm impressionist colors.',
    feature: '그네, 햇빛'
  }
};

// ========================================
// 23. 드가 (3개)
// ========================================
export const degasMasterworks = {
  'degas-danceclass': {
    name: '무용 수업',
    nameEn: 'The Dance Class',
    prompt: 'Edgar Degas "The Dance Class" (1874), ballet dancers rehearsal studio, unusual cropped asymmetric composition, soft pastel chalky texture, pale tutus wooden floor.',
    feature: '무용'
  },
  'degas-star': {
    name: '무대 위의 무희',
    nameEn: 'The Star',
    prompt: 'Edgar Degas "The Star" (1876-1877), prima ballerina stage spotlight, dramatic diagonal composition from above, tutu catching stage light, theatrical atmosphere.',
    feature: '무용 스포트라이트'
  },
  'degas-absinthe': {
    name: '압생트',
    nameEn: 'L\'Absinthe',
    prompt: 'Edgar Degas "L\'Absinthe" (1876), melancholic café scene, off-center asymmetric composition, pale muted colors, psychological distance, unusual cropped angle.',
    feature: '각도/구도'
  }
};

// ========================================
// 24. 모네 (3개)
// ========================================
export const monetMasterworks = {
  'monet-waterlilies': {
    name: '수련',
    nameEn: 'Water Lilies',
    prompt: 'Claude Monet "Water Lilies" (1906), pond surface filling entire frame, floating lily pads flowers, shimmering water reflections, no horizon, blue-green-pink harmony.',
    feature: '물/풍경'
  },
  'monet-impression': {
    name: '인상, 해돋이',
    nameEn: 'Impression, Sunrise',
    prompt: 'Claude Monet "Impression, Sunrise" (1872), harbor at dawn, orange sun on blue water, atmospheric haze over boats, sketch-like quality, orange-blue complementary.',
    feature: '풍경 새벽'
  },
  'monet-parasol': {
    name: '양산을 든 여인',
    nameEn: 'Woman with a Parasol',
    prompt: 'Claude Monet "Woman with a Parasol" (1875), figure on hilltop against bright sky, white dress billowing wind, parasol creating shade, grass clouds in motion.',
    feature: '야외 인물'
  }
};

// ========================================
// 25. 카유보트 (3개)
// ========================================
export const caillebotteMasterworks = {
  'caillebotte-paris': {
    name: '파리 거리, 비 오는 날',
    nameEn: 'Paris Street, Rainy Day',
    prompt: 'Gustave Caillebotte "Paris Street, Rainy Day" (1877), modern urban scene umbrellas, dramatic one-point perspective, wet cobblestone reflections, Haussmann architecture.',
    feature: '도시'
  },
  'caillebotte-floor': {
    name: '마루 긁는 사람들',
    nameEn: 'The Floor Scrapers',
    prompt: 'Gustave Caillebotte "The Floor Scrapers" (1875), workers hands knees scraping wooden floor, dramatic perspective from above, bare muscular backs, sunlight window.',
    feature: '남성 노동'
  },
  'caillebotte-window': {
    name: '창가의 남자',
    nameEn: 'Man at the Window',
    prompt: 'Gustave Caillebotte "Man at the Window" (1875), male figure from behind looking out window Haussmann balcony view, dramatic silhouette bright Paris street.',
    feature: '남성 단독'
  }
};

// ========================================
// 26. 반 고흐 (4개)
// ========================================
export const vangoghMasterworks = {
  'vangogh-starrynight': {
    name: '별이 빛나는 밤',
    nameEn: 'The Starry Night',
    prompt: 'Vincent van Gogh "The Starry Night" (1889), swirling spirals in night sky, cobalt blue chrome yellow contrast, vertical cypress, stars with concentric halos.',
    feature: '밤/소용돌이'
  },
  'vangogh-cafe': {
    name: '밤의 카페 테라스',
    nameEn: 'Café Terrace at Night',
    prompt: 'Vincent van Gogh "Café Terrace at Night" (1888), yellow gaslight against deep blue starry sky, cobblestone perspective, warm café glow, yellow-blue complementary.',
    feature: '밤/거리'
  },
  'vangogh-sunflowers': {
    name: '해바라기',
    nameEn: 'Sunflowers',
    prompt: 'Vincent van Gogh "Sunflowers" (1888), chrome yellow dominating 80% palette, sunflower petals in vase, ochre and orange accents, thick impasto texture.',
    feature: '정물/꽃'
  },
  'vangogh-selfportrait': {
    name: '회색 펠트 모자 자화상',
    nameEn: 'Self-Portrait with Grey Felt Hat',
    prompt: 'Vincent van Gogh "Self-Portrait with Grey Felt Hat" (1887), EXPLOSIVE RADIAL brushstrokes emanating from face, intense blue swirling background, grey felt hat, strong directional strokes.',
    feature: '남성/터치강렬'
  },
  'vangogh-seascape': {
    name: '생트마리 바다',
    nameEn: 'Seascape near Les Saintes-Maries-de-la-Mer',
    prompt: 'Vincent van Gogh "Seascape near Les Saintes-Maries-de-la-Mer" (1888), turbulent Mediterranean waves, white sailboats, deep blue green sea, dynamic wave brushstrokes, bright daylight.',
    feature: '바다/낮풍경'
  },
  'vangogh-wheatfield': {
    name: '사이프러스 밀밭',
    nameEn: 'Wheat Field with Cypresses',
    prompt: 'Vincent van Gogh "Wheat Field with Cypresses" (1889), golden wheat field, dark towering cypress tree, INTENSELY SWIRLING white clouds, cobalt blue sky, dramatic turbulent atmosphere.',
    feature: '들판/소용돌이'
  }
};

// ========================================
// 27. 고갱 (3개)
// ========================================
export const gauguinMasterworks = {
  'gauguin-tahitian': {
    name: '타히티 여인들',
    nameEn: 'Tahitian Women',
    prompt: 'Paul Gauguin "Tahitian Women" (1891), tropical setting, flat bold areas pure saturated color, decorative floral patterns, rich tropical orange turquoise pink.',
    feature: '이국 인물'
  },
  'gauguin-where': {
    name: '우리는 어디서 왔는가',
    nameEn: 'Where Do We Come From?',
    prompt: 'Paul Gauguin "Where Do We Come From?" (1897-1898), frieze-like composition philosophical narrative birth to death, flat decorative colors, deep blue gold palette.',
    feature: '철학'
  },
  'gauguin-christ': {
    name: '황색 그리스도',
    nameEn: 'Yellow Christ',
    prompt: 'Paul Gauguin "Yellow Christ" (1889), bold yellow crucifix autumn landscape, flat areas pure unmixed color, cloisonnist dark outlines, symbolic religious.',
    feature: '종교/색채'
  }
};

// ========================================
// 28. 세잔 (3개)
// ========================================
export const cezanneMasterworks = {
  'cezanne-apples': {
    name: '사과 바구니',
    nameEn: 'Basket of Apples',
    prompt: 'Paul Cézanne "Basket of Apples" (c.1893), geometric structured still life, tilted table perspective, apples solid spherical forms, multiple viewpoints, warm earth tones.',
    feature: '정물'
  },
  'cezanne-montagne': {
    name: '생트빅투아르 산',
    nameEn: 'Mont Sainte-Victoire',
    prompt: 'Paul Cézanne "Mont Sainte-Victoire" (c.1902-1904), geometric landscape, mountain structured patches of color, parallel constructive brushstrokes, blue-green-ochre.',
    feature: '풍경'
  },
  'cezanne-cards': {
    name: '카드 놀이꾼',
    nameEn: 'The Card Players',
    prompt: 'Paul Cézanne "The Card Players" (c.1890-1892), figures at table playing cards solid geometric forms, earth-tone palette, quiet concentrated atmosphere.',
    feature: '그룹'
  }
};

// ========================================
// 30. 마티스 (4개)
// ========================================
export const matisseMasterworks = {
  'matisse-greenstripe': {
    name: '초록 줄무늬',
    nameEn: 'The Green Stripe',
    prompt: 'Henri Matisse "The Green Stripe" (1905), bold GREEN STRIPE down center of face dividing in half, left warm yellow-pink-orange, right cool green-purple-blue, completely flat.',
    feature: '인물/색상해방'
  },
  'matisse-purplecoat': {
    name: '보라색 코트',
    nameEn: 'Woman in Purple Coat',
    prompt: 'Henri Matisse "Woman in Purple Coat" (1937), bold flat pure Fauvist colors, purple coat green-orange background, simplified elegant forms.',
    feature: '인물/우아함'
  },
  'matisse-dance': {
    name: '춤',
    nameEn: 'The Dance',
    prompt: 'Henri Matisse "The Dance" (1910), only THREE colors brilliant RED-ORANGE figures, pure COBALT BLUE sky, vibrant EMERALD GREEN ground, dancing circle, extreme simplification.',
    feature: '그룹'
  },
  'matisse-redroom': {
    name: '붉은 방',
    nameEn: 'The Red Room',
    prompt: 'Henri Matisse "The Red Room" (1908), dominant brilliant RED flooding walls table, decorative blue floral arabesque patterns, flat compressed perspective, green garden window.',
    feature: '실내'
  }
};

// ========================================
// 31. 드랭 (3개)
// ========================================
export const derainMasterworks = {
  'derain-collioure': {
    name: '콜리우르 항구',
    nameEn: 'Port of Collioure',
    prompt: 'André Derain "Port of Collioure" (1905), Fauvist landscape boats in harbor, bold unmixed pure colors maximum saturation, flat decorative color areas.',
    feature: '풍경'
  },
  'derain-charingcross': {
    name: '런던 다리',
    nameEn: 'Charing Cross Bridge',
    prompt: 'André Derain "Charing Cross Bridge" (1906), Fauvist urban landscape, Thames river bold arbitrary colors, London skyline, pure intense hues liberated from reality.',
    feature: '풍경 도시'
  },
  'derain-matisse': {
    name: '마티스 초상',
    nameEn: 'Portrait of Matisse',
    prompt: 'André Derain "Portrait of Matisse" (1905), Fauvist portrait bold non-naturalistic colors face background, pure unmixed color areas.',
    feature: '인물'
  }
};

// ========================================
// 32. 블라맹크 (3개)
// ========================================
export const vlaminckMasterworks = {
  'vlaminck-chatou': {
    name: '샤투의 집들',
    nameEn: 'Houses at Chatou',
    prompt: 'Maurice de Vlaminck "Houses at Chatou" (1905), violent Fauvist colors maximum intensity, houses aggressive reds blues, emotional color explosion.',
    feature: '격렬'
  },
  'vlaminck-redtrees': {
    name: '붉은 나무들',
    nameEn: 'Red Trees',
    prompt: 'Maurice de Vlaminck "Red Trees" (1906), explosive red orange trees violent emotional color, turbulent sky, landscape as emotional expression.',
    feature: '감정'
  },
  'vlaminck-bougival': {
    name: '부지발의 식당',
    nameEn: 'Restaurant at Bougival',
    prompt: 'Maurice de Vlaminck "Restaurant at Bougival" (1905), intense pure colors bold contrasts, emotional intensity, violent color combinations.',
    feature: '색채'
  }
};

// ========================================
// 33. 클림트 (3개)
// ========================================
export const klimtMasterworks = {
  'klimt-kiss': {
    name: '키스',
    nameEn: 'The Kiss',
    prompt: 'Gustav Klimt "The Kiss" (1907-1908), two embracing wrapped gold leaf robes, geometric patterns rectangles male circles female, flower meadow cliff, Byzantine mosaic gold.',
    feature: '연인/황금'
  },
  'klimt-judith': {
    name: '유디트',
    nameEn: 'Judith I',
    prompt: 'Gustav Klimt "Judith I" (1901), wide gold choker necklace prominent, confident powerful expression, GOLD LEAF decorative patterns throughout, rich jewel-tone colors, Art Nouveau elegance.',
    feature: '여성/힘'
  },
  'klimt-treeoflife': {
    name: '생명의 나무',
    nameEn: 'The Tree of Life',
    prompt: 'Gustav Klimt "The Tree of Life" (1905-1909), spiral branches swirling outward gold bronze decorative swirls, elaborate curving patterns, gold leaf texture.',
    feature: '장식/생명'
  },
};

// ========================================
// 34. 뭉크 (3개)
// ========================================
export const munchMasterworks = {
  'munch-scream': {
    name: '절규',
    nameEn: 'The Scream',
    prompt: 'Edvard Munch "The Scream" (1893), WAVY DISTORTED swirling LINES throughout, elongated oval face with hands on ears expressing TERROR, BLOOD RED orange sky, bridge setting, PRESERVE ORIGINAL FACIAL FEATURES while applying expressionist distortion.',
    feature: '불안',
    attractiveException: true,
    expressionRule: 'fear/anxiety allowed, NO bright, NO smiling'
  },
  'munch-madonna': {
    name: '마돈나',
    nameEn: 'Madonna',
    prompt: 'by Edvard Munch, Munch Expressionist art style, wavy distorted swirling lines throughout entire image, flowing dark hair spreading like HALO around head, reddish glowing aura, pale luminous skin, mysterious atmosphere, dark moody background.',
    feature: '신비/관능',
    expressionRule: 'mysterious and contemplative expression, soft subtle mood'
  },
  'munch-danceoflife': {
    name: '생의 춤',
    nameEn: 'The Dance of Life',
    prompt: 'Edvard Munch "The Dance of Life" (1899-1900), COUPLES DANCING on moonlit shore, central couple in RED embracing, figures in WHITE and BLACK on sides symbolizing life stages, WAVY DISTORTED forms, moon reflection on water, emotional psychological depth, PRESERVE ORIGINAL FACIAL FEATURES.',
    feature: 'GROUP/로맨틱',
    expressionRule: 'romantic/melancholic allowed'
  }
};

// ========================================
// 35. 코코슈카 (3개)
// ========================================
export const kokoschkaMasterworks = {
  'kokoschka-bride': {
    name: '바람의 신부',
    nameEn: 'Bride of the Wind',
    prompt: 'Oskar Kokoschka "Bride of the Wind" (1913-1914), two lovers embracing TURBULENT COSMIC SWIRLING clouds waves, intense psychological portraiture, emotional turmoil.',
    feature: '격정, 폭풍'
  },
  'kokoschka-degenerate': {
    name: '퇴폐 미술가의 자화상',
    nameEn: 'Self-Portrait of a Degenerate Artist',
    prompt: 'Oskar Kokoschka "Self-Portrait of a Degenerate Artist" (1937), INTENSE DEFIANT self-portrait, BLUE GREEN OCHRE flesh tones, psychological vulnerability artistic pride.',
    feature: '저항, 자화상'
  },
  'kokoschka-double': {
    name: '2인 초상',
    nameEn: 'Double Portrait',
    prompt: 'Oskar Kokoschka "Double Portrait" (1912-1913), TWO FIGURES intimate psychological portrait, WARM EARTH TONES blue accents, AGITATED NERVOUS brushwork.',
    feature: '2인, 심리'
  }
};

// ========================================
// 36. 키르히너 (3개)
// ========================================
export const kirchnerMasterworks = {
  'kirchner-berlin': {
    name: '베를린 거리 풍경',
    nameEn: 'Berlin Street Scene',
    prompt: 'Ernst Ludwig Kirchner "Berlin Street Scene" (1913), ANGULAR JAGGED urban figures, ACID GREEN HOT PINK ELECTRIC BLUE palette, MASK-LIKE SIMPLIFIED faces, urban tension.',
    feature: '도시'
  },
  'kirchner-soldier': {
    name: '군인으로서의 자화상',
    nameEn: 'Self-Portrait as a Soldier',
    prompt: 'Ernst Ludwig Kirchner "Self-Portrait as a Soldier" (1915), ANGULAR figure military uniform, ACID GREEN HOT PINK ELECTRIC BLUE, MASK-LIKE face, psychological trauma.',
    feature: '군복, 트라우마'
  },
  'kirchner-oldwomen': {
    name: '세 명의 노부인들',
    nameEn: 'Three Old Women',
    prompt: 'Ernst Ludwig Kirchner "Three Old Women" (1925), THREE ANGULAR figures BLACK CLOTHING, green mountainous landscape dark cypress, MASK-LIKE faces BLUE PINK flesh.',
    feature: '검은 옷, 풍경'
  }
};

// ========================================
// 37. 피카소 (4개) - control_strength 0.2
// ========================================
export const picassoMasterworks = {
  'picasso-guernica': {
    name: '게르니카',
    nameEn: 'Guernica',
    prompt: 'Pablo Picasso "Guernica" (1937), BLACK WHITE GREY ONLY monochrome, FACE FRAGMENTED Cubist angular planes, screaming figures, bold black outlines, anti-war.',
    feature: '흑백, 전쟁'
  },
  'picasso-musicians': {
    name: '세 명의 음악가',
    nameEn: 'Three Musicians',
    prompt: 'Pablo Picasso "Three Musicians" (1921), Synthetic Cubism FLAT GEOMETRIC SHAPES like paper cutouts collage, BOLD PRIMARY COLORS red blue yellow brown black, angular masked figures, musical instruments guitar clarinet.',
    feature: '그룹, 콜라주'
  },
  'picasso-doramaar': {
    name: '도라 마르의 초상',
    nameEn: 'Portrait of Dora Maar',
    prompt: 'Pablo Picasso "Portrait of Dora Maar" (1937), Cubist DOUBLE PROFILE showing FRONT and SIDE view simultaneously, VIBRANT COLORS red yellow green blue, sharp angular geometric face planes, seated pose, bold black outlines.',
    feature: '초상화, 컬러풀'
  }
};

// ========================================
// 38. 프리다 칼로 (4개)
// ========================================
export const fridaMasterworks = {
  'frida-parrots': {
    name: '나와 앵무새들',
    nameEn: 'Me and My Parrots',
    prompt: 'Frida Kahlo "Me and My Parrots" (1941), surrounded by colorful parrots, lush tropical foliage background, vibrant Mexican folk colors, direct gaze.',
    feature: '동물, 앵무새'
  },
  'frida-thornnecklace': {
    name: '가시 목걸이와 벌새',
    nameEn: 'Self-Portrait with Thorn Necklace',
    prompt: 'Frida Kahlo "Self-Portrait with Thorn Necklace" (1940), thorn necklace around neck dead hummingbird, black cat monkey shoulders, tropical foliage.',
    feature: '가시, 상징'
  },
  'frida-monkeys': {
    name: '원숭이와 자화상',
    nameEn: 'Self-Portrait with Monkeys',
    prompt: 'Frida Kahlo "Self-Portrait with Monkeys" (1943), spider monkeys embracing from behind, lush green tropical leaves, vibrant Mexican colors, direct intense gaze.',
    feature: '원숭이, 친밀'
  }
};

// ========================================
// 40. 마그리트 (5개)
// ========================================
export const magritteMasterworks = {
  'magritte-sonofman': {
    name: '사람의 아들',
    nameEn: 'The Son of Man',
    prompt: 'René Magritte "The Son of Man" (1964), single floating green apple hovering front of face partially obscuring, dark suit bowler hat, overcast grey sky.',
    feature: '사과, 가림'
  },
  'magritte-golconda': {
    name: '골콘다',
    nameEn: 'Golconda',
    prompt: 'René Magritte "Golconda" (1953), identical men dark suits bowler hats floating/raining against Belgian townhouse buildings blue sky.',
    feature: '반복, 부유'
  },
  'magritte-bowlerhat': {
    name: '중절모를 쓴 남자',
    nameEn: 'Man in a Bowler Hat',
    prompt: 'René Magritte "Man in a Bowler Hat" (1964), white dove flying front of face covering most, dark suit black bowler hat, overcast cloudy grey sky.',
    feature: '비둘기, 은폐'
  },
  'magritte-humancondition': {
    name: '인간의 조건',
    nameEn: 'The Human Condition',
    prompt: 'René Magritte "The Human Condition" (1933), easel canvas showing exact same view as scene behind seamless illusion, window frame, landscape continuing canvas to reality.',
    feature: '캔버스, 착시'
  },
  'magritte-empireoflight': {
    name: '빛의 제국',
    nameEn: 'The Empire of Light',
    prompt: 'René Magritte "The Empire of Light" (1954), bright blue daytime sky fluffy clouds above combined dark nighttime street below, glowing lamplight, impossible day night coexistence.',
    feature: '낮밤 공존'
  }
};

// ========================================
// 41. 미로 (3개)
// ========================================
export const miroMasterworks = {
  'miro-catalan': {
    name: '카탈루냐 풍경',
    nameEn: 'The Catalan Landscape',
    prompt: 'Joan Miró "The Catalan Landscape" (1923-1924), playful biomorphic shapes bright yellow orange background, abstract hunter geometric head, primary colors red blue yellow black.',
    feature: '풍경, 사냥꾼'
  },
  'miro-constellation': {
    name: '별자리 시리즈',
    nameEn: 'Constellations Series',
    prompt: 'Joan Miró "Constellations" (1940-1941), dense network biomorphic shapes muted background, stars moons eyes connected thin black lines, primary color accents.',
    feature: '별, 우주'
  },
  'miro-bluestar': {
    name: '푸른 별 앞의 여인',
    nameEn: 'Woman in Front of the Sun',
    prompt: 'Joan Miró "Woman in Front of the Sun" (1950), simplified biomorphic figure exaggerated curves, large radiating sun/star shape, bold primary red blue yellow black light ground.',
    feature: '여인, 태양'
  }
};

// ========================================
// 42. 샤갈 (2개) - v70
// ========================================
export const chagallMasterworks = {
  'chagall-lovers': {
    name: '사랑하는 연인들과 꽃',
    nameEn: 'Lovers with Flowers',
    prompt: 'Marc Chagall "Lovers with Flowers" (1927), embracing couple surrounded by vibrant flowers, soft pastel colors with warm coral pink blue green, romantic poetic atmosphere.',
    feature: '커플, 꽃다발'
  },
  'chagall-labranche': {
    name: '나뭇가지',
    nameEn: 'La Branche',
    prompt: 'Marc Chagall "La Branche" (1976), lovers among flowering branches, warm pastel palette rich red pink coral, romantic poetic nostalgic atmosphere.',
    feature: '커플, 자연'
  },
  'chagall-lamariee': {
    name: '신부',
    nameEn: 'La Mariée',
    prompt: 'Marc Chagall "La Mariée" (1950), ethereal bride in flowing red dress holding bouquet, dreamlike floating figures, deep blue nocturnal background with village and moon, rich jewel tones crimson ultramarine emerald, surreal poetic fantasy.',
    feature: '신부, 환상'
  }
};

// ========================================
// 43. 리히텐슈타인 (5개)
// ========================================
export const lichtensteinMasterworks = {
  'lichtenstein-inthecar': {
    name: '차 안에서',
    nameEn: 'In the Car',
    prompt: 'COMIC PANEL FRAME with THICK BLACK BORDER around entire image, Roy Lichtenstein "In the Car" (1963), glamorous couple close-up, woman with ribbon hair man in profile, EXTREMELY LARGE Ben-Day dots 15mm+ covering ALL skin and background, ULTRA THICK BLACK INK OUTLINES 20mm+ like bold comic book printing, FLAT primary colors ONLY red blue yellow, HEAVY BLACK CONTOUR LINES on EVERY edge, NO gradients, NOT thin lines, NOT realistic.',
    feature: '커플, 리본머리'
  },
  'lichtenstein-mmaybe': {
    name: '아마도',
    nameEn: 'M-Maybe',
    prompt: 'COMIC PANEL FRAME with THICK BLACK BORDER around entire image, Roy Lichtenstein "M-Maybe" (1965), blonde woman close-up face looking sideways, EXTREMELY LARGE Ben-Day dots 15mm+ covering ALL skin and background, ULTRA THICK BLACK INK OUTLINES 20mm+ like bold comic book printing, FLAT primary colors ONLY, HEAVY BLACK CONTOUR LINES on EVERY edge, NO gradients, NOT thin lines, NOT realistic.',
    feature: '여성, 클로즈업'
  },
  'lichtenstein-forgetit': {
    name: '날 잊어',
    nameEn: 'Forget It! Forget Me!',
    prompt: 'COMIC PANEL FRAME with THICK BLACK BORDER around entire image, Roy Lichtenstein "Forget It! Forget Me!" (1962), dramatic couple scene man with black hair woman with blonde hair, EXTREMELY LARGE Ben-Day dots 15mm+ covering ALL skin and background, ULTRA THICK BLACK INK OUTLINES 20mm+ like bold comic book printing, FLAT primary colors ONLY, HEAVY BLACK CONTOUR LINES on EVERY edge, NO gradients, NOT thin lines, NOT realistic.',
    feature: '커플, 드라마틱'
  },
  'lichtenstein-ohhhalright': {
    name: '오 알았어',
    nameEn: 'Ohhh...Alright...',
    prompt: 'COMIC PANEL FRAME with THICK BLACK BORDER around entire image, Roy Lichtenstein "Ohhh...Alright..." (1964), woman on telephone with expressive face, EXTREMELY LARGE Ben-Day dots 15mm+ covering ALL skin and background, ULTRA THICK BLACK INK OUTLINES 20mm+ like bold comic book printing, FLAT primary colors ONLY, HEAVY BLACK CONTOUR LINES on EVERY edge, NO gradients, NOT thin lines, NOT realistic.',
    feature: '여성, 전화'
  },
  'lichtenstein-stilllife': {
    name: '정물화',
    nameEn: 'Still Life with Palette',
    prompt: 'COMIC PANEL FRAME with THICK BLACK BORDER around entire image, Roy Lichtenstein "Still Life with Palette" (1972), bottles flowers brushes household objects on table, EXTREMELY LARGE Ben-Day dots 15mm+ covering ALL surfaces, ULTRA THICK BLACK INK OUTLINES 20mm+ like bold comic book printing, FLAT primary colors ONLY yellow red blue, HEAVY BLACK CONTOUR LINES on EVERY edge, NO gradients, NOT thin lines, NOT realistic.',
    feature: '정물, 오브제'
  }
};

// ========================================
// 통합 대표작
// ========================================
export const allMovementMasterworks = {
  ...romanMosaicMasterworks,
  ...gothicMasterworks,
  ...byzantineMasterworks,
  ...islamicMiniatureMasterworks,
  ...botticelliMasterworks,
  ...leonardoMasterworks,
  ...titianMasterworks,
  ...michelangeloMasterworks,
  ...raphaelMasterworks,
  ...caravaggioMasterworks,
  ...rubensMasterworks,
  ...rembrandtMasterworks,
  ...velazquezMasterworks,
  ...watteauMasterworks,
  ...boucherMasterworks,
  ...davidMasterworks,
  ...ingresMasterworks,
  ...turnerMasterworks,
  ...delacroixMasterworks,
  ...courbetMasterworks,
  ...manetMasterworks,
  ...renoirMasterworks,
  ...degasMasterworks,
  ...monetMasterworks,
  ...caillebotteMasterworks,
  ...vangoghMasterworks,
  ...gauguinMasterworks,
  ...cezanneMasterworks,
  ...matisseMasterworks,
  ...derainMasterworks,
  ...vlaminckMasterworks,
  ...klimtMasterworks,
  ...munchMasterworks,
  ...kokoschkaMasterworks,
  ...kirchnerMasterworks,
  ...picassoMasterworks,
  ...fridaMasterworks,
  ...magritteMasterworks,
  ...miroMasterworks,
  ...chagallMasterworks,
  ...lichtensteinMasterworks
};

/**
 * 대표작 프롬프트 가져오기
 */
export function getMovementMasterwork(workKey) {
  const normalized = workKey.toLowerCase().trim().replace(/\s+/g, '-');
  return allMovementMasterworks[normalized] || null;
}

/**
 * 화가별 대표작 목록
 */
export function getArtistMasterworkList(artistKey) {
  const normalized = artistKey.toLowerCase().trim();
  
  const artistMasterworks = {
    'roman-mosaic': ['mosaic-alexander', 'mosaic-cave-canem', 'mosaic-dionysus', 'mosaic-oceanus', 'mosaic-seasons', 'mosaic-nile'],
    'gothic': ['gothic-chartres', 'gothic-notredame', 'gothic-saintechapelle'],
    'byzantine': ['byzantine-justinian', 'byzantine-theodora', 'byzantine-deesis', 'byzantine-pantocrator'],
    'islamic-miniature': ['islamic-youth', 'islamic-miraj', 'islamic-simurgh', 'islamic-lovers', 'islamic-rustam'],
    'botticelli': ['botticelli-primavera', 'botticelli-venusmars'],
    'leonardo': ['leonardo-lastsupper', 'leonardo-virginrocks'],
    'titian': ['titian-bacchus', 'titian-assumption'],
    'michelangelo': ['michelangelo-adam', 'michelangelo-lastjudgment'],
    'raphael': ['raphael-athens', 'raphael-sistinamadonna', 'raphael-galatea'],
    'caravaggio': ['caravaggio-matthew', 'caravaggio-supper'],
    'rubens': ['rubens-descent', 'rubens-garden'],
    'rembrandt': ['rembrandt-nightwatch', 'rembrandt-selfportrait', 'rembrandt-prodigal'],
    'velazquez': ['velazquez-meninas', 'velazquez-pope', 'velazquez-breda'],
    'watteau': ['watteau-cythera', 'watteau-pierrot', 'watteau-fete'],
    'boucher': ['boucher-pompadour', 'boucher-breakfast'],
    'david': ['david-marat', 'david-coronation', 'david-horatii'],
    'ingres': ['ingres-broglie', 'ingres-napoleon'],
    'turner': ['turner-rain', 'turner-temeraire', 'turner-slaveship'],
    'delacroix': ['delacroix-liberty', 'delacroix-sardanapalus'],
    'courbet': ['courbet-stonebreakers', 'courbet-burial', 'courbet-bonjour'],
    'manet': ['manet-bar', 'manet-fifer'],
    'renoir': ['renoir-boating', 'renoir-moulin', 'renoir-swing'],
    'degas': ['degas-danceclass', 'degas-star', 'degas-absinthe'],
    'monet': ['monet-waterlilies', 'monet-impression', 'monet-parasol'],
    'caillebotte': ['caillebotte-paris', 'caillebotte-floor', 'caillebotte-window'],
    'vangogh': ['vangogh-starrynight', 'vangogh-cafe', 'vangogh-sunflowers', 'vangogh-selfportrait', 'vangogh-seascape', 'vangogh-wheatfield'],
    'gauguin': ['gauguin-tahitian', 'gauguin-where', 'gauguin-christ'],
    'cezanne': ['cezanne-apples', 'cezanne-montagne', 'cezanne-cards'],
    'matisse': ['matisse-greenstripe', 'matisse-purplecoat', 'matisse-dance', 'matisse-redroom'],
    'derain': ['derain-collioure', 'derain-charingcross', 'derain-matisse'],
    'vlaminck': ['vlaminck-chatou', 'vlaminck-redtrees', 'vlaminck-bougival'],
    'klimt': ['klimt-kiss', 'klimt-judith', 'klimt-treeoflife'],
    'munch': ['munch-scream', 'munch-madonna', 'munch-danceoflife'],
    'kokoschka': ['kokoschka-bride', 'kokoschka-degenerate', 'kokoschka-double'],
    'kirchner': ['kirchner-berlin', 'kirchner-soldier', 'kirchner-oldwomen'],
    'picasso': ['picasso-guernica', 'picasso-musicians', 'picasso-doramaar'],
    'frida': ['frida-parrots', 'frida-thornnecklace', 'frida-monkeys'],
    'magritte': ['magritte-sonofman', 'magritte-golconda', 'magritte-bowlerhat', 'magritte-humancondition', 'magritte-empireoflight'],
    'miro': ['miro-catalan', 'miro-constellation', 'miro-bluestar'],
    'chagall': ['chagall-lovers', 'chagall-labranche', 'chagall-lamariee'],
    'lichtenstein': ['lichtenstein-inthecar', 'lichtenstein-mmaybe', 'lichtenstein-forgetit', 'lichtenstein-ohhhalright', 'lichtenstein-stilllife']
  };
  
  return artistMasterworks[normalized] || [];
}

// 콘솔 로그
console.log('📚 Masterworks v68.1 loaded:', Object.keys(allMovementMasterworks).length, 'masterworks with artist name + year pattern');

/**
 * AI용 대표작 가이드 (getMasterworkGuideForAI)
 * 대표작 정보를 AI 프롬프트 형태로 반환
 */
export function getMasterworkGuideForAI(workKey) {
  const masterwork = getMovementMasterwork(workKey);
  if (!masterwork) return '';
  return masterwork.prompt || '';
}

/**
 * 사조별 대표작 가이드 (getMovementMasterworkGuide)
 * 특정 사조의 모든 화가 MASTER_GUIDES를 조합하여 반환
 */
export function getMovementMasterworkGuide(movementKey) {
  // 사조별 화가 매핑
  const movementArtists = {
    // 고대/중세
    'ancient': ['roman-mosaic'],
    'medieval': ['gothic', 'byzantine', 'islamic-miniature'],
    // 르네상스
    'renaissance': ['botticelli', 'leonardo', 'titian', 'michelangelo', 'raphael'],
    // 바로크
    'baroque': ['caravaggio', 'rubens', 'rembrandt', 'velazquez'],
    // 로코코
    'rococo': ['watteau', 'boucher'],
    // 신고전/낭만/사실
    'neoclassicism-romanticism': ['david', 'ingres', 'turner', 'delacroix', 'courbet', 'manet'],
    // 인상주의
    'impressionism': ['renoir', 'monet', 'degas', 'caillebotte'],
    // 후기인상주의
    'post-impressionism': ['vangogh', 'gauguin', 'cezanne'],
    // 야수파
    'fauvism': ['matisse', 'derain', 'vlaminck'],
    // 표현주의
    'expressionism': ['munch', 'kirchner', 'kokoschka'],
    // 모더니즘
    'modernism': ['picasso', 'magritte', 'miro', 'chagall', 'lichtenstein']
  };
  
  const artists = movementArtists[movementKey];
  if (!artists || artists.length === 0) return '';
  
  // 각 화가의 MASTER_GUIDES 조합
  let guide = `\n📚 MASTERWORK SELECTION GUIDE:\n`;
  artists.forEach(artist => {
    if (MASTER_GUIDES[artist]) {
      guide += `\n${MASTER_GUIDES[artist]}\n`;
    }
  });
  
  return guide;
}

/**
 * 거장별 AI 선택 가이드 (상세 매칭 힌트 포함)
 */
const MASTER_GUIDES = {
  // ========================================
  // 고대/중세
  // ========================================
  'roman-mosaic': `
ROMAN MOSAIC - SELECT ONE:
1. "Alexander Mosaic" (알렉산더 모자이크) → battle, action, warriors, dramatic scene | Style: Pompeii battle scene, dramatic diagonal movement, warrior armor and horses, earth tones terracotta ochre
2. "Cave Canem" (개조심) → animals, pets, dogs, simple subject | Style: guard dog in black and white, simple composition, warning motif
3. "Dionysus Mosaic" (디오니소스) → celebration, party, mythology, portrait | Style: grape vines and wine imagery, banquet atmosphere, rich purple green gold
4. "Oceanus and Tethys" (오케아노스와 테티스) → water, ocean, blue tones, portrait | Style: sea god portrait, dominant ocean blue and turquoise, flowing water with fish
5. "Four Seasons Mosaic" (사계절) → portrait, face, seasonal, circular | Style: portrait bust in circular medallion, seasonal attributes, warm earth tones
6. "Nile Mosaic" (나일) → landscape, nature, animals, panoramic | Style: panoramic landscape with river, exotic wildlife hippos crocodiles, ochre terracotta blue-green

⚠️ For ANIMALS: Cave Canem or Nile Mosaic. For PORTRAITS: Four Seasons or Oceanus.`,

  'gothic': `
GOTHIC STAINED GLASS - SELECT ONE:
1. "Blue Virgin of Chartres" (샤르트르 푸른 성모) → mother and child, religious, blue dominant | Style: dominant Chartres cobalt blue, Madonna and child, ruby red accents, jewel-tone translucent
2. "Notre-Dame Rose Window" (노트르담 장미창) → circular, symmetrical, kaleidoscopic | Style: radial circular composition, kaleidoscopic symmetry, ruby sapphire emerald gold
3. "Sainte-Chapelle" (생트샤펠) → tall vertical, red dominant, biblical | Style: tall vertical composition, dominant ruby red and deep blue, biblical scenes

⚠️ ALL works: Bold black lead lines, luminous jewel-tones, light streaming through glass effect.`,

  'byzantine': `
BYZANTINE MOSAIC - SELECT ONE:
1. "Emperor Justinian" (유스티니아누스 황제) → MALE portrait, authority, power, formal | Style: imperial court scene, shimmering gold leaf background, royal purple robes, circular golden halo
2. "Empress Theodora" (테오도라 황후) → FEMALE portrait, royalty, elegant | Style: jeweled crown and pearl collar, shimmering gold background, luxurious purple and gold robes
3. "Deesis" (데이시스) → religious, central figure, sacred | Style: Christ at center with golden halo, gold background, deep blue and burgundy robes
4. "Christ Pantocrator" (판토크라토르) → intense, frontal, powerful | Style: monumental half-length figure, massive golden halo with cross, deep blue and gold, intense gaze

⚠️ For MALE: Justinian or Pantocrator. For FEMALE: Theodora.`,

  'islamic-miniature': `
ISLAMIC MINIATURE - SELECT ONE:
1. "Youth Holding a Flower" (꽃을 든 귀족) → single portrait, elegant, refined | Style: elegant S-curved posture, elaborate turban with feather, jewel tones ruby sapphire emerald gold
2. "Miraj" (미라지/승천도) → fantasy, celestial, spiritual | Style: celestial ascension through swirling clouds and flames, angels with colorful wings, gold lapis blue
3. "Simurgh" (시무르그) → animals, birds, mythical creatures | Style: magnificent giant bird with peacock-like plumage, iridescent colors, garden paradise
4. "Lovers in a Garden" (정원의 연인들) → COUPLE (2 people), romantic, garden setting | Style: moonlit garden scene, cypress trees and flowering shrubs, soft jewel tones gold blue rose
5. "Rustam Slaying the Dragon" (루스탐과 용) → action, battle, heroic | Style: epic battle warrior on rearing horse fighting dragon, dynamic diagonal, gold vermillion lapis

⚠️ For COUPLE: Lovers in a Garden. For ANIMALS: Simurgh. For ACTION: Rustam.`,

  // ========================================
  // 르네상스
  // ========================================
  'botticelli': `
SANDRO BOTTICELLI - SELECT ONE:
1. "Primavera" (프리마베라) → spring, flowers, multiple figures, mythological | Style: ethereal pale figures, diaphanous flowing fabrics, orange grove background, graceful dance-like poses
2. "Venus and Mars" (비너스와 마르스) → COUPLE, reclining, intimate | Style: reclining figures, soft flesh tones, playful satyrs, peaceful atmosphere

⚠️ Botticelli style: Elegant flowing lines, ethereal pale skin, graceful diaphanous fabrics.`,

  'leonardo': `
LEONARDO DA VINCI - SELECT ONE:
1. "Mona Lisa" (모나리자) → FEMALE portrait, mysterious, subtle smile | Style: extreme sfumato technique, mysterious smile, soft hazy atmospheric background, hands crossed
2. "The Last Supper" (최후의 만찬) → GROUP (multiple people), dramatic, interior | Style: perspective converging to center, dramatic gestures, architectural interior
3. "Virgin of the Rocks" (암굴의 성모) → religious, grotto, mystical | Style: dark grotto setting, pointing gestures, sfumato atmosphere, rocks and water

⚠️ For FEMALE portrait: Mona Lisa. For GROUP: Last Supper. Leonardo style: sfumato hazy edges.`,

  'titian': `
TITIAN - SELECT ONE:
1. "Bacchus and Ariadne" (바쿠스와 아리아드네) → dynamic, mythology, celebration | Style: dramatic leaping figure, vibrant Venetian colors, ultramarine blue sky, flowing robes
2. "Assumption of the Virgin" (성모 승천) → ascending, religious, dramatic | Style: ascending figure with arms raised, golden light from above, dramatic upward movement

⚠️ Titian style: Warm glowing golden flesh, rich luminous Venetian colors, bold loose brushwork.`,

  'michelangelo': `
MICHELANGELO - SELECT ONE:
1. "Creation of Adam" (아담의 창조) → reaching, connection, iconic | Style: two reaching hands nearly touching, powerful muscular figure, Sistine Chapel fresco
2. "The Last Judgment" (최후의 심판) → dramatic, crowded, judgment | Style: massive composition with many figures, muscular heroic bodies, dramatic movement

⚠️ Michelangelo style: Powerful heroic muscular figures, dramatic foreshortening, monumental grandeur.`,

  'raphael': `
RAPHAEL - SELECT ONE:
1. "School of Athens" (아테네 학당) → GROUP, intellectual, architectural | Style: grand architectural setting, philosophers gathered, perfect perspective, harmonious composition
2. "Sistine Madonna" (시스틴 성모) → mother and child, religious, serene | Style: Madonna holding child, parted curtains, cherubs below, serene balanced composition
3. "Triumph of Galatea" (갈라테아의 승리) → sea nymph, mythological, joyful | Style: sea nymph on shell, cherubs and sea creatures, swirling composition

⚠️ Raphael style: Perfect harmonious beauty, serene balanced composition, gentle graceful expressions.`,

  // ========================================
  // 바로크
  // ========================================
  'caravaggio': `
CARAVAGGIO - SELECT ONE:
1. "Calling of Saint Matthew" (성 마태오의 소명) → dramatic light, pointing gesture, group | Style: extreme tenebrism, intense spotlight from darkness, dramatic gesture pointing
2. "Supper at Emmaus" (엠마오의 저녁식사) → dining, revelation, dramatic | Style: moment of recognition, outstretched arms, dramatic chiaroscuro, still life on table

⚠️ Caravaggio style: EXTREME tenebrism, intense spotlight from absolute black darkness, theatrical illumination.`,

  'rubens': `
PETER PAUL RUBENS - SELECT ONE:
1. "Descent from the Cross" (십자가에서 내려지심) → dramatic, religious, multiple figures | Style: diagonal composition, muscular bodies, dramatic fabric, emotional intensity
2. "The Garden of Love" (사랑의 정원) → romantic, COUPLE or GROUP, celebration | Style: lush garden setting, elegant couples, cherubs, warm golden light

⚠️ Rubens style: Radiant luminous flesh, explosive swirling movement, rich passionate reds and golds.`,

  'rembrandt': `
REMBRANDT - SELECT ONE:
1. "The Night Watch" (야경) → GROUP, dramatic, military | Style: dramatic spotlight on figures, dark background, elaborate costumes, dynamic composition
2. "Self-Portrait" (자화상) → SINGLE portrait, introspective | Style: intense golden glow, deep mysterious shadows, thick impasto highlights on face
3. "Return of the Prodigal Son" (탕아의 귀환) → emotional, reunion, religious | Style: tender embrace, warm golden light, deep emotional connection

⚠️ For SINGLE portrait: Self-Portrait. For GROUP: Night Watch. Rembrandt style: Golden glow, deep shadows, thick impasto.`,

  'velazquez': `
DIEGO VELAZQUEZ - SELECT ONE:
1. "Las Meninas" (시녀들) → GROUP, royal, complex composition | Style: complex spatial arrangement, mirror reflection, princess with attendants, refined court elegance
2. "Portrait of Pope Innocent X" (교황 인노첸시오 10세) → MALE portrait, powerful, intense | Style: seated authority figure, brilliant red cape, piercing intense gaze
3. "Surrender of Breda" (브레다의 항복) → historical, military, GROUP | Style: spears creating vertical rhythm, moment of dignity in defeat, landscape background

⚠️ For MALE authority: Pope Innocent. For GROUP: Las Meninas. Velazquez style: Refined elegance, masterful loose brushwork, subtle silver-grey palette.`,

  // ========================================
  // 로코코
  // ========================================
  'watteau': `
ANTOINE WATTEAU - SELECT ONE:
1. "Pilgrimage to Cythera" (시테르섬의 순례) → COUPLE or GROUP, romantic, outdoor | Style: dreamy pastoral setting, elegant couples departing, soft golden light, melancholic atmosphere
2. "Pierrot" (피에로) → SINGLE portrait, melancholic, theatrical | Style: white costume standing alone, wistful expression, commedia dell'arte character
3. "The Pleasures of the Ball" (사랑의 축제) → GROUP, celebration, garden party | Style: elegant aristocrats in garden, musical instruments, soft feathery brushwork

⚠️ Watteau style: Delicate feathery brushwork, soft dreamy pastoral scenes, romantic melancholic atmosphere.`,

  'boucher': `
FRANÇOIS BOUCHER - SELECT ONE:
1. "Madame de Pompadour" (퐁파두르 부인) → FEMALE portrait, elegant, aristocratic | Style: luxurious dress with ribbons and roses, books and artistic objects, soft rosy flesh tones
2. "Le Dejeuner" (아침 식사) → interior, domestic, family scene | Style: intimate bourgeois interior, mother and children, warm pastel palette

⚠️ Boucher style: Soft rosy flesh tones, light pastel palette, playful decorative elegance.`,

  // ========================================
  // 신고전/낭만/사실
  // ========================================
  'david': `
JACQUES-LOUIS DAVID - SELECT ONE:
1. "Death of Marat" (마라의 죽음) → dramatic, death scene, political | Style: stark dramatic lighting, figure in bath, sparse background, heroic martyrdom
2. "Coronation of Napoleon" (나폴레옹 대관식) → GROUP, ceremony, grand | Style: massive ceremonial scene, elaborate costumes, golden imperial splendor
3. "Oath of the Horatii" (호라티우스의 맹세) → GROUP, dramatic gesture, heroic | Style: three brothers with swords, dramatic arm gestures, crisp classical architecture

⚠️ David style: Crisp clear outlines, heroic idealized figures, dramatic moral intensity.`,

  'ingres': `
JEAN-AUGUSTE-DOMINIQUE INGRES - SELECT ONE:
1. "Princesse de Broglie" (드 브로이 공주) → FEMALE portrait, elegant, aristocratic | Style: luxurious blue satin dress, porcelain-smooth skin, refined aristocratic beauty
2. "Napoleon on His Imperial Throne" (왕좌의 나폴레옹) → MALE portrait, authority, imperial | Style: frontal enthroned figure, elaborate imperial regalia, Byzantine-like symmetry

⚠️ For FEMALE: Princesse de Broglie. For MALE: Napoleon. Ingres style: Smooth flowing contours, porcelain-smooth skin, elegant sinuous curves.`,

  'turner': `
J.M.W. TURNER - SELECT ONE:
1. "Rain, Steam and Speed" (비, 증기, 속도) → train, motion, atmospheric | Style: locomotive emerging from mist, diagonal composition, golden atmospheric haze
2. "Fighting Temeraire" (전함 테메레르) → ship, sunset, nostalgic | Style: ghost-like ship towed by tugboat, blazing orange sunset, reflections on water
3. "Slave Ship" (노예선) → dramatic, stormy sea, sunset | Style: turbulent waves, blood-red sunset, dramatic atmospheric chaos

⚠️ Turner style: Atmospheric sublime light, swirling mist dissolving forms, luminous golden glow.`,

  'delacroix': `
EUGÈNE DELACROIX - SELECT ONE:
1. "Liberty Leading the People" (민중을 이끄는 자유의 여신) → revolutionary, dramatic, GROUP | Style: allegorical female figure with flag, dramatic diagonal composition, smoke and battle
2. "Death of Sardanapalus" (사르다나팔루스의 죽음) → dramatic, chaotic, intense | Style: swirling chaos of figures, rich jewel tones, violent passionate energy
3. "Women of Algiers" (알제리의 여인들) → FEMALE GROUP, exotic, interior | Style: harem interior, rich fabrics and patterns, warm exotic colors

⚠️ For FEMALE: Women of Algiers. Delacroix style: Passionate revolutionary energy, vivid intense colors, turbulent swirling movement.`,

  'courbet': `
GUSTAVE COURBET - SELECT ONE:
1. "The Stone Breakers" (돌 깨는 사람들) → workers, labor, realistic | Style: two workers breaking stones, earthy browns, raw unidealized realism
2. "A Burial at Ornans" (오르낭의 매장) → GROUP, funeral, somber | Style: life-size funeral procession, dark earthy tones, provincial mourners
3. "Bonjour Monsieur Courbet" (쿠르베 씨 안녕하세요) → outdoor meeting, landscape | Style: artist meeting patron on country road, bright daylight, confident self-presentation

⚠️ Courbet style: Raw unidealized realism, bold palette knife texture, dark earthy tones.`,

  'manet': `
ÉDOUARD MANET - SELECT ONE:
1. "Bar at the Folies-Bergère" (폴리베르제르의 바) → FEMALE portrait, interior, mirror | Style: barmaid facing viewer, mirror reflection behind, bottles and oranges, modern urban life
2. "The Fifer" (피리 부는 소년) → MALE portrait, young, simple background | Style: young boy in military uniform playing fife, flat grey background, bold silhouette

⚠️ For FEMALE: Bar at Folies-Bergère. For MALE: The Fifer. Manet style: Bold flat composition, striking light-dark contrast, loose confident brushwork.`,

  // ========================================
  // 인상주의
  // ========================================
  'renoir': `
PIERRE-AUGUSTE RENOIR - SELECT ONE:
1. "Luncheon of the Boating Party" (뱃놀이 파티) → GROUP, celebration, outdoor dining | Style: dappled sunlight on happy figures, striped awning, warm social atmosphere
2. "Bal du moulin de la Galette" (물랭 드 라 갈레트) → GROUP, dancing, outdoor party | Style: couples dancing under trees, dappled light patterns, joyful festive atmosphere
3. "The Swing" (그네) → outdoor, romantic, dappled light | Style: woman on swing with admirers, blue-shadowed sunlight filtering through leaves

⚠️ For PORTRAITS: All work well. Renoir style: Warm luminous glow, soft feathery brushstrokes, rosy pink flesh tones, dappled sunlight.`,

  'monet': `
CLAUDE MONET - SELECT ONE:
1. "Water Lilies" (수련) → water, garden, reflections | Style: floating lily pads, water reflections, soft purple pink green, no horizon line
2. "Impression, Sunrise" (인상, 해돋이) → harbor, sunrise, atmospheric | Style: orange sun reflecting on misty water, boats silhouetted, broken color brushstrokes
3. "Woman with a Parasol" (양산을 든 여인) → FEMALE portrait, outdoor, windy | Style: woman and child on hillside, billowing white dress, bright summer sky

⚠️ For LANDSCAPE: Water Lilies or Impression. For FEMALE: Woman with Parasol. Monet style: Broken color brushstrokes, soft hazy atmospheric light.`,

  'degas': `
EDGAR DEGAS - SELECT ONE:
1. "The Dance Class" (무용 수업) → GROUP, ballet, interior | Style: ballet dancers in rehearsal, unusual cropped angle, soft pastel colors
2. "The Star" (별/무대 위의 무희) → FEMALE, dancer, spotlight | Style: ballerina on stage, dramatic stage lighting, tutus and movement
3. "L'Absinthe" (압생트) → COUPLE, melancholic, cafe | Style: two figures at cafe table, isolated alienation, muted colors

⚠️ For MOVEMENT/DANCE: Dance Class or The Star. Degas style: Unusual cropped angles, asymmetric composition, soft pastel chalky texture.`,

  'caillebotte': `
GUSTAVE CAILLEBOTTE - SELECT ONE:
1. "Paris Street, Rainy Day" (파리 거리, 비오는 날) → urban, COUPLE, rainy | Style: dramatic perspective, wet cobblestones, bourgeois couple with umbrella
2. "The Floor Scrapers" (마루를 긁는 사람들) → workers, interior, labor | Style: workers scraping floor, dramatic perspective, strong lighting from window
3. "Man at the Window" (창가의 남자) → MALE portrait, interior, urban view | Style: man looking out at Haussmann boulevard, dramatic backlighting, modern urban life

⚠️ For MALE: Man at Window. For URBAN: Paris Street. Caillebotte style: Dramatic converging perspective, muted grey-blue tones, wet pavement reflections.`,

  // ========================================
  // 후기인상주의
  // ========================================
  'vangogh': `
VINCENT VAN GOGH - SELECT ONE:
1. "The Starry Night" (별이 빛나는 밤) → night scene, sky, evening, FEMALE night portrait | Style: SWIRLING SPIRAL brushstrokes, COBALT BLUE and YELLOW, cypress trees
2. "Café Terrace at Night" (밤의 카페 테라스) → cafe, restaurant, street scene, city, urban, FEMALE urban portrait | Style: BRIGHT YELLOW gas lamp glow against DEEP COBALT BLUE night sky, cobblestone street
3. "Sunflowers" (해바라기) → flowers, still life, bouquet ONLY | Style: THICK IMPASTO, CHROME YELLOW dominates, expressive petal strokes
4. "Self-Portrait with Grey Felt Hat" (회색 펠트 모자 자화상) → MALE portrait ONLY | Style: EXPLOSIVE RADIAL brushstrokes from face, intense blue swirling background, grey felt hat
5. "Seascape" (생트마리 바다) → sea, beach, ocean, water, boats | Style: turbulent Mediterranean waves, white sailboats, deep blue green sea, bright daylight
6. "Wheat Field with Cypresses" (사이프러스 밀밭) → field, meadow, outdoor, nature, FEMALE nature portrait | Style: golden wheat, dark cypress tree, INTENSELY SWIRLING white clouds

⚠️ For FEMALE portrait: Match by photo context - "Starry Night" (sky/night), "Café Terrace" (urban/street), "Wheat Field" (nature/outdoor).
⚠️ For MALE portrait: Use "Self-Portrait with Grey Felt Hat" (stronger brushstrokes).`,

  'gauguin': `
PAUL GAUGUIN - SELECT ONE:
1. "Tahitian Women" (타히티 여인들) → FEMALE, tropical, exotic | Style: two seated women, flat bold saturated colors, tropical setting, decorative patterns
2. "Where Do We Come From?" (우리는 어디서 왔는가) → GROUP, philosophical, panoramic | Style: frieze-like composition, figures from birth to death, deep blue gold palette
3. "Yellow Christ" (노란 그리스도) → religious, landscape, symbolic | Style: crucifixion in Breton landscape, bold yellow figure, flat areas of color

⚠️ For FEMALE: Tahitian Women. Gauguin style: Bold black outlines, flat pure saturated colors, exotic tropical palette.`,

  'cezanne': `
PAUL CÉZANNE - SELECT ONE:
1. "Basket of Apples" (사과 바구니) → still life, fruit, table | Style: tilted table perspective, apples and bottles, constructive brushstrokes building form
2. "Mont Sainte-Victoire" (생트빅투아르 산) → landscape, mountain | Style: geometric mountain form, visible constructive brushstrokes, muted earth tones
3. "The Card Players" (카드 놀이하는 사람들) → MALE GROUP, interior, concentration | Style: peasants playing cards, solid geometric figures, earthy browns and blues

⚠️ For MALE: Card Players. For LANDSCAPE: Mont Sainte-Victoire. Cézanne style: Geometric structural forms, visible constructive brushstrokes, muted earthy palette.`,

  // ========================================
  // 야수파
  // ========================================
  'matisse': `
HENRI MATISSE - SELECT ONE:
1. "Woman in a Purple Coat" (보라 코트를 입은 여인) → FEMALE portrait (⭐PREFERRED DEFAULT for single female) | Style: RICH PURPLE COAT, BOLD BLACK OUTLINES around figure, decorative patterned background, mature elegant style, strong contour lines
2. "The Green Stripe" (초록 줄무늬) → FEMALE portrait ONLY when experimental/avant-garde/artistic mood | Style: GREEN STRIPE down CENTER of face dividing it in half, LEFT side yellow-pink tones, RIGHT side green-purple tones, RADICAL FAUVIST COLOR directly on skin
3. "The Dance" (춤) → GROUP of people (2+), movement, joy | Style: THREE-COLOR ONLY (RED figures + BLUE sky + GREEN ground), simplified flattened dancing bodies, primitive rhythmic energy
4. "The Red Room" (붉은 방) → interior, still life, single person in room | Style: RED DOMINATES 80% of scene, blue arabesque vine patterns on red, flattened space where wall and table merge

⚠️ For FEMALE: Purple Coat preferred. For GROUP: The Dance.`,

  'derain': `
ANDRÉ DERAIN - SELECT ONE:
1. "Port of Collioure" (콜리우르 항구) → harbor, boats, coastal | Style: explosive vivid colors, bold rough brushstrokes, Mediterranean light
2. "Charing Cross Bridge" (차링 크로스 다리) → urban, bridge, river | Style: vibrant unnatural colors, London Thames, fauvist interpretation of city
3. "Portrait of Matisse" (마티스의 초상) → MALE portrait | Style: bold clashing colors on face, rough aggressive brushwork, fauvist distortion

⚠️ For MALE portrait: Portrait of Matisse. Derain style: Explosive vivid colors, bold rough brushstrokes, raw fauvist energy.`,

  'vlaminck': `
MAURICE DE VLAMINCK - SELECT ONE:
1. "Houses at Chatou" (샤투의 집들) → village, houses, landscape | Style: violent intense colors, thick aggressive brushwork, expressionist village scene
2. "Red Trees" (붉은 나무들) → landscape, trees, nature | Style: fiery red and orange trees, wild untamed brushwork, intense color
3. "Restaurant at Bougival" (부지발의 레스토랑) → building, outdoor | Style: bold color contrasts, aggressive brushstrokes, suburban scene

⚠️ Vlaminck style: Violent intense colors, thick aggressive brushwork, wild untamed energy.`,

  // ========================================
  // 표현주의
  // ========================================
  'munch': `
EDVARD MUNCH - SELECT ONE:
1. "The Scream" (절규) → ANY, emotional, anxiety, existential dread | Style: WAVY DISTORTED swirling LINES throughout, BLOOD RED and orange sky, elongated oval face with hands on ears expressing TERROR, bridge setting, PRESERVE ORIGINAL FACE while applying expressionist distortion
2. "Madonna" (마돈나) → FEMALE, mysterious, contemplative mood | Style: flowing dark hair like HALO, reddish glowing aura, pale luminous skin, mysterious atmosphere, dark moody background
3. "The Dance of Life" (생의 춤) → COUPLE, romantic, life stages | Style: COUPLES DANCING on moonlit shore, RED dress central, WHITE and BLACK figures on sides, moon reflection, emotional depth

⚠️ CRITICAL: NEVER create skull or skeleton face. PRESERVE the original person's facial features while applying expressionist style.`,

  'kirchner': `
ERNST LUDWIG KIRCHNER - SELECT ONE:
1. "Berlin Street Scene" (베를린 거리 풍경) → urban, GROUP, city life | Style: angular jagged figures, garish clashing colors, elongated distorted forms, modern city tension
2. "Self-Portrait as a Soldier" (군인으로서의 자화상) → MALE portrait, psychological | Style: severed hand motif, anxious expression, harsh angular forms, war trauma
3. "Three Old Women" (세 명의 노부인들) → FEMALE group, outdoor | Style: three angular figures in black clothing, green mountainous landscape, mask-like faces

⚠️ For MALE: Self-Portrait as Soldier. For FEMALE: Two Women. Kirchner style: Sharp angular jagged forms, extreme bold clashing colors, elongated mask-like faces.`,

  'kokoschka': `
OSKAR KOKOSCHKA - SELECT ONE:
1. "Bride of the Wind" (바람의 신부) → COUPLE, dramatic, emotional | Style: two intertwined figures in swirling storm, turbulent slashing brushwork, intense emotional turmoil
2. "Self-Portrait of a Degenerate Artist" (퇴폐 미술가 자화상) → portrait, psychological | Style: penetrating psychological intensity, harsh feverish colors, raw emotional exposure
3. "Double Portrait" (이중 초상) → COUPLE portrait | Style: two figures with psychological tension, distorted features, emotional undercurrents

⚠️ For COUPLE: Bride of the Wind. Kokoschka style: Violent turbulent slashing brushwork, harsh acidic feverish colors, deeply distorted psychological tension.`,

  // ========================================
  // 모더니즘/팝아트
  // ========================================
  'picasso': `
PABLO PICASSO - SELECT ONE based on weighted percentages:
1. "Guernica" (게르니카, 1937) [40%] → GROUP, dramatic scene | Style: Cubist masterpiece, ANGULAR GEOMETRIC face fragmentation, dramatic bold black outlines, powerful emotional impact, monochrome palette
2. "Three Musicians" (세 명의 음악가, 1921) [30%] → GROUP 2+ people | Style: Synthetic Cubism FLAT GEOMETRIC SHAPES like paper cutouts collage, BOLD PRIMARY COLORS
3. "Portrait of Dora Maar" (도라 마르의 초상, 1937) [30%] → SINGLE PERSON portrait | Style: Cubist DOUBLE PROFILE, VIBRANT COLORS red yellow green blue

⚠️ IMPORTANT: Follow the percentages above.`,

  'magritte': `
RENÉ MAGRITTE - SELECT ONE:
1. "The Son of Man" (사람의 아들) → MALE portrait, mysterious, iconic | Style: man in bowler hat with GREEN APPLE obscuring face, grey overcoat, cloudy sky background
2. "Golconda" (골콘다) → GROUP, surreal, floating | Style: identical men in bowler hats raining from sky, Belgian townhouses, repetition
3. "Man in a Bowler Hat" (중산모를 쓴 남자) → MALE portrait, bird motif | Style: bowler hat man with WHITE DOVE obscuring face, mysterious concealment
4. "The Human Condition" (인간의 조건) → landscape, window, meta | Style: painting on easel matching view through window, reality questioning
5. "The Empire of Light" (빛의 제국) → landscape, paradox | Style: daytime sky above nighttime street, impossible lighting, Belgian house

⚠️ For MALE: Son of Man or Man in Bowler Hat. Magritte style: Philosophical visual paradox, mysterious object obscuring face, dreamlike impossible scenarios.`,

  'miro': `
JOAN MIRÓ - SELECT ONE:
1. "The Catalan Landscape" (카탈루냐 풍경) → landscape, playful, abstract | Style: biomorphic shapes floating, yellow ochre background, whimsical symbols
2. "Constellations" (별자리) → abstract, cosmic, night | Style: starfield of symbols, interconnected lines, black background with colorful shapes
3. "Woman in Front of the Sun" (태양 앞의 여인) → simple, iconic, figure | Style: large biomorphic shape on light background, minimal childlike composition

⚠️ Miró style: Playful biomorphic shapes, childlike symbols floating, primary colors on white background, spontaneous whimsical lines.`,

  'chagall': `
MARC CHAGALL - SELECT ONE:
1. "Lovers with Flowers" (사랑하는 연인들과 꽃, 1927) → COUPLE/SINGLE, romantic, flowers | Style: couple surrounded by vibrant flowers, warm coral pink blue green
2. "La Branche" (나뭇가지, 1976) → COUPLE/SINGLE, nature, romantic | Style: lovers among flowering branches, rich warm red pink coral
3. "La Mariée" (신부, 1950) → FEMALE/COUPLE, bride, fantasy | Style: ethereal bride in red dress, dreamlike floating figures, deep blue nocturnal background with village and moon

⚠️ Chagall style: Dreamy floating figures, soft pastel colors, nostalgic romantic atmosphere, poetic lyrical quality, dreamlike imagery with horses birds butterflies flowers.`,

  'lichtenstein': `
ROY LICHTENSTEIN - SELECT ONE:
1. "In the Car" (차 안에서) → COUPLE (2 people), romantic, glamorous | Style: glamorous couple close-up, woman with ribbon hair man in profile
2. "Forget It" (날 잊어) → COUPLE (2 people), dramatic, conflict | Style: dramatic couple scene, black-haired man and blonde woman
3. "M-Maybe" (아마도) → FEMALE portrait, thoughtful | Style: blonde woman close-up face looking sideways
4. "Ohhh Alright" (오 알았어) → FEMALE portrait, expressive, pleased | Style: woman on telephone with pleased expression
5. "Still Life with Palette" (정물화) → OBJECT, still life, food, interior | Style: bottles flowers brushes household objects

⚠️ CRITICAL STYLE RULES: EXTREMELY LARGE Ben-Day dots 15mm+ on ALL surfaces, ULTRA THICK BLACK OUTLINES 20mm+, FLAT primary colors ONLY (red blue yellow), COMIC PANEL FRAME with THICK BLACK BORDER, NOT realistic, NOT thin lines.`,

  // ========================================
  // 거장 (추가)
  // ========================================
  'klimt': `
GUSTAV KLIMT - SELECT ONE:
1. "The Kiss" (키스) → COUPLE embracing, romantic, intimate (NOT for single person, NOT for parent-child) | Style: GOLD LEAF patterns throughout, geometric rectangular patterns on male robe, circular patterns on female robe, Byzantine mosaic gold background, kneeling on flower meadow
2. "Judith I" (유디트) → FEMALE portrait, powerful, confident, mysterious | Style: Wide GOLD CHOKER necklace, elegant confident expression, GOLD LEAF decorative patterns, rich jewel-tone colors, Art Nouveau elegance
3. "The Tree of Life" (생명의 나무) → landscape, decorative, ANY subject | Style: SPIRAL BRANCHES swirling outward, gold and bronze decorative swirls, elaborate curving patterns, Stoclet Frieze style

⚠️ For COUPLE: The Kiss. For FEMALE: Judith I. Klimt style: Ornate gold leaf patterns, intricate decorative mosaic, flat Byzantine-inspired figures.`,

  'frida': `
FRIDA KAHLO - SELECT ONE:
1. "Me and My Parrots" (나와 앵무새들) → person with birds/pets, colorful, tropical mood | Style: COLORFUL PARROTS on shoulders, LUSH GREEN TROPICAL FOLIAGE background, direct confident gaze, vibrant jewel-tone colors, traditional Mexican clothing
2. "Self-Portrait with Thorn Necklace" (가시 목걸이 자화상) → portrait with nature/animals, symbolic | Style: THORNY VINE NECKLACE with dead hummingbird pendant, black cat and monkey companions, large tropical leaves background, intense direct gaze
3. "Self-Portrait with Monkeys" (원숭이와 자화상) → person with pets/animals, warm intimate mood | Style: MONKEYS EMBRACING from behind shoulders, dense green tropical leaves, warm protective atmosphere, tender loving expression

⚠️ Frida style: Intense direct gaze, symbolic personal elements, vibrant Mexican folk colors, lush tropical foliage background.`
};

/**
 * 화가별 대표작 가이드 (getArtistMasterworkGuide)
 * 특정 화가의 모든 대표작을 AI 선택 가이드 형태로 반환
 * 거장 모드 및 미술사조 모두에서 사용
 */
export function getArtistMasterworkGuide(artistKey) {
  const normalized = artistKey.toLowerCase().trim();
  
  // 상세 가이드가 있으면 사용
  if (MASTER_GUIDES[normalized]) {
    return MASTER_GUIDES[normalized];
  }
  
  // 없으면 자동 생성
  const workList = getArtistMasterworkList(normalized);
  if (!workList || workList.length === 0) return '';
  
  // 화가명 매핑
  const artistNames = {
    'vangogh': 'VINCENT VAN GOGH',
    'munch': 'EDVARD MUNCH',
    'klimt': 'GUSTAV KLIMT',
    'matisse': 'HENRI MATISSE',
    'picasso': 'PABLO PICASSO',
    'frida': 'FRIDA KAHLO',
    'lichtenstein': 'ROY LICHTENSTEIN',
    'renoir': 'PIERRE-AUGUSTE RENOIR',
    'monet': 'CLAUDE MONET',
    'degas': 'EDGAR DEGAS',
    'caillebotte': 'GUSTAVE CAILLEBOTTE',
    'cezanne': 'PAUL CÉZANNE',
    'gauguin': 'PAUL GAUGUIN',
    'botticelli': 'SANDRO BOTTICELLI',
    'leonardo': 'LEONARDO DA VINCI',
    'michelangelo': 'MICHELANGELO',
    'raphael': 'RAPHAEL',
    'caravaggio': 'CARAVAGGIO',
    'rembrandt': 'REMBRANDT',
    'vermeer': 'JOHANNES VERMEER',
    'magritte': 'RENÉ MAGRITTE',
    'chagall': 'MARC CHAGALL',
    'miro': 'JOAN MIRÓ',
    'kirchner': 'ERNST LUDWIG KIRCHNER',
    'kokoschka': 'OSKAR KOKOSCHKA',
    'derain': 'ANDRÉ DERAIN',
    'vlaminck': 'MAURICE DE VLAMINCK'
  };
  
  const artistName = artistNames[normalized] || artistKey.toUpperCase();
  
  let guide = `${artistName} - SELECT ONE:\n`;
  
  workList.forEach((workKey, index) => {
    const work = getMovementMasterwork(workKey);
    if (work) {
      const feature = work.feature || '';
      const promptShort = work.prompt ? work.prompt.substring(0, 150) + '...' : '';
      guide += `${index + 1}. "${work.nameEn}" (${work.name}) → ${feature} | Style: ${promptShort}\n`;
    }
  });
  
  return guide;
}

export default {
  masterworkNameMapping,
  allMovementMasterworks,
  getMovementMasterwork,
  getArtistMasterworkList,
  getMasterworkGuideForAI,
  getMovementMasterworkGuide,
  getArtistMasterworkGuide
};
