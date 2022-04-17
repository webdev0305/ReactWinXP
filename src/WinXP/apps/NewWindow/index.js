import React from 'react';
import styled from 'styled-components';
import ga from 'react-ga';
import Background from 'assets/images/button.png';
// import { WindowDropDowns } from 'components';
// import dropDownData from './dropDownData';
import go from 'assets/windowsIcons/290.png';
import search from 'assets/windowsIcons/299(32x32).png';
import computer from 'assets/windowsIcons/676(16x16).png';
import back from 'assets/windowsIcons/back.png';
import forward from 'assets/windowsIcons/forward.png';
import up from 'assets/windowsIcons/up.png';
import viewInfo from 'assets/windowsIcons/view-info.ico';
import remove from 'assets/windowsIcons/302(16x16).png';
import control from 'assets/windowsIcons/300(16x16).png';
import network from 'assets/windowsIcons/693(16x16).png';
import document from 'assets/windowsIcons/308(16x16).png';
import folderSmall from 'assets/windowsIcons/318(16x16).png';
import menu from 'assets/windowsIcons/358(32x32).png';
import folder from 'assets/windowsIcons/318(48x48).png';
import folderOpen from 'assets/windowsIcons/337(32x32).png';
import disk from 'assets/windowsIcons/334(48x48).png';
import cd from 'assets/windowsIcons/111(48x48).png';
import dropdown from 'assets/windowsIcons/dropdown.png';
import pullup from 'assets/windowsIcons/pullup.png';
import logo from 'assets/github-logo.png';
import mine from 'assets/minesweeper/mine-icon.png';
import windows from 'assets/windowsIcons/windows.png';

function NewWindow({ onClose }) {
  function onClickOptionItem(item) {
    switch (item) {
      case 'Close':
        onClose();
        break;
      default:
    }
  }
  return (
    <Div>
      <div className="com__content">
        <div className="com__content__inner">
          <div className="com__content__right" style={{background: "black"}}>
            
            <div className="com__content__right__card com__content__right__card--me" style={{margin:"50px", borderRadius:"5px", backgroundColor:"white", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"}}>
                <div style={{width:"200px", margin: "auto", paddingTop: "20px"}}>
                    <img
                        className="com__content__right__card__img"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5DM1_W4NxE1s3l7JyIEqZo9ryYpw6jPd99g&usqp=CAU"
                        alt="control"
                    />
                </div>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop:"30px"}}>
                    <span style={{fontSize:"20px"}}>You can claim Xlootboxes, you will need to hold X xeno</span>
                </div>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop:"30px"}}>
                <button style={{backgroundColor: "red", width: '200px', border:"0px solid", padding:"10px", color:"white", borderRadius:"5px", cursor:"pointer"}}>Claim your lootbox</button>
                </div>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBlock:"30px"}}>
                    <span style={{fontSize:"20px"}}>You currently own X lootboxes</span>
                </div>
                
              {/* <div className="com__content__right__card__header">
                About Me :)
              </div>
              <div className="com__content__right__card__content">
                <ga.OutboundLink
                  eventLabel="https://github.com/ShizukuIchi"
                  to="https://github.com/ShizukuIchi"
                  className="com__content__right__card__item--me"
                  target="_blank"
                >
                  
                  <div className="com__content__right__card__text">Github</div>
                </ga.OutboundLink>
                <ga.OutboundLink
                  eventLabel="https://sh1zuku.csie.io"
                  to="https://sh1zuku.csie.io"
                  className="com__content__right__card__item--me"
                  target="_blank"
                >
                  <img
                    className="com__content__right__card__img"
                    src="https://a.ppy.sh/2926513_1448497605.png"
                    alt="control"
                  />
                  <div className="com__content__right__card__text">
                    My Website
                  </div>
                </ga.OutboundLink>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </Div>
  );
}

const Div = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  background: linear-gradient(to right, #edede5 0%, #ede8cd 100%);
  .com__toolbar {
    position: relative;
    display: flex;
    align-items: center;
    line-height: 100%;
    height: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.7);
    flex-shrink: 0;
  }

  .com__options {
    height: 23px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    padding: 1px 0 1px 2px;
    border-left: 0;
    flex: 1;
  }
  .com__windows-logo {
    height: 100%;
    border-left: 1px solid white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .com__function_bar {
    height: 36px;
    display: flex;
    align-items: center;
    font-size: 11px;
    padding: 1px 3px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }
  .com__function_bar__button {
    display: flex;
    height: 100%;
    align-items: center;
    border: 1px solid rgba(0, 0, 0, 0);
    border-radius: 3px;
    &:hover {
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.1);
    }
    &:hover:active {
      border: 1px solid rgb(185, 185, 185);
      background-color: #dedede;
      box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.7);
      color: rgba(255, 255, 255, 0.7);
      & > * {
        transform: translate(1px, 1px);
      }
    }
  }
  .com__function_bar__button--disable {
    filter: grayscale(1);
    opacity: 0.7;
    display: flex;
    height: 100%;
    align-items: center;
    border: 1px solid rgba(0, 0, 0, 0);
  }
  .com__function_bar__text {
    margin-right: 4px;
  }
  .com__function_bar__icon {
    height: 30px;
    width: 30px;
    &--normalize {
      height: 22px;
      width: 22px;
      margin: 0 4px 0 1px;
    }
    &--margin12 {
      height: 22px;
      width: 22px;
      margin: 0 1px 0 2px;
    }
    &--margin-1 {
      margin: 0 -1px;
      height: 30px;
      width: 30px;
    }
  }
  .com__function_bar__separate {
    height: 90%;
    width: 1px;
    background-color: rgba(0, 0, 0, 0.2);
    margin: 0 2px;
  }
  .com__function_bar__arrow {
    height: 100%;
    display: flex;
    align-items: center;
    margin: 0 4px;
    &:before {
      content: '';
      display: block;
      border-width: 3px 3px 0;
      border-color: #000 transparent;
      border-style: solid;
    }
  }
  .com__function_bar__arrow--margin-11 {
    height: 100%;
    display: flex;
    align-items: center;
    margin: 0 1px 0 -1px;
    &:before {
      content: '';
      display: block;
      border-width: 3px 3px 0;
      border-color: #000 transparent;
      border-style: solid;
    }
  }
  .com__address_bar {
    flex-shrink: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.7);
    height: 20px;
    font-size: 11px;
    display: flex;
    align-items: center;
    padding: 0 2px;
    box-shadow: inset 0 -2px 3px -1px #b0b0b0;
  }
  .com__address_bar__title {
    line-height: 100%;
    color: rgba(0, 0, 0, 0.5);
    padding: 5px;
  }
  .com__address_bar__content {
    border: rgba(122, 122, 255, 0.6) 1px solid;
    height: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    background-color: white;
    position: relative;
    &__img {
      width: 14px;
      height: 14px;
    }
    &__img:last-child {
      width: 15px;
      height: 15px;
      right: 1px;
      position: absolute;
    }
    &__img:last-child:hover {
      filter: brightness(1.1);
    }
    &__text {
      white-space: nowrap;
      position: absolute;
      white-space: nowrap;
      left: 16px;
      right: 17px;
    }
  }

  .com__address_bar__go {
    display: flex;
    align-items: center;
    padding: 0 18px 0 5px;
    height: 100%;
    position: relative;
    &__img {
      height: 95%;
      border: 1px solid rgba(255, 255, 255, 0.2);
      margin-right: 3px;
    }
  }
  .com__address_bar__links {
    display: flex;
    align-items: center;
    padding: 0 18px 0 5px;
    height: 100%;
    position: relative;
    &__img {
      position: absolute;
      right: 2px;
      top: 3px;
      height: 5px;
      width: 8px;
    }
    &__text {
      color: rgba(0, 0, 0, 0.5);
    }
  }
  .com__address_bar__separate {
    height: 100%;
    width: 1px;
    background-color: rgba(0, 0, 0, 0.1);
    box-shadow: 1px 0 rgba(255, 255, 255, 0.7);
  }
  .com__content {
    flex: 1;
    border: 1px solid rgba(0, 0, 0, 0.4);
    border-top-width: 0;
    background-color: #f1f1f1;
    overflow: auto;
    font-size: 11px;
    position: relative;
  }
  .com__content__inner {
    display: flex;
    height: 100%;
    overflow: auto;
  }
  .com__content__left {
    width: 180px;
    height: 100%;
    background: linear-gradient(to bottom, #748aff 0%, #4057d3 100%);
    overflow: auto;
    padding: 10px;
  }

  .com__content__left__card {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    width: 100%;
    overflow: hidden;
  }
  .com__content__left__card:not(:last-child) {
    margin-bottom: 12px;
  }
  .com__content__left__card__header {
    display: flex;
    align-items: center;
    height: 23px;
    padding-left: 11px;
    padding-right: 2px;
    cursor: pointer;
    background: linear-gradient(
      to right,
      rgb(240, 240, 255) 0,
      rgb(240, 240, 255) 30%,
      rgb(168, 188, 255) 100%
    );
  }
  .com__content__left__card__header:hover {
    & .com__content__left__card__header__text {
      color: #1c68ff;
    }
  }
  .com__content__left__card__header__text {
    font-weight: 700;
    color: #0c327d;
    flex: 1;
  }
  .com__content__left__card__header__img {
    width: 18px;
    height: 18px;
    filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.3));
  }
  .com__content__left__card__content {
    padding: 5px 10px;
    background: linear-gradient(
      to right,
      rgb(180, 200, 251) 0%,
      rgb(164, 185, 251) 50%,
      rgb(180, 200, 251) 100%
    );
    background-color: rgba(198, 211, 255, 0.87);
  }
  .com__content__left__card__row {
    display: flex;
    margin-bottom: 2px;
  }

  .com__content__left__card__img {
    width: 14px;
    height: 14px;
    margin-right: 5px;
  }
  .com__content__left__card__text {
    font-size: 10px;
    line-height: 14px;
    color: #0c327d;
    &.black {
      color: #000;
    }
    &.bold {
      font-weight: bold;
    }

    &.link:hover {
      cursor: pointer;
      color: #2b72ff;
      text-decoration: underline;
    }
  }
  .com__content__right {
    height: 100%;
    overflow: auto;
    background-color: #fff;
    flex: 1;
  }
  .com__content__right__card__header {
    width: 300px;
    font-weight: 700;
    padding: 2px 0 3px 12px;
    position: relative;
    &:after {
      content: '';
      display: block;
      background: linear-gradient(to right, #70bfff 0, #fff 100%);
      position: absolute;
      bottom: 0;
      left: -12px;
      height: 1px;
      width: 100%;
    }
  }
  .com__content__right__card__content {
    display: flex;
    align-items: center;
    padding-right: 0;
    flex-wrap: wrap;
    padding: 15px 15px 0;
  }
  .com__content__right__card__item {
    display: flex;
    align-items: center;
    width: 200px;
    margin-bottom: 15px;
    height: auto;
  }
  .com__content__right__card__img {
    width: 100%;
    height: 100%;
    margin-right: 5px;
  }
  .com__content__right__card__text {
    white-space: nowrap;
    height: 100%;
  }
  .com__content__right__card--me {
    .com__content__right__card__header:after,
    .com__content__right__card__header {
      transition: 0.4s;
    }
    &:hover {
      .com__content__right__card__header:after {
        width: 0;
      }
      .com__content__right__card__header {
        transform: scale(1.2) translate(20px, 5px);
      }
    }
  }
  .com__content__right__card__item--me {
    display: flex;
    align-items: center;
    width: 200px;
    margin-bottom: 15px;
    height: auto;
    & > * {
      transition: transform 0.2s;
    }
    &:hover .com__content__right__card__img {
      transform: rotate(-10deg) scale(0.9);
    }
    &:hover .com__content__right__card__text {
      transform: scale(1.2);
      transition-timing-function: cubic-bezier(0.23, 1.93, 0.59, -0.15);
    }
  }
`;

export default NewWindow;
