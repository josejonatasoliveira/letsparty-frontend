import { StyleSheet, Image, Alert } from 'react-native';
import RNSecureStore from "react-native-secure-store";
import React, { Component } from 'react';
import {
    Container,
    Header,
    Body,
    Button,
    Content,
    Icon,
    Text,
    List,
    ListItem
} from 'native-base';


export default class SideBar extends Component {

    constructor(props){
        super(props)
        this.state = {
            listItems : "",
            token: ""
        }
    }
    
    componentDidMount(){
        RNSecureStore.get('token')
            .then((token) => this.setState({ token: token }));
    }


    logout = () => {
        RNSecureStore.delete('token')
            .then(() => this.setState({ token: null }));
        Alert.alert('Sair','Token deletado com sucesso!');
    }

    getListItems = () => {
        const { navigate } = this.props.navigation;
        if (this.state.token !== null){
            return (
                <List>
                    <ListItem transparent sytle={ styles.container } onPress={() => navigate("Login")}>
                        <Icon ios="md-person" android="md-person" style={{ color: "#ff4081" }} />
                        <Text style={ styles.textList } >Meu Perfil</Text>
                    </ListItem>
                    <ListItem transparent sytle={ styles.container } onPress={() => this.logout()}>
                        <Icon ios="md-person" android="md-person" style={{ color: "#ff4081" }} />
                        <Text style={ styles.textList } >Sair</Text>
                    </ListItem>
                </List>
            )
        }else{
            return (
                <List>
                    <ListItem transparent sytle={ styles.container } onPress={() => navigate("Login")}>
                        <Icon ios="md-person" android="md-person" style={{ color: "#ff4081" }} />
                        <Text style={ styles.textList } >Fazer Login</Text>
                    </ListItem>
                </List>
            )
        }
    }
    
    render(){
        return (
                <Container >
                    <Header style={styles.headerContainer}>
                        <Body>
                            <Image source={require('../images/logo.png')} style={styles.image} />
                        </Body>
                    </Header>
                    <Content>
                        { this.getListItems() }
                    </Content>
                </Container>
               );
    } 
};


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        textAlign: 'center',
    },
    textList: {
        marginLeft: 30,
        color: "#ff4081"
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    headerContainer: {
        height: 120,
    },
    screenContainer: { 
        paddingTop: 20,
        width: '100%',
    },
    image:{
        height: 100,
        width: 250
    }
});