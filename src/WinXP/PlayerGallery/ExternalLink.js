
import styled from 'styled-components';
import axios from 'axios';
import { autourl ,animationurl} from 'lib/lib.js';


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


const ExternalLink = ({
  token,
  viewTokenFn
}) => {
  return (
    <ThemeProvider theme={modernDark}>
    <Div >
          
           <Button className='btn' onClick={() => viewTokenFn(token)}>
              Explore Token #{token}
            </Button>

      </Div>
    </ThemeProvider>
  );
};


const Div = styled.div`
.btn{
  height:50px!important;
  width:300px!important; 
  margin-top:250px;

}


`;

export default ExternalLink;
