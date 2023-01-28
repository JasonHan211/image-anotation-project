import React, { useEffect, useState, useRef } from 'react';
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
import { Button, Grid, Typography } from '@mui/material';
import ReactCrop , { centerCrop, makeAspectCrop, Crop, PixelCrop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { canvasPreview } from './canvasPreview';
import { useDebounceEffect } from './useDebounceEffect';

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

  const [imgSrc, setImgSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);
  const inputRef = useRef(null);

  const selectedFile = filesArray[0];

  if (file === '') {
    console.log('Loading PDF: ',selectedFile);
    setFile(selectedFile)
    setImgSrc(URL.createObjectURL(selectedFile));
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  const canvasRef = useRef(null);
  useEffect(() => {
    if (canvasRef.current !== null && image == null) {
      const canvas = canvasRef.current;
      let newImage = new Image();
      newImage.src = canvas.toDataURL();
      console.log("Got new image");
      setImage(newImage);
      setImgSrc(newImage.src);
    }
  })

  const cropImageNow = () => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
  
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
  
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );
      
    // Converting to base64
    const base64Image = canvas.toDataURL('image/jpeg');
    setOutput(base64Image);
  };

  return (


        <Grid container spacing={3} 
        sx={{
          marginTop:'30px',
        }}>
          <Grid item xs={7}>
            <div className="container-document">
              
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options} inputRef={inputRef}>
              <ReactCrop src={imgSrc} onImageLoaded={setImage} crop={crop} onChange={setCrop}>
                <Page canvasRef={canvasRef} key={`page_${pageNumber}`} pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
              </ReactCrop>
            </Document>
            
            </div>
          </Grid>
          <Grid item xs={5}>
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

            {image? 
              <Button variant='contained' onClick={cropImageNow}
              sx={{
                marginBottom: '30px',
              }}>
                Crop
              </Button>
            :''}

            {output?
              <Box sx={{
                marginX: '70px',
                marginBottom: '30px',
              }}>
                <img className='crop-image' src={output} />
              </Box>
            :''}

          </Grid>

        </Grid>

  );
}