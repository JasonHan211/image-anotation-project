import React, { useEffect } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useSelector, useDispatch } from 'react-redux';
import { removeFile } from '../pdf/filesSlice';
import { editSave, removeSave, selectSaves } from './savesSlice';
import { Button, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { setPage } from '../../app/pages';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './table.css'

const columnHelper = createColumnHelper();

const editSchema = Yup.object().shape({
    name: Yup.string()
        .required("Name is required")
        .min(7, "Mininum 7 character (including .pdf)")
        .max(14, "Maximum 14 character (including .pdf)")
        .test(
            'end-with-pdf',
            '${path} does not end with .pdf',
            (value, context) => value.endsWith('.pdf'),
        ),
    text: Yup.string()
        .required("Password is required")
  });

function Table(props) {

    const savesArray = useSelector(selectSaves);
    const dispatch = useDispatch();

    if (savesArray.length === 0) {
        dispatch(setPage('drop'));
    }

    const [data, setData] = React.useState(() => [...savesArray]);
    const [openDelete, setOpenDelete] = React.useState({id:0,open:false});
    const [openEdit, setOpenEdit] = React.useState({id:0,open:false});

    useEffect(() => { 
        setData(savesArray);
    })

    const rerender = React.useReducer(() => ({}), {})[1];
    const columns = [
        columnHelper.accessor('fileName', {
            header: 'Name',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('boundingBox', {
            header: 'Bounding Box',
            cell: (info) => {
                const boundingBox = info.getValue();
                return <>
                    <div style={{width:'220px'}}>
                        <Typography align='left'>Top Left: {boundingBox.topLeft.x.toFixed(2)}, {boundingBox.topLeft.y.toFixed(2)}</Typography>
                        <Typography align='left'>Top Right: {boundingBox.topRight.x.toFixed(2)}, {boundingBox.topRight.y.toFixed(2)}</Typography>
                        <Typography align='left'>Bottom Left: {boundingBox.bottomLeft.x.toFixed(2)}, {boundingBox.bottomLeft.y.toFixed(2)}</Typography>
                        <Typography align='left'>Bottom Right: {boundingBox.bottomRight.x.toFixed(2)}, {boundingBox.bottomRight.y.toFixed(2)}</Typography>
                    </div>      
                </>
            }
        }),
        columnHelper.accessor('text', {
            header: 'Text',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('', {
            header: 'Action',
            cell: (row) => {
                const rowInfo = row.row.original;
                return <>
                    <Container>
                        <Button
                            onClick={() => {
                                setOpenEdit({id:rowInfo.id,open:true});
                            }}>
                            Edit
                        </Button>
                        <Dialog
                            open={openEdit.id === rowInfo.id && openEdit.open}
                            onClose={() => {
                                setOpenEdit({id:rowInfo.id,open:false});
                            }}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                            {"Edit Form"}
                            </DialogTitle>
                            <DialogContent>
                                <Formik
                                initialValues={{
                                    name:rowInfo.fileName,
                                    boundingBox:`Top Left: ${rowInfo.boundingBox.topLeft.x.toFixed(2)}, ${rowInfo.boundingBox.topLeft.y.toFixed(2)}`+
                                    `Top Right: ${rowInfo.boundingBox.topRight.x.toFixed(2)}, ${rowInfo.boundingBox.topRight.y.toFixed(2)}`+
                                    `Bottom Left: ${rowInfo.boundingBox.bottomLeft.x.toFixed(2)}, ${rowInfo.boundingBox.bottomLeft.y.toFixed(2)}`+
                                    `Bottom Right: ${rowInfo.boundingBox.bottomRight.x.toFixed(2)}, ${rowInfo.boundingBox.bottomRight.y.toFixed(2)}`,
                                    text:rowInfo.text
                                }}
                                validationSchema={editSchema}
                                onSubmit={(values) => {
                                    const newSave = {...rowInfo};
                                    newSave.fileName = values.name;
                                    newSave.text = values.text;
                                    console.log(newSave);
                                    dispatch(editSave(newSave));
                                    setOpenEdit({id:rowInfo.id,open:false});
                                }}
                                >
                                {(formik) => {
                                    const { errors, touched, isValid, dirty } = formik;
                                    return (
                                    <div className="container">
                                        <Form>
                                        <div className="form-row">
                                            <label htmlFor="name">Name</label>
                                            <Field
                                            type="name"
                                            name="name"
                                            id="name"
                                            className={
                                                errors.name && touched.name ? "input-error" : null
                                            }
                                            />
                                            <ErrorMessage name="name" component="span" className="error" />
                                        </div>
                                        <div className="form-row">
                                            <label htmlFor="boundingBox">Bounding Box</label>
                                            <Field
                                            type="boundingBox"
                                            name="boundingBox"
                                            id="boundingBox"
                                            disabled={true}
                                            />
                                        </div>
                                        <div className="form-row">
                                            <label htmlFor="text">Text</label>
                                            <Field
                                            type="text"
                                            name="text"
                                            id="text"
                                            className={
                                                errors.text && touched.text ? "input-error" : null
                                            }
                                            />
                                            <ErrorMessage name="text" component="span" className="error" />
                                        </div>
                                        <Button onClick={() => {
                                            setOpenEdit({id:rowInfo.id,open:false})
                                        }}>Cancel</Button>
                                        <Button type='submit' className={!(dirty && isValid) ? "disabled-btn" : ""} disabled={!(dirty && isValid)}>Submit</Button>
                                        </Form>
                                    </div>
                                    );
                                }}
                                </Formik>
                            </DialogContent>
                        </Dialog>
                        
                        <Button
                            onClick={() => {
                                setOpenDelete({id:rowInfo.id,open:true});
                            }}>
                            Delete
                        </Button>
                        <Dialog
                            open={openDelete.id === rowInfo.id && openDelete.open}
                            onClose={() => {
                                setOpenDelete({id:rowInfo.id,open:false});
                            }}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                            {"Confirmation"}
                            </DialogTitle>
                            <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete {rowInfo.name}?
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={() => {
                                setOpenDelete({id:rowInfo.id,open:false})
                            }}>Cancel</Button>
                            <Button onClick={() => {
                                setOpenDelete(false);
                                dispatch(removeSave(rowInfo.id));
                            }} autoFocus>
                                Delete
                            </Button>
                            </DialogActions>
                        </Dialog>
                    </Container>
                </> 
            },
        }),
    ];
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Container maxWidth='xs'
            sx={{
                textAlign: 'center',
                position: 'absolute',
                top: '50%',
                left: '50%',
                translate: '-50% -50%',
                width: 'auto',
                maxWidth: 'unset !important'
            }}>
            {React.createElement("div", { className: "p-2" },
                React.createElement("table", null,
                    React.createElement("thead", null, table.getHeaderGroups().map(headerGroup => (
                        React.createElement("tr", { key: headerGroup.id }, headerGroup.headers.map(header => (
                            React.createElement("th", { key: header.id }, header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())
                            )
                        )))
                    ))),
                    React.createElement("tbody", null, table.getRowModel().rows.map(row => (
                        React.createElement("tr", { key: row.id }, row.getVisibleCells().map(cell => (
                            React.createElement("td", { key: cell.id }, flexRender(cell.column.columnDef.cell, cell.getContext()))
                        )))
                    ))),
                )
            )}
            <Button variant='contained' 
            sx={{
                marginTop: '20px',
                width: '200px',
            }}
            onClick={() => {
                rerender()
            }}>
                Re-Render
            </Button>
            <br></br>
            <Button variant='contained' 
            sx={{
                marginTop: '20px',
                width: '200px',
            }}
            onClick={() => {
                dispatch(removeFile());
                dispatch(setPage('drop'));
            }}>
                Add
            </Button>
        </Container>     
    );
}

export default Table;