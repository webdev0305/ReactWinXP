
import React, { useState, createRef } from 'react';

import { Button } from 'react95';

const CollectableDiv = ({ item, onClickFn ,disabled}) => {


  return (
    <div className="lootItem">
      <Button className="btn" onClick={() => onClickFn(item)} disabled={disabled}>

        {item.img && (
          <img
            alt="character"
            src={item.img}
            style={{ borderRadius: '5px', maxWidth: '60px',maxHeight:'60px' }}
          ></img>
        )}

        <div>{item.name}</div>
      </Button>
    </div>
  );
};

export default CollectableDiv;
