// PicoArt v51 - ProcessingScreen (단일변환 반복 = 원클릭)
// 원칙: 단일 변환 로직만 있고, 원클릭은 그걸 N번 반복
// v51: educationMatcher.js 사용 (ResultScreen과 동일한 매칭 로직)
import React, { useEffect, useState } from 'react';
import { processStyleTransfer } from '../utils/styleTransferAPI';
import { educationContent } from '../data/educationContent';
// 원클릭 교육자료 (분리된 파일)
import { oneclickMovementsPrimary, oneclickMovementsSecondary } from '../data/oneclickMovementsEducation';
import { oneclickMastersPrimary, oneclickMastersSecondary } from '../data/oneclickMastersEducation';
import { oneclickOrientalPrimary, oneclickOrientalSecondary } from '../data/oneclickOrientalEducation';
// v51: 새로운 교육자료 매칭 유틸리티 (ResultScreen과 동일)
import { getEducationKey, getEducationContent } from '../utils/educationMatcher';

const ProcessingScreen = ({ photo, selectedStyle, onComplete }) => {
  const [statusText, setStatusText] = useState('준비 중...');
  const [showEducation, setShowEducation] = useState(false);
  
  // 원클릭 상태
  const [completedResults, setCompletedResults] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [viewIndex, setViewIndex] = useState(-1);
  const [touchStartX, setTouchStartX] = useState(0);
  
  // 원클릭 여부
  const isFullTransform = selectedStyle?.isFullTransform === true;
  const category = selectedStyle?.category;
  
  // 원클릭 시 전달받은 스타일 배열 사용 (styleData import 불필요!)
  const styles = isFullTransform ? (selectedStyle?.styles || []) : [];
  const totalCount = styles.length;

  useEffect(() => {
    startProcess();
  }, []);

  // ========== 메인 프로세스 ==========
  const startProcess = async () => {
    if (isFullTransform) {
      // 원클릭: 1차 교육 표시 후 순차 변환 (단일 변환 반복!)
      setShowEducation(true);
      setStatusText(`${totalCount}개 스타일 변환을 시작합니다...`);
      await sleep(1500);
      
      const results = [];
      for (let i = 0; i < styles.length; i++) {
        const style = styles[i]; // 공통 데이터에서 가져온 스타일 (category 포함)
        setStatusText(`[${i}/${totalCount}] ${style.name} 변환 중...`);
        
        // 단일 변환과 동일하게 호출!
        const result = await processSingleStyle(style, i, totalCount);
        results.push(result);
        setCompletedCount(i + 1);
        setCompletedResults([...results]);
        
        // API 부하 방지: 각 변환 후 2초 딜레이 (마지막 제외)
        if (i < styles.length - 1) {
          await sleep(2000);
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      setStatusText(`완료! ${successCount}/${totalCount}개 변환 성공`);
      await sleep(1000);
      
      onComplete(selectedStyle, results, { isFullTransform: true, category, results });
    } else {
      // 단일 변환
      setShowEducation(true);
      const eduContent = getSingleEducationContent(selectedStyle);
      if (eduContent) {
        setStatusText(`${eduContent.title} 스타일 분석 중...`);
      }
      await sleep(1000);
      
      const result = await processSingleStyle(selectedStyle);
      
      if (result.success) {
        setStatusText(`${result.aiSelectedArtist || selectedStyle.name} 화풍으로 변환 완료!`);
        await sleep(1000);
        onComplete(selectedStyle, result.resultUrl, result);
      } else {
        // 실패 시에도 ResultScreen으로 이동하여 다시 시도 버튼 표시
        setStatusText(`오류: ${result.error}`);
        await sleep(1500);
        onComplete(selectedStyle, null, { ...result, success: false });
      }
    }
  };

  // ========== 단일 스타일 변환 (핵심 함수 - 원클릭도 이거 사용) ==========
  const processSingleStyle = async (style, index = 0, total = 1) => {
    try {
      const result = await processStyleTransfer(
        photo,
        style, // category 포함된 스타일 객체 그대로 전달
        null,
        (progressText) => {
          if (total > 1) {
            setStatusText(`[${index}/${total}] ${progressText}`);
          } else {
            setStatusText(progressText);
          }
        }
      );

      if (result.success) {
        return {
          style,
          resultUrl: result.resultUrl,
          aiSelectedArtist: result.aiSelectedArtist,
          selected_work: result.selected_work,  // 거장 모드: 선택된 작품
          success: true
        };
      } else {
        return { 
          style, 
          error: result.error, 
          aiSelectedArtist: result.aiSelectedArtist,  // 실패해도 보존
          selected_work: result.selected_work,
          success: false 
        };
      }
    } catch (err) {
      return { style, error: err.message, success: false };
    }
  };

  // ========== 교육자료 ==========
  
  // 단일 변환용 1차 교육 (로컬 함수 - import된 getEducationContent와 구분)
  const getSingleEducationContent = (style) => {
    const cat = style.category;
    if (cat === 'movements') return educationContent.movements[style.id];
    if (cat === 'masters') return educationContent.masters[style.id];
    if (cat === 'oriental') return educationContent.oriental[style.id];
    return null;
  };

  // 원클릭 1차 교육 (분리된 파일에서 가져오기)
  const getPrimaryEducation = () => {
    // console.log('🎓 getPrimaryEducation called, category:', category);
    
    if (category === 'movements') {
      // console.log('🎓 Using oneclickMovementsPrimary');
      return { ...oneclickMovementsPrimary, title: '2,500년 서양미술사 관통' };
    } else if (category === 'masters') {
      // console.log('🎓 Using oneclickMastersPrimary');
      return oneclickMastersPrimary;
    } else if (category === 'oriental') {
      // console.log('🎓 Using oneclickOrientalPrimary');
      return oneclickOrientalPrimary;
    }
    return null;
  };

  // ========== 포맷 함수들 (ResultScreen과 통일) ==========
  
  // 화가명 포맷: 한글명(영문명)
  const formatArtistName = (artistName) => {
    if (!artistName) return '';
    
    const nameMap = {
      // 그리스로마
      'roman mosaic': '로마 모자이크(Roman Mosaic)',
      'greek sculpture': '그리스 조각(Greek Sculpture)',
      'classical sculpture': '고대 조각(Classical Sculpture)',
      'pompeii fresco': '폼페이 프레스코(Pompeii Fresco)',
      // 중세
      'giotto': '지오토 디 본도네(Giotto di Bondone)',
      'byzantine': '비잔틴(Byzantine)',
      'gothic': '고딕(Gothic)',
      'gothic stained glass': '고딕 스테인드글라스(Gothic Stained Glass)',
      'islamic miniature': '이슬람 세밀화(Islamic Miniature)',
      'islamic geometry': '이슬람 기하학(Islamic Geometry)',
      // 르네상스
      'leonardo': '레오나르도 다 빈치(Leonardo da Vinci)',
      'leonardo da vinci': '레오나르도 다 빈치(Leonardo da Vinci)',
      'michelangelo': '미켈란젤로 부오나로티(Michelangelo Buonarroti)',
      'raphael': '라파엘로 산치오(Raffaello Sanzio)',
      'botticelli': '산드로 보티첼리(Sandro Botticelli)',
      'jan van eyck': '얀 반 에이크(Jan van Eyck)',
      'titian': '티치아노 베첼리오(Tiziano Vecellio)',
      // 바로크
      'caravaggio': '미켈란젤로 메리시 다 카라바조(Caravaggio)',
      'rembrandt': '렘브란트 판 레인(Rembrandt van Rijn)',
      'rembrandt van rijn': '렘브란트 판 레인(Rembrandt van Rijn)',
      'vermeer': '요하네스 베르메르(Johannes Vermeer)',
      'johannes vermeer': '요하네스 베르메르(Johannes Vermeer)',
      'rubens': '피터 파울 루벤스(Peter Paul Rubens)',
      'peter paul rubens': '피터 파울 루벤스(Peter Paul Rubens)',
      'velázquez': '디에고 벨라스케스(Diego Velázquez)',
      'velazquez': '디에고 벨라스케스(Diego Velázquez)',
      'diego velázquez': '디에고 벨라스케스(Diego Velázquez)',
      'diego velazquez': '디에고 벨라스케스(Diego Velázquez)',
      // 로코코
      'watteau': '장 앙투안 와토(Jean-Antoine Watteau)',
      'jean-antoine watteau': '장 앙투안 와토(Jean-Antoine Watteau)',
      'fragonard': '장 오노레 프라고나르(Jean-Honoré Fragonard)',
      'jean-honoré fragonard': '장 오노레 프라고나르(Jean-Honoré Fragonard)',
      'boucher': '프랑수아 부셰(François Boucher)',
      'françois boucher': '프랑수아 부셰(François Boucher)',
      'francois boucher': '프랑수아 부셰(François Boucher)',
      // 신고전/낭만/사실
      'david': '자크 루이 다비드(Jacques-Louis David)',
      'jacques-louis david': '자크 루이 다비드(Jacques-Louis David)',
      'ingres': '장 오귀스트 도미니크 앵그르(Jean-Auguste-Dominique Ingres)',
      'delacroix': '외젠 들라크루아(Eugène Delacroix)',
      'eugène delacroix': '외젠 들라크루아(Eugène Delacroix)',
      'eugene delacroix': '외젠 들라크루아(Eugène Delacroix)',
      'goya': '프란시스코 고야(Francisco Goya)',
      'francisco goya': '프란시스코 고야(Francisco Goya)',
      'turner': '윌리엄 터너(J.M.W. Turner)',
      'friedrich': '카스파르 다비드 프리드리히(Caspar David Friedrich)',
      'courbet': '귀스타브 쿠르베(Gustave Courbet)',
      'millet': '장 프랑수아 밀레(Jean-François Millet)',
      'jean-françois millet': '장 프랑수아 밀레(Jean-François Millet)',
      // 인상주의
      'monet': '클로드 모네(Claude Monet)',
      'claude monet': '클로드 모네(Claude Monet)',
      'renoir': '피에르 오귀스트 르누아르(Pierre-Auguste Renoir)',
      'pierre-auguste renoir': '피에르 오귀스트 르누아르(Pierre-Auguste Renoir)',
      'degas': '에드가 드가(Edgar Degas)',
      'edgar degas': '에드가 드가(Edgar Degas)',
      'manet': '에두아르 마네(Édouard Manet)',
      'édouard manet': '에두아르 마네(Édouard Manet)',
      'edouard manet': '에두아르 마네(Édouard Manet)',
      'caillebotte': '귀스타브 카유보트(Gustave Caillebotte)',
      // 후기인상주의
      'van gogh': '빈센트 반 고흐(Vincent van Gogh)',
      'vincent van gogh': '빈센트 반 고흐(Vincent van Gogh)',
      'cézanne': '폴 세잔(Paul Cézanne)',
      'cezanne': '폴 세잔(Paul Cézanne)',
      'paul cézanne': '폴 세잔(Paul Cézanne)',
      'paul cezanne': '폴 세잔(Paul Cézanne)',
      'gauguin': '폴 고갱(Paul Gauguin)',
      'paul gauguin': '폴 고갱(Paul Gauguin)',
      'seurat': '조르주 쇠라(Georges Seurat)',
      'georges seurat': '조르주 쇠라(Georges Seurat)',
      'toulouse-lautrec': '앙리 드 툴루즈 로트렉(Henri de Toulouse-Lautrec)',
      'henri de toulouse-lautrec': '앙리 드 툴루즈 로트렉(Henri de Toulouse-Lautrec)',
      // 야수파
      'matisse': '앙리 마티스(Henri Matisse)',
      'henri matisse': '앙리 마티스(Henri Matisse)',
      'derain': '앙드레 드랭(André Derain)',
      'andré derain': '앙드레 드랭(André Derain)',
      'andre derain': '앙드레 드랭(André Derain)',
      'vlaminck': '모리스 드 블라맹크(Maurice de Vlaminck)',
      // 표현주의
      'munch': '에드바르 뭉크(Edvard Munch)',
      'edvard munch': '에드바르 뭉크(Edvard Munch)',
      'kirchner': '에른스트 루트비히 키르히너(Ernst Ludwig Kirchner)',
      'ernst ludwig kirchner': '에른스트 루트비히 키르히너(Ernst Ludwig Kirchner)',
      'kokoschka': '오스카 코코슈카(Oskar Kokoschka)',
      // 모더니즘 (입체주의/초현실/팝아트)
      'picasso': '파블로 피카소(Pablo Picasso)',
      'pablo picasso': '파블로 피카소(Pablo Picasso)',
      'braque': '조르주 브라크(Georges Braque)',
      'magritte': '르네 마그리트(René Magritte)',
      'rené magritte': '르네 마그리트(René Magritte)',
      'miro': '호안 미로(Joan Miró)',
      'miró': '호안 미로(Joan Miró)',
      'joan miro': '호안 미로(Joan Miró)',
      'chagall': '마르크 샤갈(Marc Chagall)',
      'marc chagall': '마르크 샤갈(Marc Chagall)',
      'lichtenstein': '로이 리히텐슈타인(Roy Lichtenstein)',
      'roy lichtenstein': '로이 리히텐슈타인(Roy Lichtenstein)',
      'haring': '키스 해링(Keith Haring)',
      'keith haring': '키스 해링(Keith Haring)',
      // 거장 (한글명)
      '반 고흐': '빈센트 반 고흐(Vincent van Gogh)',
      '클림트': '구스타프 클림트(Gustav Klimt)',
      '뭉크': '에드바르 뭉크(Edvard Munch)',
      '마티스': '앙리 마티스(Henri Matisse)',
      '피카소': '파블로 피카소(Pablo Picasso)',
      '프리다 칼로': '프리다 칼로(Frida Kahlo)',
      '프리다': '프리다 칼로(Frida Kahlo)'
    };
    
    const normalized = artistName.toLowerCase().trim();
    return nameMap[normalized] || nameMap[artistName] || artistName;
  };

  // 작품명 포맷: 한글명(영문명) - 거장용
  const formatWorkName = (workName) => {
    if (!workName) return '';
    
    const workMap = {
      // 반 고흐
      'The Starry Night': '별이 빛나는 밤(The Starry Night)',
      'Starry Night': '별이 빛나는 밤(Starry Night)',
      'Sunflowers': '해바라기(Sunflowers)',
      'Self-Portrait': '자화상(Self-Portrait)',
      // 클림트
      'The Kiss': '키스(The Kiss)',
      'The Tree of Life': '생명의 나무(The Tree of Life)',
      'Judith I': '유디트(Judith)',
      'Judith': '유디트(Judith)',
      // 뭉크
      'The Scream': '절규(The Scream)',
      'Madonna': '마돈나(Madonna)',
      'Jealousy': '질투(Jealousy)',
      // 마티스
      'The Dance': '춤(The Dance)',
      'The Red Room': '붉은 방(The Red Room)',
      'Woman with a Hat': '모자를 쓴 여인(Woman with a Hat)',
      // 피카소
      'Guernica': '게르니카(Guernica)',
      "Les Demoiselles d'Avignon": "아비뇽의 처녀들(Les Demoiselles d'Avignon)",
      // 프리다 칼로
      'Me and My Parrots': '나와 앵무새(Me and My Parrots)',
      'Self-Portrait with Parrots': '앵무새와 자화상(Self-Portrait with Parrots)',
      'The Broken Column': '부러진 기둥(The Broken Column)',
      'Self-Portrait with Thorn Necklace': '가시 목걸이 자화상(Self-Portrait with Thorn Necklace)',
      'Self-Portrait with Monkeys': '원숭이와 자화상(Self-Portrait with Monkeys)'
    };
    
    return workMap[workName] || workName;
  };

  // 작품 제작연도 매핑
  const workYearMap = {
    // 반 고흐
    'The Starry Night': 1889,
    'Starry Night': 1889,
    'Sunflowers': 1888,
    'Self-Portrait': 1889,
    '별이 빛나는 밤': 1889,
    '해바라기': 1888,
    '자화상': 1889,
    // 클림트
    'The Kiss': 1908,
    'Judith I': 1901,
    'Judith': 1901,
    'The Tree of Life': 1909,
    'Tree of Life': 1909,
    '키스': 1908,
    '유디트': 1901,
    '생명의 나무': 1909,
    // 뭉크
    'The Scream': 1893,
    'Madonna': 1894,
    'Jealousy': 1895,
    '절규': 1893,
    '마돈나': 1894,
    '질투': 1895,
    // 마티스
    'The Dance': 1910,
    'The Red Room': 1908,
    'Harmony in Red': 1908,
    'Woman with a Hat': 1905,
    '춤': 1910,
    '붉은 방': 1908,
    '모자를 쓴 여인': 1905,
    // 피카소
    "Les Demoiselles d'Avignon": 1907,
    'Guernica': 1937,
    '아비뇽의 처녀들': 1907,
    '게르니카': 1937,
    // 프리다 칼로
    'The Broken Column': 1944,
    'Self-Portrait with Monkeys': 1943,
    'Me and My Parrots': 1941,
    'Self-Portrait with Parrots': 1941,
    'Self-Portrait with Thorn Necklace': 1940,
    'Self-Portrait with Thorn Necklace and Hummingbird': 1940,
    '부러진 기둥': 1944,
    '원숭이와 자화상': 1943,
    '나와 앵무새': 1941,
    '앵무새와 자화상': 1941,
    '가시 목걸이 자화상': 1940,
    '가시 목걸이와 벌새': 1940
  };

  // 작품 연도 가져오기
  const getWorkYear = (workName) => {
    if (!workName) return null;
    
    // 직접 매칭
    if (workYearMap[workName]) return workYearMap[workName];
    
    // 괄호 제거 후 매칭 시도
    const withoutParens = workName.split('(')[0].trim();
    if (workYearMap[withoutParens]) return workYearMap[withoutParens];
    
    // 괄호 안 내용으로 매칭 시도
    const match = workName.match(/\(([^)]+)\)/);
    if (match && workYearMap[match[1]]) return workYearMap[match[1]];
    
    return null;
  };

  // 동양화 스타일 포맷: 한글명(영문명)
  const formatOrientalStyle = (styleName) => {
    if (!styleName) return '';
    
    const orientalMap = {
      // 한국
      '한국 전통화': '민화(Minhwa)',
      'korean-minhwa': '민화(Minhwa)',
      'korean-genre': '풍속도(Pungsokdo)',
      'korean-jingyeong': '진경산수화(Jingyeong)',
      // 중국
      'Chinese Gongbi': '공필화(Gongbi)',
      'chinese-gongbi': '공필화(Gongbi)',
      'chinese-ink': '수묵화(Ink Wash)',
      'chinese-ink-wash': '수묵화(Ink Wash)',
      // 일본
      '일본 우키요에': '우키요에(Ukiyo-e)',
      'japanese-ukiyoe': '우키요에(Ukiyo-e)'
    };
    
    const normalized = styleName?.toLowerCase?.().trim() || '';
    
    if (orientalMap[styleName]) return orientalMap[styleName];
    if (orientalMap[normalized]) return orientalMap[normalized];
    
    // 부분 매칭 - 한국
    if (normalized.includes('minhwa') || normalized.includes('민화')) {
      return '민화(Minhwa)';
    }
    if (normalized.includes('pungsok') || normalized.includes('genre') || normalized.includes('풍속')) {
      return '풍속도(Pungsokdo)';
    }
    if (normalized.includes('jingyeong') || normalized.includes('진경')) {
      return '진경산수화(Jingyeong)';
    }
    // 부분 매칭 - 중국
    if (normalized.includes('gongbi') || normalized.includes('공필')) {
      return '공필화(Gongbi)';
    }
    if (normalized.includes('ink wash') || normalized.includes('수묵')) {
      return '수묵화(Ink Wash)';
    }
    // 부분 매칭 - 일본
    if (normalized.includes('ukiyo') || normalized.includes('우키요에')) {
      return '우키요에(Ukiyo-e)';
    }
    
    return styleName;
  };

  // ========== 거장 화가명 풀네임 + 화파 매핑 (v67: 새 표기 형식) ==========
  // 제목: 풀네임(영문, 생몰연도)
  // 부제: 사조(시기)
  // v70: 샤갈 추가
  const getMasterInfo = (artistName) => {
    const masterMap = {
      '반 고흐': { fullName: '빈센트 반 고흐(Vincent van Gogh, 1853~1890)', movement: '후기인상주의' },
      'vangogh': { fullName: '빈센트 반 고흐(Vincent van Gogh, 1853~1890)', movement: '후기인상주의' },
      'van gogh': { fullName: '빈센트 반 고흐(Vincent van Gogh, 1853~1890)', movement: '후기인상주의' },
      '클림트': { fullName: '구스타프 클림트(Gustav Klimt, 1862~1918)', movement: '아르누보' },
      'klimt': { fullName: '구스타프 클림트(Gustav Klimt, 1862~1918)', movement: '아르누보' },
      '뭉크': { fullName: '에드바르 뭉크(Edvard Munch, 1863~1944)', movement: '표현주의' },
      'munch': { fullName: '에드바르 뭉크(Edvard Munch, 1863~1944)', movement: '표현주의' },
      '마티스': { fullName: '앙리 마티스(Henri Matisse, 1869~1954)', movement: '야수파' },
      'matisse': { fullName: '앙리 마티스(Henri Matisse, 1869~1954)', movement: '야수파' },
      '샤갈': { fullName: '마르크 샤갈(Marc Chagall, 1887~1985)', movement: '초현실주의' },
      '마르크 샤갈': { fullName: '마르크 샤갈(Marc Chagall, 1887~1985)', movement: '초현실주의' },
      'chagall': { fullName: '마르크 샤갈(Marc Chagall, 1887~1985)', movement: '초현실주의' },
      'marc chagall': { fullName: '마르크 샤갈(Marc Chagall, 1887~1985)', movement: '초현실주의' },
      '피카소': { fullName: '파블로 피카소(Pablo Picasso, 1881~1973)', movement: '입체주의' },
      'picasso': { fullName: '파블로 피카소(Pablo Picasso, 1881~1973)', movement: '입체주의' },
      '프리다': { fullName: '프리다 칼로(Frida Kahlo, 1907~1954)', movement: '초현실주의' },
      '프리다 칼로': { fullName: '프리다 칼로(Frida Kahlo, 1907~1954)', movement: '초현실주의' },
      'frida': { fullName: '프리다 칼로(Frida Kahlo, 1907~1954)', movement: '초현실주의' },
      'frida kahlo': { fullName: '프리다 칼로(Frida Kahlo, 1907~1954)', movement: '초현실주의' },
      '리히텐슈타인': { fullName: '로이 리히텐슈타인(Roy Lichtenstein, 1923~1997)', movement: '팝아트' },
      '로이 리히텐슈타인': { fullName: '로이 리히텐슈타인(Roy Lichtenstein, 1923~1997)', movement: '팝아트' },
      'lichtenstein': { fullName: '로이 리히텐슈타인(Roy Lichtenstein, 1923~1997)', movement: '팝아트' },
      'roy lichtenstein': { fullName: '로이 리히텐슈타인(Roy Lichtenstein, 1923~1997)', movement: '팝아트' }
    };
    
    if (!artistName) return { fullName: '거장', movement: '' };
    const normalized = artistName.toLowerCase().trim();
    if (masterMap[artistName]) return masterMap[artistName];
    if (masterMap[normalized]) return masterMap[normalized];
    
    // 부분 매칭
    for (const [key, value] of Object.entries(masterMap)) {
      if (normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
        return value;
      }
    }
    return { fullName: artistName, movement: '' };
  };

  // ========== 미술사조 표시용 함수 (v67: 새 표기 형식) ==========
  // 제목: 사조(영문, 시기)
  // 부제: 화가명(생몰연도)
  const getMovementDisplayInfo = (styleName, artistName) => {
    // 사조별 영문명, 시기
    const movementInfo = {
      '고대': { en: 'Ancient', period: 'BC~AD 4세기' },
      '고대 그리스-로마': { en: 'Greco-Roman', period: 'BC~AD 4세기' },
      '그리스·로마': { en: 'Greco-Roman', period: 'BC~AD 4세기' },
      '중세': { en: 'Medieval', period: '5~15세기' },
      '중세 미술': { en: 'Medieval', period: '5~15세기' },
      '르네상스': { en: 'Renaissance', period: '14~16세기' },
      '바로크': { en: 'Baroque', period: '17~18세기' },
      '로코코': { en: 'Rococo', period: '18세기' },
      '신고전주의': { en: 'Neoclassicism', period: '18~19세기' },
      '낭만주의': { en: 'Romanticism', period: '19세기' },
      '사실주의': { en: 'Realism', period: '19세기' },
      '신고전 vs 낭만 vs 사실주의': { en: 'Neoclassicism·Romanticism·Realism', period: '18~19세기' },
      '인상주의': { en: 'Impressionism', period: '19세기 말' },
      '후기인상주의': { en: 'Post-Impressionism', period: '19세기 말' },
      '야수파': { en: 'Fauvism', period: '20세기 초' },
      '표현주의': { en: 'Expressionism', period: '20세기 초' },
      '아르누보': { en: 'Art Nouveau', period: '19세기 말' },
      '20세기 모더니즘': { en: 'Modernism', period: '20세기' },
      // 20세기 모더니즘 세부 사조
      '입체주의': { en: 'Cubism', period: '20세기 초' },
      '초현실주의': { en: 'Surrealism', period: '20세기 초중반' },
      '팝아트': { en: 'Pop Art', period: '20세기 중반' },
    };
    
    // 화가별 풀네임, 생몰연도
    const artistInfo = {
      // 고대
      'greek sculpture': { name: '그리스 조각', years: '' },
      'roman mosaic': { name: '로마 모자이크', years: '' },
      // 중세
      'byzantine': { name: '비잔틴', years: '' },
      'gothic': { name: '고딕', years: '' },
      'islamic miniature': { name: '이슬람 세밀화', years: '' },
      // 르네상스
      'leonardo': { name: '레오나르도 다 빈치', years: '1452~1519' },
      'leonardo da vinci': { name: '레오나르도 다 빈치', years: '1452~1519' },
      'michelangelo': { name: '미켈란젤로 부오나로티', years: '1475~1564' },
      'raphael': { name: '라파엘로 산치오', years: '1483~1520' },
      'botticelli': { name: '산드로 보티첼리', years: '1445~1510' },
      'titian': { name: '티치아노 베첼리오', years: '1488~1576' },
      // 바로크
      'caravaggio': { name: '미켈란젤로 메리시 다 카라바조', years: '1571~1610' },
      'rembrandt': { name: '렘브란트 판 레인', years: '1606~1669' },
      'velazquez': { name: '디에고 벨라스케스', years: '1599~1660' },
      'velázquez': { name: '디에고 벨라스케스', years: '1599~1660' },
      'rubens': { name: '피터 파울 루벤스', years: '1577~1640' },
      // 로코코
      'watteau': { name: '장 앙투안 와토', years: '1684~1721' },
      'boucher': { name: '프랑수아 부셰', years: '1703~1770' },
      'françois boucher': { name: '프랑수아 부셰', years: '1703~1770' },
      'fragonard': { name: '장 오노레 프라고나르', years: '1732~1806' },
      // 신고전주의
      'david': { name: '자크 루이 다비드', years: '1748~1825' },
      'jacques-louis david': { name: '자크 루이 다비드', years: '1748~1825' },
      'ingres': { name: '장 오귀스트 도미니크 앵그르', years: '1780~1867' },
      'jean-auguste-dominique ingres': { name: '장 오귀스트 도미니크 앵그르', years: '1780~1867' },
      // 낭만주의
      'delacroix': { name: '외젠 들라크루아', years: '1798~1863' },
      'eugène delacroix': { name: '외젠 들라크루아', years: '1798~1863' },
      'eugene delacroix': { name: '외젠 들라크루아', years: '1798~1863' },
      'turner': { name: '조지프 말러드 윌리엄 터너', years: '1775~1851' },
      'j.m.w. turner': { name: '조지프 말러드 윌리엄 터너', years: '1775~1851' },
      'joseph mallord william turner': { name: '조지프 말러드 윌리엄 터너', years: '1775~1851' },
      'goya': { name: '프란시스코 고야', years: '1746~1828' },
      'francisco goya': { name: '프란시스코 고야', years: '1746~1828' },
      'francisco de goya': { name: '프란시스코 고야', years: '1746~1828' },
      // 사실주의
      'courbet': { name: '귀스타브 쿠르베', years: '1819~1877' },
      'gustave courbet': { name: '귀스타브 쿠르베', years: '1819~1877' },
      'millet': { name: '장 프랑수아 밀레', years: '1814~1875' },
      'jean-françois millet': { name: '장 프랑수아 밀레', years: '1814~1875' },
      'jean-francois millet': { name: '장 프랑수아 밀레', years: '1814~1875' },
      // 인상주의
      'monet': { name: '클로드 모네', years: '1840~1926' },
      'claude monet': { name: '클로드 모네', years: '1840~1926' },
      'renoir': { name: '피에르 오귀스트 르누아르', years: '1841~1919' },
      'pierre-auguste renoir': { name: '피에르 오귀스트 르누아르', years: '1841~1919' },
      'degas': { name: '에드가 드가', years: '1834~1917' },
      'manet': { name: '에두아르 마네', years: '1832~1883' },
      'morisot': { name: '베르트 모리조', years: '1841~1895' },
      'berthe morisot': { name: '베르트 모리조', years: '1841~1895' },
      'caillebotte': { name: '귀스타브 카유보트', years: '1848~1894' },
      'gustave caillebotte': { name: '귀스타브 카유보트', years: '1848~1894' },
      // 후기인상주의
      'van gogh': { name: '빈센트 반 고흐', years: '1853~1890' },
      'vincent van gogh': { name: '빈센트 반 고흐', years: '1853~1890' },
      'gauguin': { name: '폴 고갱', years: '1848~1903' },
      'paul gauguin': { name: '폴 고갱', years: '1848~1903' },
      'cezanne': { name: '폴 세잔', years: '1839~1906' },
      'cézanne': { name: '폴 세잔', years: '1839~1906' },
      // 야수파
      'matisse': { name: '앙리 마티스', years: '1869~1954' },
      'henri matisse': { name: '앙리 마티스', years: '1869~1954' },
      'derain': { name: '앙드레 드랭', years: '1880~1954' },
      'andré derain': { name: '앙드레 드랭', years: '1880~1954' },
      'andre derain': { name: '앙드레 드랭', years: '1880~1954' },
      'vlaminck': { name: '모리스 드 블라맹크', years: '1876~1958' },
      'maurice de vlaminck': { name: '모리스 드 블라맹크', years: '1876~1958' },
      // 표현주의
      'munch': { name: '에드바르 뭉크', years: '1863~1944' },
      'edvard munch': { name: '에드바르 뭉크', years: '1863~1944' },
      'kirchner': { name: '에른스트 루트비히 키르히너', years: '1880~1938' },
      'ernst ludwig kirchner': { name: '에른스트 루트비히 키르히너', years: '1880~1938' },
      'kokoschka': { name: '오스카 코코슈카', years: '1886~1980' },
      'oskar kokoschka': { name: '오스카 코코슈카', years: '1886~1980' },
      // 20세기 모더니즘
      'picasso': { name: '파블로 피카소', years: '1881~1973' },
      'pablo picasso': { name: '파블로 피카소', years: '1881~1973' },
      'lichtenstein': { name: '로이 리히텐슈타인', years: '1923~1997' },
      'roy lichtenstein': { name: '로이 리히텐슈타인', years: '1923~1997' },
      'haring': { name: '키스 해링', years: '1958~1990' },
      'keith haring': { name: '키스 해링', years: '1958~1990' },
      'miro': { name: '호안 미로', years: '1893~1983' },
      'miró': { name: '호안 미로', years: '1893~1983' },
      'joan miro': { name: '호안 미로', years: '1893~1983' },
      'joan miró': { name: '호안 미로', years: '1893~1983' },
      'magritte': { name: '르네 마그리트', years: '1898~1967' },
      'rené magritte': { name: '르네 마그리트', years: '1898~1967' },
      'rene magritte': { name: '르네 마그리트', years: '1898~1967' },
      'chagall': { name: '마르크 샤갈', years: '1887~1985' },
      'marc chagall': { name: '마르크 샤갈', years: '1887~1985' },
    };
    
    // 제목 생성: 사조(영문, 시기)
    let actualMovement = styleName;
    
    // "신고전 vs 낭만 vs 사실주의"인 경우 화가에 따라 사조 결정
    if (styleName === '신고전 vs 낭만 vs 사실주의' && artistName) {
      const normalized = artistName.toLowerCase().trim();
      // 신고전주의 화가
      if (['david', 'jacques-louis david', 'ingres'].includes(normalized)) {
        actualMovement = '신고전주의';
      }
      // 낭만주의 화가
      else if (['delacroix', 'turner'].includes(normalized)) {
        actualMovement = '낭만주의';
      }
      // 사실주의 화가
      else if (['courbet', 'manet'].includes(normalized)) {
        actualMovement = '사실주의';
      }
    }
    
    // "신고전 vs 낭만 vs 사실주의"인 경우 화가에 따라 사조 결정
    if (styleName === '신고전 vs 낭만 vs 사실주의') {
      console.log('🎨 [신고전vs낭만vs사실 디버깅]', {
        styleName,
        artistName,
        hasArtistName: !!artistName
      });
      
      if (artistName) {
        const normalized = artistName.toLowerCase().trim();
        console.log('🔍 [normalized]:', normalized);
        
        // 신고전주의 화가
        if (['david', 'jacques-louis david', 'ingres', 'jean-auguste-dominique ingres'].includes(normalized)) {
          actualMovement = '신고전주의';
          console.log('✅ 신고전주의 매칭');
        }
        // 낭만주의 화가
        else if (['delacroix', 'eugène delacroix', 'eugene delacroix', 'turner', 'j.m.w. turner', 'joseph mallord william turner'].includes(normalized)) {
          actualMovement = '낭만주의';
          console.log('✅ 낭만주의 매칭');
        }
        // 사실주의 화가
        else if (['courbet', 'gustave courbet', 'manet', 'édouard manet', 'edouard manet'].includes(normalized)) {
          actualMovement = '사실주의';
          console.log('✅ 사실주의 매칭');
        } else {
          console.log('❌ 매칭 실패 - 화가명:', normalized);
        }
      } else {
        console.log('❌ artistName 없음');
      }
    }
    
    // "20세기 모더니즘"인 경우 화가에 따라 사조 결정
    if (styleName === '20세기 모더니즘') {
      console.log('🎨 [모더니즘 디버깅]', {
        styleName,
        artistName,
        hasArtistName: !!artistName,
        artistNameType: typeof artistName
      });
      
      if (artistName) {
        const normalized = artistName.toLowerCase().trim();
        console.log('🔍 [normalized]:', normalized);
        
        // 입체주의 화가
        if (['picasso', 'pablo picasso'].includes(normalized)) {
          actualMovement = '입체주의';
          console.log('✅ 입체주의 매칭');
        }
        // 초현실주의 화가
        else if (['magritte', 'rené magritte', 'rene magritte', 'miro', 'miró', 'joan miro', 'joan miró', 'chagall', 'marc chagall'].includes(normalized)) {
          actualMovement = '초현실주의';
          console.log('✅ 초현실주의 매칭');
        }
        // 팝아트 화가 (워홀 제거)
        else if (['lichtenstein', 'roy lichtenstein', 'haring', 'keith haring'].includes(normalized)) {
          actualMovement = '팝아트';
          console.log('✅ 팝아트 매칭');
        } else {
          console.log('❌ 매칭 실패 - 화가명:', normalized);
        }
      } else {
        console.log('❌ artistName 없음');
      }
    }
    
    const mvInfo = movementInfo[actualMovement] || { en: styleName, period: '' };
    const title = mvInfo.period ? `${actualMovement}(${mvInfo.en}, ${mvInfo.period})` : `${actualMovement}(${mvInfo.en})`;
    
    // 부제 생성: 화가명만 (생몰연도 제거)
    const normalized = artistName ? artistName.toLowerCase().trim() : '';
    const artInfo = artistInfo[normalized] || { name: artistName, years: '' };
    const subtitle = artInfo.name;
    
    return { title, subtitle };
  };

  // ========== 동양화 표시용 함수 (v67: 새 표기 형식) ==========
  // 제목: 국가 전통회화(영문)
  // 부제: 스타일(영문)
  const getOrientalDisplayInfo = (artistName) => {
    const orientalMap = {
      // 한국
      'korean minhwa': { country: '한국 전통회화', countryEn: 'Korean Traditional Painting', style: '민화', en: 'Minhwa' },
      'korean pungsokdo': { country: '한국 전통회화', countryEn: 'Korean Traditional Painting', style: '풍속도', en: 'Pungsokdo' },
      'korean jingyeong': { country: '한국 전통회화', countryEn: 'Korean Traditional Painting', style: '진경산수화', en: 'Jingyeong' },
      '민화': { country: '한국 전통회화', countryEn: 'Korean Traditional Painting', style: '민화', en: 'Minhwa' },
      '풍속화': { country: '한국 전통회화', countryEn: 'Korean Traditional Painting', style: '풍속도', en: 'Pungsokdo' },
      '풍속도': { country: '한국 전통회화', countryEn: 'Korean Traditional Painting', style: '풍속도', en: 'Pungsokdo' },
      '진경산수': { country: '한국 전통회화', countryEn: 'Korean Traditional Painting', style: '진경산수화', en: 'Jingyeong' },
      '진경산수화': { country: '한국 전통회화', countryEn: 'Korean Traditional Painting', style: '진경산수화', en: 'Jingyeong' },
      // 중국
      'chinese gongbi': { country: '중국 전통회화', countryEn: 'Chinese Traditional Painting', style: '공필화', en: 'Gongbi' },
      'chinese ink wash': { country: '중국 전통회화', countryEn: 'Chinese Traditional Painting', style: '수묵화', en: 'Ink Wash' },
      '공필화': { country: '중국 전통회화', countryEn: 'Chinese Traditional Painting', style: '공필화', en: 'Gongbi' },
      '수묵화': { country: '중국 전통회화', countryEn: 'Chinese Traditional Painting', style: '수묵화', en: 'Ink Wash' },
      // 일본
      'japanese ukiyo-e': { country: '일본 전통회화', countryEn: 'Japanese Traditional Painting', style: '우키요에', en: 'Ukiyo-e' },
      '우키요에': { country: '일본 전통회화', countryEn: 'Japanese Traditional Painting', style: '우키요에', en: 'Ukiyo-e' },
      '일본 우키요에': { country: '일본 전통회화', countryEn: 'Japanese Traditional Painting', style: '우키요에', en: 'Ukiyo-e' },
    };
    
    const normalized = artistName ? artistName.toLowerCase().trim() : '';
    
    // 직접 매핑
    let info = orientalMap[normalized] || orientalMap[artistName];
    
    // 부분 매칭
    if (!info) {
      for (const [key, value] of Object.entries(orientalMap)) {
        if (normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
          info = value;
          break;
        }
      }
    }
    
    if (info) {
      return { 
        title: `${info.country}(${info.countryEn})`, 
        subtitle: `${info.style}(${info.en})` 
      };
    }
    
    return { title: '동양화', subtitle: artistName || '' };
  };

  // 카테고리별 부제 포맷 (v67: 새 표기 형식)
  // 거장: 사조(시기)
  // 미술사조: 화가명(생몰연도)
  // 동양화: 스타일(영문)
  const getSubtitle = (result) => {
    const cat = result?.style?.category;
    const artist = result?.aiSelectedArtist;
    const styleName = result?.style?.name;
    
    if (cat === 'masters') {
      const masterInfo = getMasterInfo(artist);
      return masterInfo.movement || '거장';
    } else if (cat === 'movements') {
      const movementInfo = getMovementDisplayInfo(styleName, artist);
      return movementInfo.subtitle;
    } else if (cat === 'oriental') {
      const orientalInfo = getOrientalDisplayInfo(artist);
      return orientalInfo.subtitle;
    } else {
      return formatArtistName(artist);
    }
  };

  // 제목 반환 (v67: 새 표기 형식)
  // 거장: 풀네임(영문, 생몰연도)
  // 미술사조: 사조(영문, 시기)
  // 동양화: 국가 전통회화
  const getTitle = (result) => {
    const cat = result?.style?.category;
    const artist = result?.aiSelectedArtist;
    const styleName = result?.style?.name;
    
    if (cat === 'masters' && artist) {
      const masterInfo = getMasterInfo(artist);
      return masterInfo.fullName;
    } else if (cat === 'movements') {
      const movementInfo = getMovementDisplayInfo(styleName, artist);
      return movementInfo.title;
    } else if (cat === 'oriental') {
      const orientalInfo = getOrientalDisplayInfo(artist);
      return orientalInfo.title;
    }
    return result?.style?.name || '';
  };

  // 하위 호환성: getMasterFullName → getTitle 으로 대체
  const getMasterFullName = (result) => getTitle(result);

  // 원클릭 2차 교육 (결과별) - v51: educationMatcher.js 사용
  const getSecondaryEducation = (result) => {
    if (!result) return null;
    
    const artistName = result.aiSelectedArtist || '';
    const workName = result.selected_work || '';
    const resultCategory = result.style?.category;
    
    // v51: educationMatcher.js 사용 (ResultScreen과 동일)
    const key = getEducationKey(resultCategory, artistName, workName);
    
    // v66: 간단한 매칭 로그
    console.log(`📚 교육자료 매칭: ${resultCategory} → ${key || '없음'} (${artistName}, ${workName || '-'})`);
    
    if (key) {
      // 교육자료 데이터 객체 구성
      const educationData = {
        masters: oneclickMastersSecondary,
        movements: oneclickMovementsSecondary,
        oriental: oneclickOrientalSecondary
      };
      
      // console.log('📦 educationData constructed:');
      // console.log('   - masters keys:', Object.keys(oneclickMastersSecondary || {}).slice(0, 5));
      // console.log('   - checking key:', key, 'in category:', resultCategory);
      
      // 직접 확인
      if (resultCategory === 'masters') {
        // console.log('   - direct check:', oneclickMastersSecondary?.[key] ? 'EXISTS' : 'NOT FOUND');
      }
      
      const content = getEducationContent(resultCategory, key, educationData);
      // console.log('   - getEducationContent returned:', content ? 'HAS CONTENT' : 'NULL');
      
      if (content) {
        // console.log('✅ Found education content for:', key);
        // 교육자료 파일에서 name 가져오기
        let eduName = artistName;
        if (resultCategory === 'masters' && oneclickMastersSecondary[key]) {
          eduName = oneclickMastersSecondary[key].name || artistName;
        } else if (resultCategory === 'movements' && oneclickMovementsSecondary[key]) {
          eduName = oneclickMovementsSecondary[key].name || artistName;
        } else if (resultCategory === 'oriental' && oneclickOrientalSecondary[key]) {
          eduName = oneclickOrientalSecondary[key].name || artistName;
        }
        return { name: eduName, content: content };
      }
    }
    
    // console.log('❌ No education found');
    return null;
  };

  // v51: artistNameToKey 함수는 더 이상 사용하지 않음
  // educationMatcher.js의 getEducationKey로 대체됨
  // (하위 호환성을 위해 주석으로 보존)
  /*
  const artistNameToKey = (artistName, workName, resultCategory, educationData) => {
    // ... 기존 코드 생략 ...
  };
  */

  // ========== UI 핸들러 ==========
  const handleDotClick = (idx) => {
    if (idx < completedCount) setViewIndex(idx);
  };
  
  const handleBackToEducation = () => setViewIndex(-1);

  const [touchStartY, setTouchStartY] = useState(0);

  const handleTouchStart = (e) => {
    if (!isFullTransform) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (!isFullTransform || !touchStartX) return;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    const diffY = touchStartY - e.changedTouches[0].clientY;
    
    // 수평 스와이프만 인식 (X축 이동이 Y축보다 커야 함)
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && viewIndex < completedCount - 1) setViewIndex(v => v + 1);
      if (diffX < 0 && viewIndex > -1) setViewIndex(v => v - 1);
    }
    setTouchStartX(0);
    setTouchStartY(0);
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // 현재 보여줄 결과
  const previewResult = viewIndex >= 0 ? completedResults[viewIndex] : null;
  const previewEdu = previewResult ? getSecondaryEducation(previewResult) : null;

  return (
    <div className="processing-screen">
      <div 
        className="processing-content"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 헤더 */}
        <div className="header">
          <h2>{isFullTransform ? '✨ 전체 변환' : '🎨 변환 중'}</h2>
        </div>

        {/* 상태 */}
        <div className="status">
          <div className="spinner"></div>
          <p>{statusText}</p>
        </div>

        {/* ===== 원클릭 모드 ===== */}
        {isFullTransform && (
          <>
            {/* 1차 교육 + 원본 사진 */}
            {viewIndex === -1 && showEducation && getPrimaryEducation() && (
              <div className="preview">
                <img src={URL.createObjectURL(photo)} alt="원본 사진" />
                <div className="preview-info">
                  <div className="preview-style">{selectedStyle?.name || '전체 변환'}</div>
                </div>
                <div className="edu-card primary">
                  <h3>{getPrimaryEducation().title}</h3>
                  <p>{getPrimaryEducation().content}</p>
                  {completedCount > 0 && <p className="hint">👆 완료된 결과를 확인하세요</p>}
                </div>
              </div>
            )}

            {/* 결과 미리보기 */}
            {viewIndex >= 0 && previewResult && (
              <div className="preview">
                <img src={previewResult.resultUrl} alt="" />
                <div className="preview-info">
                  <div className="preview-style">
                    {getTitle(previewResult)}
                  </div>
                  <div className="preview-subtitle">{getSubtitle(previewResult)}</div>
                </div>
                {previewEdu && (
                  <div className="edu-card secondary">
                    <p>{previewEdu.content}</p>
                  </div>
                )}
              </div>
            )}

            {/* 점 네비게이션 + 이전/다음 버튼 */}
            <div className="dots-nav">
              <button 
                className="nav-btn"
                onClick={() => {
                  if (viewIndex === -1 && completedCount > 0) {
                    setViewIndex(completedCount - 1);
                  } else if (viewIndex > 0) {
                    setViewIndex(viewIndex - 1);
                  } else if (viewIndex === 0) {
                    setViewIndex(-1);
                  }
                }}
                disabled={viewIndex === -1 && completedCount === 0}
              >
                ◀ 이전
              </button>
              
              <div className="dots">
                <button className={`dot edu ${viewIndex === -1 ? 'active' : ''}`} onClick={handleBackToEducation}>📚</button>
                {styles.map((_, idx) => (
                  <button 
                    key={idx}
                    className={`dot ${idx < completedCount ? 'done' : ''} ${viewIndex === idx ? 'active' : ''}`}
                    onClick={() => handleDotClick(idx)}
                    disabled={idx >= completedCount}
                  />
                ))}
                <span className="count">[{viewIndex === -1 ? 0 : viewIndex + 1}/{totalCount}]</span>
              </div>
              
              <button 
                className="nav-btn"
                onClick={() => {
                  if (viewIndex === -1 && completedCount > 0) {
                    setViewIndex(0);
                  } else if (viewIndex >= 0 && viewIndex < completedCount - 1) {
                    setViewIndex(viewIndex + 1);
                  }
                }}
                disabled={viewIndex >= completedCount - 1 || completedCount === 0}
              >
                다음 ▶
              </button>
            </div>
          </>
        )}

        {/* ===== 단일 변환 모드 ===== */}
        {!isFullTransform && showEducation && getSingleEducationContent(selectedStyle) && (
          <div className="edu-card primary">
            <h3>{getSingleEducationContent(selectedStyle).title}</h3>
            <p>{getSingleEducationContent(selectedStyle).desc}</p>
          </div>
        )}
      </div>

      <style>{`
        .processing-screen {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .processing-content {
          background: white;
          padding: 24px;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .header h2 { margin: 0; font-size: 18px; color: #333; }
        .back-btn {
          padding: 6px 12px;
          background: #f0f0f0;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
        }
        .status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 16px 0;
        }
        .status p { margin: 0; color: #666; font-size: 14px; }
        .spinner {
          width: 20px; height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .edu-card {
          padding: 16px;
          border-radius: 10px;
          margin: 16px 0;
        }
        .edu-card.primary {
          background: linear-gradient(135deg, #fff5f5, #ffe5e5);
          border-left: 3px solid #667eea;
        }
        .edu-card.secondary {
          background: linear-gradient(135deg, #f0fff0, #e5ffe5);
          border-left: 3px solid #4CAF50;
        }
        .edu-card h3 { color: #667eea; margin: 0 0 10px; font-size: 15px; }
        .edu-card h4 { color: #4CAF50; margin: 0 0 8px; font-size: 14px; }
        .edu-card p { color: #333; line-height: 1.6; font-size: 13px; margin: 0; white-space: pre-line; }
        .hint { color: #999; font-size: 12px; text-align: center; margin-top: 12px !important; }
        
        .preview { background: #f8f9fa; border-radius: 12px; overflow: hidden; margin: 16px 0; }
        .preview img { width: 100%; display: block; }
        .preview-info { 
          padding: 16px; 
          text-align: left;
          border-bottom: 2px solid #e0e0e0;
        }
        .preview-style { 
          font-size: 1.35rem; 
          font-weight: 600; 
          color: #333; 
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .preview-subtitle { 
          font-size: 1.05rem; 
          font-weight: 600; 
          color: #222;
        }
        
        .dots-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 16px;
        }
        .dots-nav .nav-btn {
          padding: 8px 14px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
        }
        .dots-nav .nav-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          border: none;
          background: #ddd;
          cursor: pointer;
          padding: 0;
        }
        .dot.done { background: #4CAF50; }
        .dot.active { transform: scale(1.4); box-shadow: 0 0 0 2px rgba(102,126,234,0.4); }
        .dot:disabled { opacity: 0.4; cursor: default; }
        .dot.edu {
          width: auto; padding: 4px 8px;
          border-radius: 10px;
          font-size: 12px;
          background: #667eea;
        }
        .count { font-size: 12px; color: #999; margin-left: 8px; }
      `}</style>
    </div>
  );
};

export default ProcessingScreen;
