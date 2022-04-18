import styled from 'styled-components';
import axios from 'axios';
import { autourl ,PLAYERNAMES,PLAYERNAME,PLAYERNAMENFTS} from 'lib/lib.js';

import TokenGallery from './TokenGallery';
import React, { useState, useEffect, useGlobal, setGlobal } from 'reactn';
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
  Window,
} from 'react95';

const UserTokens = ({ user, baseURI, viewTokenFn }) => {
  const [dappState, setDappState] = useGlobal();

  const contract = dappState.contract;
  const address = dappState.address;

  const [balance, setBalance] = useState(0);
  const [usertokens, setUserTokens] = useState([]);
  const [queryReady, setQueryReady] = useState(false);

  async function fetchUserBalance(address) {
    if (typeof window.ethereum !== 'undefined') {
      console.log('fetching balance for user: ', address);

      try {
        const data = await contract.balanceOf(address);
        console.log('user balance: ', data);
        setBalance(data);
        return data;
      } catch (err) {
        console.log('user balance Error: ', err);
      }
    } else {
      console.log('ethereum api not detected');
      return '';
    }
  }

  async function fetchUserTokens(address, balanceinput) {
    if (typeof window.ethereum !== 'undefined') {
      console.log('fetching tokens for user: ', address);

      try {
        let tokenids = [];

        for (let i = 0; i < balanceinput; i++) {
          const data = await contract.tokenOfOwnerByIndex(address, i);
          tokenids.push(data.toNumber());
        }

        console.log('all tokens', tokenids);

        setUserTokens(tokenids);

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

      if (user != null) {

        setUserTokens([]);
        console.log('fetch token uri');
        let bal = await fetchUserBalance(user);

        console.log('fetched balance ', bal);

        if (bal > 0) {
          await fetchUserTokens(user, bal);
        }
        setQueryReady(true);
      }
    }

    fetchData();
  }, [user]); 

  return (
    <Div>
      <div className='title whitetext'>
         
         {user==address && (
          <span>My {PLAYERNAMENFTS}</span>
        )}
        {user!=address && (
        <span> {user}'s {PLAYERNAMENFTS}</span>
        )}

      </div>
      <div>
        {!queryReady && <div className='whitetext'>Querying the blockchain...</div>}

        {queryReady && (
          <TokenGallery
            allTokens={usertokens}
            baseURI={baseURI}
            viewTokenFn={viewTokenFn}
          ></TokenGallery>
        )}
      </div>
    </Div>
  );
};




const Div = styled.div`

.title {
  
  margin-bottom: 12px;
  font-size: 18px;
  text-align:center;
}


`;


export default UserTokens;
