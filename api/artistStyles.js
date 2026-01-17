// ========================================
// 🎨 통합 화풍 프롬프트 (artistStyles.js) v68
// v68: 간소화 + FLUX 최적화
//     - "by [풀네임], [이름] art style" 패턴
//     - 강한 표현 (extreme, intense, explosive 등)
//     - 피사체 강조 (face, skin, clothing, entire subject)
//     - FLUX는 부정어 미지원으로 긍정 표현 사용
//     - 서양화: 긍정 표현으로 강조
// ========================================

// ========================================
// 🖌️ 유화 질감 강제 (PAINT_TEXTURE) - 샌드위치 끝
// ========================================
export const PAINT_TEXTURE = ' MUST look like HAND-PAINTED oil painting with VISIBLE THICK BRUSHSTROKES (20mm or thicker on subject).';

// ========================================
// 📚 모든 화가 화풍 프롬프트
// ========================================
export const ARTIST_STYLES = {
  
  // ========================================
  // 🏛️ 고대 (특수 질감)
  // ========================================
  'classical-sculpture': 'Ancient Greek-Roman marble sculpture style. Pure white Carrara marble with smooth polished surface, carved stone texture.',
  
  'roman-mosaic': 'Roman floor mosaic style. Large visible tesserae tiles 50mm, thick black grout lines, earth tone palette.',

  // ========================================
  // ⛪ 중세 
  // ========================================
  'byzantine': 'Byzantine sacred icon style. Brilliant gold leaf background, flat frontal pose, large solemn eyes, rich jewel colors.',
  
  'gothic': 'Gothic stained glass style. Bold black lead lines, luminous jewel-tone translucent colors, light streaming through.',
  
  'islamic-miniature': 'Persian miniature painting style. Exquisite intricate details, vibrant jewel colors, delicate fine brushwork.',

  // ========================================
  // 🎨 르네상스 
  // ========================================
  'botticelli': 'by Sandro Botticelli, Botticelli art style, elegant flowing lines, ethereal pale skin, graceful diaphanous fabrics billowing gently.',
  
  'leonardo': 'by Leonardo da Vinci, da Vinci art style, extreme sfumato technique, soft hazy edges dissolving like smoke, mysterious atmospheric depth. CRITICAL: Paint ONLY the subject from original photo, PRESERVE original face and facial features exactly.',
  
  'titian': 'by Titian, Titian art style, warm glowing golden flesh, rich luminous Venetian colors, bold loose brushwork.',
  
  'michelangelo': 'by Michelangelo, Michelangelo art style, powerful heroic muscular figures, dramatic foreshortening, monumental grandeur.',
  
  'raphael': 'by Raphael, Raphael art style, perfect harmonious beauty, serene balanced composition, gentle graceful expressions.',

  // ========================================
  // 🎭 바로크 
  // ========================================
  'caravaggio': 'by Caravaggio, Caravaggio art style, extreme tenebrism, intense spotlight from absolute black darkness, dramatic theatrical illumination.',
  
  'rubens': 'by Peter Paul Rubens, Rubens art style, radiant luminous flesh, explosive swirling movement, rich passionate reds and golds.',
  
  'rembrandt': 'by Rembrandt, Rembrandt art style, intense golden glow, deep mysterious shadows, thick impasto highlights.',
  
  'velazquez': 'by Diego Velazquez, Velazquez art style, refined court elegance, masterful loose brushwork, subtle silver-grey palette.',

  // ========================================
  // 🌸 로코코 
  // ========================================
  'watteau': 'by Antoine Watteau, Watteau art style, delicate feathery brushwork, soft dreamy pastoral scenes, romantic melancholic atmosphere.',
  
  'boucher': 'by François Boucher, Boucher art style, soft rosy flesh tones, light pastel palette, playful decorative elegance.',

  // ========================================
  // 🏛️ 신고전주의 
  // ========================================
  'david': 'by Jacques-Louis David, David art style, crisp clear outlines, heroic idealized figures, dramatic moral intensity.',
  
  'ingres': 'by Jean-Auguste-Dominique Ingres, Ingres art style, smooth flowing contours, porcelain-smooth skin, elegant sinuous curves.',

  // ========================================
  // 🌊 낭만주의 
  // ========================================
  'turner': 'by J.M.W. Turner, Turner art style, atmospheric sublime light, swirling mist dissolving forms, luminous golden glow.',
  
  'delacroix': 'by Eugène Delacroix, Delacroix art style, passionate revolutionary energy, vivid intense colors, turbulent swirling movement.',

  // ========================================
  // 🌾 사실주의 
  // ========================================
  'courbet': 'by Gustave Courbet, Courbet art style, raw unidealized realism, bold palette knife texture, dark earthy tones.',
  
  'manet': 'by Édouard Manet, Manet art style, bold flat composition, striking light-dark contrast, loose confident brushwork.',

  // ========================================
  // 🌅 인상주의 
  // ========================================
  'renoir': 'by Pierre-Auguste Renoir, Renoir art style, warm luminous glow, soft feathery brushstrokes, rosy pink flesh tones, dappled sunlight filtering through leaves.',
  
  'monet': 'by Claude Monet, Monet art style, broken color brushstrokes, soft hazy atmospheric light, colors blending and dissolving.',
  
  'degas': 'by Edgar Degas, Degas art style, unusual cropped angles, asymmetric composition, soft pastel chalky texture.',
  
  'caillebotte': 'by Gustave Caillebotte, Caillebotte art style, dramatic converging perspective, muted grey-blue tones, wet pavement reflections.',

  // ========================================
  // 🌻 후기인상주의 
  // ========================================
  'vangogh': 'by Vincent van Gogh, Van Gogh art style, swirling spiral brushstrokes on face skin clothing and entire subject, thick impasto texture throughout, intense cobalt blue and chrome yellow.',
  
  'gauguin': 'by Paul Gauguin, Gauguin art style, bold black outlines, flat pure saturated colors, exotic tropical palette.',
  
  'cezanne': 'by Paul Cézanne, Cézanne art style, geometric structural forms, visible constructive brushstrokes, muted earthy palette.',

  // ========================================
  // 🔥 야수파 
  // ========================================
  'matisse': 'by Henri Matisse, Matisse art style, bold flat pure colors, simplified expressive forms, vibrant emotional intensity.',
  
  'derain': 'by André Derain, Derain art style, explosive vivid colors, bold rough brushstrokes, raw fauvist energy.',
  
  'vlaminck': 'by Maurice de Vlaminck, Vlaminck art style, violent intense colors, thick aggressive brushwork, wild untamed energy.',

  // ========================================
  // 😱 표현주의 
  // ========================================
  'munch': 'by Edvard Munch, Munch art style, INTENSE PSYCHOLOGICAL emotional depth, WAVY DISTORTED swirling lines throughout entire image, haunting symbolic colors (blood red sky, sickly yellows, deep blues), intense anxiety and existential dread.',
  
  'kirchner': 'by Ernst Ludwig Kirchner, Kirchner art style, sharp angular jagged forms, extreme bold clashing colors, elongated mask-like faces, raw primitive aggressive intensity.',
  
  'kokoschka': 'by Oskar Kokoschka, Kokoschka art style, violent turbulent slashing brushwork, harsh acidic feverish colors, deeply distorted psychological tension.',

  // ========================================
  // 🎪 모더니즘 
  // ========================================
  'picasso': 'by Pablo Picasso, Picasso Cubist art style, geometric fragmentation on face and entire body, face broken into angular planes, nose from side profile while both eyes visible from front, jaw chin cheeks shattered into geometric segments, multiple viewpoints simultaneously.',
  
  'magritte': 'by René Magritte, Magritte Surrealist art style, philosophical visual paradox, mysterious object obscuring face, dreamlike impossible scenarios.',
  
  'miro': 'by Joan Miró, Miró art style, playful biomorphic shapes, childlike symbols floating, primary colors on white background, spontaneous whimsical lines.',
  
  'chagall': 'by Marc Chagall, Chagall art style, dreamy floating figures, soft pastel colors, nostalgic romantic atmosphere, poetic lyrical quality, dreamlike imagery with horses birds butterflies flowers.',
  
  'lichtenstein': 'by Roy Lichtenstein, COMIC BOOK POP ART style, LARGE VISIBLE Ben-Day dots pattern covering entire surface, BOLD HEAVY BLACK INK OUTLINES 8mm+ like comic book printing surrounding ALL shapes faces and figures, FLAT primary colors ONLY (red blue yellow white black), halftone printing effect, THICK BLACK CONTOUR LINES on every edge.',

  // ========================================
  // ⭐ 거장 전용 
  // ========================================
  'klimt': 'by Gustav Klimt, Klimt art style, ornate gold leaf patterns, intricate decorative mosaic, flat Byzantine-inspired figures, jewel-like embedded details, geometric robes with spirals and rectangles.',
  
  'frida': 'by Frida Kahlo, Frida Kahlo art style, intense direct gaze, symbolic personal elements, vibrant Mexican folk colors, lush tropical foliage background, raw emotional honesty.',

  // ========================================
  // 🎎 동양화
  // ========================================
  'minhwa': 'Korean folk painting (Minhwa) style from late Joseon Dynasty. MINERAL PIGMENTS on AGED YELLOWED HANJI PAPER with visible paper texture. OLD FADED WEATHERED colors like antique painting 200+ years old. Muted earthy tones - faded ochre, dusty red, weathered green, pale greyish blue. ROUGH FOLK ART brush strokes with uneven pigment. Visible hanji paper texture throughout. Primitive naive quality. Museum artifact quality with aged patina. Traditional Korean clothing (hanbok) if people present.',
  
  'pungsokdo': 'Korean genre painting (Pungsokdo) style by master Kim Hongdo. SOFT WATERCOLOR WASHES on traditional Korean paper. DELICATE FLOWING BRUSH LINES for figures. Everyday life scenes of Joseon Dynasty Korea. Limited subtle color palette - soft browns, muted greens, pale blues. EMPTY SPACE as compositional element. Light loose brushwork. Traditional Korean clothing (hanbok). Gentle humorous narrative quality.',
  
  'jingyeong': 'Korean true-view landscape painting (Jingyeong Sansu) style by master Jeong Seon. BOLD EXPRESSIVE BRUSH STROKES for mountains. Korean mountain scenery with distinctive granite peaks. Strong ink work with dynamic energy. Traditional Korean landscape composition. Misty atmospheric perspective. Pine trees with characteristic Korean style.',
  
  'shuimohua': 'Chinese ink wash painting (Shuimohua/水墨画) style. BLACK INK on RICE PAPER with VISIBLE PAPER GRAIN texture. MONOCHROME ink with subtle grey gradations. EMPTY NEGATIVE SPACE as key compositional element. SPONTANEOUS EXPRESSIVE brush strokes. Soft atmospheric perspective. Traditional Chinese clothing (hanfu). Misty mountain backgrounds. Poetry and philosophy in visual form.',
  
  'gongbi': 'Chinese meticulous court painting (Gongbi/工筆) style. MUST look like TRADITIONAL HAND-PAINTED silk painting. FINE DETAILED BRUSHWORK with precise outlines. MINERAL PIGMENTS on silk with subtle sheen and VISIBLE SILK TEXTURE. Rich vivid colors - vermillion, malachite green, azurite blue, gold. Tang/Song Dynasty court elegance. Elaborate patterns on robes. Idealized graceful figures. Imperial court aesthetic. Classical painted quality. Traditional Chinese clothing (hanfu).',
  
  'huaniaohua': 'Chinese flower and bird painting (Huaniaohua/花鳥画) style. DELICATE PRECISE BRUSHWORK for petals and feathers. Natural subjects with botanical accuracy. Subtle color gradations. Silk or paper with visible texture. Elegant composition with empty space. Traditional Chinese aesthetic. Poetic naturalism.',
  
  'ukiyoe': 'Japanese Ukiyo-e woodblock print style. FLAT COLOR AREAS with BOLD BLACK OUTLINES. LIMITED COLOR PALETTE of traditional woodblock inks. WOODGRAIN TEXTURE visible in color areas. Stylized Japanese figures with distinctive features. Dramatic compositions. Floating world aesthetic. Kabuki drama or courtesan elegance. Transform clothing to traditional kimono.'
};

// ========================================
// 🔍 화풍 조회 함수
// ========================================

/**
 * 화가 키로 화풍 프롬프트 가져오기
 * @param {string} artistKey - 화가 키 (예: 'vangogh', 'monet', 'picasso')
 * @returns {string|null} 화풍 프롬프트
 */
export function getArtistStyle(artistKey) {
  const normalized = artistKey.toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/é/g, 'e')
    .replace(/ó/g, 'o');
  
  return ARTIST_STYLES[normalized] || null;
}

/**
 * 화가 이름으로 화풍 프롬프트 가져오기 (다양한 표기 지원)
 * @param {string} artistName - 화가 이름 (영문, 한글, 풀네임 등)
 * @returns {string|null} 화풍 프롬프트
 */
export function getArtistStyleByName(artistName) {
  const normalized = artistName.toUpperCase().trim();
  
  // 이름 매핑
  const nameToKey = {
    // 고대
    'CLASSICAL': 'classical-sculpture', 'SCULPTURE': 'classical-sculpture', '조각': 'classical-sculpture',
    'CLASSICAL SCULPTURE': 'classical-sculpture', 'GREEK SCULPTURE': 'classical-sculpture', 'ROMAN SCULPTURE': 'classical-sculpture',
    'MARBLE': 'classical-sculpture', 'MARBLE SCULPTURE': 'classical-sculpture',
    'MOSAIC': 'roman-mosaic', 'ROMAN': 'roman-mosaic', '모자이크': 'roman-mosaic',
    'ROMAN MOSAIC': 'roman-mosaic', 'ANCIENT MOSAIC': 'roman-mosaic',
    
    // 중세
    'BYZANTINE': 'byzantine', '비잔틴': 'byzantine', 'BYZANTINE ICON': 'byzantine', 'BYZANTINE MOSAIC': 'byzantine',
    'GOTHIC': 'gothic', '고딕': 'gothic', 'GOTHIC STAINED GLASS': 'gothic', 'STAINED GLASS': 'gothic',
    'ISLAMIC': 'islamic-miniature', 'MINIATURE': 'islamic-miniature', '이슬람': 'islamic-miniature',
    'ISLAMIC MINIATURE': 'islamic-miniature', 'PERSIAN MINIATURE': 'islamic-miniature', 'OTTOMAN MINIATURE': 'islamic-miniature',
    
    // 르네상스
    'BOTTICELLI': 'botticelli', '보티첼리': 'botticelli', 'SANDRO BOTTICELLI': 'botticelli',
    'LEONARDO': 'leonardo', 'DA VINCI': 'leonardo', '다빈치': 'leonardo', '레오나르도': 'leonardo', 'LEONARDO DA VINCI': 'leonardo',
    'TITIAN': 'titian', '티치아노': 'titian', 'TIZIANO': 'titian',
    'MICHELANGELO': 'michelangelo', '미켈란젤로': 'michelangelo', 'MICHELANGELO BUONARROTI': 'michelangelo',
    'RAPHAEL': 'raphael', '라파엘로': 'raphael', 'RAFFAELLO': 'raphael', 'RAFFAELLO SANZIO': 'raphael',
    
    // 바로크
    'CARAVAGGIO': 'caravaggio', '카라바조': 'caravaggio', 'MICHELANGELO MERISI DA CARAVAGGIO': 'caravaggio',
    'RUBENS': 'rubens', '루벤스': 'rubens', 'PETER PAUL RUBENS': 'rubens',
    'REMBRANDT': 'rembrandt', '렘브란트': 'rembrandt', 'REMBRANDT VAN RIJN': 'rembrandt',
    'VELÁZQUEZ': 'velazquez', 'VELAZQUEZ': 'velazquez', '벨라스케스': 'velazquez', 'DIEGO VELÁZQUEZ': 'velazquez', 'DIEGO VELAZQUEZ': 'velazquez',
    
    // 로코코
    'WATTEAU': 'watteau', '와토': 'watteau', 'ANTOINE WATTEAU': 'watteau', 'JEAN-ANTOINE WATTEAU': 'watteau',
    'BOUCHER': 'boucher', '부셰': 'boucher', 'FRANÇOIS BOUCHER': 'boucher', 'FRANCOIS BOUCHER': 'boucher',
    
    // 신고전/낭만/사실
    'DAVID': 'david', '다비드': 'david', 'JACQUES-LOUIS DAVID': 'david',
    'INGRES': 'ingres', '앵그르': 'ingres', 'JEAN-AUGUSTE-DOMINIQUE INGRES': 'ingres',
    'TURNER': 'turner', '터너': 'turner', 'J.M.W. TURNER': 'turner', 'WILLIAM TURNER': 'turner',
    'DELACROIX': 'delacroix', '들라크루아': 'delacroix', 'EUGÈNE DELACROIX': 'delacroix', 'EUGENE DELACROIX': 'delacroix',
    'COURBET': 'courbet', '쿠르베': 'courbet', 'GUSTAVE COURBET': 'courbet',
    'MANET': 'manet', '마네': 'manet', 'ÉDOUARD MANET': 'manet', 'EDOUARD MANET': 'manet',
    
    // 인상주의
    'RENOIR': 'renoir', '르누아르': 'renoir', 'PIERRE-AUGUSTE RENOIR': 'renoir',
    'MONET': 'monet', '모네': 'monet', 'CLAUDE MONET': 'monet',
    'DEGAS': 'degas', '드가': 'degas', 'EDGAR DEGAS': 'degas',
    'CAILLEBOTTE': 'caillebotte', '카유보트': 'caillebotte', '칼리보트': 'caillebotte', 'GUSTAVE CAILLEBOTTE': 'caillebotte',
    
    // 후기인상주의
    'VAN GOGH': 'vangogh', 'GOGH': 'vangogh', '반 고흐': 'vangogh', '고흐': 'vangogh', '빈센트': 'vangogh', 'VINCENT VAN GOGH': 'vangogh',
    'GAUGUIN': 'gauguin', '고갱': 'gauguin', 'PAUL GAUGUIN': 'gauguin',
    'CÉZANNE': 'cezanne', 'CEZANNE': 'cezanne', '세잔': 'cezanne', 'PAUL CÉZANNE': 'cezanne', 'PAUL CEZANNE': 'cezanne',
    
    // 야수파
    'MATISSE': 'matisse', '마티스': 'matisse', 'HENRI MATISSE': 'matisse',
    'DERAIN': 'derain', '드랭': 'derain', 'ANDRÉ DERAIN': 'derain', 'ANDRE DERAIN': 'derain',
    'VLAMINCK': 'vlaminck', '블라맹크': 'vlaminck', 'MAURICE DE VLAMINCK': 'vlaminck',
    
    // 표현주의
    'MUNCH': 'munch', '뭉크': 'munch', 'EDVARD MUNCH': 'munch',
    'KIRCHNER': 'kirchner', '키르히너': 'kirchner', 'ERNST LUDWIG KIRCHNER': 'kirchner',
    'KOKOSCHKA': 'kokoschka', '코코슈카': 'kokoschka', 'OSKAR KOKOSCHKA': 'kokoschka',
    
    // 모더니즘
    'PICASSO': 'picasso', '피카소': 'picasso', 'PABLO PICASSO': 'picasso',
    'MAGRITTE': 'magritte', '마그리트': 'magritte', 'RENÉ MAGRITTE': 'magritte', 'RENE MAGRITTE': 'magritte',
    'MIRÓ': 'miro', 'MIRO': 'miro', '미로': 'miro', 'JOAN MIRÓ': 'miro', 'JOAN MIRO': 'miro',
    'CHAGALL': 'chagall', '샤갈': 'chagall', 'MARC CHAGALL': 'chagall',
    'LICHTENSTEIN': 'lichtenstein', '리히텐슈타인': 'lichtenstein', 'ROY LICHTENSTEIN': 'lichtenstein',
    
    // 거장 전용
    'KLIMT': 'klimt', '클림트': 'klimt', 'GUSTAV KLIMT': 'klimt',
    'FRIDA': 'frida', 'KAHLO': 'frida', '프리다': 'frida', '칼로': 'frida', 'FRIDA KAHLO': 'frida',
    
    // 동양화
    'MINHWA': 'minhwa', '민화': 'minhwa', 'KOREAN FOLK': 'minhwa',
    'PUNGSOKDO': 'pungsokdo', '풍속도': 'pungsokdo', 'GENRE PAINTING': 'pungsokdo', 'KIM HONGDO': 'pungsokdo',
    'JINGYEONG': 'jingyeong', '진경산수': 'jingyeong', 'TRUE VIEW': 'jingyeong', 'JEONG SEON': 'jingyeong',
    'SHUIMOHUA': 'shuimohua', '수묵화': 'shuimohua', 'INK WASH': 'shuimohua', '水墨画': 'shuimohua',
    'GONGBI': 'gongbi', '공필화': 'gongbi', 'METICULOUS': 'gongbi', '工筆': 'gongbi',
    'HUANIAOHUA': 'huaniaohua', '화조화': 'huaniaohua', 'FLOWER BIRD': 'huaniaohua', '花鳥': 'huaniaohua',
    'UKIYOE': 'ukiyoe', '우키요에': 'ukiyoe', 'WOODBLOCK': 'ukiyoe', 'UKIYO-E': 'ukiyoe'
  };
  
  // 직접 매칭
  for (const [name, key] of Object.entries(nameToKey)) {
    if (normalized.includes(name)) {
      return ARTIST_STYLES[key];
    }
  }
  
  return null;
}

// 콘솔 로그
console.log('📚 Artist Styles v68 loaded:', Object.keys(ARTIST_STYLES).length, 'artists');
