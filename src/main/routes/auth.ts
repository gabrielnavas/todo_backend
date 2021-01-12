import { Router } from "express";
import { SignupController } from "../../presentation/controllers/signup";

export default (route: Router) => {
  route.post('/signup', new SignupController().handle)
}