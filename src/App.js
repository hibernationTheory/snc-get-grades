import React, { Component } from "react";
import axios from "axios";

import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { List, ListItem } from "material-ui/List";
import Paper from "material-ui/Paper";
import CircularProgress from "material-ui/CircularProgress";

import "./App.css";

class DisplayData extends Component {
  render() {
    const { data } = this.props;
    let dataAvg =
      data.reduce((acc, curr) => {
        return acc + parseFloat(curr);
      }, 0) / data.length;
    dataAvg = dataAvg.toFixed(2);

    const ListItems = data.map((item, index) => {
      return <ListItem key={index} primaryText={`${item}`} />;
    });
    ListItems.push(
      <ListItem
        key={ListItems.length + 1}
        primaryText={`Average: ${dataAvg}`}
      />
    );

    return (
      <Paper zDepth={2}>
        <h3
          style={{
            textAlign: "center"
          }}
        >
          Grades for {this.props.id}
        </h3>
        <List>{ListItems}</List>
      </Paper>
    );
  }
}

class Form extends Component {
  state = { inputVal: "" };

  handleChange = event => {
    const val = event.target.value;
    this.setState({
      inputVal: val
    });
  };

  handleSubmit = event => {
    this.props.handleSubmit(event, this.state.inputVal);
  };

  render() {
    return (
      <div className="form">
        <TextField
          hintText="Enter your Student Id"
          onChange={this.handleChange}
          value={this.state.inputVal}
        />
        <RaisedButton
          onClick={event => this.handleSubmit(event)}
          label="Submit"
        />
      </div>
    );
  }
}

class App extends Component {
  state = {
    error: "",
    id: "",
    idData: "",
    loading: false
  };

  handleSubmit = (event, data) => {
    event.preventDefault();

    this.setState(
      {
        id: "",
        idData: "",
        error: "",
        loading: true
      },
      () => {
        this.getData(data);
      }
    );
  };

  getData = data => {
    axios({
      method: "get",
      url: `https://wt-6a8e1677fdb36d30efe981fa885ee02a-0.run.webtask.io/get-snc-grades/${data}`
    })
      .then(response => {
        if (response.status !== 200) {
          return false;
        }

        console.log(response.data);

        this.setState({
          error: "",
          id: data,
          idData: response.data,
          loading: false
        });
      })
      .catch(err => {
        this.setState({
          error: "Student Id is Not Found",
          loading: false
        });
      });
  };

  render() {
    return (
      <div className="App">
        <Form handleSubmit={this.handleSubmit} />
        {this.state.loading && (
          <div style={{ textAlign: "center" }}>
            <CircularProgress size={60} thickness={3} />
          </div>
        )}
        {this.state.idData &&
          !this.state.loading && (
            <DisplayData data={this.state.idData} id={this.state.id} />
          )}
        {this.state.error && (
          <h3
            style={{
              color: "#da3030",
              textAlign: "center"
            }}
          >
            {this.state.error}
          </h3>
        )}
      </div>
    );
  }
}

export default App;
