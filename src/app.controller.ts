import { Controller, Get, Param } from '@nestjs/common';
import { ethers } from 'ethers';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/else")
  getSomethingElse(): string {
    return this.appService.getSomethingElse();
  }

  @Get("/last-block")
  getBlock(): any {
    return this.appService.getBlock();
  }

  @Get("/block/:hash")
  getLastBlock(@Param('hash') hash: string): Promise<ethers.providers.Block> {
    return this.appService.getBlock(hash);
  }
}
