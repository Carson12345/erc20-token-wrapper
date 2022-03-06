import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/Footer.js";
import Web3 from 'web3';
import { InitContract, TokenAContractData, TokenBContractData } from '../../blockchain/wraptoken_abi';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useState } from 'react';

const Main = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('')
    const [web3, setWeb3] = useState(null);



    const connectWalletHandler = async () => {
        if ((typeof window !== "undefined") && (typeof window.ethereum !== "undefined")) {
            try {
                window.ethereum.request({
                    method: "eth_requestAccounts"
                })
                let Web3Instance = new Web3(window.ethereum);
                setWeb3(Web3Instance);

                const TokenAContractInstance = InitContract(TokenAContractData, Web3Instance);
                const TokenBContractInstance = InitContract(TokenBContractData, Web3Instance);

                const accounts = await Web3Instance.eth.getAccounts();

                const address = accounts[0];
                let bal = await TokenAContractInstance.methods.balanceOf(address).call().then();

                // If run following will use your real / test ether, so commented first
                await TokenAContractInstance.methods.approve(TokenBContractInstance.options.address, 20).send({
                    from: address
                });

                const allowance = await TokenAContractInstance.methods.allowance(address, TokenBContractInstance.options.address).call().then();

                console.log("Allowance of account 0: ", allowance);

                setMessage(`Account: ${address}, TKA Balance: ${bal}, Alloance: ${allowance}`);

            } catch (err) {
                console.log(err.message);
            }
        } else {
            window.alert("Please install metamask");
        }
    }

    useEffect(()=>{
        const initContract = async () => {

        }

        initContract();
    })


    return (
        <>
            <Head>
                <title>Wrap Token</title>
            </Head>
            <Navbar transparent />
            <main className="profile-page">
                <section className="relative block" style={{ height: "500px" }}>
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
                                <div className="flex flex-wrap justify-center">
                                    <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                                        <div className="relative">
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                                        <div className="py-6 px-3 mt-32 sm:mt-0">
                                            <button
                                                className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                                                type="button"
                                                style={{ transition: "all .15s ease" }}
                                                onClick={() => {
                                                    connectWalletHandler();
                                                }}
                                            >
                                                Connect
                                            </button>
                                        </div>
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