import { useParams, Link } from "react-router-dom";

interface PageParams {
    id : string;
}

export default function FinishedUploadRoute() {
    const { id } = useParams<PageParams>();

    const upLoc = "/download/" + id;

    return <div className="bg-gray-900 min-h-screen flex flex-col justify-center">
        <div className="bg-gray-700 px-10 py-10 mx-auto text-center rounded">
            <h1 className="text-5xl text-white font-extralight mb-6">Upload Complete</h1>
            
            <Link to={upLoc} className="text-white block mb-2 hover:underline">{new URL("/download/" + id, document.baseURI).href}</Link>
            <button className="text-white text-lg bg-gray-500 px-6 py-3 mt-8 rounded" onClick={() => {
                navigator.clipboard.writeText(new URL("/download/" + id, document.baseURI).href);
            }}>Copy to Clipboard</button>
        </div>
    </div>;
}