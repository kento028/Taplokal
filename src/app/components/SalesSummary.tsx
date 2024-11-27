import React from 'react';
import { SaleProps } from '../Types';

const SalesSummary = ({ sales }: { sales: SaleProps }) => {
  const { thisWeekSales, lastWeekSales, thisMonthSales, lastMonthSales, thisYearSales, lastYearSales } = sales;
  return (
    <div>
      <div className='flex flex-row justify-between mb-4'>
        <h1 className='text-base font-bold'>Total Sales</h1>
        <div className='flex flex-row items-center gap-2 w-36'>
        {(lastWeekSales ?? 0) > (thisWeekSales ?? 0) ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 stroke-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 stroke-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
          )}
          <div>
            <h1 className='text-sm font-bold'>Last Week</h1>
            <p className='text-xs'>₱{lastWeekSales.toLocaleString()}.00</p>
          </div>
        </div>
        <div className='text-right'>
          <h1 className='text-sm font-bold'>This Week</h1>
          <p className='text-xs'>₱{thisWeekSales.toLocaleString()}.00</p>
        </div>
      </div>
      <hr />
      <div className='flex flex-row justify-between my-4'>
        <h1 className='text-base font-bold'>Total Sales</h1>
        <div className='flex flex-row items-center gap-2 w-36'>
          {(lastMonthSales ?? 0) > (thisMonthSales ?? 0) ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 stroke-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 stroke-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
          )}
          <div>
            <h1 className='text-sm font-bold'>Last Month</h1>
            <p className='text-xs'>₱{lastMonthSales.toLocaleString()}.00</p>
          </div>
        </div>
        <div className='text-right'>
          <h1 className='text-sm font-bold'>This Month</h1>
          <p className='text-xs'>₱{thisMonthSales.toLocaleString()}.00</p>
        </div>
      </div>
      <hr />
      <div className='flex flex-row justify-between mt-4'>
        <h1 className='text-base font-bold'>Total Sales</h1>
        <div className='flex flex-row items-center gap-2 w-36'>
          {(lastYearSales ?? 0) > (thisYearSales ?? 0) ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 stroke-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 stroke-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
          )}
          <div className='text-center'>
            <h1 className='text-sm font-bold'>Last Year</h1>
            <p className='text-xs'>₱{lastYearSales.toLocaleString()}.00</p>
          </div>
        </div>
        <div className='text-right'>
          <h1 className='text-sm font-bold'>This Year</h1>
          <p className='text-xs'>₱{thisYearSales.toLocaleString()}.00</p>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;
