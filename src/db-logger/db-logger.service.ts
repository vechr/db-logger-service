import { Injectable } from "@nestjs/common";


@Injectable({})
export class DBLoggerService {
  hello() {
    return "Hallo ini DB Logger Services"
  }
}