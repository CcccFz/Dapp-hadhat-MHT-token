import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import './tasks/faucet';


const INFURA_API_KEY = "";
const SEPOLIA_PRIVATE_KEY = "";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  // networks: {
  //   sepolia: {
  //     url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
  //     accounts: [SEPOLIA_PRIVATE_KEY]
  //   }
  // }
};

export default config;
