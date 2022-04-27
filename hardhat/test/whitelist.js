const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Whitelist Contract", function () {

  let Contract
  let contract
  let owner
  let user1
  let user2
  const provider = waffle.provider

  before(async () => {
    Contract = await ethers.getContractFactory("Whitelist");
    [owner, user1, user2] = await ethers.getSigners();
    contract = await Contract.deploy(10);
    await contract.deployed();
  })

  describe('deployment', () => {
    it('deploys with a max whitelist amount of 10', async() => {
      const maxAllowed = await contract.maxWhitelistedAddresses()
      expect(maxAllowed).to.equal(10)
    })
  })

  describe('add addresses to whitelist', () => {
    it('add owner address to whitlist', async() => {
      await contract.addAddressToWhitelist()
      //const added = await contract.whitelistedAddresses()[owner]
      //console.log(added)
      const num = await contract.numAddressesWhitelisted()
      expect(num).to.equal(1)
      //expect(added).to.equal(true)
    })
    it('add user1 address to whitelist', async() => {
      const user1connected = await contract.connect(user1)
      await user1connected.addAddressToWhitelist()
      const num = await contract.numAddressesWhitelisted()
      expect(num).to.equal(2)
    })
  })

})