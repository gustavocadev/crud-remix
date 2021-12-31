import { writeJSON, readJSON } from "~/JSONMethods";
import { nanoid } from "nanoid";
import {
  LoaderFunction,
  useLoaderData,
  redirect,
  Form,
  ActionFunction,
  MetaFunction,
  useTransition,
  useActionData,
  json,
} from "remix";
import type { User } from "~/JSONMethods";
import { Link } from "react-router-dom";
import { ChangeEvent, useState, FormEvent } from "react";

export const meta: MetaFunction = () => {
  return {
    title: "Home",
    description: "Welcome to my Home :D",
  };
};

type MessageReponse = {
  status: string;
  ok: boolean;
};

// This is a post action :D
export const action: ActionFunction = async ({ request }) => {
  // Read json
  const users = await readJSON("data.json");
  // read data json
  const formData = await request.formData();

  // read the inputs
  const name = formData.get("name") as string;
  const age = formData.get("age") as string;
  const newUser: User = {
    name,
    age: parseInt(age),
    id: nanoid(),
  };
  // add new user
  users.push(newUser);
  // write the new user
  writeJSON("data.json", users);
  // redirect home page
  redirect("/");
  return json({ status: 200, ok: true });
};

export const loader: LoaderFunction = () => {
  const data = readJSON("data.json");

  return data;
};

export default function Index() {
  const users = useLoaderData();
  const transition = useTransition();
  // const action = useActionData<MessageReponse>();

  const [inputForm, setInputForm] = useState({
    name: "",
    age: "",
  });

  const { name, age } = inputForm;

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputForm({
      ...inputForm,
      [e.target.name]: e.target.value,
    });
  };
  // const clearInput = () => {
  //   if (action?.ok) {
  //     setInputForm({
  //       name: "",
  //       age: "",
  //     });
  //   }
  // };

  return (
    <div className="container mx-auto ">
      <h2 className="text-4xl text-center my-4">Hola cómo estás 😃😃</h2>
      <Form
        method="post"
        className="flex flex-col justify-center w-full items-center"
      >
        <label htmlFor="">
          <span className="block">Introduce tu nombre</span>
          <input
            type="text"
            name="name"
            onChange={handleNameChange}
            value={name}
            className=" p-2 bg-black rounded outline-none "
          />
        </label>

        <label htmlFor="" className="block">
          <span className="block">Introduce tu edad</span>
          <input
            type="number"
            name="age"
            onChange={handleNameChange}
            value={age}
            className=" p-2 bg-black rounded outline-none "
          />
        </label>

        <button
          type="submit"
          // onClick={clearInput}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded my-4 transition"
        >
          {transition.state == "loading" ? "Guardando..." : "Guardar"}
        </button>
      </Form>

      <section className="grid grid-cols-2 gap-y-8 mt-4 gap-x-4">
        {users.map((user: User) => {
          return (
            <article
              key={user.id}
              className="border border-blue-200 p-4 rounded"
            >
              <div>
                <p>
                  Mi nombre es:{" "}
                  <span className="text-rose-300 font-semibold text-lg">
                    {user.name}
                  </span>
                </p>
                <p>
                  Mi edad es:{" "}
                  <span className="text-orange-300 font-semibold text-lg">
                    {user.age}
                  </span>
                </p>
              </div>
              <div className="flex justify-center">
                <Form method="post" action={`/${user.id}`}>
                  <input type="hidden" name="_method" value="delete" />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 rounded m-4"
                  >
                    Eliminar
                  </button>
                </Form>

                <Link
                  to={`/${user.id}`}
                  className="px-4 py-2 bg-indigo-500 rounded  m-4"
                >
                  Editar
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
