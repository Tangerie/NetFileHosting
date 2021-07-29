import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import prettyBytes from "pretty-bytes";

interface Props {
    handleFileUpload : (file : File | null) => void;
}

export default function FileUpload(props : Props) {
    const [curFile, setCurFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState<boolean>(false);
    const [dragCounter, setDragCounter] = useState(0);
    
    const onFormClick = () => {
        document.getElementById("fileUploadInput")?.click();
    }

    return <div className="w-full h-full flex flex-col justify-center group cursor-pointer rounded" onClick={onFormClick} 
    onDragEnter={e => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(dragCounter + 1);
        if(e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragging(true);
        }
    }}
    
    onDragLeave={e => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(dragCounter - 1);
        if (dragCounter > 0) return
        setDragging(false);
    }}
    
    onDragOver={e => {
        e.preventDefault();
        e.stopPropagation();
    }}
    
    onDrop={e => {
        e.preventDefault();
        e.stopPropagation();

        setDragging(false);
        if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setCurFile(e.dataTransfer.files[0]);
            props.handleFileUpload(e.dataTransfer.files[0]);
            //e.dataTransfer.clearData();
            setDragCounter(0);
        }
    }}>
        <form className="hidden">
            <input type="file" id="fileUploadInput" onChange={(event) => {
                if(event.target.files != null && event.target.files.length > 0) {
                    props.handleFileUpload(event.target.files[0]);
                    setCurFile(event.target.files[0]);
                } else {
                    props.handleFileUpload(null);
                    setCurFile(null);
                }
            }}></input>
        </form>
        <FontAwesomeIcon icon={curFile == null ? "file-upload" : "archive"} className="mx-auto text-white opacity-50 text-4xl group-hover:opacity-80 transition-opacity ease-in-out" />
        {
            curFile == null ? null : <p className="px-6 text-center mx-auto mt-4 text-white opacity-50 text-xl group-hover:opacity-80 transition-opacity ease-in-out">
                {curFile.name}<br/> <span className="text-gray-300 text-lg">{prettyBytes(curFile.size)}</span>
            </p>
        }
    </div>;
}