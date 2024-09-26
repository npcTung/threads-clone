const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const insertRouter = require("./insert.route");
const postRouter = require("./post.route");
const { errHandler, notFound } = require("../lib/errorHandel");

module.exports = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/insert", insertRouter);
  app.use("/api/insert", insertRouter);
  app.use("/api/post", postRouter);

  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      mes: "init router",
    });
  });

  app.use(notFound);
  app.use(errHandler);
};
