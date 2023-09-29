import { API } from "aws-amplify";
import { driversByUser } from "../graphql/queries";
import { createDriver, updateDriver } from "../graphql/mutations";
import { Driver } from "../models";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import moment from "moment";
import { slice } from "../slices/drivers";

const now = new Date();

class DriverApi {
  async getDriversByUser(user, dispatch) {
    try {
      //////////////////////// GraphQL API ////////////////////////

      const response = await API.graphql({
        query: driversByUser,
        variables: { user: user.id.toString() },
      });
      const drivers = response.data.driversByUser.items;

      //////////////////////// GraphQL API ////////////////////////

      //////////////////////// DataStore API ////////////////////////

      // const drivers = await DataStore.query(Driver, (c) =>
      //   c.user("eq", user.id)
      // );

      //////////////////////// DataStore API ////////////////////////

      // console.log(drivers);

      // Dispatch - Reducer

      dispatch(slice.actions.getDrivers(drivers));

      return drivers;
    } catch (error) {
      console.log(error);
    }
  }

  async createDriver(createdDriver, dispatch) {
    const createdAt = moment().toISOString();
    let newDriver = createdDriver;
    newDriver.createdAt = createdAt;

    //////////////////////// GraphQL API ////////////////////////

    const response = await API.graphql({
      query: createDriver,
      variables: { input: newDriver },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    const driver = response.data.createDriver;

    //////////////////////// GraphQL API ////////////////////////

    //////////////////////// DataStore API ////////////////////////

    // const driver = await DataStore.save(new Driver(newDriver));

    //////////////////////// DataStore API ////////////////////////

    // console.log(driver);

    // Dispatch - Reducer

    dispatch(slice.actions.createDriver({ driver }));

    return driver;
  }

  async updateDriver(editedDriver, dispatch) {
    //////////////////////// GraphQL API ////////////////////////

    const response = await API.graphql({
      query: updateDriver,
      variables: { input: editedDriver },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    const driver = response.data.updateDriver;

    //////////////////////// GraphQL API ////////////////////////

    // console.log(driver);

    // Dispatch - Reducer

    dispatch(slice.actions.updateDriver({ driver }));

    return response;
  }

  async validateDuplicateName(name, user) {
    const response = await API.graphql({
      query: driversByUser,
      variables: { user: user.id.toString() },
    });
    const drivers = response.data.driversByUser.items;
    const driver = drivers.find((driver) => {
      return driver.name === name;
    });
    return Boolean(!driver);
  }

  async validateDuplicateMobile(mobile, user) {
    const response = await API.graphql({
      query: driversByUser,
      variables: { user: user.id.toString() },
    });
    const drivers = response.data.driversByUser.items;
    const driver = drivers.find((driver) => {
      return driver.mobile === mobile;
    });
    return Boolean(!driver);
  }
}

export const driverApi = new DriverApi();
