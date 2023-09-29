import { API } from "aws-amplify";
import { vehiclesByUser } from "../graphql/queries";
import { createVehicle, updateVehicle } from "../graphql/mutations";
import { Vehicle } from "../models";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import moment from "moment";
import { slice } from "../slices/vehicles";

const now = new Date();

class VehicleApi {
  async getVehiclesByUser(user, dispatch) {
    try {
      //////////////////////// GraphQL API ////////////////////////

      const response = await API.graphql({
        query: vehiclesByUser,
        variables: { user: user.id.toString() },
      });
      const vehicles = response.data.vehiclesByUser.items;

      //////////////////////// GraphQL API ////////////////////////

      //////////////////////// DataStore API ////////////////////////

      // const vehicles = await DataStore.query(Vehicle, (c) =>
      //   c.user("eq", user.id)
      // );

      //////////////////////// DataStore API ////////////////////////

      // console.log(vehicles);

      // Dispatch - Reducer

      dispatch(slice.actions.getVehicles(vehicles));

      return vehicles;
    } catch (error) {
      console.log(error);
    }
  }

  async createVehicle(newVehicle, dispatch) {
    const createdAt = moment().toISOString();
    let newOrg = newVehicle;
    newOrg.createdAt = createdAt;

    //////////////////////// GraphQL API ////////////////////////

    const response = await API.graphql({
      query: createVehicle,
      variables: { input: newOrg },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    const vehicle = response.data.createVehicle;

    //////////////////////// GraphQL API ////////////////////////

    //////////////////////// DataStore API ////////////////////////

    // const vehicle = await DataStore.save(new Vehicle(newOrg));

    //////////////////////// DataStore API ////////////////////////

    console.log(vehicle);

    // Dispatch - Reducer

    dispatch(slice.actions.createVehicle({ vehicle }));

    return vehicle;
  }

  async updateVehicle(editedVehicle, dispatch) {
    //////////////////////// GraphQL API ////////////////////////

    const response = await API.graphql({
      query: updateVehicle,
      variables: { input: editedVehicle },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    const vehicle = response.data.updateVehicle;

    //////////////////////// GraphQL API ////////////////////////

    // console.log(vehicle);

    // Dispatch - Reducer

    dispatch(slice.actions.updateVehicle({ vehicle }));

    return response;
  }

  async validateDuplicateVehicleNumber(vehicleNumber, user) {
    const response = await API.graphql({
      query: vehiclesByUser,
      variables: { user: user.id.toString() },
    });
    const vehicles = response.data.vehiclesByUser.items;
    const vehicle = vehicles.find((vehicle) => {
      return vehicle.vehicleNumber === vehicleNumber;
    });
    return Boolean(!vehicle);
  }
}

export const vehicleApi = new VehicleApi();
