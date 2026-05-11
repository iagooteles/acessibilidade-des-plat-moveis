import { useEffect,useRef } from 'react';
import {
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';

// ==================================================
// BOTÃO COM EFEITO DE PRESSÃO (SCALE)
// ==================================================

export function useScalePress() {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 10,
    }).start();
  };

  return {
    animatedStyle: {
      transform: [{ scale }],
    },

    onPressIn,
    onPressOut,
  };
}

// ==================================================
// ENTRADA SUAVE
// ==================================================

export function useFadeIn(duration = 500) {

  const opacity = useRef(
    new Animated.Value(0)
  ).current;

  const translateY = useRef(
    new Animated.Value(30)
  ).current;

  useEffect(() => {

    Animated.parallel([

      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),

      Animated.timing(translateY, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),

    ]).start();

  }, []);

  return {

    animatedStyle: {
      opacity,

      transform: [
        { translateY },
      ],
    },

  };
}

// ==================================================
// ARRASTAR CARD
// ==================================================

export function useDrag() {
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderMove: Animated.event(
      [
        null,
        {
          dx: position.x,
          dy: position.y,
        },
      ],
      {
        useNativeDriver: false,
      }
    ),

    onPanResponderRelease: () => {
      Animated.spring(position, {
        toValue: {
          x: 0,
          y: 0,
        },
        useNativeDriver: false,
      }).start();
    },
  });

  return {
    panHandlers: panResponder.panHandlers,

    animatedStyle: {
      transform: [
        {
          translateX: position.x,
        },
        {
          translateY: position.y,
        },
      ],
    },
  };
}