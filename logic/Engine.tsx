
import {GameState, Target, Bonus} from '../types/GameProps.tsx'
import {BONUS_SPAWN_CHANCE, ROUNDS, VERTICAL_MOVE_SIZE, BONUS_LIFE, NUM_BLOCKS, FLOOR_CLEARANCE, BLOCK_WIDTH, POST_WIDTH, PIXEL_HEIGHT, CEILING_CLEARANCE, HIT_WIDTH_SIZE, MIN_COLLECT_HEIGHT, BALL_SIZE, PIXEL_WIDTH, HORIZONTAL_STEP_PIXELS} from './Constants.tsx'

// does a ball at pixels x, y hit a block at grid position p
function hit(ball_x: number, ball_y: number, target_grid_pos: number) : boolean {
    if(ball_x < PIXEL_HEIGHT - MIN_COLLECT_HEIGHT) { // cannot hit from above this height
        return false;
    }
    // find horizontal middle of block
    // origin + width of a post + ()number of blocks * width of block) + half block width (to middle)
    const block_y = POST_WIDTH+(BLOCK_WIDTH/2)+BLOCK_WIDTH*target_grid_pos;
    const result : boolean = Math.abs(ball_y - block_y) < HIT_WIDTH_SIZE;
    return result;
}

export function atFloor(state : GameState) : boolean {
    return state.ball_y > PIXEL_HEIGHT - FLOOR_CLEARANCE;
}

export function bounceDown(state : GameState) : GameState {
    return {
        start_time : state.start_time,
        time: state.time - 1,
        score : state.score,
        ball_x :  state.ball_x,
        ball_y : state.ball_y,
        direction : 1,
        lr_state : state.lr_state,
        target: state.target,
        bonus: state.bonus,
    }
}

export function bounceUp(state : GameState) : GameState {
    return {
        start_time : state.start_time,
        time: state.time,
        score : state.score,
        ball_x :  state.ball_x,
        ball_y : state.ball_y,
        direction : -1,
        lr_state : state.lr_state,
        target: state.target,
        bonus: state.bonus,
    }
}

export function atCeiling(state : GameState) : boolean {
    return state.ball_y < (0 + CEILING_CLEARANCE);
}

export function moveVertical(state : GameState) : GameState {
    return {
        start_time : state.start_time,
        time: state.time,
        score : state.score,
        ball_y :  state.ball_y + state.direction * VERTICAL_MOVE_SIZE,
        ball_x : state.ball_x,
        direction : state.direction,
        lr_state : state.lr_state,
        target: state.target,
        bonus: state.bonus,
    }
}

export function moveHorizontal(state : GameState) : GameState {
    let new_ball_x : number = state.ball_x;
    if (state.lr_state == "left") {
        new_ball_x = state.ball_x - HORIZONTAL_STEP_PIXELS;
    }

    if (state.lr_state == "right") {
        new_ball_x = state.ball_x + HORIZONTAL_STEP_PIXELS;
    }

    if(new_ball_x < BALL_SIZE || new_ball_x > PIXEL_WIDTH-BALL_SIZE) {
        new_ball_x = state.ball_x
    }

    return {
        start_time : state.start_time,
        time: state.time,
        score : state.score,
        ball_y :  state.ball_y,
        ball_x : new_ball_x,
        direction : state.direction,
        lr_state : state.lr_state,
        target: state.target,
        bonus: state.bonus,
    }
}

export function hasBonus(state : GameState) : boolean {
    return state.bonus !== undefined
}

export function checkHitTarget(state : GameState) : GameState {
    if(state.target === undefined) {
        return state;
    }
    if(hit(state.ball_y, state.ball_x, state.target.pos)) {
        return {
            start_time : state.start_time,
            time: state.time,
            score : state.score + state.target.points,
            ball_x :  state.ball_x,
            ball_y : state.ball_y,
            direction : state.direction,
            lr_state : state.lr_state,
            target: undefined,
            bonus: state.bonus,
        }
    } else {
        return state;
    }
}

export function checkHitBonus(state : GameState) : GameState {
    if(state.bonus === undefined) {
        return state;
    }
    if(hit(state.ball_y, state.ball_x, state.bonus.pos)) {
        return {
            start_time : state.start_time,
            time: state.time,
            score : state.score + state.bonus.points,
            ball_x :  state.ball_x,
            ball_y : state.ball_y,
            direction : state.direction,
            lr_state : state.lr_state,
            target: state.target,
            bonus: undefined,
        }
    } else {
        return state;
    }
}

export function ageBonus(state : GameState) : GameState {
    const newBonus : Bonus | undefined =
        (state.bonus === undefined || state.bonus.age == 1)
        ? undefined
        : { pos: state.bonus.pos, points: state.bonus.points, age: state.bonus.age - 1 };
    return {
        start_time : state.start_time,
        time: state.time,
        score : state.score,
        ball_x :  state.ball_x,
        ball_y : state.ball_y,
        direction : state.direction,
        lr_state : state.lr_state,
        target: state.target,
        bonus: newBonus,
    }
}

export function trySpawnTarget(state : GameState) : GameState {
    let newTarget : Target | undefined = state.target;
    if(state.ball_y < (PIXEL_HEIGHT - 2*FLOOR_CLEARANCE) && state.target === undefined) {
        let newTargetPos = Math.floor(Math.random() * (NUM_BLOCKS - 1))
        if(state.bonus !== undefined ) {
            while (newTargetPos == state.bonus.pos) {
                newTargetPos = Math.floor(Math.random() * (NUM_BLOCKS - 1))
            }
        }
        newTarget = { pos: newTargetPos, points: 200 }
    }
    return {
        start_time : state.start_time,
        time: state.time,
        score : state.score,
        ball_x :  state.ball_x,
        ball_y : state.ball_y,
        direction : state.direction,
        lr_state : state.lr_state,
        target: newTarget,
        bonus: state.bonus,
    }
}

export function trySpawnBonus(state : GameState) : GameState {
    let newBonus : Bonus | undefined = undefined;
    if(Math.random() < BONUS_SPAWN_CHANCE) {
        if(state.target !== undefined) {
            let newBonusPos = Math.floor(Math.random() * (NUM_BLOCKS - 1));
            while(newBonusPos == state.target.pos) {
                newBonusPos = Math.floor(Math.random() * (NUM_BLOCKS - 1));
            }
            newBonus = {pos : newBonusPos, points: 500, age: BONUS_LIFE };
        }
    }

    return {
        start_time : state.start_time,
        time: state.time,
        score : state.score,
        ball_x :  state.ball_x,
        ball_y : state.ball_y,
        direction : state.direction,
        lr_state : state.lr_state,
        target: state.target,
        bonus: newBonus,
    }
}

export function setHorizontalDirection(direction: string, state : GameState) {
    return {
        start_time : state.start_time,
        time: state.time,
        score : state.score,
        ball_x : state.ball_x,
        ball_y : state.ball_y,
        direction : state.direction,
        lr_state : direction,
        target: state.target,
        bonus: state.bonus,
    }
}

export function initialState() : GameState {
     return {
        start_time : new Date().getTime(), // millis since epoch
        time: ROUNDS,
        score : 0,
        ball_x: 240,
        ball_y: 60,
        direction: 1,
        lr_state: "none",
        target : {
            pos: 7,
            points: 200
        },
        bonus: undefined
    };
}
