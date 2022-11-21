import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class AppService {
  // const {abi, bytecode } = MyToken;
  getHello(): string {
    return 'Hello Whirlpool!';
  }
  getSomethingElse(): string {
    return "something else";
  }

  getBlock(blockHashOrTag: string = 'latest'): Promise<ethers.providers.Block> {
    const provider = ethers.getDefaultProvider("goerli", {
      alchemy: process.env.ALCHEMY_API_KEY,
      infura: process.env.INFURA_API_KEY,
      etherscan: process.env.ETHERSCAN_API_KEY,
    });
    return provider.getBlock(blockHashOrTag);
  }

  // totalSupply(): number {
  //   const totalSupply = await tokenContract.totalSupply();
  // }
}
