import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { SignUpPayload, useAuth } from "../../auth/AuthRouteProvider";
import * as yup from "yup";
import { FIELD_REQUIRED } from "../../../reusable/messages";
import { Button, Icon, InputAdornment, Stack } from "@mui/material";
import { formData, formDataOrg } from "./array";
import FormikHook, {
  createFormikObjects,
} from "../../../reusable/Form/FormikHook";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function SignUpPage() {
  const { jwtService } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState(0); // employer 1, jobSeeker 0

  const config = useMemo(() => {
    if (!value) {
      return [
        ...formData,
        {
          label: "رمز عبور",
          name: "password",
          type: "TextField",
          validation: yup
            .string()
            .min(6, "رمز عبور حداقل باید ۶ کاراکتر باشد")
            .required(FIELD_REQUIRED),
          others: {
            type: showPassword ? "text" : "password",
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  <Icon
                    onClick={() => setShowPassword((pre) => !pre)}
                    className="text-24 cursor-pointer"
                  >
                    {showPassword ? "visibility" : "visibility_off"}
                  </Icon>
                </InputAdornment>
              ),
            },
          },
          grids: { xs: 12, md: 12, sm: 12 },
        },
      ];
    } else {
      return [
        ...formDataOrg,
        {
          label: "رمز عبور",
          name: "password",
          type: "TextField",
          validation: yup
            .string()
            .min(6, "رمز عبور حداقل باید ۶ کاراکتر باشد")
            .required(FIELD_REQUIRED),
          others: {
            type: showPassword ? "text" : "password",
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  <Icon
                    onClick={() => setShowPassword((pre) => !pre)}
                    className="text-24 cursor-pointer"
                  >
                    {showPassword ? "visibility" : "visibility_off"}
                  </Icon>
                </InputAdornment>
              ),
            },
          },
          grids: { xs: 12, md: 12, sm: 12 },
        },
      ];
    }
  }, [showPassword, formData, formDataOrg, value]);

  const { initialValues, validationSchema } = createFormikObjects(config);
  const [form, formik] = FormikHook(
    {
      inputData: config,
      initialValues,
      validationSchema,
    },
    (values) => submitForm(values),
  );

  function submitForm(formData: SignUpPayload) {
    let data = {
      ...formData,
      role: value === 1 ? "EMPLOYER" : "JOBSEEKER",
    };
    jwtService
      .signUp(data)
      .then(() => {
        // No need to do anything, registered user data will be set at app/auth/AuthRouteProvider
      })
      .catch((error) => {});
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
      <Paper className="w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            ثبت ‌نام
          </Typography>
          <div className="flex items-baseline my-12 font-semibold">
            <Typography>قبلا ثبت نام کردید؟</Typography>
            <Link className="mx-4" to="/sign-in">
              ورود
            </Link>
          </div>
          <Box
            className="flex items-center justify-center w-full"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="کارجو هستم" />
              <Tab label="کارفرما هستم" />
            </Tabs>
          </Box>
          <Stack className="my-16">{form}</Stack>
          <Button
            variant="contained"
            color="secondary"
            className="w-full mt-16 rounded-8"
            aria-label="Sign up"
            size="large"
            onClick={() => formik?.handleSubmit()}
          >
            ثبت نام
          </Button>
        </div>
      </Paper>
    </div>
  );
}

export default SignUpPage;
