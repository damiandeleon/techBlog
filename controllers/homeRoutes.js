const router = require('express').Router();
const { Comment, User, Post } = require('../models');
const withAuth = require('../utils/auth');


router.get('/', async (req, res) => {
  try {
  const postData = await Post.findAll({
      attributes: [
        'id',
        'title',
        'content',
        'created_at'
      ],
      include: [{
        model: Comment,
        attributes: [
          'id',
          'text',
          'post_id',
          'user_id',
          'created_at'],
          include: User,
          attributes: ['username']
      }],
    });
      // Serialize data so the template can read it
      const posts = postData.map((post) => post.get({ plain: true }));

      // Pass serialized data and session flag into template
      res.render('homepage', { 
        posts, 
        logged_in: req.session.logged_in 
      });
  } catch (err) {
    res.status(500).json(err);
  };
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
      res.redirect('/');
      return;
  }
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});


router.get("/post/:id", async (req, res) => {
  try {
    const postData = await Post.findOne(req.params.id, {
      where: {
        id: req.params.id,
      },
      attributes: [
        "id", 
        "title", 
        "content", 
        "created_at"],
      include: [
        {
          model: Comment,
          attributes: [
            "id",
            "text",
            "post_id",
            "user_id",
            "created_at",
          ],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
      ],
    });

    const post = postData.get({ plain: true });
    res.render("singlepost", { post, logged_in: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/posts-comments", async (req, res) => {
  try {
    const postData = await Post.findOne(req.params.id, {
      where: {
        id: req.params.id,
      },
      attributes: [
        "id", 
        "title", 
        "content", 
        "created_at"],
      include: [
        {
          model: Comment,
          attributes: [
            "id",
            "text",
            "post_id",
            "user_id",
            "created_at",
          ],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
      ],
    });

    const post = postData.get({ plain: true });
    res.render("posts-comments", { post, logged_in: true });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
