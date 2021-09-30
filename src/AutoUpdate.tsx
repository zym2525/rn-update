import React from 'react'
import UpdateDialog, { UpdateDialogRef } from './UpdateDialog'
import type UpdateUtil from './UpdateUtil'
import type { DownloadApkOptions } from './UpdateUtil'


export type AutoUpdateType = {
    updateClient: UpdateUtil
    /**
     * 开始检测
     */
    onStartCheck?: () => any
    /**
     * 检测结束
     */
    onFinishCheck?: (needUpdate: boolean) => any
} & DownloadApkOptions

const AutoUpdate = ({ updateClient, onStartCheck, onFinishCheck, ...rest }: AutoUpdateType) => {

    const updateDialogRef = React.useRef<UpdateDialogRef>(null);

    React.useEffect(() => {
        checkUpdate();
    }, [])

    const checkUpdate = React.useCallback(async () => {
        try {
            onStartCheck?.();
            let needUpdate = await updateClient.checkUpdate()
            onFinishCheck?.(needUpdate);
            if (needUpdate) {
                updateDialogRef.current?.showDialog();
            }
        } catch (error) {
            console.warn('error: ', error);
        }
    }, [])

    return (
        <UpdateDialog ref={updateDialogRef} updateClient={updateClient} {...rest} />
    )
}

export default AutoUpdate