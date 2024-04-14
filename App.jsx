import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const onStartRecord = async () => {
    setIsRecording(true);
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      return;
    });
    console.log(result);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);
    setHasRecorded(true);
    console.log(result);
  };

  const onStartPlay = async () => {
    if (!hasRecorded) return;

    const msg = await audioRecorderPlayer.startPlayer();
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.currentPosition === e.duration) {
        audioRecorderPlayer.stopPlayer();
      }
    });
    console.log(msg);
  };

  return (
      <View style={styles.container}>
        <TouchableOpacity
            style={isRecording ? styles.buttonRecording : styles.button}
            onPressIn={onStartRecord}
            onPressOut={() => {
              onStopRecord().then(onStartPlay);
            }}
        >
          <Text>{isRecording ? '녹음 중...' : '버튼을 눌러서 녹음 시작'}</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    borderRadius: 100,
  },
  buttonRecording: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF4444',
    borderRadius: 100,
  },
});

export default App;
