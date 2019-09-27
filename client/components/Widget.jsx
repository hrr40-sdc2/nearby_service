import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

import Carousel from './Carousel.jsx';

const WidgetContainer = styled.div`
  font-family: 'Tajawal', sans-serif;
  color: #424949;
  padding-left: 100px;
`;

class Widget extends React.Component {
  constructor() {
    super();
    this.state = {
      currentHouse: 1,
      view: false,
    };
  }

  changeCurrentHouse(houseId) {
    this.getNearbyHouses(houseId);
  }

  componentDidMount() {
    this.getNearbyHouses(56789);
  }

  updateHouseList(houses) {
    this.setState({
      nearbyHouseList: houses,
    });
  }

  getNearbyHouses(zip) {
    axios.get(`http://ec2-18-222-27-79.us-east-2.compute.amazonaws.com/houses/${zip}`)
      .then((houses) => {
        this.updateHouseList(houses.data);
        this.setState({
          view: true,
          currentHouse: houses.data[0].id,
        });
      })
      .catch(err => {
        throw err;
      });
  }

  render() {
    return (
      <WidgetContainer id='morePlaces'>
        <h2>More places to stay</h2>
        {this.state.view
          ? <Carousel
            key={this.state.currentHouse}
            changeCurrentHouse={this.changeCurrentHouse.bind(this)}
            nearbyHouseList={this.state.nearbyHouseList} />
          : null}
      </WidgetContainer>
    );
  }
}

export default Widget;
