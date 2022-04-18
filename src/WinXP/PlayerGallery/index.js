//import React, { useState } from 'react';
import React, { useState, useEffect, useGlobal, setGlobal } from 'reactn';

import styled from 'styled-components';

import { WindowDropDowns } from 'components';

import { createGlobalStyle, ThemeProvider } from 'styled-components';
import original from 'react95/dist/themes/original';
import modernDark from 'react95/dist/themes/modernDark';
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
/* import bg from 'assets/windowsIcons/Multiversebg.jpg'; */
/* import bg from 'assets/windowsIcons/bg.png';  */
//import bg from 'assets/backgrounds/bg2.PNG'; 
import bg from 'assets/backgrounds/bg2.jpg';

import {
  autourl,
  getRandomInt,
  BASE_URI,
  ONE_TOKEN,
  TOKEN_GALLERY,
  INTERACTIVE,
  MINT_TOKEN,
  MY_TOKENS,
  USER_TOKENS,
  RANDOM_INTERACTIVE,
  RANDOM_TOKEN, CORRECT_NETWORK_WINDOW, correctChain, EXTERNAL_LINK, IncludeMverseTokens, SELECT_TOKENS, INTERACTIVE_VERSE, RANDOM_INTERACTIVE_ALPHA, INTERACTIVE_ALPHA
  , defaultSelected, MVM, PLAYER,
  StillDefault, GetStartTokenType, RANDOM_INTERACTIVE_VERSE
  , GetLuckyTokens, GetTrialTokens, FULL, LUCKY, TRIAL, testwalletmode, LOADING, XenoRuleURL, X_XENO_EVENT,PLAY_ALPHA,rinkebymode
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

import dropDownData from './dropDownData';

import axios from 'axios';

import OneToken from './OneToken';
import TokenGallery from './TokenGallery';
import Interactive from './Interactive';
import MintToken from './MintToken';
import UserTokens from './UserTokens';
import CorrectNetworkWindow from './CorrectNetworkWindow';
import ExternalLink from './ExternalLink';
import SelectTokens from './SelectTokens';
import InteractiveVerse from './InteractiveVerse';
import PlayAlpha from './PlayAlpha';


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




export default function PlayerGallery({ onClose, onClickMenuItem, ExtraData }) {





  console.log("extra data is: " + ExtraData);


  const [dappState, setDappState] = useGlobal(); //entire dappstate

  const contract = dappState.contract;
  let address = dappState.address;
  if (testwalletmode) {
    address = "0x484f2bfe6ea59d667fd5cb29ed259329180d0507";
  }

  const readexternal = dappState.externalstatread;

  console.log('dapp state', dappState);



  const [tempStart, SetTempStart] = useState(startMVM);
  const [tempViewMode, SetTempViewMode] = useState(INTERACTIVE_VERSE);


  const [startMVM, SetStartMVM] = useState({ ...defaultSelected, tokentype: MVM });
  const [startPlayer, SetStartPlayer] = useState({ ...defaultSelected, tokentype: PLAYER });

  //lucky tokens-----------------------------------------------------------------------------------------------------


  function GetRandomNumbers(seedin, count) {
    var seed = seedin;
    function random() {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }

    let results = [];
    for (let i = 0; i < count; i++) {
      results.push(random());
    }

    return results;
  }

  function LoadRandomNumberFromAllTokens(all) {
    let length = all.length;

    let num = length + 1000;

    num = Math.floor(num / 1000);

    console.log('num is: ', num);

    var result = GetRandomNumbers(num, 10);

    for (let i = 0; i < result.length; i++) {
      result[i] = Math.floor(length * result[i]);
    }

    console.log('lucky tokens 2', result);

    return result;
  }


  //lucky tokens-----------------------------------------------------------------------------------------------------

  //--------------------------------------------------------------------------------------------------------
  //loading the initial items


  const [startCollection, SetStartCollection] = useState(
    {
      MVMTokens: [],
      PlayerTokens: [],
      initialized: false
    }
  );

  async function GetStartCollection() {
    let mvmtokens = await GetStartCollectionWithType(dappState.mvmcontract, MVM, address);
    let playertokens = await GetStartCollectionWithType(dappState.playercontract, PLAYER, address);
    SetStartCollection({
      MVMTokens: mvmtokens,
      PlayerTokens: playertokens,
      initialized: true
    });
  }

  async function GetStartCollectionWithType(contract, tokentype, address) {

    console.log('fetching data for token');

    let tokenlist = [];

    let tokenid_distinct = [];

    //user tokens--------------------------------
    console.log('fetch token uri');
    let bal = await fetchUserBalance(contract, address);

    console.log('fetched balance ', bal);


    if (bal > 0) {
      let usertokens = await fetchUserTokens(contract, address, bal);
      tokenid_distinct.push(...usertokens);

      for (let i = 0; i < usertokens.length; i++) {
        tokenlist.push({
          token: usertokens[i],
          type: FULL,
          typeclass: 'full'
        });
      }

    }

    //lucky tokens--------------------------------
    {

      let luckytokens = await GetLuckyTokens(tokentype, allTokens.length);

      let distincttokens = luckytokens.filter(i => !tokenid_distinct.includes(i));
      tokenid_distinct.push(...distincttokens);

      for (let i = 0; i < distincttokens.length; i++) {
        tokenlist.push({
          token: distincttokens[i],
          type: LUCKY,
          typeclass: 'lucky'
        });
      }

    }
    //trial tokens--------------------------------
    {
      let trialtokens = await GetTrialTokens(tokentype, allTokens.length);

      let distincttokens = trialtokens.filter(i => !tokenid_distinct.includes(i));
      tokenid_distinct.push(...distincttokens);

      for (let i = 0; i < distincttokens.length; i++) {
        tokenlist.push({
          token: distincttokens[i],
          type: TRIAL,
          typeclass: 'normal'
        });
      }
    }

    //add the token type

    for (let i = 0; i < tokenlist.length; i++) {
      tokenlist[i].tokentype = tokentype;
    }

    return tokenlist;
  }

  async function fetchUserBalance(contractin, address) {
    if (typeof window.ethereum !== 'undefined') {
      console.log('fetching balance for user: ', address);

      try {
        const data = await contractin.balanceOf(address);
        console.log('user balance: ', data);
        /*      setBalance(data); */
        return data;
      } catch (err) {
        console.log('user balance Error: ', err);
      }
    } else {
      console.log('ethereum api not detected');
      return '';
    }
  }

  async function fetchUserTokens(contractin, address, balanceinput) {
    if (typeof window.ethereum !== 'undefined') {
      console.log('fetching tokens for user: ', address);

      try {
        let tokenids = [];

        for (let i = 0; i < balanceinput; i++) {
          const data = await contractin.tokenOfOwnerByIndex(address, i);
          tokenids.push(data.toNumber());
        }

        console.log('all tokens', tokenids);
        /* 
                setUserTokens(tokenids); */

        return tokenids;
      } catch (err) {
        console.log('fetch tokens Error: ', err);
      }
    } else {
      console.log('ethereum api not detected');
      return [];
    }
  }

  //--------------------------------------------------------------------------------------------------------








  const [wordWrap, setWordWrap] = useState(false);

  /* 
    const [view, setView] = useState(MINT_TOKEN); */
  /* 
  const [view, setView] = useState(INTERACTIVE); */
  /* const [view, setView] = useState(SELECT_TOKENS); */
/* 
  let initview = MINT_TOKEN; */
  //let initview =LOADING;
  
  let initview =PLAY_ALPHA;

  //let initview = MINT_TOKEN;

  if (ExtraData == "DirectPlay" || ExtraData == "AlphaLaunch") {
    initview = LOADING;
  }

  if(rinkebymode){
    initview=MINT_TOKEN;
  }


  const [view, setView] = useState(initview);


  //  const [view, setView] = useState(TOKEN_GALLERY);
  //const [view, setView] = useState(ONE_TOKEN);
  //const [view, setView] = useState(INTERACTIVE);
  const [token, setToken] = useState('0');
  const [interactiveURL, setInteractiveURL] = useState('');
  const [baseURI, setBaseURI] = useState(BASE_URI);
  const [interactiveOwner, SetInteractiveOwner] = useState(null);
  const [allTokens, setAllTokens] = useState([]);
  const [viewUserAddress, setViewUserAddress] = useState('');

  //contract calls

  //fetches all tokens that are minted at the moment
  async function fetchAllTokens() {
    var inputtokens = [];

    if (typeof window.ethereum !== 'undefined') {
      console.log('fetching all tokens');

      try {
        const data = await contract.tokenCounter(); //the maximum
        console.log('maximum counter: ', data);
        for (let i = 0; i < data; i++) {
          //temporary just going to use this increment
          inputtokens.push(i);
        }
        console.log(inputtokens);
      } catch (err) {
        console.log('fetch all token error: ', err);
      }
    } else {
      console.log('ethereum api not detected');
    }

    //append mversetokens

    inputtokens = await IncludeMverseTokens(inputtokens);

    return inputtokens;
  }

  function SetupRandomToken() {
    let randomindex = getRandomInt(allTokens.length); // between 0 to max-1
    console.log('random range is ' + allTokens.length);
    console.log('random id is ' + randomindex);
    console.log('random token is ' + allTokens[randomindex]);

    setToken(allTokens[randomindex]);
  }

  async function fetchAllTokensAndLoadPage() {
    console.log('gallery index use effect');
    let result = await fetchAllTokens();

    console.log('random fetched all token' + result);

    setAllTokens(result);
  }

  async function refreshAndViewTokenPage(tokenid) {
    await fetchAllTokensAndLoadPage();
    await viewTokenPage(tokenid);
  }
  async function viewTokenPage(tokenid) {
    try {

      if (!AutoDetectNetworkPage()) { return; }
      console.log('viewing new token', tokenid);

      setToken(tokenid);
      setView(ONE_TOKEN);
    } catch (error) {
      console.error(error);
    }
  }
  async function viewInteractivePage(tokenin, interactiveownerin) {
    try {

      if (!AutoDetectNetworkPage()) { return; }
      //console.log('viewing new token interactive from url: ', url);
      SetInteractiveOwner(interactiveownerin);
      setToken(tokenin);
      //setInteractiveURL(url);
      setView(INTERACTIVE);
    } catch (error) {
      console.error(error);
    }
  }

  async function viewUserPage(addr) {
    if (!AutoDetectNetworkPage()) { return; }

    setViewUserAddress(addr); //set address then swap view
    setView(USER_TOKENS);
  }

  function AutoDetectNetworkPage() {

    if (window.ethereum != null && correctChain(dappState.chainId)) {
      return true;
    } else {
      //set view and return false;
      setView(CORRECT_NETWORK_WINDOW);
      return false;
    }

  }

  function SimpleDetectNetworkPage() {

    if (window.ethereum != null && correctChain(dappState.chainId)) {
      return true;
    } else {
      //set view and return false;
      return false;
    }

  }

  function RollInteractiveFn() {
    SetInteractiveOwner(null);
    SetupRandomToken();
    setView(INTERACTIVE);
  }

  function JumpToStartItemPage(token, viewmode = INTERACTIVE_VERSE) {
    setView(SELECT_TOKENS);
    SetTempStart(token);
    SetTempViewMode(viewmode);
  }
  /* 
    async function selectStartToken(token) {
      try {
        if (!AutoDetectNetworkPage()) { return; }
        console.log('viewing new token', token);
        switch (token.tokentype) {
          case MVM:
            SetStartMVM(token);
            break;
          case PLAYER:
            SetStartPlayer(token);
            break;
        }
        setView(INTERACTIVE_VERSE);
      } catch (error) {
        console.error(error);
      }
    }
  
   */

  async function GetRandomStartPlayer() {
    try {
      let player = { ...defaultSelected, tokentype: PLAYER };

      player.token = 1234;
      player.type = FULL;

      return player;

    } catch (error) {
      console.error(error);
    }
  }

  async function GetRandomStartMVM() {
    try {
      let mvm = { ...defaultSelected, tokentype: MVM };

      mvm.token = 4567;
      mvm.type = FULL;

      return mvm;

    } catch (error) {
      console.error(error);
    }
  }

  async function GetRandomStartToken(tokentype, addressin) {

    const contractin = ((tokentype == MVM) ?
      dappState.mvmcontract : dappState.playercontract);

    let bal = await fetchUserBalance(contractin, addressin);
    console.log('fetched balance ', bal);
    if (bal > 0) {
      /*     alert('random start token'); */
      let firsttokens = await fetchUserTokens(contractin, addressin, 1);

      return {
        token: firsttokens[0],
        type: FULL,
        tokentype: tokentype
      }

    } else {
      //get lucky tokens for the day
      let length = 10;

      if (tokentype == MVM) {
        length = 8000;
      } else {
        let alltokenin = await fetchAllTokens();
        length = alltokenin.length;
      }

      return {
        token: (await GetLuckyTokens(tokentype, length))[0],
        type: LUCKY,
        tokentype: tokentype
      }

    }
  }

  /* 
    let bal = await fetchUserBalance(contract, address);
  
    console.log('fetched balance ', bal);
  
  
    if (bal > 0) {
      let usertokens = await fetchUserTokens(contract, address, bal);
      tokenid_distinct.push(...usertokens);
  
      for (let i = 0; i < usertokens.length; i++) {
        tokenlist.push({
          token: usertokens[i],
          type: FULL,
          typeclass: 'full'
        });
      }
  
    } */

  function HasType(token) {
    return (token.type == FULL || token.type == LUCKY || token.type == TRIAL);

  }


  async function AutoAddType(token) {
    try {

      if (HasType(token)) {
        return token;
      }

      //determine type here.
      token.type = await GetStartTokenType(address, token.token, token.tokentype, dappState.playercontract,
        dappState.mvmcontract, allTokens.length);

    } catch (error) {
      console.error(error);
    }

    return token;
  }

  async function selectStartToken(token, viewmode = INTERACTIVE_VERSE) {
    try {
      if (!AutoDetectNetworkPage()) { return; }
      console.log('viewing new token', token);

      let mvmtokentarget = {};
      let playertokentarget = {};

      let addressin = address;


      switch (token.tokentype) {
        case MVM:

          mvmtokentarget = token;
          playertokentarget = startPlayer;

          //auto initi player if not inited  
          // if(IsStartTokenInitialized(startPlayer)){
          if (StillDefault(playertokentarget)) {
            //setup the player if needed
            playertokentarget = await GetRandomStartToken(PLAYER, addressin);
          }

          break;
        case PLAYER:

          mvmtokentarget = startMVM;
          playertokentarget = token;

          //auto initi player if not inited  
          /* if(IsStartTokenInitialized(mvmtokentarget)){ */
          /*       if(mvmtokentarget.type=="#"){ */
          if (StillDefault(mvmtokentarget)) {

            //setup the player if needed
            mvmtokentarget = await GetRandomStartToken(MVM, addressin);
          }

          break;
      }

      //auto detects the tokens to initialize

      //auto add types if needed 
      mvmtokentarget = await AutoAddType(mvmtokentarget);
      playertokentarget = await AutoAddType(playertokentarget);

      SetStartMVM(mvmtokentarget);
      SetStartPlayer(playertokentarget);

      //extra check for alpha------------------------------

      if (viewmode == INTERACTIVE_ALPHA) {
        AutoSetAlphaPlayer(playertokentarget);
      }

      //extra check for alpha------------------------------

      //setView(INTERACTIVE_VERSE);

      setView(viewmode);

    } catch (error) {
      console.error(error);
    }
  }

  async function autoloadalltokens() {

  }

  async function StartRandomInteractiveVerse() {
    try {
      if (!AutoDetectNetworkPage()) { return; }

      let mvmtokentarget = await GetRandomStartToken(MVM, address);
      let playertokentarget = await GetRandomStartToken(PLAYER, address);

      /* 
       mvmtokentarget=await AutoAddType(mvmtokentarget);
       playertokentarget=await AutoAddType(playertokentarget);
        */
      SetStartMVM(mvmtokentarget);
      SetStartPlayer(playertokentarget);

      setView(INTERACTIVE_VERSE);
    } catch (error) {
      console.error(error);
    }
  }


  //set specific globe first
  async function LaunchAlpha() {
    try {
      if (!AutoDetectNetworkPage()) { return; }

      let mvmtokentarget =
      {
        token: 3415,
        type: FULL,
        tokentype: MVM
      };
      let playertokentarget = await GetRandomStartToken(PLAYER, address);

      AutoSetAlphaPlayer(playertokentarget);

      /* 
      detect if is original FULL

       mvmtokentarget=await AutoAddType(mvmtokentarget);
       playertokentarget=await AutoAddType(playertokentarget);
        */
      SetStartMVM(mvmtokentarget);
      //SetStartPlayer(playertokentarget);

      setView(INTERACTIVE_ALPHA);
    } catch (error) {
      console.error(error);
    }
  }

  function AutoSetAlphaPlayer(playertokentarget = startPlayer) {

    if (playertokentarget.type != null && playertokentarget.type == FULL) {
      //do nothing, still original
    } else {
      //reset to 128
      playertokentarget.token = 128;
      playertokentarget.type = FULL;
    }

    SetStartPlayer(playertokentarget);
  }

  function JumpToMint(){
    setView(MINT_TOKEN);
  }

  function JumpToPlay(){
    setView(PLAY_ALPHA);
  }

  /* 
    async function StartRandomInteractiveAlpha() {
      try {
        if (!AutoDetectNetworkPage()) { return; }
  
        let mvmtokentarget = await GetRandomStartToken(MVM, address);
        let playertokentarget = await GetRandomStartToken(PLAYER, address);
  
        SetStartMVM(mvmtokentarget);
        SetStartPlayer(playertokentarget);
  
        setView(INTERACTIVE_ALPHA);
      } catch (error) {
        console.error(error);
      }
    }
   */



  function onClickOptionItem(item) {

    if (item != CORRECT_NETWORK_WINDOW
      &&
      item != MINT_TOKEN
    ) {
      if (!AutoDetectNetworkPage()) { return; }
    }

    switch (item) {
      case CORRECT_NETWORK_WINDOW:
        setView(CORRECT_NETWORK_WINDOW);
        break;
      case TOKEN_GALLERY:
        setView(TOKEN_GALLERY);
        break;
      case ONE_TOKEN:
        setView(ONE_TOKEN);
        break;
      case RANDOM_INTERACTIVE:
        //setup a random token, then pass into interactive
        RollInteractiveFn();
        break;
      case RANDOM_INTERACTIVE_VERSE:
        //setup a random token, then pass into interactive
        StartRandomInteractiveVerse();
        break;
      case RANDOM_INTERACTIVE_ALPHA:
        
        setView(PLAY_ALPHA);
        //setup a random token, then pass into interactive
        //LaunchAlpha();
        break;
      case RANDOM_TOKEN:
        //setup a random token, then pass into interactive
        SetupRandomToken();
        setView(ONE_TOKEN);
        break;
      case MINT_TOKEN:
        setView(MINT_TOKEN);
        break;
      case MY_TOKENS:
        setView(MY_TOKENS);
        break;
      case SELECT_TOKENS:
        setView(SELECT_TOKENS);
        break;
      case INTERACTIVE_VERSE:
        setView(INTERACTIVE_VERSE);
        break;
      case INTERACTIVE_ALPHA:
        AutoSetAlphaPlayer();//auto set alpha?
        setView(INTERACTIVE_ALPHA);
        break;

      case 'Project Info':
      case 'Contract':
      case 'About':
        onClickMenuItem('Help');
        break;
      case X_XENO_EVENT:
        //open another link
        window.open(XenoRuleURL);

        break;

      case PLAY_ALPHA:
        setView(PLAY_ALPHA);
      break;
      default:
    }
  }

  //#endregion


  useEffect(() => {
    fetchAllTokensAndLoadPage();

    //also get the location of url
    //if there is tokenid here, just load the token page
    try {

      if (dappState.externalstatread) { return; }

      console.log('print url href', window.location.href);
      console.log('print url path', window.location.pathname);

      let str = window.location.pathname;
      str = str.substring(1);

      let theview = EXTERNAL_LINK;

      //detect interactive
      if (str.charAt(0) == 'i') {
        str = str.substring(1);
      }

      if (str != '') {
        let tid = parseInt(str);
        setToken(tid);
        setView(theview);
      }

    }
    catch (err) {
      console.log('path error');
    }
    setDappState({ ...dappState, externalstatread: true });

  }, []);

  //#region UI Control
  //load interactive verse if extra data mode
  useEffect(() => {
    if (ExtraData == null) { return; }

    if (ExtraData == "DirectPlay") {
      StartRandomInteractiveVerse();
    }

    if (ExtraData == "AlphaLaunch") {
      LaunchAlpha();
    }

  }, [dappState.chainId, dappState.address, allTokens]);
/* 
  useEffect(() => {
    if (dappState.address != null && dappState.address != "") {
      LaunchAlpha();
    }
  }, [dappState.chainId, dappState.address, allTokens]);
 */
  return (
    <ThemeProvider theme={modernDark}>
      <Div>
        <section className="np__toolbar" >
          <WindowDropDowns
            items={dropDownData}
            onClickItem={onClickOptionItem}
          />
        </section>

        <Panel
          variant="well"
          className='panel'
          style={{

            display: 'flex',/* simulationlock */
            /* 
                        display: 'flex', */

            padding: '1rem',
            overflow: 'auto',
            background: '#202127',
            margin: '2px',
            justifyContent: 'center',
            overflow: 'auto',
            alignItems: 'flex-start',
            height: '100%'
          }}
        >


          {view === LOADING && (
            <div>
              Loading... (tip: metamask connection required to load experience)
            </div>
          )}
          {view === MINT_TOKEN && (
            <MintToken allTokens={allTokens}
              viewTokenFn={refreshAndViewTokenPage} rollrandom={RollInteractiveFn}></MintToken>
          )}
          {view === PLAY_ALPHA && (
            <PlayAlpha allTokens={allTokens} LaunchAlpha={LaunchAlpha} JumpToMint={JumpToMint}
              viewTokenFn={refreshAndViewTokenPage} rollrandom={RollInteractiveFn}></PlayAlpha>
          )}
          {view === ONE_TOKEN && (
            <OneToken
              token={token}
              allTokens={allTokens}
              baseURI={baseURI}
              viewTokenFn={viewTokenPage}
              viewInteractiveFn={viewInteractivePage}
              viewUserTokensFn={viewUserPage}
              selectStartTokenFn={selectStartToken}
            ></OneToken>
          )}

          {view === TOKEN_GALLERY && (
            <div>
              <TokenGallery
                allTokens={allTokens}
                baseURI={baseURI}
                viewTokenFn={viewTokenPage}
              ></TokenGallery>
            </div>
          )}
          {/*           {view === INTERACTIVE && (
            <Interactive viewTokenFn={viewTokenPage}
             allTokens={allTokens} 
             url={interactiveURL}
              token={token} 
              userpreviewmodein={true} 
              ownerinput={interactiveOwner}></Interactive>
          )} */}

          {view === MY_TOKENS && (
            <div>
              <UserTokens
                user={address}
                baseURI={baseURI}
                viewTokenFn={viewTokenPage}
              ></UserTokens>
            </div>
          )}

          {view === USER_TOKENS && (
            <div>
              <UserTokens
                user={viewUserAddress}
                baseURI={baseURI}
                viewTokenFn={viewTokenPage}
              ></UserTokens>
            </div>
          )}

          {view === CORRECT_NETWORK_WINDOW && (
            <div>
              <CorrectNetworkWindow
              ></CorrectNetworkWindow>
            </div>
          )}

          {view === EXTERNAL_LINK && (
            <div>
              <ExternalLink
                token={token}
                viewTokenFn={viewTokenPage}
                viewInteractiveFn={viewInteractivePage}
              ></ExternalLink>
            </div>
          )}

          {view === SELECT_TOKENS && (
            <div>
              <SelectTokens
                user={viewUserAddress}
                baseURI={baseURI}
                selectTokenFn={selectStartToken}
                tokentype={tempStart.tokentype}
                tokenlength={allTokens.length}

                viewmode={tempViewMode}

              ></SelectTokens>
            </div>
          )}

          {view === INTERACTIVE_VERSE && (
            <InteractiveVerse viewTokenFn={selectStartToken}
              allTokens={allTokens} url={interactiveURL}
              token={token} userpreviewmodein={true}
              ownerinput={interactiveOwner}

              selectedStartMVM={startMVM}
              selectedStartPlayer={startPlayer}
              selectStartFn={JumpToStartItemPage}

              mode={INTERACTIVE_VERSE}
            ></InteractiveVerse>
          )}


          {view === INTERACTIVE_ALPHA && (
            <InteractiveVerse viewTokenFn={selectStartToken}
              allTokens={allTokens} url={interactiveURL}
              token={token} userpreviewmodein={true}
              ownerinput={interactiveOwner}

              selectedStartMVM={startMVM}
              selectedStartPlayer={startPlayer}
              selectStartFn={JumpToStartItemPage}

              mode={INTERACTIVE_ALPHA}
            ></InteractiveVerse>
          )}





          {view === INTERACTIVE && (
            <InteractiveVerse viewTokenFn={selectStartToken}
              allTokens={allTokens} url={interactiveURL}
              token={token} userpreviewmodein={true}
              ownerinput={interactiveOwner}
              mode={INTERACTIVE}

              selectedStartMVM={startMVM}
              selectedStartPlayer={startPlayer}
              selectStartFn={JumpToStartItemPage}
              JumpToPlay={JumpToPlay}
              viewBasicTokenFn={viewTokenPage}

              selectStartTokenFn={selectStartToken}

            ></InteractiveVerse>
          )}

        </Panel>
      </Div>
    </ThemeProvider>
  );
}


const Div = styled.div`
  height: 100%;
  display: flex;
  overflow: auto;
  flex-direction: column;
  align-items: stretch;
  background: '#202127'
  .np__toolbar {
    position: relative;
    height: 21px;
    flex-shrink: 0;
    border-bottom: 1px solid white;
    
  }

  .panel{
    background:url(${bg})!important;    
    background-size: cover!important;
    background-position: center;
  }
`;

const StyledTextarea = styled.textarea`
  flex: auto;
  outline: none;
  font-family: 'Lucida Console', monospace;
  font-size: 13px;
  line-height: 14px;
  resize: none;
  padding: 2px;
  ${props => (props.wordWrap ? '' : 'white-space: nowrap; overflow-x: scroll;')}
  overflow-y: scroll;
  border: 1px solid #96abff;
`;
