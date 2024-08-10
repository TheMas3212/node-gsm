import { Router } from "express";
import { SettingDatastore } from "../../datastore";

/* /api/v1/settings */
const router = Router({
  caseSensitive: true,
  strict: true
})
export default router;

const settings = new SettingDatastore();

router.get("/name", async (req, res) => {
  return res.json({
    name: await settings.getServerName()
  })
})

router.post("/name", async (req, res) => {
  const name = req.body.name;
  if (name === undefined) return res.status(400).json({ status: 400, message: "Name undefined" }).end();
  if (name.length < 1)    return res.status(400).json({ status: 400, message: "Name empty" }).end();
  if (name.length > 32)   return res.status(400).json({ status: 400, message: "Name too long (max 32 char)" }).end();
  if (await settings.setServerName(name)) {
    return res.status(500).json({ status: 500, message: "Error updating name" }).end();
  } else {
    return res.status(200).json({ status: 200, message: "Name updated" }).end();
  }
})

router.get("/icon", async (req, res) => {
  return res.json({
    icon: (await settings.getServerIcon() ?? Buffer.alloc(0)).toString("base64")
  })
})

router.post("/icon", async (req, res) => {
  const icon = req.body.icon;
  if (icon === undefined) return res.status(400).json({ status: 400, message: "Icon undefined" }).end();
  const buf = Buffer.from(icon, "base64");
  if (buf.length < 1)    return res.status(400).json({ status: 400, message: "Icon empty" }).end();
  // max size 512KiB
  if (buf.length > 1024 * 512)   return res.status(400).json({ status: 400, message: "Icon too large (max 512KiB)" }).end();
  if (await settings.setServerIcon(buf)) {
    return res.status(500).json({ status: 500, message: "Error updating icon" }).end();
  } else {
    return res.status(200).json({ status: 200, message: "Icon updated" }).end();
  }
});