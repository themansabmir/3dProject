import React,{useContext} from 'react'
import { Routes, Route } from 'react-router-dom'
import Products from './products/Product'
import Login from './auth/Login'
import Register from './auth/Register'
import Cart from './cart/Cart'
import NotFound from './utils/NotFound/NotFound'
import DetailProduct from './detailProduct/DetailProduct'
import {GlobalState} from '../../GlobalState'
import Categories from './categories/Categories'
import CreateProduct from './createProduct/CreateProduct'


function Pages() {
  const state=useContext(GlobalState)
  const [isLogged]= state.userAPI.isLogged
  const [isAdmin]= state.userAPI.isAdmin

  return (
    <Routes>

      <Route path="/"  element={<Products />} />

      <Route path="/details/:id"  element={<DetailProduct />} />


      <Route path="/login"  element={isLogged ? "Not Found":  <Login/>} />
      <Route path="/register" element={isLogged ? "Not Found" :  <Register/>} />

      <Route path="/category" element={isAdmin ? <Categories/> : <NotFound/>} /> 
      <Route path="/create_product" element={isAdmin ? <CreateProduct/> : <NotFound/>} /> 
      <Route path="/edit_product/:id" element={isAdmin ? <CreateProduct /> : <NotFound />} /> 

      <Route path="/cart"  element={<Cart/>} />
      <Route path="/*"  element={<NotFound/>} />
    </Routes>


  )
}

export default Pages

