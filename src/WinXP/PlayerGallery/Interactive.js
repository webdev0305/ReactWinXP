import styled from 'styled-components';
import {
  autourl,
  SLOOT_CONTRACT_ADDR,
  LOOT_CONTRACT_ADDR,
  MLOOT_CONTRACT_ADDR,
  INTERACTIVE_URI,
  INTERACTIVE_TOKEN_URI,INTERACTIVE_TOKEN_URI2,
  TEMP_LOOT_ADDR,
  autotokenuri,
  fetchLinks,
  processLinkarray,testnftlistmode,testnftaddr
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

//#region functions

let shouldloadloots = true;

const S_LOOT = 'S_LOOT';
const M_LOOT = 'M_LOOT';
const ORIG_LOOT = 'ORIG_LOOT';

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





// async function fetchAndSetMetadata(url) {
//   //get the token uri

//   //await
//   console.log('axios', url);
//   axios
//     .get(url, {
//       responseType: 'json',
//     })
//     .then(response => {
//       //so the value should be in data

//       var data = response.data;
//       console.log('response data');
//       console.log(data);

//       //loop through attributes

//       //setIpfshash(response.data["image"].substring(7));
//       let attrs = Object.entries(data['attributes']).map(([key, value]) =>
//         Object.values(value).filter(r => true),
//       );

//       var traitsobj = data['attributes'];
//       console.log(traitsobj);
//       setTraits(traitsobj);
//       setName(data.name);
//       setAnim(autourl(GetAnimURL(data)));
//       // setAnim('http://localhost:3000/nftinteract/loading.gif');

//       setTokenMetadata(data);
//       SetTokenData(data);
//       /*     SetSpaceObjects(data['spaceObjects']);
//           SetGlobeObjects(data['globeObjects']); */


//       console.log('token data', data);


//     })
//     .catch(error => {
//       console.log(error);
//     });
// }





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



const Interactive = ({
  url,
  allTokens,
  token,
  ownerinput,
  userpreviewmodein,
  viewTokenFn
}) => {
  //#region interactive

  const [dappState, setDappState] = useGlobal();

  const stateProvider = dappState.provider;
  const contract = dappState.contract;
  const address = dappState.address;

  //temp address[]

  //#region synthloot

  //const [_slContract, setSLContract] = useState(null);
  //const [character, setCharacter] = useState(null);


  const [nftoptions, SetNFTOptions] = useState([{
    name: 'loading...',
    addr: 'loading'
  }]);

  const [allnfts, SetAllNFT] = useState([]);
  const [selectedOption, SetSelectedOption] = useState();


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

  const defaultSelectedLoot = {
    name: '',
    ltype: 'unknown',
    lootid: -1,
    img: null,
    items: [],
  };

  const [selectedLoot, SetSelectedLoot] = useState(defaultSelectedLoot);

  console.log('selectedloot',selectedLoot);

  async function OnClickItem(item){

    console.log('onselect',item);
    SetSelectedLoot(item);

  }

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


    // //user address: 0x73a6a002b9538f636fbfe6bfb8b7440b8b3a510e
    // //contract:  0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D

    // //apes
    // var contractstr="0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
    // let walletstr="0xc5c7b46843014b1591e9af24de797156cde67f08";

    // //penguins
    // contractstr="0xbd3531da5cf5857e7cfaa92426877b022e612cf8";
    //  walletstr="0xf530cb2cc7e42c0abe288668c41962c6261c44b9";



    // let apecontract = new ethers.Contract(
    //   contractstr,
    //   LootABI,
    //   provider,
    // );


    // var apelist = await GetAllLoot(apecontract, walletstr);
    // //huoqu suoyou de liebiao.

    // console.log("ape list");
    // console.log(apelist);

    // //get images

    // var tokenurilist = [];

    // for (let i = 0; i < apelist.length; i++) {

    //   var tokenuri = await GetTokenURI(apecontract, apelist[i]);
    //   tokenuri = autourl(tokenuri);
    //   tokenurilist.push(tokenuri);
    //   console.log("tokenuri ape:", tokenuri);
    // }

    // var promisetokendata = [];

    // var nftlistset=[];


    // for (let i = 0; i < tokenurilist.length; i++) {
    //   var result = await GetTokenMetaData_Image(tokenurilist[i]);

    //   console.log(result);

    //   nftlistset.push({
    //     ...result,
    //     img: autourl(result.image),
    //     name: 'test'
    //   });
    //   //promisetokendata.push(GetLootImage(mlootcontract, mlootlist[i]));
    // }

    // setNFTList(nftlistset);


    //var slootitem = await GetLootImage(slootcontract, addressin);


    //=======================================================



    var mlootlist = await GetAllLoot(mlootcontract, addressin);
    var slootlist = [addressin];
    //call all loot images

    var promiseLoots = [];
    var promiseMoreLoots = [];

    var lootshowlist = [];
    var mlootshowlist = [];

    var slootitem = null;

    for (let i = 0; i < lootlist.length; i++) {
      promiseLoots.push(GetLootImage(lootcontract, lootlist[i]));
    }

    for (let i = 0; i < mlootlist.length; i++) {
      promiseMoreLoots.push(GetLootImage(mlootcontract, mlootlist[i]));
    }

    var slootitem = await GetLootImage(slootcontract, addressin);
    slootitem.name = 'Ⓢynthetic';
    slootitem.ltype = 'sloot';

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
    console.log(slootitem);

    setLootList(lootshowlist);
    setMoreLoostList(mlootshowlist);
    setSynthLoot(slootitem);

    //all the loots setup here.
    //set synth loot first

    SetSelectedLoot(slootitem);
    SetLoading(false);
    SetSpecialMessage('');
  }
  
  function imageToUri(url, callback) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    

    let base_image = new Image();
    base_image.src = url;
    base_image.crossOrigin="anonymous";
    base_image.onload = function() {
        canvas.width = base_image.width;
        canvas.height = base_image.height;

        ctx.drawImage(base_image, 0, 0);
        callback(canvas.toDataURL('image/png'));

        canvas.remove();
    }
}
/* 
imageToUri('./assets/some_image.png', function(uri) {
    console.log(uri);
}); */


async function DirectCallNFTURL(selecteditem) {


  console.log('summoning url');
  //let imginput="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
  let lootinput = {
    ...selecteditem,
    calltype: 'summon',
    imgurl:autourl(selecteditem.jsondata.image)
  };

  const frame = document.getElementById('interactiveframe');
  frame.contentWindow.postMessage(lootinput, '*');
  // document.getElementById('interactiveframe').contentWindow.CallFunction(imginput);
}




async function SummonLoot(loot) {
  if(loot.jsondata!=null){
    DirectCallNFTURL(loot);
  }


return;


  if(loot.imgsrcmode!=null){
    //so this is src mode use the imagetouri

    //imageToUri(loot.img, function(uri) {//use the thumbnail image later

      DirectSummonLoot({...loot,img:loot.imgdataurl});
    //});

  }else{
    DirectSummonLoot(loot);
  }
}

async function DirectSummonLoot(loot) {


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


/*   async function SummonLoot(loot) {
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
 */
  function SwitchPreviewMode(mode) {
    setLootList([]);
    setMoreLoostList([]);
    setSynthLoot(null);

    SetSelectedLoot(defaultSelectedLoot);

    SetUserPreviewMode(!userPreviewMode);

    SetSpecialMessage(defaultmessage);
  }

  function SwitchFullScreen() {
    SetFullScreen(!fullScreen);
  }

  function SeeToken() {

  }

  async function GetNFTOptions(addressin) {
    /*
    curl -X 'GET' \
    'https://deep-index.moralis.io/api/v2/0xd21134bf2fcc6038094ad1a693e886dcb161ff33/nft?chain=eth&format=decimal' \
    -H 'accept: application/json' \
    -H ': '
    */
    var url = "https://deep-index.moralis.io/api/v2/" + addressin + "/nft?chain=eth&format=decimal";

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


    theoptions.push({
      name: 'All',
      addr: ''
    });

    for (let i = 0; i < tokens.length; i++) {

      if (!duplicatecheck.includes(tokens[i].name)) {

        duplicatecheck.push(tokens[i].name);

        theoptions.push({
          name: tokens[i].name,
          addr: tokens[i].token_address
        });
      }

    }

    SetNFTOptions(theoptions);

    //add images to tokens (temporarily just use the historical data from this)
    //totally temporary (tweak this to load dynamic metadata that isn't cached)

    for (let i = 0; i < tokens.length; i++) {
      tokens[i].jsondata=JSON.parse(tokens[i].metadata);
      console.log('jsondata',tokens[i].jsondata);

      if(tokens[i].jsondata!=null){
        tokens[i].img=autourl(tokens[i].jsondata.image);
      }
      //set toggle to tell if its src mode
      tokens[i].imgsrcmode='link';

    }

    console.log('allnft',tokens);
  
    SetAllNFT(tokens);

  }

  function handleChange(input) {
    console.log('dropdown', input);
    console.log('dropdown2', input.target.value);
    SetSelectedOption(input.target.value);
  }

  //loading loots
  useEffect(() => {
    if (window.ethereum != null && stateProvider != null) {

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

      LoadEntireLootBags(stateProvider, addressinput);
    }
    //reloads when the address is different or the provider is different?
  }, [stateProvider, address, owner, userPreviewMode]); //if any of these have changed (address/owner/previewmode all require reload)

  useEffect(() => {
    async function OnSwapToken() {
      if (window.ethereum != null && stateProvider != null) {
        if (token != null) {
          SetInteractiveURI(INTERACTIVE_TOKEN_URI2 + token);
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
    //fetchsetlinks();



 


    let addr=address;

    if(testnftlistmode){
      addr=testnftaddr;
    }

    GetNFTOptions(addr);
    


    //reloads when the address is different or the provider is different?
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

  return (
    <Div style={{ height: fullScreen ? '150%' : '100%', width: '100%' }}>
      <div className="TopSection">
        <Panel variant="well" className="interactive">


          {/* 
          //only when there are tokens */}

       
          {interactiveURI == INTERACTIVE_TOKEN_URI2 && (
            <span>Loading... (interactive requires metamask to load, please reboot after connection)</span>
          )}
      {interactiveURI != INTERACTIVE_TOKEN_URI2 && (
            <iframe id="interactiveframe" src={interactiveURI} title=""></iframe>
          )} 

          {/* <Panel variant="well"></Panel> */}
        </Panel>

        <Panel variant="well" className="lootsDiv">

          <Panel variant="well" className="title">
            {address != null && userPreviewMode && <span>Your Loots</span>}

            {address == null && userPreviewMode && (
              <span style={{ fontSize: '9px' }}>Sample Loots</span>
            )}

            {!userPreviewMode && <span>Token Owner's Loots</span>}
          </Panel>
          <select defaultValue={selectedOption} onChange={handleChange}>
            {nftoptions &&
              nftoptions.map((item, index) => {
                return (
                  <option value={item.addr}>{item.name}</option>
                );
              })}
          </select>

{/* 
          <select>
            {allnfts &&
              allnfts.filter(nft => nft.token_address == selectedOption).map((item, index) => {
                return (
                  <option value={item.addr}>{item.name}</option>
                );
              })}
          </select>
 */}

          {allnfts &&
            allnfts.filter(nft => nft.token_address == selectedOption).map((item, index) => {
              return (
                <CollectableDiv
                  item={
                    {
                      ...item,
                    name:item.jsondata.name,
                    img:item.img
                  }
                }
                  key={index}
                  onClickFn={OnClickItem}
                ></CollectableDiv>
              );

            })}

{/*           {allnfts &&
            allnfts.map((item, index) => {
              return (
                <CollectableDiv
                  item={item}
                  key={index}
                  onClickFn={SetSelectedLoot}
                ></CollectableDiv>
              );
            })}
 */}

          {/*   */}


          {synthLoot == null && (
            <div className="loadingloot">loading loots...</div>
          )}

          {synthLoot != null && (
            <CollectableDiv
              item={synthLoot}
              onClickFn={SetSelectedLoot}
            ></CollectableDiv>
          )}
          {/* 
          {nftList &&
            nftList.map((item, index) => {
              return (
                <CollectableDiv
                  item={item}
                  key={index}
                  onClickFn={SetSelectedLoot}
                ></CollectableDiv>
              );
            })} */}




          {lootList &&
            lootList.map((item, index) => {
              return (
                <CollectableDiv
                  item={item}
                  key={index}
                  onClickFn={SetSelectedLoot}
                ></CollectableDiv>
              );
            })}
          {moreLoostList &&
            moreLoostList.map((item, index) => {
              return (
                <CollectableDiv
                  item={item}
                  key={index}
                  onClickFn={SetSelectedLoot}
                ></CollectableDiv>
              );
            })}

          <Button
            className="btn"
            onClick={() => SwitchPreviewMode()}
            disabled={loading}
          >
            {!loading && address != null && (
              <span>
                {' '}
                Switch to {userPreviewMode ? "Owner's" : 'Your'} Loots
              </span>
            )}

            {!loading && address == null && (
              <span>
                {' '}
                Switch to {userPreviewMode ? "Owner's" : 'Sample'} Loots
              </span>
            )}

            {loading && 'Loading'}
          </Button>



          <Button
            className="btn fullscreenbtn"
            onClick={() => SwitchFullScreen()}
            disabled={loading}
          >

            {fullScreen ? "Zoom out" : 'Zoom in'}
          </Button>

          {specialMessage != '' && (
            <div className="title specialMessage">
              Detected A Sudden Incoming Transmission: {specialMessage}
            </div>
          )}



        </Panel>
      </div>

      {(links.length > 0 || dynamicLinks.length > 0) && (
        <Panel variant="well" className="linkspanel">
          <Button className="tokenbtn"
            onClick={() => viewTokenFn(token)}>
            See Token
          </Button>
          <ul className="linksdetails">
            <li className="normaltext">Users can travel to</li>

            {links.map((item, index) => {
              return (
                <li key={index} className={item.classstr} onClick={
                  () => SwapPage(parseInt(item.itemid))
                } >
                  {item.itemid}

                </li>
              );
            })}
            {dynamicLinks.map((item, index) => {
              return (
                <li key={index} className={'userlink ' + item.classstr} onClick={
                  () => SwapPage(parseInt(item.itemid))
                } >
                  {item.itemid}

                </li>
              );
            })}{' '}
            <li className="normaltext">from here.</li>
          </ul>
        </Panel>
      )}

      {selectedLoot != null && (
        <Panel variant="well" className="summonLoot">
          <CollectableDiv item={selectedLoot} onClickFn={() => { }}></CollectableDiv>
          <ul className="lootDetails">
            {selectedLoot.items && selectedLoot.items.map(item => {
              return <li key={item}>{item}</li>;
            })}
          </ul>
          <Button
            className="btn summonbtn"
            onClick={() => SummonLoot(selectedLoot)}
            disabled={selectedLoot == null || selectedLoot.lootid == -1}
          >
            Summon
          </Button>
        </Panel>
      )}

      {/* 
      <!--termporary--------------------------------------> */}
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

const Div = styled.div`
min-height:540px;

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
.lootsDiv> .btn {
  width: 67px;
  font-size: 9px;
  margin-left: 2px;
  height: 48px;
  color: blueviolet;
  font-weight: bold;
}



.interactive {
  width: 100%;
}

.interactive >iframe{
  width: 100%;
  height:100%;
}

  .summonLoot {
  }

  //70%
  .TopSection {
    
    height: calc(100% - (154px));
    display: flex;
  }
  .lootsDiv {
    font-size: 9px;
    margin-left: 2px;
    padding: 2px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 12px;
    
    width: 88px;
  }  
  
  .lootsDiv >.title{
    width: 71px;
    margin-bottom: 2px;
    margin-top: 2px;
    font-size: 11px;
    text-align: center;
  }    

  .lootsDiv >.specialMessage{
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
    height: 84px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: space-around;
    justify-content: center;
    align-items: center;
    font-size: 9px;
    padding: 10px;
    width: 67px;
    margin: 2px;
    margin-bottom: 5px;
  }

  .summonLoot {
    display: flex;
    font-size: 10px;
    padding: 10px;
  }
  
  .summonLoot > .lootsDiv {
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
export default Interactive;
