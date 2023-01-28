import React from 'react';
import { Dropzone } from './features/pdf/Dropzone';
import { PDFView } from './features/pdf/PDFView';
import './App.css';
import { useSelector } from 'react-redux';
import {
  selectFiles,
} from './features/pdf/filesSlice';
import MyAppBar from './features/AppBar/AppBar';

function App() {
  const filesArray = useSelector(selectFiles);
  return (
    <div className="App">
      <MyAppBar/>
      {filesArray.length === 0 ? <Dropzone/> : <PDFView/>}
    </div>
  );
}

export default App;
