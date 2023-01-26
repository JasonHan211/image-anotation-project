import React from 'react';
import { Dropzone } from './features/pdf/Dropzone';
import { PDFView } from './features/pdf/PDFView';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <PDFView/>
        {/* <Dropzone/> */}

      </header>
    </div>
  );
}

export default App;
