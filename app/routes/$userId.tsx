import {
  LoaderFunction,
  useLoaderData,
  ActionFunction,
  redirect,
  Form,
} from "remix";
import { readJSON, writeJSON } from "~/JSONMethods";
import type { User } from "~/JSONMethods";
import { ChangeEvent, useState } from "react";

// This are all the methods that we need id
export const action: ActionFunction = async ({ request, params }) => {
  // Read json
  const users = await readJSON("data.json");
  // read the data Form
  const form = await request.formData();
  // destructurin the param
  const { userId } = params;
  // method delete
  if (form.get("_method") === "delete") {
    console.log("hello world");
    const usersUpdated = users.filter((user) => user.id !== userId);
    console.log(usersUpdated);
    await writeJSON("data.json", usersUpdated);
    return redirect("/");
  }
  //method update is by default
  const age = form.get("age") as string;
  const name = form.get("name") as string;
  const user = users.find((user) => user.id === userId);
  if (user) {
    user.age = parseInt(age);
    user.name = name;
    await writeJSON("data.json", users);
  }
  return redirect("/");
};

export const loader: LoaderFunction = async ({ params }) => {
  // I read the json of all the users
  const users = await readJSON("data.json");
  // I found the user
  const user = users.find((user) => user.id === params.userId);
  return user;
};

export default function UserScreen() {
  const user = useLoaderData<User>();

  const [name, setName] = useState(user?.name);
  const [age, setAge] = useState(user?.age) || 0;

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAge(parseInt(e.target.value));
  };

  return (
    <div className="h-screen">
      <Form
        className="container mx-auto flex flex-col justify-center items-center h-full"
        method="post"
      >
        <label htmlFor="" className="block my-4">
          <span className="block">Tu nombre</span>
          <input
            type="text"
            className="p-2 bg-black rounded outline-none"
            onChange={handleNameChange}
            name="name"
            value={name}
          />
        </label>
        <label htmlFor="" className="block my-4">
          <span className="block">Tu edad</span>
          <input
            type="number"
            className="p-2 bg-black rounded outline-none"
            onChange={handleAgeChange}
            name="age"
            value={age}
          />
        </label>
        <button className="py-2 px-4 rounded bg-violet-500">Guardar</button>
      </Form>
    </div>
  );
}
