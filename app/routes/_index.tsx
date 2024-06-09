import { LoaderFunction, json, redirect } from "@remix-run/node";
import fse from "fs-extra";

export const loader: LoaderFunction = async () => {
  try {
    return redirect("/discover");
  } catch (err) {
    const msg = `Error getting user on root route: ${err}`;
    const dir = "logs";
    const file = "error.log";
    await fse.ensureDir(dir);
    fse.appendFileSync(`${dir}/${file}`, msg);
    console.error(msg);
    return json({ error: `error in /discover route: ${msg}` });
  }
};
