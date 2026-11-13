import { env } from "./config/env.js";
import { createApp } from "./app.js";

createApp().listen(env.PORT, () => console.log(`API on :${env.PORT}`));
