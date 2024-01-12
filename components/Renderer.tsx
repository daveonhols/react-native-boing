import React from 'react';
import {Circle, Rect, RoundedRect, Line, vec} from '@shopify/react-native-skia';
import {GameState, GameProps} from '../types/GameProps.tsx';
import {
  PIXEL_WIDTH,
  BALL_SIZE,
  LHS_POST_X,
  RHS_POST_X,
  POST_Y,
  POST_WIDTH,
  POST_HEIGHT,
} from '../logic/Constants.tsx';

const ball_size: number = BALL_SIZE;

export function Renderer(gameProps: GameProps) {
  const game: GameState = gameProps.state;

  let line_break_x = game.ball_x;
  let line_break_y = game.ball_y > 240 ? game.ball_y + 28 : 260;
  return (
    <>
      <Circle cx={game.ball_x} cy={game.ball_y} r={ball_size} color={'red'} />
      <Rect x={LHS_POST_X} y={POST_Y} width={POST_WIDTH} height={POST_HEIGHT} />
      <Rect x={RHS_POST_X} y={POST_Y} width={POST_WIDTH} height={POST_HEIGHT} />
      <Line
        p1={vec(10, 260)}
        p2={vec(line_break_x, line_break_y)}
        strokeWidth={4}
      />
      <Line
        p1={vec(line_break_x, line_break_y)}
        p2={vec(480, 260)}
        strokeWidth={4}
      />
      <RoundedRect
        x={16 + (game.target === undefined ? -100 : game.target.pos * 32)}
        y={300 - 20}
        r={8}
        width={32}
        height={18}
        color="gold"
      />
      <RoundedRect
        x={16 + (game.bonus === undefined ? -100 : game.bonus.pos * 32)}
        y={300 - 22}
        r={8}
        width={32}
        height={22}
        color="orange"
      />
      <Rect
        x={0}
        y={0}
        width={PIXEL_WIDTH}
        height={game.dying ? game.death_counter : 0}
        color={'red'}
      />
    </>
  );
}
