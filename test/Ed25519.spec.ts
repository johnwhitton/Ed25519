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

    for (const { description, pub, msg, sig, valid } of require('./ed25519-tests.json')) {
        it(description, async () => {
            const [r, s] = [sig.substring(0, 64), sig.substring(64)];
            console.log(`publicKey: 0x${pub}`)
            console.log(`publicKey: 0x${pub}`)
            const tx = await ed25519.verifySet(`0x${pub}`, `0x${r}`, `0x${s}`, `0x${msg}`)
            const receipt = await tx.wait();
            console.log( `verified: ${await ed25519.verified()}`);
            console.log(`cumulativeGasUsed: ${receipt.cumulativeGasUsed.toString()} ${description}`)
       });
    }

    it('t1: regular pub, regular msg, regular sig', async () => {
        for (let i = 0; i < 100; i++) { 
            const privateKey = ed.utils.randomPrivateKey();
            let privateKeyHex = Buffer.from(privateKey).toString('hex');
            const message = randomBytes(32);
            let messageHex = Buffer.from(message).toString('hex'); 
            const publicKey = await ed.getPublicKey(privateKey);
            let publicKeyHex = Buffer.from(publicKey).toString('hex'); 
            const signature = await ed.sign(message, privateKey);
            let signatureHex = Buffer.from(signature).toString('hex'); 
            const isValid = await ed.verify(signature, message, publicKey);
            // t1: regular pub, regular msg, regular sig'
            let [r, s] = [signatureHex.substring(0, 64), signatureHex.substring(64)];
            let tx = await ed25519.verifySet(`0x${publicKeyHex}`, `0x${r}`, `0x${s}`, `0x${messageHex}`)
            let receipt = await tx.wait();
            console.log( `t1 verified: ${await ed25519.verified()}`);
            console.log(`$t1 {i} cumulativeGasUsed: ${receipt.cumulativeGasUsed.toString()}`)
            // t2: "regular pub, regular msg, invalid sig",
            const badSignature = 'b6161c95fd4e3237b7dd12cc3052aaa69382510ecb5b89c2fbeb8b6efb78266b81160af2842235a0257fc1d3e968c2c1c9f56f117da3186effcaeda256c38a0d'.substring(0, 64)
            tx = await ed25519.verifySet(`0x${publicKeyHex}`, `0x${badSignature}`, `0x${badSignature}`, `0x${messageHex}`)
            receipt = await tx.wait();
            console.log( `t2 verified: ${await ed25519.verified()}`);
            console.log(`$t2 {i} cumulativeGasUsed: ${receipt.cumulativeGasUsed.toString()}`)
            // t3: "regular pub, invalid msg, regular sig"
            const badMessage = 'a0d8bdfd9f4d1023dae836b2e41da5019d20c60965dc40943e2c10f2ad4ee49ab0d8bdfd9f4d1023dae836b2e41da5019d20c60965dc'
            tx = await ed25519.verifySet(`0x${publicKeyHex}`, `0x${r}`, `0x${s}`, `0x${badMessage}`)
            receipt = await tx.wait();
            console.log( `t3 verified: ${await ed25519.verified()}`);
            console.log(`$t3 {i} cumulativeGasUsed: ${receipt.cumulativeGasUsed.toString()}`)
        }
   }).timeout(2000000);
    // t2: "regular pub, regular msg, invalid sig",
    // t3: "regular pub, invalid msg, regular sig"
})