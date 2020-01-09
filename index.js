import React, { Component } from "react";
import { render } from "react-dom";
import "./style.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      find: "",
      recipe: {},
      image: "",
      loadstate: null
    };
  }

  setName = event => {
    this.setState({
      find: event.target.value
    });
  };

  getRecipe = async () => {
    this.setState({
      loadstate: "LOADING"
    });
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${this.state.find}`
    );

    const myJson = await response.json();
    console.log("myJson", myJson);

    if (myJson.meals == null) {
      this.setState({
        loadstate: "LOADING_FAILED"
      });
    }
    var Ingredient = myJson.meals.map(this.getIngredient);
    var Measures = myJson.meals.map(this.getMeasures);
    this.setState({
      recipe: myJson.meals[0],
      image: myJson.meals[0].strMealThumb,
      loadstate: "LOADING_DONE",
      Ingredient: Ingredient,
      Measures: Measures
    });
    console.log(this.state.recipe);
  };
  //button
  toggleL = event => {
    if (event.target.style.color == "black") event.target.style.color = "red";
    else event.target.style.color = "black";
  };
  getIngredient = object => {
    var keys = Object.keys(object);
    console.log(keys);
    var Ingredient = [];
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf("strIngredient") != -1) {
        if (object["" + keys[i]] != null && object["" + keys[i]].length > 0)
          Ingredient.push(object["" + keys[i]]);
      }
    }
    console.log(Ingredient);
    return Ingredient;
  };
  // Measures
  getMeasures = object => {
    var keys = Object.keys(object);
    console.log(keys);
    var Measures = [];
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf("strMeasure") != -1) {
        if (object["" + keys[i]] != null && object["" + keys[i]].length > 0)
          Measures.push(object["" + keys[i]]);
      }
    }
    console.log(Measures);
    return Measures;
  };

  printIngredient = (value, index) => {
    console.log(this.state);
    return (
      <p>
        {value} ---- {this.state.Measures[0][index]}
      </p>
    );
  };

  render() {
    return (
      <div id="parent">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.css"
        />

        <div id="header">
          <h1 id="head">Recipe Finder</h1>
          <center>
            <input
              onChange={() => this.setName(event)}
              value={this.state.find}
              placeholder="Enter the Name of the Dish"
            />
            <span>
              <button onClick={this.getRecipe}>Get Recipes</button>
            </span>
            <br />
            <br />
            {this.state.loadstate == null ? (
              <h2>Type a Dish Name to find for it's ingredient</h2>
            ) : (
              ""
            )}
          </center>
        </div>
        {this.state.loadstate == "LOADING_FAILED" ? (
          <h1>No Data Has been received</h1>
        ) : (
          ""
        )}
        {this.state.loadstate == "LOADING" ? <h1>Loading....</h1> : ""}
        {this.state.loadstate == "LOADING_DONE" ? (
          <div id="container">
            <div id="header1">
              <div />
              <div>
                <h1 id="main">{this.state.recipe.strMeal}</h1>
              </div>
              <div>
                <i
                  id="heart"
                  className="far fa-heart"
                  onClick={this.toggleL}
                />
              </div>
            </div>
            <div id="description">
              <div id="left">
                <img src={this.state.image} />
              </div>
              <div id="right">
                <i>Category of the Meal - </i>
                {this.state.recipe.strCategory}
                <br />
                <i>Area of the Meal - </i>
                {this.state.recipe.strArea}
                <br />
                <br />
                <i>Ingredient</i>
                <div id="ingredient">
                  {this.state.Ingredient[0].map(this.printIngredient)}
                </div>
                <i>
                  <center>Recipe</center>
                </i>
                <div id="recipe">{this.state.recipe.strInstructions}</div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
render(<App />, document.getElementById("root"));
