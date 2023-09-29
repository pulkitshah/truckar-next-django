import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "../../../store";
import { X as XIcon } from "../../../icons/x";
import { PropertyList } from "../../property-list";
import { PropertyListItem } from "../../property-list-item";
import { branchApi } from "../../../api/branch-api";
import GoogleMaps from "./google-places-autocomplete";

const BranchPreview = (props) => {
  const { lgUp, onEdit, branch } = props;
  const align = lgUp ? "horizontal" : "vertical";

  return (
    <>
      <Box
        sx={{
          alignItems: "center",
          borderRadius: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ mt: 3 }} variant="h6">
          Branch Details
        </Typography>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            mt: 3,
            m: -1,
            "& > button": {
              m: 1,
            },
          }}
        >
          <Button
            onClick={onEdit}
            size="small"
            startIcon={<EditIcon fontSize="small" />}
            sx={{ pt: 3 }}
          >
            Edit
          </Button>
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />

      <PropertyList>
        <PropertyListItem
          align={align}
          disableGutters
          label="Branch Name"
          value={branch.branchName}
        />

        <PropertyListItem
          align={align}
          disableGutters
          label="City"
          value={JSON.parse(branch.city).description}
        />
      </PropertyList>
    </>
  );
};

const BranchForm = (props) => {
  const { onCancel, branch } = props;
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      id: branch.id,
      branchName: branch.branchName,
      city: JSON.parse(branch.city),
      branchType: "main",

      _version: branch._version,
    },
    // validationSchema: Yup.object({
    //   name: Yup.string().max(255).required("Name is required"),
    //   initials: Yup.string().max(255).required("Required"),
    //   addressLine1: Yup.string()
    //     .max(255)
    //     .required("Address Line 1 is required"),
    //   city: Yup.string().max(255).required("City is required"),
    //   pincode: Yup.string().max(255).required("Pincode is required"),
    //   gstin: Yup.string()
    //     .trim()
    //     .matches(
    //       /^([0-9]){2}([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([0-9]){1}([a-zA-Z]){1}([0-9]){1}?$/,
    //       "Invalid GST Number"
    //     ),
    //   pan: Yup.string().max(255).required("PAN is required"),
    //   jurisdiction: Yup.string().max(255).required("Jurisdiction is required"),
    // }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        const updatedBranch = {
          id: branch.id,
          branchName: values.branchName,
          city: JSON.stringify(values.city),
          branchType: values.branchType,
          user: branch.user,
          _version: branch._version,
        };
        await branchApi.updateBranch(updatedBranch, dispatch);

        toast.success("Branch updated!");

        onCancel();
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit} {...props}>
        <Box
          sx={{
            alignItems: "center",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
            bbranchRadius: 1,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            px: 3,
            py: 2.5,
          }}
        >
          <Typography variant="overline" sx={{ mr: 2 }} color="textSecondary">
            Branch
          </Typography>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              m: -1,
              "& > button": {
                m: 1,
              },
            }}
          >
            <Button
              color="primary"
              type="submit"
              size="small"
              variant="contained"
            >
              Save changes
            </Button>
            <Button onClick={onCancel} size="small" variant="outlined">
              Cancel
            </Button>
          </Box>
        </Box>

        <Typography sx={{ my: 3 }} variant="h6">
          Details
        </Typography>

        <GoogleMaps
          formik={formik}
          error={Boolean(formik.touched.city && formik.errors.city)}
          label={"Your city in India"}
          field={"city"}
          setFieldValue={formik.setFieldValue}
          handleBlur={formik.handleBlur}
          values={formik.values}
        />
        <TextField
          margin="normal"
          error={Boolean(formik.touched.branchName && formik.errors.branchName)}
          fullWidth
          helperText={formik.touched.branchName && formik.errors.branchName}
          label="Your branch name"
          name="branchName"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.branchName}
        />
        <Button color="error" sx={{ mt: 3 }}>
          Delete branch
        </Button>
      </form>
    </>
  );
};

const BranchDrawerDesktop = styled(Drawer)({
  width: 500,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    position: "relative",
    width: 500,
  },
});

const BranchDrawerMobile = styled(Drawer)({
  flexShrink: 0,
  maxWidth: "100%",
  height: "calc(100% - 64px)",
  width: 500,
  "& .MuiDrawer-paper": {
    height: "calc(100% - 64px)",
    maxWidth: "100%",
    top: 64,
    width: 500,
  },
});

export const BranchDrawer = (props) => {
  const { containerRef, onClose, open, branch, ...other } = props;
  const [isEditing, setIsEditing] = useState(false);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // The reason for doing this, is that the persistent drawer has to be rendered, but not it's
  // content if an branch is not passed.
  const content = branch ? (
    <>
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        <Typography color="inherit" variant="h6">
          {branch.number}
        </Typography>
        <IconButton color="inherit" onClick={onClose}>
          <XIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 4,
        }}
      >
        {!isEditing ? (
          <BranchPreview
            onApprove={onClose}
            onEdit={handleEdit}
            onReject={onClose}
            branch={branch}
            lgUp={lgUp}
          />
        ) : (
          <BranchForm onCancel={handleCancel} branch={branch} />
        )}
      </Box>
    </>
  ) : null;

  if (lgUp) {
    return (
      <BranchDrawerDesktop
        anchor="right"
        open={open}
        SlideProps={{ container: containerRef?.current }}
        variant="persistent"
        {...other}
      >
        {content}
      </BranchDrawerDesktop>
    );
  }

  return (
    <BranchDrawerMobile
      anchor="right"
      ModalProps={{ container: containerRef?.current }}
      onClose={onClose}
      open={open}
      SlideProps={{ container: containerRef?.current }}
      variant="temporary"
      {...other}
    >
      {content}
    </BranchDrawerMobile>
  );
};

BranchDrawer.propTypes = {
  containerRef: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  branch: PropTypes.object,
};
