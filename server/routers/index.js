const authRouter = require("./auth");
const userRouter = require("./user");
const insertRouter = require("./insert");
const postRouter = require("./post");
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
