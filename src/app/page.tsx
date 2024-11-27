import Link from "next/link";
import Image from 'next/image';


export default function Home() {


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-foreground text-background">
      <Image src='/icon.png' alt='logo' width={180} height={180} className="absolute top-0 left-0 p-4 drop-shadow-lg" />
      <Link href="/login/admin" className="p-6 rounded-2xl border border-background w-80 text-center mb-4 hover:bg-background hover:text-foreground">Admin</Link>
      <Link href="/login/super admin" className="p-6 rounded-2xl border border-background w-80 text-center hover:bg-background hover:text-foreground">Super Admin</Link>
    </div>
  );
}
