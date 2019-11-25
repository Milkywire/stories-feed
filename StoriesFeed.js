import React, { useState, useRef, useEffect } from "react";
import { Dimensions, StyleSheet, Image, Animated } from "react-native";
import { State, PanGestureHandler } from "react-native-gesture-handler";

const WIDTH = Dimensions.get("window").width;

export default function StoriesFeed({ cards }) {
  const { current: gestureValue } = useRef(new Animated.Value(0));
  const [activeIndex, setActiveIndex] = useState(0);

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: gestureValue } }],
    { useNativeEvent: true }
  );

  const handleGestureState = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      snap(gestureValue, nativeEvent, setActiveIndex);
    }
  };

  const getBucketAnimation = index => {
    if (isCenterCard(index, activeIndex))
      return centerAnimationStyle(gestureValue);
    if (isRightCard(index, activeIndex))
      return rightAnimationStyle(gestureValue);
    if (isLeftCard(index, activeIndex)) return leftAnimationStyle(gestureValue);
    return { transform: [{ translateX: WIDTH }] };
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleGestureState}
    >
      <Animated.View style={{ backgroundColor: "#111", flex: 1 }}>
        {cards.map((card, index) => (
          <Animated.View
            key={card.id}
            style={[StyleSheet.absoluteFill, getBucketAnimation(index)]}
          >
            <Card card={card} />
          </Animated.View>
        ))}
      </Animated.View>
    </PanGestureHandler>
  );
}

function snap(gestureValue, { translationX, velocityX }, setActiveIndex) {
  if (translationX < -WIDTH / 2 || velocityX < -500) {
    Animated.spring(gestureValue, {
      toValue: -WIDTH,
      velocity: velocityX,
      useNativeDriver: true
    }).start(() => {
      setActiveIndex(index => index + 1);
      gestureValue.setValue(0);
    });
  } else if (translationX > WIDTH / 2 || velocityX > 500) {
    Animated.spring(gestureValue, {
      toValue: WIDTH,
      velocity: velocityX,
      useNativeDriver: true
    }).start(() => {
      setActiveIndex(index => index - 1);
      gestureValue.setValue(0);
    });
  } else {
    Animated.spring(gestureValue, {
      toValue: 0,
      velocity: velocityX,
      useNativeDriver: true
    }).start();
  }
}

function isCenterCard(index, activeIndex) {
  return index === activeIndex;
}

function isRightCard(index, activeIndex) {
  return index === activeIndex + 1;
}

function isLeftCard(index, activeIndex) {
  return index === activeIndex - 1;
}

function centerAnimationStyle(gestureValue) {
  return {
    transform: [
      {
        translateX: gestureValue.interpolate({
          inputRange: [0, WIDTH],
          outputRange: [0, WIDTH]
        })
      },
      {
        translateX: gestureValue.interpolate({
          inputRange: [-1, 0, 0, 1],
          outputRange: [WIDTH / 2, WIDTH / 2, -WIDTH / 2, -WIDTH / 2],
          extrapolate: "clamp"
        })
      },
      { perspective: 700 },
      {
        rotateY: gestureValue.interpolate({
          inputRange: [0, WIDTH],
          outputRange: ["0deg", "45deg"]
        })
      },
      {
        translateX: gestureValue.interpolate({
          inputRange: [-1, 0, 0, 1],
          outputRange: [-WIDTH / 2, -WIDTH / 2, WIDTH / 2, WIDTH / 2],
          extrapolate: "clamp"
        })
      }
    ]
  };
}

function rightAnimationStyle(gestureValue) {
  return {
    transform: [
      {
        translateX: gestureValue.interpolate({
          inputRange: [0, WIDTH],
          outputRange: [WIDTH, WIDTH * 2]
        })
      },
      { translateX: -WIDTH / 2 },
      { perspective: 700 },
      {
        rotateY: gestureValue.interpolate({
          inputRange: [0, WIDTH],
          outputRange: ["45deg", "90deg"]
        })
      },
      { translateX: WIDTH / 2 }
    ]
  };
}

function leftAnimationStyle(gestureValue) {
  return {
    transform: [
      {
        translateX: gestureValue.interpolate({
          inputRange: [0, WIDTH],
          outputRange: [-WIDTH, 0]
        })
      },
      { translateX: WIDTH / 2 },
      { perspective: 700 },
      {
        rotateY: gestureValue.interpolate({
          inputRange: [0, WIDTH],
          outputRange: ["-45deg", "0deg"]
        })
      },
      { translateX: -WIDTH / 2 }
    ]
  };
}

function Card({ card }) {
  return (
    <Image
      source={card.backgroundImage}
      style={{ flex: 1, width: "100%" }}
      resizeMode="cover"
    />
  );
}
