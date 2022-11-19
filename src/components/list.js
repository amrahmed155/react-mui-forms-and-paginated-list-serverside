// import {  useState } from 'react';
import { Container } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";
import{execute_query}from '../api/api'

export const List = (props) => {
  const handleButton = (e) => {
    Swal.fire("Good job!", "You clicked the button!", "success");
    console.log(e);
    props.setValue(e);
    props.setPageIsForm(1);
  };

  function handleDelete(e) {
    Swal.fire({
      title: "هل انت متأكد؟",
      text: "لن يمكنك إستعادة البيانات",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "!حذف",
      cancelButtonText: "!إلغاء",

    }).then(function (result) {
      if (result.isConfirmed) {
        Swal.fire({
          title: "!حذف",
          text: "تم حذف البيانات :(",
          icon: "success",
          confirmButtonText: "تم",
          confirmButtonColor: "#3085d6",
        }).then(function () {
          execute_query('deleteData',e,props.pageState.table);
          props.dataRetrieveAPI();
          // form.submit();
        });
      } else {
        // Swal.fire("Cancelled", "لم يتم حذف البيانات :)", "error");
      }
    });

  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      table:'authors'
    },
    {
      field: "first_name",
      headerName: "first name",
      width: 200,
      table:'authors'

    },
    {
      field: "last_name",
      headerName: "last name",
      width: 200,
      table:'authors'

    },
    {
      field: "email",
      headerName: "email",
      flex: 1,
      table:'authors'

    },
    {
      field: "birthdate",
      headerName: "birthdate",
      flex: 1,
      table:'authors'
    },
    {
      field: "added",
      headerName: "added",
      flex: 1,
      table:'authors'
    },    {
      field: "id",
      headerName: "ID",
      flex: 1,
      table:'posts'
    },    {
      field: "author_id",
      headerName: "author_id",
      flex: 1,
      table:'posts'
    },    {
      field: "title",
      headerName: "title",
      flex: 1,
      table:'posts'
    },    {
      field: "description",
      headerName: "description",
      flex: 1,
      table:'posts'
    },    {
      field: "content",
      headerName: "content",
      flex: 1,
      table:'posts'
    },    {
      field: "date",
      headerName: "date",
      flex: 1,
      table:'posts'
    },
  ];
  const newObject={authors:{
    first_name: "",
    last_name: "",
    email: "",
    birthdate: null,
    added: null,
  },posts:{
    authorid: "",
    content: "",
    title: "",
    description: "",
    date: null,
  }}
  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        {/* <GridToolbarDensitySelector /> */}
        <GridToolbarExport />
        <Button
          variant=""
          onClick={() => {
            handleButton(newObject[props.pageState.table]);
          }}
          startIcon={<AddIcon />}
        >
          Add
        </Button>

        <Button
          variant=""
          onClick={() => {
            props.setPageState((old) => ({ ...old, table: "authors" }));
          }}
        >
          authors
        </Button>
        
        <Button
          variant=""
          onClick={() => {
            props.setPageState((old) => ({ ...old, table: "posts" }));
          }}
        >
          posts
        </Button>
      </GridToolbarContainer>
    );
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => {
                handleDelete(params.row);
              }}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleButton(params.row);
              }}
              endIcon={<EditIcon />}
            >
              Edit
            </Button>
          </Stack>
        );
      },
    },
  ];
  // const filterReq=(params)=>{console.log(params)}
  return (
    <Container style={{ marginTop: 100, marginBottom: 100 }}>
      <DataGrid
        components={{
          Toolbar: CustomToolbar,
        }}
        autoHeight
        rows={props.pageState.data}
        rowCount={props.pageState.total}
        loading={props.pageState.isLoading}
        rowsPerPageOptions={[10, 30, 50, 70, 100]}
        pagination
        page={props.pageState.page - 1}
        pageSize={props.pageState.pageSize}
        paginationMode="server"
        onPageChange={(newPage) => {
          props.setPageState((old) => ({ ...old, page: newPage + 1 }));
        }}
        onPageSizeChange={(newPageSize) =>
          props.setPageState((old) => ({ ...old, pageSize: newPageSize }))
        }
        columns={actionColumn.concat(columns.filter((row)=>{return row.table=== props.pageState.table}))}
        filterMode="server"
        onFilterModelChange={(newFilterCol) =>
          props.setPageState((old) => ({ ...old, filterCol: newFilterCol }))
        }
        sortingMode="server"
        onSortModelChange={(newSortCol) =>
          props.setPageState((old) => ({ ...old, sortCol: newSortCol }))
        }
      />
    </Container>
  );
};
