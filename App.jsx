import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const onStartRecord = async () => {
    if (isRecording) return;
    setIsRecording(true);
    try {
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        return;
      });
      console.log(result);
      setHasRecorded(false);  // 녹음 시작 시 hasRecorded를 초기화
    } catch (error) {
      console.error("녹음 시작 실패:", error);
      Alert.alert("녹음 시작 실패", error.message);
      setIsRecording(false);
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setHasRecorded(true);
      console.log(result);  // 녹음 파일 경로 확인
      setTimeout(() => onStartPlay(), 100); // 상태 업데이트 후 잠시 대기하고 재생 시작
    } catch (error) {
      console.error("녹음 중지 실패:", error);
      Alert.alert("녹음 중지 실패", error.message);
      setIsRecording(false);
    }
  };

  const onStartPlay = async () => {
    // if (!hasRecorded) return;

    try {
      const msg = await audioRecorderPlayer.startPlayer();
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition === e.duration) {
          audioRecorderPlayer.stopPlayer();
          audioRecorderPlayer.removePlayBackListener(); // 리스너 제거
        }
      });
      console.log(msg);
    } catch (error) {
      console.error("재생 시작 실패:", error);
      Alert.alert("재생 시작 실패", error.message);
    }
  };


  return (
      <View style={styles.container}>
        <TouchableOpacity
            disabled={isRecording}
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
