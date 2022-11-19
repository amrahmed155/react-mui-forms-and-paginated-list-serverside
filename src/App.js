import { useEffect, useState } from "react";
import { List } from "./components/list.js";
import { Form } from "./components/Form";
import "./App.css";

function App() {
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    filterCol: [],
    sortCol: [],
    table: "authors",
  });
  const [passedData, setValue] = useState({});

  const handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.id;
    console.log(name);

    setValue((prevalue) => {
      return {
        ...prevalue, // Spread Operator
        [name]: value,
      };
    });
  };

  const handleDateChange = (name, newValue) => {
    setValue((prevalue) => {
      return {
        ...prevalue, // Spread Operator
        [name]: newValue,
      };
    });
  };
  const showList = () => {
    setPageIsForm(0);
  };
  const dataRetrieveAPI = async () => {
    const response = await fetch(
      `http://localhost:4000?page=${pageState.page}&limit=${pageState.pageSize}&table=${pageState.table}`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filter: pageState.filterCol,
          sort: pageState.sortCol,
        }),
      }
    );
    const json = await response.json();
    setPageState((old) => ({
      ...old,
      isLoading: false,
      data: json.data,
      total: json.total,
    }));
  };
  const [pageIsForm, setPageIsForm] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      // console.log('ON')
      setPageState((old) => ({ ...old, isLoading: true }));
      dataRetrieveAPI();
    };
    fetchData();
  }, [
    pageState.page,
    pageState.pageSize,
    pageState.filterCol,
    pageState.sortCol,
    pageState.table,
  ]);

  return (
    <>
      <div
        style={{
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(90deg, rgba(3,0,47,1) 0%, rgba(9,9,121,1) 40%, rgba(75,9,121,0.9500000683867297) 89%)",
          width: "100vw",
        }}
      >
        <h2>Server-side Pagination demo</h2>
      </div>
      {pageIsForm ? (
        <div
          style={{
            paddingTop: "5vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "70vw",
            margin: "auto",
          }}
        >
          <Form
            handleDateChange={handleDateChange}
            handleChange={handleChange}
            passedData={passedData}
            setPageIsForm={setPageIsForm}
            showList={showList}
            pageState={pageState}
            dataRetrieveAPI={dataRetrieveAPI}
          />
        </div>
      ) : (
        <List
          setValue={setValue}
          setPageIsForm={setPageIsForm}
          setPageState={setPageState}
          pageState={pageState}
          dataRetrieveAPI={dataRetrieveAPI}
        />
      )}
    </>
  );
}

export default App;
