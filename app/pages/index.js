import Head from "next/head"
import Web3Modal from "web3modal"
import { providers, Contract } from "ethers"
import { useEffect, useRef, useState } from "react"
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants"
import Image from 'next/image'
import chiv from '../public/chiv.png'

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [joinedWhitelist, setJoinedWhitelist] = useState(false)
  const [loading, setLoading] = useState(false)
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0)
  const web3ModalRef = useRef()

  const getProviderOrSigner = async (needSigner = false) => {

    const provider = await web3ModalRef.current.connect()
    const web3Provider = new providers.Web3Provider(provider)

    const { chainId } = await web3Provider.getNetwork()
    if (chainId !== 4) {
      window.alert("Change network to Rinkeby")
      throw new Error("Change network to Rinkeby")
    }

    if (needSigner) {
      const signer = web3Provider.getSigner()
      return signer
    }
    return web3Provider
  }

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer)

      const tx = await whitelistContract.addAddressToWhitelist()
      setLoading(true)
      await tx.wait()
      setLoading(false)
      await getNumberOfWhitelisted()
      setJoinedWhitelist(true)
    } catch (err) {
      console.error(err)
    }
  }

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner()
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, provider)

      const _num = await whitelistContract.numAddressesWhitelisted()
      setNumberOfWhitelisted(_num)
    } catch (err) {
      console.error(err)
    }
  }

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer)

      const address = await signer.getAddress()
      const _joined = await whitelistContract.whitelistedAddresses(address)
      setJoinedWhitelist(_joined)
    } catch (err) {
      console.error(err)
    }
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner()
      setWalletConnected(true)

      checkIfAddressInWhitelist()
      getNumberOfWhitelisted()
    } catch (err) {
      console.error(err)
    }
  }

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className="">
            Thanks for joining the Whitelist!
          </div>
        )
      } else if (loading) {
        return <button className="">Loading...</button>
      } else {
        return (
          <button onClick={addAddressToWhitelist} className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded text-center">JOIN</button>
        )
      }
    } else {
      return (
        <button onClick={connectWallet} className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded text-center">Connect Wallet</button>
      )
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      })
      connectWallet()
    }
  }, [walletConnected])

  return (
    <>
      <Head>
        <title>Chivivus Whitelist</title>
        <meta name="description" content="Join the Chivivus Metaverse Whitelist" />
      </Head>
      <div className="container mx-auto p-4 md:max-w-[65%] md:flex md:justify-center md:items-center">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Welcome to the Chivivus Metaverse</h1>
          <p className="text-lg font-medium my-4">The very start of the Chivivus Metaverse. Join the whitelist now to ensure your access. You won&#39;t want to miss this.</p>
          <p className="text-lg font-medium my-4">{numberOfWhitelisted} have already joined!</p>
          {renderButton()}
        </div>
        <div> 
          <Image
            src={chiv}
            alt="The legendary chivivus man"
            className="rounded"
          />
        </div>
      </div>
      <footer className="text-center py-6 border-t mt-4">
      <p className="">A <a href="https://twitter.com/YipsCT" target="blank" className="border-b border-gray-500">@YipsCT</a> Project.</p>
      <p className="">I'm looking to do Web3 as a job. Consider Me.</p>
      </footer>
    </>
  )
}