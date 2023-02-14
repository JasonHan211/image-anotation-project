import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-image-crop/dist/ReactCrop.css';
import './PDFView.css';
import React, { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useSelector, useDispatch } from 'react-redux';
import { removeFile, selectFiles } from '../filesSlice';
import { addSave, selectSaveID } from '../../table/savesSlice';
import { Box } from '@mui/system';
import { Button, Grid, Pagination, Stack, Typography } from '@mui/material';
import ReactCrop from 'react-image-crop';
import { createWorker } from 'tesseract.js';
import { setPage } from '../../../app/pages';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'standard_fonts/',
};

export function PDFView() {
  const filesArray = useSelector(selectFiles);
  const saveID = useSelector(selectSaveID);
  const dispatch = useDispatch();
  const [file, setFile] = useState('');
  const [numPages, setNumPages] = useState(1);
  const [pageChanged, setPageChanged] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);
  const [outputChanged, setOutputChanged] = useState(false);

  const [coordinate, setCoordinate] = useState();
  
  const [ocr, setOcr] = useState('Recognizing...');

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

  const cropImageNow = () => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / canvasRef.current.clientWidth;
    const scaleY = image.naturalHeight / canvasRef.current.clientHeight;
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
    setOutputChanged(true);
  };

  const getCoordinates = (crop) => {
    setCoordinate(crop);
  }

  const pageChange = (e,page) => {
    setPageNumber(page);
    setPageChanged(true);
  }

  const doOCR = async () => {
    const worker = await createWorker({
      logger: m => console.log(m.progress),
    });
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(output);
    console.log(text);
    setOcr(text);
    await worker.terminate();
  };

  // eslint-disable-next-line
  useEffect(() => {
    if (canvasRef.current !== null && pageChanged === true) {
      const canvas = canvasRef.current;
      const newImage = new Image();
      newImage.src = canvas.toDataURL();
      console.log("Got new image");
      setImage(newImage);
      setImgSrc(newImage.src);
      setPageChanged(false);
    }
    if (outputChanged) {
      doOCR();
      setOutputChanged(false);
    }
  })

  return (

        <Grid container spacing={3} 
        sx={{
          marginTop:'30px',
        }}>

          <Grid item xs={7}>
            <Stack spacing={4}>
              <div className="container-document">
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options} inputRef={inputRef}>
                  <ReactCrop src={imgSrc} onImageLoaded={setImage} crop={crop} onChange={setCrop} style={{boxShadow:'0 0 8px rgba(0, 0, 0, 0.5)'}}
                    onDragEnd={cropImageNow} onComplete={getCoordinates}>
                    <Page canvasRef={canvasRef} key={`page_${pageNumber}`} pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false}/>
                  </ReactCrop>
                </Document>
              </div>
              <Box>
                <Pagination sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '30px',
                }}
                count={numPages} 
                onChange={pageChange}/>
              </Box>
            </Stack>
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
              <Typography noWrap>
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
              <Typography noWrap>
                {selectedFile.size} bytes
              </Typography>
            </Box>

            {output?
              <>
                <Box sx={{
                  backgroundColor: 'text.main',
                  marginX: '70px',
                  marginBottom: '30px',
                  paddingY: '30px',
                  border: '3px solid grey',
                  borderRadius: '5px',
                }}>
                  <Typography noWrap>
                    Top-Left = x:{coordinate.x.toFixed(2)} y:{coordinate.y.toFixed(2)}<br></br>
                    Top-Right = x:{(coordinate.x + coordinate.width).toFixed(2)} y:{coordinate.y.toFixed(2)}<br></br>
                    Bottom-Left = x:{coordinate.x.toFixed(2)} y:{(coordinate.y + coordinate.height).toFixed(2)}<br></br>
                    Bottom-Right = x:{(coordinate.x + coordinate.width).toFixed(2)} y:{(coordinate.y + coordinate.height).toFixed(2)}<br></br>
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
                    {ocr}
                  </Typography>
                </Box>
                <Box sx={{
                  marginX: '70px',
                  marginBottom: '30px',
                }}>
                  <img className='crop-image' src={output} alt='Cropped' />
                </Box>
                <Button variant='contained'
                  onClick={() => {
                    const object = {
                      id: saveID,
                      fileName: selectedFile.name,
                      boundingBox: {
                        topLeft: {
                          x: coordinate.x,
                          y: coordinate.y
                        },
                        topRight: {
                          x: coordinate.x + coordinate.width,
                          y: coordinate.y
                        },
                        bottomLeft: {
                          x: coordinate.x,
                          y: coordinate.y + coordinate.height
                        },
                        bottomRight: {
                          x: coordinate.x + coordinate.width,
                          y: coordinate.y + coordinate.height
                        },
                      },
                      text: ocr,
                    }
                    dispatch(addSave(object));
                    dispatch(setPage('table'));
                    dispatch(removeFile());
                }}>
                  Save
                </Button>
              </>   
            :''}

          </Grid>
        </Grid>

  );
}