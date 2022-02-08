// import { constructMediaData, sha256FromBuffer, generateMetadata, isMediaDataVerified, Zora } from '@zoralabs/zdk'
require('dotenv').config()
const {constructMediaData,sha256FromBuffer,isMediaDataVerified,Zora,generateMetadata,constructBidShares,sha256FromHexString} = require('@zoralabs/zdk')
const {Generator} = require('@zoralabs/media-metadata-schemas')
const {Wallet,providers}= require('ethers')
// data should be passed as buffer 
const provider = new providers.InfuraProvider("rinkeby",{
    projectId: "82acffcf5a3c4987a0766b846d793dcb",
    projectSecret : "9909a8fa2ef8432a93dddaee41b67349"
})
let wallet = new Wallet('0b427d9590120f1dc8b41b821a229327ca33a0523a3cc04154c5607de20138a1');
wallet = wallet.connect(provider)
const zora = new Zora(wallet, 4)

// console.log(zora)
// const axios = require('axios')
// async function check(){
//     const totalSupply = await zora.fetchTotalMedia()
// console.log(totalSupply)
// }

// check();

// const {ipfsGet, ipfsUpload} = require('@tatumio/tatum');
/**
 * Gets data from the IPFS
 * @param id - IPFS CID of the file
 */
  // const ipfsId = await ipfsGet('QmXJJ6UF5WkF4WTJvsdhiA1etGwBLfpva7Vr9AudGMe3pj');
 
/**
 * Upload file to the IPFS storage.
 * @param file - data buffer of the file. Content Type: multipart/form-data
 * @returns ipfsHash - IPFS hash of the file
 */
// const uploadToIpfs = async ()=>{
//   const ipfsHash = await ipfsUpload('trial.mp4', 'TrialNft');
//   const ipfsId = await ipfsGet(ipfsHash);
//   // console.log(ipfsId)
// }

// uploadToIpfs()

// const axios = require('axios');

// const testAuthentication = () => {
//     const url = `https://api.pinata.cloud/data/testAuthentication`;
//     return axios
//         .get(url, {
//             headers: {
//                 pinata_api_key: '7aec58df8140ec00c355',
//                 pinata_secret_api_key: 'd458ce746f81f57d6b0e35442a39b427da61af47a0f1c3f753c78db650ff0e04'
//             }
//         })
//         .then(function (response) {
//             //handle your response here
//             console.log(response.data.message)
//         })
//         .catch(function (error) {
//             //handle error here
//         });
// };

// testAuthentication()

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(
                  '7aec58df8140ec00c355',
                  'd458ce746f81f57d6b0e35442a39b427da61af47a0f1c3f753c78db650ff0e04'
              );

//               pinata.testAuthentication().then((result) => {
//                 //handle successful authentication here
//                 console.log(result);
//             }).catch((err) => {
//                 //handle error here
//                 console.log(err);
//             });

            const fs = require('fs');
//             const readableStreamForFile = fs.createReadStream('./scripts/trial.mp4');
//             const options = {
//                 pinataMetadata: {
//                     name: "MyCustomNFT",
//                     keyvalues: {
//                         customKey: 'customValue',
//                         customKey2: 'customValue2'
//                     }
//                 },
//                 pinataOptions: {
//                     cidVersion: 0
//                 }
//             };
           
  

async function uploadFileToDecentralizedStorage(url) {
  // function that uploads buffer to decentralized storage
  // and returns url of uploaded file from a gateway.
  return new Promise((resolve,reject)=>{
      const readableStreamForFile = fs.createReadStream(url);

    pinata.pinFileToIPFS(readableStreamForFile).then((result) => {
      //handle results here
      console.log(result);
      resolve(`https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
  }).catch((err) => {
      //handle error here
      // console.log(err);
      reject(err);
  });
  })

  
}

async function uploadJsonToDecentralizedStorage(data) {
  // function that uploads buffer to decentralized storage
  // and returns url of uploaded file from a gateway.
  // const readableStreamForFile = fs.createReadStream(url);
  return new Promise((resolve,reject)=>{
    pinata.pinJSONToIPFS(data).then((result) => {
      //handle results here
      console.log(result);
      resolve(`https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
  }).catch((err) => {
      //handle error here
      // console.log(err);
      reject(err);
  });
  })
 
  
}


// test nft url
// https://ipfs.io/ipfs/QmWin1t6zXVFttWWdNQQPVtdvDJBjG9CQCjv43Ehxs7VX5




async function mintZNFT({
  // zora: typeof Zora,
  content,
  mimeType,
  name,
  description,
  previewImageUrl,
  animationUrl
}) {

 

  let metadata = {
    
    
    image:"https://gateway.pinata.cloud/ipfs/Qmc4M1MeV3jmYZ1TU19XsqKSy92qfBJaNeZY62cm1DaWqK",animation_url:"https://gateway.pinata.cloud/ipfs/Qmf2S26SASCE8m3NfKCNL2svv2TVBEHE2BvqezvwijRG7y",
    
    version: 'zora-20210101',
    name:"mitesh",
    description:"sda",
    mimeType:"video/mp4"
  }
  
// metadata = generateMetadata('zora-20210101',metadata)
// const generator = new Generator(metadata.version)
// console.log(generator.generateJSON(metadata))
// console.log(typeof(generator.generateJSON(metadata)))
// console.log(typeof(metadata))
//   const generator = new Generator(metadata.version)
// const minified = generator.generateJSON(metadata)
//   console.log("before hey")
  let contentURI = await uploadFileToDecentralizedStorage('./scripts/trial.mp4');
  // console.log(contentURI)
  // console.log("hey")
  // console.log(Buffer.from(metadata))
  let metadataURI = await uploadJsonToDecentralizedStorage(metadata);

  let buf =  fs.readFileSync('./scripts/trial.mp4')
  const contentHash = sha256FromBuffer(buf);
//   const buf = Buffer.from('someContent')
fs.writeFileSync('trial.json',JSON.stringify(metadata))
let metadataBuf = fs.readFileSync('trial.json')
let metadataHash = sha256FromBuffer(metadataBuf)
//   console.log({
//     contentURI,
//     metadataURI,
//     contentHash,
//     metadataHash
//   })
  
  const mediaData = constructMediaData(
    contentURI,
    metadataURI,
    contentHash,
    metadataHash
  );

  

//   Verifies hashes of content to ensure the hashes match
  const verified = await isMediaDataVerified(mediaData);
  if (!verified){
    throw new Error("MediaData not valid, do not mint");
  }

//   BidShares should sum up to 100%
 
    const bidShares = constructBidShares(
        10, // creator share percentage
        90, // owner share percentage
        0 // prevOwner share percentage
      );
//    console.log("error occured")
  
  
    
    console.log(bidShares)

    // }catch()
    console.log(mediaData)
  const tx = await zora.mint(mediaData, bidShares);
  console.log(tx);
  return new Promise((resolve) => {
    // This listens for the nft transfer event
    zora.media.on(
      "Transfer",
      (from, to, tokenId) => {
      if (
        from === "0x0000000000000000000000000000000000000000" &&
        to === tx.from
      ) {
        resolve(tokenId);
      }
    });
  });
}



mintZNFT(Buffer.from('./scripts/trial.mp4'),
'video/mp4',
"Special Edition Jwellery",
"A very cost jewellery item",
"https://gateway.pinata.cloud/ipfs/QmfLrBMqDcQRkAfVCGieR6jp5xdR6pzmLPxFguJNE1dTXM",
"https://gateway.pinata.cloud/ipfs/QmWin1t6zXVFttWWdNQQPVtdvDJBjG9CQCjv43Ehxs7VX5"
)

// console.log(Buffer.from('./scripts/trial.mp4'))