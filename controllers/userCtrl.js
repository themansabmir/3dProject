const Users = require('../models/userModel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



const userCtrl = {
    //registration
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const user = await Users.findOne({ email })
            if (user) return res.status(400).json({ msg: "The email already exists." })

            if (password.length < 6)
                return res.status(400).json({ msg: "Password is at least 6 characters long." })

            //PASSWORD ENCRYPTION
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, email, password: passwordHash
            })
            //saving user
            await newUser.save()

            //creating authentication using jwt
            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })


            res.json({ accesstoken })


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    //log in user
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "User Doesn't exist" })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Incorrect email or password" })
            // if login successfull then create token and refresh
            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })


            res.json({ accesstoken })



        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },
    //logout
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "logged out" })
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }



    },
    //refreshing token
    refreshToken: (req, res) => {
        try {

            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please Login or Register" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please Login or Register" })

                const accesstoken = createAccessToken({ id: user.id })

                res.json({ accesstoken })
            })



        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }




    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if (!user) return res.status(400).json({ msg: "User doesn't exist" })

            res.json(user)
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    addCart: async(req,res)=>{
        try{
            const user = Users.findById(req.user.id)
            if(!user ) return res.status(400).json({msg: "User doesn't exist"})

            await Users.findOneAndUpdate({_id: req.user.id},{
                cart: req.body.cart
            })
            return res.json({msg: "Added to cart"})

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    }
}

// creating token function
const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}
// refreshing token function
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl