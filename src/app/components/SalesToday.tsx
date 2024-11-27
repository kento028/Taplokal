import { SaleProps } from "../Types";

const SalesToday = ({ sales } : { sales : SaleProps}) => {
    const { todaySales, yesterdaySales, todayOrders, yesterdayOrders, todayProductsSold, yesterdayProductsSold } = sales;
    

    return (
        <>
            <div className='grid grid-cols-3 gap-3'>
                <div className='bg-white rounded-2xl p-2 mt-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                    </svg>
                    <h1 className='font-bold text-base'>₱{todaySales.toLocaleString()}.00</h1>
                    <h2 className="font-semibold text-sm">Total Sales</h2>
                    <p className='text-xs'>
                        {yesterdaySales
                            ? `${((todaySales - yesterdaySales) / Math.abs(yesterdaySales) * 100).toFixed(0)}% from yesterday`
                            : 'No sales data for yesterday'}
                    </p>
                </div>
                <div className='bg-white rounded-2xl p-2 mt-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                    </svg>

                    <h1 className='font-bold text-base'>{sales?.todayOrders}</h1>
                    <h2 className="font-semibold text-sm">Total Orders</h2>
                    <p className='text-xs'>
                        {sales?.yesterdayOrders
                            ? `${((todayOrders - yesterdayOrders) / Math.abs(yesterdayOrders) * 100).toFixed(0)}% from yesterday`
                            : 'No sales data for yesterday'}
                    </p>
                </div>
                <div className='bg-white rounded-2xl p-2 text-black mt-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>

                    <div>
                        <h1 className='font-bold text-base'>
                            {sales?.todayProductsSold}
                        </h1>
                        <h2 className="font-semibold text-sm">Product Sold</h2>
                        <p className='text-xs'>
                            {sales?.yesterdayProductsSold
                                ? `${((todayProductsSold - yesterdayProductsSold) / Math.abs(yesterdayProductsSold) * 100).toFixed(0)}% from yesterday`
                                : 'No sales data for yesterday'}
                        </p>
                    </div>

                </div>
            </div>
        </>
    )
}

export default SalesToday