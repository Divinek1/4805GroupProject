import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const App = () => {
    const [count, setCount] = React.useState(0);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>You clicked {count} times</Text>
            <Button title="Click me!" onPress={() => setCount(count + 1)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    text: {
        fontSize: 20,
        margin: 10,
    },
});

export default App;