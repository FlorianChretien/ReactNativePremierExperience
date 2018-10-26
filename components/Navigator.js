import React, {Component, PureComponent} from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import { Button, AsyncStorage, StyleSheet, Text, TextInput, View, FlatList, Dimensions } from 'react-native';
import moment from 'moment';

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
        latitude: null,
        longitude: null,
        error: ''
    };

    componentDidMount(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );

        //pour reset
        /*AsyncStorage.removeItem('toto').then(() => {
            alert('local storage vide');
        });*/
    }

    _storeData = async () => {
        try {
            await AsyncStorage.getItem('toto', (err, result) => {
                let items = JSON.parse(result);
                let id = 0;

                if(result === null){
                    id = 1;
                    items = [];
                } else {
                    id = items.length+1;
                }

                const message = {
                    'id': id,
                    'text': this.state.text,
                    'latitude': this.state.latitude,
                    'longitude': this.state.longitude,
                    'datecreat': moment().format("YYYYMMDD")
            };
                items.push(message);
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

    refresh = () => {
        AsyncStorage.getItem('toto', (err, result) => {
            this.setState({listHistoric: JSON.parse(result)});
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
    state = {
        fromNow: ''
    };

    componentDidMount(){
        console.log(this.props.content.datecreat);
        this.setState({fromNow: moment(this.props.content.datecreat, "YYYYMMDD").fromNow()});
    }

    render() {
        const { content } = this.props;
        const { fromNow } = this.state;

        return (
            <View style={styles.container}>
                <Text>{fromNow && fromNow}</Text>
                <Text>User {content.id} : {content.text}</Text>
                <Text>Position : {content.latitude}, {content.longitude}</Text>
            </View>
        );
    }
}

export default Navigator = createBottomTabNavigator({
    New: NewSharing,
    Historic: ListHistoric,
})