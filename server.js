const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const port = 8080;
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
//multer component, uploads/ -> 경로

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
//현재 경로로 바꿔주는 것.

app.get("/products", (req, res) => {
  // const query = req.query;
  // console.log("QUERY : ", query);
  models.Product.findAll({
    // limit: 1,
    // where : {}
    // ..도 가능
    order: [["createdAt", "DESC"]],
    // order by
    attributes: ["id", "name", "price", "createdAt", "seller", "imageUrl"],
  })
    .then((result) => {
      console.log("PRODUCTS", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러 발생!");
    });
  // res.send({
  //   products: [
  //     {
  //       id: 1,
  //       name: "농구공",
  //       price: 100000,
  //       seller: "조던",
  //       imageUrl: "images/products/basketball1.jpeg",
  //     },
  //     {
  //       id: 2,
  //       name: "축구공",
  //       price: 50000,
  //       seller: "메시",
  //       imageUrl: "images/products/soccerball1.jpg",
  //     },
  //     {
  //       id: 3,
  //       name: "키보드",
  //       price: 10000,
  //       seller: "그랩",
  //       imageUrl: "images/products/keyboard1.jpg",
  //     },
  //   ],
  // });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, price, seller, description, imageUrl } = body;
  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send("모든 필드를 작성해주세요!");
  }
  models.Product.create({
    // Product -> product.js 내 define명
    name,
    description,
    price,
    seller,
    imageUrl,
  })
    .then((result) => {
      console.log("상품 생성 결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 업로드에 문제가 발생했습니다.");
    });
  // res.send({
  // body,
  // key와 값이 같으면 생략가능
  // });
  //   res.send("상품이 등록되었습니다.");
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("PRODUCT : ", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("에러 발생!");
    });
});

// upload.single - 이미지 하나 처리
app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path,
  });
});

app.listen(port, () => {
  console.log("서버가 돌아가고 있습니다!");
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB연결 성공!");
    })
    .catch((err) => {
      console.error(err);
      console.log("DB연결 에러!");
      process.exit();
      // node server 종료
    });
});
