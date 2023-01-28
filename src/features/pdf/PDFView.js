import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import './PDFView.css';import { useSelector, useDispatch } from 'react-redux';
import {
  // addFile, 
  // removeFile,
  selectFiles,
} from './filesSlice';
import { Box, Container } from '@mui/system';
import { Grid, Typography } from '@mui/material';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'standard_fonts/',
};

export function PDFView() {
  const filesArray = useSelector(selectFiles);
  // const dispatch = useDispatch();
  const [file, setFile] = useState('');
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  const selectedFile = filesArray[0];

  if (file === '') {   
    console.log('Loading PDF: ',selectedFile);
    setFile(selectedFile)
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  return (

        <Grid container spacing={3} 
        sx={{
          marginTop:'30px',
        }}>
          <Grid xs={7}>
            <div className="container-document">
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options} >
              <Page key={`page_${pageNumber}`} pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
            </div>
          </Grid>
          <Grid xs={5}>
            <Box sx={{
              backgroundColor: 'text.main',
              marginX: '70px',
              marginBottom: '30px',
              paddingY: '30px',
              border: '3px solid grey',
              borderRadius: '5px',
            }}>
              <Typography>
                {selectedFile.name}
              </Typography>
            </Box>
            <Box sx={{
              backgroundColor: 'text.main',
              marginX: '70px',
              marginBottom: '30px',
              paddingY: '30px',
              border: '3px solid grey',
              borderRadius: '5px',
            }}>
              <Typography>
              {selectedFile.size} bytes
              </Typography>
            </Box>

          </Grid>
        </Grid>

  );
}