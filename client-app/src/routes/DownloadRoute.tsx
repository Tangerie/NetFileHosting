import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface DownloadParams {
    id : string;
}

export default function DownloadRoute() {
    const [name, setName] = useState<null | string>(null);

    const { id } = useParams<DownloadParams>();

    useEffect(() => {
        const getData = async () => {
            const res = await fetch("/file/info/" + id);
            try {
                const json = await res.json();
                setName(json["name"]);
            } catch(err) {
                console.log("No File");
            }
        }

        getData();
    }, []);

    if(name == null) {
        return <div className="bg-gray-900 min-h-screen flex flex-col justify-center">
            <div className="bg-gray-700 px-10 py-10 mx-auto text-center rounded">
                <h3 className="text-2xl text-gray-400 mb-10 font-light">No File Found</h3>
            </div>
        </div>;
    }

    return <div className="bg-gray-900 min-h-screen flex flex-col justify-center">
            <div className="bg-gray-700 px-10 py-10 mx-auto text-center rounded">
                <h3 className="text-2xl text-gray-400 mb-10 font-light">Download File</h3>
                
                <button className="text-white text-lg bg-gray-500 px-6 py-3 mt-8 rounded" onClick={() => {
                    window.location.href = "/file/download/" + id;
                }}>{name} <FontAwesomeIcon icon="download" className="ml-4"/> </button>
            </div>
        </div>;
}