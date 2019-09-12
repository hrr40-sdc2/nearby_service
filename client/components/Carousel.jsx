import React from 'react';
import styled from 'styled-components';
import House from './House.jsx';
import Button from './Button.jsx';

const CarouselContainer = styled.div`
  width: 1500px;
  height: 450px;
`;

const ButtonContainer = styled.div`
  float: left;
  width: 25px;
  height: 225px;
  display: table;
  text-align: center;
  justify-content: center;
`;


class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startIndex: 0,
      endIndex: 3,
      heartArr: [],
    };
  }

  getDisplayHouses(start, end) {
    this.setState({
      displayHouses: this.props.nearbyHouseList.slice(start, end),
    });
  }

  heartHouseClicked(index) {
    const newHeartArr = this.state.heartArr;
    if (newHeartArr.indexOf(index) === -1) {
      newHeartArr.push(index);
    } else {
      const targetIndex = newHeartArr.indexOf(index);
      newHeartArr.splice(targetIndex, 1);
    }
    this.setState({
      heartArr: newHeartArr,
    });
  }

  componentDidMount() {
    this.getDisplayHouses(this.state.startIndex, this.state.endIndex);
  }

  buttonClickHandler(side) {
    this.shiftDisplay(side);
  }

  shiftDisplay(side) {
    if (side === 'right') {
      const newStart = this.state.startIndex - 1;
      const newEnd = this.state.endIndex - 1;
      this.setState({
        startIndex: newStart,
        endIndex: newEnd,
      });
      this.getDisplayHouses(newStart, newEnd);
    } else if (side === 'left') {
      const newStart = this.state.startIndex + 1;
      const newEnd = this.state.endIndex + 1;
      this.setState({
        startIndex: newStart,
        endIndex: newEnd,
      });
      this.getDisplayHouses(newStart, newEnd);
    }
  }

  render() {
    return (
      <CarouselContainer className='carousel'>
        <ButtonContainer className='buttonDiv'>
          {this.state.startIndex === 0
            ? <ButtonContainer></ButtonContainer>
            : <Button
              value='right'
              buttonClickHandler={this.buttonClickHandler.bind(this)}
            />}
        </ButtonContainer>
        <div className='houseDisplay'>
          {this.state.displayHouses ? this.state.displayHouses.map((house) => (
            <House
              changeCurrentHouse={this.props.changeCurrentHouse}
              heartHouseClicked={this.heartHouseClicked.bind(this)}
              heartArr={this.state.heartArr}
              house={house}
              key={house.arrIndex}
            />
          ))
            : null}
        </div>
        <ButtonContainer className='buttonDiv'>
          {this.state.endIndex === 12
            ? <ButtonContainer></ButtonContainer>
            : <Button
              value='left'
              buttonClickHandler={this.buttonClickHandler.bind(this)}
            />}
        </ButtonContainer>
      </CarouselContainer>
    );
  }
}

export default Carousel;
