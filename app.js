const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;

const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const connect = require("./schemas");
connect();

app.use(express.json());
// localhost:3000/api -> postsRouter
app.use("/api", [postsRouter, commentsRouter]);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const jwt = require("jsonwebtoken");
const User = require("./schemas/users.js");

// 회원가입 API
router.post("/users", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

  // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findOne({
    $or: [{ email }, { nickname }],
  });
  if (existsUsers) {
    // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다.
    //  https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
    res.status(400).send({
      errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
    });
    return;
  }

  const user = new User({ email, nickname, password });
  await user.save();

  res.status(201).send({});
});

// 로그인 API
router.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
  if (!user || password !== user.password) {
    res.status(400).send({
      errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
    });
    return;
  }

  res.send({
    token: jwt.sign({ userId: user.userId }, "customized-secret-key"),
  });
});

const authMiddleware = require("./middleware/auth-middleware.js");

router.get("/users/me", authMiddleware, async (req, res) => {
  res.send({ user: res.locals.user });
});

app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));


app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});