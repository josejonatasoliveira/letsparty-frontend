import { Container, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Header, Right, Title } from 'native-base';
import { Image, TouchableOpacity, View } from 'react-native';
import { StyleSheet, FlatList } from 'react-native';
import React, { Component } from 'react';
import * as base from '../enviroments';

export default class EventResultSearchComponent extends Component {

    constructor() {
        super();
        this.state = {
            events: [],
            previousPage:'',
            nextPage:''
        }
    };


    render() {
        const { navigation } = this.props;
        const { navigate } = this.props.navigation;
        const events = navigation.getParam('results');
        return (
            <Container>
              <Header>
                <Left>
                  <Button iconLeft light onPress={() => navigate("Home")}>
                    <Icon name='arrow-back' />
                    <Text>Voltar</Text>
                  </Button>
                </Left>
                <Body>
                  <Title>{events.count} {events.count > 1 ? 'Resultados': 'Resultado'}</Title>
                </Body>
                <Right />
              </Header>
                <View>
                    <FlatList
                    data={events.results}
                    renderItem={
                        ({ item }) =>
                        <TouchableOpacity key={item.id} onPress={() => navigate('EventDetail',{ eventDetail: item })}>
                            <Card key={item.id}>
                                <CardItem>
                                    <Left>
                                        <Thumbnail source={{ uri: base.BASE_URL + 'uploaded/' + item.image_file }} />
                                        <Body>
                                            <Text>{item.name}</Text>
                                            <Text note>{item.short_description}</Text>
                                        </Body>
                                    </Left>
                                </CardItem>
                                <CardItem cardBody>
                                    <Image source={{ uri: base.BASE_URL + 'uploaded/' + item.image_file }} style={{ height: 200, width: null, flex: 1 }} />
                                </CardItem>
                                <CardItem>
                                    <Left>
                                        <Button transparent>
                                            <Icon active ios="md-calendar" android="md-calendar" />
                                            <Text style={styles.textDate} >{item.date}</Text>
                                        </Button>
                                    </Left>
                                    {/* <Button transparent>
                                        <Text style={styles.text}>{item.address.city.name}-{item.address.city.sigla}</Text>
                                    </Button> */}
                                </CardItem>
                            </Card>
                        </TouchableOpacity>
                    }
                    keyExtractor={item => item.id_hash}
                    />
                </View>
            </Container>
        );
    }

}

const styles = StyleSheet.create({
    text : {
        color: '#3f51b5',
        fontWeight: 'bold',
        fontSize: 14,
    },
    textDate : {
        color: '#3f51b5',
        fontWeight: 'bold',
        fontSize: 12,
    }
})