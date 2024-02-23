import React from "react";
import { useState } from "react";

import { Storage } from "aws-amplify"

function Phone() {

    const [file, setFile] = useState(null); //Tis is to upload the file
    const [uploading, setUploading] = useState(false); //This is for the message on the button
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const[next, setNext] = useState(false);

    function Done() {
        return (
            <div>
                <p>This is a test</p>
            </div>   
        );
    }

    const fileChange = (event) => {
        setFile(event.target.files[0]);
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
        } catch (error) {
            console.error("There was an error uploading your data: " ,error);
            setError("There was an error uploading your data, please try again!", error);
        } finally {
            setUploading(false);
            setNext(true);
        }
    };

    return (
        <div>
            <br></br>
            <input type="file" onChange={fileChange} disabled={uploading}></input>
            <button onClick={upload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {success && <p>{file.name} has upload successfully</p>}
            {error && <p className="error">{error}</p>}
            {next && <Done />}
        </div>
        
    );
}

export default Phone;
