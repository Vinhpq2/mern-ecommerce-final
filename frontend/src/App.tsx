import {Navigate,Route, Routes} from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import CategoryPage from './pages/CategoryPage'
import Navbar from './components/Navbar'
import {useUserStore} from './stores/useUserStore';
import {useCartStore} from './stores/useCartStore';
import {useEffect} from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import AdminPage from './pages/AdminPage';
import CartPage from './pages/CartPage'
import PurchaseSuccessPage from './pages/PurchaseSuccessPage';
import PurchaseCancelPage from './pages/PurchaseCancelPage';
import CameraAuthentication from './pages/AuthenticationPage';
import LivestreamPage from './pages/LivestreamPage';
import VideoListPage from './pages/VideoListPage';
import ProductInfo from './pages/ProductInfo';
import Livestream from './pages/Livestream';
import Viewer from './pages/Viewer';
import ProtectedFaceAuthRoute from './components/ProtectedFaceAuthRoute';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
function App() {

  const {user,checkAuth,checkingAuth} = useUserStore();
  const {getCartItems} = useCartStore();
  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  useEffect(()=>{
    if(!user) return;
    getCartItems()
    },[getCartItems,user]);

  if(checkingAuth)
    return <LoadingSpinner />

  return (
  <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
    {/* Thêm pointer-events-none để click xuyên qua lớp nền này */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full 
        bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]"/>    
      </div>
      </div>
    <div className="relative z-50">
    <Navbar />
    </div>
    {/* Thêm padding-top ở đây để đẩy nội dung xuống dưới Navbar */}
    <div className="pt-20 px-4 sm:px-6 lg:px-8">
      <Routes>
        <Route path ='/' element ={<HomePage />} />
        <Route path ='/signup' element ={!user ? <SignUpPage />  : <Navigate to ="/"/>}/>
        <Route path ='/login' element ={!user ? <LoginPage /> : <Navigate to ="/"/>} />
        <Route path='/face-authentication' element ={user?.role === 'admin' ? <CameraAuthentication/> : <Navigate to ="/login"/>}/>
        <Route path='/admin' element ={user?.role === 'admin' ? <AdminPage/> : <Navigate to ="/login"/>}/>
        <Route path='/profile' element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path='/category/:category' element={<CategoryPage/>} />
        <Route path='/cart' element={user ? <CartPage/> : <Navigate to ="/login"/>} />
        <Route path='/purchase-success' element={user ? <PurchaseSuccessPage/> : <Navigate to ="/login"/>} />
        <Route path='/purchase-cancel' element={user ? <PurchaseCancelPage/> : <Navigate to ="/login"/>} />
        <Route path="/video-list" element ={user ? <VideoListPage/> : <Navigate to ="/login"/>} />
        <Route path='/product/:id' element={<ProductInfo />} />
        <Route path="/livestream" element={<ProtectedFaceAuthRoute><Livestream /></ProtectedFaceAuthRoute>} />
        <Route path="/viewer" element={user ? <Viewer /> : <Navigate to="/login" />} />
        <Route path="/live/:id" element={user ? <Viewer /> : <Navigate to="/login" />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  </div>

  )
}

export default App
