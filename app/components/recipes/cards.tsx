import { NavLink, useLocation, useNavigation } from "@remix-run/react";

import { Card, CardProps } from "./card";

type CardsProps = { recipes: Array<CardProps> };

export default function Cards(props: CardsProps) {
  const { recipes } = props;

  const location = useLocation();
  const { search } = location;
  const navigation = useNavigation();

  const cards = recipes.map((recipe) => {
    const { id } = recipe;
    const isLoading = navigation.location?.pathname.endsWith(id);

    return (
      <li key={id} className="my-4">
        <NavLink to={{ pathname: id, search }} prefetch="intent">
          {({ isActive }) => (
            <Card {...recipe} isActive={isActive} isLoading={isLoading} />
          )}
        </NavLink>
      </li>
    );
  });

  return <ul>{cards}</ul>;
}
