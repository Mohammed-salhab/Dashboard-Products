import React from 'react'
import ProductRow from './ProductRow'

const ProductsTable = ({ products, onEdit, onDelete, onAddClick }) => {
  return (
    <div className='p-3 sm:p-5'>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-[28px] font-bold">Manage Products</h1>
        <button 
          className="bg-[#4880FF] text-white font-semibold text-xs py-2 px-4 rounded w-full sm:w-auto" 
          onClick={onAddClick}
        >
        + Add Product
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-5 overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className='font-bold text-xs sm:text-sm'>
            <tr className="border-b">
              <th className="text-left p-2 sm:p-3">#</th>
              <th className="text-left p-2 sm:p-3">Product Name</th>
              <th className="text-left p-2 sm:p-3">Price</th>
              <th className="text-left p-2 sm:p-3">Image</th>
              <th className="text-left p-2 sm:p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductRow 
                key={product.id} 
                product={product} 
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductsTable