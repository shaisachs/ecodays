import React, { Component } from 'react';
import './App.css';
import rrule from 'rrule';
import lodash from 'lodash';

function getDateDesc(date) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var year = date.getFullYear();
  var month = months[date.getMonth()];
  var dayOfWeek = weekdays[date.getDay()];
  var dayOfMonth = date.getDate();

  return dayOfWeek + ', ' + month + ' ' + dayOfMonth + ', ' + year;
}

class App extends Component {
  constructor () {
    super()
    this.state = { holidays: [] }
  }

  componentDidMount() {
    var that = this;
    fetch('https://shaisachs.github.io/ecodays/api.json')
      .then(response => response.json())
      .then(holidaysData => that.setState({ holidays: holidaysData.holidays }) );
  }

  renderHolidays() {
    if (!this.state.holidays || (this.state.holidays.length <= 0)) {
      return (<p>Error while rendering days</p>);
    }

    var today = new Date();
    today.setDate(today.getDate() - 1);
    var inOneYear = new Date();
    inOneYear.setFullYear(inOneYear.getFullYear() + 1);

    var occurrences = lodash.map(this.state.holidays, function(h) {
      var rule = rrule.rrulestr(h.rrule);

      var nextOccurrences = rule.between(today, inOneYear);
      if (!nextOccurrences || !nextOccurrences.length) {
        return null;
      }

      return { holiday: h, nextOccurrence: nextOccurrences[0] };
    });

    var compactOccurrences = lodash.compact(occurrences);

    var sortedOccurrences = lodash.sortBy(compactOccurrences,
      o => o.nextOccurrence.toISOString());

    var answer = lodash.map(sortedOccurrences, function(o, ind) {
      var url = o.holiday.url;
      var name = url ?
        (<a href={url}>{o.holiday.name}</a>) :
        o.holiday.name;
      var dateDesc = getDateDesc(o.nextOccurrence);

      return (
        <div class="holiday" key="{ind}">
          <div class="holiday-name">{name}</div>
          <div class="holiday-date">{dateDesc}</div>
        </div>);
    });

    return answer;
  }

  render() {
    if (this.state.holidays.length) {
      var holidays = this.renderHolidays();
      return (
        <div class="app">
          <h1>Upcoming Environmental Holidays</h1>
          <div class="holidays">{holidays}</div>
        </div>
      );
    }
    else {
      return (<p>Loading...</p>);      
    }
  }
}

export default App;
