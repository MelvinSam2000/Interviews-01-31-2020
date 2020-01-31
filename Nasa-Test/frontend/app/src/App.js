import React from 'react';
import logo from './logo.svg';
import './App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class App extends React.Component {
  
  state = {
    selectedDate: new Date(),
    dates: [],
    apiData: []
  }
 
  handleDateSelection = date => {
    this.setState({
      selectedDate: date
    })
  }

  parseDate = date => {
    return date.toISOString().slice(0,10)
  }

  addDate = () => {
    let date = this.parseDate(this.state.selectedDate)

    // check date not already in list
    if (this.state.dates.includes(date)) {
      return
    }

    this.setState(state => {
      return {
        dates: [...state.dates, date]
      }
    })
  }

  removeDate = (i) => {
    this.setState(state => {
      return {
        dates: [...state.dates.splice(i + 1)]
      }
    })
  }

  fetchPictures = () => {
    // prepare query
    let dateString = "\""
    for (let date of this.state.dates) {
      dateString = dateString.concat(`${date},`)
    }
    dateString = dateString.substring(0, dateString.length - 1)
    dateString = dateString.concat("\"")

    // fetch from backend api
    fetch(`http://localhost:8002/timeline?dates=${dateString}`)
    .then((response) => {
      return response.json()
    })
    .then((myJson) => {
      this.setState({
        apiData: myJson["timeline"]
      })
    })
  }
  
  render() {
    return (
      <div className="App">
        <h1>
          Welcome to Nasa's Astronomy Picture of the day!
        </h1>
        <h2>
          Choose dates:
        </h2>
        <DatePicker
          selected={this.state.selectedDate}
          onChange={this.handleDateSelection}
        />
        <button onClick={this.addDate}>
          Add date
        </button>
        <button onClick={this.fetchPictures}>
          Get pictures!
        </button>
        <h3>
          Dates chosen:
        </h3>
        <div>
          {this.state.dates.map((date, i) => {
            return <div key={i}>
              {date}
              <button onClick={() => this.removeDate(i)}>
                Remove
              </button>
            </div>
          })}
        </div>
        <hr/>
        <div>
          {this.state.apiData.map((story, i) => {
            return <div key={i}>
              <h4>
                {story.title}
              </h4>
              <div>{story.date}</div>
              <p>
                {story.explanation}
              </p>
              <img src={story.url}/>
            </div>
          })}
        </div>
      </div>
    );
  }
}
