import { useState } from "react";
import FileUpload from "../components/FileUpload";
import ClipLoader from "react-spinners/ClipLoader";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useHistory } from "react-router-dom";


export default function UploadRoute() { 
    const [curFile, setCurFile] = useState<File | null>(null);
    const [status, setStatus] = useState("");

    const history = useHistory();

    const handleFileSet = (file : File | null) => {
        console.log(file);
        setCurFile(file);
    }

    const submitUpload = async () => {
        if(!curFile) return;

        const formData = new FormData();
        formData.append("formFile", curFile);
        formData.append("fileName", curFile.name);

        try {
            setStatus("uploading");
            fetch("/file/upload", {
                method: "POST",
                body: formData
            }).then(res => res.text())
            .then(txt => {
                setStatus("done");
                history.push("/uploaded/" + txt);
            })
            .catch(err => {
                setStatus("error");
                console.error(err);
            });

        } catch(ex) {
            console.log(ex);
        }      
    }

    if(status == "uploading") {
        return <div className="bg-gray-900 min-h-screen flex flex-col justify-center">
            <div className="bg-gray-700 px-10 py-10 mx-auto text-center rounded">
                <h1 className="text-5xl text-white font-extralight mb-12">Uploading...</h1>
                
                <ClipLoader color="#ffffff" loading={true} size={96}/>
            </div>
        </div>;
    }

    if(status == "error") {
        return <div className="bg-gray-900 min-h-screen flex flex-col justify-center">
            <div className="bg-gray-700 px-10 py-10 mx-auto text-center rounded">
                <h1 className="text-5xl text-white font-extralight mb-12">There was an error uploading</h1>
                
                <button className="text-white text-lg bg-gray-500 px-6 py-3 mt-8 rounded" onClick={() => {
                    window.location.reload();
                }}>Try Again</button>
            </div>
        </div>;
    }

    return <div className="bg-gray-900 min-h-screen flex flex-col justify-center">
        <div className="bg-gray-700 px-10 py-10 mx-auto text-center rounded">
            <h1 className="text-5xl text-white font-extralight mb-3">Drop here to upload</h1>
            <h3 className="text-2xl text-gray-400 mb-10 font-light">or click to select a file...</h3>

            <div className="w-full h-64 border-4 border-gray-500 bg-gray-600 rounded-md">
                <FileUpload handleFileUpload={handleFileSet}/>
            </div>

            {
                curFile == null ? null : <button onClick={submitUpload} className="text-white text-lg bg-gray-500 px-6 py-3 mt-8 rounded">Upload File</button>
            }
            
        </div>
    </div>;
}