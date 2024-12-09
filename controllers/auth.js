//invoking router functionality with express
const router = require('express').Router()
const bcrypt = require('bcrypt')
const isSignedIn = require('../middleware/is-signed-in')
const upload = require('../middleware/upload')
const User = require('../models/user')
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

    //bcrypt for password encryption
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword
    const user = await User.create(req.body)
    res.send(`THANKS FOR SIGNING UP ${user.username}`)
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
  res.redirect('/')
})
router.get('/sign-out', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/profile', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id)
    res.render('auth/profile.ejs', { user })
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})
router.post('/profile', isSignedIn, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.session.user._id,
      {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone
      },
      { new: true }
    )
    // Update session user data
    req.session.user = { username: user.username, _id: user._id }
    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.redirect('/profile')
  }
})

router.delete('/delete-account', isSignedIn, async (req, res) => {
  try {
    const userId = req.session.user._id
    await User.findByIdAndDelete(userId)
    // Destroy the session
    req.session.destroy()
    res.redirect('/')
  } catch (error) {
    console.error('Error deleting account:', error)
    res.redirect('/profile')
  }
})

module.exports = router
