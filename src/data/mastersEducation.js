// ========================================
// 단독변환 거장 교육 콘텐츠
// v68 - 2026-01-17 (4줄 구성, Full 버전 삭제)
// 로딩: 생애/일화 (누구인가)
// 결과: 화풍/기법 (어떻게 그렸나)
// ----------------------------------------
// [다국어 변환 시 수정 필요]
// - mastersBasicInfo: 화가명, 사조, 국가
// - mastersLoadingEducation: 생애/일화 4줄
// - mastersResultEducation: 화풍/기법 4줄
// ========================================

// ========== 기본정보 ==========
// [다국어 변환 시 수정 필요]
export const mastersBasicInfo = {
  'vangogh': {
    loading: {
      name: '빈센트 반 고흐(Vincent van Gogh, 1853~1890)',
      subtitle: '후기인상주의 · 네덜란드'
    },
    result: {
      name: '빈센트 반 고흐(Vincent van Gogh, 1853~1890)',
      subtitle: '별이 빛나는 밤 · 해바라기 · 자화상'
    }
  },
  'klimt': {
    loading: {
      name: '구스타프 클림트(Gustav Klimt, 1862~1918)',
      subtitle: '아르누보 · 오스트리아'
    },
    result: {
      name: '구스타프 클림트(Gustav Klimt, 1862~1918)',
      subtitle: '키스 · 유디트 · 생명의 나무'
    }
  },
  'munch': {
    loading: {
      name: '에드바르 뭉크(Edvard Munch, 1863~1944)',
      subtitle: '표현주의 · 노르웨이'
    },
    result: {
      name: '에드바르 뭉크(Edvard Munch, 1863~1944)',
      subtitle: '절규 · 마돈나 · 사춘기'
    }
  },
  'matisse': {
    loading: {
      name: '앙리 마티스(Henri Matisse, 1869~1954)',
      subtitle: '야수파 · 프랑스'
    },
    result: {
      name: '앙리 마티스(Henri Matisse, 1869~1954)',
      subtitle: '춤 · 붉은 방 · 모자를 쓴 여인'
    }
  },
  'chagall': {
    loading: {
      name: '마르크 샤갈(Marc Chagall, 1887~1985)',
      subtitle: '초현실주의 · 러시아/프랑스'
    },
    result: {
      name: '마르크 샤갈(Marc Chagall, 1887~1985)',
      subtitle: '마을 위에서 · 나와 마을 · 꽃다발과 연인들'
    }
  },
  'picasso': {
    loading: {
      name: '파블로 피카소(Pablo Picasso, 1881~1973)',
      subtitle: '입체주의 · 스페인'
    },
    result: {
      name: '파블로 피카소(Pablo Picasso, 1881~1973)',
      subtitle: '아비뇽의 처녀들 · 게르니카 · 우는 여인'
    }
  },
  'frida': {
    loading: {
      name: '프리다 칼로(Frida Kahlo, 1907~1954)',
      subtitle: '초현실주의 · 멕시코'
    },
    result: {
      name: '프리다 칼로(Frida Kahlo, 1907~1954)',
      subtitle: '부러진 기둥 · 가시 목걸이와 벌새'
    }
  },
  'lichtenstein': {
    loading: {
      name: '로이 리히텐슈타인(Roy Lichtenstein, 1923~1997)',
      subtitle: '팝아트 · 미국'
    },
    result: {
      name: '로이 리히텐슈타인(Roy Lichtenstein, 1923~1997)',
      subtitle: '물에 빠진 소녀 · 콰암! · 희망 없음'
    }
  }
};

// ========== 1차 교육: 로딩 (생애/일화) ==========
export const mastersLoadingEducation = {
  'vangogh': {
    title: '반 고흐',
    desc: `반 고흐는 후기인상주의의 거장입니다.
27세에 그림을 시작해 단 10년 동안 900점을 그렸습니다.
그러나 생전에 팔린 그림은 단 1점뿐이었습니다.
그의 가치는 죽은 뒤에야 세상에 의해 발견되었습니다.`
  },
  'klimt': {
    title: '클림트',
    desc: `클림트는 세기말 빈의 황금빛 꿈을 그린 화가입니다.
금세공사의 아들로 태어나 실제 금박을 캔버스에 입혔습니다.
비엔나 분리파를 이끌며 보수적인 미술계에 도전했습니다.
그는 관능과 신성을 하나로 만든 화가입니다.`
  },
  'munch': {
    title: '뭉크',
    desc: `뭉크는 왜곡된 형태를 통해 인간의 심리를 직접 드러낸 화가입니다.
그는 다섯 살에 어머니를, 열네 살에 누나를 잃었습니다.
"질병과 광기와 죽음은 내 요람을 지킨 천사들이었다."
이 상실의 기억은 평생 그의 캔버스를 지배했습니다.`
  },
  'matisse': {
    title: '마티스',
    desc: `마티스는 야수파를 이끈 색채의 마술사입니다.
그는 법률가를 꿈꾸다 병상에서 어머니가 건넨 물감으로 삶이 바뀌었습니다.
1905년 살롱에서의 "야수들!"이라는 비난은 곧 혁명의 이름이 되었습니다.
그는 색채를 감정의 언어로 해방시켰습니다.`
  },
  'chagall': {
    title: '샤갈',
    desc: `샤갈은 사랑과 꿈을 그린 화가입니다.
그는 러시아 유대인 마을 비테프스크에서 태어났습니다.
아내 벨라와의 사랑은 평생 그의 예술을 움직인 원천이었습니다.
97세까지 붓을 놓지 않은 몽환의 시인이었습니다.`
  },
  'picasso': {
    title: '피카소',
    desc: `피카소는 20세기 미술을 뒤흔든 혁명가입니다.
그는 91년의 생애 동안 약 5만 점의 작품을 남겼습니다.
13세에 그의 그림을 본 아버지가 붓을 꺾었다는 일화가 전해집니다.
입체주의를 창시하며 500년 원근법을 해체했습니다.`
  },
  'frida': {
    title: '프리다 칼로',
    desc: `프리다 칼로는 고통을 예술로 승화시킨 화가입니다.
그녀는 여섯 살에 소아마비를, 열여덟에 치명적인 버스 사고를 겪었습니다.
평생 30회가 넘는 수술을 견디며 침대 위에서 자신을 그렸습니다.
200점의 작품 중 55점이 자화상입니다.`
  },
  'lichtenstein': {
    title: '리히텐슈타인',
    desc: `리히텐슈타인은 만화를 예술로 바꾼 팝아트의 거장입니다.
아들이 미키마우스를 가리키며 던진 한 질문이 그의 전환점이 되었습니다.
그 질문은 예술과 대중문화의 경계를 흔들었습니다.
그는 대중문화를 미술관으로 끌어올렸습니다.`
  }
};

// ========== 2차 교육: 결과 (화풍/기법) ==========
export const mastersResultEducation = {
  'vangogh': {
    title: '반 고흐 화풍',
    desc: `반 고흐는 물감을 두껍게 쌓아 올리는 임파스토 기법을 사용했습니다.
소용돌이치는 붓터치는 그의 감정을 직접적으로 드러냅니다.
노랑과 파랑의 강렬한 보색 대비가 화면을 지배합니다.
이 모든 붓자국에는 그의 격정이 고스란히 담겨 있습니다.`
  },
  'klimt': {
    title: '클림트 화풍',
    desc: `클림트는 실제 금박을 캔버스에 입히는 기법을 사용했습니다.
그의 화면에는 비잔틴 모자이크에서 영감받은 기하학적 패턴이 반복됩니다.
나선형 곡선과 원형, 삼각형은 장식적 리듬을 만들어냅니다.
이 황금빛 화면 속에서 관능과 신성은 동시에 존재합니다.`
  },
  'munch': {
    title: '뭉크 화풍',
    desc: `뭉크는 보이는 것이 아닌, 느끼는 것을 그렸습니다.
소용돌이치는 곡선과 왜곡된 형태는 그의 불안을 시각화합니다.
핏빛 하늘과 병적인 노란색은 실존의 공포를 드러냅니다.
그의 붓끝에서 내면의 비명이 터져 나옵니다.`
  },
  'matisse': {
    title: '마티스 화풍',
    desc: `마티스는 현실의 색을 따르지 않고 순수한 원색을 사용했습니다.
얼굴에도 녹색과 보라, 주황이 거침없이 놓입니다.
복잡한 형태는 단순한 곡선과 평면으로 과감히 생략됩니다.
그의 화면에서 색채는 스스로 노래합니다.`
  },
  'chagall': {
    title: '샤갈 화풍',
    desc: `샤갈의 그림 속에서는 연인들이 하늘을 날고, 동물들이 환영처럼 떠다닙니다.
분홍과 연보라, 코발트 블루의 색채가 화면을 감쌉니다.
고향 비테프스크의 풍경은 기억처럼 아스라이 펼쳐집니다.
그의 화면에서 현실과 꿈은 경계 없이 어우러집니다.`
  },
  'picasso': {
    title: '피카소 화풍',
    desc: `피카소는 대상을 기하학적 면으로 분해했습니다.
정면과 측면이 하나의 화면에 동시에 존재합니다.
여러 시점이 한 공간에 공존하는 다시점 구조가 특징입니다.
그는 보는 방식 자체를 새롭게 정의했습니다.`
  },
  'frida': {
    title: '프리다 화풍',
    desc: `프리다는 정면을 응시하는 강렬한 눈빛과 이어진 눈썹으로 자신을 마주합니다.
원숭이와 벌새, 가시는 그녀의 고통과 정체성을 상징합니다.
빨강과 노랑, 초록의 멕시코 민속 색채가 화면을 지배합니다.
그녀의 캔버스에서 고통과 존재는 하나가 됩니다.`
  },
  'lichtenstein': {
    title: '리히텐슈타인 화풍',
    desc: `리히텐슈타인은 인쇄물의 벤데이 도트를 거대하게 확대했습니다.
굵고 선명한 검은 윤곽선은 형태를 만화처럼 고정합니다.
빨강, 파랑, 노랑의 순수한 원색만이 화면을 채웁니다.
그는 복제와 원본의 경계를 정면으로 질문했습니다.`
  }
};

// ========== 하위 호환성: 기존 키 매핑 ==========
export const mastersEducation = {
  // 1차 교육 (로딩) - 기존 키 유지
  'vangogh-master': mastersLoadingEducation['vangogh'],
  'klimt-master': mastersLoadingEducation['klimt'],
  'munch-master': mastersLoadingEducation['munch'],
  'matisse-master': mastersLoadingEducation['matisse'],
  'chagall-master': mastersLoadingEducation['chagall'],
  'picasso-master': mastersLoadingEducation['picasso'],
  'frida-master': mastersLoadingEducation['frida'],
  'lichtenstein-master': mastersLoadingEducation['lichtenstein'],
  
  // 2차 교육 (결과) - 기존 키 유지
  'vangogh': mastersResultEducation['vangogh'],
  'klimt': mastersResultEducation['klimt'],
  'munch': mastersResultEducation['munch'],
  'matisse': mastersResultEducation['matisse'],
  'chagall': mastersResultEducation['chagall'],
  'picasso': mastersResultEducation['picasso'],
  'frida': mastersResultEducation['frida'],
  'lichtenstein': mastersResultEducation['lichtenstein']
};

export default mastersEducation;
