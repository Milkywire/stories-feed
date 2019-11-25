import React from "react";
import { StyleSheet, View } from "react-native";
import StoriesFeed from "./StoriesFeed";

const cards = [
  {
    id: 1,
    backgroundImage: require("./batman.jpg")
  },
  {
    id: 2,
    backgroundImage: require("./mcgyver.jpg")
  },
  {
    id: 3,
    backgroundImage: require("./hassellhoff.jpg")
  },
  {
    id: 4,
    backgroundImage: require("./ballmer.jpg")
  }
];

export default function App() {
  return <StoriesFeed cards={cards} />;
}
