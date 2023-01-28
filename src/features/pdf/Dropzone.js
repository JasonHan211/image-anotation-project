import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addFile,
  selectFiles,
} from './filesSlice';
import SendIcon from '@mui/icons-material/Send';
import {useDropzone} from 'react-dropzone';
import { Box } from '@mui/material';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';
import { Container } from '@mui/material';

export function Dropzone(props) {
  
  const filesArray = useSelector(selectFiles);
  const dispatch = useDispatch();
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <Container maxWidth='xs'
      sx={{
        textAlign: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        translate: '-50% -50%'
      }}>
        <Box 
          sx={{
            backgroundColor: 'text.main',
            marginBottom:'10px',
            paddingX: '20px',
            paddingY: '50px',
            border: '3px dashed grey',
            borderRadius: '15px',
            '&:hover': {
              backgroundColor: 'text.dark',
              opacity: [0.9, 0.8, 0.7],
            },
          }}
          {...getRootProps()}
          >
            <input {...getInputProps()} />
            Drag 'n' drop some files here, or click to select files
        </Box>
        <Typography variant='h5'>
          Files:
        </Typography>

          <ul>{files}</ul>

        <Button variant="contained" endIcon={<SendIcon />}
          onClick={() => {
            if (acceptedFiles.length !== 0) {
              acceptedFiles.forEach(file => {
                const index = filesArray.findIndex(obj => obj.name === file.name);
                if (index === -1) {
                  console.log("Uploaded PDF:", file);
                  dispatch(addFile(file));
                } else {
                  console.log("File already exist")
                }
              })
            }
          }}>
          Submit
        </Button>
    </Container>
    
  );
}