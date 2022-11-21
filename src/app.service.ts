import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyERC20Token.json';
import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class AppService {

  provider: ethers.providers.BaseProvider;
  erc20ContractFactory;

  constructor() {
    this.provider = ethers.getDefaultProvider("goerli", {
     alchemy: process.env.ALCHEMY_API_KEY,
     infura: process.env.INFURA_API_KEY,
     etherscan: process.env.ETHERSCAN_API_KEY,
   });

   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
   const signer = wallet.connect(this.provider);
   this.erc20ContractFactory = new ethers.ContractFactory(tokenJson.abi, tokenJson.bytecode, signer);
  }

  getBlock(blockHashOrTag: string = 'latest'): Promise<ethers.providers.Block> {
    return this.provider.getBlock(blockHashOrTag);
  }

  async getTotalSupply(address: string): Promise<number> {
    const contractInstance = this.erc20ContractFactory.attach(address);
    const totalSupply = await contractInstance.totalSupply();
    return parseFloat(ethers.utils.formatEther(totalSupply));
  }
}
