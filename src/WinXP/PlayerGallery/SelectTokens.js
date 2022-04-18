
import styled from 'styled-components';
import axios from 'axios';
import { autourl, animationurl, GetLuckyTokens, PLAYERNAME,PLAYERNAMENFT,
  mvmanimationurl, playeranimationurl,GetTrialTokens, FULL, MVM, LUCKY, TRIAL, testwalletmode, PLAYER } from 'lib/lib.js';

import { createGlobalStyle, ThemeProvider } from 'styled-components';

import original from 'react95/dist/themes/original';
import modernDark from 'react95/dist/themes/modernDark';
// original Windows95 font (optionally)
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

import TokenImage from './TokenImage';
import React, { useState, useEffect, useGlobal, setGlobal } from 'reactn';
import {

  styleReset, Button,
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
const Wrapper = styled.div`
  padding: 5rem;
  background: ___CSS_0___;
  #default-buttons button {
    margin-bottom: 1rem;
    margin-right: 1rem;
  }

  #cutout {
    background: ___CSS_1___;
    padding: 1rem;
    width: 300px;
  }
`;

//new stuff 2
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

const SelectTokens = ({ baseURI, selectTokenFn, tokentype,tokenlength,viewmode }) => {

  const [dappState, setDappState] = useGlobal();


  const [page, setPage] = useState(1);
  /* 
  let allTokens=[];
  
  for( let i=0;i<5;i++){
    allTokens.push({
      token:i*5,
      type:'Full Access',
      typeclass:'full'
    });
  }
  
  for( let i=0;i<5;i++){
    allTokens.push({
      token:i*6,
      type:'Feeling Lucky',
      typeclass:'lucky'
    });
  }
  
  for( let i=0;i<5;i++){
    allTokens.push({
      token:i*10,
      type:'Normal',
      typeclass:'normal'
    });
  } */


  /* 
    const max = 4; */
  const max = 8;
  /*  function SwapPage(page) {
     let number = page;
     if (number < 1) {
       return;
     } else if (number - 1 >= allTokens.length / max) {
       return;
     } else {
       setPage(number);
     }
   }  */
  function SwapPage(page) {
    let number = page;
    if (number < 1) {
      number = 1;
    } else if (number - 1 >= allTokens.length / max) {
      number = Math.round((allTokens.length + 1) / max);
    }
    setPage(number);
  }

  const contract = ((tokentype == MVM) ?
    dappState.mvmcontract : dappState.playercontract);

  let address = dappState.address;

  if (testwalletmode) {
    address = "0x484f2bfe6ea59d667fd5cb29ed259329180d0507";
  }

  /* 
    const [balance, setBalance] = useState(0); */
  const [allTokens, SetAllTokens] = useState([]);
  const [queryReady, setQueryReady] = useState(false);

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

  useEffect(() => {
    setQueryReady(false);

    console.log('use effect triggered');

    async function fetchData() {
      console.log('fetching data for token');

      let tokenlist = [];

      let tokenid_distinct = [];

      if (address != null) {


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

          let luckytokens = await GetLuckyTokens(tokentype,tokenlength);

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
          let trialtokens = await GetTrialTokens(tokentype,tokenlength);

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

        SetAllTokens(tokenlist);
        setQueryReady(true);
      }
    }

    fetchData();
  }, [address, tokentype,tokenlength]);



  //styles
  const style1 = {
    width: '140px',
    height: '200px',
    margin: '20px',
    overflowY: 'auto',
  };
  return (
    <ThemeProvider theme={modernDark}>
      <Div className="w-full bg-gray-300 pt-3 h-1/2 overflow-y-scroll relative"
        style={{ "textAlign": "center", "display": "block" }}
      >
        <span>{tokentype == MVM ? "Simulation Planet" : PLAYERNAMENFT}</span>
        <br />
        {!queryReady && <div className='whitetext'>Querying the blockchain...</div>}

        {queryReady && (!allTokens || allTokens.length === 0) && <p className='whitetext'>No tokens yet...</p>}

        {queryReady && allTokens &&
          allTokens.length > 0 &&
          (page < 1 || page - 1 >= allTokens.length / max) && (
            <p className='whitetext'>Page not found.</p>
          )}

        {queryReady && allTokens && allTokens.length > 0 && (
          <div id="default-buttons" className="buttons_row w-full mb-3  h-20/2 buttonsbar" style={{ height: '40px', paddingLeft: '20px', minWidth: '500px' }}>
            <Button
              onClick={() => SwapPage(1)}
              style={{
                width: '14%',
                height: '100%',
                margin: '0 2% 0 0'
              }}
            >
              First</Button>


            <Button
              onClick={() => SwapPage(page - 1)}
              style={{
                width: '17%',
                height: '100%',
                margin: '0 2% 0 0'
              }}
            >
              Previous
            </Button>

            <Button style={{
              width: '26%',
              height: '100%',
              padding: '0px',
              margin: '0 2% 0 0',
            }}
              onClick={() => SwapPage(Math.round(Math.random() * (allTokens.length / max)))}
            >
              Feeling Lucky
            </Button>

            <Button
              onClick={() => SwapPage(page + 1)}
              style={{
                width: '17%',
                height: '100%',
                margin: '0 2% 0 0'
              }}>Next</Button>
            <Button
              onClick={() => SwapPage(Math.round((allTokens.length + 1) / max))}
              style={{
                width: '14%',
                height: '100%',
                margin: '0 2% 0 0'
              }}
            >
              Last
            </Button>
          </div>
        )}

        <div className="Ken_rows overflow-hidden h-180/2 controlHeight abolute left-0 bottom-2 text-center ">

          {queryReady && allTokens &&
            allTokens.map((token, index) => {
              if (
                allTokens.slice((page - 1) * max, page * max).includes(token)
              ) {
                return (
                  <Panel variant="inside" shadow style={style1} key={index}
                    onClick={() => selectTokenFn(token,viewmode)}
                  >

                    {tokentype == MVM && (

                      <div className='item'>
                        <TokenImage className
                          url={mvmanimationurl(token.token)}
                          fill={false}
                        ></TokenImage>
                        <div >
                          Simulation #{token.token} <br />
                          Type: <span className={token.typeclass}>{token.type}</span>
                        </div>
                      </div>

                    )}

                    {tokentype == PLAYER && (

                      <div className='item'>
                        <TokenImage className
                          url={playeranimationurl(token.token)}
                          fill={false}
                        ></TokenImage>
                        <div >
                          {PLAYERNAMENFT} #{token.token} <br />
                          Type: <span className={token.typeclass}>{token.type}</span>
                        </div>
                      </div>
                    )}



                  </Panel>

                );
              } else {
                return null;
              }
            })}
        </div>
      </Div>
    </ThemeProvider>
  );
};

const Div = styled.div`

.buttonsbar{
  
  margin-top: 12px;
}
.item {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  font-size: 12px;
  width:100%;
}

.item video {
  margin-bottom:5px;
  object-fit: cover;
  width:90%;
  height:75%;
}

.item .full {
  color:white!important;
}

.item .lucky {
  color: lightgray;
}

.item .normal {
  color:orange;
}

`;

export default SelectTokens;
