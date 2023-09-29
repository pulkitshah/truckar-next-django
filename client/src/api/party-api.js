import { API } from "aws-amplify";
import { partiesByUser } from "../graphql/queries";
import { createParty, updateParty } from "../graphql/mutations";
import { Party } from "../models";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import moment from "moment";
import { slice } from "../slices/parties";

const now = new Date();

class PartyApi {
  async getPartiesByUser(user, dispatch, value) {
    console.log(value);
    try {
      let variables = {
        user: user.id.toString(),
        limit: 100,
      };

      if (value) {
        variables.filter = { name: { contains: value } };
      }
      //////////////////////// GraphQL API ////////////////////////

      const response = await API.graphql({
        query: partiesByUser,
        variables: variables,
      });
      const parties = response.data.partiesByUser.items;

      //////////////////////// GraphQL API ////////////////////////

      //////////////////////// DataStore API ////////////////////////

      // const parties = await DataStore.query(Party, (c) =>
      //   c.user("eq", user.id)
      // );

      //////////////////////// DataStore API ////////////////////////

      console.log(response);

      // Dispatch - Reducer

      dispatch(slice.actions.getParties(parties));

      return parties;
    } catch (error) {
      console.log(error);
    }
  }

  async createParty(createdParty, dispatch) {
    const createdAt = moment().toISOString();
    let newParty = createdParty;
    newParty.createdAt = createdAt;

    //////////////////////// GraphQL API ////////////////////////

    const response = await API.graphql({
      query: createParty,
      variables: { input: newParty },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    const party = response.data.createParty;

    //////////////////////// GraphQL API ////////////////////////

    //////////////////////// DataStore API ////////////////////////

    // const party = await DataStore.save(new Party(newParty));

    //////////////////////// DataStore API ////////////////////////

    // console.log(party);

    // Dispatch - Reducer

    dispatch(slice.actions.createParty({ party }));

    return party;
  }

  async updateParty(editedParty, dispatch) {
    //////////////////////// GraphQL API ////////////////////////

    const response = await API.graphql({
      query: updateParty,
      variables: { input: editedParty },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    const party = response.data.updateParty;

    //////////////////////// GraphQL API ////////////////////////

    // console.log(party);

    // Dispatch - Reducer

    dispatch(slice.actions.updateParty({ party }));

    return response;
  }

  async validateDuplicateName(name, user) {
    const response = await API.graphql({
      query: partiesByUser,
      variables: { user: user.id.toString() },
    });
    const parties = response.data.partiesByUser.items;
    const party = parties.find((party) => {
      return party.name === name;
    });
    return Boolean(!party);
  }

  async validateDuplicateMobile(mobile, user) {
    const response = await API.graphql({
      query: partiesByUser,
      variables: { user: user.id.toString() },
    });
    const parties = response.data.partiesByUser.items;
    const party = parties.find((party) => {
      return party.mobile === mobile;
    });
    return Boolean(!party);
  }
}

export const partyApi = new PartyApi();
