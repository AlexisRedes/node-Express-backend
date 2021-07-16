const express= require("express");
const router = express.Router();
const userController = require("./../../controller/api/User")



router.get("/", userController.getUser);
router.put("/", userController.updateById);

router.patch("/savePost", userController.savePost);

module.exports = router;
 