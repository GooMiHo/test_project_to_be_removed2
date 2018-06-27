import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ingrArray} from './ingredient-conv-chart';

function convertCupRemainders(remainingCups, fullCups){
  let cupsToTblOrTsp = [
    {cup: 0.06, cupTblsTsp: '1 Tbls', unit: ' Tbls'},
    {cup: 0.03, cupTblsTsp: '1/2 Tbls', unit: ' Tbls'},
    {cup: 0.02, cupTblsTsp: '1 tsp', unit: ' tsp'},
    {cup: 0.018, cupTblsTsp: '7/8 tsp', unit: ' tsp'},
    {cup: 0.016, cupTblsTsp: '3/4 tsp', unit: ' tsp'},
    {cup: 0.013, cupTblsTsp: '5/8 tsp', unit: ' tsp'},
    {cup: 0.01, cupTblsTsp: '1/2 tsp', unit: ' tsp'},
    {cup: 0.008, cupTblsTsp: '3/8 tsp', unit: ' tsp'},
    {cup: 0.005, cupTblsTsp: '1/4 tsp', unit: ' tsp'},
    {cup: 0.003, cupTblsTsp: '1/8 tsp', unit: ' tsp'}
  ];

  let smallerRemainder;
  let largerMeasuringUnit = [];
  //let count = 1
  let countUnits;


  while ( remainingCups > 0.002 ) {
    for(let i = 0; i < cupsToTblOrTsp.length; i++) {
      if( remainingCups >= cupsToTblOrTsp[i].cup && remainingCups >= 0.003) {
        let numberOfCupsTblsTsp = Math.floor(remainingCups / cupsToTblOrTsp[i].cup);
        smallerRemainder = Number( (remainingCups - (numberOfCupsTblsTsp * cupsToTblOrTsp[i].cup)).toFixed(3) );
        if(cupsToTblOrTsp[i].cup === cupsToTblOrTsp[0].cup || cupsToTblOrTsp[i].cup === cupsToTblOrTsp[2].cup) {
            largerMeasuringUnit += numberOfCupsTblsTsp

            if(cupsToTblOrTsp[i].cup === cupsToTblOrTsp[0].cup && smallerRemainder < 0.03) {
                largerMeasuringUnit += cupsToTblOrTsp[i].unit;
            }
            else if(smallerRemainder < 0.003) {
                largerMeasuringUnit += cupsToTblOrTsp[i].unit;
            }
        }
        else {
          largerMeasuringUnit += cupsToTblOrTsp[i].cupTblsTsp;
        }

        if(cupsToTblOrTsp[i].cup === cupsToTblOrTsp[0].cup || cupsToTblOrTsp[i].cup === cupsToTblOrTsp[1].cup) {
            if(smallerRemainder > 0.002 && smallerRemainder < 0.03) {
                if(fullCups) {
                    largerMeasuringUnit += ', and';
                    countUnits = 3;
                }
                else {
                  largerMeasuringUnit += ' and';
                  countUnits = 2;
                }
            }
        }

        if( smallerRemainder < 0.003 ) {
            if(countUnits === 3) {
              return `, ${largerMeasuringUnit}`
            }
            else if(fullCups > 0) {
              return ` and ${largerMeasuringUnit}`
            }
            else {
              return largerMeasuringUnit;
            }
        }
        else {
            remainingCups = smallerRemainder;
            largerMeasuringUnit += ' ';
            //count++;
        }

      }
    }
  }
}



  let cupsToFractions = [
    {cup: 0.75, fraction: '3/4'},
    {cup: 0.67, fraction: '2/3'},
    {cup: 0.50, fraction: '1/2'},
    {cup: 0.33, fraction: '1/3'},
    {cup: 0.25, fraction: '1/4'},
  ];


function cupFraction(cupDecimal, fullCups){
  for(let i = 0; i < cupsToFractions.length; i++) {
    if(cupDecimal >= cupsToFractions[i].cup) {
        if(fullCups > 0) {
            return `${cupsToFractions[i].fraction} cups`
        }
        else {
            return `${cupsToFractions[i].fraction} cup `;
        }
    }
  }

}

function cupFractionRemainder(cupDecimal){
  let remainingDecimal;
  if( cupDecimal >= .25 )
    for(let i = 0; i < cupsToFractions.length; i++) {
      if(cupDecimal >= cupsToFractions[i].cup) {
        remainingDecimal = Number( (cupDecimal - cupsToFractions[i].cup).toFixed(3) );
        return remainingDecimal;
      }
    }
  else {
    return cupDecimal;
  }

}

function allRemainders(cups, fullCups) {
  let tblsAndTsp = convertCupRemainders(cupFractionRemainder(cups), fullCups);
  let fractionsOfCups = cupFraction(cups, fullCups);
  let string = '';

  if(fullCups > 0 && !fractionsOfCups) {
      if(fullCups === 1) {
          string += ' cup ';
      }
      else {
          string += ' cups ';
      }
  }

  else if(fullCups > 0 && fractionsOfCups) {
      string += ' ';
  }

  if(fractionsOfCups && tblsAndTsp) {
    string += fractionsOfCups;
    string += tblsAndTsp;
    /*if (tblsAndTsp.length > 8) {
      string += `, ${tblsAndTsp}`;
    }
    else {
      string += ` and ${tblsAndTsp}`;
  }*/
  }
  else if (fractionsOfCups) {
    string += fractionsOfCups;
  }
  else if (tblsAndTsp) {
    string += tblsAndTsp;
  }

 return string;
}





class RecipeConverter {
  constructor(gramsToComp, cupsToComp) {
    this._gramsToComp = gramsToComp;
    this._cupsToComp = cupsToComp;
  }

  set gramsToComp(newGrams) {
    if(typeof newGrams === 'number' && newGrams === Math.abs(newGrams)) {
      this._gramsToComp = newGrams;
    }
  }

  set cupsToComp(newCups) {
    if(typeof newCups === 'number' && newCups === Math.abs(newCups)) {
      this._cupsToComp = newCups;
    }

  }

  get gramsToComp() {
    return this._gramsToComp;
  }

  get cupsToComp() {
    return this._cupsToComp;
  }

  convertGramstoCups(amountInGrams) {
    let convertedCups = (this._cupsToComp * amountInGrams) / this._gramsToComp;
    let convertedCupsFull = Math.floor(convertedCups);
        //let string = convertedCupsFull.toString();
    let remainder = Number( (convertedCups - convertedCupsFull).toFixed(3) );
    let finalString = '';

    if(convertedCupsFull > 0 && remainder < 0.003) {
        if(convertedCupsFull === 1) {
            return `${convertedCupsFull} cup`;
        }
        else {
            return `${convertedCupsFull} cups`
        }
    }

    else {
        if(convertedCupsFull === 0) {
          finalString = allRemainders(remainder, convertedCupsFull);
        }
        else {
            finalString =`${convertedCupsFull}${allRemainders(remainder, convertedCupsFull)}`;

        }

        return finalString;
      }
    }
}




//------------ shows dropdown menu with ingredient options -----------------
const list = document.getElementById("ingredientList");

 let word = [];

 const newIngrArray = ingrArray.sort(function (a, b) {
     return a.wordCheck.toLowerCase().localeCompare(b.wordCheck.toLowerCase());
 })

 newIngrArray.forEach(x => {
   word.push(x.wordCheck)
 })

word.forEach(item => {
  let option = document.createElement('option');
  option.value = item;
  list.appendChild(option);
});


//-------------------------------------------------------------------------

let itemsAndAmounts = [];

function removeElement(item, item2) {
    var element = document.getElementById(item);
    element.parentNode.removeChild(element);

    var element2 = document.getElementById(item2);
    if(element2){
        element2.parentNode.removeChild(element2);
    };
}

function addNewItem(wordToFind, amountToConvert) {

    let indexFound = word.indexOf(wordToFind);
    const IngredientConveter = new RecipeConverter(newIngrArray[indexFound].grams, newIngrArray[indexFound].cups);
    let newItem = `${IngredientConveter.convertGramstoCups(amountToConvert)} ${newIngrArray[indexFound].ingredient}`;
    itemsAndAmounts.push(newItem);

    const recipeLis = itemsAndAmounts.map((item, i) => {
        let keyId = 'item_' + i;
        let keyId2 = 'item2_' + i;
        let myButton = <button id="remove-button" onClick={event => removeElement(keyId, keyId2)}>remove</button>;
        return <li key={keyId} id={keyId} className="theList">{item} {myButton}</li>;
    });
    ReactDOM.render(<ul>{recipeLis}</ul>, document.getElementById('root'));
}

document.getElementById("add-list-button").addEventListener("click", function() {
    const recipeLis2 = itemsAndAmounts.map((item, i) => {
        let keyId2 = 'item2_' + i;
        return <li key={keyId2} id={keyId2}>{item}</li>;
    });
    ReactDOM.render(<h1 id="recipe-ingredients">Ingredients:</h1>, document.getElementById('root2'));
    ReactDOM.render(<ul id="theList2Ul">{recipeLis2}</ul>, document.getElementById('root3'));
});


function searchList(val) {
    for (let i=0; i < ingrArray.length; i++) {
        if (ingrArray[i].wordCheck === val) {
            return true;

        }
    }
}

document.getElementById("pressed-button").addEventListener("click", function() {
    let enteredIngredient = document.getElementById("enteredIngredient").value;
    let amountEntered = document.getElementById("gramsOfIng").value;
    if(searchList(enteredIngredient)){
        addNewItem(enteredIngredient, amountEntered);
        document.getElementById("enteredIngredient").value = "";
        document.getElementById("gramsOfIng").value = "";
    }
    else {
        alert("ingredient is not avaliable");
    }
}, false);