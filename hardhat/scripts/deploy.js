async function main() {
  const whitelistContract = await hre.ethers.getContractFactory("Whitelist")
  const deployedWhitelistContract = await whitelistContract.deploy(10)
  await deployedWhitelistContract.deployed()

  console.log("Whitelist contract: ", deployedWhitelistContract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })