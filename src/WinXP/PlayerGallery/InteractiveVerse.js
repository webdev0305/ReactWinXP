import styled from 'styled-components';
import {
  autourl,
  SLOOT_CONTRACT_ADDR,
  LOOT_CONTRACT_ADDR,
  MLOOT_CONTRACT_ADDR,
  INTERACTIVE_URI, INTERACTIVE,
  INTERACTIVE_TOKEN_URI, INTERACTIVE_TOKEN_URI2,
  TEMP_LOOT_ADDR,
  autotokenuri,
  fetchLinks, GetStartTokenType, IsStartTokenInitialized,
  processLinkarray, animationurl, defaultSelected, INTERACTIVE_VERSE, INTERACTIVE_TOKEN_URI_EXTRA, INTERACTIVE_ALPHA
  , PLAYER, playeranimationurl, mvmanimationurl, testnftlistmode, CORS_URL_B, INTERACTIVE_TOKEN_URI_ALPHA,
  PLAYERNAME, testnftaddr, PLAYERNAMES,
  testowner,
  AutoLoginToContinue, GetPlayType, SORTNFTMODE, FULL, simplexenourl, TRIAL, LUCKY, PLAYERNAMENFT, GetTweetStr, PLAYERNAMENFTS, XenoRuleURL, tweeturl, luckyplayertokens, XenoTiersURL, PC_VERSION,MAC_VERSION
} from 'lib/lib.js';

import TokenImage from './TokenImage';
import CollectableDiv from './Multiverse/CollectableDiv';

import React, { useState, useEffect, useGlobal, setGlobal } from 'reactn';

import axios from 'axios';

import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

import SyntheticLootABI from 'lib/Multiverse/json/SyntheticLoot.json';
import LootABI from 'lib/Multiverse/json/Loot.json';
import MoreLootABI from 'lib/Multiverse/json/MoreLoot.json';


import PunksABI from 'lib/Multiverse/json/punksabi.json';

import deploymentMap from 'lib/Multiverse/json/map.json';

import { getImageForLoot, itemsFromSvg } from 'lib/Multiverse/loot-util';

import { createGlobalStyle, ThemeProvider } from 'styled-components';
import original from 'react95/dist/themes/original';
import modernDark from 'react95/dist/themes/modernDark';
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

import {
  Button,
  styleReset, Select,
  TextField,
  WindowHeader,
  WindowContent,
  List,
  ListItem,
  Divider,
  Cutout,
  Toolbar,
  Panel,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableHeadCell,
  TableDataCell,
  Window,
} from 'react95';
import { Fragment } from 'react';
import { TransactionTypes } from 'ethers/lib/utils';

//#region functions

let shouldloadloots = true;

const S_LOOT = 'S_LOOT';
const M_LOOT = 'M_LOOT';
const ORIG_LOOT = 'ORIG_LOOT';


window.dosomething = function () {
  console.log('dosomething');
}

async function fetchAndSetOwner(contract, tokenId) {
  if (typeof window.ethereum !== 'undefined') {
    console.log('fetching token owner');

    try {
      const data = await contract.ownerOf(Number(tokenId));
      console.log('token Owner: ', data);
      //setGlobal({extradata:data})
      return data;
    } catch (err) {
      console.log('token Owner Error: ', err);
    }
  } else {
    console.log('ethereum api not detected');
    return null;
  }

  return null;
}

async function resizeImage(dataUrl, targetFileSizeKb, maxDeviation = 1) {
  let originalFile = await urltoFile(dataUrl, 'test.png', 'image/png');
  if (originalFile.size / 1000 < targetFileSizeKb) return dataUrl; // File is already smaller

  let low = 0.0;
  let middle = 0.5;
  let high = 1.0;

  let result = dataUrl;

  let file = originalFile;

  while (Math.abs(file.size / 1000 - targetFileSizeKb) > maxDeviation) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = document.createElement('img');

    const promise = new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
    });

    img.src = dataUrl;

    await promise;

    canvas.width = Math.round(img.width * middle);
    canvas.height = Math.round(img.height * middle);
    context.scale(canvas.width / img.width, canvas.height / img.height);
    context.drawImage(img, 0, 0);
    file = await urltoFile(canvas.toDataURL(), 'test.png', 'image/png');

    if (file.size / 1000 < targetFileSizeKb - maxDeviation) {
      low = middle;
    } else if (file.size / 1000 > targetFileSizeKb) {
      high = middle;
    }

    middle = (low + high) / 2;
    result = canvas.toDataURL();
  }

  return result;
}



function urltoFile(url, filename, mimeType) {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
}

async function GetLootImage(contractin, tokenidin) {
  const tokenURIB64 = await contractin.tokenURI(tokenidin);
  console.log('fetched loot');

  console.log(tokenURIB64);

  const tokenURI = JSON.parse(
    Buffer.from(tokenURIB64.split(',')[1], 'base64').toString('utf8'),
  );
  const b64svg = tokenURI.image;

  const svg = Buffer.from(b64svg.split(',')[1], 'base64').toString('utf8');

  const items = itemsFromSvg(svg);
  console.log(items);

  const img = await getImageForLoot(items);
  let characterImg = (characterImg = await resizeImage(img, 10, 1));

  console.log(characterImg);

  return {
    lootid: tokenidin,
    img: characterImg,
    items: items,
  };
}



async function GetTokenURI(contractin, tokenidin) {

  if (typeof window.ethereum !== 'undefined') {
    console.log('fetching token id uri');

    try {
      let data = await contractin.tokenURI(tokenidin);
      data = autotokenuri(data);
      console.log('token URI: ', data);
      //setGlobal({extradata:data})

      return data;
    } catch (err) {
      console.log('token URI Error: ', err);
    }
  } else {
    console.log('ethereum api not detected');
    return '';
  }
}


async function GetTokenMetaData_Image(url) {
  //get the token uri

  //await
  console.log('axios', url);

  var response = await axios
    .get(url, {
      responseType: 'json',
    });

  var data = response.data;

  console.log('response data');
  console.log(data);



  return data;


}




async function FetchLootBalance(contractin, addressin) {
  if (typeof window.ethereum !== 'undefined') {
    console.log('fetching loot balance for user: ', addressin);

    try {
      const data = await contractin.balanceOf(addressin);
      console.log('user loot balance: ', data);
      return data;
    } catch (err) {
      console.log('user balance Error: ', err);
    }
  } else {
    console.log('ethereum api not detected');
    return 0;
  }
}

async function FetchUserLootList(contractin, balanceinput, addressin) {
  if (typeof window.ethereum !== 'undefined') {
    console.log('fetching loot balance for user: ', addressin);

    try {
      let tokenids = [];

      for (let i = 0; i < balanceinput; i++) {
        const data = await contractin.tokenOfOwnerByIndex(addressin, i);
        tokenids.push(data.toNumber());
      }

      console.log('all loot tokens', tokenids);

      return tokenids;
    } catch (err) {
      console.log('fetch tokens Error: ', err);
    }
  } else {
    console.log('ethereum api not detected');
    return [];
  }
}

async function GetAllLoot(contractin, addressin) {
  if (typeof window.ethereum !== 'undefined') {
    let balanceinput = await FetchLootBalance(contractin, addressin);
    let lootlist = await FetchUserLootList(contractin, balanceinput, addressin);
    console.log('loot list');
    console.log(lootlist);
    return lootlist;
  }
}
//#endregion



//--fetch xeno count----------------------------------------------------------------------------

async function fetchXenoCount(contractin, address) {
  if (typeof window.ethereum !== 'undefined') {
    console.log('fetching balance for user: ', address);

    try {
      const data = await contractin.balanceOf(address);
      console.log('user balance: ', data);
      return data.toNumber();
    } catch (err) {
      console.log('user balance Error: ', err);
    }
  } else {
    console.log('ethereum api not detected');
  }

  return 0;
}

async function fetchXenoTokens(contractin,address, balanceinput) {
  if (typeof window.ethereum !== 'undefined') {
    console.log('fetching tokens for user: ', address);

    try {
      let tokenids = [];

      for (let i = 0; i < balanceinput; i++) {
        const data = await contractin.tokenOfOwnerByIndex(address, i);
        tokenids.push(data.toNumber());
      }

      console.log('all tokens', tokenids);

      return tokenids;
    } catch (err) {
      console.log('fetch tokens Error: ', err);
    }
  } else {
    console.log('ethereum api not detected');
    return [];
  }

  return [];
}


async function fetchXenoCountPhase2Only(contractin, address) {

  if (typeof window.ethereum !== 'undefined') {

    try {

      let bal = await fetchXenoCount(contractin,address);

      let xenotokens=[];

      if (bal > 0) {
        xenotokens=await fetchXenoTokens(contractin,address,bal);
      }

      let phase2count=0;

      for(let i=0;i<xenotokens.length;i++){
        if(xenotokens[i]>=2556){
          phase2count++;
        }
      }

      return phase2count;
    } catch (err) {
      console.log('user balance Error: ', err);
    }
  } else {
    console.log('ethereum api not detected');
  }

  return 0;
}


//--fetch xeno count----------------------------------------------------------------------------


const InteractiveVerse = ({
  url,
  allTokens,
  token,
  ownerinput,
  userpreviewmodein,
  viewTokenFn
  , selectedStartMVM
  , selectedStartPlayer
  , selectStartFn, viewBasicTokenFn,
  selectStartTokenFn,JumpToPlay
  , mode
}) => {
  //#region interactive

  const [dappState, setDappState] = useGlobal();

  const stateProvider = dappState.provider;
  const contract = dappState.contract;

  var address = dappState.address;

  if (testowner) {
    address = "0xa894eb186bd18eb80789bf7b7c48fe83a6146332";
    selectedStartMVM.type = FULL;
  }

  const mvmcontract = dappState.mvmcontract;
  const playercontract = dappState.playercontract;

  //temp address[]

  //#region synthloot

  //const [_slContract, setSLContract] = useState(null);
  //const [character, setCharacter] = useState(null);

  let punkoption = 'Cryptopunks (Experimental)';


  const [nftoptions, SetNFTOptions] = useState([{
    name: 'loading...',
    addr: 'loading'
  }]);


  const [tweetResult, SetTweetResult] = useState("");
  const [punkText, SetPunkText] = useState("");


  const [punkEnter, SetPunkEnter] = useState('0');


  const [startMVM, SetStartMVM] = useState(selectedStartMVM);
  const [startPlayer, SetStartPlayer] = useState(selectedStartPlayer);


  const [allnfts, SetAllNFT] = useState([]);
  const [selectedOption, SetSelectedOption] = useState();

  window.allnft = allnfts;


  const [optionDic, SetOptionDic] = useState({});



  const [lootList, setLootList] = useState([]);
  const [nftList, setNFTList] = useState([]);
  const [moreLoostList, setMoreLoostList] = useState([]);
  const [synthLoot, setSynthLoot] = useState(null);
  const [interactiveURI, SetInteractiveURI] = useState(INTERACTIVE_TOKEN_URI2);//INTERACTIVE_URI

  const [loading, SetLoading] = useState(true);

  const defaultmessage = 'ＰｕⓃķ𝕤 & MORE soon... ♖';

  const [specialMessage, SetSpecialMessage] = useState(defaultmessage);

  const [owner, SetOwner] = useState(ownerinput);
  const [userPreviewMode, SetUserPreviewMode] = useState(userpreviewmodein);
  //const [userPreviewMode,SetUserPreviewMode] = useState(false);

  const [links, SetLinks] = useState([]);
  const [dynamicLinks, SetDynamicLinks] = useState([]);

  const [fullScreen, SetFullScreen] = useState(false);

  const defaultselectedItem = {
    name: '',
    ltype: 'unknown',
    lootid: -1,
    img: null,
    items: [],
  };

  const [selectedItem, SetSelectedItem] = useState(defaultselectedItem);

  console.log('selectedItem', selectedItem);


  function setPunkTextEnter(e) {
    var value = e.target.value;

    if (Number(value)) {

      SetPunkEnter(value);

      //setBuyamount(value);
      //setBuyamount(e.target.value);
    }
  }


  //---------------------------------------------------------------------------------interact webgl pass data

  window.dosomethingtoo = function () {
    console.log('dosomethingtoo');
  }



  window.testfunction = function () {
    return 5;
  }

  window.GetUser = function () {
    return address;
  }

  window.GetCurrentPlanet = function () {
    return selectedStartMVM.token;
  }

  window.GetCurrentPlayer = function () {
    return selectedStartPlayer.token;
  }

  window.GetLinks = async function (tokenin) {

    let linkarray = await fetchLinks(mvmcontract, tokenin, 0);
    let dynamiclinkarray = await fetchLinks(mvmcontract, tokenin, 1);

    if (testnftlistmode) {
      return { links: [0, 1, 2], dlinks: [4, 5] };
    }

    let linkfilter = linkarray.filter(e => e < 8000);
    let dynamiclinkarrayfilter = dynamiclinkarray.filter(e => e < 8000);


    return { links: linkfilter, dlinks: dynamiclinkarrayfilter };
  }


  //----------------------------------------------------------------------------------


  window.GetXenoCount = async function () {
    //return await fetchXenoCountPhase2Only(contract,address);
    return await fetchXenoCount(contract,address);
  }

  window.GetXenoCountAddr = async function (addr) {
    //return await fetchXenoCountPhase2Only(contract,addr);
    return await fetchXenoCount(contract,addr);
  }
  //----------------------------------------------------------------------------------


  window.GetNFTs = async function (addressin) {
    return await GetNFTOptions(addressin);
  }

  window.GetPlanetOwner = async function (tokenID) {

    if (typeof window.ethereum !== 'undefined') {

      console.log('fetching token owner');

      try {
        const data = await mvmcontract.ownerOf(tokenID);
        console.log('got a planets owner: ', data);
        return data;
      } catch (err) {
        console.log('token Owner Error: ', err);
      }

    }

    return '';
  }

  window.GetThePlayType = async function () {

    var playertype = startPlayer.type;
    var mvmtype = startMVM.type;

    return await GetPlayType(mvmtype, playertype);
  }


  window.CallJS = async function (jsonstr) {

    var jsonobj = JSON.parse(jsonstr.replace(/'/g, '"'));
    // var jsonobj=JSON.parse(jsonstr);
    var command = jsonobj.command;

    console.log("parent is going to do something now for index.html, ", jsonstr);

    let result = {};

    switch (command) {
      case 'GetUser':
        console.log('get user', result);
        result = address;
        break;
      case 'GetLinks':
        result = (await window.GetLinks(jsonobj.token));
        break;
      case 'GetNFTs':
        let nftresult = (await GetNFTListForUser(jsonobj.address));

        //process this one to a list

        result = [];
        for (let i = 0; i < nftresult.nftlist.length; i++) {

          //temporary (most of the nfts, not all)

          if (nftresult.nftlist[i].img != null) {
            result.push(nftresult.nftlist[i].img);
          }

        }

        break;
      case 'GetPlanetOwner':
        result = (await window.GetPlanetOwner(jsonobj.token));
        break;


      case 'TriggerAutoLogin':
        result = (await LocalAutoLoginToContinue());
        break;

      case 'GetCurrentPlanet':
        result = (window.GetCurrentPlanet());
        break;

      case 'GetCurrentPlayer':
        result = (window.GetCurrentPlayer());
        break;

      case 'GetPlayType':
        result = (await window.GetThePlayType());
        break;

      case 'GetXenoCount':
        result= (await window.GetXenoCount());
        break;

      default:
        result = {};
    }

    return {
      ...jsonobj,
      result: result
    }

  }


  window.SendResultBack = function (input, result) {
    console.log('sending back result');

    const frame = document.getElementById('interactiveframe');
    frame.contentWindow.postMessage({
      input: input,
      result: result,
      calltype: 'sendresult'
    }, '*');
  }



  //---------------------------------------------------------------------------------interact webgl pass data










  async function OnClickItem(item) {

    console.log('onselect', item);
    SetSelectedItem(item);

  }



  async function LocalAutoLoginToContinue() {

    /* 
        if(!waiting_for_login_result){
          waiting_for_login_result=true;
     */
    let result = await AutoLoginToContinue(stateProvider, address, ethers);

    //alert(result.address+":"+result.signature);

    console.log('autologin: ' + result.address + ":" + result.signature);
    /* 
          waiting_for_login_result=false;
        }
     */
    return result;
  }

  //PunksABI


  async function GetPunkOwner(punkid) {


    if (typeof window.ethereum !== 'undefined') {

      try {
        let provider = stateProvider;

        let punkcontract = new ethers.Contract(
          "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
          PunksABI,
          provider
        );

        console.log('fetching punk owner: ', punkid);

        const data = await punkcontract.punkIndexToAddress(punkid);

        console.log('punk owner: ' + data);
        return data;

      } catch (err) {
        console.log('punk Error: ', err);
      }
    } else {
      console.log('ethereum api not detected');
    }

    return "";

  }


  async function AutoSummonPunk(id) {

    try {

      var testmode = false;

      if (isNaN(id)) {
        SetPunkText("Enter Number");
        return;
      }

      if (testmode) {
        // alert('input is' + id);
      }
      let idnum = parseInt(id);


      if (idnum > 9999 || idnum < 0) {
        SetPunkText("Out of range");
        return;
      }


      let basepunkuri = "https://www.larvalabs.com/cryptopunks/cryptopunk";//8050.png

      let currentaddress = address;
      let owneraddress = await GetPunkOwner(idnum);

      if (testmode) {
        currentaddress = owneraddress;
        //alert('address is', owneraddress);
      }

      if (currentaddress.toUpperCase() == owneraddress.toUpperCase()) {
        //summon punk
        let str = idnum + "";

        let theurl = basepunkuri + str.padStart(4, '0') + ".png";

        if (testmode) {
          // alert('summoning');
          //alert(theurl);
        }

        await DirectCallNFTSimple(theurl);

        SetPunkText("Owner verified");

      } else {
        SetPunkText("You're not owner");
      }

    } catch (ex) {
      SetPunkText("Some Error");
    }

  }

  window.Direct = DirectCallNFTSimple;

  window.AutoSummonPunk = AutoSummonPunk;

  async function LoadEntireLootBags(provider, addressin) {
    let lootcontract = new ethers.Contract(
      LOOT_CONTRACT_ADDR,
      LootABI,
      provider,
    );

    let mlootcontract = new ethers.Contract(
      MLOOT_CONTRACT_ADDR,
      MoreLootABI,
      provider,
    );

    let slootcontract = new ethers.Contract(
      SLOOT_CONTRACT_ADDR,
      SyntheticLootABI,
      provider,
    );

    //testing here with simple lootlist.

    //=======================================================
    //original
    var lootlist = await GetAllLoot(lootcontract, addressin);



    //=======================================================



    var mlootlist = await GetAllLoot(mlootcontract, addressin);
    var slootlist = [addressin];
    //call all loot images

    var promiseLoots = [];
    var promiseMoreLoots = [];

    var lootshowlist = [];
    var mlootshowlist = [];

    var selectedNFT = null;

    for (let i = 0; i < lootlist.length; i++) {
      promiseLoots.push(GetLootImage(lootcontract, lootlist[i]));
    }

    for (let i = 0; i < mlootlist.length; i++) {
      promiseMoreLoots.push(GetLootImage(mlootcontract, mlootlist[i]));
    }

    var selectedNFT = await GetLootImage(slootcontract, addressin);
    selectedNFT.name = 'Ⓢynthetic';
    selectedNFT.ltype = 'sloot';

    //test
    lootshowlist = (await Promise.all(promiseLoots)).map(item => {
      return {
        ...item,
        name: 'Ⓛ ' + item.lootid,
        ltype: 'loot',
      };
    });
    mlootshowlist = (await Promise.all(promiseMoreLoots)).map(item => {
      return {
        ...item,
        name: 'Ⓣ ' + item.lootid,
        ltype: 'mloot',
      };
    });

    //setup the lists
    console.log('show all the lists');
    console.log(lootshowlist);
    console.log(mlootshowlist);
    console.log(selectedNFT);

    setLootList(lootshowlist);
    setMoreLoostList(mlootshowlist);
    setSynthLoot(selectedNFT);

    //all the loots setup here.
    //set synth loot first

    SetSelectedItem(selectedNFT);
    SetLoading(false);
    SetSpecialMessage('');
  }

  function imageToUri(url, callback) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let base_image = new Image();
    base_image.src = url;
    base_image.crossOrigin = "anonymous";
    base_image.onload = function () {
      canvas.width = base_image.width;
      canvas.height = base_image.height;

      ctx.drawImage(base_image, 0, 0);
      callback(canvas.toDataURL('image/png'));

      canvas.remove();
    }
  }

  async function DirectCallNFTSimple(url) {

    console.log('summoning url');

    let lootinput = {
      calltype: 'loadnft',
      imgurl: autourl(url)
    };

    console.log('summoning: ', lootinput);

    try {

      const frame = document.getElementById('interactiveframe');

      frame.contentWindow.postMessage(lootinput, '*');

    } catch (ex) {
      console.log(ex);
    }
  }

  async function DirectCallNFTURL(selecteditem) {

    console.log('summoning url');
    //let imginput="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
    let lootinput = {
      ...selecteditem,
      calltype: 'loadnft',
      imgurl: autourl(selecteditem.jsondata.image)
    };

    console.log('summoning: ', lootinput);

    try {

      const frame = document.getElementById('interactiveframe');

      frame.contentWindow.postMessage(lootinput, '*');
      // document.getElementById('interactiveframe').contentWindow.CallFunction(imginput);

    } catch (ex) {
      console.log(ex);
    }
  }

  async function Fullscreen() {

    console.log('summoning url');

    let theinput = {
      calltype: 'fullscreen'
    };

    try {

      const frame = document.getElementById('interactiveframe');

      frame.contentWindow.postMessage(theinput, '*');

    } catch (ex) {
      console.log(ex);
    }
  }


  async function SummonXeno() {

    console.log('summoning xeno');

    let theinput = {
      calltype: 'summonxeno'
    };

    try {

      const frame = document.getElementById('interactiveframe');

      frame.contentWindow.postMessage(theinput, '*');

    } catch (ex) {
      console.log(ex);
    }
  }


  async function SummonNFT(selecteditem) {
    if (selecteditem.jsondata != null) {
      DirectCallNFTURL(selecteditem);
    }

  }

  async function DirectSummonNFT(loot) {


    console.log('summoning loot');
    //let imginput="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
    let lootinput = {
      ...loot,
      calltype: 'summon',
    };

    const frame = document.getElementById('interactiveframe');
    frame.contentWindow.postMessage(lootinput, '*');
    // document.getElementById('interactiveframe').contentWindow.CallFunction(imginput);
  }


  function SwitchPreviewMode(mode) {
    setLootList([]);
    setMoreLoostList([]);
    setSynthLoot(null);

    SetSelectedItem(defaultselectedItem);

    SetUserPreviewMode(!userPreviewMode);

    SetSpecialMessage(defaultmessage);
  }

  function SwitchFullScreen() {
    SetFullScreen(!fullScreen);
  }

  function SeeToken() {

  }


  async function AddImageForJsonNull(tokens) {

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].jsondata == null) {

        /*         tokens[i].promisejson = axios.get(tokens[i].token_uri, {
                  responseType: 'json',
                }); */

        tokens[i].promisejson = axios.get(CORS_URL_B + tokens[i].token_uri, {
          responseType: 'json',
        }).catch(function (error) {
          console.log("error getting image for json null: " + tokens[i].token_uri);
        });

        console.log("getting theresponse null json", tokens[i].token_uri);
        //thenulls.push(tokens[i]);
        //tokens[i].img = autourl(tokens[i].jsondata.image);

      }
    }

    //has cors error too (could be null sometimes)
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].jsondata == null) {
        //await
        try {
          tokens[i].jsondata = (await tokens[i].promisejson).data;
          console.log("got theresponse jsondata", tokens[i].jsondata);
        } catch (ex) {
          console.log("got theresponse jsondata error", ex);
        }
      }
    }



  }

  let REMOVEGIF = true;
  let REMOVENULL = true;

  async function GetNFTListForUser(addressin) {


    if (testnftlistmode) {
      addressin = testnftaddr;
    }

    var url = "https://deep-index.moralis.io/api/v2/" + addressin + "/nft?chain=eth&format=decimal";

    console.log('getting nft for specific user:', url);

    var response = await axios
      .get(url, {
        responseType: 'json',
        headers: {
          'X-API-Key': '6ZefulfPKhxXL8BpNg6kQV2pWXwqBwEWpKayaT6CT5Gl9YT5DRYUsZdSYM6eMp5o'
        }
      });

    var data = response.data;

    var tokens = data.result;

    console.log('test get nft data for ' + addressin, data);

    var theoptions = [];
    var duplicatecheck = [];

    /* 
        theoptions.push({
          name: 'All',
          addr: ''
        });
     */
    for (let i = 0; i < tokens.length; i++) {

      if (!duplicatecheck.includes(tokens[i].name)) {

        duplicatecheck.push(tokens[i].name);

        theoptions.push({
          name: tokens[i].name,
          addr: tokens[i].token_address
        });
      }

    }

    /* 
        theoptions.push({
          name: 'Synthetic Loot (In Development)',
          addr: ''
        });
     */
    theoptions.push({
      name: 'Crypto Punks (In Dev - 1 Month)',
      addr: ''
    });


    for (let i = 0; i < tokens.length; i++) {
      tokens[i].jsondata = JSON.parse(tokens[i].metadata);
      console.log('jsondata', tokens[i].jsondata);
      /* 
            if (tokens[i].jsondata != null) {
              tokens[i].img = autourl(tokens[i].jsondata.image);
            } */
      //set toggle to tell if its src mode
      tokens[i].imgsrcmode = 'link';
    }

    console.log('allnft', tokens);

    AddImageForJsonNull(tokens);

    for (let i = 0; i < tokens.length; i++) {

      if (tokens[i].jsondata != null) {
        tokens[i].img = autourl(tokens[i].jsondata.image);
      }
    }

    //if the json data is null, then just remove those

    if (REMOVENULL) {
      tokens = tokens.filter(item => (item.img != null && item.jsondata != null));

      console.log('filter null', tokens);
    }


    if (REMOVEGIF) {
      tokens = tokens.filter(item => !item.img.toUpperCase().includes(".GIF"));
      console.log('filter gif', tokens);
    }


    /* 
        if (testnftlistmode) {
    
          let result = [];
          for (let i = 0; i < 50; i++) {
    
            result.push(tokens[i]);
          }
          tokens = result;
        }
     */

    if (SORTNFTMODE) {
      console.log('sorting');

      tokens.sort(function (a, b) {

        try {
          return Number(b.block_number) - Number(a.block_number);
        } catch (ex) {
          return true;
        }

      });

    }

    console.log('allnftforuser sorted', tokens);

    return {
      options: theoptions,
      nftlist: tokens
    }
  }

  /* 
    } */


  async function GetNFTOptions(addressin) {


    var url = "https://deep-index.moralis.io/api/v2/" + addressin + "/nft?chain=eth&format=decimal";

    console.log('getting nft options:', url);

    var response = await axios
      .get(url, {
        responseType: 'json',
        headers: {
          'X-API-Key': '6ZefulfPKhxXL8BpNg6kQV2pWXwqBwEWpKayaT6CT5Gl9YT5DRYUsZdSYM6eMp5o'
        }
      });

    var data = response.data;

    var tokens = data.result;

    console.log('test get nft data', data);

    var theoptions = [];
    var duplicatecheck = [];

    /* 
        theoptions.push({
          name: 'All',
          addr: ''
        });
     */
    for (let i = 0; i < tokens.length; i++) {

      if (!duplicatecheck.includes(tokens[i].name)) {

        duplicatecheck.push(tokens[i].name);

        theoptions.push({
          name: tokens[i].name,
          addr: tokens[i].token_address
        });
      }

    }

    /* 
        theoptions.push({
          name: 'Synthetic Loot (In Development)',
          addr: ''
        });
    
        theoptions.push({
          name: 'Crypto Punk (In Development)',
          addr: ''
        });
    
     */


    theoptions.push({
      name: punkoption,
      addr: punkoption
    });

    theoptions.push({
      name: '#Load From NFT Contract Address (In Dev - 1 Month)',
      addr: ''
    });

    theoptions.push({
      name: '#Gif Format (In Dev - 1 Month)',
      addr: ''
    });
    /* 
        theoptions.push({
          name: '#Crypto Punks (In Dev - 1 Month)',
          addr: ''
        }); */

    theoptions.push({
      name: '#Synth Loot/Loot (In Dev - 1 Month)',
      addr: ''
    });





    SetNFTOptions(theoptions);

    //set the option later



    //add images to tokens (temporarily just use the historical data from this)
    //totally temporary (tweak this to load dynamic metadata that isn't cached)

    for (let i = 0; i < tokens.length; i++) {
      tokens[i].jsondata = JSON.parse(tokens[i].metadata);
      console.log('jsondata', tokens[i].jsondata);
      /* 
            if (tokens[i].jsondata != null) {
              tokens[i].img = autourl(tokens[i].jsondata.image);
            } */
      //set toggle to tell if its src mode
      tokens[i].imgsrcmode = 'link';
    }

    console.log('allnft', tokens);

    AddImageForJsonNull(tokens);

    for (let i = 0; i < tokens.length; i++) {
      /*       tokens[i].jsondata = JSON.parse(tokens[i].metadata);
            console.log('jsondata', tokens[i].jsondata); */

      if (tokens[i].jsondata != null) {
        tokens[i].img = autourl(tokens[i].jsondata.image);
      }
      /*       //set toggle to tell if its src mode
            tokens[i].imgsrcmode = 'link'; */
    }


    if (SORTNFTMODE) {
      console.log('sorting');

      tokens.sort(function (a, b) {

        try {

          return Number(b.block_number) - Number(a.block_number);

        } catch (ex) {
          return true;

        }

      });
    }

    console.log('allnft sorted', tokens);

    SetAllNFT(tokens);

    //set the option here

    if (theoptions.length > 0) {
      SetSelectedOption(theoptions[0].addr);
      //set selected nft
      /*       let items=tokens.filter(nft => nft.token_address == theoptions[0].addr);
            let item=items[0];
            console.log('selecteditems',items);
            SetSelectedItem({...item,name: item.jsondata?item.jsondata.name:""}); */

      SetFirstOptionItem(tokens, theoptions[0]);

    } else {
      SetSelectedOption(null);
    }

  }

  function SetFirstOptionItem(nftlist, option) {

    let items = nftlist.filter(nft => nft.token_address == option.addr);
    let item = items[0];
    console.log('selecteditems', items);

    try {
      console.log('first item is', item);
      SetSelectedItem({ ...item, name: item.jsondata ? item.jsondata.name : "" });

    } catch {

    }
  }




  function handleChange(input) {
    console.log('dropdown', input);
    console.log('dropdown2', input.target.value);
    SetSelectedOption(input.target.value);
    /* SetFirstOptionItem(allnfts,input.target.value); */
  }

  //loading loots
  useEffect(() => {
    if (window.ethereum != null && stateProvider != null) {

      if (testnftlistmode) {
        GetNFTOptions(testnftaddr);
      } else {
        GetNFTOptions(address);
      }

      /* SetSelectedItem(selectedNFT); */
      SetLoading(false);
      SetSpecialMessage('');

      /*     return;
    
          SetLoading(true);
    
          if (!shouldloadloots) {
            return;
          }
    
          //detect the address of user
    
          let addressinput = TEMP_LOOT_ADDR;
    
          if (userPreviewMode) {
            //default mode uses user's address
            if (address != null && address != '') {
              addressinput = address;
            }
          } else {
            //owner preview mode uses owner's address
            if (owner != null && owner != '') {
              addressinput = owner;
            }
          }
    
          LoadEntireLootBags(stateProvider, addressinput); */
    }
  }, [stateProvider, address, owner, userPreviewMode]);

  useEffect(() => {
    async function OnSwapToken() {
      let uribase = INTERACTIVE_TOKEN_URI2;

      let tokentouse = "";

      if (mode == INTERACTIVE_VERSE) {


        uribase = INTERACTIVE_TOKEN_URI_EXTRA;
        //tokenseed=1&mvmid=5;
        tokentouse = selectedStartPlayer.token + "&mvmid=" + selectedStartMVM.token;


      } else if (mode == INTERACTIVE_ALPHA) {


        uribase = INTERACTIVE_TOKEN_URI_ALPHA;
        //tokenseed=1&mvmid=5;
        tokentouse = selectedStartPlayer.token + "&mvmid=" + selectedStartMVM.token;


      }

      else {
        //tokenseed=1
        tokentouse = token;
      }

      if (window.ethereum != null && stateProvider != null) {
        if (token != null) {


          SetInteractiveURI(uribase + tokentouse);

        }

        if (owner == null) {
          //null owner means random input, should load owner
          let returnval = await fetchAndSetOwner(contract, token);
          //no owner then fetch owner of token
          SetOwner(returnval);
        }
      }
    }

    async function fetchsetlinks() {
      console.log('fetching links of tokens');

      if (allTokens != null && token != null) {
        let linkarray = await fetchLinks(contract, token, 0);
        let dynamiclinkarray = await fetchLinks(contract, token, 1);

        let formattedarray1 = processLinkarray(allTokens, linkarray);
        let formattedarray2 = processLinkarray(allTokens, dynamiclinkarray);

        SetLinks(formattedarray1);
        SetDynamicLinks(formattedarray2);
      }
    }

    OnSwapToken();
    /*   fetchsetlinks(); */



  }, [token]); //if any of these have changed







  console.log('interactive url:' + interactiveURI);




  //INTERACTIVE_TOKEN_URI

  //#endregion
  //#endregion

  function SwapPage(newtoken) {
    console.log('view token', newtoken);
    if (newtoken < 0) {
      return;
    } else if (newtoken >= allTokens.length) {
      return;
    } else {
      viewTokenFn(newtoken.toString());
    }
  }

  function ChangeStartItem(origtoken) {

  }



  function GetTweetLink() {
    let tokentouse = "";
    if (mode == INTERACTIVE_VERSE || mode == INTERACTIVE_ALPHA) {
      tokentouse = selectedStartPlayer.token;
    } else {
      //tokenseed=1
      tokentouse = token;
    }
    /* 
        let str = "https://twitter.com/intent/tweet?hashtags=XenoInfinity&screen_name=XenoInfinity&text=Summon X-XENO " + tokentouse + ""; */

    let str = GetTweetStr(tokentouse);

    let encoded = encodeURI(str);

    /*
    https://twitter.com/intent/tweet?hashtags=demo&original_referer=https%3A%2F%2Fdeveloper.twitter.com%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Eshare%7Ctwgr%5E&related=twitterapi%2Ctwitter&text=Hello%20world&url=https%3A%2F%2Fexample.com%2Ffoo&via=twitterdev

    */

    return encoded;
  }

  /* window.
  DirectCallNFTSimple=DirectCallNFTSimple; */
  async function CheckTweets() {

    if (tweeturl != "") {

      SetTweetResult("(Searching for Tweet...)");

      console.log('axios', url);

      var response = await axios.get(tweeturl, {
        responseType: 'json'
      });

      var tweets = response.data;

      console.log('tweet response data:');
      console.log(tweets);

      let playerid = "";


      if (mode == INTERACTIVE_VERSE || mode == INTERACTIVE_ALPHA) {
        playerid = selectedStartPlayer.token;
      } else {
        //tokenseed=1
        playerid = token;
      }



      let playercheckstring = "[" + playerid + "]";
      console.log('playerid is' + playercheckstring);

      let playercansummon = false;

      //if player can summon
      for (let i = 0; i < tweets.length; i++) {
        let tweet = tweets[i];

        if (tweet.includes(playercheckstring)) {
          playercansummon = true;
          break;
        }

      }

      //summon xeno
      if (playercansummon) {
        // alert('summoning');

        //handle depending on mode

        if (mode == INTERACTIVE_VERSE || mode == INTERACTIVE_ALPHA) {
          SummonXeno();
        } else {
          DirectCallNFTSimple(simplexenourl);
        }

        SetTweetResult("(Tweet detected)");
      } else {
        /*         alert('nope');
                alert(tweets); */
        SetTweetResult("(Not detected, try the tweet again)");
      }

    }

  }



  //window.GetThePlayType 

  //loading loots
  useEffect(() => {

    async function dosomething() {

      console.log("play type: ", (await window.GetThePlayType()));
    }
    dosomething();


  }, [startMVM, startPlayer]);

  useEffect(() => {
    if (testnftlistmode) {
      console.log('testing get nft list for user');
      GetNFTListForUser(testnftaddr)
    }

  });







  return (
    <Div style={{ height: fullScreen ? '150%' : '100%', width: '100%' }}>

      <div className="MainDiv">
        <Panel variant="well" className="interactive">
          {/* 
          <span>Mode: {mode}</span> */}

          {interactiveURI == INTERACTIVE_TOKEN_URI2 && (
            <span>Loading... (interactive requires metamask to load, please reboot after connection)</span>
          )}
          {interactiveURI == INTERACTIVE_TOKEN_URI_EXTRA && (
            <span>Loading... (interactive Metaverse requires metamask to load, please reboot after connection)</span>
          )}

          {(interactiveURI != INTERACTIVE_TOKEN_URI2
            &&
            interactiveURI != INTERACTIVE_TOKEN_URI_EXTRA)
            && (
              <iframe id="interactiveframe" className={"interactiveframehint"} src={interactiveURI} title=""></iframe>
            )}

          <div className='hintdiv'>


            Use 'Load NFT' to <span className='highlight'>load your NFTs into the {PLAYERNAMENFT} Screen</span> and set it as your Avatar, experience the open metaverse.
            {(mode == INTERACTIVE) && (
              <Fragment>
                (<span className='highlight'>ESC:</span> free up cursor to select NFT) (<span className='highlight'>WASD:</span> move around).
              </Fragment>
            )}

            {(mode == INTERACTIVE_VERSE || mode == INTERACTIVE_ALPHA) && (
              <Fragment>
                (<span className='highlight'>C:</span> free up cursor to select NFT) (<span className='highlight'>WASD:</span> move around).
              </Fragment>
            )}

            {(startPlayer.type != FULL)
              && (
                <Fragment>
                  &nbsp;<span className='highlight'>Mint {PLAYERNAMENFT} to get unlimited travel time</span>, start from any simulation planet, and get super boosted launch star batteries, details <a className='atierlink' href={XenoTiersURL} target="_blank">here</a>
                </Fragment>
              )}


          {( mode == INTERACTIVE_ALPHA) && (
              <Fragment>
                (<span className='highlight'>F:</span> Enter Flymode), Download the PC/Mac Version for <span className='highlight'>better graphics and SECRET Multiverse Region</span>
              </Fragment>
            )}

            {(tweeturl != "") && (

              <Panel variant="well" className='guardianEvent'>

                <a className='atierlink' href={PC_VERSION} target="_blank">Download PC Version</a>

                <a className='atierlink' href={MAC_VERSION} target="_blank">Download Mac Version</a>

                {/* 
                {(mode === INTERACTIVE_VERSE||mode===INTERACTIVE_ALPHA) && (
                  <Button className="checktweet" onClick={CheckTweets}>
                    Click After Tweet (While In Gallery)
                  </Button>
                )}

                {mode === INTERACTIVE && (
                  <Button className="checktweet" onClick={CheckTweets}>
                    Click After Tweet
                  </Button>
                )}
 */}
                {/* 
                <span>
                  {tweetResult}
                </span> */}
              </Panel>
            )}

            {/* 

{(tweeturl != "") && (

<Panel variant="well" className='guardianEvent'>

  <a className='summontwitter' href={GetTweetLink()}><img className='twitterimg' src="twitter.png" /> Summon X-XENO</a>

  <a className='atierlink' href={XenoRuleURL} target="_blank">X-XENO Event Rules</a>


  {(mode === INTERACTIVE_VERSE||mode===INTERACTIVE_ALPHA) && (
    <Button className="checktweet" onClick={CheckTweets}>
      Click After Tweet (While In Gallery)
    </Button>
  )}

  {mode === INTERACTIVE && (
    <Button className="checktweet" onClick={CheckTweets}>
      Click After Tweet
    </Button>
  )}


  <span>
    {tweetResult}
  </span>
</Panel>
)} */}

          </div>


        </Panel>

        <Panel variant="well" className="controlDiv">

          <Panel variant="well" className="title">
            {address != null && userPreviewMode && <span>Your NFTs</span>}

            {address == null && userPreviewMode && (
              <span style={{ fontSize: '9px' }}>Sample Loots</span>
            )}

            {!userPreviewMode && <span>Token Owner's Loots</span>}
          </Panel>

          <Panel variant="well" className="controlSection">
            <select defaultValue={selectedOption}
              onChange={handleChange} className='selectlist'>
              {nftoptions &&
                nftoptions.map((item, index) => {
                  return (
                    <option value={item.addr}
                      key={index} className='theoption'>{item.name}</option>
                  );
                })}

            </select>


            <Panel variant="well" className="nftlistDiv">

              {allnfts &&
                allnfts.filter(nft => nft.token_address == selectedOption
                ).map((item, index) => {
                  return (
                    <CollectableDiv
                      item={
                        {
                          ...item,
                          //name: item.jsondata.name,
                          name: item.jsondata ? item.jsondata.name : "coming soon",
                          img: item.img
                        }
                      }
                      key={index}
                      onClickFn={OnClickItem}
                      disabled={item.jsondata == null}
                    ></CollectableDiv>
                  );

                })}

              {selectedOption == punkoption &&
                (
                  <div className="lootItem specialPunk">

                    <TextField
                      style={{
                        height: '30px',
                        width: '102px',
                        border: 'none',
                        boxShadow: 'none',
                        boxSizing: 'unset',
                        padding: '0px',
                        margin: '1% 0',
                        display: 'inline-block'
                      }}
                      placeholder={punkEnter}
                      className='text'
                      onChange={setPunkTextEnter}
                    />
                    <Button
                      onClick={() => AutoSummonPunk(punkEnter)}
                      style={{
                        height: '60px',
                      }}
                    >
                      Load Punk {punkEnter}
                      {punkText != "" && (<span>({punkText})</span>)}
                    </Button>

                  </div>
                )}


            </Panel>


            <Button
              className="btn summonbtn"
              onClick={() => SummonNFT(selectedItem)}
              disabled={selectedItem == null || selectedItem.lootid == -1}
            >
              Load NFT
              {selectedItem != null && (
                <span>&nbsp;{selectedItem.name}</span>
              )}
            </Button>

          </Panel>


          {mode === INTERACTIVE && (
            <Fragment>

              <Panel variant="well" className="title currentsetup">
                Setup
              </Panel>

              <Panel variant="well" className="interactiveoptions">
{/* 
              <Button className="btn" onClick={() => selectStartTokenFn({
                  token: token,
                  tokentype: PLAYER
                }, INTERACTIVE_ALPHA
                )}>  Test in Exploration Demo
                </Button> */}
              <Button className="btn" onClick={() => JumpToPlay()}>  Test in Exploration Demo
                </Button>
                
                <Button className="btn" onClick={() => selectStartTokenFn({
                  token: token,
                  tokentype: PLAYER
                }
                )}>  Play In Multiverse UPDATE-X
                </Button>

                <Button className="btn" onClick={() => viewBasicTokenFn(token)}>
                  Back To Token {token}
                </Button>


              </Panel>

            </Fragment>
          )}


          {(mode === INTERACTIVE_VERSE) && (
            <Fragment>
              <Panel variant="well" className="title currentsetup">
                Current Setup
              </Panel>

              <Panel variant="well" className="setupItemBigBox">

                <Panel variant="inside" shadow className='setupitemBox'>

                  <div className="vidsection">
                    <Video src={mvmanimationurl(startMVM.token)} autoPlay loop muted playsInline preload="auto" />
                  </div>
                  <div className="vidtitle">
                    #{startMVM.token}&nbsp; <span>{startMVM.type}</span>
                  </div>

                  <Button className="btn" onClick={() => selectStartFn(startMVM, mode)}>
                    Change Sim
                  </Button>

                </Panel>

                <Panel variant="inside"
                  shadow className='setupitemBox'>

                  <div className="vidsection">
                    <Video src={playeranimationurl(startPlayer.token)} autoPlay loop muted playsInline preload="auto" />
                  </div>
                  <div className="vidtitle">

                    #{startPlayer.token}&nbsp; <span>{startPlayer.type}</span>
                  </div>

                  <Button className="btn" onClick={() => selectStartFn(startPlayer, mode)}>
                    Change XENO
                  </Button>

                </Panel>

              </Panel>


            </Fragment>
          )}




          {(mode === INTERACTIVE_ALPHA) && (
            <Fragment>
              <Panel variant="well" className="title currentsetup">
                Alpha Demo
              </Panel>

              <Panel variant="well" className="setupItemBigBox">

                <Panel variant="inside" shadow className='setupitemBox'>

                  <div className="vidsection">
                    <Video src={mvmanimationurl(startMVM.token)} autoPlay loop muted playsInline preload="auto" />
                  </div>
{/*                   <div className="vidtitle">
                    #{startMVM.token}&nbsp; <span>{startMVM.type}</span>
                  </div> */}

                  <div className="vidtitle">
                    <span>Quest Access</span>
                  </div>

                  <Button className="btn" onClick={() => selectStartFn(startMVM, mode)} disabled={true}>
                    Alpha Demo Sim
                  </Button>

                </Panel>

                <Panel variant="inside"
                  shadow className='setupitemBox'>

                  <div className="vidsection">
                    <Video src={playeranimationurl(startPlayer.token)} autoPlay loop muted playsInline preload="auto" />
                  </div>
                  <div className="vidtitle">

                    #{startPlayer.token}&nbsp; <span>{startPlayer.type}</span>
                  </div>

                  <Button className="btn" onClick={() => selectStartFn(startPlayer, mode)}>
                    Change XENO
                  </Button>

                </Panel>

              </Panel>


            </Fragment>
          )}




          <Button
            className="btn"
            onClick={() => Fullscreen()}
          >
            Full Screen
          </Button>


        </Panel>
      </div>

    </Div>
  );
};

const GlobalStyles = createGlobalStyle`
@font-face {
  font-family: 'ms_sans_serif';
  src: url('${ms_sans_serif}') format('woff2');
  font-weight: 400;
  font-style: normal
}
@font-face {
  font-family: 'ms_sans_serif';
  src: url('${ms_sans_serif_bold}') format('woff2');
  font-weight: bold;
  font-style: normal
}
body {
  font-family: 'ms_sans_serif';
}
${styleReset}
`;


const Video = styled.video`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const Div = styled.div`


.specialPunk{
  display: block;
    width: 100px;
    height: 100px;
    margin-top: 68px;
}

min-height:540px;
.guardiantitle{
  font-weight:bold;
  color:white;
}
.guardianEvent{
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size:9px;
  min-width: 575px;
  padding: 4px;
  margin-top: 4px;

}

.twitterimg{
  width:10px;
}
.summontwitter{
color:#00acee;
//color:white;
}

.checktweet{
  
  height: 20px;
  font-size: 9px;
  color:orange ;
/*   text-decoration: underline; */
}

.atierlink{
  color:white;
}

.interactiveoptions{
  display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    height: 160px;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 11px;
}


.setupItemBigBox{
  display: flex;
  height: 160px;
}



.setupitemBox{
 width:50%;
 
  display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: space-around;
    align-items: center;
    padding: 4px;
}

.vidsection{    
  height: calc(100% - (40px));
  padding: 2px;
  width: 100%;
}

.vidtitle{
  height: 20px;
  font-size: 10px;
  display: flex;
  align-content: space-between;
  align-items: center;
}
.vidtitle span{
  border-bottom: 1px lightgray dashed;
  padding-left:5px;
  padding-right:5px;
  
}

.setupitemBox .btn{
  height:20px;
  margin-top: 0px!important;
  width:95%;
}

.selectlist{
  width:calc(100% - (2px));
  margin-left:1px;
  margin-right:1px;
}

.currentsetup{
  
}

.linkspanel {   
  width: 100%;
 padding: 1px;
 font-size: 10px;
 margin-top: 1px;
 margin-bottom: 1px;
 display: flex;
 align-items: center;
 min-height: 40px;
 padding-top:4px;
 padding-bottom:4px;
 
}

.fullscreenbtn{
  height: 20px!important;
  margin-top: 7px!important;
 font-size:9px!important;
 color:gray!important;
}

.summonbtn{
  color: blueviolet!important;
}
.controlDiv .summonbtn {
  font-size: 9px;
  width:100%;
}


.controlDiv .summonbtn {
  font-size: 9px;
  width:100%;
}


.controlDiv .btn {
  font-size: 9px;
  margin-top:5px;
}
.tokenbtn{
  height: 20px;
  margin-left: 11px;
  margin-right: 5px;
 width:90px!important;
 font-size:10px;
}

padding: 5px;
    background: #202127;
.loadingloot{
  margin:5px;
}
.controlSection{
  padding: 5px;
  
  height: calc(100% - (270px));
}

/* 
.controlDiv> .btn {
  width: 67px;
  font-size: 9px;
  margin-left: 2px;
  height: 48px;
  color: blueviolet;
  font-weight: bold;
    margin-top:2px;
}
 */


.interactive {
  width: calc(100% - (280px));
}

.controlDiv {   
  font-size: 9px;
 padding-left: 5px;
 padding-right: 5px;
 padding-top: 3px;
 overflow-y: auto;
 overflow-x: hidden;
 width: 280px;
 display: flex;
 flex-direction: column;
}  


.controlDivWide {   
 width: 280px;
}  

.controlDivHide {   
 width: 0px;
}  

.nftlistDiv{
  /* height: 189px;    
   */
  height: calc(100% - (68px));
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-align-content: flex-start;
    -ms-flex-line-pack: start;
    align-content: flex-start;
    overflow-y: auto;
    margin-top: 5px;
    justify-content: space-around;
}

.interactive >.interactiveframe{
  width: 100%;
  height:100%;
}
.interactive >.interactiveframehint{
  width: 100%;
/*   height:calc(100% - (55px)); */
  
  height:calc(100% - (85px));
}
.interactive >.hintdiv .highlight{
  color:white;
}

.ruleHint{
  height: 200px;
  width: 400px;
  position: relative;
  top: -211px;
  left: 9px;
  border:1px red solid;
}

.hintdiv{
 /*  height: 55px; */

  height: 85px;

  font-size: 10px;
  padding-bottom: 5px;
  padding-left: 8px;
  padding-right:8px;
  padding-top:5px;
}
  .summonLoot {
  }

  //70%
  .MainDiv {
    height: 100%;
    display: flex;
  }
  
  .controlDiv >.title{
    width: 100%;
    margin-bottom: 2px;
    margin-top: 2px;
    font-size: 11px;
    text-align: center;
    padding:5px;
  }    

  .controlDiv >.specialMessage{
    margin-top:10px;
    text-align: center;
    color: gray;
    font-size: 9px;
    border-top:1px dotted gray;
    border-bottom:1px dotted gray;
  
  }    
  
  .lootItem {
    display: 'block';
    text-align: center;
  }

  .lootItem > button {
    height:100px;
    width:100px;
/*     height: 84px;
    width: 67px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: space-around;
    justify-content: center;
    align-items: center;
    font-size: 9px;
    padding: 10px;
    margin: 2px;
    margin-bottom: 5px;
  }

  .summonLoot {
    display: flex;
    font-size: 10px;
    padding: 10px;
  }
  
  .summonLoot > .btn {
    margin: auto;
    min-width: 150px;
    margin-right: 4px;
    height: 50px;
    font-size: 14px;
  }
  .summonLoot img {
    margin-bottom: 6px;
  }
  .lootDetails {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    padding-left: 10px;
    padding-right: 10px;
    align-content: center;
  }
  .lootDetails li {
    border: 1px black;
    border-style: dashed;
    margin: 2px;
    padding: 2px;
    height: 18px;
  }

  .linksdetails {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    align-content: center;
  }
  .linkspanel li {
    border: 1px gray;
    border-style: dashed;
    margin: 2px;
    padding: 2px;
    height: 18px;
  }
  .linkspanel li.normaltext
  {    padding-top: 3px;
    border-style: none;
  }
  
  .linkspanel li.minted:hover {
    
  font-weight: bold;
  }
  .linkspanel .userlink{
    color:blue;
  }


`;
export default InteractiveVerse;
