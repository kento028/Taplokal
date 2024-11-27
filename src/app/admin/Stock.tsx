import React, { useState, useEffect } from 'react';
import { fs } from '../firebaseConfig'; // Firestore initialization
import { collection, doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';
import TopSales from '../components/TopSales';

interface MenuItem {
  id: string;
  name: string;
  stock: number;
}

const Stock = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [bulkAmount, setBulkAmount] = useState<number>(1); // Default amount for bulk actions
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Fetch menu items from Firestore
  useEffect(() => {
    const menuCollection = collection(fs, 'menu');

    const unsubscribe = onSnapshot(menuCollection, (snapshot) => {
      const menuData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as MenuItem));
      setMenuItems(menuData);
    });

    return () => unsubscribe();
  }, []);

  // Handle Stock In/Out for bulk update
  const handleStockUpdate = async (isIncrement: boolean) => {
    if (!selectedItem) return;

    const menuRef = doc(fs, 'menu', selectedItem.id);
    const menuDoc = await getDoc(menuRef);
    const currentStock = menuDoc.data()?.stock || 0;

    const newStock = isIncrement
      ? currentStock + bulkAmount
      : Math.max(0, currentStock - bulkAmount); // Ensure stock doesn't go below 0

    await updateDoc(menuRef, { stock: newStock });
    setBulkAmount(1); // Reset the bulk amount
    setModalOpen(false); // Close modal
    setSelectedItem(null); // Reset selected item
  };

  // Handle individual stock increment and decrement
  const handleStockChange = async (id: string, increment: boolean) => {
    const menuRef = doc(fs, 'menu', id);
    const menuDoc = await getDoc(menuRef);
    const currentStock = menuDoc.data()?.stock || 0;

    const newStock = increment
      ? currentStock + 1
      : Math.max(0, currentStock - 1); // Prevent stock from going negative

    await updateDoc(menuRef, { stock: newStock });
  };

  // Filter menu items based on the search query
  const filteredMenuItems = menuItems.filter((item) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.stock.toString().includes(searchQuery)
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Stock Management</h1>

      <div className='flex gap-5'>
        <TopSales />
      </div>

      {/* Search Input */}
      <div className="mb-6 mt-10">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Add notification alert here for low stocks */}
      {
        menuItems.filter((item) => item.stock < 10).length > 0 && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold">Low Stock Alert</h2>
            <p className="text-sm">The following items are running low on stock:</p>
            <ul className="list-disc list-inside mt-2">
              {menuItems.filter((item) => item.stock < 10).map((item) => (
                <li key={item.id}>{item.name} - {item.stock} remaining</li>
              ))}
            </ul>
          </div>)
      }


      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg overflow-hidden rounded-lg">
          <thead className="bg-foreground/20 text-foreground">
            <tr>
              <th className="py-4 px-6 text-left font-semibold">Item</th>
              <th className="py-4 px-6 text-center font-semibold">Current Stock</th>
              <th className="py-4 px-6 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenuItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100 transition duration-300">
                <td className="text-left py-4 px-6 border-b text-gray-800 font-semibold">{item.name}</td>
                <td className="text-center py-4 px-6 border-b text-gray-800">{item.stock}</td>
                <td className="text-right py-4 px-6 border-b">
                  <button
                    onClick={() => handleStockChange(item.id, true)} // Handle individual stock in (+)
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 mr-2"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleStockChange(item.id, false)} // Handle individual stock out (-)
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 mr-2"
                  >
                    -
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setModalOpen(true); // Open bulk update modal
                    }}
                    className="bg-foreground text-white px-4 py-2 rounded hover:bg-foreground/80 transition duration-200"
                  >
                    Bulk Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for bulk stock updates */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Bulk Update Stock for {selectedItem?.name}</h2>
            <input
              type="number"
              className="w-full p-2 border rounded focus:outline-none focus:border-indigo-500 mb-4"
              value={bulkAmount}
              onChange={(e) => setBulkAmount(Number(e.target.value))}
              min="1"
            />
            <div className="flex justify-end">
              <button
                onClick={() => handleStockUpdate(true)} // Handle bulk stock in
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 mr-2"
              >
                Add Stock
              </button>
              <button
                onClick={() => handleStockUpdate(false)} // Handle bulk stock out
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
              >
                Remove Stock
              </button>
              <button
                onClick={() => setModalOpen(false)} // Close modal
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-200 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
