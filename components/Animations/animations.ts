
import { Animated, Easing } from 'react-native';
export const screenSlideAnimation = (
  translateX: Animated.Value,
  direction: "left" | "right" = "right",
  duration: number = 300
) => {
  translateX.setValue(direction === "right" ? 600 : -600);

  return Animated.timing(translateX, {
    toValue: 0,
    duration,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  });
};

export const screenExitAnimation = (
  translateX: Animated.Value,
  direction: "left" | "right" = "left",
  duration: number = 250
) => {
  return Animated.timing(translateX, {
    toValue: direction === "left" ? -600 : 600,
    duration,
    easing: Easing.in(Easing.ease),
    useNativeDriver: true,
  });
};

export const screenSlideUpAnimation = (
  translateY: Animated.Value,
  duration: number = 350
) => {
  translateY.setValue(700);

  return Animated.timing(translateY, {
    toValue: 0,
    duration,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  });
};

export const fadeInAnimation = (
  opacity: Animated.Value,
  duration: number = 300
) => {
  opacity.setValue(0);

  return Animated.timing(opacity, {
    toValue: 1,
    duration,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  });
};

export const fadeOutAnimation = (
  opacity: Animated.Value,
  duration: number = 250
) => {
  return Animated.timing(opacity, {
    toValue: 0,
    duration,
    easing: Easing.in(Easing.ease),
    useNativeDriver: true,
  });
};

export const scaleInAnimation = (
  scale: Animated.Value,
  duration: number = 300
) => {
  scale.setValue(0.8);

  return Animated.spring(scale, {
    toValue: 1,
    friction: 6,
    tension: 80,
    useNativeDriver: true,
  });
};