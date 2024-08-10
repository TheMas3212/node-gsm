import { Router } from "express";
import v1 from './v1';

export const router = Router({
  caseSensitive: true,
  strict: true
})
export default router;

router.get("/v1", v1);
