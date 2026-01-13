import React, {
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  Dimensions,
} from 'react-native';
import styled from 'styled-components/native';
import { TRACKS } from '../data/tracks';

const SCREEN_WIDTH = Dimensions.get('window').width;
const LP_SIZE = 210;
const COVER_FRAME = 90;
const COVER_IMAGE = 100;

const SWIPE_THRESHOLD = 50;
const SNAP_OFFSET = (SCREEN_WIDTH + LP_SIZE) / 4;

const ROTATION_DURATION = 6000;
const TOTAL_DURATION = 30000;

type PlayerProps = {
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' + s : s}`;
};

export default function Player({ currentIndex, setCurrentIndex }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // 현재 시간 상태 추가

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const swipeX = useRef(new Animated.Value(0)).current;

  const currentRotateValue = useRef(0);

  useEffect(() => {
    const id = rotateAnim.addListener(({ value }) => {
      currentRotateValue.current = value;
    });
    return () => {
      rotateAnim.removeListener(id);
    };
  }, []);

  useEffect(() => {
    const id = progressAnim.addListener(({ value }) => {
      const currentSec = Math.floor(value * (TOTAL_DURATION / 1000));
      setCurrentTime(currentSec);
    });
    return () => {
      progressAnim.removeListener(id);
    };
  }, []);

  // 인덱스 계산
  const count = TRACKS.length;
  const prevIndex = (currentIndex - 1 + count) % count;
  const nextIndex = (currentIndex + 1) % count;

  const play = () => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: TOTAL_DURATION,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // lp 회전 (멈춘 지점부터 이어서 회전)
    const manyRotations = 10000;
    const totalDuration = manyRotations * ROTATION_DURATION;

    Animated.timing(rotateAnim, {
      toValue: currentRotateValue.current + manyRotations,
      duration: totalDuration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const pause = () => {
    progressAnim.stopAnimation();
    rotateAnim.stopAnimation();
  };

  useEffect(() => {
    if (isPlaying) play();
    else pause();
  }, [isPlaying]);

  useEffect(() => {
    rotateAnim.setValue(0);
    currentRotateValue.current = 0;
    progressAnim.setValue(0);
    swipeX.setValue(0);
    setCurrentTime(0); // 곡 변경 시 시간 0으로 초기화

    if (isPlaying) play();
    else pause();
  }, [currentIndex]);

  const centerScale = swipeX.interpolate({
    inputRange: [-SNAP_OFFSET, 0, SNAP_OFFSET],
    outputRange: [0.8, 1, 0.8],
    extrapolate: 'clamp',
  });
  const centerOpacity = swipeX.interpolate({
    inputRange: [-SNAP_OFFSET, 0, SNAP_OFFSET],
    outputRange: [0.4, 1, 0.4],
    extrapolate: 'clamp',
  });

  const leftScale = swipeX.interpolate({
    inputRange: [0, SNAP_OFFSET],
    outputRange: [0.8, 1],
    extrapolate: 'clamp',
  });
  const leftOpacity = swipeX.interpolate({
    inputRange: [0, SNAP_OFFSET],
    outputRange: [0.4, 1],
    extrapolate: 'clamp',
  });

  const rightScale = swipeX.interpolate({
    inputRange: [-SNAP_OFFSET, 0],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });
  const rightOpacity = swipeX.interpolate({
    inputRange: [-SNAP_OFFSET, 0],
    outputRange: [1, 0.4],
    extrapolate: 'clamp',
  });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) =>
      Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 10,

    onPanResponderMove: Animated.event([null, { dx: swipeX }], {
      useNativeDriver: false,
    }),

    onPanResponderRelease: (_, g) => {
      if (g.dx < -SWIPE_THRESHOLD) {
        Animated.timing(swipeX, {
          toValue: -SNAP_OFFSET,
          duration: 250,
          useNativeDriver: false,
          easing: Easing.out(Easing.quad),
        }).start(() => {
          setCurrentIndex(nextIndex);
          swipeX.setValue(0);
        });
      }
      // 이전 곡 (오른쪽 스와이프)
      else if (g.dx > SWIPE_THRESHOLD) {
        Animated.timing(swipeX, {
          toValue: SNAP_OFFSET,
          duration: 250,
          useNativeDriver: false,
          easing: Easing.out(Easing.quad),
        }).start(() => {
          setCurrentIndex(prevIndex);
          swipeX.setValue(0);
        });
      }
      // 제자리 복귀
      else {
        Animated.spring(swipeX, {
          toValue: 0,
          useNativeDriver: false,
          friction: 6,
        }).start();
      }
    },
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Wrapper>
      <LPRow {...panResponder.panHandlers}>
        <Animated.View
          style={{
            transform: [{ translateX: swipeX }, { scale: leftScale }],
            opacity: leftOpacity,
          }}>
          <Half>
            <SideLPWrapper>
              <LP source={require('../assets/image/lp.png')} />
              <CoverFrame>
                <CoverImage source={TRACKS[prevIndex].cover} />
              </CoverFrame>
            </SideLPWrapper>
          </Half>
        </Animated.View>

        <Animated.View
          style={{
            transform: [
              { translateX: swipeX },
              { rotate },
              { scale: centerScale },
            ],
            opacity: centerOpacity,
            zIndex: 10,
          }}>
          <Center>
            <LPCenterWrapper>
              <LP source={require('../assets/image/lp.png')} />
              <CoverFrame>
                <CoverImage source={TRACKS[currentIndex].cover} />
              </CoverFrame>
            </LPCenterWrapper>
          </Center>
        </Animated.View>

        <Animated.View
          style={{
            transform: [{ translateX: swipeX }, { scale: rightScale }],
            opacity: rightOpacity,
          }}>
          <Half>
            <SideLPWrapper>
              <LP source={require('../assets/image/lp.png')} />
              <CoverFrame>
                <CoverImage source={TRACKS[nextIndex].cover} />
              </CoverFrame>
            </SideLPWrapper>
          </Half>
        </Animated.View>
      </LPRow>

      <InfoWrapper>
        <Title>{TRACKS[currentIndex].title}</Title>
        <Artist>{TRACKS[currentIndex].artist}</Artist>
      </InfoWrapper>

      <ProgressSection>
        <TimeText>{formatTime(currentTime)}</TimeText>
        <ProgressBarContainer>
          <BackgroundBar />
          <ActiveBar
            style={{
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }}
          />
          <Knob
            style={{
              left: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }}
          />
        </ProgressBarContainer>
        <TimeText>0:30</TimeText>
      </ProgressSection>

      <Controls>
        <Pressable
          onPress={() => {
            Animated.timing(swipeX, {
              toValue: SNAP_OFFSET,
              duration: 250,
              useNativeDriver: false,
              easing: Easing.out(Easing.quad),
            }).start(() => {
              setCurrentIndex(prevIndex);
              swipeX.setValue(0);
            });
          }}>
          <Icon source={require('../assets/image/prev.png')} />
        </Pressable>

        <PlayBtn onPress={() => setIsPlaying(!isPlaying)}>
          <Icon
            source={
              isPlaying
                ? require('../assets/image/pause.png')
                : require('../assets/image/play.png')
            }
            style={{ width: 26, height: 26 }}
          />
        </PlayBtn>

        <Pressable
          onPress={() => {
            Animated.timing(swipeX, {
              toValue: -SNAP_OFFSET,
              duration: 250,
              useNativeDriver: false,
              easing: Easing.out(Easing.quad),
            }).start(() => {
              setCurrentIndex(nextIndex);
              swipeX.setValue(0);
            });
          }}>
          <Icon source={require('../assets/image/next.png')} />
        </Pressable>
      </Controls>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  align-items: center;
  width: 100%;
`;

const LPRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${LP_SIZE + 30}px;
  margin-top: 20px;
`;

const Center = styled.View`
  width: ${LP_SIZE}px;
  height: ${LP_SIZE}px;
  align-items: center;
  justify-content: center;
`;

const SideWidth = (SCREEN_WIDTH - LP_SIZE) / 2;

const Half = styled.View`
  width: ${SideWidth}px;
  height: ${LP_SIZE}px;
  align-items: center;
  justify-content: center;
`;

const SideLPWrapper = styled.View`
  width: ${LP_SIZE}px;
  height: ${LP_SIZE}px;
  align-items: center;
  justify-content: center;
`;

const LPCenterWrapper = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
`;

const LP = styled.Image`
  width: ${LP_SIZE}px;
  height: ${LP_SIZE}px;
`;

const CoverFrame = styled.View`
  position: absolute;
  width: ${COVER_FRAME}px;
  height: ${COVER_FRAME}px;
  border-radius: ${COVER_FRAME / 2}px;
  overflow: hidden;
`;

const CoverImage = styled.Image`
  width: ${COVER_IMAGE}px;
  height: ${COVER_IMAGE}px;
  position: absolute;
  top: -5px;
  left: -5px;
`;

const InfoWrapper = styled.View`
  margin-top: 10px;
  align-items: center;
  gap: 5px;
`;

const Title = styled.Text`
  font-weight: 700;
  color: #000;
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
`;

const Artist = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.graytxt};
  font-family: ${({ theme }) => theme.fonts.medium};
`;

const ProgressSection = styled.View`
  flex-direction: row;
  align-items: center;
  width: 85%;
  margin-top: 10px;
  gap: 10px;
`;

const TimeText = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.graytxt};
  font-family: ${({ theme }) => theme.fonts.medium};
  width: 30px;
  text-align: center;
`;

const ProgressBarContainer = styled.View`
  flex: 1;
  height: 30px;
  justify-content: center;
`;

const BackgroundBar = styled.View`
  width: 100%;
  height: 6px;
  background-color: #eee;
  border-radius: 5px;
  position: absolute;
`;

const ActiveBar = styled(Animated.View)`
  height: 6px;
  background-color: ${({ theme }) => theme.colors.point};
  border-radius: 5px;
  position: absolute;
`;

const Knob = styled(Animated.View)`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.point};
  position: absolute;
  margin-left: -6px;
`;

const Controls = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 60px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const PlayBtn = styled.Pressable``;

const Icon = styled.Image.attrs((props) => ({
  resizeMode: 'contain',
  tintColor: props.theme.colors.txt,
}))`
  width: 18px;
  height: 18px;
`;
