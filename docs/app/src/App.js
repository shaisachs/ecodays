import React, { Component } from 'react';
import './App.css';
import rrule from 'rrule';


class App extends Component {
  constructor () {
    super()
    this.state = { holidays: [] }
  }

  componentDidMount() {
    var that = this;
    fetch('https://shaisachs.github.io/ecodays/api.json').
      then(response => response.json()).
      then(holidaysData => that.setState({ holidays: holidaysData.holidays }) );
  }

  renderHolidays() {
    if (!this.state.holidays || (this.state.holidays.length <= 0)) {
      return (<p>Error while rendering days</p>);
    }

    var rrulestr = rrule.rrulestr;

    var today = new Date();
    var inOneYear = new Date();
    inOneYear.setFullYear(inOneYear.getFullYear() + 1);

    var answer = [];

    for (var i = 0; i < this.state.holidays.length; i++) {
      var holiday = this.state.holidays[i];
      var rule = rrule.rrulestr(holiday.rrule);

      var nextOccurrences = rule.between(today, inOneYear);
      if (!nextOccurrences || !nextOccurrences.length) {
        continue;
      }

      var nextOccurrence = nextOccurrences[0];
      var y = nextOccurrence.getFullYear();
      var m = nextOccurrence.getMonth() + 1;
      var d = nextOccurrence.getDate();

      answer.push(<p>{y}/{m}/{d}: {holiday.name} ({holiday.url})</p>);
    }

    return answer;
  }

  render() {
    return this.state.holidays.length ?
      this.renderHolidays() :
      (<p>Loading...</p>);
  }
}

export default App;
