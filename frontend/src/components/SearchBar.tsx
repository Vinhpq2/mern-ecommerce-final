import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';
import { Link } from 'react-router-dom';
import {useLanguageStore} from "../stores/useLanguageStore";

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null);
    const { fetchProductsBySearch, products } = useProductStore();
    const {t} = useLanguageStore();

    // Debounce search: Chỉ gọi API sau khi ngừng gõ 500ms
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim()) {
                fetchProductsBySearch(searchTerm);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchProductsBySearch]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
            inputRef.current?.focus();
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const term = searchTerm.trim();
        if (!term) return;

    };

    return (
        <div className="relative w-full" ref={searchRef}>
            <form 
                className={`relative w-full md:max-w-sm mx-auto ${isOpen ? 'z-50' : ''}`} 
                onSubmit={handleSubmit}
                onClick={() => !isOpen && setIsOpen(true)}
            >
                <button
                    type="submit"
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${isOpen ? 'hover:text-white' : 'pointer-events-none'}`}
                    aria-label="Search"
                    disabled={!isOpen}
                >
                    <Search size={20} />
                </button>
                
                <input
                    ref={inputRef}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.searchText}
                    readOnly={!isOpen}
                    className={`w-full h-10 bg-gray-800 text-gray-100 placeholder-gray-400 px-4 py-2 pl-10 outline-none rounded-lg border border-gray-700 transition-colors ${
                        isOpen ? 'pr-12 focus:border-emerald-500' : 'cursor-pointer hover:border-emerald-500'
                    }`}
                />

                {isOpen && (
                    <>
                        <button onClick={() => {
                            setIsOpen(false);
                            setSearchTerm('');
                        }}
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-2 text-emerald-300 hover:text-emerald-400"
                            aria-label="Close search" >
                            <X size={18} />
                        </button>
                        {searchTerm && (
                            <div className="fixed left-0 top-full w-full h-[calc(100vh-4rem)] bg-gray-800 border-b border-gray-700 shadow-xl overflow-y-auto z-50 md:absolute md:top-full md:left-0 md:w-full md:max-h-96 md:h-auto md:border-x md:rounded-b-lg md:mt-1">
                                {products && products.length > 0 ? (
                                    products.map((product) => (
                                        <Link
                                            key={product._id}
                                            to={`/product/${product._id}`}
                                            onClick={() => {
                                                setIsOpen(false);
                                                setSearchTerm('');
                                            }}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-none"
                                        >
                                            <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-white truncate">{product.name}</div>
                                                <div className="text-xs text-gray-400 truncate">{product.category}</div>
                                            </div>
                                            <div className="text-sm text-emerald-400 font-medium whitespace-nowrap">
                                                ${product.price}
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-400">
                                        Không tìm thấy sản phẩm nào
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </form>
        </div>
    );
};

export default SearchBar;