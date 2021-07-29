import React from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import DownloadRoute from './routes/DownloadRoute';
import FinishedUploadRoute from './routes/FinishedUploadRoute';
import UploadRoute from './routes/UploadRoute';


function App() {
	return (
		<BrowserRouter>
			<Route path="/" exact component={UploadRoute} />
			<Route path="/uploaded/:id" component={FinishedUploadRoute} />
			<Route path="/download/:id" component={DownloadRoute}/>
		</BrowserRouter>
	);
}

export default App;
