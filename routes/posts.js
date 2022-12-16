const express = require('express');
const Posts = require("../schemas/post");
const router = express.Router();

router.get("/posts", async (req, res) => {
    const posts = await Posts.find();
    
	res.json({ posts });
});


// let detail = null;
// for (const good of goods) {
//     if (Number(goodsId) === good.goodsId) {
//         detail = good;
//     }
// // }

// router.get("/posts/:goodsId", (req, res) => {
// 	const { goodsId } = req.params;
// 	const [detail] = posts.filter((posts) => posts.goodsId === Number(goodsId));
// 	res.json({ detail });
// });

router.post("/posts", async (req, res) => {
	const { user, password, title, content } = req.body;
  const createdPosts = await Posts.create({ user, password, title, content });

  res.json({ posts: createdPosts });
});

module.exports = router;