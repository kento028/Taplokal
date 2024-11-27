"use client";
import React, { Suspense, useEffect, useState } from 'react';
import { auth, fs } from "../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Sales from './Sales';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Page = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPage, setCurrentPage] = useState("sales"); // Set default page to Sales

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(fs, "users", user.uid));
                if (userDoc.exists()) {
                    if (userDoc.data().role === "super admin") {
                        setName(user.displayName || "");
                        setEmail(user.email || "");
                    } else {
                        router.replace("/");
                    }
                } else {
                    toast.error("Invalid user");
                    router.replace("/");
                }
            } else {
                toast.error("Invalid user");
                router.replace("/");
            }
        });
        return () => unsubscribe(); // Clean up subscription
    }, [router]);

    const handleLogout = () => {
        toast.loading("Logging out...");
        auth.signOut().then(() => {
            toast.dismiss();
            toast.success("Logged out successfully");
            router.replace("/");
        });
    };

    const handlePageChange = (page: React.SetStateAction<string>) => {
        setCurrentPage(page);
    };

    return (
        <div className='w-full h-screen overflow-hidden'>
            <div className='flex'>
                <div className='w-1/5 border-r h-screen flex flex-col justify-between'>
                    <div className='flex flex-col gap-2 items-center justify-center content-center p-4'>
                        <Image src='/icon.png' width={100} height={100} alt='logo' className='mb-5' />
                        <Link href={"/super%20admin"}
                            className={`flex items-center w-full gap-10 cursor-pointer p-2 rounded-xl ${currentPage === "sales" ? "bg-foreground/10" : "hover:bg-foreground/10"}`}
                            onClick={() => handlePageChange("sales")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                            </svg>
                            <h1 className='font-semibold'>Sales</h1>
                        </Link>
                    </div>
                    <div className='p-2'>
                        <div className='flex items-center gap-2 mb-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <div className='flex flex-col'>
                                <p className='font-semibold text-sm capitalize'>{name}</p>
                                <p className='text-xs'>{email}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className='border-red-500 border text-red-500 hover:bg-red-500 hover:text-background p-2 rounded-xl w-full'>
                            Logout
                        </button>
                    </div>
                </div>
                <div className='w-4/5 p-4 h-screen overflow-y-scroll'>
                    <Suspense fallback={<div>Loading...</div>}>
                        <div>
                            {currentPage === "sales" && <Sales />}
                        </div>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Page;
