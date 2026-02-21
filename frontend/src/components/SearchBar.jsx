import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";
import { Search, X } from "lucide-react";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if(location.pathname.includes('collection') && showSearch){
      setVisible(true);
    }
    else{
      setVisible(false);
    }
  }, [location])

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 text-center relative z-10 shadow-sm">
      <div className="inline-flex items-center justify-center border border-gray-300 px-5 py-2.5 my-5 mx-3 rounded-full bg-white hover:border-indigo-600 transition-colors w-full max-w-lg">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm text-gray-700"
          type="text"
          placeholder="Search..."
        />
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <X
        onClick={() => setShowSearch(false)}
        className="inline w-6 h-6 cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors absolute right-5 top-1/2 -translate-y-1/2"
      />
    </div>
  ) : null;
};

export default SearchBar;