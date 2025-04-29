import Link from "next/link";
import { Metadata } from "next";

//nextAuth
import { auth } from "@/auth";

//ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react";

//getOrderSummary data
import { getOrderSummary } from "@/lib/actions/order.actions";

//get format date
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";

//charts
import ChartBar from "@/components/dashboard/chartBar";
import ChartPie from "@/components/dashboard/chartPie";

//verify admin
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const session = await auth();

  // Make sure the user is an admin
  if (session?.user.role !== "admin")
    throw new Error("admin permission required");

  // Get order summary
  const summary = await getOrderSummary();

  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
        Admin Dashboard
      </h1>

      {/* METRICS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Revenue",
            value: formatCurrency(
              summary.totalSales._sum.totalPrice!.toString()
            ),
            icon: <BadgeDollarSign size={22} className="text-green-600" />,
          },
          {
            title: "Sales",
            value: formatNumber(summary.ordersCount),
            icon: <CreditCard size={22} className="text-blue-600" />,
          },
          {
            title: "Customers",
            value: summary.usersCount,
            icon: <Users size={22} className="text-purple-600" />,
          },
          {
            title: "Products",
            value: summary.productsCount,
            icon: <Barcode size={22} className="text-yellow-600" />,
          },
        ].map(({ title, value, icon }, idx) => (
          <Card
            key={idx}
            className="hover:shadow-xl transition-shadow duration-300 border border-gray-200 bg-white rounded-2xl"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {title}
              </CardTitle>
              <div className="rounded-full p-2 bg-gray-100">{icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHART & TABLE */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-8">
        <Card className="col-span-4 bg-white rounded-2xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-600 font-semibold">
              Overview
            </CardTitle>
          </CardHeader>

          <CardContent className="pl-2">
            <ChartBar
              data={{
                salesData: summary.salesData,
              }}
            />
          </CardContent>
        </Card>

        <Card className="col-span-4 bg-white rounded-2xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-600 font-semibold">
              Overview
            </CardTitle>
          </CardHeader>

          <CardContent className="pl-2">
            <ChartPie
              data={{
                salesData: summary.salesData,
              }}
            />
          </CardContent>
        </Card>

        <Card className="col-span-4 bg-white rounded-2xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-600 font-semibold">
              Recent Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="text-gray-500">
                  <TableHead>BUYER</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestSales.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-gray-50 even:bg-gray-100"
                  >
                    <TableCell className="font-medium text-gray-700">
                      {order.user?.name ? order.user.name : "Deleted user"}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {formatDateTime(order.createdAt).dateOnly}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatCurrency(order.totalPrice)}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/order/${order.id}`}>Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
