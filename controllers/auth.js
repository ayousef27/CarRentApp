//invoking router functionality with express
const router = require('express').Router()
const bcrypt = require('bcrypt')
//because user is related to model db its capital
const User = require('../models/user')
const isSignedIn = require('../middleware/is-signed-in')
const upload = require('../middleware/upload')
//routes/API's/ Controller Functions
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs')
})
router.post('/sign-up', upload, async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (userInDatabase) {
      return res.send('Username already taken')
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('password and confirm password must match ')
    }
    req.body.image = req.file.filename
    //bcrypt for password encryption
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword
    const user = await User.create(req.body)
    res.render('auth/sign-in.ejs')
  } catch (error) {
    console.log(error)
  }
})
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs')
})
router.post('/sign-in', async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (!userInDatabase) {
    return res.send('Login failed try again')
  }
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  )
  if (!validPassword) {
    return res.send('Login failed try again')
  }

  //user exists and password is valid
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  }
  res.redirect('/cars')
})

router.get('/sign-out', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/profile', async (req, res) => {
  try {
    const userId = req.session.user._id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).send('User not found')
    }

    res.render('auth/profile', { user })
  } catch (error) {
    console.log(error)
    res.status(500).send('An error occurred')
  }
})

// POST Profile Update Profile
router.put('/profile', isSignedIn, upload, async (req, res) => {
  try {
    const userId = req.session.user._id
    const { username, email, phone } = req.body
    const image = req.file ? req.file.filename : null
    const updateData = { username, email, phone }
    if (image) {
      updateData.image = image
    }
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true })
    // Update session user data
    req.session.user = { username: user.username, _id: user._id }
    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.redirect('/profile')
  }
})

router.delete('/delete-account', isSignedIn, async (req, res) => {
  const userId = req.session.user._id
  await User.findByIdAndDelete(userId)
  // Destroy the session
  req.session.destroy()
  res.redirect('/')
})
module.exports = router
