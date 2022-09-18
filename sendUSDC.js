const Gateway = require('../artifacts/IAxelarGateway.json');
const axlUSDC = require('../artifacts/axlUSDC.json');
const { private } = require('./private.json')
const ethers = require('ethers');

const main = async () => {
    // get max fees from gas station
    let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    try {
        const { data } = await axios({
            method: 'get',
            url: isProd
            ? 'https://gasstation-mainnet.matic.network/v2'
            : 'https://gasstation-mumbai.matic.today/v2',
        })
        maxFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxFee) + '',
            'gwei'
        )
        maxPriorityFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxPriorityFee) + '',
            'gwei'
        )
    } catch {
        // ignore
    }

    const url = 'https://polygon-rpc.com/'
    const provider = new ethers.providers.JsonRpcProvider(url)
    let privateKey = private
    const signer = new ethers.Wallet(
        privateKey,
        provider
    )
    console.log("Hello")
    const axlUSDCcontract = new ethers.Contract("0x750e4C4984a9e0f12978eA6742Bc1c5D248f40ed", axlUSDC, signer)
    await (await axlUSDCcontract.approve("0x6f015F16De9fC8791b234eF68D486d2bF203FBA8", 1000000, {
        gasLimit: 300000,
        maxFeePerGas,
        maxPriorityFeePerGas,
    })).wait();
    console.log("Hello2")
    const contractAddress = "0x6f015F16De9fC8791b234eF68D486d2bF203FBA8"
    const contractAbi = Gateway.abi
    console.log("Hello3")
    const contract = new ethers.Contract(contractAddress, contractAbi, signer)
    console.log("Hello4")
    await (await contract.sendToken("moonbeam", "0x29daEe1C43b67ABEF66A04a8E31b0B2db013b641", "axlUSDC", 1000000, {
        gasLimit: 300000,
        maxFeePerGas,
        maxPriorityFeePerGas,
    })).wait();
    console.log("Hello5")
};
  
  
const runMain = async () => {
    try {
        await main();
        process.exit(0); // exit Node process without error
    } catch (error) {
        console.log(error);
        process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
    // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();