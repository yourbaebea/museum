import classes from "../style/search.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Search() {
  const n= 10;
  const url = "https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&q=";
  
  const urlSpecific = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";
  
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [nothing, setNothing] = useState(false);
  const [picture, setPicture] = useState(true);
  
  async function fetchInfo (){
    setLoading(true);
    setNothing(false);
    const response = await axios.get(`${url}${search}`);
      //const objectIDs = response.data.objectIDs;

    if (response.data.objectIDs === null){
      setLoading(false);
      setNothing(true);
      setData([]);
      setSortedData([]);
      return;
    }
    
    const objectIDs = response.data.objectIDs.slice(0, n);


    const objectDataList = await Promise.all(objectIDs.map(async (id) => {
      
      const specificResponse = await axios.get(`${urlSpecific}${id}`);

      const {
        artistDisplayName,
        artistGender,
        department,
        medium,
        objectDate,
        objectID,
        objectName,
        primaryImage,
        title,
      } = specificResponse.data;

      const finalArtistDisplayName = artistDisplayName !== "" ? artistDisplayName : "Unknown";

    return {
        artistDisplayName: finalArtistDisplayName,
        artistGender,
        department,
        medium,
        objectDate,
        objectID,
        objectName,
        primaryImage,
        title,
      };


       
      }));


      console.log(objectDataList);

      setData(objectDataList);
      setSortedData(objectDataList.slice());

      setLoading(false);
      

  };

  const reset = () => {
    setSortedData(data.slice());
    setPicture(true);
  };

  //TODO change this to only with picture
  const sortByPicture = () => {
    const imageOnly = sortedData.filter((d) => d.primaryImage !== "");
    setSortedData(imageOnly);
    setPicture(false);
  };

  const sortByArtistName = () => {
    const sorted = [...sortedData].sort((a, b) => {
      const artistA = a.artistDisplayName.toUpperCase();
      const artistB = b.artistDisplayName.toUpperCase();
      if (artistA < artistB) return -1;
      if (artistA > artistB) return 1;
      return 0;
    });
    setSortedData(sorted);
  };

  const parseDate = (str) => {
    const match = str.match(/\d+/); // Extracts the first number in the string
    return match ? parseInt(match[0], 10) : 0;
  };

  const sortByDate = () => {
    const sorted = [...sortedData].sort((a, b) => {
      const dateA = parseDate(a.objectDate);
      const dateB = parseDate(b.objectDate);
      return dateA - dateB;
    });
    setSortedData(sorted);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };


  const handleSearch = () => {
    const inputValue = document.getElementById("search").value;
    setSearch(inputValue);
    fetchInfo();
  };

  const handleSearchForm = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    handleSearch();
  };

  return (
    <div className={classes.search}>

      <div className={classes.buttonContainer} > 
      <form className={classes.elementInput}  onSubmit={handleSearchForm}>
        <input className={classes.elementInput} type="text" placeholder="Search..." id="search" value={search} onChange={handleSearchChange} />
      </form> 
        <div className={classes.verticalLine}  />
        <div className={classes.element} onClick={handleSearch} style={{width: "50%"}}>Search</div>
        <div className={classes.verticalLine}  />
        {picture ? <div className={classes.element} onClick={sortByPicture}>Only Show With Picture</div> : <div className={classes.element} onClick={reset}>Show All</div>}
        <div className={classes.verticalLine}  />
        <div className={classes.element} onClick={sortByArtistName}>Sort by Artist Name</div>
        <div className={classes.verticalLine}  />
        <div className={classes.element} onClick={sortByDate}>Sort by Date</div>
        
    
        
        </div>
        <div className={classes.bottomLine} />
        
        <div className={classes.resultContainer} >        
          {nothing && <div className={classes.other}>No results</div>}

          {loading ? <div className={classes.other}>Waiting for response from the Met Museum API...</div>: <>{sortedData.map((d, index) => {
            return (
              <div>
              <div
                key={index}
      
                className={classes.result}
              >

              <div className={classes.resultValues}>

               
              {d.primaryImage !== "" ? <img className={classes.resultImage} src={d.primaryImage} alt="Artwork" />: <div>No Artwork Available</div> } 
              
              
              
              <div className={classes.resultText}>
                
              {d.artistDisplayName !== "" ? <div>Artist: {d.artistDisplayName} </div>: <div>Artist: Unknown</div>} 
              {d.medium !== "" ? <div>Medium: {d.medium} </div>: <></>} 
              {d.objectDate !== "" ? <div>Date: {d.objectDate} </div>: <></>} 
              {d.objectName !== "" ? <div>Art Format: {d.objectName} </div>: <></>} 
              {d.title !== "" ? <div>Title: {d.title} </div>: <></>} 
              </div>
              </div>

              </div>
              <div className={classes.bottomLine} />
              </div>
            );
          })}</>}
        </div>
    </div>
  );
}

export default Search;