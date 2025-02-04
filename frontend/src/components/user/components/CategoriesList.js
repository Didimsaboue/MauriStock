import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../../styles/CategoriesList.css";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Catégories</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {categories.map((category) => (
          <div className="col" key={category._id}>
            <div className="category-card">
              <img
                src={category.imageUrl || "https://via.placeholder.com/150"}
                alt={category.name}
                className="category-image img-fluid"
              />
              <div className="category-overlay">
              </div>
              <Link
                to={`/categories/${category._id}`}
                className="stretched-link"
                aria-label={`Voir les détails de ${category.name}`}
              ></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
