import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Box, TextField, IconButton } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import MemberCard from "../../User/MemberCard";
import LoadingScreen from "../../Loading/LoadingScreen";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30vw",
  height: "fit",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
};

const MemberForm = ({ handleChange }) => {
  const initialValues = {
    first_name: "",
    last_name: "",
    phone_number: "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("กรอกข้อมูล"),
    last_name: Yup.string().required("กรอกข้อมูล"),
    phone_number: Yup.string()
      .matches(/^[0-9]{10}$/, "เบอร์โทรไม่ถูกต้อง")
      .required("กรอกข้อมูล"),
  });

  const createMember = async (memberData) => {
    await axios
      .post(import.meta.env.VITE_API_BASEURL + "/member/create", memberData)
      .then((res) => handleChange({ ...res.data, ...memberData }))
      .catch((err) => toast.error("เบอร์นี้มีไรระบบแล้ว"));
  };

  const handleSubmit = async (values) => {
    const memberData = {
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number,
    };
    createMember(memberData);
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="mb-6 flex  gap-5">
            <div className="w-full">
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                ชื่อ
              </label>
              <div className="relative">
                <Field
                  type="first_name"
                  name="first_name"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                />
              </div>
              <ErrorMessage
                component="span"
                name="first_name"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                นามสกุล
              </label>
              <div className="relative">
                <Field
                  type="last_name"
                  name="last_name"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                />
              </div>
              <ErrorMessage
                component="span"
                name="last_name"
                className="text-red-500 text-sm"
              />
            </div>
          </div>
          <div className=" mb-6">
            <label
              htmlFor="phone_number"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              เบอร์โทร
            </label>
            <div className="relative">
              <Field
                type="phone_number"
                name="phone_number"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              />
            </div>
            <ErrorMessage
              component="span"
              name="phone_number"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex gap-5 justify-center pt-5">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none hover:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              สมัครสมาชิก
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        padding: theme.spacing(0.5, 0.5, 0),
        justifyContent: "space-between",
        display: "flex",
        alignItems: "flex-start",
        flexWrap: "wrap",
      },
      textField: {
        [theme.breakpoints.down("xs")]: {
          width: "100%",
        },
        margin: theme.spacing(1, 0.5, 1.5),
        "& .MuiSvgIcon-root": {
          marginRight: theme.spacing(0.5),
        },
        "& .MuiInput-underline:before": {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      },
    }),
  { defaultTheme }
);

function QuickSearchToolbar(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </div>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        className={classes.textField}
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? "visible" : "hidden" }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}

const GridToolbar = () => {
  const [open, setOpen] = useState(false);
  const [openS, setOpenS] = useState(false);
  const [member, setMember] = useState();

  const addMember = () => {
    setOpen(true);
  };

  return (
    <div className="px-4">
      <button
        onClick={addMember}
        className="flex justify-center items-center gap-1 text-blue-500"
      >
        <AddIcon />
        เพิ่มสมาชิกใหม่
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-7 top-7 text-gray-400 hover:text-red-400"
            >
              <CloseIcon fontSize="medium" />
            </button>
            <div className="flex justify-center items-center p-16">
              <MemberForm
                handleChange={(values) => {
                  setOpen(false);
                  setOpenS(true);
                  setMember(values);
                }}
              />
            </div>
          </div>
        </Box>
      </Modal>
      {member && (
        <Modal
          open={openS}
          aria-labelledby="modal-modal-titleS"
          aria-describedby="modal-modal-descriptionS"
          onClose={() => {
            setOpenS(false);
            window.location.reload();
          }}
        >
          <Box sx={style}>
            <div className="">
              <button
                onClick={() => {
                  setOpenS(false);
                  window.location.reload();
                }}
                className="absolute right-7 top-7 text-gray-400 hover:text-red-400"
              >
                <CloseIcon fontSize="medium" />
              </button>
              <div className="flex flex-col justify-center items-center p-16">
                <p className="text-lg text-green-500 mb-6">
                  คุณเป็นสมาชิก Booktree เรียบร้อย
                </p>
                <div id="canvas" className="mb-6">
                  <MemberCard id="canvas" member={member} />
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
};

function CustomToolbar({ value, onChange, clearSearch }) {
  return (
    <GridToolbarContainer className="flex justify-between">
      <GridToolbar />
      <QuickSearchToolbar
        value={value}
        onChange={onChange}
        clearSearch={clearSearch}
      />
    </GridToolbarContainer>
  );
}

const ManageMembers = () => {
  const [rows, setRows] = useState([]);
  const [orginalData, setOrginalData] = useState([]);

  const url = "/book/table/members";
  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };
  const { isLoading, error, data } = useQuery(["members table"], fetchMyData);

  useEffect(() => {
    if (data?.length > 0) {
      const updatedRows = data.map((item) => {
        return {
          ...item,
          start_date: new Date(item.start_date).toLocaleDateString("en-GB"),
          end_date: new Date(item.end_date).toLocaleDateString("en-GB"),
          id: item.member_id,
          isEditable: false,
        };
      });
      setRows(updatedRows);
      setOrginalData(updatedRows);
    }
  }, [data]);

  const columns = [
    { field: "id", headerName: "รหัสสมาชิก", width: 150 },
    { field: "first_name", headerName: "ชื่อจริง", width: 150 },
    { field: "last_name", headerName: "นามสกุล", width: 150 },
    { field: "phone_number", headerName: "เบอร์โทร", width: 150 },
    { field: "start_date", headerName: "วันที่ออกบัตร", width: 150 },
    { field: "end_date", headerName: "วันหมดอายุ", width: 150 },
  ];

  const [searchText, setSearchText] = useState("");
  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = orginalData.filter((row) => {
      return Object.keys(row).some((field) => {
        if (row[field]) {
          return searchRegex.test(row[field].toString());
        }
        return;
      });
    });
    setRows(filteredRows);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full ">
      <div className="">
        {data && (
          <Box sx={{ maxHeight: "90vh", width: "60%", margin: "auto" }}>
            <DataGrid
              disableColumnFilter
              disableDensitySelector
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 15,
                  },
                },
              }}
              pageSizeOptions={[15]}
              slots={{
                toolbar: CustomToolbar,
              }}
              slotProps={{
                toolbar: {
                  value: searchText,
                  onChange: (event) => requestSearch(event.target.value),
                  clearSearch: () => requestSearch(""),
                },
              }}
            />
          </Box>
        )}
      </div>
    </div>
  );
};

export default ManageMembers;
