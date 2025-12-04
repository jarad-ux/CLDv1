// Placeholder screen - implement as needed
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WindowsDoorsScreen = ({ navigation }: any) => {
  const nextScreens: any = {
    ComfortConcernsScreen: 'HVACSystem',
    HVACSystemScreen: 'WaterHeater',
    WaterHeaterScreen: 'InsulationEnvelope',
    InsulationEnvelopeScreen: 'WindowsDoors',
    WindowsDoorsScreen: 'DuctSystem',
    DuctSystemScreen: 'RoomByRoom',
    RoomByRoomScreen: 'Photos',
    RecommendationsScreen: 'Rebates',
    RebatesScreen: 'Signatures',
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>WindowsDoors</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate(nextScreens['WindowsDoorsScreen'])}>
        <Text style={styles.btnText}>Next Step</Text>
        <Icon name="arrow-forward" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 30 },
  btn: { backgroundColor: '#0066CC', padding: 18, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
});

export default WindowsDoorsScreen;
