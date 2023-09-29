import * as React from "react";
import { useRef } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Step,
  Stepper,
  StepLabel,
  Typography,
} from "@mui/material";
import { Briefcase as BriefcaseIcon } from "../../../icons/briefcase";
import { useTranslation } from "react-i18next";
import { OrderExpensesSettings } from "./order-expenses-settings";
import { LrSettings } from "./lr-settings";
import { LrFormatSettings } from "./lr-format-settings";
import { FormatSettings } from "./format-settings";
import { TaxSettings } from "./tax-settings";

const steps = [
  "Order Expenses",
  "LR Settings",
  "Default formats for LR and Invoice",
  "Tax Settings",
];

export default function HorizontalNonLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const branchCreateFormRef = useRef(null);
  const router = useRouter();
  const { t } = useTranslation();

  const orderExpenses = (
    <React.Fragment>
      <Grid item xs={12} sx={{ py: 2 }}>
        <Typography variant="h5" sx={{ mt: 2 }}>
          {t("Please enter your regular order expenses categories.")}
        </Typography>

        <OrderExpensesSettings handleNext={handleNext} />
      </Grid>
    </React.Fragment>
  );

  const lrSettings = (
    <React.Fragment>
      <Grid item xs={12} sx={{ py: 2 }}>
        <Typography variant="h5" sx={{ mt: 2 }}>
          {t("Expense categories for your LR.")}
        </Typography>
        <Typography variant="body2">
          {t("(These expenses will be displayed in your LR)")}
        </Typography>
        <LrSettings handleNext={handleNext} />
      </Grid>
    </React.Fragment>
  );

  const formatSettings = (
    <React.Fragment>
      <Grid item xs={12} sx={{ py: 2 }}>
        <Typography variant="h5" sx={{ mt: 2 }}>
          {t("Default format for your LR and Invoice.")}
        </Typography>
        <Typography variant="body2">
          {t("(These will be the default formats for your LR and Invoice)")}
        </Typography>
        <FormatSettings handleNext={handleNext} />
      </Grid>
    </React.Fragment>
  );

  const taxSettings = (
    <React.Fragment>
      <Grid item xs={12} sx={{ py: 2 }}>
        <Typography variant="h5" sx={{ mt: 2 }}>
          {t("Taxes available for Invoicing.")}
        </Typography>
        <Typography variant="body2">
          {t("(These will be the taxes that you can add while making invoice)")}
        </Typography>
        <TaxSettings handleNext={handleNext} />
      </Grid>
    </React.Fragment>
  );

  return (
    <Box sx={{ minWidth: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === 0 && orderExpenses}
      {activeStep === 1 && lrSettings}
      {activeStep === 2 && formatSettings}
      {activeStep === 3 && taxSettings}
    </Box>
  );
}
