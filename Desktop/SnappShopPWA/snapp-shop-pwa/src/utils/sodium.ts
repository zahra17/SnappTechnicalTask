import tweetnacl from 'tweetnacl'
import util from 'tweetnacl-util'
const sealedBox = require('tweetnacl-sealedbox-js')

export class Sodium {
  private static nacl = tweetnacl

  private static util = util

  private static sealedBox = sealedBox

  constructor(private key: string) {}

  public get decodedKey() {
    return Sodium.util.decodeBase64(this.key)
  }

  seal(body: any) {
    const buffer = Buffer.from(JSON.stringify(body))
    const dataByte = Sodium.sealedBox.seal(buffer, this.decodedKey)
    return Sodium.util.encodeBase64(dataByte)
  }
}
