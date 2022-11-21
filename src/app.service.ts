import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyERC20Token.json';
import * as dotenv from "dotenv";
dotenv.config();

export class PaymentOrder {
  value: number;
  id: number;
  secret: string;
}

export class createPaymentOrderDto {
  value: number;
  secret: string;
}

export class requestPaymentOrderDto {
  id: number;
  secret: string;
  receiver: string;
}

@Injectable()
export class AppService {

  provider: ethers.providers.BaseProvider;
  erc20ContractFactory;
  paymentOrders: PaymentOrder[];
  signer;

  constructor() {
    this.provider = ethers.getDefaultProvider("goerli", {
     alchemy: process.env.ALCHEMY_API_KEY,
     infura: process.env.INFURA_API_KEY,
     etherscan: process.env.ETHERSCAN_API_KEY,
   });

   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
   this.signer = wallet.connect(this.provider);
   this.erc20ContractFactory = new ethers.ContractFactory(tokenJson.abi, tokenJson.bytecode, this.signer);
   this.paymentOrders = []
  }

  getBlock(blockHashOrTag: string = 'latest'): Promise<ethers.providers.Block> {
    return this.provider.getBlock(blockHashOrTag);
  }

  async getTotalSupply(address: string): Promise<number> {
    const contractInstance = this.erc20ContractFactory.attach(address);
    const totalSupply = await contractInstance.totalSupply();
    return parseFloat(ethers.utils.formatEther(totalSupply));
  }

  async getAllowance(address: string, from: string, to: string): Promise<number> {
    const contractInstance = this.erc20ContractFactory.attach(address);
    const allowance = await contractInstance.allowance(from, to);
    return parseFloat(ethers.utils.formatEther(allowance));
  }

  getPaymentOrder(id: number) {
    const paymentOrder = this.paymentOrders[id];
    return { value: paymentOrder.value, id: paymentOrder.id };
  }

  createPaymentOrder(value:number, secret: string) {
    const newPaymentOrder = new PaymentOrder();
    newPaymentOrder.value = value;
    newPaymentOrder.secret = secret;
    newPaymentOrder.id = this.paymentOrders.length;
    this.paymentOrders.push(newPaymentOrder);
    return newPaymentOrder.id;
  }

  async requestPaymentOrder(id: number, secret: string, receiver: string) {
    const paymentOrder = this.paymentOrders[id];
    if (paymentOrder.secret != secret) throw new Error("WRONG SECRET");
    const contractInstance = this.erc20ContractFactory.attach("0x0CBBA32981898231078CDAD4c621D734492CF02D");
    const tx = await contractInstance.mint(receiver, paymentOrder.value);
    return tx.wait();
  }
}
