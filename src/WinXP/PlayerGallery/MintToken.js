import styled from 'styled-components';
import React, { useState, useEffect, useGlobal, setGlobal } from 'reactn';

import axios from 'axios';
import TokenImage from './TokenImage';
import XenoInfinity from 'artifacts/contracts/XenoInfinity.sol/XenoInfinity.json'
import WLXenoDirect from 'artifacts/contracts/WLXenoDirect.sol/WLXenoDirect.json'
import NFTWrapper from 'artifacts/contracts/NFTWrapper.sol/NFTWrapper.json'

import { errors, ethers } from 'ethers';

import { createGlobalStyle, ThemeProvider } from 'styled-components';
import original from 'react95/dist/themes/original';
import modernDark from 'react95/dist/themes/modernDark';
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

import {
  autourl, MINT_PRICE_DEFAULT,
  BASE_URI,
  ONE_TOKEN, trailerhost,
  TOKEN_GALLERY,
  INTERACTIVE,
  MINT_TOKEN,
  MY_TOKENS,
  USER_TOKENS,
  CONTRACT_ADDR,
  MAX_TOKEN,
  PREVIEW_ANIM, MAX_COUNT_ONE,
  correctChain, StillMintable, PLAYERNAME, PLAYERNAMES, PLAYERNAMENFT, PLAYERNAMENFTS, PLAYERNAME_NFT, YOUTUBEMODE, youtubeurlB, WL_CONTRACT_ADDR
  , WL_Signature_Address,
  NFTWRAP_CONTRACT_ADDR
} from 'lib/lib.js';

import {
  styleReset,
  Button,
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
const MintToken = ({ allTokens, viewTokenFn, viewInteractiveFn, rollrandom }) => {
  //load the token data here

  const [dappState, setDappState] = useGlobal();
  const provider = dappState.provider;
  const contract = dappState.contract;
  console.log('contract is:', contract);
  const address = dappState.address;

  //ui elements

  const BUYSTATE_NORMAL = 'NORMAL';
  const BUYSTATE_MINTING = 'MINTING';
  const BUYSTATE_PAYING = 'PAYING';
  const BUYSTATE_REGISTER_WL = 'WHITELIST';



  const [isPaused, SetIsPaused] = useState(false);


  const [preview, setPreview] = useState(PREVIEW_ANIM);
  const [errorstr, SetErrorStr] = useState("");

  const [buyamount, setBuyamount] = useState(1);

  const [price, setPrice] = useState(MINT_PRICE_DEFAULT);//will just use this first (fetch price might not be used)

  const [buyState, setBuyState] = useState(BUYSTATE_NORMAL);

  const [wlbalance, SetWlBalance] = useState(-1);

  console.log('dapp state', dappState);

  const [correctNetwork, SetCorrectNetwork] = useState(true);
  //const [timer, SetTimer] = useState(80);

  //contract calls

  //#region contract calls


  async function fetchPrice() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('fetching price');

      try {
        const rawdata = await contract.price();
        const data = Number(ethers.utils.formatEther(rawdata));
        console.log('price: ', data);

        setPrice(data);

        return data;
      } catch (err) {
        console.log('token URI Error: ', err);
      }
    } else {
      console.log('ethereum api not detected');
      return '';
    }
  }

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' }, addr => {
      console.log('eth requested account success');
      console.log('returned address:', addr);
    });
  }

  //original simple purchase
  async function purchase() {

    if (typeof window.ethereum !== 'undefined' && provider != null) {
      setBuyState(BUYSTATE_PAYING);

      await requestAccount();
      //see if provider is there
      console.log('provider is', { provider });

      const signer = provider.getSigner();

      const writecontract = new ethers.Contract(
        CONTRACT_ADDR,
        XenoInfinity.abi,
        signer,
      );

      let purchasesum = ethers.utils.parseEther((price * buyamount).toString());

      try {
        console.log(price * buyamount);
        const tx = await writecontract.purchase(buyamount, {
          value: purchasesum,
        });

        console.log('await 1 complete');

        //await tx
        tx.wait(
          console.log('waiting for transaction to go complete'),
          setBuyState(BUYSTATE_MINTING),
        )
          .then(receipt => {
            console.log('receipt');
            //receipt will contains events
            let lastid = -1;

            for (let i = 0; i < receipt.events.length; i++) {
              console.log(receipt.events[0]);

              var tokenid = receipt.events[i].args['tokenId'];
              if (tokenid != null) {
                let tokenidnum = tokenid.toNumber();
                if (tokenidnum > lastid) {
                  lastid = tokenidnum;
                }
                console.log('new token ', tokenidnum);
              }
            }

            console.log('last token received ', lastid);
            //setBuyState(BUYSTATE_NORMAL);

            ViewMintedToken(lastid.toString());

          })
          .catch(err => {
            console.log('metamask error');
            console.log(err);
            setBuyState(BUYSTATE_NORMAL);

          });
      } catch (err) {

        try {

          console.log('metamask error');
          setBuyState(BUYSTATE_NORMAL);

          if (err.data != null) {
            if (err.data.message != null) {
              SetErrorStr(err.data.message);
            }
          } else if (err.message != null) {
            console.log(err.message);

            let text = err.message;
            //get the string
            let startindex = text.indexOf("message");
            let endindex = text.indexOf("data");

            let errortext = (text.substring(startindex, endindex));

            SetErrorStr(errortext);
          } else {
            SetErrorStr('It seems like there is an error, please refresh browser & try again');
          }

        } catch (something) {
          SetErrorStr('Seems like there is an error, please refresh browser & try again');
        }


      }
    }
  }
  //-------------------------------------------------wl things

  async function FetchWLSignature(url) {

    try {
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

    } catch (err) {
      console.log('Get wl signature stat error ', err);
    }

    return {};

  }




  async function fetchWLStatus() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('fetching price');

      try {
        const rawdata = await contract.CanWLPurchase(address);
        return rawdata;
      } catch (err) {
        console.log('Get wl purchase stat error ', err);
      }
    } else {
      console.log('ethereum api not detected');
    }

    return false;
  }

  //-----------------original minter with wlxenodirect

  async function autoregister_purchase() {

    if (typeof window.ethereum !== 'undefined' && provider != null) {
      setBuyState(BUYSTATE_PAYING);

      await requestAccount();
      //see if provider is there
      console.log('provider is', { provider });

      try {


        const signer = provider.getSigner();

        const writecontract = new ethers.Contract(
          CONTRACT_ADDR,
          XenoInfinity.abi,
          signer,
        );

        //White List Logic-------------------------------------------------------------------------------------

        //use this to trigger the auto register for whitelist

        //determine if needs mintlist first

        let wlStatus = await fetchWLStatus();

        if (!wlStatus) {//not whitelist yet so continue to whitelist
          console.log("needs to register whitelist now");

          setBuyState(BUYSTATE_REGISTER_WL);

          const whitelistcontract = new ethers.Contract(
            WL_CONTRACT_ADDR,
            WLXenoDirect.abi,
            signer,
          );

          //fetch the data for whitelist
          let wlurl = WL_Signature_Address + address;

          let signatureobj = await FetchWLSignature(wlurl);

          let signature = "";
          if (signatureobj != null) {
            if (signatureobj.signature != null) {
              signature = signatureobj.signature;
            }
          }

          if (signature == "") {
            //no signature then just say can't mint
            setBuyState(BUYSTATE_NORMAL);
            SetErrorStr("Try hitting the 'Mint' button again or refresh website with ctrl+f5, it seems the request has timed out");
            return;
          }

          //signature is ok, continue whitelist-----------------------------

          //wait for metamask
          const wltx = await whitelistcontract.SelfRegisterWL(signature);

          //wait for tx
          const wlreceipt = await wltx.wait();
          console.log('whitelist register tx complete');

          //receipt will contains events
          console.log("registered new whitelist!");

        } else {
          console.log("already whitelisted!");
        }


        //over here means everything is complete
        setBuyState(BUYSTATE_PAYING);

        // Normal Purchase Logic-------------------------------------------------------------------------------------


        let purchasesum = ethers.utils.parseEther((price * buyamount).toString());

        console.log(price * buyamount);
        const tx = await writecontract.purchase(buyamount, {
          value: purchasesum,
        });

        console.log('await 1 complete');

        //await tx
        tx.wait(
          console.log('waiting for transaction to go complete'),
          setBuyState(BUYSTATE_MINTING),
        )
          .then(receipt => {
            console.log('receipt');
            //receipt will contains events
            let lastid = -1;

            for (let i = 0; i < receipt.events.length; i++) {
              console.log(receipt.events[0]);

              var tokenid = receipt.events[i].args['tokenId'];
              if (tokenid != null) {
                let tokenidnum = tokenid.toNumber();
                if (tokenidnum > lastid) {
                  lastid = tokenidnum;
                }
                console.log('new token ', tokenidnum);
              }
            }

            console.log('last token received ', lastid);
            //setBuyState(BUYSTATE_NORMAL);

            ViewMintedToken(lastid.toString());

          })
          .catch(err => {
            console.log('metamask error');
            console.log(err);
            setBuyState(BUYSTATE_NORMAL);

          });
      } catch (err) {

        try {

          console.log('metamask error');
          setBuyState(BUYSTATE_NORMAL);

          if (err.data != null) {
            if (err.data.message != null) {
              SetErrorStr(err.data.message);
            }
          } else if (err.message != null) {
            console.log(err.message);

            let text = err.message;
            //get the string
            let startindex = text.indexOf("message");
            let endindex = text.indexOf("data");

            let errortext = (text.substring(startindex, endindex));

            SetErrorStr(errortext);
          } else {
            SetErrorStr('It seems like there is an error, please refresh browser & try again');
          }

        } catch (something) {
          SetErrorStr('Seems like there is an error, please refresh browser & try again');
        }


      }
    }
  }


  //-----------------nft wrapper minter------------------------------------------------------

  async function fetchNFTWrapperWLStatus(nftwrappercontract) {
    if (typeof window.ethereum !== 'undefined') {
      console.log('fetching price');

      try {
        const rawdata = await nftwrappercontract.CanWLPurchase(address);
        return rawdata;
      } catch (err) {
        console.log('Get wl purchase stat error ', err);
      }
    } else {
      console.log('ethereum api not detected');
    }

    return false;
  }

  async function nftwrapper_purchase() {

    if (typeof window.ethereum !== 'undefined' && provider != null) {
      setBuyState(BUYSTATE_PAYING);

      await requestAccount();
      //see if provider is there
      console.log('provider is', { provider });

      try {


        const signer = provider.getSigner();

        const writecontract = new ethers.Contract(
          NFTWRAP_CONTRACT_ADDR,
          NFTWrapper.abi,
          signer,
        );


        //White List Logic-------------------------------------------------------------------------------------

        //use this to trigger the auto register for whitelist

        //determine if needs mintlist first

        let wlStatus = await fetchNFTWrapperWLStatus(writecontract);


        let selfsignatureforwl = "";

        /*
        //pending here use signature mode */
        if (!wlStatus) {//not whitelist yet so continue to whitelist
          console.log("needs to register whitelist now");

          //fetch the data for whitelist
          let wlurl = WL_Signature_Address + address;

          let signatureobj = await FetchWLSignature(wlurl);

          let signature = "";
          if (signatureobj != null) {
            if (signatureobj.signature != null) {
              signature = signatureobj.signature;
            }
          }

          if (signature == "") {
            //no signature then just say can't mint
            setBuyState(BUYSTATE_NORMAL);
            SetErrorStr("Try hitting the 'Mint' button again or refresh website with ctrl+f5, it seems the request has timed out");
            return;
          }

          //there is signature then assign
          selfsignatureforwl = signature;

          //signature is ok, continue whitelist-----------------------------
          /* 
                    //wait for metamask
                    const wltx = await whitelistcontract.SelfRegisterWL(signature);
          
                    //wait for tx
                    const wlreceipt = await wltx.wait();
                    console.log('whitelist register tx complete');
          
                    //receipt will contains events
                    console.log("registered new whitelist!"); */

        } else {
          console.log("already whitelisted!");
        }


        //over here means everything is complete
        setBuyState(BUYSTATE_PAYING);

        // Normal Purchase Logic-------------------------------------------------------------------------------------


        let purchasesum = ethers.utils.parseEther((price * buyamount).toString());

        console.log(price * buyamount);

        //purchase here

        let tx = {};

        //if else depending on self register while purchase

        if (selfsignatureforwl == "") {
          //if no signature needed
          tx = await writecontract.purchase(buyamount, {
            value: purchasesum
          });

        } else {
          //has signature then pass signature too

          tx = await writecontract.register_and_purchase(buyamount, selfsignatureforwl, {
            value: purchasesum
          });

        }

        /* 
                const tx = await writecontract.purchase(buyamount, {
                  value: purchasesum,
                }); */

        console.log('await 1 complete');

        //await tx
        tx.wait(
          console.log('waiting for transaction to go complete'),
          setBuyState(BUYSTATE_MINTING),
        )
          .then(receipt => {

            /* 
                        console.log('receipt');
                        //receipt will contains events
                        let lastid = -1;
            
                        for (let i = 0; i < receipt.events.length; i++) {
                          console.log(receipt.events[0]);
            
                          var tokenid = receipt.events[i].args['tokenId'];
                          if (tokenid != null) {
                            let tokenidnum = tokenid.toNumber();
                            if (tokenidnum > lastid) {
                              lastid = tokenidnum;
                            }
                            console.log('new token ', tokenidnum);
                          }
                        }
            
                        console.log('last token received ', lastid);
                        //setBuyState(BUYSTATE_NORMAL); */

            //has receipt, just get latest token here
            /* 
                        let lastid=await fetchUserLatestToken(address);
            
                        ViewMintedToken(lastid.toString());
             */
            ViewUserLatestToken(address);

          })
          .catch(err => {
            console.log('metamask error');
            console.log(err);
            setBuyState(BUYSTATE_NORMAL);

          });
      } catch (err) {

        try {

          console.log('metamask error');
          setBuyState(BUYSTATE_NORMAL);

          if (err.data != null) {
            if (err.data.message != null) {
              SetErrorStr(err.data.message);
            }
          } else if (err.message != null) {
            console.log(err.message);

            let text = err.message;
            //get the string
            let startindex = text.indexOf("message");
            let endindex = text.indexOf("data");

            let errortext = (text.substring(startindex, endindex));

            SetErrorStr(errortext);
          } else {
            SetErrorStr('It seems like there is an error, please refresh browser & try again');
          }

        } catch (something) {
          SetErrorStr('Seems like there is an error, please refresh browser & try again');
        }


      }
    }
  }

  async function fetchUserBalance(address) {
    if (typeof window.ethereum !== 'undefined') {
      console.log('fetching balance for user: ', address);

      try {
        const data = await contract.balanceOf(address);
        console.log('user balance: ', data);
        return data;
      } catch (err) {
        console.log('user balance Error: ', err);
      }
    } else {
      console.log('ethereum api not detected');
      return 0;
    }
  }

  async function fetchTokenID(address, tokensequence) {
    if (typeof window.ethereum !== 'undefined') {
      console.log('fetching tokens for user: ', address);

      try {

        const data = await contract.tokenOfOwnerByIndex(address, tokensequence);

        return data;
      } catch (err) {
        console.log('fetch tokens Error: ', err);
      }
    } else {
      console.log('ethereum api not detected');
      return 0;
    }
  }

  async function ViewUserLatestToken(address) {

    try {

      const balance = (await fetchUserBalance(address));

      const latesttoken = (await fetchTokenID(address, balance - 1));

      console.log("latesttoken", latesttoken);


      ViewMintedToken(latesttoken.toString());

      return latesttoken;
    } catch (err) {

      console.log('fetch tokens Error: ', err);
      ViewMintedToken("0");

      return 0;
    }

  }


  //-----------------------------------------------------------------------------------



  //#endregion

  //#region apiCallAndSet

  //#endregion

  useEffect(() => {
    console.log('use effect triggered');

    fetchPrice().then(result => {
      console.log('use effect price is ', result);
    });

  }, []);

  //detect network changes
  useEffect(() => {
    console.log('detecting correct chain');
    if (window.ethereum != null && correctChain(dappState.chainId)) {
      SetCorrectNetwork(true);
    } else {
      SetCorrectNetwork(false);
    }
  }, [dappState.chainId]);


  function ViewMintedToken(newtoken) {
    console.log('view new token', newtoken);
    viewTokenFn(newtoken.toString());
  }

  function setTextBuyamount(e) {
    var value = e.target.value;

    if (Number(value)) {
      if (Number(value) > MAX_COUNT_ONE) {
        value = MAX_COUNT_ONE;
      }

      if (Number(value) < 1) {
        value = 1;
      }

      setBuyamount(value);
      //setBuyamount(e.target.value);
    }
  }


  let timerId = 0;

  async function fetchWLRequirements_OriginalSimple() {

    let result = -1;
    if (typeof window.ethereum !== 'undefined') {
      console.log('fetching wl requirements');

      try {
        const data = Number((await contract.minwlbalance()));
        console.log('minwlbalance: ', data);
        result = data;
        SetWlBalance(data);
        console.log('wl requirements fetched');

      } catch (err) {
        console.log('token Error: ', err);
      }
    } else {
      console.log('ethereum api not detected');
    }

    //0 allow public mint
    //-1 no data, over 0 has wl requirement
    if (result != 0) {
      //kickstart another one if result!=0
      console.log('timer wl requirements');

      timerId = setTimeout(() => fetchWLRequirements(), 1000 * 30);
    }

  }

  //-1:loading
  //0:public
  //1:needs mintlist
  async function fetchWLRequirements() {

    let result = -1;
    if (typeof window.ethereum !== 'undefined') {
      console.log('fetching wl requirements');

      try {

        const wlreadprovider = new ethers.providers.Web3Provider(window.ethereum);
        const wlreadcontract = new ethers.Contract(
          NFTWRAP_CONTRACT_ADDR,
          NFTWrapper.abi,
          wlreadprovider,
        );

        //bool type
        const data = (await wlreadcontract.publicmintmode());
        console.log('publicmintmode: ', data);

        if (data) {//if public mint mode
          result = 0;//zero: all can mint
        } else {
          result = 1;//only whitelisted can mint
        }

        //result = data;
        SetWlBalance(result);
        /* 
                return data; */
        console.log('wl requirements fetched');

      } catch (err) {
        console.log('token Error: ', err);
      }
    } else {
      console.log('ethereum api not detected');
      /*  return ''; */
    }

    //0 allow public mint
    //-1 no data, over 0 has wl requirement
    if (result != 0) {
      //kickstart another one if result!=0
      console.log('timer wl requirements');

      timerId = setTimeout(() => fetchWLRequirements(), 1000 * 60);
    }

  }

  //-1:loading
  //0:public
  //1:needs mintlist
  async function fetchAndSetIsPaused() {

    let result = false;
    if (typeof window.ethereum !== 'undefined') {

      try {
        const data = (await contract.mintpause());
        console.log('pause status: ', data);
        result = data;
        console.log('pause fetched');

        SetIsPaused(result);//so set is paused here if is true
        //paused setup already


      } catch (err) {
        console.log('pause fetch Error: ', err);
      }
    } else {
      console.log('ethereum api not detected');
    }

    return result;
  }

  async function OnStart() {
    await fetchWLRequirements();
    await fetchAndSetIsPaused();
  }

  useEffect(() => {
    // Anything in here is fired on component mount.

    //load whitelist stats
    console.log('wl use effect triggered');

    //orig
    //fetchWLRequirements();

    OnStart();

    return () => {
      // Anything in here is fired on component unmount.
      //cancels the timeout
      console.log('timer wl requirements cleared');

      clearTimeout(timerId);
    }
  }, [])
  /* 
    function RefreshWLStatus(){ */
  /* 
      let timerin=timer;
      if(timerin<2){
        timerin=0;
      }else{
        timerin--;
      }
   */
  /*   SetTimer(timerin); */
  /*   clearInterval(timerId); */
  /*   } */
  /* 
    useEffect(() => {
  
       if(timer>0){ */

  /*     }
  
      });
   */


  return (
    <Panel
      variant="outside"
      shadow
      style={{
        padding: '0.5rem',
        lineHeight: '1.5',
        display: 'block',
        justifyContent: 'center',
        minWidth: '60%',
        maxWidth: '500px',
      }}
    >
      <div style={{ display: 'flex', width: '100%' }}>
        {/*         <Panel
          variant="well"
          style={{
            height: 200,
            width: 210,
          }}>
          <TokenImage url={preview}></TokenImage>
        </Panel> */}
        <Panel
          variant="well"
          style={{
            minHeight: 200,
            width: 210
          }}>
          <TokenImage url={preview}></TokenImage>
        </Panel>

        {(!isPaused)&&(correctNetwork) && (<Panel
          variant="well"
          style={{
            padding: '10px',
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'space-around',
            alignContent: 'center',
            flexDirection: 'column',
            width: 'calc(100% - 210px)'
          }}
        >
          <div>Enter the open metaverse:</div>

          <div
            style={{
              display: 'flex',
              width: '100%',
              placeContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              textAlign: 'center'
            }}
          >
            <TextField
              placeholder={buyamount}
              onChange={setTextBuyamount}
              className="text"
              style={{
                border: 'none',
                boxShadow: 'none',
                boxSizing: 'unset',
                padding: '0px',
                margin: '1% 0',
                fontSize: '14px'
              }}
            />
            <div style={{ marginLeft: '5px' }}>Pieces</div>
          </div>


          <Button
            onClick={nftwrapper_purchase}
            className='adjtext'
            style={{ margin: '5px', padding: '5px' }}
            disabled={
              (buyState != BUYSTATE_NORMAL) ||
              (StillMintable(allTokens)) ||
              (!correctNetwork) 
            }
          >

            {!correctNetwork && <span>Connect Wallet</span>}
            {correctNetwork && address == null  && (
              <span>Connect Wallet</span>
            )}

            {correctNetwork && address != null && buyState != BUYSTATE_REGISTER_WL  && (
              <span>
                {buyState == BUYSTATE_NORMAL ? 'Mint' : 'Minting'} Your{' '}
                {buyamount == 1 ? '' : buyamount}
                {buyamount == 1 ? PLAYERNAME_NFT : ' ' + PLAYERNAMENFTS}
              </span>
            )}

            {correctNetwork && address != null && buyState == BUYSTATE_REGISTER_WL && (
              <span>
                Step 1: Confirm Mintlist Register
              </span>
            )}

          </Button>

          {StillMintable(allTokens) && <span style={{ fontSize: '12px', color: 'blue' }}>All {PLAYERNAMENFTS} minted: Connect Metamask and test a random one @FeelingLucky</span>}

          {!correctNetwork && <span style={{ fontSize: '12px', color: 'blue' }}>Please connect To Ethereum Network</span>}

          {errorstr &&
            <span style={{ fontSize: '10px', color: 'orange', wordBreak: 'break-word' }}> Please refresh & try again - {errorstr}</span>
          }

          {wlbalance == -1 && <span style={{ fontSize: '12px', color: 'blue' }}>Loading Mint Engine</span>}


          {wlbalance == 0  && <span style={{ fontSize: '12px', color: 'white' }}>
            Current Mint Status: Mint Open to Public, Unlimited Mint
          </span>}

          {wlbalance > 0  && <span style={{ fontSize: '12px', color: 'white' }}>
            Current Mint Status: Mint Open for Mintlisted Wallets
          </span>}
          {/* 
          {wlbalance == 3 && <span style={{ fontSize: '12px', color: 'white' }}>
            Current Mint Status: Holds {wlbalance} MVM tokens
          </span>} */}
          {/* 
          {wlbalance > 0 && <span style={{ fontSize: '10px', color: 'lightgray' }}>
            Whitelisted Wallets Can Mint
          </span>}
 */}
        </Panel>)}

        {(isPaused) &&(correctNetwork) &&(<Panel
          variant="well"
          style={{
            padding: '10px',
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'space-around',
            alignContent: 'center',
            flexDirection: 'column',
            width: 'calc(100% - 210px)'
          }}
        >

        <span style={{ fontSize: '16px', color: 'white' }}>
          The lab is cooking something special - MVM & XENO, the open metaverse platform reimagined<br/>
        </span>

        <span style={{ fontSize: '16px', color: 'white' }}>
          Stay tuned <a href={"https://twitter.com/MultiverseVM"} style={{ color: 'orange' }}>@Twitter</a> For Details & Latest Updates
        </span>

        </Panel>)}
        
        {(!correctNetwork) &&(<Panel
          variant="well"
          style={{
            padding: '10px',
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'space-around',
            alignContent: 'center',
            flexDirection: 'column',
            width: 'calc(100% - 210px)'
          }}
        >

        <span style={{ fontSize: '16px', color: 'white' }}>
          An open metaverse platform reimagined<br/>
        </span>

        <span style={{ fontSize: '16px', color: 'white' }}>
          Please Connect To Ethereum Network with Metamask
        </span>

        <span style={{ fontSize: '11px', color: 'lightgray' }}>
          Hint: Unlock metamask wallet first, If still can't connect, refresh website
        </span>

        </Panel>)}
        


      </div>

      <Panel
        variant="well"
        style={{
          textAlign: 'center',
          padding: '20px',
          width: '100%'
        }}
      >

        <StyledDiv className='vidDiv'>
          {(!YOUTUBEMODE) && (
            <video className='thevid' src={trailerhost + "trailerB.mp4"}
              autoPlay loop muted playsInline controls preload="auto" >
            </video>


          )}
          {(YOUTUBEMODE) && (

            <iframe id="ytplayer" className='youtubevid' type="text/html"
              src={youtubeurlB}
              frameborder="0" allowfullscreen></iframe>

          )}



        </StyledDiv>

        {/*         <img src="./img/universe-original-size.gif" alt="gif " style={{ width: '100%' }} className="minttokenimg" />
 */}
        <StyledDiv className='description'>
          {PLAYERNAMENFT} -- For the players of the MVM & Xeno metaverse platform, <span className='white'>read updated version project notes <a className='atierlink' href="https://vmcreations.gitbook.io/multiverse-vm-and-xeno-infinity-platform/brainstorm/thoughts-on-experience-creation">here</a></span>. Try Alpha Loot Quest to <span className='white'>earn loot with your Xeno!</span> (In MenuBar, Select Main, Play Alpha)
          <br /><br />
          Be first to experience what an open metaverse platform is, enter the 3D open metaverse with any of your NFTs via {PLAYERNAMENFT}, (BAYC/CyberKongz/Cool Cats/Cryptopunks and much more, compatible with most NFTs ALREADY TODAY), push the boundaries of what NFTs are capable of with {PLAYERNAMENFT}, it all begins here.
          <br /><br />

          For all players & visitors of the MVM & Xeno metaverse ecosystem, the metaverse platform reimagined for everyone.


          <br /><br />
          created by
          <br />
          <br />
          ╔═╗╔═╗───────────╔╗─────╔╗─╔╗──────╔════╗
          ╚╗╚╝╔╝───────────║║────╔╝╚╦╝╚╗─────╚══╗═║
          ─╚╗╔╝╔══╦═╗╔══╦╦═╝╠══╦═╬╗╔╬╗╔╬╗─╔╗───╔╝╔╝
          ─╔╝╚╗║║═╣╔╗╣╔╗╠╣╔╗║║═╣╔╗╣║╠╣║║║─║╠══╦╝╔╝
          ╔╝╔╗╚╣║═╣║║║╚╝║║╚╝║║═╣║║║╚╣║╚╣╚═╝╠═╦╝═╚═╗
          ╚═╝╚═╩══╩╝╚╩══╩╩══╩══╩╝╚╩═╩╩═╩═╗╔╝─╚════╝
          ─────────────────────────────╔═╝║
          ─────────────────────────────╚══╝
          <br />
          <br />
        </StyledDiv>
      </Panel>
    </Panel>
  );
};

const StyledDiv = styled.div`


.atierlink{
  color: #25d711;
  text-decoration: underline;
}


.thevid{
      width: 100%;
  height: 100%;
  max-height: 100%;
}

.youtubevid{
  width: 100%;
  height: 268px;
}

.vidDiv{    width: 100%;
  
  background: black;
}

.bold{
  font-weight:bold;
  color:white;
}
.white{
  color:white;
}
.description{
  font-size: 14px;
}

`;

export default MintToken;
