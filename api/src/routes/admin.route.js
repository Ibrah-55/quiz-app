import express from "express";
import {
  adminLogin,
  adminSignup,
} from "../controllers/adminAuth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  addQuestions,
  addTestDetails,
  getTestDetials,
  adminDeleteTest,
  deleteQuestions,
  getQuestionsForTest
} from "../controllers/adminFunc.controller.js";

const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/admin/register", adminSignup);

router.post("/admin/add-test-details", authenticateUser, addTestDetails);
router.post("/admin/add-question", authenticateUser, addQuestions);
router.delete("/admin/delete-test/:testName", authenticateUser, adminDeleteTest);
router.delete("/admin/delete-question/:testName",authenticateUser, deleteQuestions);



router.get(
  "/admin/get-test-details/:testName",
  authenticateUser,
  getTestDetials
);
router.get(
  "/admin/get-questions/:testName",
  authenticateUser,
  getQuestionsForTest
);


export default router;
