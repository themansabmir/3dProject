import React, { useContext, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import './detailProduct.css'
import ProductItem from '../utils/productItem/productItem'




function DetailProduct() {

    const [exposure, setExposure] = useState(0.4)
    const [shadow, setShadow] = useState(0.4)




    const params = useParams()

    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const [detailProduct, setDetailProduct] = useState([])

    useEffect(() => {
        if (params) {
            products.forEach((product) => {
                if (product._id === params.id) {
                    setDetailProduct(product)
                }
            })
        }
    }, [params, products])
    if (detailProduct.length === 0) return null;




    return (
        <div className="detail">
            <div className="modelViewer">


            <model-viewer   src={detailProduct.images.url} ar shadow-intensity="1" camera-controls touch-action="pan-y"></model-viewer>
            </div>
          
            <div className="box-detail">
                <div className="row">
                    
                    <h2>{detailProduct.title}</h2>
                    <h6>#id: {detailProduct.product_id}</h6>
                </div>
                <span>$ {detailProduct.price}</span>
                <p>{detailProduct.description}</p>
                <p>{detailProduct.content}</p>
                <p>Sold: {detailProduct.sold}</p>
                <Link to="/cart" className="cart">
                    Buy Now
                </Link>


                

            </div>
            {/* <div>
                <h2>Related Products</h2>
                <div className='products'>
                    {products.map(prod=>{
                        return prod.category== detailProduct.category
                        ? <ProductItem key={prod._id} product={prod}/>: null
                    })}
                </div>
            </div> */}

            
          


        </div>
    )
}

export default DetailProduct