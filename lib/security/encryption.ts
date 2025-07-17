import crypto from 'crypto'
import { CppSecurityBridge } from './cpp-bridge'

export interface EncryptionConfig {
  algorithm: string
  keySize: number
  ivSize: number
  tagSize: number
  iterations: number
  saltSize: number
}

export interface EncryptedData {
  data: string
  iv: string
  tag: string
  salt: string
  algorithm: string
}

export interface KeyDerivationOptions {
  password: string
  salt: Buffer
  iterations: number
  keyLength: number
  digest: string
}

export class AdvancedEncryption {
  private config: EncryptionConfig
  private cppBridge: CppSecurityBridge
  private keyCache: Map<string, Buffer> = new Map()

  constructor(config: EncryptionConfig, cppExecutable?: string) {
    this.config = config
    this.cppBridge = new CppSecurityBridge(cppExecutable)
  }

  async encryptWithPassword(data: string, password: string): Promise<EncryptedData> {
    const salt = crypto.randomBytes(this.config.saltSize)
    const key = await this.deriveKey(password, salt)
    const iv = crypto.randomBytes(this.config.ivSize)
    
    const cipher = crypto.createCipher(this.config.algorithm, key)
    cipher.setAAD(salt)
    
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const tag = cipher.getAuthTag()
    
    return {
      data: encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
      salt: salt.toString('hex'),
      algorithm: this.config.algorithm
    }
  }

  async decryptWithPassword(encryptedData: EncryptedData, password: string): Promise<string> {
    const salt = Buffer.from(encryptedData.salt, 'hex')
    const key = await this.deriveKey(password, salt)
    const iv = Buffer.from(encryptedData.iv, 'hex')
    const tag = Buffer.from(encryptedData.tag, 'hex')
    
    const decipher = crypto.createDecipher(encryptedData.algorithm, key)
    decipher.setAAD(salt)
    decipher.setAuthTag(tag)
    
    let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  async encryptFile(filePath: string, outputPath: string, password: string): Promise<void> {
    const fs = require('fs').promises
    const data = await fs.readFile(filePath, 'utf8')
    const encrypted = await this.encryptWithPassword(data, password)
    await fs.writeFile(outputPath, JSON.stringify(encrypted))
  }

  async decryptFile(filePath: string, outputPath: string, password: string): Promise<void> {
    const fs = require('fs').promises
    const encryptedData = JSON.parse(await fs.readFile(filePath, 'utf8'))
    const decrypted = await this.decryptWithPassword(encryptedData, password)
    await fs.writeFile(outputPath, decrypted)
  }

  async encryptLargeData(data: Buffer, key: Buffer): Promise<Buffer> {
    const chunkSize = 64 * 1024
    const chunks: Buffer[] = []
    
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize)
      const encrypted = await this.encryptChunk(chunk, key)
      chunks.push(encrypted)
    }
    
    return Buffer.concat(chunks)
  }

  async decryptLargeData(encryptedData: Buffer, key: Buffer): Promise<Buffer> {
    const chunkSize = 64 * 1024 + 32
    const chunks: Buffer[] = []
    
    for (let i = 0; i < encryptedData.length; i += chunkSize) {
      const chunk = encryptedData.slice(i, i + chunkSize)
      const decrypted = await this.decryptChunk(chunk, key)
      chunks.push(decrypted)
    }
    
    return Buffer.concat(chunks)
  }

  private async encryptChunk(chunk: Buffer, key: Buffer): Promise<Buffer> {
    const iv = crypto.randomBytes(this.config.ivSize)
    const cipher = crypto.createCipher(this.config.algorithm, key)
    
    const encrypted = Buffer.concat([
      cipher.update(chunk),
      cipher.final()
    ])
    
    const tag = cipher.getAuthTag()
    
    return Buffer.concat([iv, tag, encrypted])
  }

  private async decryptChunk(chunk: Buffer, key: Buffer): Promise<Buffer> {
    const iv = chunk.slice(0, this.config.ivSize)
    const tag = chunk.slice(this.config.ivSize, this.config.ivSize + this.config.tagSize)
    const encrypted = chunk.slice(this.config.ivSize + this.config.tagSize)
    
    const decipher = crypto.createDecipher(this.config.algorithm, key)
    decipher.setAuthTag(tag)
    
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ])
  }

  async deriveKey(password: string, salt: Buffer): Promise<Buffer> {
    const cacheKey = `${password}:${salt.toString('hex')}`
    
    if (this.keyCache.has(cacheKey)) {
      return this.keyCache.get(cacheKey)!
    }
    
    const key = crypto.pbkdf2Sync(
      password,
      salt,
      this.config.iterations,
      this.config.keySize,
      'sha512'
    )
    
    this.keyCache.set(cacheKey, key)
    
    setTimeout(() => {
      this.keyCache.delete(cacheKey)
    }, 5 * 60 * 1000)
    
    return key
  }

  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    return new Promise((resolve, reject) => {
      crypto.generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      }, (err, publicKey, privateKey) => {
        if (err) reject(err)
        else resolve({ publicKey, privateKey })
      })
    })
  }

  async encryptWithPublicKey(data: string, publicKey: string): Promise<string> {
    const buffer = Buffer.from(data, 'utf8')
    const encrypted = crypto.publicEncrypt(publicKey, buffer)
    return encrypted.toString('base64')
  }

  async decryptWithPrivateKey(encryptedData: string, privateKey: string): Promise<string> {
    const buffer = Buffer.from(encryptedData, 'base64')
    const decrypted = crypto.privateDecrypt(privateKey, buffer)
    return decrypted.toString('utf8')
  }

  async signData(data: string, privateKey: string): Promise<string> {
    const sign = crypto.createSign('RSA-SHA256')
    sign.update(data)
    return sign.sign(privateKey, 'base64')
  }

  async verifySignature(data: string, signature: string, publicKey: string): Promise<boolean> {
    const verify = crypto.createVerify('RSA-SHA256')
    verify.update(data)
    return verify.verify(publicKey, signature, 'base64')
  }

  async hashData(data: string, algorithm: string = 'sha256'): Promise<string> {
    return crypto.createHash(algorithm).update(data).digest('hex')
  }

  async hmacData(data: string, key: string, algorithm: string = 'sha256'): Promise<string> {
    return crypto.createHmac(algorithm, key).update(data).digest('hex')
  }

  async generateSecureRandom(length: number): Promise<Buffer> {
    return crypto.randomBytes(length)
  }

  async constantTimeCompare(a: string, b: string): Promise<boolean> {
    if (a.length !== b.length) return false
    
    const bufferA = Buffer.from(a)
    const bufferB = Buffer.from(b)
    
    return crypto.timingSafeEqual(bufferA, bufferB)
  }

  async secureWipe(buffer: Buffer): Promise<void> {
    crypto.randomFillSync(buffer)
    buffer.fill(0)
  }

  async encryptDatabase(data: any, masterKey: string): Promise<string> {
    const serialized = JSON.stringify(data)
    const compressed = await this.compressData(serialized)
    const encrypted = await this.encryptWithPassword(compressed, masterKey)
    return Buffer.from(JSON.stringify(encrypted)).toString('base64')
  }

  async decryptDatabase(encryptedData: string, masterKey: string): Promise<any> {
    const encrypted = JSON.parse(Buffer.from(encryptedData, 'base64').toString())
    const compressed = await this.decryptWithPassword(encrypted, masterKey)
    const decompressed = await this.decompressData(compressed)
    return JSON.parse(decompressed)
  }

  private async compressData(data: string): Promise<string> {
    const zlib = require('zlib')
    const compressed = zlib.gzipSync(Buffer.from(data))
    return compressed.toString('base64')
  }

  private async decompressData(data: string): Promise<string> {
    const zlib = require('zlib')
    const buffer = Buffer.from(data, 'base64')
    const decompressed = zlib.gunzipSync(buffer)
    return decompressed.toString()
  }

  clearKeyCache(): void {
    this.keyCache.clear()
  }

  destroy(): void {
    this.clearKeyCache()
    this.cppBridge.destroy()
  }
}
