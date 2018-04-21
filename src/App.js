import React, { Component } from 'react';
import './App.css';
import rrule from 'rrule';
import lodash from 'lodash';


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

    var answer = lodash.map(sortedOccurrences, function(o) {
      var y = o.nextOccurrence.getFullYear();
      var m = o.nextOccurrence.getMonth() + 1;
      var d = o.nextOccurrence.getDate();

      var url = o.holiday.url;
      var name = url ?
        (<a href={url}>{o.holiday.name}</a>) :
        o.holiday.name;

      return (<p>{y}/{m}/{d}: {name}</p>);
    });

    return answer;
  }

  render() {
    return this.state.holidays.length ?
      this.renderHolidays() :
      (<p>Loading...</p>);
  }
}

export default App;
