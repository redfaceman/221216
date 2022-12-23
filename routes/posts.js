const express = require('express');
const Posts = require("../schemas/post.js");
const router = express.Router();

router.get('/posts', async (req, res) => {
  const posts = await Posts.find({}, {title:1, user:1})
  res.status(200).json({data : posts})
})

// router.get("/posts/:_Id", (req, res) => {
// 	const { _Id } = req.params;
// 	const [detail] = Posts.filter((Posts) => Posts._Id === Number(_Id));
// 	res.json({ detail });
// });

router.post("/posts", async (req, res) => {
	const { user, password, title, content } = req.body;
  const createdPosts = await Posts.create({ user, password, title, content });

  res.json({ posts: createdPosts });
});

module.exports = router;