import React from "react";
import { useState } from "react";

import { Storage } from "aws-amplify"

import axios from "axios"

function Turbine() {
    const [file, setFile] = useState(null); //This is to upload the file
    const [uploading, setUploading] = useState(false); //This is for the message on the button
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showup, setShowUp] = useState(false);
    const[next, setNext] = useState(false);
    const [sortError, setSortError] = useState('');
    const [sortType, setSortType] = useState('');
    const [sorting, setSorting] = useState(false);
    const [downloadUrl, setDownloadURL] = useState("");
    const [sortSuccess, setSortSuccess] = useState(false);


    function Done() {
        return (
            <div>
                {success && <p>{file.name} has upload successfully</p>}
                <p>How do you want to sort your phone numbers?</p>
                <form>
               <label><input type="radio" name="datatype" text="By Date" value="date" checked={sortType === "date"} onChange={handleRadioChange}></input>By Date</label>
               <label><input type="radio" name="datatype" text="Trend Analysis" value="trend" checked={sortType === "trend"} onChange={handleRadioChange}></input> Trend Analysis</label>
             </form>

             {sortType === "date" && <DateSort />}
             {sortType === "trend" && <Trend />}
            </div>   
        );
    }

    function DateSort() {
        return (
            <div>
                <button onClick={handleDateSort}>Sort</button>
                {downloadUrl && <a href={downloadUrl} style={{display: downloadUrl ? 'block' : 'none'}} download>Download Sorted File</a>}
            </div>
        )
    }

    function Trend() {
        return (
            <div>
                <button onClick={handleTrend}>Process</button>
                {downloadUrl && <a href={downloadUrl} style={{display: downloadUrl ? 'block' : 'none'}} download>Download File</a>}
            </div>
        )
    }

    const fileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleRadioChange = (event) => {
        setSortType(event.target.value);
      }
    
      const handleDateSort = async () => {
        setSorting(true);
        try {
            const response = await axios.post('https://nt6c8jep2c.execute-api.ca-central-1.amazonaws.com/prod/sort-by-date', { 
                fileName: 'public/' + file.name,
                bucketName: 'sortdatabucket224455-dev'
            });
            if(response.data && response.data.downloadUrl) {
                setDownloadURL(response.data.downloadUrl);
                setSortSuccess(true);
            } else {
                // Handle case where downloadUrl is not in the response
                setSortError('No download URL provided');
                setSortSuccess(false);
            }
        } catch (error) {
            console.error('Error sorting the file:', error);
            setSortError(error.message);
            alert(sortError);
        } finally {
            setSorting(false);
        }
    }

    const handleTrend = async () => {
        setSorting(true);
        try {
            const response = await axios.post('https://nt6c8jep2c.execute-api.ca-central-1.amazonaws.com/prod/trend-analysis', { 
                fileName: 'public/' + file.name,
                bucketName: 'sortdatabucket224455-dev'
            });
            if(response.data && response.data.downloadUrl) {
                setDownloadURL(response.data.downloadUrl);
                setSortSuccess(true);
            } else {
                // Handle case where downloadUrl is not in the response
                setSortError('No download URL provided');
                setSortSuccess(false);
            }
        } catch (error) {
            console.error('Error sorting the file:', error);
            setSortError(error.message);
            alert(sortError);
        } finally {
            setSorting(false);
        }
    }

    const upload = async () => { //Async is so the button will keep having "Uploading...", throughout the entire function
        if (!file) {
            alert("Please upload a file");
            return;
        }
        setUploading(true);
        setSuccess(false);
        setError('');

        try {
            const result = await Storage.put(file.name, file, {
                contentType: file.type,
            });
            console.log(result);
            setSuccess(true);
            setShowUp(true);
        } catch (error) {
            console.error("There was an error uploading your data: " ,error);
            setError("There was an error uploading your data, please try again!", error);
        } finally {
            setUploading(false);
            setNext(true);
        }
    };


return(
    <div>
    <br></br>

    <div hidden={showup}>
    <input type="file" onChange={fileChange} disabled={uploading}></input>
    <button onClick={upload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
    </button>
    {error && <p className="error">{error}</p>}
    </div>

   {next && <Done />}

</div>
    );
}

export default Turbine;