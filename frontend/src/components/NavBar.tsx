"use client";

import { Menu, X, User, FileText, Gift, Settings, LogOut, LogIn, SearchCheck } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setProfileImageURL, setUser } from "@/redux/user/user.slice";
import axios from "axios";
import { Avatar, AvatarImage } from "./ui/avatar";

type menuItem = {
  icon: JSX.Element;
  label: string;
  href: string;
}

const NavBar = (session: any) => {
  const token = session?.session?.user?.token ?? '';
  const role = session?.session?.user?.role ?? '';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<menuItem[]>([])
  // const {data: session, status} = useSession()
  const dispatch = useDispatch<AppDispatch>()
  const user: any = useSelector<RootState>(state => state.user)
  console.log('session', session)
  
  // const handleLogout = async () => {
  //   const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`
  //   await axios.post(apiUrl, {
  //     withCredentials: true,
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //   await signOut()
  // }
  // console.log('session',session.session)
  useEffect(() => {
    if(!session.session || token === ''){
      return;
    }
    // set token and set user from fetch data
    const handleFetchProfileURL = async (id : string) => {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/users/signed-profile/${id}`
      const res= await axios.get(apiUrl)
      const imageUrl = res?.data?.data ?? ""

      dispatch(setProfileImageURL(imageUrl))
      return imageUrl
    }
    const handleFetch = async (fetchToken : string) => {

      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/me`
      const res = await axios.get(apiUrl, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${fetchToken}`
        }
      })
      console.log('res', res)
      const controller = new AbortController()
      if(!res){
        throw new Error('Failed to Fetch')
      }
      if(!res.data){
        throw new Error('Failed Data')
      }
      const returnUser = await res.data
      // console.log('returnUser', returnUser)
      await handleFetchProfileURL(returnUser.data._id)

      dispatch(setUser(returnUser.data))
      console.log('setuser', user.user)
      return () => controller.abort()
    }
    handleFetch(token)
  }, [session.session, token])

  useEffect(()=>{
    if(!session.session || token === '') return;
    const sessionMenuItems: menuItem[] = [
      { 
        icon: <User className="w-5 h-5" />, 
        label: "Profile", 
        href: "/user-profile" },
      {
        icon: <FileText className="w-5 h-5" />,
        label: role === "producer" ? "My Post" : "Work History",
        href: "/post-history",
      },
      ...(role === "producer" ? 
      [{
        icon: <Gift className="w-5 h-5" />,
        label: "Create Post",
        href: "/create-post",
      },
      {
        icon: <SearchCheck className="w-5 h-5" />,
        label: "Search for Professionals",
        href: "/professionals", 
      }] : 
      []),
      ...(role === "production professional" ? 
      [{
          icon: <SearchCheck className="w-5 h-5" />,
          label: "Search for Posts",
          href: "/posts", 
      }] : 
      []),
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
    ]
    setMenuItems(sessionMenuItems)},[session.session,token]);

  return (
    <header className="bg-[#2B428C] text-white fixed m-auto w-[100%] z-50">
      <div className="flex justify-between items-center h-16 bg-[#2B428C] text-white">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 pl-2">
          <div className="relative w-10 h-10">
            <Image
              src="/image/logo-preview.png"
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
            {/* {session.session  ?  <Button onClick={async () => {
              await handleLogout()
              await signOut()
            }}>Logout</Button> : ''} */}
            <span className="text-sm">{session?.session?.user?.username ?? "Username"}</span>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              {/* <User className="w-5 h-5 text-gray-600"/> */}
              <Avatar>
                <AvatarImage src={(!token) ? "" : user?.profileImageURL??""}/>
              </Avatar>
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
              prefetch={true}
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
