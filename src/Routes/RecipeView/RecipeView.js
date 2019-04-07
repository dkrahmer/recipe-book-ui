import { getRecipeById } from "../../Services/recipeService";
import { PageHeader } from "../../Shared/PageHeader";
import { LoadingWrapper } from "../../Shared/LoadingWrapper";
import { RouterLink } from "../../Shared/RouterLink";
import { RecipeInfo } from "./Components/RecipeInfo";

import React, {
  useState,
  useEffect
} from "react";
import {
  Paper,
  Button
} from "@material-ui/core";

export function RecipeView(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [recipe, setRecipe] = useState({ name: "View Recipe" });
  const [ownerBlurb, setOwnerBlurb] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getRecipeById(props.match.params.id, (response) => {
      setRecipe(response.data);
      setIsLoading(false);
    }, (error) => {
      if (error.response && error.response.status === 404) {
        props.history.push("/notfound");
      }
    });
  }, []);

  return (
    <React.Fragment>
      <PageHeader text={recipe.name} subText={ownerBlurb} />
      <LoadingWrapper isLoading={isLoading}>
        <Paper style={{ padding: 12 }}>
          <RecipeInfo recipe={recipe} setOwnerBlurb={setOwnerBlurb} />
          <RouterLink to="/">
            <Button size="small" color="primary">
              To All Recipes
            </Button>
          </RouterLink>
        </Paper>
      </LoadingWrapper>
    </React.Fragment>
  );
}