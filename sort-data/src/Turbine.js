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
    <input type="file" disabled={uploading}></input>
    <button onClick={upload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
    </button>
    {error && <p className="error">{error}</p>}
    </div>

   {/* {next && <Done />} */}

</div>
    );
}

export default Turbine;