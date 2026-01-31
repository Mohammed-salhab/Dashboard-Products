import React from 'react';

const Navbar = ({tab, user}) => {
  return (
    <div className="w-full flex justify-between items-center pl-12 md:pl-0 bg-white p-3 sm:p-5">
      <div>
        <h2 className="font-semibold text-sm sm:text-base">{tab}</h2>
      </div>
      <div className="flex items-center gap-2">
        <img
        src={user?.profile_image_url}
          alt={user?.user_name}
          className="w-8 sm:w-10 h-8 sm:h-10 object-cover rounded-full"
        />
        <div className="mr-4 text-[#565656]">
          <p className="font-bold text-xs sm:text-sm truncate">{user?.first_name}{" "}{user?.last_name}</p>
          <p className="font-semibold text-[#565656] text-[10px]">{user?.user_name}</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
