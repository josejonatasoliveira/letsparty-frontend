import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Spinner } from 'native-base';
import BackService from '../../services/api';
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
  marginTop: 10px;
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
export default class SignInComponent extends Component {

  constructor() {
    super();
    this.state = {
        username: '',
        email: '',
        password_1: '',
        password_2: '',
        error:'',
        loading: false
    }
  };

  handleUsernameChange = (username) => {
    this.setState({ username });
  };

  handleEmailChange = (email) => {
    this.setState({ email });
  };
  
  handlePassword1Change = (password_1) => {
    this.setState({ password_1 });
  };

  handlePassword2Change = (password_2) => {
    this.setState({ password_2 });
  };
  
  handleLoginPress = () => {
    this.props.navigation.navigate('Login');
  };

  handleCreateAccountPress = async () => {
    if (this.state.password_1.localeCompare(this.state.password_2) === -1) {
      this.setState({ error: 'As senhas não estão iguais!' }, () => false);
    }
    else if(this.state.username.length === 0 || this.state.email.length === 0){
      this.setState({ error: 'Favor preencher todos os campos!' }, () => false);
    }
    else{
      try{
        let data = {
          'username': this.state.username,
          'email': this.state.email,
          'password': this.state.password_1
        }

        this.setState({ loading: true });

        await BackService.post("signin/", data);

        this.setState({ loading: false });
        Alert.alert(
          'Sucesso!',
          'Usuário cadastrado com sucesso!',
          [
            {text: 'OK'},
          ],
          {cancelable: false},
        );
        this.props.navigation.navigate('Login');

      }catch(e){
        this.setState({ error: 'Ocorreu um erro ao se cadastrar!Por favor tente mais tarde!' });
      }
    }
  }

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
            placeholder="Digite seu e-mail"
            value={this.state.email}
            onChangeText={this.handleEmailChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Input
            placeholder="Digite a senha"
            value={this.state.password_1}
            onChangeText={this.handlePassword1Change}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />

          <Input
            placeholder="Confirme a senha"
            value={this.state.password_2}
            onChangeText={this.handlePassword2Change}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
          {this.state.error.length !== 0 && <ErrorMessage>{this.state.error}</ErrorMessage>}
          <Button style={styles.button} onPress={this.handleCreateAccountPress} >
            <Text>Cadastrar</Text>
          </Button>
          <Text onPress={this.handleLoginPress}>
            <Text style={styles.buttonText}>Logar-se</Text>
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