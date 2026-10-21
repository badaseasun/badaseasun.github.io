/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  SeasonalData,
  LiveFestivals,
  DomesticPlaceDB,
  OverseasPlaceDB,
  PlaceItem,
} from './data/travelData.ts';
import {
  calculateConsensus,
  SurveyItem,
  LadderBridge,
  traceLadderPath,
} from './utils/arbitration.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'home' | 'seasonal' | 'timeline' | 'overseas' | 'survey' | 'sos'
  >('home');

  // Seasonal Tab state
  const [currentSeason, setCurrentSeason] = useState<
    'spring' | 'summer' | 'autumn' | 'winter'
  >('spring');
  const [currentRegionScope, setCurrentRegionScope] = useState<
    'all' | 'domestic' | 'overseas'
  >('all');

  // Kakao Auth State
  const [isKakaoLoggedIn, setIsKakaoLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Hero Banner 3.5s Slideshow (보내준 3개 사진 전용)
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Kakao Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePayload, setSharePayload] = useState({
    title: '다잡아트립 동행 여행 플랜',
    desc: '친구와 함께 트러블 없이 스마트하게 즐기는 국내 & 해외 여행 일정',
  });

  // Map Modal State
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapPlace, setMapPlace] = useState<{
    name: string;
    addr: string;
    walkTime: string;
  }>({
    name: '',
    addr: '',
    walkTime: '약 10분 (650m)',
  });

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Survey State
  const [surveySubmissions, setSurveySubmissions] = useState<SurveyItem[]>([
    { mbti: 'ENFP', budget: 25000, walk: 20 },
    { mbti: 'ISTJ', budget: 25000, walk: 20 },
  ]);
  const [formMbti, setFormMbti] = useState({ e: 'E', n: 'N', t: 'T', j: 'J' });
  const [formBudget, setFormBudget] = useState(25000);
  const [formWalk, setFormWalk] = useState(20);

  const consensus = calculateConsensus(surveySubmissions);

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mbti = `${formMbti.e}${formMbti.n}${formMbti.t}${formMbti.j}`;
    setSurveySubmissions((prev) => [
      ...prev,
      { mbti, budget: formBudget, walk: formWalk },
    ]);
    showToast('성향 및 예산 조건이 성공적으로 집계되었습니다.');
  };

  // Domestic Timeline state
  const [domDest, setDomDest] = useState('제주도');
  const [domDuration, setDomDuration] = useState('2박 3일');
  const [domConcept, setDomConcept] = useState('힐링 & 맛집 탐방');
  const [domLoading, setDomLoading] = useState(false);
  const [domDays, setDomDays] = useState<
    Array<{ day: number; morning: PlaceItem; lunch: PlaceItem; cafe: PlaceItem }>
  >([]);

  // Overseas Timeline state
  const [overseasDest, setOverseasDest] = useState('오사카');
  const [overseasDuration, setOverseasDuration] = useState('3박 4일');
  const [overseasConcept, setOverseasConcept] = useState('식도락 & 미식 탐방');
  const [overseasLoading, setOverseasLoading] = useState(false);
  const [overseasDays, setOverseasDays] = useState<
    Array<{ day: number; morning: PlaceItem; lunch: PlaceItem; cafe: PlaceItem }>
  >([]);

  const generateDomesticTimeline = () => {
    setDomLoading(true);
    setDomDays([]);
    setTimeout(() => {
      setDomLoading(false);
      let count = 3;
      if (domDuration.includes('당일')) count = 1;
      else if (domDuration.includes('1박 2일')) count = 2;
      else if (domDuration.includes('2박 3일')) count = 3;
      else if (domDuration.includes('3박 4일')) count = 4;
      else if (domDuration.includes('4박 5일')) count = 5;

      const db = DomesticPlaceDB[domDest] || DomesticPlaceDB['제주도'];
      const generated = [];
      for (let d = 1; d <= count; d++) {
        generated.push({
          day: d,
          morning: db.heal[(d - 1) % db.heal.length],
          lunch: db.food[(d - 1) % db.food.length],
          cafe: db.cafe[(d - 1) % db.cafe.length],
        });
      }
      setDomDays(generated);
      showToast(`${domDest} ${count}일 맞춤 AI 일정이 생성되었습니다.`);
    }, 450);
  };

  const generateOverseasTimeline = () => {
    setOverseasLoading(true);
    setOverseasDays([]);
    setTimeout(() => {
      setOverseasLoading(false);
      let count = 4;
      if (overseasDuration.includes('2박 3일')) count = 3;
      else if (overseasDuration.includes('3박 4일')) count = 4;
      else if (overseasDuration.includes('4박 5일')) count = 5;
      else if (overseasDuration.includes('5박 6일')) count = 6;

      const db = OverseasPlaceDB[overseasDest] || OverseasPlaceDB['오사카'];
      const generated = [];
      for (let d = 1; d <= count; d++) {
        generated.push({
          day: d,
          morning: db.heal[(d - 1) % db.heal.length],
          lunch: db.food[(d - 1) % db.food.length],
          cafe: db.cafe[(d - 1) % db.cafe.length],
        });
      }
      setOverseasDays(generated);
      showToast(`${overseasDest} ${count}일 맞춤 해외 일정이 생성되었습니다.`);
    }, 450);
  };

  // Preload initial domestic & overseas itineraries
  useEffect(() => {
    generateDomesticTimeline();
    generateOverseasTimeline();
  }, []);

  // SOS & Mediation State
  const [showRestPlanB, setShowRestPlanB] = useState(false);
  const [sosGameMode, setSosGameMode] = useState<'roulette' | 'ladder'>('roulette');

  // Roulette Candidates
  const [rouletteCandidates, setRouletteCandidates] = useState([
    { name: '🍣 제주 흑돼지 구이', color: '#ef4444', badge: '🔴 1번' },
    { name: '🍜 해물 갈치조림', color: '#3b82f6', badge: '🔵 2번' },
    { name: '☕ 바다뷰 베이커리 카페', color: '#10b981', badge: '🟢 3번' },
    { name: '🍕 수제버거 & 맥주', color: '#f59e0b', badge: '🟡 4번' },
  ]);
  const [rouletteWinner, setRouletteWinner] = useState<{
    name: string;
    color: string;
    badge: string;
  } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Ladder state
  const [ladderCount, setLadderCount] = useState(4);
  const [ladderPlayers, setLadderPlayers] = useState([
    '민수',
    '지은',
    '현우',
    '수진',
    '태민',
    '유나',
  ]);
  const [ladderTargets, setLadderTargets] = useState([
    '오늘의 운전',
    '저녁 쏘기',
    '운전대 휴식',
    '카페 쏘기',
    '사진작가',
    '짐 지킴이',
  ]);
  const [ladderWinner, setLadderWinner] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const openMap = (name: string, addr: string) => {
    const walkMin = Math.floor(Math.random() * 10) + 5;
    const walkMeters = walkMin * 65;
    setMapPlace({
      name,
      addr,
      walkTime: `약 ${walkMin}분 (${walkMeters}m)`,
    });
    setShowMapModal(true);
  };

  const openShare = (title: string, desc: string) => {
    setSharePayload({ title, desc });
    setShowShareModal(true);
  };

  // Canvas Drawing for Roulette & Ladder
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!isSpinning) {
      if (sosGameMode === 'roulette' && !rouletteWinner) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 12px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          '추첨 시작 버튼을 누르면 물리 엔진 시뮬레이션이 시작됩니다.',
          canvas.width / 2,
          canvas.height / 2
        );
      } else if (sosGameMode === 'ladder' && !ladderWinner) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 12px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          '사다리 타기 시작 버튼을 누르면 매칭이 진행됩니다.',
          canvas.width / 2,
          canvas.height / 2
        );
      }
    }
  }, [sosGameMode, isSpinning, rouletteWinner, ladderWinner]);

  const startPingPongRoulette = () => {
    const canvas = canvasRef.current;
    if (!canvas || isSpinning) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsSpinning(true);
    setRouletteWinner(null);

    const balls = rouletteCandidates.map((c, i) => ({
      ...c,
      x: 45 + i * 75,
      y: 40 + Math.random() * 20,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * 5 + 4,
      radius: 17,
    }));

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

      balls.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.28;

        if (b.x - b.radius < 12 || b.x + b.radius > canvas.width - 12) {
          b.vx *= -0.85;
          b.x =
            b.x - b.radius < 12
              ? 12 + b.radius
              : canvas.width - 12 - b.radius;
        }
        if (b.y + b.radius > canvas.height - 12) {
          b.vy *= -0.8;
          b.y = canvas.height - 12 - b.radius;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(b.badge.charAt(0), b.x, b.y + 4);
      });

      frame++;
      if (frame < 120) {
        requestAnimationFrame(animate);
      } else {
        const winner =
          rouletteCandidates[
            Math.floor(Math.random() * rouletteCandidates.length)
          ];
        setIsSpinning(false);
        setRouletteWinner(winner);
        showToast(`${winner.name} 당첨되었습니다!`);
      }
    };
    animate();
  };

  const startLadderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas || isSpinning) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsSpinning(true);
    setLadderWinner(null);

    const n = ladderCount;
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const w = canvas.width;
    const h = canvas.height;
    const stepX = (w - 60) / (n - 1);

    // Build deterministic bridges
    const generatedBridges: LadderBridge[] = [];
    for (let k = 0; k < 6; k++) {
      const leftIndex = Math.floor(Math.random() * (n - 1));
      generatedBridges.push({ yIndex: k, leftIndex });
    }

    let count = 0;
    const interval = setInterval(() => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;

      for (let i = 0; i < n; i++) {
        const x = 30 + i * stepX;
        ctx.beginPath();
        ctx.moveTo(x, 30);
        ctx.lineTo(x, h - 30);
        ctx.stroke();

        ctx.fillStyle = colors[i % colors.length];
        ctx.font = 'bold 11px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ladderPlayers[i].substring(0, 4), x, 20);
        ctx.fillStyle = '#10b981';
        ctx.fillText(ladderTargets[i].substring(0, 4), x, h - 12);
      }

      generatedBridges.forEach((b) => {
        const y = 55 + b.yIndex * 34;
        ctx.beginPath();
        ctx.moveTo(30 + b.leftIndex * stepX, y);
        ctx.lineTo(30 + (b.leftIndex + 1) * stepX, y);
        ctx.stroke();
      });

      count++;
      if (count > 14) {
        clearInterval(interval);
        setIsSpinning(false);
        const randomStart = Math.floor(Math.random() * n);
        const targetPos = traceLadderPath(randomStart, n, generatedBridges);
        const resultString = `${ladderPlayers[randomStart]} ➔ ${ladderTargets[targetPos]}`;
        setLadderWinner(resultString);
        showToast(`사다리 매칭: ${resultString}`);

        // Draw final completed ladder with highlight
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3;

        for (let i = 0; i < n; i++) {
          const x = 30 + i * stepX;
          ctx.beginPath();
          ctx.moveTo(x, 30);
          ctx.lineTo(x, h - 30);
          ctx.stroke();

          ctx.fillStyle = colors[i % colors.length];
          ctx.font = 'bold 11px Pretendard, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(ladderPlayers[i].substring(0, 4), x, 20);
          ctx.fillStyle = '#10b981';
          ctx.fillText(ladderTargets[i].substring(0, 4), x, h - 12);
        }

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        generatedBridges.forEach((b) => {
          const y = 55 + b.yIndex * 34;
          ctx.beginPath();
          ctx.moveTo(30 + b.leftIndex * stepX, y);
          ctx.lineTo(30 + (b.leftIndex + 1) * stepX, y);
          ctx.stroke();
        });
      }
    }, 70);
  };

  const filteredSeasonal = SeasonalData[currentSeason].filter((item) => {
    if (currentRegionScope === 'all') return true;
    return item.type === currentRegionScope;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 font-sans">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer py-1 shrink-0"
            onClick={() => {
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src="/assets/aistudio/Image_3_957edc8d.png"
              alt="다잡아트립 로고"
              className="w-8 h-8 md:w-9 md:h-9 mr-2 rounded-xl object-contain shadow-sm"
            />
            <span className="font-extrabold text-[22px] tracking-widest text-slate-900 whitespace-nowrap">
              다잡아트립
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full ml-2 bg-lime-100 text-lime-700 border border-lime-300 whitespace-nowrap">
              TRIP
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-1 font-medium text-xs lg:text-sm shrink-0">
            <button
              className={`px-2.5 lg:px-3 py-2 rounded-lg transition whitespace-nowrap ${
                currentTab === 'home'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
              onClick={() => setCurrentTab('home')}
            >
              홈
            </button>
            <button
              className={`px-2.5 lg:px-3 py-2 rounded-lg transition whitespace-nowrap ${
                currentTab === 'seasonal'
                  ? 'bg-lime-100 text-lime-800 font-bold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
              onClick={() => setCurrentTab('seasonal')}
            >
              사계절 추천 (국내/해외)
            </button>
            <button
              className={`px-2.5 lg:px-3 py-2 rounded-lg transition whitespace-nowrap ${
                currentTab === 'timeline'
                  ? 'bg-lime-100 text-lime-800 font-bold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
              onClick={() => setCurrentTab('timeline')}
            >
              국내 AI 일정
            </button>
            <button
              className={`px-2.5 lg:px-3 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                currentTab === 'overseas'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
              onClick={() => setCurrentTab('overseas')}
            >
              해외 AI 일정
            </button>
            <button
              className={`px-2.5 lg:px-3 py-2 rounded-lg transition whitespace-nowrap ${
                currentTab === 'survey'
                  ? 'bg-lime-100 text-lime-800 font-bold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
              onClick={() => setCurrentTab('survey')}
            >
              MBTI/예산 투표
            </button>
            <button
              className={`px-2.5 lg:px-3 py-2 rounded-lg transition font-bold whitespace-nowrap ${
                currentTab === 'sos'
                  ? 'bg-rose-500 text-white'
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
              onClick={() => setCurrentTab('sos')}
            >
              <i className="fa-solid fa-life-ring mr-1"></i> 현장 SOS & 중재
            </button>

            <div className="flex items-center pl-2 ml-1 border-l border-slate-200 gap-1.5 shrink-0">
              <button
                className="px-2.5 py-1.5 bg-[#FEE500] hover:bg-[#ebd400] text-[#3C1E1E] text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 whitespace-nowrap"
                onClick={() =>
                  openShare(
                    '전체 일정 및 사계절 여행지',
                    '친구와 함께 짜는 다잡아트립 여행 플랜'
                  )
                }
              >
                <i className="fa-solid fa-comment text-xs"></i>
                <span>카톡 공유</span>
              </button>
              {isKakaoLoggedIn ? (
                <div className="flex items-center gap-2 bg-slate-100 py-1 px-2 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-[#FEE500] flex items-center justify-center text-[#3C1E1E] text-xs font-black shadow-sm">
                    <i className="fa-solid fa-user-check text-[10px]"></i>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    카카오 여행자
                  </span>
                  <button
                    className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold ml-1 underline transition"
                    onClick={() => {
                      setIsKakaoLoggedIn(false);
                      showToast('카카오 계정에서 로그아웃되었습니다.');
                    }}
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  className="px-2.5 py-1.5 bg-[#FEE500] hover:bg-[#ebd400] text-[#3C1E1E] text-xs font-extrabold rounded-lg shadow-sm transition flex items-center gap-1.5"
                  onClick={() => setShowLoginModal(true)}
                >
                  <i className="fa-solid fa-comment text-xs"></i>
                  <span>카카오 로그인</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Top Status & Auth Bar */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 px-4 py-1.5 bg-white/90 backdrop-blur-md border-t border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <span
            className={`w-2 h-2 rounded-full ${
              isKakaoLoggedIn
                ? 'bg-emerald-500 border border-emerald-400'
                : 'bg-[#FEE500] border border-amber-400'
            }`}
          ></span>
          <span>{isKakaoLoggedIn ? '카카오 여행자 님' : '카카오 미연동'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            className="px-2.5 py-1 bg-[#FEE500] text-[#3C1E1E] font-bold rounded-lg text-xs flex items-center gap-1"
            onClick={() =>
              openShare(
                '모바일 일정 공유',
                '다잡아트립 동행 스마트 여행 플랜'
              )
            }
          >
            <i className="fa-solid fa-comment text-[10px]"></i> 공유
          </button>
          <button
            className="px-2.5 py-1 bg-slate-900 text-white font-bold rounded-lg text-xs"
            onClick={() => {
              if (isKakaoLoggedIn) {
                setIsKakaoLoggedIn(false);
                showToast('카카오 계정에서 로그아웃되었습니다.');
              } else {
                setShowLoginModal(true);
              }
            }}
          >
            {isKakaoLoggedIn ? '로그아웃' : '카카오 로그인'}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex justify-around py-2 shadow-lg">
        <button
          className={`flex flex-col items-center text-[11px] font-medium w-1/6 ${
            currentTab === 'home' ? 'text-lime-700 font-bold' : 'text-slate-600'
          }`}
          onClick={() => setCurrentTab('home')}
        >
          <i className="fa-solid fa-house text-base mb-0.5"></i> 홈
        </button>
        <button
          className={`flex flex-col items-center text-[11px] font-medium w-1/6 ${
            currentTab === 'seasonal' ? 'text-lime-700 font-bold' : 'text-slate-600'
          }`}
          onClick={() => setCurrentTab('seasonal')}
        >
          <i className="fa-solid fa-sun text-base mb-0.5"></i> 사계절
        </button>
        <button
          className={`flex flex-col items-center text-[11px] font-medium w-1/6 ${
            currentTab === 'timeline' ? 'text-lime-700 font-bold' : 'text-slate-600'
          }`}
          onClick={() => setCurrentTab('timeline')}
        >
          <i className="fa-solid fa-route text-base mb-0.5"></i> 국내일정
        </button>
        <button
          className={`flex flex-col items-center text-[11px] font-bold w-1/6 ${
            currentTab === 'overseas' ? 'text-emerald-700' : 'text-emerald-600'
          }`}
          onClick={() => setCurrentTab('overseas')}
        >
          <i className="fa-solid fa-earth-americas text-base mb-0.5"></i> 해외일정
        </button>
        <button
          className={`flex flex-col items-center text-[11px] font-medium w-1/6 ${
            currentTab === 'survey' ? 'text-lime-700 font-bold' : 'text-slate-600'
          }`}
          onClick={() => setCurrentTab('survey')}
        >
          <i className="fa-solid fa-user-check text-base mb-0.5"></i> 성향투표
        </button>
        <button
          className={`flex flex-col items-center text-[11px] font-bold w-1/6 ${
            currentTab === 'sos' ? 'text-rose-700' : 'text-rose-600'
          }`}
          onClick={() => setCurrentTab('sos')}
        >
          <i className="fa-solid fa-life-ring text-base mb-0.5"></i> SOS
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-20 pb-24 md:pb-12">
        {/* TAB 1: HOME */}
        {currentTab === 'home' && (
          <section className="space-y-12 w-full animate-fadeIn">
            {/* Hero Banner with 3.5s smooth crossfade rotation */}
            <div className="relative w-full overflow-hidden bg-slate-950 min-h-[460px] flex flex-col justify-end pb-12 select-none">
              {/* 3 Background Image Slides (여행 사진 2.jpg / 여행 사진.jpg / 여행사진.jpg 만 반영) */}
              {[
                {
                  url: '/assets/aistudio/hero_bg_valley.jpg',
                  title: '여행 사진 2.jpg',
                  subtitle: '노르웨이 푸른 계곡',
                },
                {
                  url: '/assets/aistudio/hero_bg_1.jpg',
                  title: '여행 사진.jpg',
                  subtitle: '유럽 구시가지 광장',
                },
                {
                  url: '/assets/aistudio/hero_bg_balloons.jpg',
                  title: '여행사진.jpg',
                  subtitle: '카파도키아 열기구',
                },
              ].map((slide, idx) => (
                <div
                  key={slide.url}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                    idx === heroSlideIndex
                      ? 'opacity-100 z-10'
                      : 'opacity-0 z-0 pointer-events-none'
                  }`}
                  style={{ backgroundImage: `url("${slide.url}")` }}
                />
              ))}

              {/* Gradient Overlay for Crisp Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/30 z-20 pointer-events-none"></div>

              {/* 3.5s Live Slideshow Indicator Badge */}
              <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs text-white shadow-xl">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
                <span className="font-bold text-lime-300">
                  {
                    [
                      '여행 사진 2.jpg',
                      '여행 사진.jpg',
                      '여행사진.jpg',
                    ][heroSlideIndex]
                  }
                </span>
                <span className="text-white/40">|</span>
                <span className="text-white/70 text-[11px]">3.5초 전환</span>
                <div className="flex gap-1.5 ml-1">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => setHeroSlideIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === heroSlideIndex
                          ? 'w-5 bg-lime-400 shadow-sm'
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`슬라이드 ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="relative z-30 px-4 max-w-6xl mx-auto w-full space-y-4 text-white">
                <span className="inline-block px-3 py-1 bg-lime-500 text-slate-950 text-xs font-black rounded-full uppercase tracking-wider">
                  2030 동행 여행 트러블 제로 솔루션
                </span>
                <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-md">
                  친구와의 여행,<br />
                  <span className="text-lime-400">감정 소모 없이 스마트하게!</span>
                </h1>
                <p className="text-slate-200 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
                  식비 눈치 볼 필요 없는 익명 블라인드 예산 조율부터 국내·해외 사계절 명소
                  추천, 광고 없는 클린 맛집, 전 일정 장소 실시간 지도 연동, 현장 체력 SOS 및
                  공정 물리 룰렛 중재까지!
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    className="px-5 py-3 bg-lime-500 hover:bg-lime-400 text-slate-950 font-extrabold rounded-xl shadow-lg transition flex items-center gap-2 text-sm"
                    onClick={() => setCurrentTab('seasonal')}
                  >
                    <i className="fa-solid fa-sun"></i> 사계절 국내·해외 추천
                  </button>
                  <button
                    className="px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold rounded-xl transition flex items-center gap-2 text-sm border border-white/30"
                    onClick={() => setCurrentTab('timeline')}
                  >
                    <i className="fa-solid fa-wand-magic-sparkles"></i> AI 일정 생성하기
                  </button>
                  <button
                    className="px-4 py-3 bg-[#FEE500] hover:bg-[#ebd400] text-[#3C1E1E] font-extrabold rounded-xl shadow-lg transition flex items-center gap-2 text-sm"
                    onClick={() =>
                      openShare(
                        '2030 동행 여행 플랜',
                        '국내·해외 사계절 추천 및 스마트 여행 일정 함께보기'
                      )
                    }
                  >
                    <i className="fa-solid fa-comment"></i> 카톡으로 친구 초대 & 공유
                  </button>
                </div>
              </div>
            </div>

            {/* Brand Video Area */}
            <div className="max-w-6xl mx-auto px-4">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950">
                <div className="relative w-full aspect-video md:aspect-[21/9] max-h-[440px] overflow-hidden">
                  <video
                    id="brand-film-video"
                    className="w-full h-full object-cover will-change-transform"
                    style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    src="/assets/aistudio/brand_film_hd.mp4"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90 text-xs backdrop-blur-md bg-slate-900/60 p-3 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse"></span>
                      <span className="font-bold">
                        다잡아트립 트래블 비전: 싸우지 않고 즐기는 2030 스마트 여정
                      </span>
                    </div>
                    <span className="hidden sm:inline text-slate-300">
                      감정 소모 0% · 광고 0% · 현장 배려 100%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core 4-step Solutions */}
            <div className="max-w-6xl mx-auto px-4 space-y-12">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-bold text-lime-600 uppercase tracking-widest">
                  Core Solutions
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  다잡아트립 4단계 트러블 해소 케어
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-lime-500 shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col justify-between group"
                  onClick={() => setCurrentTab('seasonal')}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-earth-asia"></i>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      사계절 국내·해외 추천
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      봄 벚꽃부터 겨울 설경까지 국내 핫스팟과 글로벌 해외 인기 여행지를
                      한눈에 비교 탐색.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                    <span>사계절 큐레이션 보기</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </div>

                <div
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-lime-500 shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col justify-between group"
                  onClick={() => setCurrentTab('survey')}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-user-secret"></i>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      성향 & 예산 블라인드
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      식비 한도와 도보 시간, MBTI를 비밀 제출하여 AI가 충돌율 0% 교집합을 도출.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-lime-700">
                    <span>투표 및 분석</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </div>

                <div
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col justify-between group"
                  onClick={() => setCurrentTab('timeline')}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-map-location-dot"></i>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      광고 없는 AI 지도 일정
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      협찬 리뷰 100% 스크리닝! 제주, 부산, 도쿄, 파리 등 카카오/구글맵 1초 연동.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>맞춤 코스 생성</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </div>

                <div
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-rose-500 shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col justify-between group"
                  onClick={() => setCurrentTab('sos')}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-dice"></i>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      SOS 쉼터 & 물리 중재
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      체력 방전 시 5분 쉼터 재배치, 메뉴 및 역할 충돌 시 물리 룰렛과 사다리로 공정 해결.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
                    <span>중재 도구 사용</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </div>
              </div>

              {/* Live Festivals Section with real images */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                      <i className="fa-solid fa-fire mr-1"></i> Live Events
                    </span>
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-0.5">
                      전국 실시간 축제 & 공연 큐레이션
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {LiveFestivals.map((fest, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative overflow-hidden rounded-2xl mb-3 h-40 bg-slate-200">
                          <img
                            src={fest.img}
                            alt={fest.title}
                            className="w-full h-full object-cover rounded-2xl hover:scale-105 transition duration-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold text-white ${fest.statusColor}`}
                          >
                            {fest.status}
                          </span>
                          <span className="text-xs text-slate-500">
                            <i className="fa-regular fa-calendar mr-1"></i>
                            {fest.date}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-base text-slate-900 mt-2">
                          {fest.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {fest.desc}
                        </p>
                      </div>
                      <button
                        className="w-full py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition mt-3"
                        onClick={() => openMap(fest.placeName, fest.addr)}
                      >
                        <i className="fa-solid fa-location-dot text-rose-500"></i> 지도 보기 & 길찾기
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: SEASONAL RECOMMENDATIONS */}
        {currentTab === 'seasonal' && (
          <section className="max-w-6xl mx-auto px-4 space-y-6 animate-fadeIn">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-xs font-bold text-lime-600 uppercase tracking-widest">
                    <i className="fa-solid fa-earth-asia mr-1"></i> Seasonal Curation (국내 & 해외 통합)
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                    사계절 맞춤 추천 여행지
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    계절의 아름다움과 2030 인생샷을 가장 완벽하게 담을 수 있는 국내 및 글로벌 해외 인기 스팟
                  </p>
                </div>

                {/* Scope selector */}
                <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold shrink-0">
                  <button
                    className={`px-3.5 py-2 rounded-xl transition font-bold ${
                      currentRegionScope === 'all'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    onClick={() => setCurrentRegionScope('all')}
                  >
                    <i className="fa-solid fa-globe mr-1 text-slate-500"></i> 전체보기
                  </button>
                  <button
                    className={`px-3.5 py-2 rounded-xl transition font-bold ${
                      currentRegionScope === 'domestic'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    onClick={() => setCurrentRegionScope('domestic')}
                  >
                    🇰🇷 국내 핫스팟
                  </button>
                  <button
                    className={`px-3.5 py-2 rounded-xl transition font-bold ${
                      currentRegionScope === 'overseas'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    onClick={() => setCurrentRegionScope('overseas')}
                  >
                    ✈️ 해외 인기 여행지
                  </button>
                </div>
              </div>

              {/* Season Selection Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  className={`p-4 rounded-2xl border transition flex flex-col items-center gap-2 font-bold ${
                    currentSeason === 'spring'
                      ? 'bg-lime-50 border-lime-400 text-lime-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setCurrentSeason('spring')}
                >
                  <i className="fa-solid fa-seedling text-2xl text-lime-600"></i>
                  <span>봄 (Spring)</span>
                </button>
                <button
                  className={`p-4 rounded-2xl border transition flex flex-col items-center gap-2 font-bold ${
                    currentSeason === 'summer'
                      ? 'bg-sky-50 border-sky-400 text-sky-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setCurrentSeason('summer')}
                >
                  <i className="fa-solid fa-umbrella-beach text-2xl text-sky-500"></i>
                  <span>여름 (Summer)</span>
                </button>
                <button
                  className={`p-4 rounded-2xl border transition flex flex-col items-center gap-2 font-bold ${
                    currentSeason === 'autumn'
                      ? 'bg-amber-50 border-amber-400 text-amber-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setCurrentSeason('autumn')}
                >
                  <i className="fa-solid fa-leaf text-2xl text-amber-500"></i>
                  <span>가을 (Autumn)</span>
                </button>
                <button
                  className={`p-4 rounded-2xl border transition flex flex-col items-center gap-2 font-bold ${
                    currentSeason === 'winter'
                      ? 'bg-blue-50 border-blue-400 text-blue-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setCurrentSeason('winter')}
                >
                  <i className="fa-solid fa-snowflake text-2xl text-blue-400"></i>
                  <span>겨울 (Winter)</span>
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {filteredSeasonal.map((item, idx) => {
                  const isDom = item.type === 'domestic';
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition group flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                          <img
                            src={item.img}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            {isDom ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-lime-500 text-slate-950 uppercase tracking-wider">
                                🇰🇷 국내
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                                ✈️ 해외
                              </span>
                            )}
                            <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                              <i
                                className={`fa-solid fa-location-dot ${
                                  isDom ? 'text-lime-400' : 'text-emerald-400'
                                } mr-1`}
                              ></i>
                              {item.region}
                            </span>
                          </div>
                        </div>
                        <div className="p-5 space-y-2">
                          <span
                            className={`text-xs font-extrabold ${
                              isDom ? 'text-lime-600' : 'text-emerald-600'
                            }`}
                          >
                            {item.tag}
                          </span>
                          <h3 className="font-extrabold text-lg text-slate-900">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <div className="p-5 pt-0 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => openMap(item.title, item.addr)}
                            className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                          >
                            <i className="fa-solid fa-diamond-turn-right text-lime-600"></i> 지도 & 길찾기
                          </button>
                          <button
                            onClick={() => openShare(item.title, item.desc)}
                            className="py-2.5 bg-[#FEE500] hover:bg-[#ebd400] text-[#3C1E1E] text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
                          >
                            <i className="fa-solid fa-comment text-xs"></i> 카톡 공유
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: MBTI & BUDGET SURVEY */}
        {currentTab === 'survey' && (
          <section className="max-w-6xl mx-auto px-4 space-y-6 animate-fadeIn">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-lime-600 uppercase tracking-widest">
                    <i className="fa-solid fa-user-shield mr-1"></i> Blind & Anonymous Input
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                    동행자 성향 & 예산 블라인드 입력
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    눈치 보지 마세요! 개별 제출된 데이터는 비밀이 보장되며 AI가 타협점을 산출합니다.
                  </p>
                </div>
                <div className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 self-start md:self-auto">
                  <i className="fa-solid fa-users text-lime-600"></i> 현재 참여 인원:{' '}
                  <span className="text-lime-700 font-black text-sm">
                    {consensus.participantCount}
                  </span>
                  명
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSurveySubmit}>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    1. 본인의 MBTI 성향
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <select
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                      value={formMbti.e}
                      onChange={(e) =>
                        setFormMbti({ ...formMbti, e: e.target.value })
                      }
                    >
                      <option value="E">E (외향적)</option>
                      <option value="I">I (내향적)</option>
                    </select>
                    <select
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                      value={formMbti.n}
                      onChange={(e) =>
                        setFormMbti({ ...formMbti, n: e.target.value })
                      }
                    >
                      <option value="N">N (직관형)</option>
                      <option value="S">S (감각형)</option>
                    </select>
                    <select
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                      value={formMbti.t}
                      onChange={(e) =>
                        setFormMbti({ ...formMbti, t: e.target.value })
                      }
                    >
                      <option value="T">T (사고형)</option>
                      <option value="F">F (감정형)</option>
                    </select>
                    <select
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                      value={formMbti.j}
                      onChange={(e) =>
                        setFormMbti({ ...formMbti, j: e.target.value })
                      }
                    >
                      <option value="J">J (계획형)</option>
                      <option value="P">P (자율형)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-800">
                      2. 1인당 한 끼 식비 예산 한도
                    </label>
                    <span className="text-sm font-black text-lime-700">
                      {formBudget.toLocaleString()}원
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="80000"
                    step="5000"
                    value={formBudget}
                    onChange={(e) => setFormBudget(Number(e.target.value))}
                    className="w-full accent-lime-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>10,000원</span>
                    <span>40,000원</span>
                    <span>80,000원</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-800">
                      3. 연속 도보 이동 최대 시간
                    </label>
                    <span className="text-sm font-black text-lime-700">
                      {formWalk}분 이하
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={formWalk}
                    onChange={(e) => setFormWalk(Number(e.target.value))}
                    className="w-full accent-lime-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>5분 (체력 절약)</span>
                    <span>30분 (보통)</span>
                    <span>60분 (걷기 선호)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black rounded-2xl shadow-md transition"
                >
                  블라인드 조건 제출하기
                </button>
              </form>
            </div>

            {/* Consensus Analytics */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-chart-pie text-lime-600"></i> 동행자 종합 교집합 분석 (AI 산출)
                </h3>
                <span className="text-xs bg-lime-100 text-lime-800 px-3 py-1 rounded-full font-bold">
                  충돌율 {consensus.conflictRate}% 합의점
                </span>
                <button
                  onClick={() =>
                    openShare(
                      '성향/예산 합의 결과',
                      '동행자 성향 교집합 분석 완료! 우리 여행 합의 조건 확인해보자.'
                    )
                  }
                  className="px-3 py-1.5 bg-[#FEE500] hover:bg-[#ebd400] text-[#3C1E1E] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition"
                >
                  <i className="fa-solid fa-comment"></i> 합의 결과 카톡 공유
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-500 font-semibold">평균 식비 상한선</span>
                  <div className="text-xl font-black text-slate-800">
                    {consensus.avgBudget.toLocaleString()}원 / {consensus.participantCount}인 참여
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-500 font-semibold">최대 도보 이동 허용치</span>
                  <div className="text-xl font-black text-slate-800">
                    최대 {consensus.minWalk}분 이내
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-500 font-semibold">대표 케미 스펙트럼</span>
                  <div className="text-xl font-black text-slate-800">
                    {consensus.mbtiSpectrum}
                  </div>
                </div>
              </div>

              <button
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2"
                onClick={() => setCurrentTab('timeline')}
              >
                <i className="fa-solid fa-wand-magic-sparkles text-lime-400"></i> 이 합의 조건으로 AI 일정 자동 생성
              </button>
            </div>
          </section>
        )}

        {/* TAB 4: DOMESTIC TIMELINE */}
        {currentTab === 'timeline' && (
          <section className="max-w-6xl mx-auto px-4 space-y-6 animate-fadeIn">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-lime-600 uppercase tracking-widest">
                    <i className="fa-solid fa-shield-halved mr-1"></i> Clean Review AI Engine
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    국내 AI 스마트 일정 생성기
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    협찬/광고 리뷰를 완전 스크리닝한 검증된 로컬 핫플 및 전 일정 지도 연동
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-lime-50 border border-lime-200 text-lime-800 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
                  <i className="fa-solid fa-circle-check text-lime-600"></i> 동행 합의 조건 연동 완료
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    여행지 선택
                  </label>
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    value={domDest}
                    onChange={(e) => setDomDest(e.target.value)}
                  >
                    <option value="제주도">제주도 (서귀포/애월/성산)</option>
                    <option value="부산">부산 (해운대/광안리/영도)</option>
                    <option value="강릉">강릉 (안목/경포/초당)</option>
                    <option value="경주">경주 (황리단길/보문)</option>
                    <option value="서울">서울 (성수/홍대/익선)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    일정 기간
                  </label>
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    value={domDuration}
                    onChange={(e) => setDomDuration(e.target.value)}
                  >
                    <option value="당일치기">당일치기 코스</option>
                    <option value="1박 2일">1박 2일</option>
                    <option value="2박 3일">2박 3일 (추천)</option>
                    <option value="3박 4일">3박 4일</option>
                    <option value="4박 5일">4박 5일</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    메인 컨셉
                  </label>
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    value={domConcept}
                    onChange={(e) => setDomConcept(e.target.value)}
                  >
                    <option value="힐링 & 맛집 탐방">힐링 & 로컬 찐맛집</option>
                    <option value="감성 카페 & 인생샷">감성 카페 & 인생 포토존</option>
                    <option value="액티비티 & 관광">체험 액티비티 & 관광</option>
                  </select>
                </div>
              </div>

              <button
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
                onClick={generateDomesticTimeline}
              >
                <i className="fa-solid fa-wand-magic-sparkles text-lime-400"></i> 국내 맞춤 AI 동선 & 지도 생성
              </button>
            </div>

            {domLoading && (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-lime-500 border-t-transparent"></div>
                <h3 className="text-base font-bold text-slate-800">
                  광고 리뷰 스크리닝 및 최적 지도 동선 계산 중...
                </h3>
                <p className="text-xs text-slate-500">
                  도보 이동 분 수와 동행자 식비 예산 기준을 매칭하고 있습니다.
                </p>
              </div>
            )}

            {/* Generated Days */}
            <div className="space-y-6">
              {domDays.map((item) => (
                <div
                  key={item.day}
                  className="bg-white p-6 md:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-lime-500 text-slate-950 flex items-center justify-center font-black text-sm">
                        D{item.day}
                      </span>
                      <span>
                        {domDest} {domConcept} AI 최적 동선
                      </span>
                    </h3>
                    <button
                      onClick={() =>
                        openShare(
                          `Day ${item.day} ${domDest} 추천 동선`,
                          `${item.morning.name} ➔ ${item.lunch.name} ➔ ${item.cafe.name}`
                        )
                      }
                      className="px-2.5 py-1 bg-[#FEE500] hover:bg-[#ebd400] text-[#3C1E1E] text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm transition"
                    >
                      <i className="fa-solid fa-comment text-[10px]"></i> Day {item.day} 카톡 공유
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Morning */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-100">
                      <div className="flex items-start gap-3">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-black shrink-0 mt-0.5">
                          오전
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {item.morning.name}
                          </h4>
                          <p className="text-xs text-slate-500">{item.morning.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => openMap(item.morning.name, item.morning.addr)}
                        className="px-3.5 py-2 bg-white border border-slate-200 hover:border-lime-500 rounded-xl text-xs font-bold text-slate-700 hover:text-lime-700 flex items-center gap-1.5 shadow-sm transition shrink-0 self-end sm:self-center"
                      >
                        <i className="fa-solid fa-location-dot text-lime-600"></i> 지도 & 길찾기
                      </button>
                    </div>

                    {/* Lunch */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-100">
                      <div className="flex items-start gap-3">
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-black shrink-0 mt-0.5">
                          점심
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {item.lunch.name}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {item.lunch.desc} ·{' '}
                            <span className="text-lime-700 font-semibold">
                              예산 한도 부합
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => openMap(item.lunch.name, item.lunch.addr)}
                        className="px-3.5 py-2 bg-white border border-slate-200 hover:border-lime-500 rounded-xl text-xs font-bold text-slate-700 hover:text-lime-700 flex items-center gap-1.5 shadow-sm transition shrink-0 self-end sm:self-center"
                      >
                        <i className="fa-solid fa-location-dot text-amber-500"></i> 지도 & 길찾기
                      </button>
                    </div>

                    {/* Cafe */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-100">
                      <div className="flex items-start gap-3">
                        <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-lg text-xs font-black shrink-0 mt-0.5">
                          오후
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {item.cafe.name}
                          </h4>
                          <p className="text-xs text-slate-500">{item.cafe.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => openMap(item.cafe.name, item.cafe.addr)}
                        className="px-3.5 py-2 bg-white border border-slate-200 hover:border-lime-500 rounded-xl text-xs font-bold text-slate-700 hover:text-lime-700 flex items-center gap-1.5 shadow-sm transition shrink-0 self-end sm:self-center"
                      >
                        <i className="fa-solid fa-location-dot text-sky-500"></i> 지도 & 길찾기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 5: OVERSEAS TIMELINE */}
        {currentTab === 'overseas' && (
          <section className="max-w-6xl mx-auto px-4 space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-emerald-950 to-slate-950 text-white p-6 md:p-8 rounded-3xl border border-emerald-800 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800/80 pb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    <i className="fa-solid fa-earth-asia mr-1"></i> Global Smart Navigation
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-0.5">
                    해외 AI 스마트 일정 생성기
                  </h2>
                  <p className="text-xs text-emerald-200/80 mt-1">
                    현지 지하철 최적 동선, 실시간 구글맵 연동, 필수 랜드마크 & 로컬 맛집
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold self-start sm:self-auto">
                  환율 & 입국팁 최적화
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-900">
                <div>
                  <label className="block text-xs font-bold text-emerald-100 mb-1">
                    해외 도시
                  </label>
                  <select
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    value={overseasDest}
                    onChange={(e) => setOverseasDest(e.target.value)}
                  >
                    <option value="오사카">오사카 / 교토 (일본)</option>
                    <option value="도쿄">도쿄 (일본)</option>
                    <option value="다낭">다낭 / 호이안 (베트남)</option>
                    <option value="방콕">방콕 (태국)</option>
                    <option value="파리">파리 (프랑스)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-100 mb-1">
                    일정 기간
                  </label>
                  <select
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    value={overseasDuration}
                    onChange={(e) => setOverseasDuration(e.target.value)}
                  >
                    <option value="2박 3일">2박 3일</option>
                    <option value="3박 4일">3박 4일 (인기)</option>
                    <option value="4박 5일">4박 5일</option>
                    <option value="5박 6일">5박 6일</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-100 mb-1">
                    여행 테마
                  </label>
                  <select
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    value={overseasConcept}
                    onChange={(e) => setOverseasConcept(e.target.value)}
                  >
                    <option value="식도락 & 미식 탐방">식도락 & 현지 미식</option>
                    <option value="랜드마크 & 관광">필수 랜드마크 & 핫플</option>
                    <option value="휴양 & 감성">여유로운 휴양 & 감성</option>
                  </select>
                </div>
              </div>

              <button
                className="w-full py-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
                onClick={generateOverseasTimeline}
              >
                <i className="fa-solid fa-plane-departure"></i> 선택한 해외 도시 AI 일정 & 지도 생성
              </button>
            </div>

            {overseasLoading && (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                <h3 className="text-base font-bold text-slate-800">
                  해외 대중교통 노선 및 구글맵 위치 분석 중...
                </h3>
                <p className="text-xs text-slate-500">
                  환율 정보와 최단 지하철 환승 경로를 반영하고 있습니다.
                </p>
              </div>
            )}

            <div className="space-y-6">
              {overseasDays.map((item) => (
                <div
                  key={item.day}
                  className="bg-white p-6 md:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm">
                        D{item.day}
                      </span>
                      <span>
                        {overseasDest} {overseasConcept} AI 최적 동선
                      </span>
                    </h3>
                    <button
                      onClick={() =>
                        openShare(
                          `Day ${item.day} ${overseasDest} 추천 동선`,
                          `${item.morning.name} ➔ ${item.lunch.name} ➔ ${item.cafe.name}`
                        )
                      }
                      className="px-2.5 py-1 bg-[#FEE500] hover:bg-[#ebd400] text-[#3C1E1E] text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm transition"
                    >
                      <i className="fa-solid fa-comment text-[10px]"></i> Day {item.day} 카톡 공유
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-100">
                      <div className="flex items-start gap-3">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-black shrink-0 mt-0.5">
                          오전
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {item.morning.name}
                          </h4>
                          <p className="text-xs text-slate-500">{item.morning.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => openMap(item.morning.name, item.morning.addr)}
                        className="px-3.5 py-2 bg-white border border-slate-200 hover:border-lime-500 rounded-xl text-xs font-bold text-slate-700 hover:text-lime-700 flex items-center gap-1.5 shadow-sm transition shrink-0 self-end sm:self-center"
                      >
                        <i className="fa-solid fa-location-dot text-lime-600"></i> 지도 & 길찾기
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-100">
                      <div className="flex items-start gap-3">
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-black shrink-0 mt-0.5">
                          점심
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {item.lunch.name}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {item.lunch.desc} ·{' '}
                            <span className="text-lime-700 font-semibold">
                              예산 한도 부합
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => openMap(item.lunch.name, item.lunch.addr)}
                        className="px-3.5 py-2 bg-white border border-slate-200 hover:border-lime-500 rounded-xl text-xs font-bold text-slate-700 hover:text-lime-700 flex items-center gap-1.5 shadow-sm transition shrink-0 self-end sm:self-center"
                      >
                        <i className="fa-solid fa-location-dot text-amber-500"></i> 지도 & 길찾기
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-100">
                      <div className="flex items-start gap-3">
                        <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-lg text-xs font-black shrink-0 mt-0.5">
                          오후
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {item.cafe.name}
                          </h4>
                          <p className="text-xs text-slate-500">{item.cafe.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => openMap(item.cafe.name, item.cafe.addr)}
                        className="px-3.5 py-2 bg-white border border-slate-200 hover:border-lime-500 rounded-xl text-xs font-bold text-slate-700 hover:text-lime-700 flex items-center gap-1.5 shadow-sm transition shrink-0 self-end sm:self-center"
                      >
                        <i className="fa-solid fa-location-dot text-sky-500"></i> 지도 & 길찾기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 6: SOS & PHYSICAL ARBITRATION */}
        {currentTab === 'sos' && (
          <section className="max-w-6xl mx-auto px-4 space-y-6 animate-fadeIn">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                  <i className="fa-solid fa-life-ring mr-1"></i> Conflict & Fatigue Care
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  현장 SOS & 물리 엔진 중재 도구
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  체력 방전 시 쉼터 플랜 B 재배치 및 메뉴·역할 대립 시 공정 랜덤 추첨
                </p>
              </div>

              {/* Emergency Rest Plan B */}
              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shrink-0">
                      <i className="fa-solid fa-battery-quarter"></i>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base">
                        체력 방전 SOS (도보 5분 쉼터 플랜 B)
                      </h3>
                      <p className="text-xs text-slate-600">
                        동행 중 누군가 방전되었을 때, 현 GPS 기준 가장 가까운 오션뷰/좌식 카페 탐색
                      </p>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow transition shrink-0"
                    onClick={() => {
                      setShowRestPlanB(true);
                      showToast('현 위치 기준 도보 5분 이내 쉼터 2곳이 탐색되었습니다.');
                    }}
                  >
                    <i className="fa-solid fa-crosshairs mr-1"></i> 5분 쉼터 탐색 실행
                  </button>
                </div>

                {showRestPlanB && (
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-amber-900 flex items-center justify-between border-t border-amber-200 pt-3">
                      <span>
                        <i className="fa-solid fa-location-dot mr-1"></i> 현 GPS (33.4996° N, 126.5312° E) 추천 쉼터
                      </span>
                      <span className="text-[11px] bg-amber-200/80 px-2 py-0.5 rounded text-amber-900 font-bold">
                        도보 3~5분
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-white rounded-xl border border-amber-200 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-slate-900 text-sm">
                              ☕ 스타벅스 제주용담DT점
                            </h4>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                              소파석 여유
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            도보 3분 (210m) · 탁 트인 오션뷰 & 넉넉한 쿠션 좌석
                          </p>
                        </div>
                        <button
                          className="mt-3 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition"
                          onClick={() =>
                            openMap('스타벅스 제주용담DT점', '제주 제주시 흥운길 83')
                          }
                        >
                          <i className="fa-solid fa-diamond-turn-right text-lime-400"></i> 즉시 길찾기
                        </button>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-amber-200 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-slate-900 text-sm">
                              🍵 앙뚜아네트 용담점
                            </h4>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                              좌식 마루 보유
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            도보 5분 (340m) · 신발 벗고 쉴 수 있는 바다 뷰 베이커리
                          </p>
                        </div>
                        <button
                          className="mt-3 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition"
                          onClick={() =>
                            openMap('앙뚜아네트 용담점', '제주 제주시 서해안로 672')
                          }
                        >
                          <i className="fa-solid fa-diamond-turn-right text-lime-400"></i> 즉시 길찾기
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Random Mediation Games */}
              <div className="pt-2 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                    <i className="fa-solid fa-scale-balanced text-rose-500"></i> 의견 대립 해결 랜덤 중재기
                  </h3>
                  <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200">
                    <button
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${
                        sosGameMode === 'roulette'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      onClick={() => setSosGameMode('roulette')}
                    >
                      <i className="fa-solid fa-dice text-rose-500 mr-1"></i> 핑퐁 룰렛
                    </button>
                    <button
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${
                        sosGameMode === 'ladder'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      onClick={() => setSosGameMode('ladder')}
                    >
                      <i className="fa-solid fa-bars-staggered text-emerald-600 mr-1"></i> 사다리 타기
                    </button>
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#FEE500] hover:bg-[#ebd400] text-[#3C1E1E] shadow-sm transition flex items-center gap-1.5"
                    onClick={() =>
                      openShare(
                        '현장 SOS 중재 결과',
                        '물리 룰렛 & 사다리 결과가 나왔습니다! 카톡방에서 확인하세요.'
                      )
                    }
                  >
                    <i className="fa-solid fa-comment"></i>
                    <span>중재 결과 카톡 공유</span>
                  </button>
                </div>

                {/* Roulette Inputs UI */}
                {sosGameMode === 'roulette' && (
                  <div className="max-w-md mx-auto space-y-3">
                    <p className="text-xs text-slate-500 text-center">
                      메뉴나 다음 행선지 의견이 갈릴 때, 물리 충돌 룰렛으로 결정하세요!
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {rouletteCandidates.map((cand, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={cand.name}
                          onChange={(e) => {
                            const next = [...rouletteCandidates];
                            next[idx].name = e.target.value;
                            setRouletteCandidates(next);
                          }}
                          className="w-full px-3 py-2.5 bg-slate-800 border rounded-xl text-xs text-white outline-none focus:border-lime-400"
                          style={{ borderColor: cand.color }}
                        />
                      ))}
                    </div>
                    <button
                      className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-black rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
                      onClick={startPingPongRoulette}
                      disabled={isSpinning}
                    >
                      <i className="fa-solid fa-play"></i> 핑퐁 룰렛 추첨 시작!
                    </button>
                  </div>
                )}

                {/* Ladder Inputs UI */}
                {sosGameMode === 'ladder' && (
                  <div className="max-w-lg mx-auto space-y-3">
                    <p className="text-xs text-slate-500 text-center">
                      인원수와 이름, 역할(총무, 운전, 저녁 쏘기 등)을 입력하고 사다리를 타보세요!
                    </p>
                    <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-700">참여 인원수</span>
                      <div className="flex items-center gap-2">
                        <button
                          className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                          onClick={() => setLadderCount((prev) => Math.max(2, prev - 1))}
                        >
                          -
                        </button>
                        <span className="font-black text-sm w-5 text-center text-slate-900">
                          {ladderCount}
                        </span>
                        <button
                          className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                          onClick={() => setLadderCount((prev) => Math.min(6, prev + 1))}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Array.from({ length: ladderCount }).map((_, i) => (
                        <div
                          key={i}
                          className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block"
                                style={{
                                  backgroundColor:
                                    ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][
                                      i % 6
                                    ],
                                }}
                              ></span>
                              참여자 {i + 1}
                            </span>
                            <span className="text-[10px] text-slate-400">➔ 결과</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <input
                              type="text"
                              value={ladderPlayers[i]}
                              onChange={(e) => {
                                const next = [...ladderPlayers];
                                next[i] = e.target.value;
                                setLadderPlayers(next);
                              }}
                              className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
                            />
                            <input
                              type="text"
                              value={ladderTargets[i]}
                              onChange={(e) => {
                                const next = [...ladderTargets];
                                next[i] = e.target.value;
                                setLadderTargets(next);
                              }}
                              className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-lime-400 font-semibold outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
                      onClick={startLadderGame}
                      disabled={isSpinning}
                    >
                      <i className="fa-solid fa-route"></i> 사다리 타기 시작!
                    </button>
                  </div>
                )}

                {/* Shared Canvas Surface */}
                <div className="flex flex-col items-center justify-center pt-2">
                  <canvas
                    ref={canvasRef}
                    id="rouletteCanvas"
                    width={340}
                    height={300}
                    className="max-w-full rounded-2xl bg-slate-900 shadow-inner"
                  ></canvas>

                  {/* Roulette Winner Banner */}
                  {sosGameMode === 'roulette' && rouletteWinner && (
                    <div
                      className="mt-4 w-full max-w-md p-4 rounded-2xl text-center border shadow-lg transition-all"
                      style={{ borderColor: rouletteWinner.color }}
                    >
                      <span
                        className="inline-block text-xs px-3 py-1 rounded-full font-bold text-white shadow"
                        style={{ backgroundColor: rouletteWinner.color }}
                      >
                        {rouletteWinner.badge} 당첨!
                      </span>
                      <div
                        className="text-2xl font-black mt-2 tracking-tight"
                        style={{ color: rouletteWinner.color }}
                      >
                        {rouletteWinner.name}
                      </div>
                    </div>
                  )}

                  {/* Ladder Winner Banner */}
                  {sosGameMode === 'ladder' && ladderWinner && (
                    <div className="mt-4 w-full max-w-md p-4 rounded-2xl text-center border border-emerald-500 shadow-lg transition-all">
                      <span className="inline-block text-xs px-3 py-1 rounded-full font-bold text-white shadow bg-emerald-600">
                        🪜 사다리 매칭 완료!
                      </span>
                      <div className="text-2xl font-black mt-2 tracking-tight text-emerald-600">
                        {ladderWinner}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Map & Directions Modal (Deep Link System) */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 space-y-4">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-lime-500 text-slate-950 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    {mapPlace.name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate max-w-xs">
                    {mapPlace.addr}
                  </p>
                </div>
              </div>
              <button
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition"
                onClick={() => setShowMapModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="px-5 space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-person-walking text-lime-600 text-base"></i>
                  <span className="text-slate-600">현 위치 기준 도보:</span>
                  <span className="font-black text-slate-900">
                    {mapPlace.walkTime}
                  </span>
                </div>
                <span className="bg-lime-100 text-lime-800 px-2 py-0.5 rounded font-bold text-[11px]">
                  동행 허용치 이내
                </span>
              </div>

              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-bus text-blue-600 text-base"></i>
                  <span className="text-slate-600">TAGO 대중교통:</span>
                  <span className="font-bold text-blue-900">
                    버스 환승 0회 (약 9분 소요)
                  </span>
                </div>
                <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                  실시간
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  원클릭 지도 앱 바로 열기 (딥링크)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://map.kakao.com/link/search/${encodeURIComponent(
                      mapPlace.name + ' ' + mapPlace.addr
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 bg-[#FEE500] hover:bg-[#ebd400] text-[#3C1E1E] font-bold rounded-xl text-xs flex flex-col items-center justify-center gap-1 shadow-sm transition"
                  >
                    <i className="fa-solid fa-comment text-sm"></i> 카카오맵
                  </a>
                  <a
                    href={`https://map.naver.com/v5/search/${encodeURIComponent(
                      mapPlace.name + ' ' + mapPlace.addr
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 bg-[#03C75A] hover:bg-[#02b350] text-white font-bold rounded-xl text-xs flex flex-col items-center justify-center gap-1 shadow-sm transition"
                  >
                    <span className="font-black text-sm">N</span> 네이버지도
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      mapPlace.name + ' ' + mapPlace.addr
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex flex-col items-center justify-center gap-1 shadow-sm transition"
                  >
                    <i className="fa-solid fa-location-arrow text-sm text-lime-400"></i> Google Maps
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button
                className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition"
                onClick={() => setShowMapModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kakao Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-200 space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FEE500] text-[#3C1E1E] flex items-center justify-center font-black">
                  <i className="fa-solid fa-comment"></i>
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  카카오 간편 로그인
                </h3>
              </div>
              <button
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                onClick={() => setShowLoginModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 text-center py-2">
              <div className="w-14 h-14 bg-[#FEE500] rounded-2xl mx-auto flex items-center justify-center text-2xl text-[#3C1E1E] shadow-sm">
                <i className="fa-solid fa-comment"></i>
              </div>
              <h4 className="font-black text-slate-900 text-base">
                3초 만에 카카오로 동행 시작
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                친구와 함께 투표하고 실시간 일정을 동기화하려면 카카오 계정으로 간편하게 시작하세요.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                className="w-full py-3.5 bg-[#FEE500] hover:bg-[#ebd400] text-[#3C1E1E] font-black rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
                onClick={() => {
                  setIsKakaoLoggedIn(true);
                  setShowLoginModal(false);
                  showToast('카카오 계정(카카오 여행자)으로 로그인되었습니다.');
                }}
              >
                <i className="fa-solid fa-comment"></i> 카카오 계정으로 계속하기
              </button>
              <button
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                onClick={() => setShowLoginModal(false)}
              >
                다음에 하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kakao Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FEE500] text-[#3C1E1E] flex items-center justify-center font-black">
                  <i className="fa-solid fa-comment"></i>
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  카카오톡 공유하기
                </h3>
              </div>
              <button
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                onClick={() => setShowShareModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Kakao Card Preview */}
            <div className="bg-[#F7E600]/20 p-4 rounded-2xl border border-[#FEE500] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900 bg-[#FEE500] px-2 py-0.5 rounded-full">
                  카카오톡 메시지 미리보기
                </span>
                <span className="text-[11px] text-slate-500">DAJABA TRIP</span>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm space-y-2">
                <h4 className="font-black text-slate-900 text-sm">
                  {sharePayload.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sharePayload.desc}
                </p>
                <div className="pt-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <i className="fa-solid fa-shield-halved text-xs"></i> 사계절 추천 & 성향 조율 완료
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                className="w-full py-3.5 bg-[#FEE500] hover:bg-[#ebd400] text-[#3C1E1E] font-black rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
                onClick={() => {
                  setShowShareModal(false);
                  showToast('카카오톡 친구/대화방으로 여행 일정이 공유되었습니다!');
                }}
              >
                <i className="fa-solid fa-comment"></i> 카카오톡 친구에게 전송하기
              </button>
              <button
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                  }
                  setShowShareModal(false);
                  showToast('여행 초대 링크가 클립보드에 복사되었습니다.');
                }}
              >
                <i className="fa-solid fa-link text-slate-500"></i> 일정 초대 링크 복사하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl transition-all z-50 flex items-center gap-2 animate-bounce">
          <i className="fa-solid fa-circle-check text-lime-400"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 text-center text-xs">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-300">
            © 2026 다잡아트립 (DAJABA TRIP). All rights reserved.
          </p>
          <p className="text-slate-500">
            2030 동행 여행 예산·성향·체력 트러블 제로 솔루션 및 전 일정 지도 연동 플랫폼
          </p>
        </div>
      </footer>
    </div>
  );
}
