// BottomSheet.jsx - 자세히 보기용 바텀시트
// v67 - 2026-01-15

import React, { useEffect, useRef, useState } from 'react';

const BottomSheet = ({ isOpen, onClose, title, content }) => {
  const sheetRef = useRef(null);
  const [touchStartY, setTouchStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 바깥 클릭으로 닫기
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 드래그 시작
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  // 드래그 중
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientY - touchStartY;
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  // 드래그 끝
  const handleTouchEnd = () => {
    setIsDragging(false);
    if (translateY > 100) {
      onClose();
    }
    setTranslateY(0);
  };

  if (!isOpen) return null;

  return (
    <div className="bottom-sheet-overlay" onClick={handleBackdropClick}>
      <div 
        ref={sheetRef}
        className="bottom-sheet"
        style={{ transform: `translateY(${translateY}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 핸들 바 */}
        <div className="sheet-handle">
          <div className="handle-bar"></div>
        </div>

        {/* 헤더 */}
        <div className="sheet-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* 내용 */}
        <div className="sheet-content">
          <p>{content}</p>
        </div>
      </div>

      <style>{`
        .bottom-sheet-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .bottom-sheet {
          background: white;
          border-radius: 20px 20px 0 0;
          width: 100%;
          max-width: 600px;
          max-height: 70vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease-out;
          transition: transform 0.1s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .sheet-handle {
          padding: 12px;
          display: flex;
          justify-content: center;
          cursor: grab;
        }

        .sheet-handle:active {
          cursor: grabbing;
        }

        .handle-bar {
          width: 40px;
          height: 4px;
          background: #ddd;
          border-radius: 2px;
        }

        .sheet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px 16px;
          border-bottom: 1px solid #eee;
        }

        .sheet-header h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #999;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .close-btn:hover {
          background: #f0f0f0;
          color: #666;
        }

        .sheet-content {
          padding: 20px;
        }

        .sheet-content p {
          margin: 0;
          font-size: 1rem;
          line-height: 1.8;
          color: #333;
          white-space: pre-line;
        }
      `}</style>
    </div>
  );
};

export default BottomSheet;
