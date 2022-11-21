import { Controller, Get, Param } from '@nestjs/common';
import { ethers } from 'ethers';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("last-block")
  getBlock(): any {
    return this.appService.getBlock();
  }

  @Get("block/:hash")
  getLastBlock(@Param('hash') hash: string): Promise<ethers.providers.Block> {
    return this.appService.getBlock(hash);
  }

  @Get("total-supply/:address")
   getTotalSupply(@Param('address') address: string): Promise<number> {
    return this.appService.getTotalSupply(address);
  }
}
