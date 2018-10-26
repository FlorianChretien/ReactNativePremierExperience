import React, {Component, PureComponent} from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import { Button, AsyncStorage, StyleSheet, Text, TextInput, View, FlatList, Dimensions } from 'react-native';

const { width: vw } = Dimensions.get('window');
const CARD_MARGIN = 15;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: CARD_MARGIN,
        borderColor: '#ecf0f1',
        borderWidth: 1,
        borderRadius: CARD_MARGIN,
        padding: 10,
        marginTop: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: vw - (CARD_MARGIN * 2),
        height: 680
    }
});

class NewSharing extends Component {
    state = {
        text: '',
        coords: []
    };

    //pour reset
    /*componentDidMount(){
        AsyncStorage.removeItem('toto').then(() => {
            alert('fdkls');
        });
    }*/

    _storeData = async () => {
        try {
            await AsyncStorage.getItem('toto', itemExistant => {
                let items = JSON.parse(itemExistant);
                items.push({
                    'text': this.state.text
                });
                AsyncStorage.setItem('toto', JSON.stringify(items));
            });
        } catch (error) {
            // Error saving data
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    multiline = {true}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                />
                <Button
                    title={"Save"}
                    onPress={this._storeData}
                />
            </View>
        );
    }
}

class ListHistoric extends Component {
    state = {
        listHistoric: {}
    };

    componentDidMount() {
        AsyncStorage.getItem('toto', (err, result) => {
            this.setState({listHistoric: result});
        });
    }

    refresh(){
        AsyncStorage.getItem('toto', (err, result) => {
            this.setState({listHistoric: result});
        });
    }

    _renderItems = ({ item }) => {
        return <UserInHistoric content={item} />;
    };

    render() {
        const { listHistoric } = this.state;
        return (
            <View style={styles.container}>
                <Button
                    title={'Refresh'}
                    onPress={this.refresh}
                />
                <FlatList
                    data={listHistoric}
                    renderItem={this._renderItems}
                />
            </View>
        );
    }
}

class UserInHistoric extends Component {
    render() {
        const { content } = this.props;
        return (
            <View style={styles.container}>
                <Text>{content}</Text>
            </View>
        );
    }
}

export default Navigator = ({
    New: NewSharing,
    Historic: ListHistoric,
})