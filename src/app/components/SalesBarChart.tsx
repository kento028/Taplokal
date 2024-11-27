import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { fs } from '../firebaseConfig';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import 'chart.js/auto';
import { CartDetails, SaleProps } from '../Types';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

interface SalesBarChartProps {
  setSales: (sales: SaleProps) => void;
}

const SalesBarChart: React.FC<SalesBarChartProps> = ({ setSales }) => {
  const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] });

  const groupSalesByTimeRange = (orders: CartDetails[], groupBy: string) => {
    const sales: { [key: string]: number } = {};

    orders.forEach((order: CartDetails) => {
      const orderDate = order.createdAt.toDate();

      let label = '';

      if (groupBy === 'week') {
        const weekStart = startOfWeek(orderDate);
        const weekEnd = endOfWeek(orderDate);
        label = `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd')}`;
      } else if (groupBy === 'month') {
        label = format(orderDate, 'MMMM yyyy');
      } else if (groupBy === 'quarter') {
        label = `Q${Math.floor(orderDate.getMonth() / 3 + 1)} ${orderDate.getFullYear()}`;
      }

      const totalOrderSales = order.items.reduce((acc: number, item: { price: number; quantity: number }) => {
        return acc + item.price * item.quantity;
      }, 0);

      sales[label] = sales[label] ? sales[label] + totalOrderSales : totalOrderSales;
    });

    return sales;
  };

  const determineGrouping = (startDate: Date, endDate: Date) => {
    const timeDifference = endDate.getTime() - startDate.getTime();
    const totalDays = timeDifference / (1000 * 3600 * 24);

    if (totalDays <= 90) {
      return 'week';
    } else if (totalDays <= 180) {
      return 'month';
    } else {
      return 'quarter';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const checkoutsSnapshot = await getDocs(
        query(collection(fs, 'checkouts'), where('status', '==', 'completed'))
      );

      const checkoutDocs = checkoutsSnapshot.docs;

      const orders: CartDetails[] = [];
      const now = new Date(); // Current date

      // Using UTC to avoid timezone issues
      const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const startOfYesterday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
      const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
      const startOfLastWeek = startOfWeek(new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 7), { weekStartsOn: 1 });
      const startOfThisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)); // Start of the current month
      const startOfLastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)); // Start of the last month
      const startOfThisYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1)); // Start of the current year
      const startOfLastYear = new Date(Date.UTC(now.getUTCFullYear() - 1, 0, 1)); // Start of the last year
      const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 });
      const endOfLastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0)); // Last day of last month
      const endOfThisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)); // Last day of this month
      const endOfThisYear = new Date(Date.UTC(now.getUTCFullYear(), 11, 31)); // Last day of this year

      let totalSales = 0,
        thisWeekSales = 0,
        lastWeekSales = 0;
      let thisMonthSales = 0,
        lastMonthSales = 0,
        thisYearSales = 0,
        lastYearSales = 0;
      let todaySales = 0,
        yesterdaySales = 0;
      let todayOrders = 0,
        yesterdayOrders = 0,
        todayProductsSold = 0,
        yesterdayProductsSold = 0;
      let totalProducts = 0, totalOrders = 0;

      for (const checkoutDoc of checkoutDocs) {
        const checkoutData = checkoutDoc.data();

        if (checkoutData.status === 'completed') {
          const orderDate = checkoutData.createdAt.toDate();
          const orderSales = checkoutData.items.reduce(
            (acc: number, item: { price: number; quantity: number }) => acc + item.price * item.quantity,
            0
          );

          orders.push(checkoutData as CartDetails); // Add orders for chart data calculation

          totalSales += orderSales;
          totalProducts += checkoutData.items.length;
          totalOrders += 1;

          // This Week Sales
          if (orderDate >= startOfThisWeek && orderDate <= endOfThisWeek) {
            thisWeekSales += orderSales;
          }

          // Last Week Sales
          if (orderDate >= startOfLastWeek && orderDate < startOfThisWeek) {
            lastWeekSales += orderSales;
          }

          // This Month Sales
          if (orderDate >= startOfThisMonth && orderDate <= endOfThisMonth) {
            thisMonthSales += orderSales;
          }

          // Last Month Sales
          if (orderDate >= startOfLastMonth && orderDate < endOfLastMonth) {
            lastMonthSales += orderSales;
          }

          // This Year Sales
          if (orderDate >= startOfThisYear && orderDate <= endOfThisYear) {
            thisYearSales += orderSales;
          }

          // Last Year Sales
          if (orderDate >= startOfLastYear && orderDate < startOfThisYear) {
            lastYearSales += orderSales;
          }

          // Today's Sales and Orders
          if (orderDate >= startOfToday) {
            todaySales += orderSales;
            todayOrders += 1;
            todayProductsSold += checkoutData.items.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);
          }

          // Yesterday's Sales and Orders
          if (orderDate >= startOfYesterday && orderDate < startOfToday) {
            yesterdaySales += orderSales;
            yesterdayOrders += 1;
            yesterdayProductsSold += checkoutData.items.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);
          }
        }
      }

      setSales({
        yesterdaySales,
        todaySales,
        yesterdayOrders,
        todayOrders,
        yesterdayProductsSold,
        todayProductsSold,
        lastWeekSales,
        thisWeekSales,
        lastMonthSales,
        thisMonthSales,
        lastYearSales,
        thisYearSales,
        totalSales,
        totalProducts,
        totalOrders,
      });

      const orderDates = orders.map((order) => order.createdAt.toDate());
      const startDate = new Date(Math.min(...orderDates.map(date => date.getTime())));
      const endDate = new Date(Math.max(...orderDates.map(date => date.getTime())));

      const grouping = determineGrouping(startDate, endDate);

      const groupedSales = groupSalesByTimeRange(orders, grouping);
      const labels = Object.keys(groupedSales);
      const salesData = Object.values(groupedSales) as number[];

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Sales',
            data: salesData,
            backgroundColor: '#C8B761', // Customize color
            borderColor: '#C8B761',
            borderWidth: 1,
          },
        ],
      });
    };
    fetchData();
  }, [setSales]);

  return (
    <div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Sales (in currency)',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default SalesBarChart;
