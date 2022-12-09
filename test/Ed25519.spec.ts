import { ethers } from "hardhat";
import chai from "chai";

import { TestEd25519 } from '../typechain';
import { verify, randomBytes } from "crypto";
import * as ed from '@noble/ed25519';

const { expect } = chai;

describe('Ed25519', () => {
    let ed25519: TestEd25519

    before('deploy Ed25519', async () => {
        const ed25519Factory = await ethers.getContractFactory('TestEd25519')
        ed25519 = (await ed25519Factory.deploy()) as TestEd25519
    })

    it('t1: regular pub, regular msg, regular sig', async () => {
        for (let i = 0; i < 1000; i++) { 
            const privateKey = ed.utils.randomPrivateKey();
            let privateKeyHex = Buffer.from(privateKey).toString('hex');
            const message = randomBytes(32);
            let messageHex = Buffer.from(message).toString('hex'); 
            const publicKey = await ed.getPublicKey(privateKey);
            let publicKeyHex = Buffer.from(publicKey).toString('hex'); 
            const signature = await ed.sign(message, privateKey);
            let signatureHex = Buffer.from(signature).toString('hex'); 
            const isValid = await ed.verify(signature, message, publicKey);
            // console.log(`publicKey: ${publicKey}`)
            const [r, s] = [publicKeyHex.substring(0, 64), signatureHex.substring(64)];
            const tx = await ed25519.verifySet(`0x${publicKeyHex}`, `0x${r}`, `0x${s}`, `0x${messageHex}`)
            const receipt = await tx.wait();
            console.log(`${i} cumulativeGasUsed: ${receipt.cumulativeGasUsed.toString()}`)
        }
   }).timeout(2000000);
    // t2: "regular pub, regular msg, invalid sig",
    // t3: "regular pub, invalid msg, regular sig"
})