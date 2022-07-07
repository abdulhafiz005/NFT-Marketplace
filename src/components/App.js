import React, { Component } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import KryptoBird from '../abis/KryptoBird.json';
import {MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn} from 'mdb-react-ui-kit';
import './App.css';

class App extends Component {

     async componentDidMount(){
         await this.loadWeb3();
     }

    // first up is to detect ethereum provider
    async loadWeb3() {
        const provider = await detectEthereumProvider();

        // modern browsers
        // if there is a provider then
        // lets log its working and access
        // the window from the doc to set
        // Web3 to the provider

        if(provider) {
            window.web3 = new Web3(provider);
            await this.loadBlockchainData();
        }else{
            // no ethereum provider
            window.alert('no ethereum wallet detected.');
        }
    }

    async transferToken(tokenId){
        const web3 = window.web3;
        // get nonce
        const nonce = await web3.eth.getTransactionCount(this.state.account, "latest");
        // convert ETH to wei
        const value = web3.utils.toWei(this.state.kryptoCosts[tokenId], "Ether");

        // prepare transaction. fields - to, value, gasPrice, gasLimit, nonce
        const transaction = {
            'to': this.state.contract.methods.ownerOf(tokenId),
            'value': value,
            'gasLimit': 6721975,
            'gasPrice': 20000000000,
            'nonce': nonce
        }

        //create signed transaction
        const signTrx = await web3.eth.accounts.signTransaction(transaction, 'PrivateKey');
        
        //send signed transaction
        web3.eth.sendSignedTransaction(signTrx.rawTransaction, function(error, hash){
            if(error){
                console.log('something went wrong', error);
            }else{
                console.log('transaction submitted', hash);
            }
        });
    }

    async loadBlockchainData(){
        const web3 = window.web3;
        await web3.eth.requestAccounts();
        const accounts = await web3.eth.getAccounts();
        this.setState({account: accounts[0]});

        const networkId = await web3.eth.net.getId();
        const networkData = KryptoBird.networks[networkId]

        if(networkData) {
            const abi = KryptoBird.abi;
            const address = networkData.address;
            const contract = new web3.eth.Contract(abi, address);
            this.setState({contract});
            
            const totalSupply = await this.state.contract.methods.totalSupply().call();
            this.setState({totalSupply});

            for(let i = 0; i < totalSupply; i++){
                const KryptoBird = await this.state.contract.methods.kryptoBirdz(i).call();
                const KryptoName = await this.state.contract.methods.tokenName(i).call();
                const KryptoDesc = await this.state.contract.methods.tokenDescription(i).call();
                const KryptoCost = await this.state.contract.methods.tokenCost(i).call();
                const tokenOwner = await this.state.contract.methods.ownerOf(i).call();

                this.setState({
                    kryptoBirdz: [...this.state.kryptoBirdz, KryptoBird],
                    kryptoNames: [...this.state.kryptoNames, KryptoName],
                    kryptoDescs: [...this.state.kryptoDescs, KryptoDesc],
                    kryptoCosts: [...this.state.kryptoCosts, KryptoCost],
                    tokenOwner: [...this.state.tokenOwner, tokenOwner],
                });
            }
        }else {
            window.alert('Smart Contract not deployed.');
        }
    }

    mint = (kryptoBird, kryptoName, kryptoDesc, kryptoCost) => {
        this.state.contract.methods.mint(kryptoBird, kryptoName, kryptoDesc, kryptoCost).send({from: this.state.account}).once('Receipt', (Receipt) => {
            this.setState({
                kryptoBirdz: [...this.state.kryptoBirdz, kryptoBird],
                kryptoNames: [...this.state.kryptoNames, kryptoName],
                kryptoDescs: [...this.state.kryptoDescs, kryptoDesc],
                kryptoCosts: [...this.state.kryptoCost, kryptoCost],
                tokenOwner: [...this.state.tokenOwner, this.state.account],
            });
        });
    }

    transferPopUp = () => {
        window.alert('clicked');
    }

    chckOwner = (tokenId) => {
        if(this.state.tokenOwner[tokenId] == this.state.account){
            return (
                <button class="form-control btn-primary" onClick={this.transferPopUp}>Transfer Token</button>
            );
        }else{
            return(
                <button class="form-control btn-primary">{this.state.kryptoCosts[tokenId]} ETH</button>
            );
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            contract: null,
            totalSupply: 0,
            kryptoBirdz: [],
            kryptoNames: [],
            kryptoDescs: [],
            kryptoCosts: [],
            tokenOwner: [],
        }
    }

    render() {
        return(
            <div className="container-filled">
                {console.log(this.state)}
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <div className="navbar-brand col-sm-3 col-md-3 mr-0" style={{color:'white'}}>
                        NFTS (Non Fungible Tokens)
                    </div>
                    <ul className="navbar-nav px-3">
                        <li className="nave-item text-nowrap d-none d-sm-none d-sm-block">
                            <small className="text-white">
                                {this.state.account}
                            </small>
                        </li>
                    </ul>
                </nav>

                <div className="container-fluid mt-1">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto" style={{opacity:'0.8'}}>
                                <h1 style={{marginTop:'40px'}}>NFT Marketplace</h1>
                                <form onSubmit={(event) => {
                                    event.preventDefault();
                                    this.mint(this.kryptoBird.value, this.kryptoName.value, this.kryptoDesc.value, this.kryptoCost.value);
                                }}>
                                    <input type="text" placeholder="Enter Token URL" ref={(input) => this.kryptoBird = input} className="form-control mb-1"/>
                                    <input type="text" placeholder="Token Name" ref={(input) => this.kryptoName = input} className="form-control mb-1"/>
                                    <input type="text" placeholder="Token Description" ref={(input) => this.kryptoDesc = input} className="form-control mb-1"/>
                                    <input type="number" placeholder="Token Cost In ETH" ref={(input) => this.kryptoCost = input} className="form-control mb-1"/>
                                    <input type="submit" value="Mint" className="form-control btn btn-primary"/>
                                </form>
                            </div>
                        </main>
                    </div>
                        <hr />
                        <div className="row textCenter">
                            {this.state.kryptoBirdz.map((kryptoBird, key) => {
                                return(
                                    <div>
                                        <div>
                                        <MDBCard className='token' style={{maxWidth:'22rem'}}>
                                            <MDBCardImage className='img' src={kryptoBird} position='top' height='250rem' style={{marginRight: '4px'}}/>
                                            <MDBCardBody>
                                                <MDBCardTitle> {this.state.kryptoNames[key]} </MDBCardTitle>
                                                <MDBCardText> {this.state.kryptoDescs[key]} </MDBCardText>
                                                {this.chckOwner(key)}
                                            </MDBCardBody>
                                        </MDBCard>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                </div>
            </div>
        )
    }
}

export default App;