import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ComprovanteFull from '../components/ComprovanteFull';

export default function ComprovanteScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ComprovanteFull id={parseInt(id as string)} sucesso={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});