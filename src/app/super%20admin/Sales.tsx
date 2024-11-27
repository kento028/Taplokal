import React, { useState } from 'react'
import SalesBarChart from '../components/SalesBarChart'
import SalesSummary from '../components/SalesSummary';
import SalesDetails from '../components/SalesDetails';
import SalesToday from '../components/SalesToday';
import { SaleProps } from '../Types';

const Sales = () => {
  const [sales, setSales] = useState<SaleProps>({
    yesterdaySales: 0,
    todaySales: 0,
    yesterdayOrders: 0,
    todayOrders: 0,
    yesterdayProductsSold: 0,
    todayProductsSold: 0,
    lastWeekSales: 0,
    thisWeekSales: 0,
    lastMonthSales: 0,
    thisMonthSales: 0,
    lastYearSales: 0,
    thisYearSales: 0,
    totalSales: 0,
    totalProducts: 0,
    totalOrders: 0,
  });


  return (
    <div className='w-full flex flex-col gap-5'>
      <div className='flex gap-5'>
        <div className='w-2/3'>
          <h1 className='text-2xl font-semibold'>Sales</h1>
          <SalesBarChart setSales={setSales} />
        </div>
        <div className='w-1/3 flex flex-col gap-5 justify-evenly'>
          <h1 className='text-2xl font-semibold'>Details</h1>
          <SalesDetails sales={sales} />
        </div>
      </div>
      <div className='flex gap-5'>
        <div className='w-1/2 px-4 py-6 border-2 border-foreground/30 rounded-2xl'>
          <SalesSummary sales={sales} />
        </div>
        <div className='w-1/2 p-4 bg-foreground/30 rounded-2xl'>
          <h1 className='text-xl font-bold'>Today&apos;s Sales</h1>
          <p>Sales Summary</p>
          <SalesToday sales={sales} />
        </div>
      </div>
    </div>
  )
}

export default Sales