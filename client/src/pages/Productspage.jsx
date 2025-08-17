import React from 'react'
import '../style/Products.css'
import ProductList from '../components/ProductList/ProductList'


export const ProductsPage = () => {
  return (
    <div className='contnaier'>
      {/* <div className='purp'>
          <h1>Enjoy Our Purposefuel</h1>
      </div> */}
      <ProductList/>
    </div>
  )
}
export default ProductsPage;
