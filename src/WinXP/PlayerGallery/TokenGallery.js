/* 
import 'assets/style/dist2.css';
import 'assets/style/style.css';
import 'assets/style/custom.css';
 */

import styled from 'styled-components';
import axios from 'axios';
import { autourl ,animationurl,PLAYERNAMENFT} from 'lib/lib.js';



import { createGlobalStyle, ThemeProvider } from 'styled-components';



import original from 'react95/dist/themes/original';
import modernDark from 'react95/dist/themes/modernDark';
// original Windows95 font (optionally)
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

import TokenImage from './TokenImage';
import React, { useState, useEffect, useGlobal, setGlobal } from 'reactn';
import {

  styleReset,  Button,
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

const TokenGallery = ({ allTokens, baseURI, viewTokenFn }) => {
  const [page, setPage] = useState(1);

  const max = 4;
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
      number=1;
    } else if (number - 1 >= allTokens.length / max) {
      number= Math.round((allTokens.length + 1) / max);
    } 
    setPage(number);
  } 


  //styles
  const style1 = {
    width: '250px',
    height: '300px',
    margin: '20px',
    overflowY: 'auto',
  };
  return (
    <ThemeProvider theme={modernDark}>
    <Div className="w-full bg-gray-300 pt-3 h-1/2 overflow-y-scroll relative"
      style={{"textAlign":"center","display":"block"}}
    >
        {(!allTokens || allTokens.length === 0) && <p className='whitetext'>No tokens yet...</p>}

        {allTokens &&
          allTokens.length > 0 &&
          (page < 1 || page - 1 >= allTokens.length / max) && (
            <p className='whitetext'>Page not found.</p>
          )}

        {allTokens && allTokens.length > 0 && (
          <div id="default-buttons" className="buttons_row w-full mb-3  h-20/2" style={{height:'40px' ,paddingLeft:'20px',minWidth:'500px'}}>
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

            <Button   style={{
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
         
          {allTokens &&
            allTokens.map((token, index) => {
              if (
                allTokens.slice((page - 1) * max, page * max).includes(token)
              ) {
                return (
                  <Panel variant="inside" shadow style={style1} key={index}
                    onClick={() => viewTokenFn(token)}
                  >
                    <div className='item'>
                      <TokenImage className
                        url={animationurl(token)}
                        fill={false}
                      ></TokenImage>
                      <div>
                        {PLAYERNAMENFT} #{token}
                      </div>  
                    </div>

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
  height:85%;
}


`;

export default TokenGallery;
