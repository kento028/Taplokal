"use client"
import React, { useEffect, useState } from 'react';
import { fs } from '../firebaseConfig'; // Import your Firestore configuration
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { TopMenuProps } from '../Types';
import toast from 'react-hot-toast';
import Image from 'next/image';

const TopSales = () => {
  const [topSales, setTopSales] = useState<Array<TopMenuProps>>([]);

  useEffect(() => {
    const fetchTopSales = async () => {
      try {
        const q = query(
          collection(fs, 'menu'),
          orderBy('sold', 'desc'),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const salesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            sold: data.sold,
            imageURL: data.imageURL
          };
        });
        setTopSales(salesData);
      } catch (err) {
        toast.error('Error fetching top sales' + err);
      }
    };

    fetchTopSales();
  }, []);

  return (
    <div className=" p-4 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Top 5 Menu Items</h2>
      <div className="grid grid-cols-5 gap-2">
        {topSales.map(item => (
          <div key={item.id} className="bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <Image
              src={item.imageURL}
              alt={item.name}
              className="rounded-t-lg w-full h-32 object-cover"
              width={500}
              height={500}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold capitalize">{item.name}</h3>
              <p className="text-gray-500">Sold: {item.sold}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSales;
