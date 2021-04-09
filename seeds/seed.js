const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./userData');
const postData = require('./postData');
const commentData = require('./commentData');
const { post } = require('../controllers');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    for (const post of postData) {
        await Post.create({
            ...post,
        });
    }

    for (const comment of commentData) {
        await Comment.create({
            ...comment,
        });
    }

    process.exit(0);
};

seedDatabase();