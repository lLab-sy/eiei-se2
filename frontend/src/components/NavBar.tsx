"use client";

import { Menu, X, User, FileText, Gift, Settings, LogOut, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setToken, setUser } from "@/redux/user/user.slice";
import axios from "axios";

const NavBar = (session: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const {data: session, status} = useSession()
  const dispatch = useDispatch<AppDispatch>()
  const user: any = useSelector<RootState>(state => state.user)
  // console.log('session', session)
  // console.log('session',session.session)
  useEffect(() => {
    if(!session){
      return;
    }
    // set token and set user from fetch data
    const handleFetch = async () => {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/users/${session?.session?.user?.username}`
      const res = await axios(apiUrl)

      const controller = new AbortController()
      if(!res){
        throw new Error('Failed to Fetch')
      }
      if(!res.data){
        throw new Error('Failed Data')
      }
      const returnUser = await res.data
      dispatch(setUser(returnUser.data))
      console.log('persist User',user)
      return () => controller.abort()
    }
    dispatch(setToken(session?.session?.user?.token))
    handleFetch()
  }, [session])

  const menuItems = [
    { icon: <User className="w-5 h-5" />, label: "Profile", href: "/user-profile" },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "My Post",
      href: "/my-post",
    },
    {
      icon: <Gift className="w-5 h-5" />,
      label: "My Offering",
      href: "/my-offering",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Setting",
      href: "/setting",
    },
    // { icon: (session) ? <LogOut className="w-5 h-5" /> : <LogIn className="w-5 h-5" />, label: (session) ? "Logout" : "Login", href: (session) ? "/api/auth/signout" : "/login" },
  ];

  return (
    <header className="bg-[#2B428C] text-white">
      <div className="flex justify-between items-center h-16">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 pl-2">
          <div className="relative w-10 h-10">
            <Image
              src="/BualoiDev-logo.png"
              alt="BualoiDev Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold">BualoiDev</span>
            <span className="text-[10px] text-gray-300">
              A PROFESSIONAL NETWORK FOR CREATIVE TALENT
            </span>
          </div>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4 pr-2">
          {/* Username with Avatar */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Gender: {user?.user?.gender ?? "None"} {session.session ? 'In session' : 'out session'} {user?.user?.username ?? "Username"}</span>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </div>

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-blue-800 rounded transition-colors z-50 relative"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } shadow-lg z-40`}
      >
        {/* Menu Header */}
        <div className="bg-[#2B428C] p-4 h-16 flex items-center">
          <span className="text-white font-bold">Menu</span>
        </div>

        {/* Menu Items */}
        <div className="pt-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                item.label === "Logout" ? "text-red-600 hover:text-red-700" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <Link
              href={(session.session) ? '/api/auth/signout' : "/login"}
              className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                session.session ? "text-red-600 hover:text-red-700" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {session ? (<LogOut className="w-5 h-5"/>) : (<LogIn className="w-5 h-5"/>)}
              <span>{(session.session) ? "Logout" : "Login"}</span>
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default NavBar;
