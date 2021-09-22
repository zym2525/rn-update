import React, { FC } from 'react'
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import type { AutoUpdateType } from './AutoUpdate'
import UpdateDialog, { UpdateDialogRef } from './UpdateDialog'

export type ManualUpdateType = {
    style?: StyleProp<ViewStyle>
    /**
     * @description checkUpdate为更新函数 action不传则会自动调用检测更新
     */
    action?: (checkUpdate: () => any) => React.ReactNode
    /**
     * 是否需要自动调用检测更新
     */
    auto?: boolean
} & AutoUpdateType

const ManualUpdate: FC<ManualUpdateType> = ({ action, updateClient, style, auto = false, onStartCheck, onFinishCheck, ...rest }) => {
    const updateDialogRef = React.useRef<UpdateDialogRef>(null);

    React.useEffect(() => {
        if (auto || !action) {
            checkUpdate();
        }
    }, [])

    const checkUpdate = React.useCallback(async () => {
        try {
            onStartCheck?.();
            let needUpdate = await updateClient.checkUpdate()
            onFinishCheck?.();
            if (needUpdate) {
                updateDialogRef.current?.showDialog();
            }
        } catch (error) {
            console.warn('error: ', error);
        }
    }, [])

    return (
        <View collapsable={false} style={style}>
            {
                action && action(checkUpdate)
            }
            <UpdateDialog ref={updateDialogRef} updateClient={updateClient} {...rest} />
        </View>

    )
}

export default ManualUpdate

