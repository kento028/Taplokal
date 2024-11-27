import React from 'react';
import { MenuItemProps } from '../Types';
import Image from 'next/image';

const MenuItem = ({ name, description, imageURL, category, sold, onEdit, onDelete } : MenuItemProps) => {
    return (
        <div className="border rounded-lg p-4 shadow-md flex flex-col items-center relative">
            <Image
              src={imageURL}
              alt={name}
              className="rounded-lg w-full h-48 object-cover mb-4"
              width={500}
              height={500}
            />
            <h3 className="text-xl font-semibold mb-2 capitalize">{name}</h3>
            <p className='p-2 bg-green-100 rounded-full w-24 text-center text-green-800 font-bold mb-2'>
                Sold: {sold}
            </p>
            <p className="text-gray-600 text-center mb-2 lowercase">{description}</p>
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm mb-12">
                {category}
            </span>
            <div className="flex gap-2 absolute bottom-2 w-full justify-center">
                <button
                    onClick={onEdit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default MenuItem;
