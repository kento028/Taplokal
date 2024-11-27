import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { MenuItem } from '../Types';
import Image from 'next/image';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (itemData: MenuItem, file?: File) => void; // Accept file as an optional parameter
    initialData?: MenuItem;
}

const categories = [
    { value: 'ramen', label: 'Ramen' },
    { value: 'breakfast special', label: 'Breakfast Special' },
    { value: 'hot beverages', label: 'Hot Beverages' },
    { value: 'cold beverages', label: 'Cold Beverages' },
    { value: 'student meal', label: 'Student Meal' },
    { value: 'japanese dish', label: 'Japanese Dish' },
    { value: 'inasal', label: 'Inasal' },
    { value: 'chicken wings', label: 'Chicken Wings' },
]

const MenuModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [name, setName] = React.useState(initialData?.name || '');
    const [description, setDescription] = React.useState(initialData?.description || '');
    const [imageURL, setImageURL] = React.useState(initialData?.imageURL || '');
    const [category, setCategory] = React.useState(initialData?.category || '');
    const [sold, setSold] = React.useState<number>(initialData?.sold || 0);
    const [price, setPrice] = React.useState<number>(initialData?.price || 0);
    const [stock, setStock] = React.useState<number>(initialData?.stock || 0);
    const [file, setFile] = React.useState<File | null>(null);



    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setImageURL(initialData.imageURL);
            setCategory(initialData.category);
            setSold(initialData.sold);
            setPrice(initialData.price);
            setStock(initialData.stock);
        } else {
            // Reset the form when modal closes or if there's no initialData
            setName('');
            setFile(null);
            setDescription('');
            setImageURL('');
            setCategory('');
            setSold(0);
            setPrice(0);
            setStock(0);
        }
    }, [isOpen, initialData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const lowerCaseName = name.toLowerCase();
        const lowerCaseDescription = description.toLowerCase();
        const lowerCaseCategory = category.toLowerCase();

        if (!name || !description || !category || !price) {
            toast.error('Please fill out all fields');
            return;
        }
        // Submit the item data along with the file
        onSubmit({ name: lowerCaseName, description: lowerCaseDescription, imageURL, category: lowerCaseCategory, price, sold: sold, stock: stock }, file!);
        onClose(); // Close the modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    {initialData ? 'Edit Menu Item' : 'Add Menu Item'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap justify-between gap-6 mb-4">
                        <div className="flex-1">
                            <label className="block mb-2 font-medium">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border outline-none rounded-md px-3 py-2 w-full focus:ring focus:ring-green-300 transition duration-200"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-2 font-medium">Category</label>
                            <Select
                                options={categories}
                                value={categories.find(option => option.value === category)}
                                onChange={(selectedOption) => setCategory(selectedOption?.value || '')}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border outline-none rounded-md px-3 py-2 w-full h-24 focus:ring focus:ring-green-300 transition duration-200"
                            required
                        />
                    </div>

                    <div className="flex flex-wrap justify-between gap-6 mb-4">
                        <div className="flex-1">
                            <label className="block mb-2 font-medium">Image</label>
                            <div className="relative w-full h-40 border rounded-md flex items-center justify-center bg-gray-100 cursor-pointer overflow-hidden">
                                {file || imageURL ? (
                                    <Image
                                        src={file ? URL.createObjectURL(file) : imageURL}
                                        alt="Preview"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                ) : (
                                    <span className="text-gray-400">Click to upload image</span>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange} // Handles image file selection
                                    className="absolute outline-none inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className='flex-1'>
                            <div className="flex-1">
                                <label className="block mb-2 font-medium">Price</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="border outline-none rounded-md px-3 py-2 w-full focus:ring focus:ring-green-300 transition duration-200"
                                    required
                                />
                            </div>
                            <div className="flex-1 mt-5">
                                <label className="block mb-2 font-medium">Stock</label>
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(Number(e.target.value))}
                                    className="border outline-none rounded-md px-3 py-2 w-full focus:ring focus:ring-green-300 transition duration-200"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md transition duration-200">
                            Cancel
                        </button>
                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>


    );
};

export default MenuModal;
