import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdvertisements,
  selectData,
  setSearchText,
} from "../store/slice.js";
import { Icon, IconButton, Paper } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Input from "@mui/material/Input";
import { useDebounce } from "use-debounce";
import {selectMainTheme} from "@fuse/core/FuseSettings/store/fuseSettingsSlice";

const ExerciseHeader = () => {
  const dispatch = useDispatch();
  const mainTheme = useSelector(selectMainTheme);
  const searchText = useSelector(selectData("searchText"));
  const [debouncedText] = useDebounce(searchText, 500);

  useEffect(() => {
    if (debouncedText !== "") {
      // @ts-ignore
      dispatch(getAdvertisements({ search: searchText }));
    }
  }, [debouncedText]);

  return (
    <div className="flex flex-col md:flex-row flex-1 w-full space-y-8 sm:space-y-0 items-center justify-between py-20 px-24 md:px-32">
      <div className="flex items-center">
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          className="flex text-24 md:text-28 font-bold tracking-tight"
        >
          آگهی و پروژه ها
        </Typography>
      </div>
      <div className="flex flex-1 items-center justify-center px-8 sm:px-12 w-full md:w-1/2 my-8">
        <ThemeProvider theme={mainTheme}>
          <Paper
            style={{ alignSelf: "center" }}
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex p-4 items-center w-full h-48 px-16 py-4 shadow md:w-1/2"
          >
            <Icon color="action">search</Icon>
            <Input
              placeholder="اینجا می تونی دنبال آگهی مورد نظرت بگردی"
              className="flex flex-1 px-16"
              disableUnderline
              fullWidth
              value={searchText ?? ""}
              inputProps={{
                "aria-label": "Search",
              }}
              // @ts-ignore
              onChange={(e) => dispatch(setSearchText(e))}
            />
            <IconButton
              onClick={() => {
                // @ts-ignore
                dispatch(setSearchText());
                // @ts-ignore
                dispatch(getAdvertisements({}));
              }}
            >
              <Icon color="error">delete</Icon>
            </IconButton>
          </Paper>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default ExerciseHeader;
