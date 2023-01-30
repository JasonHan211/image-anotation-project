import React from 'react';
import MyAppBar from './features/appBar/AppBar';
import './App.css';
import Table from './features/table/Table';
import { useDispatch, useSelector } from 'react-redux';
import { selectSaves } from './features/table/savesSlice';
import { selectFiles } from './features/pdf/filesSlice';
import { selectPages, setPage } from './app/pages';
import { Dropzone } from './features/pdf/DragAndDrop/Dropzone';
import { PDFView } from './features/pdf/TextExtraction/PDFView';

function App() {

  const page = useSelector(selectPages);
  const saves = useSelector(selectSaves);
  const files = useSelector(selectFiles);
  const dispatch = useDispatch();

  if (saves.length === 0 && files.length === 0) {
    dispatch(setPage('drop'));
  }

  const pageSelection = () => {
    console.log(page);
    switch (page) {
      case 'drop':
        return <Dropzone/>
      case 'view':
        return <PDFView/>
      case 'table':
        return <Table/>
      default:
        break;
    }
}

  return (
    <div className="App">
      <MyAppBar/>
      {pageSelection()}
    </div>
  );
}

export default App;
