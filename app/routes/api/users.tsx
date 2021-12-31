import type { LoaderFunction } from "remix";
import data from "../../../users/data.json";
// import { readJSON, writeJSON } from "~/JSONMethods";

export const loader: LoaderFunction = async ({ request }) => {
  // const data = await readJSON("data.json");
  return {
    data,
  };
};

// export default function UsersScreen() {
//   return "";
// }
