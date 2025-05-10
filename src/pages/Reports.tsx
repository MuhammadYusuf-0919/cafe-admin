import { useState } from "react";
import { useData } from "@/context/DataContext";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import { BarChart2, LayoutDashboard, ClipboardList, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const { salesReports, orders, menuItems } = useData();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reportPeriod, setReportPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  // Process sales data for charts
  const periodMap = {
    daily: 7, // last 7 days
    weekly: 4, // last 4 weeks
    monthly: 12, // last 12 months
  };

  const formatReportData = () => {
    if (reportPeriod === "daily") {
      // Last 7 days
      return salesReports.slice(0, 7).reverse();
    } else if (reportPeriod === "weekly") {
      // Last 4 weeks (aggregate by week)
      const weeklyData = [];
      for (let i = 0; i < 4; i++) {
        const weekStart = i * 7;
        const weekEnd = weekStart + 7;
        const weekData = salesReports.slice(weekStart, weekEnd);

        if (weekData.length > 0) {
          const total = weekData.reduce((sum, day) => sum + day.total, 0);
          const orderCount = weekData.reduce((sum, day) => sum + day.orderCount, 0);
          const itemsSold = weekData.reduce((sum, day) => sum + day.itemsSold, 0);

          weeklyData.push({
            date: `Week ${i + 1}`,
            total,
            orderCount,
            itemsSold
          });
        }
      }
      return weeklyData.reverse();
    } else {
      // Last 12 months (mock data since we only have 30 days)
      const monthlyData = [];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      for (let i = 0; i < 12; i++) {
        // Generate some mock monthly data
        const baseAmount = 2000 + Math.random() * 1000 + (i % 3 === 0 ? 500 : 0);

        monthlyData.push({
          date: months[i],
          total: Math.round(baseAmount * 100) / 100,
          orderCount: Math.floor(baseAmount / 50),
          itemsSold: Math.floor(baseAmount / 15)
        });
      }
      return monthlyData;
    }
  };

  const reportData = formatReportData();

  // Top-selling items (e.g., coming from analytics/stats)
  const topSellingItems = [
    { name: 'Plov (Osh)', value: 40 },
    { name: 'Manti', value: 30 },
    { name: 'Shashlik', value: 25 },
    { name: 'Somsa', value: 20 },
    { name: 'Choy (Green Tea)', value: 15 },
  ];

  // Pie slice colors
  const COLORS = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#845EC2'];

  return (
    <AppLayout title="Sales Reports">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">Sotish hisobotlari</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Savdo ma'lumotlarini tahlil qiling va restoran ishini kuzatib boring
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Kunlik o'rtacha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-500">
              ${(salesReports.reduce((sum, report) => sum + report.total, 0) / salesReports.length).toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Oxirgi 30 kunga asoslangan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Jami buyurtmalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-500">
              {salesReports.reduce((sum, report) => sum + report.orderCount, 0)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Oxirgi 30 kunga asoslangan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Items Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-500">
              {salesReports.reduce((sum, report) => sum + report.itemsSold, 0)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Oxirgi 30 kunga asoslangan
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Sotish haqida umumiy ma'lumot</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={reportPeriod === "daily" ? "teal" : "outline"}
                    size="sm"
                    className={reportPeriod === "daily" ? "" : ""}
                    onClick={() => setReportPeriod("daily")}
                  >
                    Kundalik
                  </Button>
                  <Button
                    variant={reportPeriod === "weekly" ? "teal" : "outline"}
                    size="sm"
                    className={reportPeriod === "weekly" ? "" : ""}
                    onClick={() => setReportPeriod("weekly")}
                  >
                    Haftalik
                  </Button>
                  <Button
                    variant={reportPeriod === "monthly" ? "teal" : "outline"}
                    size="sm"
                    className={reportPeriod === "monthly" ? "" : ""}
                    onClick={() => setReportPeriod("monthly")}
                  >
                    Oylik
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className={`${isMobile ? 'h-[250px]' : 'h-[350px]'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reportData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'white', borderColor: '#e5e7eb' }} />
                  <Legend />
                  <Bar
                    dataKey="total"
                    name="Sotish ($)"
                    fill="#0FB5BA"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Eng ko'p sotiladigan buyumlar</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'h-[250px]' : 'h-[350px]'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topSellingItems}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={isMobile ? 60 : 80}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1500}
                >
                  {topSellingItems.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'white', borderColor: '#e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20 lg:mb-6">
        <Card className={isMobile ? "order-2" : ""}>
          <CardHeader>
            <CardTitle>Buyurtma kalendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm"
            />

            {date && (
              <div className="mt-4 space-y-2">
                <h3 className="font-medium">
                  Buyurtmalar {format(date, "MMMM d, yyyy")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {Math.floor(Math.random() * 10) + 5} buyurtmalar
                </p>
                <p className="font-medium text-teal-600 dark:text-teal-500">
                  Jami: ${((Math.random() * 300) + 200).toFixed(2)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={`lg:col-span-2 ${isMobile ? "order-1" : ""}`}>
          <CardHeader>
            <CardTitle>Buyurtma tendentsiyalari</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'h-[250px]' : 'h-[350px]'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={reportData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip contentStyle={{ backgroundColor: 'white', borderColor: '#e5e7eb' }} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="orderCount"
                  name="Buyurtmalar"
                  stroke="#0D989D"
                  activeDot={{ r: 8 }}
                  animationDuration={1500}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="itemsSold"
                  name="Sotilgan buyumlar"
                  stroke="#2DD4BF"
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg p-3 z-50 pb-safe">
          <div className="flex justify-around">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="flex flex-col items-center space-y-1"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-xs">Bosh sahifa</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/orders")}
              className="flex flex-col items-center space-y-1"
            >
              <ClipboardList className="h-5 w-5" />
              <span className="text-xs">Buyurtmalar</span>
            </Button>
            <Button
              variant="teal"
              size="sm"
              onClick={() => navigate("/reports")}
              className="flex flex-col items-center space-y-1"
            >
              <BarChart2 className="h-5 w-5" />
              <span className="text-xs">Hisobotlar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
              className="flex flex-col items-center space-y-1"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Profil</span>
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Reports;
