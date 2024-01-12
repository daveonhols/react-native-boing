/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {MutableRefObject} from 'react';
import {View, Text, StyleSheet, Button, Pressable} from 'react-native';
import {Canvas} from '@shopify/react-native-skia';

import {Renderer} from './components/Renderer.tsx';
import {InfoBox} from './components/InfoBox.tsx';
import {AppState, GameState} from './types/GameProps.tsx';
import {
  updateDeathCounter,
  checkDead,
  moveVertical,
  initialState,
  setHorizontalDirection,
  moveHorizontal,
  atCeiling,
  atFloor,
  bounceDown,
  bounceUp,
  hasBonus,
  trySpawnBonus,
  ageBonus,
  checkHitBonus,
  checkHitTarget,
  trySpawnTarget,
} from './logic/Engine.tsx';

let appState: AppState = AppState.Splash;

function tick(refGame: MutableRefObject<GameState>, renderGame: Function) {
  if (appState === AppState.Finished) {
    return;
  }
  let nextState: GameState = refGame.current;
  if (appState === AppState.Restarting) {
    nextState = initialState();
    appState = AppState.Playing;
  }
  nextState = checkDead(nextState);
  const dead: boolean = nextState.dying;
  if (dead) {
    nextState = updateDeathCounter(nextState);
    if (nextState.death_counter > 400) {
      appState = AppState.Finished;
    }
  }

  if (!dead) {
    nextState = moveVertical(nextState);
    nextState = moveHorizontal(nextState);
    if (atCeiling(nextState)) {
      if (nextState.time === 0) {
        appState = AppState.Finished;
      }
      nextState = bounceDown(nextState);
      if (!hasBonus(nextState)) {
        nextState = trySpawnBonus(nextState);
      } else {
        nextState = ageBonus(nextState);
      }
    }
    if (atFloor(nextState)) {
      nextState = bounceUp(nextState);
      nextState = checkHitTarget(nextState);
      nextState = checkHitBonus(nextState);
    }
    nextState = trySpawnTarget(nextState);
  }
  refGame.current = nextState;
  renderGame(nextState);
}

function onPlaying(refGame: MutableRefObject<GameState>): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.top}
        onPressIn={() =>
          (refGame.current = setHorizontalDirection('left', refGame.current))
        }
        onPressOut={() =>
          (refGame.current = setHorizontalDirection('none', refGame.current))
        }
      />
      <View style={styles.gamecol}>
        <Canvas style={styles.info}>
          <InfoBox state={refGame.current} />
        </Canvas>
        <Canvas style={styles.middle}>
          <Renderer state={refGame.current} />
        </Canvas>
      </View>
      <Pressable
        style={styles.bottom}
        onPressIn={() =>
          (refGame.current = setHorizontalDirection('right', refGame.current))
        }
        onPressOut={() =>
          (refGame.current = setHorizontalDirection('none', refGame.current))
        }
      />
    </View>
  );
}

function onFinished(state: GameState): React.JSX.Element {
  const msg: string =
    'You scored ' +
    state.score +
    (state.score < 8000 || state.dying ? '.' : ', well done!');
  const title: string = state.dying ? 'DEAD' : 'FINISHED';
  return (
    <View style={styles.container2}>
      <Text style={styles.dialoghead}> {title}</Text>
      <Text style={styles.dialogbody}>{msg}</Text>
      <View style={styles.buttonrow}>
        <View style={styles.buttonx}>
          <Button
            title="Play"
            onPress={() => (appState = AppState.Restarting)}
          />
        </View>
        <View style={styles.buttonx}>
          <Button title="Menu" />
        </View>
      </View>
    </View>
  );
}

function onSplash(): React.JSX.Element {
  return (
    <View style={styles.container2}>
      <Text style={styles.dialoghead}>B O I N G</Text>
      <Text style={styles.dialogbody}>Enjoy Bouncing</Text>
      <View style={styles.buttonrow}>
        <View style={styles.buttonx}>
          <Button
            title="Play"
            onPress={() => (appState = AppState.Restarting)}
          />
        </View>
        <View style={styles.buttonx}>
          <Button title="Menu" />
        </View>
      </View>
    </View>
  );
}

function App(): React.JSX.Element {
  let [game, renderGame] = React.useState(initialState());
  let refGame: MutableRefObject<GameState> = React.useRef(game);
  let [renderState, updateRenderState] = React.useState(appState);

  React.useEffect(() => {
    const interval = setInterval(() => {
      tick(refGame, renderGame);
    }, 28); //28

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (renderState !== appState) {
    renderState = appState;
    if (renderState === AppState.Restarting) {
      refGame.current = initialState();
    }
    updateRenderState(renderState);
  }
  if (renderState === AppState.Playing) {
    return onPlaying(refGame);
  }
  if (renderState === AppState.Finished) {
    return onFinished(refGame.current);
  }
  if (renderState === AppState.Splash) {
    return onSplash(refGame.current);
  }
  return (
    <View>
      <Text>UNDEFINED</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 0,
    margin: 10,
  },
  dialoghead: {
    fontSize: 60,
  },
  dialogbody: {
    fontSize: 40,
  },
  container2: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gamecol: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonrow: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonx: {
    flex: 0.2,
    padding: 10,
  },
  top: {
    flex: 0.4,
    backgroundColor: 'grey',
    borderWidth: 5,
    borderTopLeftRadius: 60,
    borderBottomLeftRadius: 60,
  },
  middle: {
    height: 300,
    width: 480,
    marginBottom: 10,
  },
  info: {
    height: 40,
    width: 480,
  },
  bottom: {
    flex: 0.4,
    backgroundColor: 'grey',
    borderWidth: 5,
    borderTopRightRadius: 60,
    borderBottomRightRadius: 60,
  },
});

export default App;
