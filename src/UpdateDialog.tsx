import React from 'react';
import { View, } from 'react-native';
import { Button, Paragraph, Dialog, Portal, useTheme, ProgressBar, Text } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import type UpdateUtil from './UpdateUtil'
import type { DownloadApkOptions } from './UpdateUtil'


const applicationName = DeviceInfo.getApplicationName();

export type UpdateDialogType = {
    updateClient: UpdateUtil
} & DownloadApkOptions

export type UpdateDialogRef = {
    showDialog: () => any
};


const UpdateDialog = React.forwardRef<UpdateDialogRef, UpdateDialogType>(({ updateClient }, ref) => {

    React.useImperativeHandle(ref, () => ({
        showDialog: showDialog
    }))

    const theme = useTheme();

    const [visible, setVisible] = React.useState(false);

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    const [progress, setProgress] = React.useState(0);

    const [progressDialogvisible, setProgressDialogvisible] = React.useState(false);

    const showProgressDialog = () => setProgressDialogvisible(true);

    const hideProgressDialog = () => setProgressDialogvisible(false);

    async function update() {
        try {
            hideDialog();
            showProgressDialog();
            await updateClient.downloadApk({
                onProgress: (e) => {
                    setProgress(e.progress)
                }
            });
            hideProgressDialog();
            setProgress(0);
        } catch (error) {

        }
    }

    return (
        <Portal>
            <Dialog
                visible={visible}
                // dismissable={false}
                onDismiss={hideDialog}
            >
                <Dialog.Title>版本更新</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>{applicationName}有新的更新 , 请及时下载安装 . </Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        color={theme.colors.text}
                        onPress={update}
                    >
                        更新</Button>
                    <Button color={theme.colors.text} onPress={hideDialog}>取消</Button>
                </Dialog.Actions>
            </Dialog>
            <Dialog
                visible={progressDialogvisible}
                dismissable={false}
            >
                <Dialog.Title>正在下载</Dialog.Title>
                <Dialog.Content>
                    <ProgressBar style={{ height: 20 }} progress={progress} />
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Text>{(progress * 100).toFixed(0)}%</Text>
                    </View>
                </Dialog.Content>
            </Dialog>
        </Portal>
    )
})

export default UpdateDialog
