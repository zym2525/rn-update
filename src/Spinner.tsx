import React, { FC, ComponentProps } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ActivityIndicator, Portal } from 'react-native-paper';

type SpinnerType = {
    text?: string
    visible: boolean
} & ComponentProps<typeof ActivityIndicator>

const Spinner: FC<SpinnerType> = ({ size = 'large', text = '正在检测更新...', visible }) => {

    return (
        <Portal>
            {
                visible
                    ?
                    <View style={styles.spinner}>
                        <View style={styles.containerStyle}>
                            <ActivityIndicator color={'rgba(144, 144, 144, 1)'} size={size} />
                            {text && <Text style={styles.tipStyle}>{text}</Text>}
                        </View>
                    </View>

                    : null
            }
        </Portal>
    )
}

export default Spinner

const styles = StyleSheet.create({
    spinner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    containerStyle: {
        width: 120,
        height: 120,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, .7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipStyle: {
        marginTop: 10,
        fontSize: 14,
        color: '#fff'
    }
})
