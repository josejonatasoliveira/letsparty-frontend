import { Container, Icon, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Spinner, View, Header } from 'native-base';
import { StyleSheet, Modal, TouchableHighlight, Alert } from 'react-native';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import { startNFC, stopNFC } from "../nfc/NFCManagerComponent";
import RNSecureStore from "react-native-secure-store";
import CryptoJS from "react-native-crypto-js";
import BackService from '../../services/api';
import React, { Component } from 'react';
import * as base from '../enviroments';
import QRCode from 'react-qr-code';

function buildUrlPayload(valueToWrite) {
  return Ndef.encodeMessage([
    Ndef.uriRecord(valueToWrite),
  ]);
}

export default class OrderComponent extends Component {

  constructor() {
    super();
    this.state = {
      orders: [],
      loading: true,
      modalVisible: false,
      data_code: ''
    }
  };

  componentDidMount() {
    NfcManager.start();
  }

  cleanUp = () => {
    NfcManager.cancelTechnologyRequest().catch(() => 0);
  }

  async setModalVisible(visible, ticket, orderId) {
    // if (ticket != undefined) {
    //   try {
        
    //     console.warn("Pressionado...")
    //     let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
    //     let resp = await NfcManager.requestTechnology(tech, {
    //       alertMessage: 'Ready to do some custom Mifare cmd!'
    //     });

    //     let text = ticket;
    //     let fullLength = text.length + 7;
    //     let payloadLength = text.length + 3;
    //     console.warn('Linha 51');
        
    //     let cmd = Platform.OS === 'ios' ? NfcManager.sendMifareCommandIOS : NfcManager.transceive;
        
    //     let currentPage = 6;
    //     let currentPayload = [0xA2, currentPage, 0x6E];

    //     for (let i = 0; i < text.length; i++) {
    //       currentPayload.push(text.charCodeAt(i));
    //       if (currentPayload.length == 6) {
    //         resp = await cmd(currentPayload);
    //         currentPage += 1;
    //         currentPayload = [0xA2, currentPage];
    //       }
    //     }

    //     console.warn('Linha 71');

    //     // close the string and fill the current payload
    //     currentPayload.push(254);
    //     while (currentPayload.length < 6) {
    //       currentPayload.push(0);
    //     }

    //     console.warn(currentPayload);

    //     resp = await cmd(currentPayload);

    //     console.warn(resp);

    //     this.cleanUp();

    //   } catch (err) {
    //     console.log(`Error ==> ${err}`)
    //   }

    // }

    var encrypted = CryptoJS.AES.encrypt(ticket.key, ticket.value);
    var data = `${encrypted.toString()}order${orderId}`;

    console.warn(data)

    this.setState({ data_code: data});
    this.setState({ modalVisible: visible });
  }

  updateKeys() {

    this.interval = setInterval(() => {

      if (this.state.orders.length > 0) {
        this.state.orders.map(order => {

          var key = CryptoJS.lib.WordArray.random(8);

          RNSecureStore.get('token')
            .then((token) => {
              if (token !== null) {
                data = {
                  'token': token,
                  'key': key.toString(),
                  'order_id': order.id
                }
                BackService.post(`ticket/`, data);
              }
            });

        });
      }
    }, 600000);

  }
  componentDidMount() {
    startNFC(this.handleNFCTagReading);
    RNSecureStore.get('token')
      .then((token) => {
        if (token !== null) {
          BackService.get(`order/?token=${token}`)
            .then(json => { return json })
            .then((json) => {
              console.log("AKI")
              this.setState({ orders: json.results },
                this.updateKeys())
            })
            .then(() => this.setState({ loading: false }));
        } else {
          this.setState({ loading: false })
          this.props.navigation.navigate('Login');
        }
      })
  }

  componentWillUnmount() {
    stopNFC();
    this.cleanUp();
  }

  handleNFCTagReading = nfcResult => {
    if (nfcResult.Error) {
      Alert.alert(`Título do erro: ${nfcResult.Error.Title}`);
      Alert.alert(`Descrição do erro: ${nfcResult.Error.Message}`);
    } else {
      Alert.alert(`Tag encontrada: ${nfcResult.tagValue}`);
    }
  };

  render() {
    if (this.state.loading === true) {
      return (
        <View>
          <Spinner style={styles.spinner} color='#ff4081' />
        </View>);
    } else {
      const { navigate } = this.props.navigation;
      return (
        <Container>
          <Content>
            <List>
              {this.state.orders.map(order =>
                <ListItem key={order.id} thumbnail onPress={() => navigate('EventDetail', { eventDetail: order.event })}>
                  <Left>
                    <Thumbnail square source={{ uri: base.BASE_URL + 'uploaded/' + order.event.image_file }} />
                  </Left>
                  <Body>
                    <Text>{order.event.title}</Text>
                    <Text note numberOfLines={1}>{order.event.short_description}</Text>
                  </Body>
                  <Right>
                    <Button transparent onPress={() => { this.setModalVisible(true, order.ticket, order.id); }}>
                      <Text note>{order.event.date}</Text>
                      <Icon ios="md-code-working" android="md-code-working" />
                    </Button>
                  </Right>
                </ListItem>
              )}
              <Modal
                key={this.state.data_code}
                animationType={this.state.data_code}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                }}>
                <View style={{ marginTop: 50, marginLeft: 50, marginRight: 50 }}>
                  <View>
                    <TouchableHighlight
                      onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                      }}>
                      <QRCode
                        value={this.state.data_code}
                        color="#000000"
                      />
                    </TouchableHighlight>
                  </View>
                </View>
              </Modal>
            </List>
          </Content>
        </Container>
      );
    }
  }
}

const styles = StyleSheet.create({
  spinner: {
    marginTop: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  qr_code: {
    marginTop: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});