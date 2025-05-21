declare module 'crypto-js' {
  namespace CryptoJS {
    interface WordArray {
      words: number[];
      sigBytes: number;
      toString(encoder?: any): string;
      concat(wordArray: WordArray): WordArray;
      clamp(): void;
      clone(): WordArray;
    }

    interface Encoder {
      parse(str: string): WordArray;
      stringify(wordArray: WordArray): string;
    }

    interface CipherParams {
      ciphertext: WordArray;
      key: WordArray;
      iv: WordArray;
      salt: WordArray;
      algorithm: any;
      mode: any;
      padding: any;
      blockSize: number;
      formatter: any;
    }

    interface AES {
      encrypt(message: string | WordArray, key: string | WordArray, cfg?: any): CipherParams;
      decrypt(cipherParams: CipherParams | string, key: string | WordArray, cfg?: any): WordArray;
    }

    interface Hex extends Encoder { }
    interface Latin1 extends Encoder { }
    interface Utf8 extends Encoder { }
    interface Utf16 extends Encoder { }
    interface Utf16BE extends Encoder { }
    interface Utf16LE extends Encoder { }
    interface Base64 extends Encoder { }

    interface HashAlgorithm {
      reset(): void;
      update(messageUpdate: WordArray | string): HashAlgorithm;
      finalize(messageUpdate?: WordArray | string): WordArray;
    }

    interface MD5 extends HashAlgorithm { }
    interface SHA1 extends HashAlgorithm { }
    interface SHA256 extends HashAlgorithm { }
    interface SHA224 extends HashAlgorithm { }
    interface SHA512 extends HashAlgorithm { }
    interface SHA384 extends HashAlgorithm { }
    interface SHA3 extends HashAlgorithm { }
    interface RIPEMD160 extends HashAlgorithm { }
    interface HmacMD5 extends HashAlgorithm { }
    interface HmacSHA1 extends HashAlgorithm { }
    interface HmacSHA256 extends HashAlgorithm { }
    interface HmacSHA224 extends HashAlgorithm { }
    interface HmacSHA512 extends HashAlgorithm { }
    interface HmacSHA384 extends HashAlgorithm { }
    interface HmacSHA3 extends HashAlgorithm { }
    interface HmacRIPEMD160 extends HashAlgorithm { }
    interface PBKDF2 extends HashAlgorithm { }
    interface EvpKDF extends HashAlgorithm { }

    interface AES {
      encrypt(message: string | WordArray, key: string | WordArray, cfg?: any): CipherParams;
      decrypt(cipherParams: CipherParams | string, key: string | WordArray, cfg?: any): WordArray;
    }

    interface DES {
      encrypt(message: string | WordArray, key: string | WordArray, cfg?: any): CipherParams;
      decrypt(cipherParams: CipherParams | string, key: string | WordArray, cfg?: any): WordArray;
    }

    interface TripleDES {
      encrypt(message: string | WordArray, key: string | WordArray, cfg?: any): CipherParams;
      decrypt(cipherParams: CipherParams | string, key: string | WordArray, cfg?: any): WordArray;
    }

    interface Rabbit {
      encrypt(message: string | WordArray, key: string | WordArray, cfg?: any): CipherParams;
      decrypt(cipherParams: CipherParams | string, key: string | WordArray, cfg?: any): WordArray;
    }

    interface RC4 {
      encrypt(message: string | WordArray, key: string | WordArray, cfg?: any): CipherParams;
      decrypt(cipherParams: CipherParams | string, key: string | WordArray, cfg?: any): WordArray;
    }

    interface RC4Drop {
      encrypt(message: string | WordArray, key: string | WordArray, cfg?: any): CipherParams;
      decrypt(cipherParams: CipherParams | string, key: string | WordArray, cfg?: any): WordArray;
    }

    interface lib {
      WordArray: {
        create(words?: number[] | ArrayBuffer | Uint8Array | Uint32Array, sigBytes?: number): WordArray;
        random(nBytes: number): WordArray;
      };
      Base: {
        extend(overrides: any): any;
      };
      Cipher: {
        extend(overrides: any): any;
      };
      StreamCipher: {
        extend(overrides: any): any;
      };
      BlockCipher: {
        extend(overrides: any): any;
      };
    }

    interface enc {
      Hex: Hex;
      Latin1: Latin1;
      Utf8: Utf8;
      Utf16: Utf16;
      Utf16BE: Utf16BE;
      Utf16LE: Utf16LE;
      Base64: Base64;
    }

    interface algo {
      MD5: MD5;
      SHA1: SHA1;
      SHA256: SHA256;
      SHA224: SHA224;
      SHA512: SHA512;
      SHA384: SHA384;
      SHA3: SHA3;
      RIPEMD160: RIPEMD160;
      HmacMD5: HmacMD5;
      HmacSHA1: HmacSHA1;
      HmacSHA256: HmacSHA256;
      HmacSHA224: HmacSHA224;
      HmacSHA512: HmacSHA512;
      HmacSHA384: HmacSHA384;
      HmacSHA3: HmacSHA3;
      HmacRIPEMD160: HmacRIPEMD160;
      PBKDF2: PBKDF2;
      EvpKDF: EvpKDF;
      AES: AES;
      DES: DES;
      TripleDES: TripleDES;
      Rabbit: Rabbit;
      RC4: RC4;
      RC4Drop: RC4Drop;
    }

    interface mode {
      CBC: any;
      CFB: any;
      CTR: any;
      CTRGladman: any;
      ECB: any;
      OFB: any;
    }

    interface pad {
      Pkcs7: any;
      AnsiX923: any;
      Iso10126: any;
      Iso97971: any;
      NoPadding: any;
      ZeroPadding: any;
    }

    interface format {
      OpenSSL: any;
      Hex: any;
    }

    interface kdf {
      OpenSSL: any;
    }

    const AES: AES;
    const DES: DES;
    const TripleDES: TripleDES;
    const Rabbit: Rabbit;
    const RC4: RC4;
    const RC4Drop: RC4Drop;
    const MD5: MD5;
    const SHA1: SHA1;
    const SHA256: SHA256;
    const SHA224: SHA224;
    const SHA512: SHA512;
    const SHA384: SHA384;
    const SHA3: SHA3;
    const RIPEMD160: RIPEMD160;
    const HmacMD5: HmacMD5;
    const HmacSHA1: HmacSHA1;
    const HmacSHA256: HmacSHA256;
    const HmacSHA224: HmacSHA224;
    const HmacSHA512: HmacSHA512;
    const HmacSHA384: HmacSHA384;
    const HmacSHA3: HmacSHA3;
    const HmacRIPEMD160: HmacRIPEMD160;
    const PBKDF2: PBKDF2;
    const EvpKDF: EvpKDF;
  }

  export = CryptoJS;
}
