import React, { Component } from 'react';
import { Container, Content, Form, Item, Input, Button, Text } from 'native-base';
import RNSecureStore, {ACCESSIBLE} from "react-native-secure-store";

export default class ProfileComponent extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      password: '',
      token: '',
      get_token: true
    };
  }
  
  logout() {
    this.setState({ token: null });
  }

  render() {
    const { navigate } = this.props.navigation;

    RNSecureStore.get('token')
      .then((token) => {
        console.log(token);
        if (token !== null && this.state.get_token === true){
          this.setState({ token: token });
          this.setState({ get_token: false });
        }
      });

    if (this.state.token !== null){
      button = (<Button
                  onPress={this.logout(this)}>
                    <Text>Logado</Text>
                </Button>);
    }else{
      button = (<Button
                  onPress={() => navigate('Login')}>
                    <Text>Logar</Text>
                </Button>);
    }
    return (
      <Container>
        <Content>
          <Form>
            <Item>
              <Input placeholder="Username"
                     value={ this.state.username }
                     onChangeText={(username) => this.setState({ username })}
              />
            </Item>
            <Item last>
              <Input placeholder="Password"
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'Password'}
                    secureTextEntry={true}
              />
            </Item>
          </Form>
          { button }
        </Content>
      </Container>
    );
  }
}