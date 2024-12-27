import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';

export default function DiscountManagement() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [discountDuration, setDiscountDuration] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      const currentDate = new Date();

      // Filtre: Zaten indirimde olan ürünleri çıkar
      const availableProducts = response.data.filter((product) => {
        if (!product.discountDuration) return true; // İndirim süresi yoksa listede göster
        const discountEndDate = new Date(product.discountDuration);
        return discountEndDate < currentDate; // İndirim süresi dolmuşsa göster
      });

      setProducts(availableProducts);
    } catch (error) {
      console.error('Failed to load products', error);
    }
  };

  const calculateDiscountPrice = (oldPrice) => {
    if (!discountPercentage || isNaN(discountPercentage)) return oldPrice;
    return (oldPrice - (oldPrice * discountPercentage) / 100).toFixed(2);
  };

  const handleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId) // Deselect if already selected
        : [...prev, productId] // Add if not selected
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (selectedProducts.length === 0) {
      setMessage('Veuillez sélectionner au moins un produit.');
      return;
    }

    if (!discountDuration) {
      setMessage('Veuillez définir une durée de remise.');
      return;
    }

    try {
      await Promise.all(
        selectedProducts.map((productId) =>
          api.put(`/products/${productId}/discount`, {
            discountedPrice: calculateDiscountPrice(
              products.find((product) => product._id === productId).oldPrice
            ),
            discountDuration, // Kullanıcının seçtiği tarih
          })
        )
      );

      setMessage('La remise a été appliquée avec succès pour les produits sélectionnés.');
      setSelectedProducts([]);
      setDiscountPercentage('');
      setDiscountDuration('');
      fetchProducts(); // Refresh product data
    } catch (error) {
      console.error('Error applying discounts:', error);
      setMessage('Une erreur est survenue lors de l\'application de la remise.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Gestion des remises</h2>

      {message && (
        <div
          className={`p-4 rounded ${
            message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pourcentage de remise</label>
          <input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            placeholder="Exemple : 50 pour 50%"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date d'expiration de la remise</label>
          <input
            type="date"
            value={discountDuration}
            onChange={(e) => setDiscountDuration(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductSelection(product._id)}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedProducts.includes(product._id)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >
              <img
                src={`http://localhost:5000${product.picture}`}
                alt={product.nom}
                className="h-20 w-20 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-bold">{product.nom}</h3>
              <p className="text-gray-600">Prix original : {product.oldPrice} €</p>
              <p className="text-gray-800">
                Prix avec remise :{' '}
                <span className="text-green-600 font-bold">
                  {calculateDiscountPrice(product.oldPrice)} €
                </span>
              </p>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Appliquer la remise
        </button>
      </form>
    </div>
  );
}
