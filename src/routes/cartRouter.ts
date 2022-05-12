import express from "express";
import cart from "../cartDatabase";
import CartItem from "../models/CartItem";

const cartRouter = express.Router();

// build routes

//get 1.
cartRouter.get("/cart-items", (req, res) => {
  const { maxPrice, prefix, pageSize } = req.query;
  let filteredArray: CartItem[] = cart;
  if (prefix) {
    filteredArray = filteredArray.filter((item) => {
      return item.product.toLowerCase().startsWith(prefix as string);
    });
  }
  if (maxPrice) {
    filteredArray = filteredArray.filter((item) => {
      return item.price <= +maxPrice;
    });
  }
  if (pageSize) {
    filteredArray = filteredArray.slice(0, +pageSize);
  }

  res.status(200).json(filteredArray);
});
//get 2.
cartRouter.get("/cart-items/:id", (req, res) => {
  const id: number = +req.params.id;

  const itemID: CartItem | undefined = cart.find((item) => {
    return item.id === itemID;
  });

  if (itemID) {
    res.status(200).json(itemID);
  } else {
    res.status(404).json({ message: `ID: ${id} not found` });
  }
});

//post 3.
let nextID: number = 5;

cartRouter.post("/cart-items", (req, res) => {
  const newItem: CartItem = req.body;
  newItem.id = nextID++;
  cart.push(newItem);

  res.status(201).json(newItem);
});

//put 4.
cartRouter.put("/cart-items/:id", (req, res) => {
  const id: number = +req.params.id;
  const updatedItem: CartItem = req.body;

  const index: number = cart.findIndex((item) => {
    return item.id === id;
  });
  if (index >= 0) {
    cart[index] = updatedItem;
    res.status(200).json(updatedItem);
  }
});

//delete 5.
cartRouter.delete("/cart-items/:id", (req, res) => {
  const id: number = +req.params.id;
  const index: number = cart.findIndex((item) => {
    return item.id === id;
  });
  if (index !== -1) {
    cart.splice(index, 1);
    res.sendStatus(204);
  }
});

//export
export default cartRouter;
