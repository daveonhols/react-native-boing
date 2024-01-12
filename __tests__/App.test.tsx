/**
 * @format
 */

// Note: import explicitly to use the types shipped with jest.
import {test} from '@jest/globals';
import {
  initialState,
  trySpawnTarget,
  atCeiling,
  atFloor,
} from '../logic/Engine.tsx';
import {PIXEL_HEIGHT} from '../logic/Constants.tsx';

test('add up', () => {
  expect(1 + 1).toBe(2);
});

test('Target Spawn, no dual spawn', () => {
  // the game engine won't generate a target with these params so we will know if it double spawned
  const t1: Target = {pos: 0, points: 0};
  const game: GameState = initialState();
  game.target = t1;
  const result: GameState = trySpawnTarget(game);
  // a target shouldn't spawn when a target is already there
  expect(result.target.pos).toBe(0);
  expect(result.target.points).toBe(0);
});

test('Target Spawn, no spawn at floor', () => {
  const game: GameState = initialState();
  game.ball_y = PIXEL_HEIGHT; // force ball low to the floor
  game.target = undefined;
  expect(atFloor(game)).toBe(true);
  const result: GameState = trySpawnTarget(game);
  expect(result.target).toBe(undefined);
});

test('Target Spawn, check spawn', () => {
  const game: GameState = initialState();
  game.ball_y = 0; // force ball low to be high up
  game.target = undefined;
  expect(atCeiling(game)).toBe(true);
  const result: GameState = trySpawnTarget(game);
  expect(result.target).not.toBe(undefined);
});
