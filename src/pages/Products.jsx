import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ProductsTable from '../components/ProductsTable';
import AddProduct from '../components/AddProduct';
import ActionPopup from '../components/Actionpopup';

const Products = () => {
  const [view, setView] = useState('view');
  const [modal, setModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null; 

  // Function to Fetch Products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://vica.website/api/items', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      });
      // Map API response to match your component's expected structure
      // API returns "image_url", component expects "image"
      const mappedProducts = response.data.map(item => ({
        ...item,
        price: parseFloat(item.price), // Ensure price is a number
        image: item.image_url // Map the key
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount and whenever returning to 'view' mode (to refresh data after add/edit)
  useEffect(() => {
    if (view === 'view') {
      fetchProducts();
    }
  }, [view]);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setView('edit');
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setView('add');
  };

  const handleDeleteProduct = (productId) => {
    setSelectedProduct(productId); // Temporarily store ID to delete
    setModal(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      try {
        await axios.delete(`https://vica.website/api/items/${selectedProduct}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
          },
        });
        
        // Remove from local state immediately for UI responsiveness
        setProducts(products.filter(p => p.id !== selectedProduct));
        console.log("Item deleted successfully");
        
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      } finally {
        setModal(false);
        setSelectedProduct(null);
      }
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row bg-[#F5F6FA] min-h-screen">
      <div className='w-64 shrink-0'>
        <Sidebar tab={'products'} />
      </div>
      <div className='grow w-full space-y-6 md:pl-0'>
        <Navbar tab={view === 'view' ? 'Products' : view === 'add' ? 'Products/Add' : view === 'edit' ? 'Products/Edit' : ''} user={user}/>
        
        {view === 'view' ? (
          isLoading ? (
            <div className="text-center my-80 p-10"><i className="fas fa-spinner fa-spin text-6xl text-[#4880FF]"></i></div>
          ) : (
            <ProductsTable 
              products={products} 
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onAddClick={handleAddProduct}
            />
          )
        ) : view === 'add' ? (
          <AddProduct setView={setView} />
        ) : view === 'edit' ? (
          <AddProduct setView={setView} product={selectedProduct} isEditing={true} />
        ) : ''}
      </div>
      
      {modal && (
        <ActionPopup 
          text={'Are you sure you want to delete this product?'} 
          setModal={setModal}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default Products;