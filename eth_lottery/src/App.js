import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3.js';
import lottery from './lottery.js';
class App extends Component {

  state = {
    manager: '',
    isManager: false,
    accounts:[],
    players: [],
    balance: '',
    value:'',
    message: ''
  };
  
  async componentDidMount() {
    // When using metamask provider (and instance of web3), default provider is already set.
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.returnPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const accounts = await web3.eth.getAccounts();

    this.setState({
      manager,
      players,
      balance,
      accounts
    });

    let isManager;
    if (this.state.manager === this.state.accounts[0]) {
      isManager = true;
    } else {
      isManager = false;
    }

    this.setState({
      isManager
    });

  }

  async handleSubmit(e) {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({
      message: 'Waiting on transaction success...'
    });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });
    this.setState({
      message: `You have successfully entered the lottery with ${this.state.value} ETH`
    });
  }

  async handlePickWinner() {
    this.setState({message: 'Waiting on transaction success...'});
    await lottery.methods.pickWinner().send({
      from: this.state.accounts[0]
    });
    this.setState({ message: 'A winner has been picked!' });
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}.
          There are currently {this.state.players.length} entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ETH.
        </p>
        <hr/>
        <form onSubmit = {e => this.handleSubmit(e)}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ETH to enter: </label>
            <input value = {this.state.value} onChange = {(e) => { this.setState({ value: e.target.value }) }}></input>
          </div>
          <button>Enter</button>
        </form>

        <hr/>

        {this.state.isManager ? <div>
          <h4>Time to pick a winner?</h4>
          <button onClick = {() => this.handlePickWinner()}>PICK A WINNER</button>
        </div> : null}

        <hr/>

        <h1>{this.state.message}</h1>

      </div>
    );
  }
}

export default App;
