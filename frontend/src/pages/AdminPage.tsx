import {BarChart,PlusCircle,ShoppingBasket,LayoutList, TicketPercent} from "lucide-react";
import {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import AnalyticsTab from "../components/AnalyticsTab";
import VideoTab from "../components/VideoTab";
import CouponTab from "../components/CouponTab";
import { useProductStore } from "../stores/useProductStore";
import { useLanguageStore } from "../stores/useLanguageStore";

const AdminPage = () => {
    const [activeTab,setActiveTab] = useState("create");
    const {fetchAllProducts} = useProductStore();
    const {t} = useLanguageStore();
    
    const tabs = [
    {id:"create",label:t.createProduct,icon:PlusCircle},
    {id:"products",label:t.products,icon:ShoppingBasket},
    {id:"analytics",label:t.analytic,icon:BarChart},
     {id:"video",label:t.videoConsole,icon:LayoutList},
     {id:"coupons",label:t.coupons,icon:TicketPercent},
]
    
    useEffect(() =>{
        fetchAllProducts();
    },[fetchAllProducts]);
  return (
    <div className="min-h-screen relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-16">
            <motion.h1 
                className="text-4xl font-bold mb-8 text-emerald-400 text-center"
                initial={{opacity:0,y:-20}}
                animate={{opacity:1,y:0}}
                transition={{duration:0.8}}>
                   {t.adminDashboard}
                </motion.h1>
                <div className="flex justify-center mb-8">
                    {tabs.map((tab)=>(
                        <button 
                        key={tab.id}
                        onClick={()=>setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 
                            ${activeTab === tab.id ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                                <tab.icon className="mr-2 h-5 w-5"/>
                                {tab.label}
                            </button>
                    ))}
                </div>
                {activeTab ==="create" && <CreateProductForm/>}
                {activeTab === "products" && <ProductsList/>}
                {activeTab === "analytics" && <AnalyticsTab/>}
                {activeTab === "video" && <VideoTab/>}
                {activeTab === "coupons" && <CouponTab/>}

        </div>
    
    </div>
  )}
export default AdminPage