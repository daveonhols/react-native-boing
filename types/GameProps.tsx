export type GameState = {
  score: number,
  start_time: number,
  time: number,
  ball_x: number,
  ball_y: number,
  direction: number,
  lr_state: string,
  target : Target | undefined,
  bonus : Bonus | undefined
};

export type Target = {
    pos: number, // horizontal grid position, pixel location is (4, 16+pos*32)
    points: number
}

export type Bonus = {
    pos: number, // horizontal grid position, pixel location is (4, 16+pos*32)
    points: number,
    age: number
}

export type GameProps = {
    state: GameState
};

export enum AppState {
    Playing = 1,
    Finished,
    Splash
};