import classes from "./style/layout.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Search from "./components/Search";
import Art from "./components/Art";

function App() {


  return (
    <div >

      <div className={classes.App}>
        <div className={classes.element1} style={{width: "10vw" }}>
          <Art/>
        </div>

        <div className={classes.element2} style={{width: "90vw" }}>
          <Search/>
        </div>

        </div>
  
   
      
    </div>
  );
}

export default App;