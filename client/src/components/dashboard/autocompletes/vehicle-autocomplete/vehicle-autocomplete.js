import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "../../../../store";
import { vehicleNumberFormatter } from "../../../../utils/customFormatters";
import { Autocomplete, Divider, Grid, TextField } from "@mui/material";
import { useMounted } from "../../../../hooks/use-mounted";
import { vehicleApi } from "../../../../api/vehicle-api";

const VehicleAutocomplete = ({
  sx,
  touched,
  setFieldValue,
  errors,
  handleBlur,
  setSelectedVehicle,
  setDriver,
  currentValue,
  user,
}) => {
  const dispatch = useDispatch();
  const isMounted = useMounted();
  const [open, setOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [value, setValue] = React.useState(currentValue);
  const [inputValue, setInputValue] = React.useState(
    typeof currentValue === "object"
      ? `${currentValue.vehicleNumber}`
      : currentValue
  );

  const getVehiclesByUser = useCallback(async () => {
    try {
      const vehiclesDB = await vehicleApi.getVehiclesByUser(user, dispatch);
      if (isMounted()) {
        setVehicles(vehiclesDB);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    try {
      getVehiclesByUser();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleOnChange = async (event, newValue) => {
    setValue(newValue);
    setSelectedVehicle(newValue);
    setFieldValue("vehicle", newValue);
    try {
      if (
        newValue !== null &&
        typeof newValue === "object" &&
        newValue !== null
      ) {
        let response =
          "await axios.get(`/api/drivers/vehicle/${newValue._id}`);";
        setDriver(response.data);
      } else {
        setSelectedVehicle("");
        setFieldValue("driver", "");
      }
    } catch (error) {
      setFieldValue("driver", "");
      console.log(error);
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    setSelectedVehicle(newInputValue);
    setFieldValue("vehicle", newInputValue);
    try {
      if (
        newInputValue !== null &&
        typeof newInputValue === "object" &&
        newInputValue !== null
      ) {
        // axios
        //   .get(`/api/drivers/vehicle/${newInputValue._id}`)
        //   .then(({ data }) => {
        //     setDriver(data);
        //   });
      } else {
        setSelectedVehicle("");
      }
    } catch (error) {
      setFieldValue("driver", "");

      console.log(error);
    }
  };

  return (
    <Grid item>
      <Autocomplete
        sx={sx}
        freeSolo
        autoSelect={true}
        blurOnSelect={true}
        id="vehicle"
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        getOptionLabel={(option) => {
          if (option.vehicleNumber) {
            return option.vehicleNumber;
          } else {
            return option.toUpperCase();
          }
        }}
        options={vehicles}
        value={value}
        onChange={handleOnChange}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        renderOption={(props, option) => {
          return (
            <React.Fragment>
              <li {...props} key={option.id}>
                {option.vehicleNumber}
                <Divider />
              </li>
            </React.Fragment>
          );
        }}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            name="vehicle"
            label="Vehicle"
            variant="outlined"
            error={Boolean(touched.vehicle && errors.vehicle)}
            fullWidth
            helperText={touched.vehicle && errors.vehicle}
            onBlur={handleBlur}
            InputProps={{
              ...params.InputProps,
              inputComponent: vehicleNumberFormatter,
              endAdornment: (
                <React.Fragment>
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </Grid>
  );
};

VehicleAutocomplete.propTypes = {
  className: PropTypes.string,
};

export default VehicleAutocomplete;
