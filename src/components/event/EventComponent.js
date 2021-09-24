import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
import { StyleSheet, FlatList, View, Dimensions, ActivityIndicator  } from 'react-native';
import { Image, TouchableOpacity } from 'react-native';
import BackService from '../../services/api';
import React, { Component } from 'react';
import * as base from '../enviroments';

const { width, height } = Dimensions.get('window');

const colors = {
  french_blue: '#3f51b5',
  deep_sky_blue: '#007aff',
  white: '#ffffff',
  black: '#000000',
  veryLightPink: '#f2f2f2'
};

export default class EventComponent extends Component {

    constructor() {
        super();
        this.state = {
            events: [],
            previousPage:'',
            nextPage:'',
            loading: true,
            loadingMore: false,
            filtering: false,
            refreshing: false,
        }
    };

    componentDidMount() {
        BackService.get("event/")
            .then(json => {
              this.setState({ events : json.results });
              this.setState({ nextPage: json.links.next });
              this.setState({ previousPage: json.links.previous })
            })
    }

    getStars(stars) {
        for(i =0; i < stars; i++){
            return (
                <Icon active name="star" />
            );
        }
    }

    _renderFooter = () => {
      if (!this.state.loadingMore) return null;
  
      return (
        <View
          style={{
            position: 'relative',
            width: width,
            height: height,
            paddingVertical: 20,
            borderTopWidth: 1,
            marginTop: 10,
            marginBottom: 10,
            borderColor: colors.veryLightPink
          }}
        >
          <ActivityIndicator animating size="large" />
        </View>
      );
    };

    _handleLoadMore = async () => {
        if (this.state.nextPage !== null){
            this.setState({ loadingMore: true })
            fetch(this.state.nextPage);
            const events = await response.json();

            this.setState({
                events: [...this.state.events, ...events.results],
                nextPage: events.links.next,
                previousPage: events.links.previous,
                loadingMore: false
            });

        }
      };

    render() {
        const { navigate } = this.props.navigation;
        return (
          <FlatList
          data={this.state.events}
          renderItem={
              ({ item }) =>
              <TouchableOpacity key={item.id} onPress={() => navigate('EventDetail',{ eventDetail: item })}>
                  <Card key={item.id}>
                      <CardItem>
                          <Left>
                              <Thumbnail source={{ uri: `${base.BASE_URL}uploaded/` + item.image_file }} />
                              <Body>
                                  <Text>{item.name}</Text>
                                  <Text note>{item.short_description}</Text>
                              </Body>
                          </Left>
                      </CardItem>
                      <CardItem cardBody>
                          <Image source={{ uri: `${base.BASE_URL}uploaded/` + item.image_file }} style={{ height: 200, width: null, flex: 1 }} />
                      </CardItem>
                      <CardItem>
                          <Left>
                              <Button transparent>
                                  <Icon active ios="md-calendar" android="md-calendar" />
                                  <Text style={styles.textDate} >{item.date}</Text>
                              </Button>
                          </Left>
                          <Button transparent>
                              <Text style={styles.text}>{item.address.city.name}-{item.address.city.sigla}</Text>
                          </Button>
                      </CardItem>
                  </Card>
              </TouchableOpacity>
          }
          ListFooterComponent={this._renderFooter}
          onRefresh={this._handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this._handleLoadMore}
          onEndReachedThreshold={0.5}
          keyExtractor={item => item.id_hash.toString()}
          />
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