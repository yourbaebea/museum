import classes from "../style/page.module.css";
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

      return {
        artistDisplayName,
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
  };

  const sortByType = () => {
    const paintingsOnly = sortedData.filter((d) => d.objectName.toLowerCase().includes("painting"));
    setSortedData(paintingsOnly);
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

  return (
    <div className={classes.search}>
        <input type="text" placeholder="Search..." id="search" value={search} onChange={handleSearchChange} />
        <button onClick={handleSearch}>Search</button>
        <button onClick={sortByArtistName}>Sort by Artist Name</button>
        <button onClick={sortByDate}>Sort by Date</button>
        <button onClick={reset}>Reset</button>
        <button onClick={sortByType}>Only show Painting</button> {/*objectName */}
        
        {nothing && <div>No results</div>}

        {loading ? <div>Waiting for response from the Met Museum API...</div>: <>{sortedData.map((d, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: "#CD8FFD",
                margin: "10px"
              }}
            >

            {d.artistDisplayName !== "" ? <div>Artist: {d.artistDisplayName} </div>: <div>Artist: Unkown</div>} 
            {d.artistGender !== "" ? <div>Gender: {d.artistGender} </div>: null} 
            {d.department !== "" ? <div>Department: {d.artistDisplayName} </div>: null} 
            {d.medium !== "" ? <div>Medium: {d.medium} </div>: null} 
            {d.objectDate !== "" ? <div>Date: {d.objectDate} </div>: null} 
            {d.objectName !== "" ? <div>Art Format: {d.objectName} </div>: null} 
            {d.primaryImage !== "" ? <img style={{width: "50px", height: "50px"}} src={d.primaryImage} alt="Artwork" />: <div>No Artwork Available</div> } 
            {d.title !== "" ? <div>Title: {d.title} </div>: null} 
            


            </div>
          );
        })}</>}
    </div>
  );
}

export default Search;