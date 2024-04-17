import React, {useCallback, useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {debounce} from 'lodash';

const audioRecorderPlayer = new AudioRecorderPlayer();

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // ========= life-cycle hooks =========
  useEffect(() => {
    audioRecorderPlayer.addRecordBackListener((e) => {});
    audioRecorderPlayer.addPlayBackListener(playBackListener);
    return () => {
      audioRecorderPlayer.removeRecordBackListener();
      audioRecorderPlayer.removePlayBackListener();
    }
  }, []);


    // ========= 이벤트 핸들러 =========
  const playBackListener = useCallback((e) => {
    if (Math.abs(e.currentPosition - e.duration) < 500) {
      audioRecorderPlayer.stopPlayer().then(() => {
        console.log("[재생 완료]");
        setIsPlaying(false);
        audioRecorderPlayer.removePlayBackListener()
      }).catch((error) => {
        console.error("재생 중지 실패:", error);
        Alert.alert("재생을 중지할 수 없습니다.", error.message);
      });
    }
  }, []);

// ================= 녹음 시작 ====================
  const onStartRecord = async () => {
    setIsRecording(true);

    try {
      const result = await audioRecorderPlayer.startRecorder();  // 오디오 녹음 시작
      console.log("[녹음 시작] 경로 : " + result);
      setHasRecorded(false);
    } catch (error) {
      console.error("녹음 시작 실패:", error);
      Alert.alert("녹음을 시작할 수 없습니다.", error.message);
      setIsRecording(false);
    }
  };
// ================= 저장 ====================
  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      console.log("[녹음 완료] 경로 : " + result);
      setIsRecording(false);
      setHasRecorded(true);
    } catch (error) {
      console.error("녹음 중지 실패:", error);
      Alert.alert("녹음을 중지할 수 없습니다.", error.message);
    }
  };
// ================= 재생 ====================
  const onStartPlay = async () => {
    setIsPlaying(true);

    try {
      await audioRecorderPlayer.startPlayer();
      audioRecorderPlayer.addPlayBackListener(playBackListener);
    } catch (error) {
      console.error("재생 시작 실패:", error);
      Alert.alert("재생할 수 없습니다.", error.message);
      setIsPlaying(false);
    }
  };

  const debouncedStopAndPlay = debounce(async () => {
    await onStopRecord();
    await onStartPlay();
  }, 400);  // 300ms 디바운스


// ================= 렌더링 ====================
  return (
      <View style={styles.container}>
        <TouchableOpacity
            disabled={isRecording || isPlaying}
            style={isRecording ? styles.buttonRecording : isPlaying ? styles.buttonPlaying : styles.button}
            onPressIn={onStartRecord}
            onPressOut={debouncedStopAndPlay}
        >
          <Text style={styles.btnText}>{isRecording ? 'Recording' : isPlaying ? 'Playing' : 'Record'}</Text>
        </TouchableOpacity>

      </View>

  );
};

// ================= 스타일 ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText:{
    fontSize: 30,
    color: 'white',
  },
  button: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(221,221,221)',
    borderRadius: 100,
  },
  buttonRecording: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,68,68,0.62)',
    borderRadius: 100,
  },
  buttonPlaying: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(16,169,0,0.38)',
    borderRadius: 100,
  }
});

export default App;
