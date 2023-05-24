import { artifacts, ethers } from "hardhat";
import path from 'path';
import { Token } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Deployer balance:', (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory('Token');
  const token = await Token.deploy();
  await token.deployed();

  saveFrontendFiles(token);

  console.log('Token address:', token.address);
}

function saveFrontendFiles(token: Token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Token");

  fs.writeFileSync(
    path.join(contractsDir, "Token.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exitCode = 1;
  });
