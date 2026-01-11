import {ShoppingCart, UserPlus,LogIn,LogOut,Lock,Globe,ScrollText,Video,Store} from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import {useUserStore} from '../stores/useUserStore';
import {useCartStore} from '../stores/useCartStore';
import { useLanguageStore } from "../stores/useLanguageStore";
import { useState } from 'react';


const Navbar = () => {

  const {user,logout} = useUserStore(); 
  const isAdmin = user?.role === 'admin';
  const {cart} = useCartStore();
  const [videoOpen, setVideoOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

   const { t, lang, setLang } = useLanguageStore();

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md 
    shadow-lg z-40 transition-all duration-300 border-b border-emerald-800 overflow-visible">
      <div className="container mx-auto px-2 py-2 sm:px-4 sm:py-3">
      <div className="flex items-center gap-x-2 lg:gap-x-4">
        <Link to="/" className="flex-shrink-0 text-xl sm:text-2xl font-bold text-emerald-400 items-center space-x-2 flex">
            <Store size={24} className="text-emerald-400" />
          <span className="hidden lg:inline">E-commerce</span>
        </Link>
        <div className="flex-1 min-w-0">
          {user && <SearchBar />}
        </div>
        <nav className="flex-shrink-0 flex items-center gap-2 lg:gap-4">
          <Link to={"/"} className="flex items-center">
            <span className="hidden lg:inline">{t.home}</span>
          </Link>
          {user && (
            <Link to={"/cart"} className="relative group">
              <ShoppingCart className="inline-block mr-1 group-hover:text-emerald-400" size={20}/>
              {/* <span className="hidden sm:inline">{t.cart}</span> */}
              {cart.length > 0 && <span className="absolute -top-2 -left-2 bg-emerald-500 text-white 
              rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                {cart.length}
              </span>}
            </Link>
          )}
         
          {user && (
            <div className="relative group">
              <button
                onClick={() => { setVideoOpen(!videoOpen); setUserOpen(false); setLoginOpen(false); }}
                aria-haspopup="true"
                aria-expanded={videoOpen}
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center">
                <ScrollText className="inline-block mr-1" size={18} />
                <span className="hidden lg:inline">Video</span>
              </button>

              <div className={`absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg transition-all duration-150 z-50 ${videoOpen || 'opacity-0 invisible'} group-hover:opacity-100 group-hover:visible transform -translate-y-1 group-hover:translate-y-0`}>
                <Link to="/video-list" onClick={() => setVideoOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 text-white">
                  <ScrollText size={16} /> Video List
                </Link>
                {isAdmin && (
                  <Link to="/face-authentication" onClick={() => setVideoOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 text-white rounded-b-md">
                    <Video size={16} /> Livestream
                  </Link>
                )}
              </div>
            </div>
          )}
          {user ? (
            <div className="relative group">
              <button
                onClick={() => { setUserOpen(!userOpen); setVideoOpen(false); setLoginOpen(false); }}
                aria-haspopup="true"
                aria-expanded={userOpen}
                className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 sm:py-2 sm:px-4 rounded-md flex items-center transition duration-300 ease-in-out">
                <LogOut size={18} />
                <span className="font-medium ml-2 truncate max-w-[8rem]">{user.name ?? user.email}</span>
                
              </button>

              <div className={`absolute left-0 mt-2 w-fit bg-gray-800 rounded-md shadow-lg transition-all duration-150 z-50 ${userOpen || 'opacity-0 invisible'} group-hover:opacity-100 group-hover:visible transform -translate-y-1 group-hover:translate-y-0`}>
                <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                  <div className="truncate">{user.email}</div>
                </div>
                <Link to="/profile" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 text-white">
                  <UserPlus size={16} /> {t.profile ?? "Profile"}
                </Link>
                <button
                  onClick={() => { logout(); setUserOpen(false); }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-emerald-700 text-white rounded-b-md">
                  <LogOut size={16} /> {t.logout}
                </button>
              </div>
            </div>
          )
            :
            (
              <>
            <div className="relative group">
              <button
                onClick={() => { setLoginOpen(!loginOpen); setVideoOpen(false); setUserOpen(false); }}
                aria-haspopup="true"
                aria-expanded={loginOpen}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-3 sm:py-2 sm:px-4 rounded-md 
                flex items-center transition duration-300 ease-in-out">
                <UserPlus className="mr-2" size={18} />
                <span className="hidden lg:inline">{t.login}</span>
              </button>

              <div className={`absolute left-0 mt-2 w-fit bg-gray-800 rounded-md shadow-lg transition-all duration-150 z-50 ${loginOpen || 'opacity-0 invisible'} group-hover:opacity-100 group-hover:visible transform -translate-y-1 group-hover:translate-y-0`}>
                <Link to="/login" onClick={() => setLoginOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-emerald-700 text-white rounded-b-md">
                  <LogIn size={16} /> {t.login}
                </Link>
                <Link to="/signup" onClick={() => setLoginOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-emerald-700 text-white rounded-b-md">
                  <UserPlus size={16} /> {t.signup}
                </Link>
              </div>
            </div>
            </>)}
          <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={() => setLang(lang === "vi" ? "en" : "vi")}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 
                      text-white py-1 px-3 sm:py-2 sm:px-4 rounded-md font-medium transition duration-300 ease-in-out">
            <Globe size={18} className="opacity-90" />
            <span className="hidden lg:inline">{lang === "vi" ? "English" : "Tiếng Việt"}</span>
          </button>
        </div>
        </nav>
      </div>
    </div>
  </header>

  )
}
export default Navbar