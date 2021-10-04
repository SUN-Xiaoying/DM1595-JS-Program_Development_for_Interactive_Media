//DinnerModel class
class DinnerModel {
    
    /* Note the default value of function parameters */
    constructor(guestsParam=2/* FIXME default value 2 */, dishesParam=[] ) {
	// note that you always need to use "this." when you refer to an object property!
	this.guests= guestsParam;  
	
	this.dishes= dishesParam.slice(0);  // we store a copy (clone) of dishesParam.
	// JS objects (like arrays such as dishesParam) are sent as function parameters by reference not by value.
	// Therefore we are getting a reference to the dishesParam array, and anybody can still modify the array content!
	// So we clone dishesParam to ensure that our DinnerModel object is *not* affected if the dishesParam array content is changed after the call to new DinnerModel(num, dishesParam),

	// Week 2: cloning can be also achieved using spread syntax (...) like so:  this.dishes= [...dishesParam];
	// or this.dishes=new Array(...dishesParam)
    }
    
    /* Set the number of guests to the given value. 
       The value must be a positive integer, throw an Error otherwise.
     */
    setNumberOfGuests(num) {
	// TODO throw an error if num is not a positive integer. Then:
	// this.guests= TODO ;

        if(num > 0 && Number.isInteger(num)){
            this.guests = num;
        }else throw TypeError;

    }

    /* Return the number of guests */ 
    getNumberOfGuests() {
	// return this.  TODO 
        return this.guests;
    }
    
    /* Return all the dishes on the menu. 
     */
    getMenu() {
	//TODO 
        return [...this.dishes];
    }
    
    /* add a dish to the menu. If a dish with the same type already exists, remove it. 
     The dish object can be obtained as a result of DishSource.getDishDetails() or DishSource.searchDishes() 
    */
    addToMenu(dish) {
	//TODO  
        this.dishes.find(k => {
            (k.type === dish.type) ? this.removeFromMenu(k) : false
        });
        this.dishes = [dish, ...this.dishes];
       
    }
    
    /* Remove dish from the menu. Identify the dish by its id. Both of the following should work:
       model.removeFromMenu(DishSource.getDishData(3))
       model.removeFromMenu({id:3})
     */
    removeFromMenu(dish) {
	//TODO 
        this.dishes.find(k => {
            (k.id === dish.id) ? this.dishes = this.dishes.filter(obj=> obj.id != dish.id) : false
        });
    }

    /* Return the dish of the given type from the menu, or undefined */
    getDishOfType(type){
	//TODO 
        return this.dishes.find(dish =>{
            return (dish.type === type) ? dish : undefined
        });
    }
    
    /* Week 2: Utility method do compute a dish price depending on its ingredient prices and quantities.
     This method could be declared static as it does not depend on the DinnerModel data */
    getDishPrice(dish){
	//TODO 
        // this.dish.ingredients.forEach(ingredient => {
        //     total += ingredient.price * ingredient.quantity
        // })
        const reducer = (accumulator, currentValue) => accumulator + (currentValue.price * currentValue.quantity);
        return dish.ingredients.reduce(reducer, 0);
    }

    /* Week 2: Total price for the dinner given the number of guests */
    getDinnerPrice(){
	//TODO 
        // this.dishes.forEach(dish => {
        //     total += this.getDishPrice(dish)
        // })
        const reducer = (accumulator, currentValue) => accumulator + (this.getDishPrice(currentValue) * this.getNumberOfGuests());
        return this.dishes.reduce(reducer,0);
    }    
    /* Week 2: Return an array of ingredients for the DinnerModel dishes, 
       with each ingredient showing up maximum once, and the quantities added up.
       Assume that the ingredient price and measurement unit are the same in all dishes that use a certain ingredient.

       The implementation must be functional. The hints below define an object that collects all the ingredients, and then that object is changed by other functions (forEach callbacks) inside the method. 

       Advanced (bonus) : implement functionally without defining a const, e.g. return dishes.reduce(TODO collect all ingredients in an array).reduce(TODO group ingredients by name in an object)...
    */
    getIngredients(){
	// to make sure we have one entry for each ingredient name, the suitable data structure is a Dictionary,
	// with ingredient names as keys
	// All JavaScript objects are dictionaries, so we use an object called combinedIngredients to collect ingredient data. combinedIngredients[name] will return the ingredient object with the respective name
	
	// TODO  for each dish (this.dishes.forEach() ), for each dish ingredient, set  combinedIngredients[name] to
	// 1) a copy of the ingredient object if combinedIngredients[name] is falsy, i.e. we have not encoutered this ingredient yet during the forEach iterations
	// 2) a copy of the ingredient object with an increased amount if combinedIngredients[name] is truthy, i.e. we have encountered this ingredient before
	// functional code uses expressions rarhter than statements so use a ternary expression ? :  to distinguish between case (1) and (2)

        return Object.values(this.dishes
            .reduce((accdishes, currentDish) => accdishes = [...accdishes, currentDish.ingredients], [])
            .reduce((acc, currentIngredients) => {
              currentIngredients
                .forEach(currentIngredient => (acc[currentIngredient.name])
                  ? acc[currentIngredient.name].quantity += currentIngredient.quantity
                  : acc[currentIngredient.name] = {...currentIngredient}); 
              return acc
            }, {}))
        /*TODO now we don't need the keys any longer, we just need an array of ingredients. Find the appropriate Object method for that */
    }
}

/* A source of dish data, implemented with data from dishesConst.js. Can be implemented with a database or a web API...

   We illustrate another way to define an object with methods: simply define an object constant rather than a class. 
   Since methods are object members, you neeed to separate them with comma 
*/
const  DishSource={
    /* Returns a dish of specific ID */
    getDishDetails(id) {
	//TODO 
        return dishesConst.find(dish => {
            return dish.id === id ? dish : undefined;
        })
    },

    /* 
       Week 2: Search for dishes 
       searchParam can have the following properties (search criteria):
       - type: the dish type
       - query: free text in dish name 
       If no search criterion is specified, all dishes are returned.
       Example use: 
       DishSource.searchDishes({type:"main course", query:"pizza"})
       DishSource.searchDishes({type:"main course"})
       DishSource.searchDishes({query:"Meatba"})
       DishSource.searchDishes({})  returns all dishes
    */
    searchDishes({type='', query=''}) {
    // searchDishes(searchParams) {
	//TODO 
        // const {type, query} = searchParams;
        // const searchType = type => {
        //     return type ? dishesConst.filter(dish => dish.type === type) : [...dishesConst];
        // };
        // const paramsFilter = (result, query) => {
        //     return query ? result.filter(dish => dish.name.includes(query)) : result;
        // };
        // return paramsFilter(searchType(type), query)

        return type || query ? dishesConst.filter(element => element.type.includes(type)).filter(element => element.name.includes(query)) : dishesConst

        // return (type === '' && query ==='')? [...dishesConst] : dishesConst.filter(obj => obj.type.includes(type) && obj.name.includes(query))

    },

    /* Week 2: Retrieve a dish asynhronously by returning a Promise.
       Read the dishes via fetch from this URL, which returns dishes in JSON format:
       http://sunset.nada.kth.se:8080/iprog/file?DM1595/dishes.json
       Then filter for the dish with the respective ID. 
       Example use:
           DishSource.getDishDetailsPromise(2).then(dish=>console.log(dish))
       Or: 
           console.log(await DishSource.getDishDetailsPromise(2))

      Advanced: If the dish with the respective ID does not exist, the returned promise must not resolve to undefined, but must reject. The test below will print on console.error (in red)
           DishSource.getDishDetailsPromise(-1).then(dish=>console.log(dish)).catch(e=>console.error(e))

      Optional-advanced: implement the promise rejection fully functionally (no statements), using e.g. a promise constructor  new Promise((resolve, reject)=> fetch(...)....then(TODO using the resolve and reject callbacks in e.g. a ?: ternary expression)
    */
    getDishDetailsPromise(id) {
	// return new Promise((resolve, reject)=> {fetch("http://sunset.nada.kth.se:8080/iprog/file?DM1595/dishes.json").then(r => r.json()).then(dishes => dishes.find(dish => dish.id == id)).catch(reject)})
    return new Promise((resolve, reject) => {
        (dishesConst.find(obj => obj.id === id)) ? 
          resolve(fetch('http://sunset.nada.kth.se:8080/iprog/file?DM1595/dishes.json')
          .then(resp => resp.json())
          .then(data => data.find(obj => obj.id === id)))
          : reject()
      });
    },    // extra comma is legal in object properties
};  /* good to have a semicolon after a let or const declaration */

