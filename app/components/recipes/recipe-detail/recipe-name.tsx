import { Input } from "~/components/form/Inputs";
import ErrorMessage from "~/components/form/error-message";

type RecipeNameProps = { id: string; name: string };
export default function RecipeName(props: RecipeNameProps) {
  const { id, name } = props;

  return (
    <div className="mb-2">
      <Input
        key={id} // * key is required to override the default behavior of React Form status persistence
        type="text"
        placeholder="Recipe Name"
        autoComplete="off"
        className="text-2xl font-extrabold"
        name="name"
        defaultValue={name || ""}
      />
      <ErrorMessage></ErrorMessage>
    </div>
  );
}
