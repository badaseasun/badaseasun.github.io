export interface SurveyItem {
  mbti: string;
  budget: number;
  walk: number;
}

export interface ConsensusResult {
  avgBudget: number;
  minWalk: number;
  participantCount: number;
  mbtiSpectrum: string;
  conflictRate: number;
}

export function calculateConsensus(submissions: SurveyItem[]): ConsensusResult {
  if (submissions.length === 0) {
    return {
      avgBudget: 25000,
      minWalk: 20,
      participantCount: 0,
      mbtiSpectrum: '기본 조화형',
      conflictRate: 0,
    };
  }

  const totalBudget = submissions.reduce((sum, s) => sum + s.budget, 0);
  const avgBudget = Math.round(totalBudget / submissions.length);
  const minWalk = Math.min(...submissions.map((s) => s.walk));

  // Determine MBTI harmony tag
  const mbtis = submissions.map((s) => s.mbti);
  let spectrum = '';
  if (mbtis.length === 1) {
    spectrum = `${mbtis[0]} 맞춤 솔로/동행형`;
  } else {
    spectrum = `${mbtis[0]} + ${mbtis[1] || 'ALL'} 조화형`;
  }

  return {
    avgBudget,
    minWalk,
    participantCount: submissions.length,
    mbtiSpectrum: spectrum,
    conflictRate: 0,
  };
}

export interface LadderBridge {
  yIndex: number;
  leftIndex: number; // 0 to N-2 (connects leftIndex and leftIndex + 1)
}

export function traceLadderPath(
  startPlayerIndex: number,
  playerCount: number,
  bridges: LadderBridge[]
): number {
  // Sort bridges by yIndex descending or ascending from top to bottom
  const sortedBridges = [...bridges].sort((a, b) => a.yIndex - b.yIndex);
  let currentPos = startPlayerIndex;

  for (const bridge of sortedBridges) {
    if (bridge.leftIndex === currentPos) {
      currentPos = currentPos + 1;
    } else if (bridge.leftIndex + 1 === currentPos) {
      currentPos = currentPos - 1;
    }
  }

  return currentPos;
}
