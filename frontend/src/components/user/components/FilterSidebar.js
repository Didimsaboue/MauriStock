import React, { useState, useEffect } from "react";
import "../../../styles/FilterSidebar.css";

const FilterSidebar = ({
  categories = [],
  subcategories = [],
  companies = [],
  onFilterChange,
}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [hasDiscount, setHasDiscount] = useState(false);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategories((prevSelected) =>
      prevSelected.includes(subcategoryId)
        ? prevSelected.filter((id) => id !== subcategoryId)
        : [...prevSelected, subcategoryId]
    );
  };

  const handleCompanyChange = (companyId) => {
    setSelectedCompanies((prevSelected) =>
      prevSelected.includes(companyId)
        ? prevSelected.filter((id) => id !== companyId)
        : [...prevSelected, companyId]
    );
  };

  const handlePriceChange = (type, value) => {
    if (value === "" || /^\d*$/.test(value)) {
      setPriceRange((prev) => ({
        ...prev,
        [type]: value,
      }));
    }
  };

  const applyFilter = () => {
    const filters = {
      categories: selectedCategories,
      subcategories: selectedSubcategories,
      companies: selectedCompanies,
      minPrice: priceRange.min ? parseInt(priceRange.min, 10) : undefined,
      maxPrice: priceRange.max ? parseInt(priceRange.max, 10) : undefined,
      hasDiscount,
    };
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedCompanies([]);
    setPriceRange({ min: "", max: "" });
    setHasDiscount(false);
    onFilterChange({});
  };

  return (
    <div className="filter-content">
      <div className="category-filter mb-4">
        <h6>Catégories ({categories.length})</h6>
        {categories.map((cat) => (
          <div key={cat._id} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={`cat-${cat._id}`}
              checked={selectedCategories.includes(cat._id)}
              onChange={() => handleCategoryChange(cat._id)}
            />
            <label className="form-check-label" htmlFor={`cat-${cat._id}`}>
              {cat.nom || cat.name}
            </label>
          </div>
        ))}
      </div>

      <div className="subcategory-filter mb-4">
        <h6>Sous-catégories ({subcategories.length})</h6>
        {subcategories.map((sub) => (
          <div key={sub._id} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={`sub-${sub._id}`}
              checked={selectedSubcategories.includes(sub._id)}
              onChange={() => handleSubcategoryChange(sub._id)}
            />
            <label className="form-check-label" htmlFor={`sub-${sub._id}`}>
              {sub.nom || sub.name}
            </label>
          </div>
        ))}
      </div>

      <div className="company-filter mb-4">
        <h6>Entreprises ({companies.length})</h6>
        {companies.map((comp) => (
          <div key={comp._id} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={`comp-${comp._id}`}
              checked={selectedCompanies.includes(comp._id)}
              onChange={() => handleCompanyChange(comp._id)}
            />
            <label className="form-check-label" htmlFor={`comp-${comp._id}`}>
              {comp.nom || comp.name}
            </label>
          </div>
        ))}
      </div>

      <div className="price-filter mb-4">
        <h6>Prix</h6>
        <div className="price-inputs d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Min €"
            value={priceRange.min}
            onChange={(e) => handlePriceChange("min", e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Max €"
            value={priceRange.max}
            onChange={(e) => handlePriceChange("max", e.target.value)}
          />
        </div>
      </div>

      <div className="filter-actions mt-4">
        <button className="btn btn-outline-secondary me-2" onClick={clearFilters}>
          Tout effacer
        </button>
        <button className="btn btn-primary" onClick={applyFilter}>
          Appliquer
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
