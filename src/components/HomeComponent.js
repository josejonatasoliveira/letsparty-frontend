import { Header, Left, Icon, Input, Container, Button, Right, Spinner } from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';
import EventComponent from './event/EventComponent';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import BackService from '../services/api';

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: "",
            events: [],
            loading: false
        }
    };

    handleQueryChange = (query) => {
        this.setState({ query });
    }

    searchByQuery = () => {
        this.setState({ loading: true })
        BackService.get(`search/?q=${this.state.query}`)
            .then((json) => this.setState({ events: json }))
            .then(() => {
                this.setState({ loading: false });
                this.props.navigation.navigate('EventResult', { results:this.state.events });}); 
        
    }

    render() {
        if (this.state.loading === true){
            content = (
                <Spinner  style={styles.spinner} color='#ff4081' />
            );
        }else{
            content = (
                <EventComponent navigation={ this.props.navigation } />
            );
        }
        return (
            <Container>
                <Header>
                    <Left style={{flexDirection: 'row'}}>
                            <Icon name="md-menu" onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} size={30} color="#ff4081" />
                    </Left>
                    <Input 
                        style={{ height: 40, borderColor: 'gray' }}
                        placeholder="Digite aqui ..."
                        value={this.state.query}
                        onChangeText={this.handleQueryChange}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <Right>
                        <Button transparent onPress={this.searchByQuery}>
                            <Icon ios="md-search" android="md-search"/>
                        </Button>
                    </Right>
                </Header>
                <View>
                    { content }
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    spinner: {
      marginTop:'50%',
      justifyContent: 'center',
      alignItems: 'center'
    }
  });