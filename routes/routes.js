const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const fs = require('fs');

// Image upload setup
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

const upload = multer({
  storage: storage,
}).single('image');

// Route to add user with file upload
router.post('/add', upload, async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.filename
  });
  try {
    await user.save();
    req.session.message = {
      type: 'success',
      message: 'User added successfully!'
    };
    res.redirect('/');
  } catch (err) {
    res.json({ message: err.message, type: 'danger' });
  }
});

// Route to get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.render("index", {
      title: 'Home Page',
      users: users,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Route to render add user page
router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});

// Route to edit user
router.get("/edit/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const user = await User.findById(id);
    if (user == null) {
      res.redirect('/');
    } else {
      res.render("edit_users", {
        title: "Edit User",
        user: user,
      });
    }
  } catch (err) {
    res.redirect('/');
  }
});

// Route to update user
router.post('/update/:id', upload, async (req, res) => {
  let id = req.params.id;
  let new_image = '';
  if (req.file) {
    new_image = req.file.filename;

    try {
      fs.unlinkSync('./uploads/' + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }

  try {
    await User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image,
    });

    req.session.message = {
      type: 'success',
      message: 'User updated successfully!',
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: 'danger' });
  }
});

// Route to delete user
// Route to delete user
router.get('/delete/:id', async (req, res) => {
  let id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (user && user.image != '') {
      try {
        fs.unlinkSync('./uploads/' + user.image);
      } catch (err) {
        console.log(err);
      }
    }
    req.session.message = {
      type: 'info',
      message: 'User deleted successfully!'
    };
    res.redirect('/');
  } catch (err) {
    res.json({ message: err.message, type: 'danger' });
  }
});


module.exports = router;