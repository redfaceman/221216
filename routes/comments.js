const express = require("express");
const Posts = require("../schemas/post");
const Comment = require("../schemas/comment");
const router = express.Router();

router.get("/comments", async (req, res) => {
  const comments = await Comment.find();
  const goodsIds = comments.map((comment) => comment.goodsId);

  const posts = await Posts.find({ goodsId: goodsIds });
  // Posts에 해당하는 모든 정보를 가지고 올건데,
  // 만약 goodsids 변수 안에 존재하는 값일 때에만 조회하라.

  const results = comments.map((comment) => {
		return {
			quantity: comment.quantity,
			posts: posts.find((item) => item.goodsId === comment.goodsId)
		};
  });

  res.json({
    comments: results,
  });
});

router.post("/posts/:goodsId/comment", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsComments = await Comment.find({ goodsId: Number(goodsId) });
  if (existsComments.length) {
    return res.json({ success: false, errorMessage: "이미 장바구니에 존재하는 상품입니다." });
  }

  await Comment.create({ goodsId: Number(goodsId), quantity: quantity });

  res.json({ result: "success" });
});

router.put("/posts/:goodsId/comment", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsComments = await Comment.find({ goodsId: Number(goodsId) });
  if (existsComments.length) {
    await Comment.updateOne({ goodsId: Number(goodsId) }, { $set: { quantity } });
  }

  res.json({ success: true });
})

router.delete("/posts/:goodsId/comment", async (req, res) => {
  const { goodsId } = req.params;

  const existsComments = await Comment.find({ goodsId });
  if (existsComments.length > 0) {
    await Comment.deleteOne({ goodsId });
  }

  res.json({ result: "success" });
});

module.exports = router;