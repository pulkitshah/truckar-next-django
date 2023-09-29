import { Avatar, Link } from "@mui/material";
import moment from "moment";
import { PartyFilter } from "./ag-grid-filters";
import {
  calculateAmountForOrder,
  dataFormatter,
} from "../../utils/amount-calculation";

export const organisationTable = [
  {
    field: "initials",
    headerName: "🏢",
    headerAlign: "center",
    width: 60,
    editable: true,
    renderCell: (params) => {
      return <Avatar>{params.value}</Avatar>;
    },
  },
  {
    field: "name",
    headerName: "Business Name",
    editable: true,
    width: 250,
  },
  {
    field: "city",
    headerName: "City",
    width: 150,
    editable: true,
  },
  {
    field: "gstin",
    headerName: "GSTIN",
    width: 180,
    editable: true,
  },
];

export const vehicleTable = [
  {
    field: "initials",
    headerName: "🚚",
    headerAlign: "center",
    sx: {
      fontSize: 50,
    },
    width: 20,
  },
  {
    field: "vehicleNumber",
    headerName: "Vehicle Number",
    width: 250,
  },
  {
    field: "make",
    headerName: "Make",
    width: 150,
  },
  {
    field: "model",
    headerName: "Model",
    width: 180,
  },
];

export const branchTable = [
  {
    field: "initials",
    headerName: "🏢",
    headerAlign: "center",
    width: 20,
  },
  {
    field: "branchName",
    headerName: "Branch Name",
    width: 250,
  },
  {
    field: "city",
    headerName: "City",
    width: 150,
    valueGetter: (params) => {
      return `${JSON.parse(params.row.city).structured_formatting.main_text}`;
    },
  },
];

export const partyTable = [
  {
    field: "name",
    headerName: "Name",
    width: 250,
  },
  {
    field: "city",
    headerName: "City",
    width: 250,
    valueGetter: (params) => {
      return `${JSON.parse(params.row.city).description}`;
    },
  },
  {
    field: "mobile",
    headerName: "Mobile",
    width: 150,
  },
];

export const driverTable = [
  {
    field: "initials",
    headerName: "🏢",
    headerAlign: "center",
    width: 20,
  },
  {
    field: "name",
    headerName: "Name",
    width: 250,
  },
  {
    field: "mobile",
    headerName: "Mobile",
    width: 150,
  },
];

export const orderTable = [
  {
    field: "orderNo",
    headerName: "Order No",
    width: 100,
  },
  {
    field: "saleDate",
    headerName: "Date",
    width: 120,
    valueGetter: (params) => {
      if (params.data) {
        return moment(params.data.saleDate).format("DD-MM-YY");
      }
    },
  },
  {
    field: "customer",
    headerName: "Customer",
    width: 250,
    filter: PartyFilter,
    valueGetter: (params) => {
      if (params.data) {
        return params.data.customer.name;
      }
    },
  },
  {
    field: "route",
    headerName: "Route",
    width: 250,
    valueGetter: (params) => {
      if (params.data) {
        let deliveries = params.data.deliveries.items;
        let route = [];
        let waypoints = [];

        deliveries.map((delivery, index) => {
          if (index === 0)
            route[0] = JSON.parse(
              delivery.loading
            ).structured_formatting.main_text;
          if (index === deliveries.length - 1)
            route[-1] = JSON.parse(
              delivery.unloading
            ).structured_formatting.main_text;
          waypoints.push(
            JSON.parse(delivery.loading).structured_formatting.main_text
          );
          waypoints.push(
            JSON.parse(delivery.unloading).structured_formatting.main_text
          );
        });

        waypoints = waypoints.filter(
          (waypoint) =>
            waypoint !==
            JSON.parse(deliveries[0].loading).structured_formatting.main_text
        );
        waypoints = waypoints.filter(
          (waypoint) =>
            waypoint !==
            JSON.parse(deliveries[deliveries.length - 1].unloading)
              .structured_formatting.main_text
        );

        waypoints = [
          ...new Map(waypoints.map((item) => [item, item])).values(),
        ];

        return [route[0], ...waypoints, route[-1]].join("-");
      }
    },
  },
  {
    field: "vehicleNumber",
    headerName: "Vehicle Number",
    width: 150,
  },
  {
    field: "sales",
    headerName: "Sales",
    width: 100,
    valueGetter: (params) => {
      if (params.data) {
        return calculateAmountForOrder(params.data, "sale", false);
      }
    },
    valueFormatter: (params) => {
      if (params.value) {
        return dataFormatter(params.value, "currency");
      }
    },
  },
  {
    field: "expenses",
    headerName: "Expenses",
    width: 100,
    valueGetter: (params) => {
      if (params.data) {
        return calculateAmountForOrder(params.data, "outflow", false);
      }
    },
    valueFormatter: (params) => {
      if (params.value) {
        return dataFormatter(params.value, "currency");
      }
    },
  },
  {
    field: "profit",
    headerName: "Profit",
    width: 100,
    valueGetter: (params) => {
      if (params.data) {
        return (
          calculateAmountForOrder(params.data, "sale", false) -
          calculateAmountForOrder(params.data, "outflow", false)
        );
      }
    },
    valueFormatter: (params) => {
      if (params.value) {
        return dataFormatter(params.value, "currency");
      }
    },
  },
];

export const deliveriesTable = [
  {
    field: "saleDate",
    headerName: "Date",
    width: 120,
    valueGetter: (params) => {
      // console.log(params.data);
      if (params.data) {
        return moment(params.data.order.saleDate).format("DD-MM-YY");
      }
    },
  },
  {
    field: "loading",
    headerName: "Loading",
    width: 130,
    valueGetter: (params) => {
      if (params.data) {
        return JSON.parse(params.data.loading).structured_formatting.main_text;
      }
    },
  },
  {
    field: "lr",
    headerName: "LR",
    width: 90,
    cellRenderer: (params) => {
      if (params.data) {
        if (params.data.lr) {
          return (
            <Link
              color="secondary"
              href={`/dashboard/lrs/${params.data.lr.id}`}
              variant="body"
            >
              {`${params.data.lr.organisation.initials}-${params.data.lr.lrNo}`}
            </Link>
          );
        } else {
          return (
            <Link
              color="primary"
              href={`/dashboard/lrs/new?deliveryId=${params.data.id}&orderId=${params.data.order.id}`}
              variant="body"
            >
              Make LR
            </Link>
          );
        }
      }
    },
  },
  {
    field: "orderNo",
    headerName: "Order No",
    width: 120,
    valueGetter: (params) => {
      // console.log(params.data);
      if (params.data) {
        return params.data.order.orderNo;
      }
    },
  },
  {
    field: "customer",
    headerName: "Customer",
    width: 250,
    valueGetter: (params) => {
      if (params.data) {
        return params.data.order.customer.name;
      }
    },
  },

  {
    field: "consignor",
    headerName: "Consignor",
    width: 250,
    valueGetter: (params) => {
      if (params.data) {
        if (params.data.lr) {
          return params.data.lr.consignor.name;
        } else {
          return "N/A";
        }
      }
    },
  },
  {
    field: "consignee",
    headerName: "Consignee",
    width: 250,
    valueGetter: (params) => {
      if (params.data) {
        if (params.data.lr) {
          return params.data.lr.consignee.name;
        } else {
          return "N/A";
        }
      }
    },
  },

  {
    field: "unloading",
    headerName: "Unloading",
    width: 130,
    valueGetter: (params) => {
      if (params.data) {
        return JSON.parse(params.data.unloading).structured_formatting
          .main_text;
      }
    },
  },
  {
    field: "billQuantity",
    headerName: "Bill Wt",
    width: 90,
    editable: true,
    valueFormatter: (params) => {
      if (params.value) {
        return `${params.value} ${JSON.parse(params.data.order.saleType).unit}`;
      } else {
        return "-";
      }
    },
  },
  {
    field: "unloadingQuantity",
    headerName: "Unloading Wt",
    width: 120,
    editable: true,
    valueFormatter: (params) => {
      if (params.value) {
        return `${params.value} ${JSON.parse(params.data.order.saleType).unit}`;
      } else {
        return "-";
      }
    },
  },
  {
    field: "vehicleNo",
    headerName: "Vehicle No",
    width: 150,
    valueGetter: (params) => {
      if (params.data) {
        return params.data.order.vehicleNumber;
      }
    },
  },
  {
    field: "transporter",
    headerName: "Transporter",
    width: 200,
    valueGetter: (params) => {
      if (params.data) {
        if (params.data.order.vehicleId) {
          return "SELF";
        } else {
          return params.data.order.transporter.name;
        }
      }
    },
  },
];

export const deliveryDetailsTableForOrderDrawer = [
  {
    field: "lr",
    headerName: "LR",
    width: 90,
    renderCell: (params) => {
      if (params.row.lr) {
        return (
          <Link
            color="secondary"
            href={`/dashboard/lrs/${params.row.lr.id}`}
            variant="body"
          >
            {`${params.row.lr.organisation.initials}-${params.row.lr.lrNo}`}
          </Link>
        );
      } else {
        return (
          <Link
            color="secondary"
            href={`/dashboard/lrs/new?deliveryId=${params.row.id}&orderId=${params.row.order.id}`}
            variant="body"
          >
            Make LR
          </Link>
        );
      }
    },
  },
  {
    field: "loading",
    headerName: "Loading",
    width: 120,
    valueGetter: (params) => {
      if (params.value) {
        return JSON.parse(params.value).structured_formatting.main_text;
      }
    },
  },
  {
    field: "unloading",
    headerName: "Unloading",
    width: 120,
    valueGetter: (params) => {
      if (params.value) {
        return JSON.parse(params.value).structured_formatting.main_text;
      }
    },
  },
  {
    field: "billQuantity",
    headerName: "Bill Wt",
    width: 90,
    valueFormatter: (params) => {
      if (params.value) {
        return `${params.value} ${
          JSON.parse(params.api.getRow(params.id).order.saleType).unit
        }`;
      } else {
        return "-";
      }
    },
  },
  {
    field: "billQuantity",
    headerName: "Bill Wt",
    width: 90,
    valueFormatter: (params) => {
      if (params.value) {
        return `${params.value} ${
          JSON.parse(params.api.getRow(params.id).order.saleType).unit
        }`;
      } else {
        return "-";
      }
    },
  },
];

export const lrTable = [
  {
    field: "lrDate",
    headerName: "Date",
    width: 130,
    cellRenderer: (params) => {
      if (params.value !== undefined) {
        return moment(params.data.lrDate).format("DD-MM-YY");
      }
      // else {
      //   return <img src="https://www.ag-grid.com/example-assets/loading.gif" />;
      // }
    },
  },
  {
    field: "lrNo",
    headerName: "LR No",
    width: 100,
    cellRenderer: (params) => {
      if (params.value !== undefined) {
        return (
          <Link href={`/dashboard/lrs/${params.data.id}`} passHref>
            {`${params.data.organisation.initials}-${params.data.lrNo}`}
          </Link>
        );
      }
    },
  },
  {
    field: "orderNo",
    headerName: "Order No",
    width: 80,
    valueGetter: (params) => {
      if (params.data) {
        return params.data.order.orderNo;
      }
    },
  },
  {
    field: "customer",
    headerName: "Customer",
    width: 250,
    valueGetter: (params) => {
      if (params.data) {
        return params.data.order.customer.name;
      }
    },
  },
  {
    field: "vehicleNo",
    headerName: "Vehicle Number",
    width: 150,
    valueGetter: (params) => {
      if (params.data) {
        return params.data.order.vehicleNumber;
      }
    },
  },
  {
    field: "loading",
    headerName: "Loading",
    width: 130,
    valueGetter: (params) => {
      if (params.data) {
        return JSON.parse(params.data.delivery.loading).structured_formatting
          .main_text;
      }
    },
  },
  {
    field: "unloading",
    headerName: "Unoading",
    width: 130,
    valueGetter: (params) => {
      if (params.data) {
        return JSON.parse(params.data.delivery.unloading).structured_formatting
          .main_text;
      }
    },
  },
  {
    field: "consignor",
    headerName: "Consignor",
    width: 250,
    valueGetter: (params) => {
      if (params.data) {
        return params.data.consignor.name;
      }
    },
  },
  {
    field: "consignee",
    headerName: "Consignee",
    width: 250,
    valueGetter: (params) => {
      if (params.data) {
        return params.data.consignee.name;
      }
    },
  },
  {
    field: "saleBillNo",
    headerName: "Sale Bill No",
    width: 130,
    valueGetter: (params) => {
      if (params.data) {
        return params.data.delivery.invoiceId
          ? `${params.data.delivery.invoice.organisation.initials}-${params.data.delivery.invoice.invoiceNo}`
          : "Not Issued";
      }
    },
  },
];

export const invoiceTable = [
  {
    field: "invoiceNo",
    headerName: "Invoice No",
    width: 130,
    renderCell: (params) => {
      if (params.value) {
        return (
          <Link href={`/dashboard/invoices/${params.row.id}`} passHref>
            {`${params.row.organisation.initials}-${params.row.invoiceNo}`}
          </Link>
        );
      }
    },
  },
  {
    field: "invoiceDate",
    headerName: "Date",
    width: 130,
    valueGetter: (params) => {
      if (params.value) {
        return moment(params.value).format("DD-MM-YY");
      }
    },
  },
];

export const orderTableForCreateInvoice = [
  {
    field: "initials",
    headerName: "🚚",
    checkboxSelection: true,
  },
  {
    field: "orderNo",
    headerName: "Order No",
    valueFormatter: (params) => {
      return params.data && params.data.order.orderNo;
    },
  },
  {
    field: "saleDate",
    headerName: "Sale Date",
    valueFormatter: (params) => {
      return (
        params.data && moment(params.data.order.saleDate).format("DD-MM-YY")
      );
    },
  },
  {
    field: "vehicleNumber",
    headerName: "Vehicle Number",
    valueGetter: (params) => {
      return params.data && params.data.order.vehicleNumber;
    },
  },
  {
    field: "loading",
    headerName: "Loading From",
    valueGetter: (params) => {
      return (
        params.data &&
        JSON.parse(params.data.loading).structured_formatting.main_text
      );
    },
  },
  {
    field: "loading",
    headerName: "Unloading At",
    valueGetter: (params) => {
      return (
        params.data &&
        JSON.parse(params.data.unloading).structured_formatting.main_text
      );
    },
  },
  {
    field: "billWeight",
    headerName: "Bill Weight",
    editable: true,
    valueSetter: (params) => {
      return true;
    },
    valueGetter: (params) => {
      return params.data && params.data.billQuantity;
    },
    valueFormatter: (params) => {
      return (
        params.value &&
        `${params.value} ${JSON.parse(params.data.order.saleType).unit}`
      );
    },
  },
  {
    field: "saleRate",
    headerName: "Sale Rate",
    valueGetter: (params) => {
      return params.data && params.data.order.saleRate;
    },
    valueFormatter: (params) => {
      return (
        params.value &&
        `Rs. ${params.value} / ${JSON.parse(params.data.order.saleType).unit}`
      );
    },
  },
];
