import styled from 'styled-components';
import React, { useState, useEffect, useGlobal, setGlobal } from 'reactn';

import axios from 'axios';
import TokenImage from './TokenImage';
import XenoInfinity from 'artifacts/contracts/XenoInfinity.sol/XenoInfinity.json'
import WLXenoDirect from 'artifacts/contracts/WLXenoDirect.sol/WLXenoDirect.json'

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
  , WL_Signature_Address, PC_VERSION, MAC_VERSION,PC_ALT_VERSION,MAC_ALT_VERSION
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
const PlayAlpha = ({ allTokens, viewTokenFn, viewInteractiveFn, rollrandom, LaunchAlpha, JumpToMint }) => {
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

  const [preview, setPreview] = useState(PREVIEW_ANIM);
  const [errorstr, SetErrorStr] = useState("");

  const [buyamount, setBuyamount] = useState(1);

  const [price, setPrice] = useState(MINT_PRICE_DEFAULT);//will just use this first (fetch price might not be used)

  const [buyState, setBuyState] = useState(BUYSTATE_NORMAL);

  const [wlbalance, SetWlBalance] = useState(-1);

  console.log('dapp state', dappState);

  const [correctNetwork, SetCorrectNetwork] = useState(true);
  //const [timer, SetTimer] = useState(80);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' }, addr => {
      console.log('eth requested account success');
      console.log('returned address:', addr);
    });
  }


  async function autoregister_purchase() {
    if (typeof window.ethereum !== 'undefined' && provider != null) {
      setBuyState(BUYSTATE_PAYING);

      await requestAccount();
      //see if provider is there
      console.log('provider is', { provider });

      LaunchAlpha();
    }
  }


  function OpenLink(url){
    window.open(url, '_blank').focus();
  }

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
      <PlayDiv style={{ display: 'flex', width: '100%' }}>

        <Panel
          variant="well"
          style={{
            minHeight: 200,
            width: 210
          }}>
          <TokenImage url={preview}></TokenImage>
        </Panel>
        <Panel
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
{/*           <div className='titleitem'>MVM & XENO - ALPHA LAUNCH EXPORATION LOOT QUEST</div> */}
          <div className='titleitem'>MVM & XENO - EXPLORATION EXPERIENCE DEMO</div>
{/*           <Button
            onClick={autoregister_purchase}
            className='adjtext'
            style={{ margin: '5px', padding: '5px' }}
          >
            {!correctNetwork && <span>Connect Metamask, Practise finding loot</span>}
            {correctNetwork && address == null && (
              <span>Connect Wallet, Practise finding loot</span>
            )}
            {correctNetwork && address != null && buyState != BUYSTATE_REGISTER_WL && (
              <span>
                Practise finding loot (Web Version)
              </span>
            )}

          </Button> 
            


          {!correctNetwork && <span className='hinttext'>Hint: Unlock metamask wallet first, If still can't connect, refresh website</span>}
          {correctNetwork && address == null && (
            <span className='hinttext'>Hint: Unlock metamask wallet first, If still can't connect, refresh website</span>
          )}
*/}
        
        <Button
        className='downloadbtn'
        onClick={()=>OpenLink(PC_VERSION)}
        style={{ margin: '5px', padding: '5px' }}
      >
        Download High Graphics Demo (Windows)
      </Button>

        
        <Button
        className='downloadbtn'

        onClick={()=>OpenLink(MAC_VERSION)}
        style={{ margin: '5px', padding: '5px' }}
      >
        Download High Graphics Demo (macOS)
      </Button>

{/* 

{correctNetwork && address != null && buyState != BUYSTATE_REGISTER_WL && (
        
        <Button
        className='downloadbtn'
        onClick={()=>OpenLink(PC_VERSION)}
        style={{ margin: '5px', padding: '5px' }}
      >
        Download Ultra Graphics Version (Windows)
      </Button>

)}

{correctNetwork && address != null && buyState != BUYSTATE_REGISTER_WL && (
        
        <Button
        className='downloadbtn'

        onClick={()=>OpenLink(MAC_VERSION)}
        style={{ margin: '5px', padding: '5px' }}
      >
        Download Ultra Graphics Version (macOS)
      </Button>

)} */}




        </Panel>
      </PlayDiv>

      <Panel
        variant="well"
        style={{
          textAlign: 'center',
          padding: '20px',
          width: '100%'
        }}
      >
        <LocalVerDiv className='pcverdiv'>

        <Panel variant="well" className='pcverwell'>

The web version is a throttled version of the world experience, for max immersion, high quality graphics and AAA experience with smooth framerates download the early demo game executables here: <a className='atierlink' href={PC_VERSION} target="_blank">windows</a>/<a className='atierlink' href={MAC_VERSION} target="_blank">macOS</a> version

<br/>
<br/>
read current version project notes <a className='atierlink' href="https://vmcreations.gitbook.io/multiverse-vm-and-xeno-infinity-platform/brainstorm/thoughts-on-experience-creation">here</a>, more details coming soon.

{/* <br/>
<br/>
For the flying hoops minigame competition final round, download the game executables with calibrated physics here: <a className='atierlink' href={PC_ALT_VERSION} target="_blank">windows</a>/<a className='atierlink' href={MAC_ALT_VERSION} target="_blank">macOS</a> version */}

</Panel>
{/*           <Panel variant="well" className='pcverwell'>

            Secret multiverse & upgraded graphics, only available in windows/macOS version:<br />
            <a className='atierlink' href={PC_VERSION} target="_blank">Windows ver.</a>&nbsp;&nbsp;
            <a className='atierlink' href={MAC_VERSION} target="_blank">macOS ver.</a>
          </Panel>
 */}
        </LocalVerDiv>
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

        {/*         <img src="./img/universe-original-size.gif" alt="gif " style={{ width: '100%' }} className="PlayAlphaimg" />
 */}
        <StyledDiv className='description'>
        {PLAYERNAMENFT} -- For the players of the MVM & Xeno metaverse platform, the first native open metaverse experience to support all NFTs, become the pioneers of this open metaverse.
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
         
         
         
         
         
         {/*  {PLAYERNAMENFT} -- The first native open metaverse experience to support all NFTs, become the pioneers of this open metaverse.
          <br /><br />
          Enter the 3D open metaverse with any of your NFTs via {PLAYERNAMENFT}, (BAYC/CyberKongz/Cool Cats/Cryptopunks and much more, compatible with 90% of NFTs ALREADY TODAY), be first to experience what an open metaverse is, push the boundaries of what NFTs are capable of with {PLAYERNAMENFT}, it all begins here.
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
          <br /> */}
        </StyledDiv>
      </Panel>
    </Panel>
  );
};
const LocalVerDiv = styled.div`
.pcverwell{
  padding: 10px;
  margin-bottom: 20px;
      font-size: 13px;
      color:white;
}

.pcverdiv{
  font-size: 11px!important;
  margin-bottom:10px;
}

.atierlink{
  color: #25d711;
  text-decoration: underline;

}
.specialtext{
  color: #FFD700;

}

`;

const StyledDiv = styled.div`
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

.description{
  font-size: 14px;
}

.atierlink{
  color: #25d711;
  text-decoration: underline;

}

`;

const PlayDiv = styled.div`
.atierlink{
  color: #25d711;
  text-decoration: underline;

}
.hinttext{
  color: lightgray;
  font-size: 12px;
}
.adjtext{
  height: 50px;
  color: rgb(231, 231, 231);
  font-size: 16px!important;
  margin:0px;
}

.downloadbtn{
  font-size: 11px!important;
}

.titleitem{
  color: rgb(231, 231, 231);
  font-size: 18px;
}
`;

export default PlayAlpha;
