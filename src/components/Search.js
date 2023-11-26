import classes from "../style/search.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";

function Search() {
  const url = "https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&q=";
  
  const urlSpecific = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";
  
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [nothing, setNothing] = useState(false);
  const [type, setType] = useState("");
  const [sort, setSort] = useState("");
  
  async function fetchInfo (){
    setLoading(true);
    setNothing(false);
    setType("");
    setSort("");
    
    const targetCount = 10;

    const objectIDsResponse = await axios.get(`${url}${search}`);

    if (!objectIDsResponse.data.objectIDs || objectIDsResponse.data.objectIDs.length === 0) {
      setLoading(false);
      setNothing(true);
      setData([]);
      setSortedData([]);
      return;
    }

  let objectIDs = objectIDsResponse.data.objectIDs;
  let objectDataList = [];

  while (objectDataList.length < targetCount && objectIDs.length > 0) {
    const currentID = objectIDs.shift();

    try {
      const specificResponse = await axios.get(`${urlSpecific}${currentID}`);

      if (!specificResponse.data) {
        console.error(`Error: Response data is null or undefined for object with ID ${currentID}`);
        continue; // Skip to the next iteration
      }

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
        classification
      } = specificResponse.data;

      if (!primaryImage || primaryImage === "") {
        continue
      }

      const finalArtistDisplayName = artistDisplayName !== "" ? artistDisplayName : "Unknown";

      objectDataList.push({
        artistDisplayName: finalArtistDisplayName,
        artistGender,
        department,
        medium,
        objectDate,
        objectID,
        objectName,
        primaryImage,
        title,
        classification,
      });
    } catch (error) {
      console.error(`Error fetching specific object with ID ${currentID}:`, error);
    }
  }


      console.log(objectDataList);
      console.log("with classification");

      setData(objectDataList);
      setSortedData(objectDataList.slice());

      setLoading(false);
      

  };

  const reset = () => {
    setSortedData(data.slice());
    setType("");
  };

  const sortByType = (type) => {
    const typeOnly = data.filter((d) => d.classification.includes(type));
    setSortedData(typeOnly);
    setType(type);
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
    setSort("name");
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
    setSort("date");
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
        
        
       
        <div className={classes.element} onClick={handleSearch}>Missing</div>

        <form className={classes.elementSearch}  onSubmit={handleSearchForm}>
          <input className={classes.elementInput} type="text" placeholder="Search..." id="search" value={search} onChange={handleSearchChange} />
          <div onClick={handleSearch} style={{paddingRight: "15px", paddingTop: "5px", paddingBottom: "5px"}}><CiSearch size={40}/></div>
          
        </form> 

        

        <div className={classes.element}>
          <div className={classes.dropdownContainer}>
          <div className={classes.dropdown}>
            <div className={classes.elementBoxText}> Categories</div>
            <div className={classes.dropdownMenu}>
              <div className={`${classes.elementBox} ${type === 'Painting' ? classes.underlinedElement : ''}`} onClick={() => sortByType("Painting")}>Paintings</div>
              <div className={`${classes.elementBox} ${type === 'Sculpture' ? classes.underlinedElement : ''}`} onClick={() => sortByType("Sculpture")}>Sculptures</div>
              <div className={`${classes.elementBox} ${type === '' ? classes.underlinedElement : ''}`} onClick={reset}>See All</div>
            </div>
          </div>
          </div>
        </div>


        <div className={classes.element}>
          <div className={classes.dropdownContainer}>
          <div className={classes.dropdown}>
            <div className={classes.elementBoxText}>Sort By</div>
            <div className={classes.dropdownMenu}>
            <div className={`${classes.elementBox} ${sort === 'name' ? classes.underlinedElement : ''}`} onClick={sortByArtistName}>Sort by Artist Name</div>
            <div className={`${classes.elementBox} ${sort === 'date' ? classes.underlinedElement : ''}`} onClick={sortByDate}>Sort by Date</div>
            </div>
          </div>
          </div>
        </div>

        <div className={classes.element} onClick={handleSearch}>Missing</div>

      


        </div>


        


        

        
        <div className={classes.resultBox} >        
          {nothing && <div className={classes.other}>No results</div>}

          {loading ? <div className={classes.other}>Waiting for response from the Met Museum API...</div>: <div className={classes.resultContainer}>{sortedData.map((d, index) => {
            return (
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
                 
            );
          })}</div>}
        </div>
    </div>
  );
}

export default Search;