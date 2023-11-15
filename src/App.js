import classes from "./style/layout.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Search from "./components/Search";
import Art from "./components/Art";

function App() {


  return (
    <div >

      <div className={classes.App}>
        <div className={classes.element1} style={{width: "200px" }}>
          <Art/>
        </div>

        <div className={classes.element2} style={{width: "calc(100vw - 200px)" }}>
          {/*<p>This is an Search engine for the Met Museum</p>*/}
          <Search/>

          <div className={classes.footer}>

            <div className={classes.footerTM}>Web Development 2023</div>

          </div>

        </div>
        
      </div>
  
   
      
    </div>
  );
}

export default App;