"use client"
import React, { useEffect, useState } from 'react';
import MenuItem from '../components/MenuItem';
import { MenuItemProps, MenuItem as ItemMenu } from '../Types';
import { collection, deleteDoc, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { storage, fs } from '../firebaseConfig';
import MenuModal from '../components/MenuModal';
import { ref, uploadBytes, getDownloadURL, updateMetadata } from 'firebase/storage';
import toast from 'react-hot-toast';

// Skeleton component
const SkeletonMenuItem = () => (
    <div className="border border-gray-300 p-4 rounded-md animate-pulse bg-gray-200">
        <div className="h-24 bg-gray-300 mb-4"></div>
        <div className="h-4 bg-gray-300 mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-300 mb-2 w-1/2"></div>
        <div className="h-4 bg-gray-300 mb-2 w-1/3"></div>
    </div>
);

const AddMenu = () => {
    const [menuItems, setMenuItems] = useState<Array<MenuItemProps>>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItemId, setEditItemId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const fetchData = async () => {
        setLoading(true);
        const menuRef = collection(fs, 'menu');
        const docs = await getDocs(menuRef);
        const menuItemsList: Array<MenuItemProps> = [];
        docs.forEach((doc) => {
            menuItemsList.push({ id: doc.id, ...doc.data() } as MenuItemProps);
        });
        setMenuItems(menuItemsList);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (itemId: string) => {
        setEditItemId(itemId);
        setIsModalOpen(true);
    };

    const handleDelete = async (itemId: string) => {
        try {
            // 1. Delete the menu item from the 'menu' collection
            const itemRef = doc(fs, 'menu', itemId);
            await deleteDoc(itemRef);
            toast.success('Menu item deleted successfully');
    
            // 2. Fetch all carts that contain the menuId and remove the item
            const cartsRef = collection(fs, 'carts');
            const cartsSnapshot = await getDocs(cartsRef);
            const batch = writeBatch(fs); // Use batch for atomic operations
    
            cartsSnapshot.forEach((cartDoc) => {
                const cartData = cartDoc.data();
                const cartId = cartDoc.id;
    
                // Check if this cart contains the menu item
                if (cartData.items) {
                    const itemIndex = cartData.items.findIndex((item: { menuItemId: string; }) => item.menuItemId === itemId);
    
                    if (itemIndex !== -1) {
                        // If the item exists in the cart, we remove it from the items array
                        const updatedItems = [...cartData.items];
                        updatedItems.splice(itemIndex, 1);
    
                        // Update the cart with the new items array
                        batch.update(doc(fs, 'carts', cartId), {
                            items: updatedItems
                        });
                    }
                }
            });
    
            await batch.commit();
            toast.success('Menu item removed from all carts');
            setMenuItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    
        } catch (error) {
            console.error("Error deleting menu item:", error);
            toast.error('Error deleting menu item');
        }
    };
    

    const metadata = {
        cacheControl: 'public,max-age=31536000',  // Cache for 1 year
    };

    const handleSubmit = async (itemData: ItemMenu, file?: File) => {
        toast.loading('Saving changes...');
        let uploadedImageURL = itemData.imageURL;

        if (file) {
            const storageRef = ref(storage, `menuImages/${itemData.name}`);
            await uploadBytes(storageRef, file);
            await updateMetadata(storageRef, metadata);
            uploadedImageURL = await getDownloadURL(storageRef);
        }

        if (editItemId) {
            const itemRef = doc(fs, 'menu', editItemId);
            await setDoc(itemRef, { ...itemData, imageURL: uploadedImageURL }).then(() => {
                toast.dismiss();
                toast.success('Changes saved successfully');
                setMenuItems((prevItems) =>
                    prevItems.map(item => (item.id === editItemId ? { ...item, ...itemData, imageURL: uploadedImageURL } : item))
                );
            });
        } else {
            const newItemRef = doc(collection(fs, 'menu'));
            await setDoc(newItemRef, { ...itemData, imageURL: uploadedImageURL }); // Include new imageURL
            setMenuItems((prevItems) => [...prevItems, { ...itemData, id: newItemRef.id, imageURL: uploadedImageURL } as MenuItemProps]);
            toast.dismiss();
            toast.success('Item added successfully');
        }
        setIsModalOpen(false);
        setEditItemId(null);
    };

    const filteredMenuItems = menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.stock.toString().includes(searchQuery)
    );

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Menu Management</h1>
            <div className='flex justify-between items-center'>
                <div className='bg-background text-foreground p-2 rounded-lg flex items-center gap-3 border'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search items..."
                        className="outline-none"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600 transition"
                >
                    Add Menu Item
                </button>
            </div>

            <div className='grid grid-cols-2 gap-3'>
                {/* Show skeletons while loading */}
                {loading
                    ? Array.from({ length: 4 }).map((_, index) => <SkeletonMenuItem key={index} />)
                    : filteredMenuItems.map((item) => (
                        <MenuItem
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            imageURL={item.imageURL}
                            category={item.category}
                            price={item.price}
                            sold={item.sold}
                            stock={item.stock}
                            onEdit={() => handleEdit(item.id)}
                            onDelete={() => handleDelete(item.id)}
                        />
                    ))
                }
            </div>

            <MenuModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditItemId(null); }}
                onSubmit={handleSubmit}
                initialData={editItemId ? menuItems.find(item => item.id === editItemId) : undefined}
            />
        </div>
    );
};

export default AddMenu;
