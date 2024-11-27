import React from 'react'
import { SaleProps } from '../Types'

const SalesDetails = ({ sales }: {sales: SaleProps} ) => {

    const { totalSales, totalProducts, totalOrders } = sales
    return (
        <>
            <div className='px-4 py-6 rounded-xl bg-foreground/30'>
                <h1 className='text-xl font-bold'>Total Sales</h1>
                <p className='text-base'>₱{totalSales.toLocaleString()}.00</p>
            </div>
            <div className='px-4 py-6 rounded-xl bg-foreground/30'>
                <h1 className='text-xl font-bold'>Total Products Sold</h1>
                <p className='text-base'>{totalProducts}</p>
            </div>
            <div className='px-4 py-6 rounded-xl bg-foreground/30'>
                <h1 className='text-xl font-bold'>Total Order</h1>
                <p className='text-base'>{totalOrders}</p>
            </div>
        </>
    )
}

export default SalesDetails