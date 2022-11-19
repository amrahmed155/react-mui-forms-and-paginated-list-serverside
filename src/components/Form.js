// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// import { v4 } from "uuid";
// import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { execute_query } from "../api/api";
const theme = createTheme({
  direction: "rtl", // Both here and <body dir="rtl">
});
// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export function Form(props) {
  const group1columns = [
    
    {
      id: "id",
      label: "ID",
      type: "TextField",
      rowItems: "2",
      table: "authors",
      disabled: true,
    },
    {
      id: "first_name",
      label: "first name",
      type: "TextField",
      rowItems: "2",
      table: "authors",
      disabled: false,
    },
    {
      id: "last_name",
      label: "last name",
      type: "TextField",
      rowItems: "2",
      table: "authors",
      disabled: false,
    },
    {
      id: "email",
      label: "email",
      type: "TextField",
      rowItems: "2",
      table: "authors",
      disabled: false,
    },
    {
      id: "birthdate",
      label: "birthdate",
      type: "date",
      rowItems: "2",
      table: "authors",
      disabled: false,
    },
    {
      id: "added",
      label: "added",
      type: "date",
      rowItems: "2",
      table: "authors",
      disabled: false,
    },
    {
      id: "none1",
      label: "none1",
      type: "none",
      rowItems: "2",
      table: "authors",
      disabled: false,
    },
    {
      id: "id",
      label: "ID",
      type: "TextField",
      rowItems: "2",
      table: "posts",
      disabled: true,
    },
    {
      id: "author_id",
      label: "author id",
      type: "TextField",
      rowItems: "2",
      table: "posts",
      disabled: false,
    },{
      id: "title",
      label: "title",
      type: "TextField",
      rowItems: "2",
      table: "posts",
      disabled: false,
    },{
      id: "description",
      label: "description",
      type: "TextField",
      rowItems: "2",
      table: "posts",
      disabled: false,
    },{
      id: "content",
      label: "content",
      type: "TextField",
      rowItems: "2",
      table: "posts",
      disabled: false,
    },{
      id: "date",
      label: "date",
      type: "date",
      rowItems: "2",
      table: "posts",
      disabled: false,
    },
    // {
    //   id: "none1",
    //   label: "none1",
    //   type: "none",
    //   rowItems: "2",
    //   table: "posts",
    //   disabled: false,
    // },
  ];

  const editAPI = () => {
    execute_query("updateData", props.passedData, props.pageState.table);
    console.log("editAPI");
    props.dataRetrieveAPI();
    props.showList();
  };

  const insertAPI = () => {
    execute_query("insertData", props.passedData, props.pageState.table);
    console.log("insertAPI");
    props.dataRetrieveAPI();
    props.showList();
  };
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl">
          <Grid
            container
            rowSpacing={3}
            columnSpacing={{ xs: 9, sm: 10, md: 11 }}
          >
            {group1columns.filter((row)=>{return row.table=== props.pageState.table}).map((e) => {
              if (e.type === "TextField") {
                return (
                  <Grid item xs={12 / e.rowItems} key={e.id} id={e.id}>
                    <TextField
                      id={e.id}
                      style={{
                        transformOrigin: "right !important",
                        left: "inherit !important",
                        right: "1.75rem !important",
                        fontSize: "small",
                        color: "#807D7B",
                        fontWeight: 400,
                        overflow: "unset",
                      }}
                    disabled={e.disabled}

                      fullWidth
                      value={props.passedData[e.id]}
                      label={e.label}
                      name={e.label}
                      onChange={props.handleChange}
                      // variant={"standard"}
                      placeholder={"" + e.label}
                    />
                  </Grid>
                );
              } else if (e.type === "date") {
                return (
                  <Grid item xs={12 / 2} key={e.id} id={e.id}>
                    <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        id={e.id}
                        fullWidth
                        label={e.label}
                        inputFormat="MM/DD/YYYY"
                        value={props.passedData[e.id]}
                        onChange={(newValue) => {
                          props.handleDateChange(e.id, newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                );
              } else {
                return <Grid item xs={12 / 2} key={e.id} id={e.id}></Grid>;
              }
            })}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                flexDirection: "row-end",
              }}
            >
              <Button
                variant="contained"
                sx={{ display: "block", mt: 3, ml: 6 }}
                // disabled={isError()}
                color="primary"
                onClick={
                  props.passedData.hasOwnProperty("id")
                    ? () => editAPI()
                    : () => insertAPI()
                }
                // onClick={!isError() ? handleNext : () => null}
              >
                {props.passedData.hasOwnProperty("id") ? "update" : "insert"}
              </Button>

              <Button
                variant="contained"
                sx={{ display: "block", mt: 3, ml: 6 }}
                // disabled={isError()}
                color="primary"
                onClick={props.showList}
                // onClick={!isError() ? handleNext : () => null}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
