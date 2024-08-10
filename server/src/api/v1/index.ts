import { Router } from "express";

import settings from './settings';
import instances from './instances';
import tokens from './tokens';

const router = Router({
  caseSensitive: true,
  strict: true
})
export default router;

router.use("/settings", settings);
router.use("/instances", instances);
router.use("/tokens", tokens);