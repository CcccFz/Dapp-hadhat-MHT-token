import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

describe('Token', () => {
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory('Token');
    const [owner, account_1, account_2] = await ethers.getSigners();

    const token = await Token.deploy();
    await token.deployed();

    return { token, owner, account_1, account_2 };
  }

  describe('Deploy', () => {
    it('Should set the right owner', async () => {
      const { token, owner } = await loadFixture(deployTokenFixture);

      expect(await token.owner()).to.equal(owner.address);
    });
  
    it('Should assign all supply to the owner', async () => {
      const { token, owner } = await loadFixture(deployTokenFixture);

      expect(await token.balanceOf(owner.address)).to.equal(await token.supply());
    });
  });

  describe('Transactions', () => {
    it('Should transfer tokens between accounts', async () => {
      const { token, owner, account_1, account_2 } = await loadFixture(deployTokenFixture);

      await expect(token.transfer(account_1.address, 50))
        .to.changeTokenBalances(token, [owner, account_1], [-50, 50]);
  
      await expect(token.connect(account_1).transfer(account_2.address, 50))
        .to.changeTokenBalances(token, [account_1, account_2], [-50, 50])
    });
  
    it('Should emit Transfer events', async () => {
      const { token, owner, account_1, account_2 } = await loadFixture(deployTokenFixture);

      await expect(token.transfer(account_1.address, 50))
        .to.emit(token, 'Transfer')
        .withArgs(owner.address, account_1.address, 50);
  
      await expect(token.connect(account_1).transfer(account_2.address, 50))
        .to.emit(token, 'Transfer')
        .withArgs(account_1.address, account_2.address, 50);
    });  
  
    it('Should fail if sender have no enough tokens', async () => {
      const { token, owner, account_1 } = await loadFixture(deployTokenFixture);
      const initOwnerBalance = await token.balanceOf(owner.address);

      await expect(token.connect(account_1).transfer(owner.address, 1))
        .to.be.revertedWith("Not enough tokens");

      expect(await token.balanceOf(owner.address))
        .to.equal(initOwnerBalance);
    });
  });
});