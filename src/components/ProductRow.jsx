import React from 'react';

const ProductRow = ({ product, onEdit, onDelete }) => {
  return (
    <tr className="border-b text-xs sm:text-sm font-semibold hover:bg-gray-50">
      <td className="p-2 sm:p-3">{product.id}</td>
      <td className="p-2 sm:p-3 truncate">{product.name}</td>
      <td className="p-2 sm:p-3">${product.price.toFixed(2)}</td>
      <td className="p-2 sm:p-3">
        <img src={product.image} alt={product.name} className="w-8 sm:w-10 h-8 sm:h-10 object-cover rounded-lg" />
      </td>
      <td className="p-2 sm:p-3">
        <div className="flex gap-2">
          <button className="text-[#4880FF] hover:text-[#4880FF]/75 text-sm sm:text-base" onClick={() => onEdit(product)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="text-[#EF3826] hover:text-[#EF3826]/75 text-sm sm:text-base" onClick={() => onDelete(product.id)}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
