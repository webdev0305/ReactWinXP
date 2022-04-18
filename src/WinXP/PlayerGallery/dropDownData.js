
import {autourl,BASE_URI
  ,ONE_TOKEN,TOKEN_GALLERY,INTERACTIVE
  ,MINT_TOKEN,MY_TOKENS,USER_TOKENS
  ,RANDOM_INTERACTIVE,RANDOM_TOKEN,RANDOM_INTERACTIVE_VERSE,X_XENO_EVENT ,RANDOM_INTERACTIVE_ALPHA, PLAY_ALPHA
  } from 'lib/lib.js'


  const Main = [
/*     {
      type: 'item',
      disable: false,
      text: MINT_TOKEN,
    },*/
    {
      type: 'item',
      disable: false,
      text: PLAY_ALPHA,
    }, 
    {
      type: 'item',
      disable: false,
      text: MY_TOKENS,
    }
  ];

  const Explore = [
/*     {
      type: 'item',
      disable: false,
      text: TOKEN_GALLERY,
    }, */
    
    {
      type: 'item',
      disable: false,
      text: MY_TOKENS,
    }
  ];

const FeelingLucky = [

  {
    type: 'item',
    disable: false,
    text: RANDOM_INTERACTIVE_ALPHA
  },
  {
    type: 'item',
    disable: false,
    text: RANDOM_INTERACTIVE
  },
  {
    type: 'item',
    disable: false,
    text: RANDOM_INTERACTIVE_VERSE
  },
  {
    type: 'item',
    disable: false,
    text: RANDOM_TOKEN
  }
];
/* const View = [
  {
    type: 'item',
    disable: false,
    text: 'Contract',
  },
]; */
const Help = [
  {
    type: 'item',
    disable: false,
    text: 'Project Info',
  },
  {
    type: 'item',
    disable:false,
    text: 'About',
  }
];
const Version = [
  {
    type: 'item',
    disable: false,
    text: 'Current Version: Alpha v1.0.10',
  },
  {
    type: 'item',
    disable: false,
    text: 'To Update: CTRL+F5 (WINDOWS), CMD+SHIFT+R (Mac)'
  }
];
/* const Summon = [
  {
    type: 'item',
    disable: false,
    text: X_XENO_EVENT 
  }
]; */
/* export default {Mint,FeelingLucky, Explore , View, Help };
 */
export default {Main,FeelingLucky, Explore , Help,Version};
/* 
export default {Alpha,FeelingLucky, Explore , Help,Summon}; */
