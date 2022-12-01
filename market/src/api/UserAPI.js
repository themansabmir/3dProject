import {useEffect, useState} from 'react'
import axios from 'axios'

const UserAPI = (token) => {
const [isLogged, setIsLogged]= useState(false);
const [isAdmin, setIsAdmin]=useState(false);
const [cart,setCart]= useState([])

useEffect(()=>{
    if(token){
        const getUser= async()=>{
            try{
                const res= await axios.get('/user/infor', {
                  headers: {Authorization:token}
                })
                setIsLogged(true)

                if(res.data.role===1) {
                    setIsAdmin(true)
                }else{
                    setIsAdmin(false)
                }
           


            }catch(err){
                alert(err.response.data.msg)
            }
        }

        getUser()
    }
},[token])


const addCart= async (product)=>{
    if(!isLogged) return alert("Please Log in to continue shopping")

    const check=cart.every(item=>{
      return  item._id !== product._id
    })

    if(check){
        setCart([...cart, {...product, quantity:1}])

        await axios.patch('/user/addcart', { cart: [...cart, { ...product, quantity: 1 }] }, {
            headers: {Authorization:token}
        })
    }else{
        alert("This product has already been added")
    }

}

  return {
    isLogged: [isLogged,setIsLogged],
    isAdmin:[isAdmin,setIsAdmin],
    cart:[cart,setCart],
    addCart: addCart
  }
}

export default UserAPI