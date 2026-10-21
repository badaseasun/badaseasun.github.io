import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateConsensus, traceLadderPath } from './arbitration.ts';

test('calculateConsensus calculates average budget and minimum walk time', () => {
  const result = calculateConsensus([
    { mbti: 'ENFP', budget: 20000, walk: 15 },
    { mbti: 'ISTJ', budget: 30000, walk: 25 },
  ]);

  assert.equal(result.avgBudget, 25000);
  assert.equal(result.minWalk, 15);
  assert.equal(result.participantCount, 2);
  assert.equal(result.conflictRate, 0);
  assert.match(result.mbtiSpectrum, /ENFP \+ ISTJ/);
});

test('calculateConsensus handles empty submissions gracefully', () => {
  const result = calculateConsensus([]);
  assert.equal(result.participantCount, 0);
  assert.equal(result.avgBudget, 25000);
  assert.equal(result.minWalk, 20);
});

test('traceLadderPath accurately follows horizontal ladder steps', () => {
  // 4 columns: 0, 1, 2, 3
  // Step 1: bridge connecting 0-1 at y=1
  // Step 2: bridge connecting 1-2 at y=2
  // Player at 0 goes to 1 at y=1, then from 1 goes to 2 at y=2. End position should be 2.
  const bridges = [
    { yIndex: 1, leftIndex: 0 },
    { yIndex: 2, leftIndex: 1 },
  ];

  const target = traceLadderPath(0, 4, bridges);
  assert.equal(target, 2);

  // Player at 2 goes to 1 at y=2. End position should be 1.
  const targetFrom2 = traceLadderPath(2, 4, bridges);
  assert.equal(targetFrom2, 1);

  // Player at 3 has no bridges, stays at 3
  const targetFrom3 = traceLadderPath(3, 4, bridges);
  assert.equal(targetFrom3, 3);
});
