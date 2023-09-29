import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import Head from "next/head";
import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import { useMounted } from "../../../hooks/use-mounted";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { InvoiceCreateForm } from "../../../components/dashboard/invoice/invoice-create-form";
import { gtm } from "../../../lib/gtm";
import { OnBoardingGuard } from "../../../components/authentication/onboarding-guard";
import { orderApi } from "../../../api/order-api";

const LrCreate = () => {
  const router = useRouter();
  const isMounted = useMounted();
  const [order, setOrder] = useState();

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);
  const { deliveryId, orderId } = router.query;

  return (
    <>
      <Head>
        <title>Dashboard: Invoice Create | Truckar</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4">Create a new invoice</Typography>
            <Breadcrumbs separator="/" sx={{ mt: 1 }}>
              <NextLink href="/dashboard" passHref>
                <Link variant="subtitle2">Dashboard</Link>
              </NextLink>
              <NextLink href="/dashboard" passHref>
                <Link color="primary" variant="subtitle2">
                  Management
                </Link>
              </NextLink>
              <Typography color="textSecondary" variant="subtitle2">
                Create Invoice
              </Typography>
            </Breadcrumbs>
          </Box>
          {<InvoiceCreateForm order={order} deliveryId={deliveryId} />}
        </Container>
      </Box>
    </>
  );
};

LrCreate.getLayout = (page) => (
  <AuthGuard>
    <OnBoardingGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </OnBoardingGuard>
  </AuthGuard>
);

export default LrCreate;
