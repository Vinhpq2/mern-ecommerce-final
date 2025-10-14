import {ShoppingCart, UserPlus,LogIn,LogOut,Lock,Globe} from 'lucide-react';
import { Link } from 'react-router-dom';
import {useUserStore} from '../stores/useUserStore';
import {useCartStore} from '../stores/useCartStore';
import { useLanguageStore } from "../stores/useLanguagesStore";

const Navbar = () => {

  const {user,logout} = useUserStore(); 
  const isAdmin = user?.role === 'admin';
  const {cart} = useCartStore();

   const { t, lang, setLang } = useLanguageStore();

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md 
    shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex">
        E-commerce</Link>
        <nav className="flex flex-wrap items-center gap-4">
          <Link to={"/"} className="">
          {t.home}</Link>
          {user && (
            <Link to={"/cart"} className="relative group">
              <ShoppingCart className="inline-block mr-1 group-hover:text-emerald-400" size={20}/>
              <span className="sm:inline">{t.cart}</span>
              {cart.length > 0 && <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                {cart.length}
              </span>}
            </Link>
          )}

          {isAdmin && (
            <Link to={"/secret-dashboard"} className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
            >
              <Lock className="inline-block mr-1" size={18}/>
              <span className="hidden sm:inline">{t.dashboard}</span>
            </Link>
          )} 

          {user ?(
            <button className="bg-gray-700 hover:gray-600 text-while py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
            onClick={logout}>
              <LogOut size={18}/>
              <span className="hidden sm:inline ml-2">{t.logout}</span>
            </button>)
            :
            (
              <>
            <Link to={"/signup"} className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
              <UserPlus className="mr-2" size={18}/>
              {t.signup}
            </Link>
            <Link to={"/login"} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transtion duration-300 ease-in-out">
              <LogIn className="mr-2" size={18} />
              {t.login}
            </Link>
            </>)}
          <div className="flex items-center space-x-2">
          <button
            onClick={() => setLang(lang === "vi" ? "en" : "vi")}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 
                      text-white py-2 px-4 rounded-md font-medium transition duration-300 ease-in-out">
            <Globe size={18} className="opacity-90" />
            {lang === "vi" ? "English" : "Tiếng Việt"}
          </button>
        </div>
        </nav>
        </div>
      </div>
    </header>

  )
}
export default Navbar