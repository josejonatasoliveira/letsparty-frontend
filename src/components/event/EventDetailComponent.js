import { Container, Header, View,Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body,Right,Tab,Tabs,TabHeading } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import HTMLView from 'react-native-htmlview';
// import MapView from 'react-native-maps';
import * as base from '../enviroments';

export default class EventDetailComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      active: false
    };
  }

  submitOrder(event){
    console.log(event);
  }

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const event = navigation.getParam('eventDetail');
    return (
      <Container>
        <Header>
          <Left>
            <Button iconLeft light onPress={() => navigate("Home")}>
              <Icon name='arrow-back' />
              <Text>Voltar</Text>
            </Button>
          </Left>
        </Header>
        <Content>
          <View style={{ flex: 1 }}>
            <Card style={{flex: 0}}>
              <CardItem>
                <Left>
                  <Thumbnail source={{uri: base.BASE_URL + 'uploaded/' + event.image_file }} />
                  <Body>
                    <Text>{event.title}</Text>
                    <Text note>{event.date}</Text>
                  </Body>
                </Left>
                <Right>
                  <Button style={styles.button_price} onPress={() => navigate('OrderCheckout',{ event: event })} ><Text>+</Text></Button>
                </Right>
              </CardItem>
              
            </Card>
            <Card style={styles.card}>
              <CardItem header>
                <Left>
                  <Text>{event.short_description}</Text>
                </Left>
                <Right>
                  <Button style={styles.button_price} ><Text>R$ {event.price}</Text></Button>
                </Right>
              </CardItem>
              <CardItem>
                <Body>
                  <Tabs>
                    <Tab heading={ <TabHeading><Text>Descrição</Text></TabHeading>}>
                      <HTMLView
                        value={event.description}
                        stylesheet={styles}
                      />
                    </Tab>
                    <Tab heading={ <TabHeading><Text>Onde?</Text></TabHeading>}>
                      <Text>{event.address.street_name}</Text>
                      <Text>{event.address.number}</Text>
                      <Text>{event.address.city.name}-{event.address.city.sigla}</Text>
                      <Card >
                        <CardItem>
                          {/* <MapView style={styles.container}
                            mapType={Platform.OS == "android" ? "none" : "standard"}
                            initialRegion={{
                              latitude: 37.78825,
                              longitude: -122.4324,
                              latitudeDelta: 0.0922,
                              longitudeDelta: 0.0421,
                            }}
                            /> */}
                        </CardItem>
                      </Card>
                    </Tab>
                  </Tabs>
                </Body>
              </CardItem>
            </Card>
            
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  button_price: {
    backgroundColor: "#ff4081",
    borderRadius:30,
    fontWeight: 'bold',
    fontSize:6,
    height:30,
    padding:2
  },
  card: {
    height: '100%'
  },
  container: {
    flex: 1,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e5e5",
  },
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  }
});