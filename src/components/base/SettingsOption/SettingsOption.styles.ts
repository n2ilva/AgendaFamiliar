import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    bordered: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    disabled: {
        opacity: 0.5,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    description: {
        fontSize: 14,
        fontWeight: '400',
        color: '#666666',
        marginTop: 2,
    },
    rightContainer: {
        marginLeft: 12,
    },
    chevron: {
        color: '#C7C7CC',
    },
});
