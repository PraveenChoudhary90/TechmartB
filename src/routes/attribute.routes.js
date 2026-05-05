

import express from "express";
import { adminOnly, auth } from "../middleware/authMiddleware.js";
import { createAttribute, deleteAttribute, getAllAttributes, getAttributeById, updateAttribute } from "../controllers/attribute.controller.js";

const route  = express.Router();

route.post("/add-attribute", auth, adminOnly, createAttribute);
route.get("/get-attribute",auth, adminOnly, getAllAttributes);
route.put("/update-attribute/:id", auth, adminOnly, updateAttribute);
route.get("/getbyid-attribute/:id", auth, adminOnly, getAttributeById);
route.delete("/delete-attribute/:id", auth, adminOnly, deleteAttribute);

export default route;