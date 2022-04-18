import styled from 'styled-components';
import React, { useState, useEffect, useGlobal, setGlobal } from 'reactn'; //new stuff to make react95 work
import { createGlobalStyle, ThemeProvider } from 'styled-components';
//new stuff implemented
// pick a theme of your choice
import original from 'react95/dist/themes/original';
import modernDark from 'react95/dist/themes/modernDark';
// original Windows95 font (optionally)
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

import { autourl, PLAYER, TRIAL, 
  
  IsStartTokenInitialized,MVM, autotokenuri, fetchLinks, processLinkarray, 
  animfromipfs, ANIMATION_BASE_URI, MAX_TOKEN, mverseTokensArray ,GetQuickTokenURI
,PLAYERNAME,PLAYERNAMES} from 'lib/lib.js';
import axios from 'axios';
import TokenImage from './TokenImage';

import {
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
  Window, Fieldset
} from 'react95';

const OneToken = ({
  token,
  allTokens,
  baseURI,
  viewTokenFn,
  viewInteractiveFn,
  viewUserTokensFn, selectStartTokenFn
}) => {
  //load the token data here

  const [dappState, setDappState] = useGlobal();

  const contract = dappState.contract;
  const address = dappState.address;

  console.log('dapp state', dappState);

  console.log('one token contract', contract);
  console.log('address', contract);

  const [tokenuri, setTokenuri] = useState('');
  const [tokenMetadata, setTokenMetadata] = useState({});

  const [name, setName] = useState('');
  const [traits, setTraits] = useState([]);
  const [anim, setAnim] = useState('');
  const [owner, setOwner] = useState('');
/*   const [tokenData, SetTokenData] = useState({
    spaceObjects: [],
    globeObjects: []
  }); */

  /* 
    const [links, SetLinks] = useState([]);
    const [dynamicLinks,SetDynamicLinks] = useState([]); */

  console.log('other properties', tokenuri, name, traits);

  //so fetch the attributes now?

  //contract calls

  //#region contract calls

  //0 static links
  //1 dynamic user links
  async function fetchTokenURI(tokenId) {
    if (typeof window.ethereum !== 'undefined') {
      console.log('fetching token id uri');

      try {

        return GetQuickTokenURI(tokenId);

        let data = await contract.tokenURI(tokenId);
        data = autotokenuri(data);
        console.log('token URI: ', data);
        //setGlobal({extradata:data})
        setTokenuri(data);
        return data;
      } catch (err) {
        console.log('token URI Error: ', err);
      }
    } else {
      console.log('ethereum api not detected');
      return '';
    }
  }

  async function fetchAndSetOwner(tokenId) {
    if (typeof window.ethereum !== 'undefined') {
      console.log('fetching token owner');

      try {
        const data = await contract.ownerOf(Number(tokenId));
        console.log('token Owner: ', data);
        //setGlobal({extradata:data})
        setOwner(data);
        return data;
      } catch (err) {
        console.log('token Owner Error: ', err);
      }
    } else {
      console.log('ethereum api not detected');
      return '';
    }
  }

  //#endregion

  //#region apiCallAndSet

  function GetAnimURL(data) {

    if (animfromipfs) {
      return data.imageanim;
    } else {
      //return 
      return ANIMATION_BASE_URI + data.tokenID + ".mp4";
    }
  }


  async function fetchAndSetMetadata(url) {
    //get the token uri

    //await
    console.log('axios', url);
    axios
      .get(url, {
        responseType: 'json',
      })
      .then(response => {
        //so the value should be in data

        var data = response.data;
        console.log('response data');
        console.log(data);

        //loop through attributes

        //setIpfshash(response.data["image"].substring(7));
        let attrs = Object.entries(data['attributes']).map(([key, value]) =>
          Object.values(value).filter(r => true),
        );

        var traitsobj = data['attributes'];
        console.log(traitsobj);
        setTraits(traitsobj);
        setName(data.name);
        setAnim(autourl(GetAnimURL(data)));
        // setAnim('http://localhost:3000/nftinteract/loading.gif');

        setTokenMetadata(data);
     /*    SetTokenData(data); */
        /*     SetSpaceObjects(data['spaceObjects']);
            SetGlobeObjects(data['globeObjects']); */
/* 
        console.log('token data', data); */

      })
      .catch(error => {
        console.log(error);
      });
  }
/* 
  useEffect(() => {
    console.log('use effect token data');
    console.log(tokenData);
  }, [tokenData]); //
 */
  useEffect(() => {
    console.log('use effect triggered');

    async function fetchData() {
      console.log('fetching data for token');
      console.log(allTokens);
      console.log(token);

      if (allTokens != null && token != null) {
        //if there is data here
        console.log('fetch token uri');
        let tokenurl = await fetchTokenURI(token);

        console.log('fetched token url await', tokenurl);

        if (tokenurl != '') {
          await fetchAndSetMetadata(tokenurl);
        } else {
          console.log('no url');
        }

        //let owner= await fetchAndSetOwner();
        await fetchAndSetOwner(token);
      }
    }
    /* 
        async function fetchsetlinks() {
          console.log('fetching links of tokens');
    
          if (allTokens != null && token != null) {
    
            let linkarray=await fetchLinks(contract,token,0);
            let dynamiclinkarray=await fetchLinks(contract,token,1);
    
            let formattedarray1 =processLinkarray(allTokens,linkarray);
            let formattedarray2 =processLinkarray(allTokens,dynamiclinkarray);
            
            SetLinks(formattedarray1);
            SetDynamicLinks(formattedarray2);
    
          }
        }
     */
    fetchData();
    /*    fetchsetlinks(); */

  }, [allTokens, token, baseURI]);

  function isusertheowner() {
    console.log('owner:', owner);
    console.log('address:', address);

    if (owner != null && address != null) {
      return owner.toUpperCase() === address.toUpperCase();
    } else {
      return false;
    }

  }
  /* 
    function SwapPage(newtoken) {
      console.log('swap page', newtoken);
      if (newtoken < 0) {
        return;
      } else if (newtoken >= allTokens.length) {
        return;
      } else {
        viewTokenFn(newtoken.toString());
      }
    } */

  function SwapPageSpecific(newtoken) {
    //loop through all tokens, if exists then jump to it
    try {

      if (allTokens.includes(parseInt(newtoken))) {
        viewTokenFn(newtoken.toString());
      }
    } catch (err) {
      console.log(err);
    }
  }
  //next=true>next
  //next=false<prev
  function SwapPageDirection(oldtoken, next) {

    //simple test first
    let newt = next ? oldtoken + 1 : oldtoken - 1;//

    if (allTokens.includes(newt)) {
      viewTokenFn(newt.toString());
      return;
    }

    //simple -1/+1 doesn't work then just loop through tokens (not optimized)
    if (next) {

      for (let i = 0; i < allTokens.length; i++) {
        if (allTokens[i] > oldtoken) {
          viewTokenFn(allTokens[i].toString());
          break;
        }//
      }

    } else {

      for (let i = allTokens.length - 1; i >= 0; i--) {
        //from large to small
        if (allTokens[i] < oldtoken) {
          viewTokenFn(allTokens[i].toString());
          break;
        }//
      }

    }
  }

  function ViewFinalToken() {
    viewTokenFn(allTokens[allTokens.length - 1].toString());
  }

  return (
    <ThemeProvider theme={modernDark}>
      <Div>
        <div id="default-buttons" className="buttons_row secondDivKenGallery">
          <Button
            onClick={() => SwapPageSpecific(0)}
            style={{
              width: '20%',
              height: '100%',
            }}
          >
            First
          </Button>
          <Button
            onClick={() => SwapPageDirection(parseInt(token), false)}
            style={{
              width: '20%',
              height: '100%',
            }}
          >
            Previous
          </Button>
          <TextField
            placeholder={token}
            style={{
              width: '20%',
              height: '100%',
              border: 'none',
              boxShadow: 'none',
              boxSizing: 'unset',
              padding: '0px',
              margin: '1% 0',
              display: 'inline-block'
            }}
            className='text'
            onKeyPress={event => {
              if (event.key === 'Enter') {
                SwapPageSpecific(event.target.value);
              }
            }}
            fullWidth
          />
          <Button
            onClick={() => SwapPageDirection(parseInt(token), true)}
            style={{
              width: '20%',
              height: '100%',
            }}
          >
            Next
          </Button>
          <Button
            onClick={() => ViewFinalToken()}
            style={{
              width: '20%',
              height: '100%',
            }}
          >
            Last
          </Button>
        </div>

        <div className="topsection">
          <Panel variant="inside" shadow className="imagesection">
            <TokenImage url={anim} fill={true}></TokenImage>
          </Panel>

          <Panel variant='well' className="rightsection">
            <div className='fieldsection'>

              <div >{name}</div>
              <div> Owner: <br /> {owner}</div>



            </div>
            <div className='buttons'>

         {/*      <Button onClick={() => selectStartTokenFn({
                token: token,
                tokentype: PLAYER
              }
              )}>
                Use In Metaverse
              </Button>
 */}
              <Button onClick={() => viewInteractiveFn(token, owner)}>
                Use In Metaverse
             </Button>
              <Button onClick={() => viewUserTokensFn(owner)}>
                {isusertheowner()
                  ? 'See all my tokens'
                  : "See this owner's tokens"}
              </Button>
            </div>

          </Panel>
        </div>
        {/* 
        {(links.length>0||dynamicLinks.length>0) && (
        <Panel variant="well" className="linkspanel">
          <div>
            Connected Portals:
            </div>
          <ul className="linksdetails">
            
            {links.map((item , index)=> {
              return <li key={index} onClick={
                () => SwapPageSpecific(parseInt(item.itemid))
              } className={item.classstr}>{item.itemid}</li>;
            })}
            
            {dynamicLinks.map((item , index) => {
              return <li key={index} className={'userlink '+item.classstr}
              onClick={
                () => SwapPageSpecific(parseInt(item.itemid))
              } 
              >{item.itemid}</li>;
            })}

          </ul>
        </Panel>
      )}  */}

        <Table className="tablesection">
          <TableHead style={{ width: '100%' }}>
            <TableRow head style={{ width: '100%' }}>
              <TableHeadCell style={{ width: '50%' }}>Stat Name</TableHeadCell>
              <TableHeadCell style={{ width: '50%' }}>Stat Value</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {traits.map(trait => (
              <TableRow key={trait.trait_type}>
                <TableDataCell className="cell"
                >
                  {trait.trait_type}
                </TableDataCell>
                <TableDataCell className="cell"
                >
                  {trait.value}
                </TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>


      </Div>
    </ThemeProvider>
  );
};

const Div = styled.div`

.cell{
  color:#f88702;
}

background:#202127;
padding: 5px;
padding-top: 0px;

width:70%;

.objectsPanel{
  width:100%;
  padding: 10px;
  display:flex;
}
.objectsPanel>div{
  margin:5px;
  width:50%;
  background:rgb(209, 213, 219);

}
.objectsPanel  .tablesection{
  width:100%;
  font-size:10px;
}

  .buttons_row {
    height:40px;
  }
  .buttons_row .text input{
    text-align:center;
  }
  .buttons_row button{
  }

  .topsection {
    display: flex;
    margin-bottom: 10px;
    margin-top: 10px;
    justify-content: space-between;
    
}
  .topsection .imagesection {
    width:40%;
  }
  .topsection .rightsection {
    padding: 16px;
    width:58%;
    display:flex;
    flex-wrap: wrap;
    align-content: space-around;
    justify-content: center;
    align-items: center;
  }

  .topsection .rightsection .fieldsection{
    width:100%;
      font-size:14px;
      
    word-wrap: break-word;
    text-align: center;
      
  text-overflow: ellipsis;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
  }
  .topsection .rightsection .buttons{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    height: 120px;
  }
  .topsection .rightsection .buttons button{
      width:200px;
      font-size: 12px;
  }

  .tablesection {
    font-size: 13px;
    text-align: center;
  }
  .linkspanel {width: 100%;
    margin-bottom: 10px;
    padding: 5px;
    font-size: 10px;
}
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

  .linkspanel li.minted:hover {
    
  font-weight: bold;
  }
  .linkspanel .userlink{
    color:blue;
  }

  `;


export default OneToken;
