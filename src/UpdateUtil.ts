import RNFS, { DownloadFileOptions } from 'react-native-fs';
import { Platform, PermissionsAndroid, ToastAndroid, NativeModules } from 'react-native';

type RnUpdateType = {
    installApk: (apkPath: string) => any
}

const RnUpdate = NativeModules.RnUpdate as RnUpdateType

export type UpdateConfig = {
    /**
     * @description app下载地址
     * @supported android
     */
    appAddress: string | (() => string)
    /**
    * @description apk下载到的根目录
    */
    directoryPath: string
    /**
    * @description apk保存的name
    */
    downloadApkName: string
    /**
     * @description 检测是否需要更新的方法 返回true则需要更新
     */
    checkUpdateMethod: () => Promise<boolean>
}

export type DownloadApkOptions = Partial<UpdateConfig> & {
    onProgress?: (e: { progress: number }) => any
    appAddress?: string
}

const DirectoryPath = Platform.select({
    ios: RNFS.MainBundlePath,
    android: RNFS.ExternalStorageDirectoryPath
})

console.log('DirectoryPath: ', DirectoryPath);

class UpdateUtil {

    private config: UpdateConfig;

    constructor(config: UpdateConfig) {
        this.config = config;
    }

    checkUpdate() {
        return this.config.checkUpdateMethod();
    }

    async downloadApk({ onProgress, appAddress }: DownloadApkOptions) {
        try {
            const results = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE])
            console.log('results: ', results);
            if (Object.values(results).some(r => r !== PermissionsAndroid.RESULTS.GRANTED)) {
                ToastAndroid.showWithGravity('用户无权限', ToastAndroid.LONG, ToastAndroid.BOTTOM);
                return;
            }
            const dir = `${DirectoryPath}/${this.config.directoryPath}`;
            const toFile = `${dir}/${this.config.downloadApkName}`
            const isDirExist = await RNFS.exists(dir);
            if (!isDirExist) {
                await this.mkDir(dir);
            }
            let options: DownloadFileOptions = {
                fromUrl: appAddress || this.getAppAddress(),
                toFile: toFile,
                background: true,
                progressInterval: 100,
                begin: (res) => {
                    console.log('begin', res);
                    console.log('contentLength:', res.contentLength);
                    // onBegin && onBegin();
                },
                progress: (res) => {
                    let pro = Number((res.bytesWritten / res.contentLength).toFixed(2))
                    console.log('pro: ', pro);
                    onProgress && onProgress({ progress: pro })
                }
            }
            const ret = RNFS.downloadFile(options);
            const downloadResult = await ret.promise;
            this.installApk(`${this.config.directoryPath}/${this.config.downloadApkName}`);
            console.log('success', downloadResult);
            // await RNFS.readFileRes(toFile)
        } catch (error) {
            ToastAndroid.showWithGravity('无法下载apk', ToastAndroid.LONG, ToastAndroid.BOTTOM);
            console.log('downloadApk error: ', error);
            throw error;
        }
    }

    getAppAddress(): string {
        return typeof this.config.appAddress == 'string' ? this.config.appAddress : this.config.appAddress();
    }

    installApk(apkPath: string) {
        RnUpdate.installApk(apkPath);
    }

    /**
     * @description 创建目录
     */
    async mkDir(filepath: string) {
        const options = {
            NSURLIsExcludedFromBackupKey: true, // iOS only
        };

        return await RNFS.mkdir(filepath, options);
    }

}

export default UpdateUtil;
