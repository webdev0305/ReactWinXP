import React from 'react';

import { useState,useEffect } from 'reactn';

import styled from 'styled-components';

const TokenImage = ({ url ,fill}) => {

  const [isGif,setIsGif] = useState(false);

  
  useEffect(() => {
      if(!url.includes(".mp4")){
        setIsGif(true);
      }else{
        setIsGif(false);
      }
  }, [url]);

  return (
    <React.Fragment>
      {(!isGif)&& (
        <Video src={url} autoPlay loop muted playsInline preload="auto" />
      )}

      {(isGif) && <Div style={{
        height:fill?'100%':'calc(100% - (35px))',
        width:fill?'100%':'95%',
        marginBottom: fill?'0px':'5px',
  backgroundImage: "url('"+url+"')",
        }}>
        
        </Div>}
    </React.Fragment>
    /* nftinteract/loading.gif
     */
  );
};

const Video = styled.video`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const Div = styled.div`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin: auto;

`;

export default TokenImage;
