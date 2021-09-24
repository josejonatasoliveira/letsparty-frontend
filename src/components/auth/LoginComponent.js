import RNSecureStore, {ACCESSIBLE} from "react-native-secure-store";
import { StackActions, NavigationActions } from 'react-navigation';
import { StyleSheet, TouchableOpacity } from 'react-native';
import BackService from '../../services/api';
import { Text, Spinner } from 'native-base';
import { Button, View } from 'native-base';
import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.View`
  flex: 1;
  alignItems: center;
  justifyContent: center;
  backgroundColor: #F5F5F5;
`;

const Logo = styled.Image`
  height: 60%;
  marginBottom: -180px;
`;

const Input = styled.TextInput`
  paddingHorizontal: 20px;
  paddingVertical: 15px;
  borderRadius: 5px;
  backgroundColor: #FFF;
  alignSelf: stretch;
  marginBottom: 15px;
  marginHorizontal: 20px;
  fontSize: 16px;
`;


const ErrorMessage = styled.Text`
  color:red;
`
export default class LoginComponent extends Component {

  constructor() {
    super();
    this.state = {
        username: '',
        password: '',
        error: '',
        token: '',
        loading: false
    }
  };

  handleUsernameChange = (username) => {
    this.setState({ username });
  };
  
  handlePasswordChange = (password) => {
    this.setState({ password });
  };
  
  handleCreateAccountPress = () => {
    this.props.navigation.navigate('SignIn');
  };

  handleSignInPress = async () => {
    if (this.state.username.length === 0 || this.state.password.length === 0) {
      this.setState({ error: 'Preencha usuário e senha para continuar!' }, () => false);
    } else {
      try {
        data = {
          'username': this.state.username,
          'password': this.state.password
        }
        this.setState({ loading: true });

        await BackService.post("auth/token/login", data)
            .then(json => this.setState({token: json.auth_token}));

        if (this.state.token == null){
          this.setState({ loading: false });
          this.setState({ error: 'Usuário e/ou senha incorreta!' });
          return;
        }
        
        RNSecureStore.set("token", this.state.token, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY});

        this.setState({ loading: false });
        this.props.navigation.navigate('Home');

        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Home' }),
          ],
        });
        this.props.navigation.dispatch(resetAction);
      } catch (_err) {
        this.setState({ loading: false });
        this.setState({ error: 'Houve um problema com o login, verifique suas credenciais!' });
      }
    }
  };

  render() {
    if (this.state.loading === true){
      return <View><Spinner style={styles.spinner} color='#ff4081' /></View>;
    }else{
      const { navigate } = this.props.navigation;
      return (
        <Container>
          <TouchableOpacity onPress={() => navigate("Home")}>
            <Logo source={require('../../images/logo.png')} resizeMode="contain" />
          </TouchableOpacity>
          <Input
            placeholder="Nome do usuário"
            value={this.state.username}
            onChangeText={this.handleUsernameChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Input
            placeholder="Senha"
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
          {this.state.error.length !== 0 && <ErrorMessage>{this.state.error}</ErrorMessage>}

          <Button style={styles.button} onPress={this.handleSignInPress} >
            <Text>Entrar</Text>
          </Button>
          <Text onPress={this.handleCreateAccountPress}>
            <Text style={styles.buttonText}>Criar conta grátis</Text>
          </Text>
        </Container>
      );
    }
  }
}


const styles = StyleSheet.create({
 
  button: {
    height: 42,
    marginBottom: 10,
    backgroundColor: '#ff4081',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    width: '90%'
  },
  buttonBack: {
    marginTop:-150
  },
  spinner: {
    marginTop:'50%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    color: '#3f51b5',
    fontWeight: 'bold',
    fontSize: 16,
  }
});