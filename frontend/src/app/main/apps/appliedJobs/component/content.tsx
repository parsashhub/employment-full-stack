import { motion } from "framer-motion";
import React, { Fragment, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Icon,
  IconButton,
  ListItemButton,
  Paper,
} from "@mui/material";
import {
  getAppliedJobs,
  selectData,
  updateResumeState,
} from "../store/slice.js";
import { useDispatch, useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { employerColumns, tableColumns } from "../array.js";
import useThemeMediaQuery from "../../../../../@fuse/hooks/useThemeMediaQuery";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import { getAdvertisements } from "../../advertisement/store/slice";
import EnhancedTable from "../../../../../reusable/tableComponent";
import WrapperDrawer from "../../../../../reusable/dialogCmponents/myDrawer";
import RejectDialog from "../../../../../reusable/dialogCmponents/deleteDialog";
import AcceptDialog from "../../../../../reusable/dialogCmponents/deleteDialog";

const ExerciseContent = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const data = useSelector(selectData("data"));
  const sortOptions = useSelector(selectData("sortOptions"));
  const sort = useSelector(selectData("sort"));
  const meta = useSelector(selectData("meta"));
  const links = useSelector(selectData("links"));
  const page = useSelector(selectData("page"));
  const [openD, setOpenD] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [openAcc, setOpenAcc] = useState(false);
  const [handleAccept, setHandleAccept] = useState(() => () => {});
  const [openRej, setOpenRej] = useState(false);
  const [handleReject, setHandleReject] = useState(() => () => {});
  // @ts-ignore
  const user = useSelector((state) => state.user.data);

  const columns = useMemo(() => {
    if (user.role === "JOBSEEKER") return tableColumns;
    else
      return [
        ...employerColumns,

        {
          header: "عملیات",
          id: "action",
          cell: ({ row }) => {
            if (row.original.status === "NOT_SEEN")
              return (
                <div className="flex items-center">
                  <Tooltip title="تایید برای مصاحبه">
                    <IconButton
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenAcc(true);
                        setHandleAccept(() => async () => {
                          setOpenAcc(false);
                          await Promise.all([
                            dispatch(
                              // @ts-ignore
                              updateResumeState({
                                id: row.original.id,
                                formValue: { state: "ACCEPTED" },
                              }),
                            ),
                          ]);
                        });
                      }}
                    >
                      <Icon>check</Icon>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="رد">
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenRej(true);
                        setHandleReject(() => async () => {
                          setOpenRej(false);
                          await Promise.all([
                            dispatch(
                              // @ts-ignore
                              updateResumeState({
                                id: row.original.id,
                                formValue: { state: "REJECTED" },
                              }),
                            ),
                          ]);
                        });
                      }}
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </Tooltip>
                </div>
              );
          },
        },
      ];
  }, [user, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      className="w-full flex flex-col min-h-full"
    >
      <Paper className="flex flex-col" elevation={5}>
        {!isMobile && (
          <>
            <Accordion
              expanded={expanded}
              onChange={() => setExpanded((pre) => !pre)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>فیلتر ها</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{/*  form goes here */}</Typography>
              </AccordionDetails>
            </Accordion>
            <div className="flex flex-wrap items-center justify-start gap-8 my-16 px-16">
              <Icon>sort</Icon>
              <Paper elevation={0} className="rounded-8">
                مرتب سازی
              </Paper>
              {sortOptions?.map(({ sort, label }) => {
                return (
                  <Paper
                    elevation={10}
                    key={sort}
                    // @ts-ignore
                    onClick={() => dispatch(getAdvertisements({ sort }))}
                    className="p-8 cursor-pointer rounded-8"
                  >
                    {label}
                  </Paper>
                );
              })}
            </div>
          </>
        )}
        {isMobile && (
          <div className="flex items-center gap-8 p-16">
            <>
              <Button
                className="rounded-lg"
                variant="contained"
                onClick={() => setOpenD(true)}
              >
                <Icon className="ml-6">sort</Icon>
                مرتب سازی
              </Button>
              <Button className="rounded-lg" variant="contained">
                <Icon className="ml-6">filter_alt</Icon>
                فیلتر
              </Button>
            </>
          </div>
        )}
        <EnhancedTable
          data={data ?? []}
          columns={columns}
          onRowClick={() => {}}
          actions={{
            sort,
            page,
            meta,
            links,
            setPageConfig: (config) => {
              // @ts-ignore
              dispatch(getAppliedJobs(config));
            },
          }}
        />
      </Paper>
      <AcceptDialog
        open={openAcc}
        setOpen={setOpenAcc}
        handleDelete={handleAccept}
        title={"آیا از تایید اطمینان دارید؟"}
      />
      <RejectDialog
        open={openRej}
        setOpen={setOpenRej}
        handleDelete={handleReject}
        title={"آیا از رد اطمینان دارید؟"}
      />
      <WrapperDrawer
        title="مرتب سازی"
        open={openD}
        setOpen={setOpenD}
        children={
          <Box role="presentation">
            <List>
              {sortOptions?.map(({ sort, label }, index) => (
                <Fragment key={sort}>
                  {index === 0 ? null : <Divider />}
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        // @ts-ignore
                        dispatch(getAppliedJobs({ sort }));
                        setOpenD(false);
                      }}
                    >
                      <ListItemText primary={label} />
                    </ListItemButton>
                  </ListItem>
                </Fragment>
              ))}
            </List>
          </Box>
        }
      />
    </motion.div>
  );
};

export default ExerciseContent;
