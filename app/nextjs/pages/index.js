import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Navbar from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import Web3 from 'web3';
import { InitContract, TokenAContractData, TokenBContractData } from '../blockchain/wraptoken_abi';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useState } from 'react';

const showNum = (num) => {
  return (num !== null) ? num : '-';
};

const Main = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('')
    const [web3, setWeb3] = useState(null);
    const [loading, setLoading] = useState(false);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [allowanceA, setAllowanceA] = useState(null);
    const [balanceA, setbalanceA] = useState(null);
    const [balanceB, setbalanceB] = useState(null);
    const [TokenAContractInstance, setTokenAContractInstance] = useState(null);
    const [TokenBContractInstance, setTokenBContractInstance] = useState(null);

    const wrapTokenAForTokenB = async (amountInTKB) => {
      try {
        setLoading(true);
        if (!TokenAContractInstance || !TokenBContractInstance) {
          window.alert("Please first connect Metamask");
          return;
        }
        let bal = await TokenAContractInstance.methods.balanceOf(selectedAddress).call().then();
        let allowance = await TokenAContractInstance.methods.allowance(selectedAddress, TokenBContractInstance.options.address).call().then();

        if (allowance < (amountInTKB * 2)) {
          // If run following will use your real / test ether, so commented first
          await TokenAContractInstance.methods.approve(TokenBContractInstance.options.address, amountInTKB * 2).send({
              from: selectedAddress
          });

          allowance = await TokenAContractInstance.methods.allowance(selectedAddress, TokenBContractInstance.options.address).call().then();

          setAllowanceA(parseInt(allowance));
        }

        await TokenBContractInstance.methods.requestWrappedToken(amountInTKB).send({
            from: selectedAddress
        });

        bal = await TokenAContractInstance.methods.balanceOf(selectedAddress).call().then();
        let balB = await TokenBContractInstance.methods.balanceOf(selectedAddress).call().then();
        allowance = await TokenAContractInstance.methods.allowance(selectedAddress, TokenBContractInstance.options.address).call().then();

        setbalanceA(parseInt(bal));
        setbalanceB(parseInt(balB));
        setAllowanceA(parseInt(allowance));
      } catch (error) {
        console.log(error);
        window.alert("Error");
      } finally {
        setLoading(false);
      }
    }

    const unwrapTokenB = async (amountInTKB) => {
      try {
        setLoading(true);
        let balB = await TokenBContractInstance.methods.balanceOf(selectedAddress).call().then();
        if (parseInt(balB) >= amountInTKB) {
          await TokenBContractInstance.methods.unwrapTokenForUnderlying(amountInTKB).send({
              from: selectedAddress
          });

          let balA = await TokenAContractInstance.methods.balanceOf(selectedAddress).call().then();
          balB = await TokenBContractInstance.methods.balanceOf(selectedAddress).call().then();

          setbalanceB(parseInt(balB));
          setbalanceA(parseInt(balA));
        }
      } catch (error) {
        console.log(error);
        window.alert("Error");
      } finally {
        setLoading(false);
      }
    }

    const connectWalletHandler = async () => {
        if ((typeof window !== "undefined") && (typeof window.ethereum !== "undefined")) {
            try {
                setLoading(true);
                await window.ethereum.request({
                    method: "eth_requestAccounts"
                });

                let Web3Instance = new Web3(window.ethereum);

                let tkaInstance = InitContract(TokenAContractData, Web3Instance);
                let tkbInstance = InitContract(TokenBContractData, Web3Instance);

                const accounts = await Web3Instance.eth.getAccounts();

                const address = accounts[0];

                let balA = await tkaInstance.methods.balanceOf(address).call().then();
                let balB = await tkbInstance.methods.balanceOf(address).call().then();
                let allowance = await tkaInstance.methods.allowance(address, tkbInstance.options.address).call().then();
      
                console.log(balA, balB, allowance);
                setAllowanceA(parseInt(allowance));
                setbalanceA(parseInt(balA));
                setbalanceB(parseInt(balB));

                setTokenAContractInstance(tkaInstance);
                setTokenBContractInstance(tkbInstance);
                setSelectedAddress(address);
                setWeb3(Web3Instance);
            } catch (err) {
                console.log(err.message);
            } finally {
              setLoading(false);
            }
        } else {
            window.alert("Please install metamask");
        }
    }

    useEffect(()=>{
        const init = async () => {

        }

        init();
    })


    return (
        <>
            <Head>
                <title>Wrap Token</title>
            </Head>
            <Navbar transparent />
            <main className="profile-page">
                <section className="relative block" style={{ height: "300px" }}>
                    <div
                        className="absolute top-0 w-full h-full bg-center bg-cover"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')"
                        }}
                    >
                        <span
                            id="blackOverlay"
                            className="w-full h-full absolute opacity-50 bg-black"
                        ></span>
                    </div>
                    <div
                        className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
                        style={{ height: "70px" }}
                    >
                        <svg
                            className="absolute bottom-0 overflow-hidden"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                            version="1.1"
                            viewBox="0 0 2560 100"
                            x="0"
                            y="0"
                        >
                            <polygon
                                className="text-gray-300 fill-current"
                                points="2560 0 2560 100 0 100"
                            ></polygon>
                        </svg>
                    </div>
                </section>
                <section className="relative py-16 bg-gray-300">
                    <div className="container mx-auto px-4">
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                            <div className="px-6">
                                <h5 className='text-center mt-6 font-bold'>Try playaround with Rinkeby Testnet <a className='text-blue-500' rel="noreferrer" target={"_blank"} href={'https://faucet.rinkeby.io/'}>(Faucet)</a></h5>
                                <div className="flex flex-wrap justify-center">
                                    <div className="w-full lg:w-8/12 px-4 lg:order-3 lg:text-right lg:self-center">
                                        <div className="py-6 px-3 mt-4 sm:mt-0 text-center">
                                            <button
                                                className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none"
                                                type="button"
                                                style={{ transition: "all .15s ease" }}
                                                onClick={() => {
                                                    connectWalletHandler();
                                                }}
                                            >
                                                Connect with Metamask & Refresh Balance
                                            </button>
                                        </div>
                                    </div>
                                    
                                </div>
                                <h5 className='text-center my-3 font-bold'>Balance And Allowance</h5>
                                {loading && (
                                  <h5 className='my-3 text-green-500 font-bold text-center'>Loading / Confirming Transaction ...</h5>
                                )}
                                <div className='flex border-t'>
                                  <div className='w-6/12 border-r p-3'>
                                      <h5 className='text-normal font-semibold text-center'>
                                        Balance of Token A
                                      </h5>
                                      <h5 className='text-xl font-bold text-center'>
                                        {showNum(balanceA)}
                                      </h5>
                                      <h5 className='text-normal font-semibold text-center'>
                                        Allowance of Token A
                                      </h5>
                                      <h5 className='text-xl font-bold text-center'>
                                        {showNum(allowanceA)}
                                      </h5>
                                  </div>
                                  <div className='w-6/12 p-3'>
                                      <h5 className='text-normal font-semibold text-center'>
                                        Balance of Token B
                                      </h5>
                                      <h5 className='text-xl font-bold text-center'>
                                        {showNum(balanceB)}
                                      </h5>
                                  </div>
                                </div>
                                <div className='flex border-t'>
                                  <div className='w-6/12 p-3 border-r text-center'>
                                      <button
                                          className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                                          type="button"
                                          style={{ transition: "all .15s ease" }}
                                          onClick={() => {
                                              let amountInTKB = window.prompt("How many Token B (TKB) you want to wrap?");
                                              if (amountInTKB) {
                                                wrapTokenAForTokenB(amountInTKB);
                                              }
                                          }}
                                      >
                                          Wrap Token A to Token B
                                      </button>
                                  </div>
                                  <div className='w-6/12 p-3 text-center'>
                                      <button
                                          className="bg-blue-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                                          type="button"
                                          style={{ transition: "all .15s ease" }}
                                          onClick={() => {
                                            let amountInTKB = window.prompt("How many Token B (TKB) you want to unwrap?");
                                            if (amountInTKB) {
                                              unwrapTokenB(amountInTKB);
                                            }
                                          }}
                                      >
                                          Unwrap Token B to Token A
                                      </button>
                                  </div>
                                </div>
                                <div className="text-center mt-12">
                                    <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                                        {message || ''}
                                    </h3>
                                    {
                                        error && (
                                            <h5 className='text-red text-normal text-center'>{error}</h5>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}


export default Main