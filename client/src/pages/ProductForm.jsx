import { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import API from "../Axios/axiosInstance";

const ProductForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null); // Reference for file input

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setMessage("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("image", selectedFile);

    try {
      const response = await API.post("/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setMessage("Product added successfully!");
        setShowModal(true);

        // Reset form fields
        setName("");
        setPrice("");
        setCategory("");
        setDescription("");
        setStock("");
        setSelectedFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setMessage(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Failed to add product");
    }
  };

  return (
    <div className="container">
      <h2>Add Product</h2>

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Category</label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Nutraj">Nutraj</option>
            <option value="Ministry Of Nuts">Ministry Of Nuts</option>
            <option value="Solimo">Solimo</option>
            <option value="Farmley">Farmley</option>
            <option value="Happilo">Happilo</option>
            <option value="True Elements">True Elements</option>
            <option value="Urban Platter">Urban Platter</option>
            <option value="Tulsi">Tulsi</option>
            <option value="Nutty Gritties">Nutty Gritties</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Upload Image</label>
          <input
            ref={fileInputRef}
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="col-12">
          <button style={{ width: "140px" }} type="submit" className="btn btn-primary">
            Add Product
          </button>
        </div>
      </form>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Product has been added successfully!</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
