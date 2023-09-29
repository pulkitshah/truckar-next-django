import { API } from "aws-amplify";
import { getOrder, ordersByCustomer, ordersByUser } from "../graphql/queries";
import { createOrder, updateOrder } from "../graphql/mutations";
import { Order } from "../models";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import moment from "moment";
import { slice } from "../slices/orders";
import { getFiscalYearTimestamps } from "../utils/get-fiscal-year";

class OrderApi {
  async getOrdersByUser(user, token) {
    try {
      let variables = {
        user: user.id.toString(),
        sortDirection: "DESC",
      };

      if (token) {
        variables.nextToken = token;
      }

      //////////////////////// GraphQL API ////////////////////////

      const response = await API.graphql({
        query: ordersByUser,
        variables: variables,
      });
      const orders = response.data.ordersByUser.items;
      const nextOrderToken = response.data.ordersByUser.nextToken;
      //////////////////////// GraphQL API ////////////////////////

      //////////////////////// DataStore API ////////////////////////

      // const orders = await DataStore.query(Order, (c) =>
      //   c.user("eq", user.id)
      // );

      //////////////////////// DataStore API ////////////////////////

      // console.log(orders);

      // Dispatch - Reducer

      // dispatch(slice.actions.getOrders(orders));

      return { orders, nextOrderToken };
    } catch (error) {
      console.log(error);
    }
  }

  async getOrdersByCustomer(customer, token) {
    try {
      let variables = {
        customerId: customer.id.toString(),
        sortDirection: "DESC",
      };

      if (token) {
        variables.nextToken = token;
      }

      //////////////////////// GraphQL API ////////////////////////
      const response = await API.graphql({
        query: ordersByCustomer,
        variables: variables,
      });
      const orders = response.data.ordersByCustomer.items;
      const nextOrderToken = response.data.ordersByCustomer.nextToken;

      //////////////////////// GraphQL API ////////////////////////

      //////////////////////// DataStore API ////////////////////////

      // const orders = await DataStore.query(Order, (c) =>
      //   c.user("eq", user.id)
      // );

      //////////////////////// DataStore API ////////////////////////

      // console.log(orders);

      // Dispatch - Reducer

      // dispatch(slice.actions.getOrders(orders));

      return { orders, nextOrderToken };
    } catch (error) {
      console.log(error);
    }
  }

  async getDeliveriesByCustomer(customer, token) {
    try {
      let variables = {
        customerId: customer.id.toString(),
        sortDirection: "DESC",
      };

      if (token) {
        variables.nextToken = token;
      }

      //////////////////////// GraphQL API ////////////////////////
      const response = await API.graphql({
        query: ordersByCustomer,
        variables: variables,
      });
      let orders = response.data.ordersByCustomer.items;

      //////////////////////// GraphQL API ////////////////////////

      //////////////////////// DataStore API ////////////////////////

      // const orders = await DataStore.query(Order, (c) =>
      //   c.user("eq", user.id)
      // );

      //////////////////////// DataStore API ////////////////////////

      //////////////////////// Breaking Orders in Deliveries ////////////////////////

      const nextOrderToken = response.data.ordersByCustomer.nextToken;

      //////////////////////// Breaking Orders in Deliveries ////////////////////////

      console.log(orders);

      // Dispatch - Reducer

      // dispatch(slice.actions.getOrders(orders));

      return { orders, nextOrderToken };
    } catch (error) {
      console.log(error);
    }
  }

  async getOrderById(id) {
    try {
      //////////////////////// GraphQL API ////////////////////////

      const response = await API.graphql({
        query: getOrder,
        variables: {
          id: id.toString(),
        },
      });

      const order = response.data.getOrder;
      //////////////////////// GraphQL API ////////////////////////

      //////////////////////// DataStore API ////////////////////////

      // const orders = await DataStore.query(Order, (c) =>
      //   c.user("eq", user.id)
      // );

      //////////////////////// DataStore API ////////////////////////

      // console.log(orders);

      // Dispatch - Reducer

      // dispatch(slice.actions.getOrders(orders));

      return order;
    } catch (error) {
      console.log(error);
    }
  }

  async createOrder(newOrder, dispatch) {
    const createdAt = moment().toISOString();
    let newOrg = newOrder;
    newOrg.createdAt = createdAt;

    //////////////////////// GraphQL API ////////////////////////

    const response = await API.graphql({
      query: createOrder,
      variables: { input: newOrg },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    const order = response.data.createOrder;

    //////////////////////// GraphQL API ////////////////////////

    //////////////////////// DataStore API ////////////////////////

    // const order = await DataStore.save(new Order(newOrg));

    //////////////////////// DataStore API ////////////////////////

    console.log(order);

    // Dispatch - Reducer

    dispatch(slice.actions.createOrder({ order }));

    return order;
  }

  async updateOrder(editedOrder, dispatch) {
    //////////////////////// GraphQL API ////////////////////////

    const response = await API.graphql({
      query: updateOrder,
      variables: { input: editedOrder },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    const order = response.data.updateOrder;

    //////////////////////// GraphQL API ////////////////////////

    console.log(order);

    // Dispatch - Reducer

    dispatch(slice.actions.updateOrder({ order }));

    return order;
  }

  async validateDuplicateOrderNo(orderNo, saleDate, user) {
    try {
      const response = await API.graphql({
        query: ordersByUser,
        variables: { user: user.id.toString() },
      });

      const orders = response.data.ordersByUser.items;

      const order = orders.filter((order) => {
        const orderSaleDate = moment(orders[0].saleDate);

        return (
          order.orderNo === orderNo &&
          getFiscalYearTimestamps(orderSaleDate).current.start.format("L") ===
            getFiscalYearTimestamps(saleDate).current.start.format("L")
        );
      });
      return Boolean(!order.length);
    } catch (error) {
      console.log(error);
    }
  }
}

export const orderApi = new OrderApi();
