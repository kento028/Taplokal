import React, { useEffect, useState } from 'react';
import { fs } from '../firebaseConfig';
import {
    collection,
    getDocs,
    onSnapshot,
    doc,
    updateDoc,
} from 'firebase/firestore';
import blankProfile from '../images/blankProfile.jpg';
import Image from 'next/image';
import Select from 'react-select';
import { User } from '../Types';

const options = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'super admin', label: 'Super Admin' },
    { value: 'cashier', label: 'Cashier' },
    { value: 'user', label: 'User' },
    { value: 'kiosk', label: 'Kiosk'}
];

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    useEffect(() => {
        const usersRef = collection(fs, 'users');

        const fetchData = async () => {
            const snapshot = await getDocs(usersRef);
            const usersList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as User));

            setUsers(usersList); // Store all users
        };

        const unsubscribe = onSnapshot(usersRef, fetchData); // Real-time updates
        return () => unsubscribe();
    }, [currentPage]);

    const handleMenuToggle = (id: string) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleRoleChange = async (id: string, newRole: string) => {
        const userRef = doc(fs, `users/${id}`);
        await updateDoc(userRef, { role: newRole });
        setOpenMenuId(null);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch = (
            (user.name && user.name.toLowerCase().includes(searchQuery)) ||
            (user.email && user.email.toLowerCase().includes(searchQuery))
        );

        const matchesRole = selectedRole ? user.role === selectedRole : true;

        return matchesSearch && matchesRole;
    });
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='p-2'>
            <h1 className='font-bold text-2xl'>User management</h1>
            <p className='text-gray-500 text-sm font-semibold'>Manage your user members and their account permission here</p>
            <div className='my-10 flex flex-row justify-between'>
                <h1 className='text-[#121212] text-xl font-bold'>
                    All Users <span className='text-gray-400'>{filteredUsers.length}</span>
                </h1>
                <div className='flex flex-row gap-2'>
                    <div className='flex flex-row items-center px-4 border border-gray-300 gap-2 rounded-lg text-gray-400'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <input type="text" className='text-black outline-none' placeholder='Search' value={searchQuery} onChange={handleSearch} />
                    </div>
                    <Select
                        className='w-48'
                        options={options}
                        onChange={(selectedOption) => setSelectedRole(selectedOption?.value || '')}
                        value={options.find(option => option.value === selectedRole)}
                    />
                </div>
            </div>
            <div className=''>
                <table className="min-w-full rounded-2xl">
                    <thead className="bg-gray-50 whitespace-nowrap">
                        <tr>
                            <th className="p-4 text-left text-sm font-bold text-gray-500">User name</th>
                            <th className="p-4 text-left text-sm font-bold text-gray-500">Role</th>
                            <th className="p-4 text-left text-sm font-bold text-gray-500">Date Updated</th>
                            <th className="p-4 text-left text-sm font-bold text-gray-500">Date Added</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="whitespace-nowrap overflow-y-scroll">
                        {paginatedUsers.map((user) => (
                            <tr key={user.id} className='hover:bg-gray-50'>
                                <th className="p-2 text-sm">
                                    <div className="p-2 flex items-center">
                                        <div className="flex-shrink-0 rounded-full relative h-10 w-10 overflow-hidden mr-4">
                                            <Image
                                                src={user.imageURL ? user.imageURL : blankProfile}
                                                layout='fill'
                                                objectFit='cover'
                                                alt={user.name}
                                                loading='lazy'
                                            />
                                        </div>
                                        <div className='space-y-1'>
                                            <strong className="block text-sm font-bold text-left">{user.name}</strong>
                                            <p className='text-xs font-normal'>{user.email}</p>
                                        </div>
                                    </div>
                                </th>
                                <th className="p-4 text-xs text-left">
                                    <div>
                                        <span className={`px-2 py-1 font-bold ${user.role === 'super admin' ? "text-green-600 bg-green-50 border-green-600" : user.role ===
                                            'admin' ? "text-red-600 bg-red-50 border-red-600" : "text-blue-600 bg-blue-50 border-blue-600"} border rounded-full capitalize`}>{user.role}</span>
                                    </div>
                                </th>
                                <th className="p-4 text-sm text-gray-500">{user.updatedAt?.toDate().toLocaleDateString()}</th>
                                <th className="p-4 text-sm text-gray-500">{user.createdAt?.toDate().toLocaleDateString()}</th>
                                <th className="p-4 text-sm text-gray-500 relative">
                                    <div>
                                        <button
                                            className='bg-gray-200 text-gray-500 p-2 rounded-md'
                                            onClick={() => handleMenuToggle(user.id)}
                                        >
                                            Edit
                                        </button>
                                        {openMenuId === user.id && (
                                            <div className="absolute -top-20 right-20 bg-white border rounded-lg shadow-lg z-10">
                                                {options.slice(1).map(option => (
                                                    <button
                                                        key={option.value}
                                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                        onClick={() => handleRoleChange(user.id, option.value)}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex justify-center space-x-2 mt-4'>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-4 py-2 border rounded-lg ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
