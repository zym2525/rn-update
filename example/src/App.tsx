import * as React from 'react';

import { StyleSheet, View, Linking, ToastAndroid, NativeModules } from 'react-native';
import { UpdateUtil, AutoUpdate, UpdateDialog, UpdateDialogRef, ManualUpdate } from 'rn-update';
import { Button, Paragraph, Dialog, Portal, Provider, useTheme, ProgressBar, Text } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';

function getVersion() {
  return new Promise<number>((resolve, reject) => {
    setTimeout(() => {
      resolve(10)
    }, 2000)
  })
}
console.log('NativeModules: ', NativeModules.RnUpdate);
const RnUpdateClient = new UpdateUtil({
  appAddress: 'http://oss.huijiaoketang.com/s/app_99.apk',
  directoryPath: 'aihui222',
  downloadApkName: 'huijiaoapp.apk',
  checkUpdateMethod: async () => {
    try {
      let targetVersion = await getVersion();
      let currentVersion = DeviceInfo.getBuildNumber()
      let needUpdate = Number(currentVersion) < targetVersion;
      if (!needUpdate) {
        ToastAndroid.showWithGravity('不需要更新', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
      return needUpdate;
    } catch (error) {
      return false;
      // throw error
    }
  }
})

export default function App() {

  return (
    <Provider>
      <View style={styles.container}>
        <ManualUpdate
          auto
          updateClient={RnUpdateClient}
          action={(checkUpdate) => <Button mode="contained" onPress={checkUpdate}>更新</Button>}
        />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
