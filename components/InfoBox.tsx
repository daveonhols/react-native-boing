import {Platform} from 'react-native'

import {TextPath, Skia, Line, matchFont, vec} from '@shopify/react-native-skia'

import {GameState, GameProps} from '../types/GameProps.tsx'

export function InfoBox(gameProps: GameProps) : React.JSX.Element {
    const game : GameState = gameProps.state;
    const scoreText : string = "SCORE : " + game.score;
    const timeText : string = "[" + game.time + "]";

    const fontStyle = {
      fontFamily: "Tahoma",
      fontSize: 32,
      fontWeight: "500",
    };

    const font = matchFont(fontStyle);

    const pathLeft = Skia.Path.Make();
    pathLeft.moveTo(20, 30);
    pathLeft.lineTo(280, 30);

    const pathRight = Skia.Path.Make();
    pathRight.moveTo(400, 30);
    pathRight.lineTo(500, 30);

    return (
        <>
        <TextPath path={pathLeft} text={scoreText} font={font} />
        <TextPath path={pathRight} text={timeText} font={font} />
        <Line p1={vec(10, 40)} p2={vec(480, 40)} strokeWidth={4} />
        </>
        )
}