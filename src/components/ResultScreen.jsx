// PicoArt v68 - ResultScreen
// 원클릭 교육자료 매칭: educationMatcher.js로 분리 (v51 새로 작성)
// 2025-12-18 업데이트: 교육자료 매칭 로직 전면 재작성
// v68: 거장(AI) 대화 기능 추가, 교육 데이터 구조 개선

import React, { useState, useEffect, useRef } from 'react';
import BeforeAfter from './BeforeAfter';
import MasterChat from './MasterChat';
// v68: 새로운 교육 데이터 구조 import
import { movementsOverview, movementsEducation, movementsBasicInfo, artistFullNames } from '../data/movementsEducation';
import { mastersBasicInfo, mastersLoadingEducation, mastersResultEducation, mastersEducation } from '../data/mastersEducation';
import { orientalBasicInfo, orientalOverview, orientalEducation } from '../data/orientalEducation';
// 원클릭 전용 교육자료 (분리된 파일)
import { oneclickMovementsSecondary } from '../data/oneclickMovementsEducation';
import { oneclickMastersSecondary } from '../data/oneclickMastersEducation';
import { oneclickOrientalSecondary } from '../data/oneclickOrientalEducation';
import { saveToGallery } from './GalleryScreen';
import { processStyleTransfer } from '../utils/styleTransferAPI';
// v51: 새로운 교육자료 매칭 유틸리티
import { getEducationKey, getEducationContent } from '../utils/educationMatcher';


const ResultScreen = ({ 
  originalPhoto, 
  resultImage, 
  selectedStyle, 
  aiSelectedArtist,
  aiSelectedWork,
  fullTransformResults,
  onReset,
  onGallery,
  onRetrySuccess,
  masterChatData: appMasterChatData,
  onMasterChatDataChange,
  currentMasterIndex: appCurrentIndex,
  onMasterIndexChange,
  masterResultImages: appMasterResultImages,
  onMasterResultImagesChange,
  retransformingMasters: appRetransformingMasters,
  onRetransformingMastersChange
}) => {
  
  // ========== 원클릭 결과 처리 ==========
  const isFullTransform = fullTransformResults && fullTransformResults.length > 0;
  
  // currentIndex를 App.jsx에서 관리 (갤러리 이동해도 유지)
  const currentIndex = appCurrentIndex || 0;
  const setCurrentIndex = (val) => {
    if (onMasterIndexChange) {
      onMasterIndexChange(typeof val === 'function' ? val(currentIndex) : val);
    }
  };
  
  // ========== 스와이프 ==========
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  
  // ========== 재시도 관련 ==========
  const [results, setResults] = useState(fullTransformResults || []);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryProgress, setRetryProgress] = useState('');
  
  // fullTransformResults가 변경되면 results도 업데이트
  useEffect(() => {
    if (fullTransformResults) {
      setResults(fullTransformResults);
    }
  }, [fullTransformResults]);
  
  // 실패한 결과 개수
  const failedCount = results.filter(r => !r.success).length;
  
  // 현재 보여줄 결과
  const currentResult = isFullTransform ? results[currentIndex] : null;
  // 단독변환: 재시도 성공 시 singleRetryResult 사용
  const [singleRetryResultState, setSingleRetryResultState] = useState(null);
  const displayImage = isFullTransform 
    ? currentResult?.resultUrl 
    : (singleRetryResultState?.resultUrl || resultImage);
  const displayArtist = isFullTransform 
    ? currentResult?.aiSelectedArtist 
    : (singleRetryResultState?.aiSelectedArtist || aiSelectedArtist);
  const displayWork = isFullTransform 
    ? currentResult?.selected_work 
    : (singleRetryResultState?.selected_work || aiSelectedWork);
  const displayCategory = isFullTransform ? currentResult?.style?.category : selectedStyle?.category;
  
  // ========== State ==========
  const [showInfo, setShowInfo] = useState(true);
  const [educationText, setEducationText] = useState('');
  const [isLoadingEducation, setIsLoadingEducation] = useState(true);
  const [savedToGallery, setSavedToGallery] = useState(false);
  const hasSavedRef = useRef(false);

  // ========== 거장 AI 대화 관련 State (v68) ==========
  // 재변환 상태 (App.jsx에서 관리, 객체로 안전하게)
  const retransformingMasters = appRetransformingMasters || {};
  
  // 거장 변환 시작
  const startRetransforming = (masterKey) => {
    if (onRetransformingMastersChange) {
      onRetransformingMastersChange(prev => ({ ...prev, [masterKey]: true }));
    }
  };
  
  // 거장 변환 완료
  const stopRetransforming = (masterKey) => {
    if (onRetransformingMastersChange) {
      onRetransformingMastersChange(prev => {
        const newState = { ...prev };
        delete newState[masterKey];
        return newState;
      });
    }
  };
  
  // 변환 중 여부 (갤러리 버튼 비활성화용)
  const isAnyMasterRetransforming = Object.keys(retransformingMasters).length > 0;
  
  // 거장별 재변환 이미지 (App.jsx에서 관리, 갤러리 이동해도 유지)
  const masterResultImages = appMasterResultImages || {};
  const setMasterResultImages = (val) => {
    if (onMasterResultImagesChange) {
      onMasterResultImagesChange(typeof val === 'function' ? val(masterResultImages) : val);
    }
  };
  
  // 거장별 대화 데이터 (App.jsx에서 관리, 갤러리 이동해도 유지)
  const masterChatData = appMasterChatData || {};
  
  // 거장 키 추출 (displayArtist에서) - 영문/한글 모두 지원
  const getMasterKey = (artistName) => {
    if (!artistName) return null;
    const name = artistName.toUpperCase();
    if (name.includes('VAN GOGH') || name.includes('GOGH') || name.includes('고흐')) return 'VAN GOGH';
    if (name.includes('KLIMT') || name.includes('클림트')) return 'KLIMT';
    if (name.includes('MUNCH') || name.includes('뭉크')) return 'MUNCH';
    if (name.includes('CHAGALL') || name.includes('샤갈')) return 'CHAGALL';
    if (name.includes('PICASSO') || name.includes('피카소')) return 'PICASSO';
    if (name.includes('MATISSE') || name.includes('마티스')) return 'MATISSE';
    if (name.includes('FRIDA') || name.includes('KAHLO') || name.includes('프리다') || name.includes('칼로')) return 'FRIDA';
    if (name.includes('LICHTENSTEIN') || name.includes('리히텐')) return 'LICHTENSTEIN';
    return null;
  };
  
  const currentMasterKey = displayCategory === 'masters' ? getMasterKey(displayArtist) : null;
  
  // 현재 거장이 변환 중인지 (스피너 표시용)
  const isCurrentMasterWorking = currentMasterKey && retransformingMasters[currentMasterKey];
  
  // 현재 거장의 재변환 이미지
  const currentMasterResultImage = currentMasterKey ? masterResultImages[currentMasterKey] : null;
  
  // 현재 표시할 결과 이미지 (거장별 재변환 결과 우선)
  const finalDisplayImage = currentMasterResultImage || displayImage;
  
  // 거장별 대화 데이터 업데이트
  const updateMasterChatData = (masterKey, chatData) => {
    if (onMasterChatDataChange) {
      onMasterChatDataChange({
        ...masterChatData,
        [masterKey]: chatData
      });
    }
  };

  // 거장 AI 재변환 핸들러 (다중 변환 지원)
  const handleMasterRetransform = async (correctionPrompt, masterKey) => {
    console.log('🔴 handleMasterRetransform 호출됨', { correctionPrompt, masterKey });
    
    // 이미 이 거장이 변환 중이면 차단
    if (!correctionPrompt || !masterKey || retransformingMasters[masterKey]) return;
    
    console.log('🔴 재변환 시작!', masterKey);
    startRetransforming(masterKey);  // 이 거장 변환 시작
    
    let success = false;
    
    try {
      // 원클릭 모드: currentResult의 style 사용, 단독: selectedStyle 사용
      const styleToUse = isFullTransform ? currentResult?.style : selectedStyle;
      
      // v69: 점진적 수정 - 원본이 아닌 현재 결과물 기반으로 재변환
      // 이미 재변환한 결과가 있으면 그것을, 없으면 1차 결과를 사용
      const currentImageUrl = masterResultImages[masterKey] || displayImage;
      
      // URL을 Blob으로 변환 (processStyleTransfer는 File/Blob을 기대)
      let imageToModify;
      if (currentImageUrl && typeof currentImageUrl === 'string' && 
          (currentImageUrl.startsWith('http') || currentImageUrl.startsWith('blob:'))) {
        // URL인 경우 fetch해서 Blob으로 변환
        const response = await fetch(currentImageUrl);
        const blob = await response.blob();
        imageToModify = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      } else {
        // 이미 File/Blob인 경우 그대로 사용
        imageToModify = currentImageUrl || originalPhoto;
      }
      
      // 기존 FLUX API 호출 (보정 프롬프트 추가)
      const result = await processStyleTransfer(
        imageToModify,
        styleToUse,
        correctionPrompt  // 보정 프롬프트 전달
      );
      
      if (result.success && result.resultUrl) {
        success = true;
        
        // 거장별로 재변환 이미지 저장
        setMasterResultImages(prev => ({
          ...prev,
          [masterKey]: result.resultUrl
        }));
        
        // 갤러리에 자동 저장
        const category = styleToUse?.category;
        const rawName = displayArtist || styleToUse?.name || '변환 이미지';
        const styleName = formatGalleryName(rawName, category, displayWork) + ' (AI 수정)';
        const categoryName = '거장';
        await saveToGallery(result.resultUrl, styleName, categoryName);
      }
    } catch (error) {
      console.error('Master retransform error:', error);
    }
    
    // 완료 플래그 먼저 설정 (MasterChat이 메시지 추가하도록)
    if (success) {
      // v70: 2초 딜레이 추가 (거장이 정성들여 수정하는 느낌)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateMasterChatData(masterKey, {
        ...masterChatData[masterKey],
        retransformCompleted: true  // 완료 플래그
      });
    }
    
    // 그 다음 버튼 활성화
    stopRetransforming(masterKey);
  };


  // ========== 갤러리 자동 저장 ==========
  useEffect(() => {
    // 원클릭은 별도 저장 로직
    if (isFullTransform) {
      // 모든 결과 저장
      const saveAllResults = async () => {
        for (const result of fullTransformResults) {
          if (result.success && result.resultUrl) {
            const category = result.style?.category || selectedStyle?.category;
            const rawName = result.aiSelectedArtist || result.style?.name || '변환 이미지';
            const workName = result.selected_work || null;
            const styleName = formatGalleryName(rawName, category, workName);
            const categoryName = category === 'movements' ? '미술사조' 
              : category === 'masters' ? '거장' 
              : category === 'oriental' ? '동양화' 
              : '';
            await saveToGallery(result.resultUrl, styleName, categoryName);
          }
        }
        // console.log('✅ 원클릭 결과 모두 갤러리에 저장됨');
      };
      if (!hasSavedRef.current) {
        hasSavedRef.current = true;
        saveAllResults();
      }
      return;
    }
    
    // 단일 변환: 기존 로직
    if (hasSavedRef.current || !resultImage) return;
    
    const saveToGalleryAsync = async () => {
      // 스타일 이름 결정 - <카테고리> 세부정보 형식
      const category = selectedStyle?.category;
      const rawName = aiSelectedArtist || selectedStyle?.name || '변환 이미지';
      const workName = aiSelectedWork || null;
      const styleName = formatGalleryName(rawName, category, workName);
      
      // 카테고리 이름
      const categoryName = category === 'movements' ? '미술사조' 
        : category === 'masters' ? '거장' 
        : category === 'oriental' ? '동양화' 
        : '';
      
      // 갤러리에 저장 (async)
      const saved = await saveToGallery(resultImage, styleName, categoryName);
      if (saved) {
        hasSavedRef.current = true;
        setSavedToGallery(true);
        // console.log('✅ 갤러리에 자동 저장 완료 (IndexedDB):', styleName);
      }
    };
    
    saveToGalleryAsync();
  }, [resultImage, selectedStyle, aiSelectedArtist, fullTransformResults, isFullTransform]);


  // ========== 다시 시도 함수 ==========
  const handleRetry = async () => {
    if (!originalPhoto || isRetrying) return;
    
    const failedResults = results.filter(r => !r.success);
    if (failedResults.length === 0) return;
    
    setIsRetrying(true);
    // console.log(`🔄 다시 시도 시작: ${failedResults.length}개 실패한 변환`);
    
    let successCount = 0;
    let updatedResults = [...results];  // 업데이트된 결과 추적용
    
    for (let i = 0; i < failedResults.length; i++) {
      const failed = failedResults[i];
      const failedIndex = results.findIndex(r => r.style?.id === failed.style?.id);
      
      setRetryProgress('다시 시도 중...');
      
      try {
        const result = await processStyleTransfer(
          originalPhoto,
          failed.style,
          null,
          () => {}  // 진행 콜백 불필요
        );
        
        if (result.success) {
          // 성공하면 해당 인덱스 결과 업데이트
          const newResult = {
            style: failed.style,
            resultUrl: result.resultUrl,
            aiSelectedArtist: result.aiSelectedArtist,
            selected_work: result.selected_work,
            success: true
          };
          
          setResults(prev => {
            const newResults = [...prev];
            newResults[failedIndex] = newResult;
            return newResults;
          });
          
          updatedResults[failedIndex] = newResult;  // 로컬 추적용도 업데이트
          successCount++;
          // console.log(`✅ 다시 시도 성공: ${failed.style?.name}`);
          
          // 갤러리에 저장 - <카테고리> 세부정보 형식
          const category = failed.style?.category;
          const rawName = result.aiSelectedArtist || failed.style?.name || '변환 이미지';
          const workName = result.selected_work || null;
          const styleName = formatGalleryName(rawName, category, workName);
          const categoryName = category === 'movements' ? '미술사조' 
            : category === 'masters' ? '거장' 
            : category === 'oriental' ? '동양화' 
            : '';
          await saveToGallery(result.resultUrl, styleName, categoryName);
        } else {
          // console.log(`❌ 다시 시도 실패: ${failed.style?.name} - ${result.error}`);
        }
      } catch (error) {
        console.error(`❌ 다시 시도 에러: ${failed.style?.name}`, error);
      }
    }
    
    setIsRetrying(false);
    setRetryProgress('');
    
    if (successCount > 0) {
      // App.jsx 상태도 업데이트 (갤러리 이동 후에도 유지)
      if (onRetrySuccess) {
        onRetrySuccess({ isFullTransform: true, results: updatedResults });
      }
      alert('다시 시도 성공!');
    }
    // 실패 시 alert 없이 자연스럽게 UI로 복귀
  };

  // ========== 단독변환 다시 시도 함수 ==========
  const handleSingleModeRetry = async () => {
    if (!originalPhoto || !selectedStyle || isRetrying) return;
    
    setIsRetrying(true);
    setRetryProgress(`${selectedStyle.name} 다시 시도 중...`);
    // console.log(`🔄 단독변환 다시 시도: ${selectedStyle.name}`);
    
    try {
      const result = await processStyleTransfer(
        originalPhoto,
        selectedStyle,
        null,
        (progress) => setRetryProgress(`${selectedStyle.name}: ${progress}`)
      );
      
      if (result.success) {
        // console.log(`✅ 단독변환 다시 시도 성공: ${selectedStyle.name}`);
        setSingleRetryResultState(result);
        
        // App.jsx 상태도 업데이트 (갤러리 이동 후에도 유지)
        if (onRetrySuccess) {
          onRetrySuccess(result);
        }
        
        // 갤러리에 저장 - <카테고리> 세부정보 형식
        const category = selectedStyle.category;
        const rawName = result.aiSelectedArtist || selectedStyle.name || '변환 이미지';
        const workName = result.selected_work || null;
        const styleName = formatGalleryName(rawName, category, workName);
        const categoryName = category === 'movements' ? '미술사조' 
          : category === 'masters' ? '거장' 
          : category === 'oriental' ? '동양화' 
          : '';
        await saveToGallery(result.resultUrl, styleName, categoryName);
        
        alert('다시 시도 성공!');
      } else {
        // console.log(`❌ 단독변환 다시 시도 실패: ${selectedStyle.name} - ${result.error}`);
        // 실패 시 alert 없이 자연스럽게 UI로 복귀
      }
    } catch (error) {
      console.error(`❌ 단독변환 다시 시도 에러:`, error);
      // 에러 시에도 alert 없이 UI로 복귀
    }
    
    setIsRetrying(false);
    setRetryProgress('');
  };


  // ========== Effects ==========
  // aiSelectedArtist가 변경될 때마다 2차 교육 재생성
  // 원클릭: currentIndex 변경 또는 currentResult 업데이트 시 재생성
  useEffect(() => {
    // console.log('🎨 ResultScreen mounted or aiSelectedArtist changed');
    generate2ndEducation();
  }, [aiSelectedArtist, currentIndex, currentResult?.aiSelectedArtist, currentResult?.selected_work]);

  // 원클릭: 화면 이동 시 현재 결과 로그
  useEffect(() => {
    console.log('🔍 [NavLog Debug] isFullTransform:', isFullTransform, 'currentResult:', !!currentResult);
    
    if (isFullTransform && currentResult) {
      // v68: 화면 전환 시 콘솔 네비 로그 (그룹핑 + 상세정보)
      const category = currentResult.style?.category;
      const styleName = currentResult.style?.name;
      const artist = currentResult.aiSelectedArtist;
      const work = currentResult.selected_work;
      
      console.log('');
      console.log(`📍 [${currentIndex + 1}/${results.length}] ─────────────────────`);
      
      if (category === 'masters') {
        const masterInfo = getMasterInfo(artist);
        console.log(`   🎨 ${masterInfo.fullName}`);
        console.log(`   📌 ${masterInfo.movement}`);
      } else if (category === 'movements') {
        const movementInfo = getMovementDisplayInfo(styleName, artist);
        console.log(`   🎨 ${movementInfo.title}`);
        console.log(`   👤 ${movementInfo.subtitle}`);
      } else if (category === 'oriental') {
        const orientalInfo = getOrientalDisplayInfo(artist);
        console.log(`   🎨 ${orientalInfo.title}`);
        console.log(`   📌 ${orientalInfo.subtitle}`);
      } else {
        console.log(`   🎨 ${styleName}`);
        console.log(`   👤 ${artist || '?'}`);
      }
      
      if (work) {
        console.log(`   🖼️ ${work}`);
      }
      
      if (currentResult.success) {
        console.log(`   ✅ 성공`);
      } else {
        console.log(`   ❌ 에러: ${currentResult.error}`);
      }
    }
  }, [currentIndex, isFullTransform, currentResult, results.length]);


  // ========== 원클릭용 키 매칭 (v51: educationMatcher.js 사용) ==========
  // 기존 복잡한 로직을 educationMatcher.js로 분리함


  // ========== 2차 교육 로드 (v51: 새로운 매칭 로직) ==========
  const generate2ndEducation = () => {
    // console.log('');
    // console.log('🔥🔥🔥 LOAD EDUCATION START (v51) 🔥🔥🔥');
    // console.log('   - category:', selectedStyle?.category);
    // console.log('   - isFullTransform:', isFullTransform);
    // console.log('   - displayArtist:', displayArtist);
    // console.log('   - displayWork:', displayWork);
    // console.log('');
    
    setIsLoadingEducation(true);
    
    let content = null;
    
    // ========== 원클릭: 새로운 매칭 로직 사용 ==========
    if (isFullTransform) {
      // console.log('📜 ONECLICK MODE - using educationMatcher.js');
      
      // currentResult에서 정보 추출
      const category = currentResult?.style?.category || displayCategory;
      const artist = currentResult?.aiSelectedArtist || displayArtist;
      const work = currentResult?.selected_work || displayWork;
      
      // console.log('   - category:', category);
      // console.log('   - artist:', artist);
      // console.log('   - work:', work);
      
      // 새로운 매칭 함수 사용
      const key = getEducationKey(category, artist, work);
      // console.log('   - matched key:', key);
      
      if (key) {
        // 교육자료 데이터 객체 구성
        const educationData = {
          masters: oneclickMastersSecondary,
          movements: oneclickMovementsSecondary,
          oriental: oneclickOrientalSecondary
        };
        
        // 새로운 콘텐츠 가져오기 함수 사용
        content = getEducationContent(category, key, educationData);
        
        if (content) {
          // console.log('✅ Found oneclick education for:', key);
          // console.log('   - content preview:', content.substring(0, 50) + '...');
        } else {
          // console.log('❌ No education data found for key:', key);
        }
      } else {
        // console.log('❌ No key matched');
      }
    }
    
    // ========== 단일 변환: 기존 교육자료 사용 ==========
    if (!content && !isFullTransform) {
      const category = selectedStyle.category;
      
      // 1. 동양화 (oriental)
      if (category === 'oriental') {
        // console.log('📜 Loading oriental education...');
        content = getOrientalEducation();
      }
      
      // 2. 미술사조 (movements)
      else if (category !== 'masters') {
        // console.log('📜 Loading movements education...');
        content = getMovementsEducation();
      }
      
      // 3. 거장 (masters)
      else {
        // console.log('📜 Loading masters education...');
        content = getMastersEducation();
      }
    }
    
    // 결과 설정
    if (content) {
      // console.log('✅ Education loaded successfully!');
      // console.log('   Content type:', typeof content);
      // console.log('   Content length:', content.length);
      // console.log('   Preview:', content.substring(0, 80) + '...');
      // console.log('   Setting educationText to:', content);
      setEducationText(content);
      // console.log('   ✅ setEducationText called');
    } else {
      console.error('❌ No education content found!');
      const fallback = getFallbackMessage();
      // console.log('   Using fallback:', fallback);
      setEducationText(fallback);
    }
    
    // console.log('   Setting isLoadingEducation to false');
    setIsLoadingEducation(false);
    // console.log('🏁 Loading complete');
    // console.log('');
  };


  // ========== 미술사조 교육 콘텐츠 (v49 - 동양화 방식) ==========
  const getMovementsEducation = (overrideArtist = null) => {
    const category = selectedStyle.category;
    const artistSource = overrideArtist || aiSelectedArtist;
    
    // console.log('');
    // console.log('========================================');
    // console.log('🎨 MOVEMENTS EDUCATION (v52):');
    // console.log('========================================');
    // console.log('   - category:', category);
    // console.log('   - artistSource:', artistSource);
    // console.log('========================================');
    // console.log('');
    
    // 화가 이름 정규화
    let artistName = (artistSource || '')
      .replace(/\s*\([^)]*\)/g, '')  // 괄호 제거
      .trim();
    
    if (!artistName) {
      // console.log('⚠️ No artist name provided');
      return null;
    }
    
    // 여러 매칭 패턴 시도
    const words = artistName.split(/\s+/);
    const patterns = [];
    
    // 특수문자 변환 함수 (é → e 등)
    const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // 패턴 1: 전체 이름 (소문자, 공백 제거)
    patterns.push(artistName.toLowerCase().replace(/\s+/g, ''));
    
    // 패턴 2: 전체 이름 (소문자, 하이픈)
    patterns.push(artistName.toLowerCase().replace(/\s+/g, '-'));
    
    // 패턴 3: 마지막 단어 (성)
    if (words.length > 1) {
      patterns.push(words[words.length - 1].toLowerCase());
    }
    
    // 패턴 4: 첫 단어 (이름)
    patterns.push(words[0].toLowerCase());
    
    // 패턴 5: 전체 소문자
    patterns.push(artistName.toLowerCase());
    
    // 패턴 6-10: 특수문자 제거 버전 (é → e 등)
    patterns.push(normalize(artistName.toLowerCase().replace(/\s+/g, '')));
    patterns.push(normalize(artistName.toLowerCase().replace(/\s+/g, '-')));
    if (words.length > 1) {
      patterns.push(normalize(words[words.length - 1].toLowerCase()));
    }
    patterns.push(normalize(words[0].toLowerCase()));
    patterns.push(normalize(artistName.toLowerCase()));
    
    // console.log('   - trying patterns:', patterns);
    // console.log('');
    
    // 각 패턴으로 매칭 시도
    let education = null;
    let matchedPattern = null;
    
    for (const pattern of patterns) {
      if (movementsEducation[pattern]) {
        education = movementsEducation[pattern];
        matchedPattern = pattern;
        break;
      }
    }
    
    if (education && education.description) {
      // console.log('✅ Found artist education with pattern:', matchedPattern);
      // console.log('✅ Original name:', artistName);
      // console.log('✅ Matched key:', matchedPattern);
      // console.log('✅ description length:', education.description.length);
      // console.log('========================================');
      // console.log('');
      return education.description;
    }
    
    // console.log('⚠️ No artist education found for:', artistName);
    // console.log('⚠️ Tried patterns:', patterns);
    // console.log('⚠️ Available keys (first 15):', Object.keys(movementsEducation).slice(0, 15));
    // console.log('========================================');
    // console.log('');
    
    // Fallback: 1차 교육 사용
    if (movementsOverview && movementsOverview[category]) {
      // console.log('📚 Using 1st education as fallback for category:', category);
      return movementsOverview[category].desc;
    }
    
    return null;
  };


  // ========== 거장 교육 콘텐츠 (v62 - 화풍별 2차 교육) ==========
  const getMastersEducation = (overrideArtist = null) => {
    const artistSource = overrideArtist || aiSelectedArtist || selectedStyle.name || '';
    const artist = artistSource.replace(/\s*\([^)]*\)/g, '').trim();
    
    // console.log('');
    // console.log('========================================');
    // console.log('🎨 MASTERS EDUCATION (v62 화풍별):');
    // console.log('========================================');
    // console.log('   - artistSource:', artistSource);
    // console.log('   - normalized artist:', artist);
    // console.log('   - selectedStyle.id:', selectedStyle?.id);
    // console.log('========================================');
    // console.log('');
    
    // ========== 2차 교육자료 (화풍 설명) ==========
    // selectedStyle.id에서 masterId 추출하여 검색 (v62 신규)
    const styleId = selectedStyle?.id || '';
    const masterId = styleId.replace('-master', ''); // 'vangogh-master' → 'vangogh'
    
    // console.log('🎯 Trying 2nd education with masterId:', masterId);
    
    if (masterId && mastersEducation[masterId]) {
      const education = mastersEducation[masterId];
      // console.log('✅ Found 2nd education (화풍 설명)!');
      // console.log('   - title:', education.title);
      // console.log('   - desc length:', education.desc?.length);
      return education.desc;
    }
    
    // ========== 2차 교육자료 (개별 작품) - 레거시 지원 ==========
    // aiSelectedWork가 있으면 해당 작품 키로 검색 (기존 로직 유지)
    if (aiSelectedWork) {
      // console.log('🎯 Trying 2nd education with selected_work:', aiSelectedWork);
      
      // 작품명 → mastersEducation 키 매핑
      const workKeyMap = {
        // 반 고흐
        'The Starry Night': 'vangogh-starrynight',
        '별이 빛나는 밤': 'vangogh-starrynight',
        'Starry Night': 'vangogh-starrynight',
        'Sunflowers': 'vangogh-sunflowers',
        '해바라기': 'vangogh-sunflowers',
        'Bedroom in Arles': 'vangogh-bedroom',
        '아를의 침실': 'vangogh-bedroom',
        'The Potato Eaters': 'vangogh-potatoeaters',
        '감자 먹는 사람들': 'vangogh-potatoeaters',
        'Self-Portrait': 'vangogh-selfportrait',
        '자화상': 'vangogh-selfportrait',
        
        // 클림트
        'The Kiss': 'klimt-kiss',
        '키스': 'klimt-kiss',
        'Portrait of Adele Bloch-Bauer I': 'klimt-adele',
        '아델레 블로흐-바우어의 초상': 'klimt-adele',
        'Adele Bloch-Bauer': 'klimt-adele',
        'The Tree of Life': 'klimt-treeoflife',
        '생명의 나무': 'klimt-treeoflife',
        'Tree of Life': 'klimt-treeoflife',
        'Danae': 'klimt-danae',
        '다나에': 'klimt-danae',
        'Judith I': 'klimt-judith',
        'Judith': 'klimt-judith',
        '유디트': 'klimt-judith',
        
        // 뭉크
        'The Scream': 'munch-scream',
        '절규': 'munch-scream',
        'Scream': 'munch-scream',
        'Madonna': 'munch-madonna',
        '마돈나': 'munch-madonna',
        'Jealousy': 'munch-jealousy',
        '질투': 'munch-jealousy',
        'The Sick Child': 'munch-sickchild',
        '병든 아이': 'munch-sickchild',
        'Sick Child': 'munch-sickchild',
        'The Dance of Life': 'munch-vampire',
        'Puberty': 'munch-puberty',
        '사춘기': 'munch-puberty',
        'Vampire': 'munch-vampire',
        '뱀파이어': 'munch-vampire',
        
        // 마티스
        'The Dance': 'matisse-dance',
        '춤': 'matisse-dance',
        'Dance': 'matisse-dance',
        'The Red Room': 'matisse-redroom',
        '붉은 방': 'matisse-redroom',
        'Red Room': 'matisse-redroom',
        'Woman with a Hat': 'matisse-womanhat',
        '모자를 쓴 여인': 'matisse-womanhat',
        'Goldfish': 'matisse-goldfish',
        '금붕어': 'matisse-goldfish',
        'The Snail': 'matisse-snail',
        '달팽이': 'matisse-snail',
        'Snail': 'matisse-snail',
        
        // 피카소
        'Les Demoiselles d\'Avignon': 'picasso-demoiselles',
        '아비뇽의 처녀들': 'picasso-demoiselles',
        'Demoiselles': 'picasso-demoiselles',
        'Guernica': 'picasso-guernica',
        '게르니카': 'picasso-guernica',
        'Bull\'s Head': 'picasso-bullhead',
        '황소 머리': 'picasso-bullhead',
        
        // 프리다 칼로
        'Me and My Parrots': 'frida-parrots',
        '나와 앵무새들': 'frida-parrots',
        '나와 내 앵무새들': 'frida-parrots',
        'My Parrots': 'frida-parrots',
        'The Broken Column': 'frida-brokencolumn',
        '부러진 기둥': 'frida-brokencolumn',
        'Broken Column': 'frida-brokencolumn',
        'Self-Portrait with Thorn Necklace': 'frida-thornnecklace',
        '가시 목걸이와 벌새': 'frida-thornnecklace',
        'Thorn Necklace': 'frida-thornnecklace',
        'Self-Portrait with Monkeys': 'frida-monkeys',
        '원숭이와 자화상': 'frida-monkeys'
      };
      
      // 직접 매칭 시도
      let workKey = workKeyMap[aiSelectedWork];
      
      // 부분 매칭 시도
      if (!workKey) {
        const workLower = aiSelectedWork.toLowerCase();
        for (const [name, key] of Object.entries(workKeyMap)) {
          if (workLower.includes(name.toLowerCase()) || name.toLowerCase().includes(workLower)) {
            workKey = key;
            break;
          }
        }
      }
      
      // console.log('   - workKey:', workKey);
      
      if (workKey && mastersEducation[workKey]) {
        const education = mastersEducation[workKey];
        // console.log('✅ Found 2nd education (개별 작품)!');
        // console.log('   - title:', education.title);
        // console.log('   - desc length:', education.desc?.length);
        return education.desc;
      }
      
      // console.log('⚠️ 2nd education not found, falling back to 1st');
    }
    
    // ========== 1차 교육자료 (거장 개요) ==========
    // 한글 이름 → mastersEducation 키 매핑
    const artistKeyMap = {
      '빈센트 반 고흐': 'vangogh-master',
      '반 고흐': 'vangogh-master',
      'van gogh': 'vangogh-master',
      'vincent van gogh': 'vangogh-master',
      '구스타프 클림트': 'klimt-master',
      '클림트': 'klimt-master',
      'klimt': 'klimt-master',
      'gustav klimt': 'klimt-master',
      '에드바르 뭉크': 'munch-master',
      '뭉크': 'munch-master',
      'munch': 'munch-master',
      'edvard munch': 'munch-master',
      '앙리 마티스': 'matisse-master',
      '마티스': 'matisse-master',
      'matisse': 'matisse-master',
      'henri matisse': 'matisse-master',
      '마르크 샤갈': 'chagall-master',
      '샤갈': 'chagall-master',
      'chagall': 'chagall-master',
      'marc chagall': 'chagall-master',
      '파블로 피카소': 'picasso-master',
      '피카소': 'picasso-master',
      'picasso': 'picasso-master',
      'pablo picasso': 'picasso-master',
      '프리다 칼로': 'frida-master',
      '프리다': 'frida-master',
      'frida': 'frida-master',
      'frida kahlo': 'frida-master',
      '로이 리히텐슈타인': 'lichtenstein-master',
      '리히텐슈타인': 'lichtenstein-master',
      'lichtenstein': 'lichtenstein-master',
      'roy lichtenstein': 'lichtenstein-master'
    };
    
    // 키 매칭 시도
    const normalizedArtist = artist.toLowerCase();
    let masterKey = artistKeyMap[artist] || artistKeyMap[normalizedArtist];
    
    // 부분 매칭 시도
    if (!masterKey) {
      for (const [name, key] of Object.entries(artistKeyMap)) {
        if (normalizedArtist.includes(name.toLowerCase()) || name.toLowerCase().includes(normalizedArtist)) {
          masterKey = key;
          break;
        }
      }
    }
    
    // console.log('   - masterKey:', masterKey);
    
    if (masterKey && mastersEducation[masterKey]) {
      const education = mastersEducation[masterKey];
      // console.log('✅ Found 1st education (거장 개요)!');
      // console.log('   - title:', education.title);
      // console.log('   - desc length:', education.desc?.length);
      return education.desc;
    }
    
    // console.log('⚠️ Masters education not found for:', artist);
    // console.log('');
    
    return null;
  };


  // ========== 거장 화가명 풀네임 + 화파 매핑 (v67: 새 표기 형식) ==========
  // 제목: 풀네임(영문, 생몰연도)
  // 부제: 사조(시기)
  const getMasterInfo = (artistName) => {
    const masterMap = {
      // 반 고흐
      '반 고흐': { fullName: '빈센트 반 고흐(Vincent van Gogh, 1853~1890)', movement: '후기인상주의' },
      'vangogh': { fullName: '빈센트 반 고흐(Vincent van Gogh, 1853~1890)', movement: '후기인상주의' },
      'van gogh': { fullName: '빈센트 반 고흐(Vincent van Gogh, 1853~1890)', movement: '후기인상주의' },
      'vincent van gogh': { fullName: '빈센트 반 고흐(Vincent van Gogh, 1853~1890)', movement: '후기인상주의' },
      
      // 클림트
      '클림트': { fullName: '구스타프 클림트(Gustav Klimt, 1862~1918)', movement: '아르누보' },
      'klimt': { fullName: '구스타프 클림트(Gustav Klimt, 1862~1918)', movement: '아르누보' },
      'gustav klimt': { fullName: '구스타프 클림트(Gustav Klimt, 1862~1918)', movement: '아르누보' },
      
      // 뭉크
      '뭉크': { fullName: '에드바르 뭉크(Edvard Munch, 1863~1944)', movement: '표현주의' },
      'munch': { fullName: '에드바르 뭉크(Edvard Munch, 1863~1944)', movement: '표현주의' },
      'edvard munch': { fullName: '에드바르 뭉크(Edvard Munch, 1863~1944)', movement: '표현주의' },
      
      // 마티스
      '마티스': { fullName: '앙리 마티스(Henri Matisse, 1869~1954)', movement: '야수파' },
      'matisse': { fullName: '앙리 마티스(Henri Matisse, 1869~1954)', movement: '야수파' },
      'henri matisse': { fullName: '앙리 마티스(Henri Matisse, 1869~1954)', movement: '야수파' },
      
      // 샤갈 (v70 추가)
      '샤갈': { fullName: '마르크 샤갈(Marc Chagall, 1887~1985)', movement: '초현실주의' },
      '마르크 샤갈': { fullName: '마르크 샤갈(Marc Chagall, 1887~1985)', movement: '초현실주의' },
      'chagall': { fullName: '마르크 샤갈(Marc Chagall, 1887~1985)', movement: '초현실주의' },
      'marc chagall': { fullName: '마르크 샤갈(Marc Chagall, 1887~1985)', movement: '초현실주의' },
      
      // 피카소
      '피카소': { fullName: '파블로 피카소(Pablo Picasso, 1881~1973)', movement: '입체주의' },
      'picasso': { fullName: '파블로 피카소(Pablo Picasso, 1881~1973)', movement: '입체주의' },
      'pablo picasso': { fullName: '파블로 피카소(Pablo Picasso, 1881~1973)', movement: '입체주의' },
      
      // 프리다 칼로
      '프리다': { fullName: '프리다 칼로(Frida Kahlo, 1907~1954)', movement: '초현실주의' },
      '프리다 칼로': { fullName: '프리다 칼로(Frida Kahlo, 1907~1954)', movement: '초현실주의' },
      'frida': { fullName: '프리다 칼로(Frida Kahlo, 1907~1954)', movement: '초현실주의' },
      'frida kahlo': { fullName: '프리다 칼로(Frida Kahlo, 1907~1954)', movement: '초현실주의' },
      
      // 리히텐슈타인
      '리히텐슈타인': { fullName: '로이 리히텐슈타인(Roy Lichtenstein, 1923~1997)', movement: '팝아트' },
      '로이 리히텐슈타인': { fullName: '로이 리히텐슈타인(Roy Lichtenstein, 1923~1997)', movement: '팝아트' },
      'lichtenstein': { fullName: '로이 리히텐슈타인(Roy Lichtenstein, 1923~1997)', movement: '팝아트' },
      'roy lichtenstein': { fullName: '로이 리히텐슈타인(Roy Lichtenstein, 1923~1997)', movement: '팝아트' }
    };
    
    if (!artistName) return { fullName: '거장', movement: '' };
    
    const normalized = artistName.toLowerCase().trim();
    
    // 직접 매핑 확인
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
      'greek sculpture': { name: '고대 그리스 조각', years: '' },
      'classical sculpture': { name: '고대 그리스 조각', years: '' },
      'roman mosaic': { name: '로마 모자이크', years: '' },
      // 중세
      'byzantine': { name: '비잔틴', years: '' },
      'byzantine art': { name: '비잔틴', years: '' },
      'gothic': { name: '고딕', years: '' },
      'gothic art': { name: '고딕', years: '' },
      'gothic stained glass': { name: '고딕 스테인드글라스', years: '' },
      'islamic miniature': { name: '이슬람 세밀화', years: '' },
      'persian miniature': { name: '페르시아 세밀화', years: '' },
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
      // 20세기 모더니즘 (워홀 제거)
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
      if (['david', 'jacques-louis david', 'ingres', 'jean-auguste-dominique ingres'].includes(normalized)) {
        actualMovement = '신고전주의';
      }
      // 낭만주의 화가
      else if (['delacroix', 'eugène delacroix', 'eugene delacroix', 'turner', 'j.m.w. turner', 'joseph mallord william turner'].includes(normalized)) {
        actualMovement = '낭만주의';
      }
      // 사실주의 화가
      else if (['courbet', 'gustave courbet', 'manet', 'édouard manet', 'edouard manet'].includes(normalized)) {
        actualMovement = '사실주의';
      }
    }
    
    // "20세기 모더니즘"인 경우 화가에 따라 사조 결정
    if (styleName === '20세기 모더니즘' && artistName) {
      const normalized = artistName.toLowerCase().trim();
      // 입체주의 화가
      if (['picasso', 'pablo picasso'].includes(normalized)) {
        actualMovement = '입체주의';
      }
      // 초현실주의 화가
      else if (['magritte', 'rené magritte', 'rene magritte', 'miro', 'miró', 'joan miro', 'joan miró', 'chagall', 'marc chagall'].includes(normalized)) {
        actualMovement = '초현실주의';
      }
      // 팝아트 화가 (워홀 제거)
      else if (['lichtenstein', 'roy lichtenstein', 'haring', 'keith haring'].includes(normalized)) {
        actualMovement = '팝아트';
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

  // ========== 갤러리용 짧은 이름 포맷: 한글(영문) ==========
  const formatGalleryName = (artistName, category, workName = null) => {
    if (!artistName) return '변환 이미지';
    
    const normalized = artistName.toLowerCase().trim();
    
    // ========== 거장: <화가명> 작품명 ==========
    if (category === 'masters') {
      // 거장 정보: 이름, 생몰연도, 사조
      const mastersInfo = {
        'van gogh': { name: '반 고흐', years: '1853~1890', movement: '후기인상주의' },
        'vangogh': { name: '반 고흐', years: '1853~1890', movement: '후기인상주의' },
        'vincent van gogh': { name: '반 고흐', years: '1853~1890', movement: '후기인상주의' },
        '반 고흐': { name: '반 고흐', years: '1853~1890', movement: '후기인상주의' },
        'klimt': { name: '클림트', years: '1862~1918', movement: '아르누보' },
        'gustav klimt': { name: '클림트', years: '1862~1918', movement: '아르누보' },
        '클림트': { name: '클림트', years: '1862~1918', movement: '아르누보' },
        'munch': { name: '뭉크', years: '1863~1944', movement: '표현주의' },
        'edvard munch': { name: '뭉크', years: '1863~1944', movement: '표현주의' },
        '뭉크': { name: '뭉크', years: '1863~1944', movement: '표현주의' },
        'matisse': { name: '마티스', years: '1869~1954', movement: '야수파' },
        'henri matisse': { name: '마티스', years: '1869~1954', movement: '야수파' },
        '마티스': { name: '마티스', years: '1869~1954', movement: '야수파' },
        'picasso': { name: '피카소', years: '1881~1973', movement: '입체주의' },
        'pablo picasso': { name: '피카소', years: '1881~1973', movement: '입체주의' },
        '피카소': { name: '피카소', years: '1881~1973', movement: '입체주의' },
        'frida': { name: '프리다', years: '1907~1954', movement: '초현실주의' },
        'frida kahlo': { name: '프리다', years: '1907~1954', movement: '초현실주의' },
        '프리다': { name: '프리다', years: '1907~1954', movement: '초현실주의' },
        '프리다 칼로': { name: '프리다', years: '1907~1954', movement: '초현실주의' },
        'lichtenstein': { name: '리히텐슈타인', years: '1923~1997', movement: '팝아트' },
        'roy lichtenstein': { name: '리히텐슈타인', years: '1923~1997', movement: '팝아트' },
        '리히텐슈타인': { name: '리히텐슈타인', years: '1923~1997', movement: '팝아트' },
        '로이 리히텐슈타인': { name: '리히텐슈타인', years: '1923~1997', movement: '팝아트' }
      };
      
      const info = mastersInfo[normalized] || mastersInfo[artistName];
      if (info) {
        return `${info.name}(${info.years})_${info.movement}`;
      }
      
      return artistName;
    }
    
    // ========== 미술사조: 사조(시기)_화가 ==========
    if (category === 'movements') {
      // 사조별 시기 정보
      const movementPeriods = {
        '고대': 'BC~AD4C',
        '중세': '5~15C',
        '르네상스': '14~16C',
        '바로크': '17~18C',
        '로코코': '18C',
        '신고전주의': '18~19C',
        '낭만주의': '19C',
        '사실주의': '19C',
        '인상주의': '1860~1890',
        '후기인상주의': '1880~1910',
        '야수파': '1904~1908',
        '표현주의': '1905~1925',
        '입체주의': '1907~1920',
        '모더니즘': '20C',
        '팝아트': '1950~1970',
      };
      
      // 화가 → 미술사조 매핑
      const movementMap = {
        // 고대
        'greek sculpture': { movement: '고대', artist: '그리스 조각' },
        'classical sculpture': { movement: '고대', artist: '그리스 조각' },
        'roman mosaic': { movement: '고대', artist: '로마 모자이크' },
        // 중세
        'byzantine': { movement: '중세', artist: '비잔틴' },
        'gothic': { movement: '중세', artist: '고딕' },
        'gothic stained glass': { movement: '중세', artist: '고딕' },
        'islamic miniature': { movement: '중세', artist: '이슬람 세밀화' },
        // 르네상스
        'leonardo': { movement: '르네상스', artist: '다 빈치' },
        'leonardo da vinci': { movement: '르네상스', artist: '다 빈치' },
        'michelangelo': { movement: '르네상스', artist: '미켈란젤로' },
        'raphael': { movement: '르네상스', artist: '라파엘로' },
        'botticelli': { movement: '르네상스', artist: '보티첼리' },
        'titian': { movement: '르네상스', artist: '티치아노' },
        // 바로크
        'caravaggio': { movement: '바로크', artist: '카라바조' },
        'rembrandt': { movement: '바로크', artist: '렘브란트' },
        'velazquez': { movement: '바로크', artist: '벨라스케스' },
        'velázquez': { movement: '바로크', artist: '벨라스케스' },
        'rubens': { movement: '바로크', artist: '루벤스' },
        // 로코코
        'watteau': { movement: '로코코', artist: '와토' },
        'boucher': { movement: '로코코', artist: '부셰' },
        'fragonard': { movement: '로코코', artist: '프라고나르' },
        // 신고전주의
        'david': { movement: '신고전주의', artist: '다비드' },
        'jacques-louis david': { movement: '신고전주의', artist: '다비드' },
        'ingres': { movement: '신고전주의', artist: '앵그르' },
        // 낭만주의
        'turner': { movement: '낭만주의', artist: '터너' },
        'friedrich': { movement: '낭만주의', artist: '프리드리히' },
        'delacroix': { movement: '낭만주의', artist: '들라크루아' },
        // 사실주의
        'courbet': { movement: '사실주의', artist: '쿠르베' },
        'manet': { movement: '사실주의', artist: '마네' },
        // 인상주의
        'monet': { movement: '인상주의', artist: '모네' },
        'renoir': { movement: '인상주의', artist: '르누아르' },
        'degas': { movement: '인상주의', artist: '드가' },
        'pissarro': { movement: '인상주의', artist: '피사로' },
        'sisley': { movement: '인상주의', artist: '시슬레' },
        'caillebotte': { movement: '인상주의', artist: '카유보트' },
        // 후기인상주의
        'cézanne': { movement: '후기인상주의', artist: '세잔' },
        'cezanne': { movement: '후기인상주의', artist: '세잔' },
        'seurat': { movement: '후기인상주의', artist: '쇠라' },
        'gauguin': { movement: '후기인상주의', artist: '고갱' },
        'toulouse-lautrec': { movement: '후기인상주의', artist: '로트렉' },
        'van gogh': { movement: '후기인상주의', artist: '반 고흐' },
        // 야수파
        'matisse': { movement: '야수파', artist: '마티스' },
        'derain': { movement: '야수파', artist: '드랭' },
        'vlaminck': { movement: '야수파', artist: '블라맹크' },
        // 표현주의
        'munch': { movement: '표현주의', artist: '뭉크' },
        'kirchner': { movement: '표현주의', artist: '키르히너' },
        'kokoschka': { movement: '표현주의', artist: '코코슈카' },
        // 입체주의/모더니즘
        'picasso': { movement: '입체주의', artist: '피카소' },
        'braque': { movement: '입체주의', artist: '브라크' },
        'mondrian': { movement: '모더니즘', artist: '몬드리안' },
        'malevich': { movement: '모더니즘', artist: '말레비치' },
        'chagall': { movement: '모더니즘', artist: '샤갈' },
        'miró': { movement: '모더니즘', artist: '미로' },
        'miro': { movement: '모더니즘', artist: '미로' },
        'magritte': { movement: '모더니즘', artist: '마그리트' },
        // 팝아트 (워홀 제거)
        'keith haring': { movement: '팝아트', artist: '키스 해링' },
        'lichtenstein': { movement: '팝아트', artist: '리히텐슈타인' }
      };
      
      const info = movementMap[normalized] || movementMap[artistName];
      if (info) {
        const period = movementPeriods[info.movement] || '';
        return `${info.movement}(${period})_${info.artist}`;
      }
      
      // 부분 매칭
      for (const [key, value] of Object.entries(movementMap)) {
        if (normalized.includes(key) || key.includes(normalized)) {
          const period = movementPeriods[value.movement] || '';
          return `${value.movement}(${period})_${value.artist}`;
        }
      }
      
      return artistName;
    }
    
    // ========== 동양화: 국가 전통회화_스타일명 ==========
    if (category === 'oriental') {
      const orientalMap = {
        // 한국
        'korean minhwa': { country: '한국 전통회화', style: '민화' },
        'korean pungsokdo': { country: '한국 전통회화', style: '풍속도' },
        'korean jingyeong': { country: '한국 전통회화', style: '진경산수화' },
        '한국 전통화': { country: '한국 전통회화', style: '전통화' },
        '민화': { country: '한국 전통회화', style: '민화' },
        '풍속화': { country: '한국 전통회화', style: '풍속도' },
        '풍속도': { country: '한국 전통회화', style: '풍속도' },
        '진경산수': { country: '한국 전통회화', style: '진경산수화' },
        // 중국
        'chinese gongbi': { country: '중국 전통회화', style: '공필화' },
        'chinese ink wash': { country: '중국 전통회화', style: '수묵화' },
        '공필화': { country: '중국 전통회화', style: '공필화' },
        '수묵화': { country: '중국 전통회화', style: '수묵화' },
        // 일본
        'japanese ukiyo-e': { country: '일본 전통회화', style: '우키요에' },
        '우키요에': { country: '일본 전통회화', style: '우키요에' },
        '일본 우키요에': { country: '일본 전통회화', style: '우키요에' },
      };
      
      const info = orientalMap[normalized] || orientalMap[artistName];
      if (info) {
        return `${info.country}_${info.style}`;
      }
      
      // 부분 매칭
      for (const [key, value] of Object.entries(orientalMap)) {
        if (normalized.includes(key) || key.includes(normalized)) {
          return `${value.country}_${value.style}`;
        }
      }
      
      return artistName;
    }
    
    return artistName;
  };


  // ========== 거장 작품명 포맷 ==========
  const formatWorkName = (workName) => {
    if (!workName) return '대표작';
    
    // 이미 한글(영문) 형식이면 그대로 반환
    if (workName.includes('(') && workName.includes(')') && !/^[A-Za-z]/.test(workName)) {
      return workName;
    }
    
    // 작품명 매핑 - 거장 전체 작품: 한글명(영문명) 형식
    const workMap = {
      // 반 고흐
      'the starry night': '별이 빛나는 밤(The Starry Night)',
      'starry night': '별이 빛나는 밤(Starry Night)',
      'sunflowers': '해바라기(Sunflowers)',
      'self-portrait': '자화상(Self-Portrait)',
      // 클림트
      'the kiss': '키스(The Kiss)',
      'the tree of life': '생명의 나무(The Tree of Life)',
      'tree of life': '생명의 나무(Tree of Life)',
      'judith i': '유디트(Judith)',
      'judith': '유디트(Judith)',
      
      // 뭉크
      'the scream': '절규(The Scream)',
      'scream': '절규(The Scream)',
      'madonna': '마돈나(Madonna)',
      'jealousy': '질투(Jealousy)',
      
      // 마티스
      'the dance': '춤(The Dance)',
      'dance': '춤(The Dance)',
      'the red room': '붉은 방(The Red Room)',
      'red room': '붉은 방(The Red Room)',
      'woman with a hat': '모자를 쓴 여인(Woman with a Hat)',
      
      // 피카소
      'guernica': '게르니카(Guernica)',
      "les demoiselles d'avignon": '아비뇽의 처녀들(Les Demoiselles d\'Avignon)',
      'demoiselles': '아비뇽의 처녀들(Les Demoiselles d\'Avignon)',
      
      // 프리다 칼로
      'me and my parrots': '나와 앵무새(Me and My Parrots)',
      'self-portrait with parrots': '앵무새와 자화상(Self-Portrait with Parrots)',
      'the broken column': '부러진 기둥(The Broken Column)',
      'broken column': '부러진 기둥(The Broken Column)',
      'self-portrait with thorn necklace': '가시 목걸이 자화상(Self-Portrait with Thorn Necklace)',
      'self-portrait with monkeys': '원숭이와 자화상(Self-Portrait with Monkeys)'
    };
    
    // 영문(한글) 형식이면 영문 부분만 추출해서 매핑
    let normalizedWork = workName.toLowerCase().trim();
    if (workName.includes('(') && /^[A-Za-z]/.test(workName)) {
      normalizedWork = workName.split('(')[0].trim().toLowerCase();
    }
    
    if (workMap[normalizedWork]) {
      return workMap[normalizedWork];
    }
    
    // 매핑에 없으면 원본 반환
    return workName;
  };

  // 작품 제작연도 매핑
  const workYearMap = {
    // 반 고흐
    'The Starry Night': 1889,
    'Starry Night': 1889,
    'the starry night': 1889,
    'Sunflowers': 1888,
    'sunflowers': 1888,
    'Self-Portrait': 1889,
    'self-portrait': 1889,
    '별이 빛나는 밤': 1889,
    '해바라기': 1888,
    '자화상': 1889,
    // 클림트
    'The Kiss': 1908,
    'the kiss': 1908,
    'Judith I': 1901,
    'judith i': 1901,
    'Judith': 1901,
    'judith': 1901,
    'The Tree of Life': 1909,
    'Tree of Life': 1909,
    'the tree of life': 1909,
    '키스': 1908,
    '유디트': 1901,
    '생명의 나무': 1909,
    // 뭉크
    'The Scream': 1893,
    'the scream': 1893,
    'Madonna': 1894,
    'madonna': 1894,
    'Jealousy': 1895,
    'jealousy': 1895,
    '절규': 1893,
    '마돈나': 1894,
    '질투': 1895,
    // 마티스
    'The Dance': 1910,
    'the dance': 1910,
    'The Red Room': 1908,
    'the red room': 1908,
    'Harmony in Red': 1908,
    'harmony in red': 1908,
    'Woman with a Hat': 1905,
    'woman with a hat': 1905,
    '춤': 1910,
    '붉은 방': 1908,
    '모자를 쓴 여인': 1905,
    // 피카소
    "Les Demoiselles d'Avignon": 1907,
    "les demoiselles d'avignon": 1907,
    'Guernica': 1937,
    'guernica': 1937,
    '아비뇽의 처녀들': 1907,
    '게르니카': 1937,
    // 프리다 칼로
    'The Broken Column': 1944,
    'the broken column': 1944,
    'Self-Portrait with Monkeys': 1943,
    'self-portrait with monkeys': 1943,
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
    
    // 소문자 변환 후 매칭
    const lower = workName.toLowerCase();
    if (workYearMap[lower]) return workYearMap[lower];
    
    // 괄호 제거 후 매칭 시도
    const withoutParens = workName.split('(')[0].trim();
    if (workYearMap[withoutParens]) return workYearMap[withoutParens];
    if (workYearMap[withoutParens.toLowerCase()]) return workYearMap[withoutParens.toLowerCase()];
    
    // 괄호 안 내용으로 매칭 시도
    const match = workName.match(/\(([^)]+)\)/);
    if (match) {
      if (workYearMap[match[1]]) return workYearMap[match[1]];
      if (workYearMap[match[1].toLowerCase()]) return workYearMap[match[1].toLowerCase()];
    }
    
    return null;
  };


  // ========== 동양화 스타일명 포맷 통일 ==========
  const formatOrientalStyle = (styleName) => {
    if (!styleName) return '동양화 기법';
    
    const normalized = styleName.toLowerCase().trim();
    
    // 동양화 스타일 통일 매핑: 한글명(영문명)
    const orientalMap = {
      // 한국
      '한국 전통화': '민화(Minhwa)',
      'korean-genre': '풍속도(Pungsokdo)',
      'korean-minhwa': '민화(Minhwa)',
      'korean-jingyeong': '진경산수화(Jingyeong)',
      
      // 중국
      'chinese gongbi': '공필화(Gongbi)',
      'chinese-gongbi': '공필화(Gongbi)',
      'gongbi': '공필화(Gongbi)',
      'chinese-ink': '수묵화(Ink Wash)',
      'chinese-ink-wash': '수묵화(Ink Wash)',
      'chinese-huaniao': '화조화(Huaniao)',
      
      // 일본
      '일본 우키요에': '우키요에(Ukiyo-e)',
      'japanese-ukiyoe': '우키요에(Ukiyo-e)',
      'ukiyoe': '우키요에(Ukiyo-e)',
      'ukiyo-e': '우키요에(Ukiyo-e)'
    };
    
    // 정확한 매칭
    if (orientalMap[styleName]) {
      return orientalMap[styleName];
    }
    if (orientalMap[normalized]) {
      return orientalMap[normalized];
    }
    
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
    if (normalized.includes('ink') || normalized.includes('수묵')) {
      return '수묵화(Ink Wash)';
    }
    // 부분 매칭 - 일본
    if (normalized.includes('ukiyo') || normalized.includes('우키요에')) {
      return '우키요에(Ukiyo-e)';
    }
    
    // 매핑에 없으면 원본 반환
    return styleName;
  };


  // ========== 화가 이름 한글(Full Name) 변환 ==========
  const formatArtistName = (artistName) => {
    if (!artistName) return '예술 스타일';
    
    const normalized = artistName.toLowerCase().trim();
    // console.log('🎨 formatArtistName input:', artistName);
    // console.log('🎨 formatArtistName normalized:', normalized);
    
    // 영문 이름 → 한글 풀네임(Full Name) 매핑
    const nameMap = {
      // 고대 미술
      'ancient-greek-sculpture': '고대 조각(Ancient Sculpture)',
      'ancient-sculpture': '고대 조각(Ancient Sculpture)',
      'classical-sculpture': '고대 조각(Ancient Sculpture)',
      'classical sculpture': '고대 조각(Classical Sculpture)',
      'greek-sculpture': '고대 조각(Ancient Sculpture)',
      'roman-mosaic': '로마 모자이크(Roman Mosaic)',
      'ancient-mosaic': '로마 모자이크(Roman Mosaic)',
      'mosaic': '로마 모자이크(Roman Mosaic)',
      
      // 중세 미술
      'byzantine': '비잔틴(Byzantine)',
      'byzantine mosaic': '비잔틴 모자이크(Byzantine Mosaic)',
      'gothic': '고딕(Gothic)',
      'gothic stained glass': '고딕 스테인드글라스(Gothic Stained Glass)',
      'romanesque': '로마네스크(Romanesque)',
      'islamic miniature': '이슬람 세밀화(Islamic Miniature)',
      'islamic geometry': '이슬람 기하학(Islamic Geometry)',
      
      // 르네상스
      'leonardo': '레오나르도 다 빈치(Leonardo da Vinci)',
      'leonardo da vinci': '레오나르도 다 빈치(Leonardo da Vinci)',
      'michelangelo': '미켈란젤로 부오나로티(Michelangelo Buonarroti)',
      'raphael': '라파엘로 산치오(Raffaello Sanzio)',
      'botticelli': '산드로 보티첼리(Sandro Botticelli)',
      'titian': '티치아노 베첼리오(Tiziano Vecellio)',
      
      // 바로크
      'caravaggio': '미켈란젤로 메리시 다 카라바조(Caravaggio)',
      'michelangelo merisi da caravaggio': '미켈란젤로 메리시 다 카라바조(Caravaggio)',
      'rembrandt': '렘브란트 판 레인(Rembrandt van Rijn)',
      'velazquez': '디에고 벨라스케스(Diego Velázquez)',
      'rubens': '피터 파울 루벤스(Peter Paul Rubens)',
      'peter paul rubens': '피터 파울 루벤스(Peter Paul Rubens)',
      
      // 로코코
      'watteau': '장 앙투안 와토(Jean-Antoine Watteau)',
      'jean-antoine watteau': '장 앙투안 와토(Jean-Antoine Watteau)',
      'boucher': '프랑수아 부셰(François Boucher)',
      'françois boucher': '프랑수아 부셰(François Boucher)',
      'francois boucher': '프랑수아 부셰(François Boucher)',
      'jean-honoré fragonard': '장 오노레 프라고나르(Jean-Honoré Fragonard)',
      'jean-honore fragonard': '장 오노레 프라고나르(Jean-Honoré Fragonard)',
      'fragonard': '장 오노레 프라고나르(Jean-Honoré Fragonard)',
      
      // 신고전주의
      'jacques-louis-david': '자크 루이 다비드(Jacques-Louis David)',
      'david': '자크 루이 다비드(Jacques-Louis David)',
      'ingres': '장 오귀스트 도미니크 앵그르(Jean-Auguste-Dominique Ingres)',
      'jean-auguste-dominique ingres': '장 오귀스트 도미니크 앵그르(Jean-Auguste-Dominique Ingres)',
      
      // 낭만주의
      'turner': '윌리엄 터너(J.M.W. Turner)',
      'j.m.w. turner': '윌리엄 터너(J.M.W. Turner)',
      'william turner': '윌리엄 터너(J.M.W. Turner)',
      'friedrich': '카스파르 다비드 프리드리히(Caspar David Friedrich)',
      'caspar david friedrich': '카스파르 다비드 프리드리히(Caspar David Friedrich)',
      'delacroix': '외젠 들라크루아(Eugène Delacroix)',
      'eugène delacroix': '외젠 들라크루아(Eugène Delacroix)',
      'eugene delacroix': '외젠 들라크루아(Eugène Delacroix)',
      'goya': '프란시스코 고야(Francisco Goya)',
      'francisco goya': '프란시스코 고야(Francisco Goya)',
      
      // 사실주의
      'millet': '장 프랑수아 밀레(Jean-François Millet)',
      'jean-françois millet': '장 프랑수아 밀레(Jean-François Millet)',
      'jean-francois millet': '장 프랑수아 밀레(Jean-François Millet)',
      'manet': '에두아르 마네(Édouard Manet)',
      'édouard manet': '에두아르 마네(Édouard Manet)',
      'edouard manet': '에두아르 마네(Édouard Manet)',
      
      // 인상주의
      'monet': '클로드 모네(Claude Monet)',
      'claude monet': '클로드 모네(Claude Monet)',
      'renoir': '피에르 오귀스트 르누아르(Pierre-Auguste Renoir)',
      'pierre-auguste renoir': '피에르 오귀스트 르누아르(Pierre-Auguste Renoir)',
      'degas': '에드가 드가(Edgar Degas)',
      'edgar degas': '에드가 드가(Edgar Degas)',
      'caillebotte': '귀스타브 카유보트(Gustave Caillebotte)',
      'gustave caillebotte': '귀스타브 카유보트(Gustave Caillebotte)',
      
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
      
      // 야수파
      'matisse': '앙리 마티스(Henri Matisse)',
      'henri matisse': '앙리 마티스(Henri Matisse)',
      'derain': '앙드레 드랭(André Derain)',
      'andré derain': '앙드레 드랭(André Derain)',
      'andre derain': '앙드레 드랭(André Derain)',
      'vlaminck': '모리스 드 블라맹크(Maurice de Vlaminck)',
      'maurice de vlaminck': '모리스 드 블라맹크(Maurice de Vlaminck)',
      
      // 표현주의
      'munch': '에드바르 뭉크(Edvard Munch)',
      'edvard munch': '에드바르 뭉크(Edvard Munch)',
      'kirchner': '에른스트 루트비히 키르히너(Ernst Ludwig Kirchner)',
      'ernst ludwig kirchner': '에른스트 루트비히 키르히너(Ernst Ludwig Kirchner)',
      'kokoschka': '오스카 코코슈카(Oskar Kokoschka)',
      'oskar kokoschka': '오스카 코코슈카(Oskar Kokoschka)',
      
      // 입체주의
      'picasso': '파블로 피카소(Pablo Picasso)',
      'pablo picasso': '파블로 피카소(Pablo Picasso)',
      
      // 초현실주의
      'magritte': '르네 마그리트(René Magritte)',
      'rené magritte': '르네 마그리트(René Magritte)',
      'rene magritte': '르네 마그리트(René Magritte)',
      'miro': '호안 미로(Joan Miró)',
      'miró': '호안 미로(Joan Miró)',
      'joan miro': '호안 미로(Joan Miró)',
      'joan miró': '호안 미로(Joan Miró)',
      'chagall': '마르크 샤갈(Marc Chagall)',
      'marc chagall': '마르크 샤갈(Marc Chagall)',
      
      // 팝아트 (워홀 제거)
      'lichtenstein': '로이 리히텐슈타인(Roy Lichtenstein)',
      'roy lichtenstein': '로이 리히텐슈타인(Roy Lichtenstein)',
      'haring': '키스 해링(Keith Haring)',
      'keith haring': '키스 해링(Keith Haring)',
      'keith-haring': '키스 해링(Keith Haring)',
      
      // 동양화 - 한국
      'korean-jingyeong': '진경산수화(Korean True-View Landscape)',
      'korean_jingyeong': '진경산수화(Korean True-View Landscape)',
      'jingyeong': '진경산수화(True-View Landscape)',
      'true-view': '진경산수화(True-View Landscape)',
      'true-view-landscape': '진경산수화(True-View Landscape)',
      'korean-landscape': '진경산수화(Korean Landscape)',
      
      'korean-minhwa': '민화(Korean Folk Painting)',
      'korean_minhwa': '민화(Korean Folk Painting)',
      'minhwa': '민화(Folk Painting)',
      'folk-painting': '민화(Folk Painting)',
      'korean-folk': '민화(Korean Folk)',
      
      'korean-genre': '풍속도(Korean Genre Painting)',
      'korean_genre': '풍속도(Korean Genre Painting)',
      'genre-painting': '풍속도(Genre Painting)',
      'korean-genre-painting': '풍속도(Korean Genre Painting)',
      'pungsokdo': '풍속도(Pungsokdo)',
      
      // 동양화 - 중국
      'chinese-ink': '수묵산수화(Chinese Ink Landscape)',
      'chinese_ink': '수묵산수화(Chinese Ink Landscape)',
      'ink-landscape': '수묵산수화(Ink Landscape)',
      'ink-painting': '수묵산수화(Ink Painting)',
      'shanshui': '수묵산수화(Shanshui)',
      'chinese-landscape': '수묵산수화(Chinese Landscape)',
      
      'chinese-gongbi': '공필화(Chinese Gongbi)',
      'chinese_gongbi': '공필화(Chinese Gongbi)',
      'gongbi': '공필화(Gongbi)',
      'gongbi-painting': '공필화(Gongbi Painting)',
      
      'chinese-huaniao': '화조화(Chinese Bird-and-Flower)',
      'chinese_huaniao': '화조화(Chinese Bird-and-Flower)',
      'huaniao': '화조화(Bird-and-Flower)',
      'bird-and-flower': '화조화(Bird-and-Flower)',
      'flower-and-bird': '화조화(Flower-and-Bird)',
      
      // 동양화 - 일본
      'japanese-ukiyoe': '우키요에(Japanese Ukiyo-e)',
      'japanese_ukiyoe': '우키요에(Japanese Ukiyo-e)',
      'ukiyoe': '우키요에(Ukiyo-e)',
      'ukiyo-e': '우키요에(Ukiyo-e)',
      'japanese-woodblock': '우키요에(Japanese Woodblock)',
      'woodblock-print': '우키요에(Woodblock Print)',
      
      // 한글 화가명도 매핑 (API가 한글로 반환하는 경우)
      '마티스': '앙리 마티스(Henri Matisse)',
      '피카소': '파블로 피카소(Pablo Picasso)',
      '뭉크': '에드바르 뭉크(Edvard Munch)',
      '반 고흐': '빈센트 반 고흐(Vincent van Gogh)',
      '클림트': '구스타프 클림트(Gustav Klimt)',
      '프리다': '프리다 칼로(Frida Kahlo)',
      '프리다 칼로': '프리다 칼로(Frida Kahlo)'
    };
    
    // 매핑에서 찾기
    if (nameMap[normalized]) {
      // console.log('🎨 formatArtistName found:', nameMap[normalized]);
      return nameMap[normalized];
    }
    
    // 부분 매칭 시도 (대문자/공백 변형 대응)
    for (const [key, value] of Object.entries(nameMap)) {
      if (normalized.replace(/[\s-_]/g, '') === key.replace(/[\s-_]/g, '')) {
        // console.log('🎨 formatArtistName partial match:', value);
        return value;
      }
    }
    
    // 매핑에 없으면 원본 반환
    // console.log('🎨 formatArtistName NOT FOUND, returning original:', artistName);
    return artistName;
  };


  // ========== 신고전 vs 낭만 vs 사실: 구체적 사조 매핑 ==========
  const getSpecificMovement = (artistName) => {
    const artist = artistName.toLowerCase();
    
    // 신고전주의
    const neoclassical = ['jacques-louis-david', 'david', 'ingres', 'jean-auguste-dominique ingres'];
    
    // 낭만주의
    const romantic = ['turner', 'j.m.w. turner', 'william turner', 
                      'friedrich', 'caspar david friedrich', 
                      'delacroix', 'eugène delacroix', 'eugene delacroix'];
    
    // 사실주의
    const realist = ['courbet', 'gustave courbet',
                     'manet', 'édouard manet', 'edouard manet'];
    
    if (neoclassical.some(name => artist.includes(name))) {
      return { text: '신고전주의', color: 'neoclassical' };
    }
    if (romantic.some(name => artist.includes(name))) {
      return { text: '낭만주의', color: 'romantic' };
    }
    if (realist.some(name => artist.includes(name))) {
      return { text: '사실주의', color: 'realist' };
    }
    
    return null; // 매칭 안 되면 null
  };

  // ========== 20세기 모더니즘: 세부 사조 매핑 ==========
  const getModernismMovement = (artistName) => {
    const artist = artistName.toLowerCase();
    
    // 입체주의 - v59: 브라크 제거 (피카소와 중복)
    const cubism = ['picasso', 'pablo picasso'];
    
    // 초현실주의 - v59: 달리 완전 삭제
    const surrealism = ['magritte', 'rené magritte', 'rene magritte',
                        'miro', 'miró', 'joan miro', 'joan miró',
                        'chagall', 'marc chagall'];
    
    // 팝아트 (워홀 제거)
    const popart = ['lichtenstein', 'roy lichtenstein',
                    'keith haring', 'keith-haring', 'haring'];
    
    if (cubism.some(name => artist.includes(name))) {
      return { text: '입체주의', color: 'cubism' };
    }
    if (surrealism.some(name => artist.includes(name))) {
      return { text: '초현실주의', color: 'surrealism' };
    }
    if (popart.some(name => artist.includes(name))) {
      return { text: '팝아트', color: 'popart' };
    }
    
    return null; // 매칭 안 되면 null
  };


  // ========== 동양화 교육 콘텐츠 (v30) ==========
  const getOrientalEducation = (overrideArtist = null) => {
    const styleId = selectedStyle.id;
    const artistSource = overrideArtist || aiSelectedArtist;
    
    // console.log('');
    // console.log('========================================');
    // console.log('🔍 ORIENTAL EDUCATION DEBUG (v30)');
    // console.log('========================================');
    // console.log('📌 selectedStyle.id:', styleId);
    // console.log('📌 artistSource:', artistSource);
    // console.log('========================================');
    // console.log('');
    
    
    // ========== 한국 전통회화 (3가지) ==========
    if (styleId === 'korean') {
      const genre = artistSource?.toLowerCase() || '';
      // console.log('🇰🇷 KOREAN ART DETECTION:');
      // console.log('   - genre string:', genre);
      // console.log('');
      
      // 민화
      if (genre.includes('minhwa') || genre.includes('민화')) {
        // console.log('✅ MATCH: Korean Minhwa (민화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation.korean_minhwa?.description 
            || orientalEducation.korean?.description;
      } 
      
      // 풍속화
      else if (genre.includes('genre') || genre.includes('풍속') || genre.includes('pungsokdo') || genre.includes('풍속도')) {
        // console.log('✅ MATCH: Korean Genre Painting (풍속화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation.korean_genre?.description 
            || orientalEducation.korean?.description;
      } 
      
      // 진경산수화
      else if (genre.includes('jingyeong') || genre.includes('진경') || genre.includes('landscape')) {
        // console.log('✅ MATCH: Korean True-View Landscape (진경산수화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation.korean_jingyeong?.description 
            || orientalEducation.korean_default?.description;
      }
      
      // 기본값 (매칭 실패시)
      else {
        // console.log('⚠️ DEFAULT: Korean Traditional Painting (한국 전통회화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation.korean_default?.description;
      }
    }
    
    
    // ========== 중국 전통회화 (3가지) ==========
    if (styleId === 'chinese') {
      const artist = aiSelectedArtist?.toLowerCase() || '';
      // console.log('🇨🇳 CHINESE ART DETECTION:');
      // console.log('   - artist string:', artist);
      // console.log('');
      
      // 공필화
      if (artist.includes('gongbi') || artist.includes('공필')) {
        // console.log('✅ MATCH: Chinese Gongbi (工筆畫)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation.chinese_gongbi?.description 
            || orientalEducation.chinese_ink?.description;
      } 
      
      // 화조화
      else if (artist.includes('huaniao') || artist.includes('화조') || artist.includes('flower') || artist.includes('bird')) {
        // console.log('✅ MATCH: Chinese Huaniao (花鳥畫)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation.chinese_huaniao?.description 
            || orientalEducation.chinese_default?.description;
      }
      
      // 수묵화
      else if (artist.includes('ink') || artist.includes('수묵') || artist.includes('wash')) {
        // console.log('✅ MATCH: Chinese Ink Wash (水墨畫)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation.chinese_ink?.description 
            || orientalEducation.chinese_default?.description;
      }
      
      // 기본값 (매칭 실패시)
      else {
        // console.log('⚠️ DEFAULT: Chinese Traditional Painting (중국 전통회화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation.chinese_default?.description;
      }
    }
    
    
    // ========== 일본 전통회화 (1가지) ==========
    if (styleId === 'japanese') {
      // console.log('🇯🇵 JAPANESE ART DETECTION:');
      // console.log('✅ MATCH: Japanese Ukiyo-e (浮世繪)');
      // console.log('========================================');
      // console.log('');
      return orientalEducation.japanese_ukiyoe?.description 
          || orientalEducation.japanese_default?.description;
    }
    
    
    // console.log('⚠️ NO MATCH - Returning null');
    // console.log('========================================');
    // console.log('');
    return null;
  };


  // ========== Fallback 메시지 ==========
  const getFallbackMessage = () => {
    // 원클릭 모드에서 현재 결과가 실패인 경우
    if (isFullTransform && currentResult && !currentResult.success) {
      return '변환에 실패하였습니다. 아래 다시 시도 버튼을 눌러주세요.';
    }
    
    // 원클릭인 경우 currentResult에서 정보 가져오기
    const category = isFullTransform ? currentResult?.style?.category : selectedStyle?.category;
    const styleName = isFullTransform 
      ? (currentResult?.aiSelectedArtist || currentResult?.style?.name)
      : (displayArtist || selectedStyle?.name);
    
    if (category === 'masters') {
      return `이 작품은 거장 ${styleName}의 스타일로 변환되었습니다.`;
    } else if (category === 'oriental') {
      return `이 작품은 ${styleName} 스타일로 변환되었습니다.`;
    } else {
      // movements (미술사조)
      return `이 작품은 ${styleName} 스타일로 변환되었습니다.`;
    }
  };


  // ========== 저장 ==========
  const handleDownload = async () => {
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const fileName = `picoart-${selectedStyle.id}-${Date.now()}.jpg`;
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('저장에 실패했습니다.');
    }
  };


  // ========== 공유 (이미지 파일) ==========
  const handleShare = async () => {
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const fileName = `picoart-${selectedStyle.id}-${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      // 이미지 파일 공유 시도
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'PicoArt 작품',
          text: `${selectedStyle.name} 스타일로 변환한 작품`,
        });
      } else if (navigator.share) {
        // 파일 공유 미지원 시 URL 공유
        await navigator.share({
          title: 'PicoArt - AI 예술 변환',
          text: `${selectedStyle.name}로 변환한 작품`,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('링크가 클립보드에 복사되었습니다!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        // console.log('Share failed:', error);
      }
    }
  };


  // ========== 스와이프 핸들러 (원클릭) ==========
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
      if (diffX > 0 && currentIndex < results.length - 1) {
        setCurrentIndex(i => i + 1);  // 왼쪽 스와이프 → 다음
      }
      if (diffX < 0 && currentIndex > 0) {
        setCurrentIndex(i => i - 1);  // 오른쪽 스와이프 → 이전
      }
    }
    setTouchStartX(0);
    setTouchStartY(0);
  };


  // ========== Render ==========
  return (
    <div className="result-screen">
      <div 
        className="result-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Header */}
        <div className="result-header">
          <h1>✨ 완성!</h1>
          <p className="result-subtitle">
            {isFullTransform 
              ? `${selectedStyle.name} (${currentIndex + 1}/${fullTransformResults.length})`
              : `${selectedStyle.name} 스타일로 변환되었습니다`
            }
          </p>
        </div>

        {/* 원클릭: 이미지만 표시 (재변환 결과 반영) */}
        {isFullTransform && (
          <div className="result-image-wrapper">
            <img src={currentMasterResultImage || displayImage} alt="변환 결과" className="result-image" />
          </div>
        )}

        {/* 단일 변환: Before/After Slider (v68: 재변환 결과 반영) */}
        {!isFullTransform && finalDisplayImage && (
          <div className="comparison-wrapper">
            <BeforeAfter 
              beforeImage={URL.createObjectURL(originalPhoto)}
              afterImage={finalDisplayImage}
            />
          </div>
        )}

        {/* 단독변환 실패 시 다시 시도 버튼 */}
        {!isFullTransform && (!finalDisplayImage || isRetrying) && (
          <div className="retry-section">
            {isRetrying ? (
              <div className="retry-in-progress">
                <div className="spinner-medium"></div>
                <p className="retry-text">🎨 AI가 다시 변환 중입니다...</p>
              </div>
            ) : (
              <div className="retry-prompt">
                <div className="retry-icon">🎨</div>
                <p className="fail-message">변환에 실패하였습니다.</p>
                <button 
                  className="btn btn-retry"
                  onClick={handleSingleModeRetry}
                >
                  <span className="btn-icon">✨</span>
                  다시 시도
                </button>
              </div>
            )}
          </div>
        )}

        {/* Toggle Button */}
        <div className="info-toggle">
          <button 
            className="toggle-button"
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? '🔽 작품 설명 숨기기' : '🔼 작품 설명 보기'}
          </button>
        </div>

        {/* Education Card */}
        {showInfo && (
          <div className="technique-card">
            
            {/* Card Header */}
            <div className="card-header">
              <div className="technique-icon">
                {isFullTransform ? (currentResult?.style?.icon || '🎨') : (selectedStyle.icon || '🎨')}
              </div>
              <div>
                <h2>
                  {/* v67: 새 표기 형식 - 제목 */}
                  {/* 거장: 풀네임(영문, 생몰연도) */}
                  {/* 미술사조: 사조(영문, 시기) */}
                  {/* 동양화: 국가 전통회화 */}
                  {(() => {
                    const category = isFullTransform ? currentResult?.style?.category : selectedStyle.category;
                    const styleName = isFullTransform ? (currentResult?.style?.name || selectedStyle.name) : selectedStyle.name;
                    
                    if (category === 'masters') {
                      // API 실패 시 selectedStyle.name 사용
                      const artistForDisplay = displayArtist || (isFullTransform ? currentResult?.style?.name : selectedStyle?.name);
                      const masterInfo = getMasterInfo(artistForDisplay);
                      return masterInfo.fullName;
                    } else if (category === 'movements') {
                      const movementInfo = getMovementDisplayInfo(styleName, displayArtist);
                      return movementInfo.title;
                    } else if (category === 'oriental') {
                      const orientalInfo = getOrientalDisplayInfo(displayArtist);
                      return orientalInfo.title;
                    }
                    return styleName;
                  })()}
                </h2>
                <p className="technique-subtitle">
                  <span className="artist-name">
                    {/* v67: 새 표기 형식 - 부제 */}
                    {/* 거장: 사조(시기) */}
                    {/* 미술사조: 화가명(생몰연도) */}
                    {/* 동양화: 스타일(영문) */}
                    {(() => {
                      const category = isFullTransform ? currentResult?.style?.category : selectedStyle.category;
                      const styleName = isFullTransform ? (currentResult?.style?.name || selectedStyle.name) : selectedStyle.name;
                      
                      if (category === 'masters') {
                        // API 실패 시 selectedStyle.name 사용
                        const artistForDisplay = displayArtist || (isFullTransform ? currentResult?.style?.name : selectedStyle?.name);
                        const masterInfo = getMasterInfo(artistForDisplay);
                        return masterInfo.movement || '거장';
                      } else if (category === 'movements') {
                        const movementInfo = getMovementDisplayInfo(styleName, displayArtist);
                        return movementInfo.subtitle;
                      } else if (category === 'oriental') {
                        const orientalInfo = getOrientalDisplayInfo(displayArtist);
                        return orientalInfo.subtitle;
                      }
                      return formatArtistName(displayArtist);
                    })()}
                  </span>
                </p>
              </div>
            </div>

            {/* Card Content */}
            <div className="card-content">
              {(() => {
                // console.log('');
                // console.log('🖼️ RENDERING EDUCATION CONTENT:');
                // console.log('   - isLoadingEducation:', isLoadingEducation);
                // console.log('   - educationText:', educationText);
                // console.log('   - educationText length:', educationText?.length);
                // console.log('');
                return null;
              })()}
              {isLoadingEducation ? (
                <div className="loading-education">
                  <div className="spinner"></div>
                  <p>작품 설명을 생성하고 있습니다...</p>
                </div>
              ) : (
                <div className="technique-explanation">
                  <h3>🖌️ 적용된 예술 기법</h3>
                  {educationText.split('\n\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index}>
                        {paragraph.trim().split('\n').map((line, lineIndex) => (
                          <React.Fragment key={lineIndex}>
                            {line}
                            {lineIndex < paragraph.trim().split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    )
                  ))}
                </div>
              )}
            </div>
            
          </div>
        )}

        {/* 원클릭 네비게이션 (교육자료 하단) */}
        {isFullTransform && (
          <div className="fullTransform-nav">
            <button 
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0 || isRetrying}
              className="nav-btn"
              style={{ opacity: isRetrying ? 0.5 : 1 }}
            >
              ◀ 이전
            </button>
            <div className="nav-dots">
              {fullTransformResults.map((_, idx) => (
                <button
                  key={idx}
                  className={`nav-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => !isRetrying && setCurrentIndex(idx)}
                  disabled={isRetrying}
                  style={{ opacity: isRetrying ? 0.5 : 1 }}
                />
              ))}
            </div>
            <button 
              onClick={() => setCurrentIndex(i => Math.min(fullTransformResults.length - 1, i + 1))}
              disabled={currentIndex === fullTransformResults.length - 1 || isRetrying}
              className="nav-btn"
              style={{ opacity: isRetrying ? 0.5 : 1 }}
            >
              다음 ▶
            </button>
          </div>
        )}

        {/* 다시 시도 버튼 (현재 보고 있는 결과가 실패한 경우에만 표시) */}
        {isFullTransform && currentResult && !currentResult.success && (
          <div className="retry-section">
            {isRetrying ? (
              <div className="retry-in-progress">
                <div className="spinner-medium"></div>
                <p className="retry-text">🎨 AI가 다시 변환 중입니다...</p>
              </div>
            ) : (
              <div className="retry-prompt">
                <div className="retry-icon">🎨</div>
                <p className="fail-message">변환에 실패하였습니다.</p>
                <button 
                  className="btn btn-retry"
                  onClick={handleRetry}
                >
                  <span className="btn-icon">✨</span>
                  {failedCount > 1 ? `전체 다시 시도` : '다시 시도'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 거장(AI) 대화 섹션 - 거장 카테고리일 때만 표시 (v68) */}
        {displayCategory === 'masters' && currentMasterKey && (
          <MasterChat
            key={currentMasterKey}
            masterKey={currentMasterKey}
            onRetransform={(correctionPrompt) => handleMasterRetransform(correctionPrompt, currentMasterKey)}
            isRetransforming={isCurrentMasterWorking}
            retransformCost={100}
            savedChatData={masterChatData[currentMasterKey]}
            onChatDataChange={(data) => updateMasterChatData(currentMasterKey, data)}
          />
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-gallery" 
            onClick={onGallery}
            disabled={isAnyMasterRetransforming || isRetrying}
            style={{ 
              opacity: (isAnyMasterRetransforming || isRetrying) ? 0.5 : 1,
              cursor: (isAnyMasterRetransforming || isRetrying) ? 'not-allowed' : 'pointer'
            }}
          >
            <span className="btn-icon">🖼️</span>
            갤러리
          </button>
          
          <button 
            className="btn btn-share" 
            onClick={handleShare}
          >
            <span className="btn-icon">📤</span>
            공유
          </button>
          
          <button 
            className="btn btn-reset" 
            onClick={onReset}
          >
            <span className="btn-icon">🔄</span>
            다시 만들기
          </button>
        </div>
        
      </div>

      {/* Styles */}
      <style>{`
        .result-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-container {
          max-width: 900px;
          width: 100%;
        }

        .result-header {
          text-align: center;
          color: white;
          margin-bottom: 2rem;
        }

        .result-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
        }

        .result-subtitle {
          font-size: 1.1rem;
          opacity: 0.95;
          margin: 0;
        }

        .comparison-wrapper {
          background: white;
          padding: 1.5rem;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          margin-bottom: 1.5rem;
        }

        .info-toggle {
          text-align: center;
          margin-bottom: 1rem;
        }

        .toggle-button {
          background: white;
          border: 2px solid #667eea;
          color: #667eea;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .toggle-button:hover {
          background: #667eea;
          color: white;
        }

        .technique-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          margin-bottom: 1.5rem;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e0e0e0;
          margin-bottom: 1.5rem;
        }

        .technique-icon {
          font-size: 3.5rem;
          min-width: 3.5rem;
          flex-shrink: 0;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
        }

        .card-header h2 {
          margin: 0;
          color: #333;
          font-size: 1.35rem;
          line-height: 1.2;
        }

        .technique-subtitle {
          color: #666;
          font-size: 1.05rem;
          margin: 0.25rem 0 0 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .artist-name {
          font-weight: 600;
          color: #222;
          font-size: 1.1rem;
        }

        .style-badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          color: white;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          vertical-align: middle;
          transform: translateY(-1px);
        }

        .style-badge.neoclassical {
          background: #2E86AB;
        }

        .style-badge.romantic {
          background: #A23B72;
        }

        .style-badge.realist {
          background: #C77B58;
        }

        .style-badge.cubism {
          background: #5D5D5D;
        }

        .style-badge.surrealism {
          background: #9B59B6;
        }

        .style-badge.popart {
          background: #E74C3C;
        }

        .movement-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
        }

        .loading-education {
          text-align: center;
          padding: 3rem 2rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-education p {
          color: #666;
          font-size: 1rem;
        }

        .technique-explanation {
          background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
          padding: 1.5rem;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }

        .technique-explanation h3 {
          color: #667eea;
          font-size: 1.1rem;
          margin: 0 0 1rem 0;
        }

        .technique-explanation p {
          color: #333;
          line-height: 1.8;
          font-size: 1rem;
          margin: 0 0 1.26em 0;  /* 0.7줄 간격 = line-height(1.8) × 0.7 */
        }
        
        .technique-explanation p:last-child {
          margin-bottom: 0;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .btn {
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        .btn-gallery {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-gallery:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(118, 75, 162, 0.4);
        }

        .btn-share {
          background: #3b82f6;
          color: white;
        }

        .btn-share:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
        }

        .btn-reset {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-reset:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }

        /* 다시 시도 섹션 */
        .retry-section {
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .retry-prompt {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 20px;
          padding: 2rem;
        }

        .retry-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .fail-message {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          margin-bottom: 1.25rem;
        }

        .btn-retry {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .btn-retry:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
        }

        .retry-in-progress {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .retry-text {
          color: #5b21b6;
          font-size: 1rem;
          font-weight: 500;
        }

        .spinner-medium {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(139, 92, 246, 0.3);
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .result-screen {
            padding: 1rem;
          }

          .result-header h1 {
            font-size: 2rem;
          }

          .result-subtitle {
            font-size: 0.95rem;
          }

          .comparison-wrapper {
            padding: 1rem;
          }

          .technique-card {
            padding: 1.5rem;
          }

          .technique-icon {
            font-size: 2.5rem;
            min-width: 2.5rem;
          }

          .card-header h2 {
            font-size: 1.25rem;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }
        }

        /* 원클릭 네비게이션 */
        .fullTransform-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .nav-btn {
          padding: 8px 16px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
        }
        .nav-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .nav-dots {
          display: flex;
          gap: 6px;
        }
        .nav-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: #ddd;
          cursor: pointer;
          padding: 0;
        }
        .nav-dot.active {
          background: #667eea;
          transform: scale(1.3);
        }
        
        /* 원클릭 이미지 */
        .result-image-wrapper {
          margin-bottom: 16px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .result-image {
          width: 100%;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default ResultScreen;
