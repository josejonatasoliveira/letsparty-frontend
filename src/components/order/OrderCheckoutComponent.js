import { Container, Content, View, Card, Header, CardItem, Thumbnail, Spinner, Text, Button, Icon, Left, Body, Right } from 'native-base';
import NfcManager, { Ndef } from "react-native-nfc-manager";
import { Image, StyleSheet, Alert } from 'react-native';
import RNSecureStore from "react-native-secure-store";
import BackService from '../../services/api';
import React, { Component } from 'react';
import * as base from '../enviroments';

export default class OrderCheckoutComponent extends Component {

  constructor() {
    super();
    this.state = {
      quantity: 1,
      loading: false,
      token: '',
    }

  }

  componentDidMount() {
    NfcManager.start();
  }

  componentWillMount() {

    RNSecureStore.get('token')
      .then((token) => {
        this.setState({ token: token });
      });
  }
  longToByteArray(long) {
    // we want to represent the input as a 8-bytes array
    var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for (var index = 0; index < byteArray.length; index++) {
      var byte = long & 0xff;
      byteArray[index] = byte;
      long = (long - byte) / 256;
    }

    return byteArray;
  };
  submitOrder(event, quantity) {
    let data = {
      event: event,
      quantity: quantity,
      token: this.state.token
    }
    this.setState({ loading: true })

    if (this.state.token !== null) {
      BackService.post("order/", data)
        .then(() => {

          this.setState({ loading: false });

          this.props.navigation.navigate('Meus Cupons');
        })
    } else {
      this.setState({ loading: false });
      this.props.navigation.navigate('Login');
    }
  }
  render() {

    const { navigation } = this.props;
    const event = navigation.getParam('event');
    const { navigate } = this.props.navigation;

    if (this.state.loading === true) {
      return (<View>
        <Header />
        <Spinner style={styles.spinner} color='#ff4081' />
      </View>);
    } else {

      return (
        <Container>
          <Header>
            <Left>
              <Button iconLeft light onPress={() => navigate('EventDetail', { eventDetail: event })}>
                <Icon name='arrow-back' />
                <Text>Voltar</Text>
              </Button>
            </Left>
          </Header>
          <Content>
            <Card>
              <CardItem>
                <Left>
                  <Thumbnail source={{ uri: base.BASE_URL + 'uploaded/' + event.image_file }} />
                  <Body>
                    <Text>{event.title}</Text>
                    <Text note>{event.shor_description}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
                <Image source={{ uri: base.BASE_URL + 'uploaded/' + event.image_file }} style={{ height: 200, width: null, flex: 1 }} />
              </CardItem>
              <CardItem>
                <Left>
                  <Button transparent>
                    <Text>Quantidade: 1</Text>
                  </Button>
                </Left>
                <Body>
                  <Button transparent>
                    <Text>Preço: R$ {event.price}</Text>
                  </Button>
                </Body>
                <Right>
                  <Button onPress={() => this.submitOrder(event, this.state.quantity)}>
                    <Text>Comprar</Text>
                  </Button>
                </Right>
              </CardItem>
            </Card>
          </Content>
        </Container>

      )
    }
  }
}

const styles = StyleSheet.create({
  spinner: {
    marginTop: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});