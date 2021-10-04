const assert = chai.assert;
const expect = chai.expect;

describe("DinnerModel", function() {
    
    const testFunctional = method =>	  
	  it(method.name+" functional", ()=>{
	      expect(/(var\s+|let\s+|for\s*\(|while\s*\(|if\s*\(|push\s*\(|splice\s*\(|unshift\s*\(|pop\s*\(|shift\s*\()/g
		     .test(method.toString()), 
		     `
Implementation should be functional and therefore not include statements like: 
'let', 'var', 'for', 'while', 'if' 
or mutable array methods like: 
'push', 'pop', 'unshift', 'shift', 'splice'

`).to.equal(false);
	  });


    this.timeout(200000);  // increase to allow debugging during the test run
    let model = new DinnerModel();
    
    beforeEach(() => {
	model = new DinnerModel();
    });

    describe("W1 number of guests", () => {
	it("default number of guests is 2", ()=> {
	    expect(model.getNumberOfGuests()).to.equal(2);
	});
		   

	it("can set and get number of guests", () => {
	    model.setNumberOfGuests(1);
	    expect(model.getNumberOfGuests()).to.equal(1);
	    
	    model.setNumberOfGuests(3);
	    expect(model.getNumberOfGuests()).to.equal(3);
	});

	it("number of guests is a positive integer", () => {
	    model.setNumberOfGuests(1);
	    expect(model.getNumberOfGuests()).to.equal(1);
	    model.setNumberOfGuests(2);
	    expect(model.getNumberOfGuests()).to.equal(2);
	    
	    expect(()=>model.setNumberOfGuests(-1)).to.throw();
	    expect(()=>model.setNumberOfGuests(0)).to.throw();
	    expect(()=>model.setNumberOfGuests(3.14159265)).to.throw();
	});
    });
    
    describe("W1 getting individual dishes", () => {
	it("gets the correct dish", () => {
	    const dish1 = DishSource.getDishDetails(1);
	    expect(dish1.id).to.equal(1);
	    expect(dish1.name).to.equal("French toast");
	    
	    const dish100 = DishSource.getDishDetails(100);
	    expect(dish100.id).to.equal(100);
	    expect(dish100.name).to.equal("Meat balls");
	});
	
	it("returns undefined if dish is not found", () => {
	    const result1 = DishSource.getDishDetails(-1);
	    expect(result1).to.equal(undefined);
	    
	    const result2 = DishSource.getDishDetails();
	    expect(result2).to.equal(undefined);
	});
    });
    
    describe("W1 menu", () => {
	it("can add dishes", () => {
	    model.addToMenu(DishSource.getDishDetails(1));
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(1));
	    expect(model.dishes.length).to.equal(1);
	    
	    model.addToMenu(DishSource.getDishDetails(100));
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(1));
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(100));
	    expect(model.dishes.length).to.equal(2);
	});
	
	it("overwrites dishes of the same type when adding", () => {
	    model.addToMenu(DishSource.getDishDetails(200));
	    model.addToMenu(DishSource.getDishDetails(1));
	    model.addToMenu(DishSource.getDishDetails(100));
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(1));
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(100));
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(200));
	    expect(model.dishes.length).to.equal(3);
	    
	    model.addToMenu(DishSource.getDishDetails(2));
	    // the old starter dish should no longer exist
	    expect(model.getMenu()).to.not.include(DishSource.getDishDetails(1));
	    // the new dish should exist
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(2));
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(200));
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(100));
	    expect(model.dishes.length).to.equal(3);
	});
	
	it("can remove dishes", () => {
	    model.addToMenu(DishSource.getDishDetails(100));
	    model.addToMenu(DishSource.getDishDetails(1));
	    model.addToMenu(DishSource.getDishDetails(200));
	    expect(model.dishes.length).to.equal(3);
	    
	    // dish 1 should be in the menu
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(1));
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(100));
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(200));
	    
	    model.removeFromMenu({id:1});
	    // should now be removed
	    expect(model.getMenu()).to.not.include(DishSource.getDishDetails(1));

	    expect(model.dishes.length).to.equal(2);
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(100));
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(200));
	});

	it("dish of type", () => {
	    model.addToMenu(DishSource.getDishDetails(2));
	    model.addToMenu(DishSource.getDishDetails(100));
	    model.addToMenu(DishSource.getDishDetails(200));
	    expect(model.dishes.length).to.equal(3);
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(2));
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(200));
	    expect(model.getMenu()).to.include(DishSource.getDishDetails(100));
	    expect(model.getDishOfType(DishSource.getDishDetails(2).type)).to.equal(DishSource.getDishDetails(2));
	    expect(model.getDishOfType(DishSource.getDishDetails(100).type)).to.equal(DishSource.getDishDetails(100));
	    expect(model.getDishOfType(DishSource.getDishDetails(200).type)).to.equal(DishSource.getDishDetails(200));
	});
    });

    
    describe("W2: make W1 methods functional", () => {
	testFunctional(DishSource.getDishDetails);
	testFunctional(model.addToMenu);
	testFunctional(model.removeFromMenu);
	testFunctional(model.getDishOfType);
    });

    describe("W2 immutable state", () => {
	it("addToMenu creates new dish array", () => {
	    const x= model.dishes;
	    model.addToMenu(DishSource.getDishDetails(1));
	    expect(model.dishes).to.not.equal(x);
	});
	it("removeFromMenu creates new dish array", () => {
	    model.addToMenu(DishSource.getDishDetails(1));
	    const x= model.dishes;
	    model.removeFromMenu({id:1});
	    expect(model.dishes).to.not.equal(x);
	});
	it("getMenu returns a copy, so the caller cannot mutate the model dishes", () => {
	    model.addToMenu(DishSource.getDishDetails(1));
	    expect(model.getMenu()).to.not.equal(model.dishes);
	});
	
    });
    describe("W2 filtering for dishes", () => {
	it("searchDishes uses destructuring for its parameter", ()=>{
	    expect(/(searchDishes\s*\(\s*\{)/g.test(DishSource.searchDishes)).to.equal(true);
	});
	it("returns all dishes if no search criteria are specified", () => {
	    const allDishes = DishSource.searchDishes({});
	    expect(allDishes.length).to.equal(11);
	});
	testFunctional(DishSource.searchDishes);
	
	it("returns the correct dish type", () => {
	    let dishes = DishSource.searchDishes({type:"starter"});
	    const onlyHasStarters = dishes.every(dish => dish.type === "starter");
	    expect(onlyHasStarters).to.equal(true);
	    
	    dishes = DishSource.searchDishes({type: "main course"});
	    const onlyHasMain = dishes.every(dish => dish.type === "main course");
	    expect(onlyHasMain).to.equal(true);
	});
	
	it("filters with keywords", () => {
	    let dishes = DishSource.searchDishes({type:"", query:"French"});
	    let allDishesMatch = dishes.every(dish => dish.name.includes("French"));
	    expect(dishes.length).to.be.above(0);
	    expect(allDishesMatch).to.equal(true);
	    
	    dishes = DishSource.searchDishes({type:"", query:"Meat"});
	    allDishesMatch = dishes.every(dish => dish.name.includes("Meat"));
	    expect(dishes.length).to.be.above(0);
	    expect(allDishesMatch).to.equal(true);
	});
	
	it("returns correct dishes with filter and type", () => {
	    const dishes = DishSource.searchDishes({type:"starter", query:"Sour"});
	    const allDishesMatch = dishes.every(
		dish => dish.name.includes("Sour") && dish.type === "starter"
	    );
	    expect(dishes.length).to.be.above(0);
	    expect(allDishesMatch).to.equal(true);
	});
    });
    
    describe("W2 totals", () => {
	it("dish price", () => {
	    expect(model.getDishPrice(DishSource.getDishDetails(2))).to.equal(52);
	    expect(model.getDishPrice(DishSource.getDishDetails(100))).to.equal(2559.5);
	});
	testFunctional(model.getDishPrice);
	it("total price", () => {
	    model.addToMenu(DishSource.getDishDetails(2));
	    model.addToMenu(DishSource.getDishDetails(100));
	    expect(model.getDinnerPrice()).to.equal(2*(52+2559.5));
	});
	testFunctional(model.getDinnerPrice);
	it("ingredients", () => {
	    model.addToMenu(DishSource.getDishDetails(2));
	    model.addToMenu(DishSource.getDishDetails(100));
	    expect(model.getIngredients()).to.include.deep.members([{quantity: 5, price: 10, name: "eggs", unit:''}]);
	    expect(model.getIngredients()).to.include.deep.members([{quantity: 80, price: 0, name: "water", unit:'ml'}]);
	});
	testFunctional(model.getIngredients);
    });

    function testPromise(text, p){
	it(text, async()=>{
	    let start = new Date();
	    let dish1=await p();
	    let finish=new Date();
	    expect(finish-start, "promise getDishDetails should take minimum 2 ms").to.be.above(2);
	    expect(dish1.id).to.equal(2);
	    expect(dish1.name).to.equal("Sourdough starter");
	}).timeout(2000);
    }
    
    describe("W2 async", () => {	
	testPromise("getDishDetails promise", ()=>DishSource.getDishDetailsPromise(2));
    });
    
    describe("Advanced (bonus)", () => {
	it("ingredients without const, using e.g. reduce()", ()=>{
	   expect(/(const\s+)/g
		  .test((model.getIngredients.toString())), "getIngredients using reduce() must not declare a const").to.equal(false);
	});
	it("getDishDetails promise must reject if the dish with the given ID does not exist", async()=>{
	    try{
		const x= await new Promise((resolve, reject)=>DishSource.getDishDetailsPromise(-1).then(reject, resolve));
		expect(x).to.not.be.null;
	    }
	    catch(e){assert.fail("the promise did not reject");}
	}).timeout(2000);
    });
    describe("Advanced-optional", () => {
	testFunctional(DishSource.getDishDetailsPromise);
    });
});

