import React, { FC } from 'react'
import { View, ViewStyle, StyleProp } from 'react-native';
import type { AutoUpdateType } from './AutoUpdate'
import UpdateDialog, { UpdateDialogRef } from './UpdateDialog'
import Spinner from './Spinner'

export type ManualUpdateType = {
    style?: StyleProp<ViewStyle>
    /**
     * @description checkUpdate为更新函数 action不传则会自动调用检测更新
     */
    action?: (checkUpdate: (showTip?: boolean) => any) => React.ReactNode
    /**
     * 是否需要自动调用检测更新
     */
    auto?: boolean
} & AutoUpdateType

const ManualUpdate: FC<ManualUpdateType> = ({ action, updateClient, style, auto = false, onStartCheck, onFinishCheck, ...rest }) => {
    const updateDialogRef = React.useRef<UpdateDialogRef>(null);

    const [tipVisible, setTipVisible] = React.useState(false);

    const isAuto = auto || !action;

    React.useEffect(() => {
        if (isAuto) {
            checkUpdate(false);
        }
    }, [])

    const checkUpdate = React.useCallback(async (showTip = true) => {
        try {
            onStartCheck?.();
            if (showTip) setTipVisible(true);
            let needUpdate = await updateClient.checkUpdate();
            if (showTip) setTipVisible(false);
            onFinishCheck?.(needUpdate);
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
            <Spinner visible={tipVisible} />
        </View>

    )
}

export default ManualUpdate

