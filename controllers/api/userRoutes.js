const router = require('express').Router();
const { User, Post } = require('../../models');
const { route } = require('./postRoutes');

//pull users without passwords
router.get('/', async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ['password'] }
    })
    res.status(200).json(userData);
  } catch(err) {
    res.status(400).json(err);
  }
});

//pull single user without passwords

route.get('/:id', async (req, res) => {
  try {
    const userData = await User.findOne({
      attributes: { exclude: ['password']},
      where: {
        id: req.params.id
      },
      include: [{
          model: Post,
          attributes: [
            'id',
            'title',
            'content',
            'created_at'
          ]
        },
        {
          model: Comment,
          attributes: [
            'id',
            'text',
            'created_at'],
            include: {
              model: Post,
              attributes: ['title']
            }
        },
        {
          model: Post,
          attributes: ['title'],
        }
      ]
    })
    res.status(200).json(userData);
  } catch(err) {
    res.status(400).json(err);
  }
})

//post to create a new User
router.post('/', async (req, res) => {
  try {
    const userData = await User.create({
      username: req.body.username,
      password: req.body.password
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});


//post User at login
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { username: req.body.username } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'No user with that username. Please try again.' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect password.  Please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

//delete a User 
router.delete('/:id', async (req, res) => {
  try {
    const userData = await User.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(userData);
  } catch(er) {
    res.status(400).json(err);
  }
});

//logout
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
