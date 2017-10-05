//global var for the selected pokemon
var selectedPoke;

//initializes the dropdown and display of saved names
function init(which){
	createDropdown(which);
	savedPoke();
}

//createDropdown takes in the array and array's name
//createDropdown's purpose is to create the initial drop down menu and add a listener
function createDropdown(which){
	//removes any children of input
	remove(which);
	remove(pValue);
	resetImg();

	//removes form is there is any
	if($$('form',0)){
		var formEle = $$('form',0);
		formEle.parentNode.removeChild(formEle);
	}

	if(which === "init"){//because "which" is not yet an object you cannot call "which.value" the select has not been changed
		hold = data[which];
	}
	else if(typeof which.value !== typeof undefined) {
		hold = data[which.value];
	}//end else/if
	//creates the initial select and adds an onchange listener to it
	var newDrop = document.createElement('select');
	newDrop.onchange = function(){createDropdown(this)};

	//calls the addOptions function to populate the select with options
	addOptions(newDrop,hold);
}

//generates a div to display any saved pokemon names
function capPoke(input){
	var capDiv = document.createElement('div')
	capDiv.className = 'capturedPoke';
	capDiv.innerHTML = input;
	document.body.appendChild(capDiv);
}

//iterates through the name array checking if there is a cookie or localstorage for that item
function savedPoke(){
	for(var i = 0;i < nameArray.length; i++){
		var name = nameArray[i];
		if(window.localStorage!==undefined){
			if(localStorage.getItem(name)){
				capPoke(name + ': ' + localStorage.getItem(name));
			}
		}
		else if(GetCookie(name)){
			capPoke(name + ': ' + GetCookie(name));
		}
	}
}

//addOptions takes in the selectlist, object
//addOptions' purpose is to add options to the select list
function addOptions(selectList,hold){
	if(hold.length === 1){
		console.log(hold[0]);
		var pokeName = hold[0];
		displayResults(pokeName);
	}
	else{
		for(var i = 0; i < hold.length; i++){
			//creates the initial 'Select'
			if(i==0){
				addValueOption(selectList,'Select...','default');
			}
			var text = hold[i];
			var value = hold[i];
			//calls the addValueOption method to create the option and add a value to it
			addValueOption(selectList,text,value);
		}

		//adds the select list to the page
		$('selects').appendChild(selectList);
	}
}

//addValueOption takes in the select list, the option's text, and the option's value
//addValueOption's purpose is to create the options
function addValueOption(selectbox,text,value){
	var optn = document.createElement('option');
	optn.text = text;
	optn.value = value;
	selectbox.options.add(optn);
}

//remove removes the child elements of the thing passed in
function remove(which){
	if(which.nextSibling){
		while(which.nextSibling){
			which.parentNode.removeChild(which.nextSibling);
		}
	}
}

//displayResults takes in the name of the pokemon
//displayResults' purpose is to display the results
function displayResults(pokeName){
	var newImg = 'images/' + pokeName + '.jpg'
	updateImage(newImg);
  
  	selectedPoke = pokeName;

	var txtPokeName = capsLetter(pokeName);

	var addTxt = document.createTextNode('Pokemon: ' + txtPokeName);
	$('pName').appendChild(addTxt);

	createForm();
}

//caps the first letter of the input
function capsLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//fading image in
function updateImage(newImg){
	
	$('pokeImgFade').src=newImg;
	$('pokeImgFade').setAttribute('id','pokeImgNoFade');
}

//generates the form 
function createForm(){
	var namLabel;
	if(getInputs()){
		console.log('got inputs');
		namLabel = document.createTextNode("Rename Your Pokemon:");
	}
	else{
		console.log('no inputs');
		namLabel = document.createTextNode("Give Your Pokemon A Name:");
	}
	var fo = document.createElement("form");
	fo.setAttribute('method',"post");
	fo.setAttribute('action',"#");
	//fo.addEventListener("submit", function(evt){validate(evt)});

	var nam = document.createElement("input");
	nam.type = "text";
	nam.name = "name";
	nam.id = "name";

	var but = document.createElement("input");
	but.type = "submit";
	but.value = "Submit";
	but.onclick = function(evt){
		validate(evt)
	};

	fo.appendChild(namLabel);
	fo.appendChild(nam);
	fo.appendChild(but);
	$('resultForm').appendChild(fo);
}

//validates that the form has values and passes it to a sanitize function
function validate(e){
	var jobValue = $('name').value
	//if jobValue is empty it stops the form from being submitted
	if(jobValue == ""){
		if(event.preventDefault){
			event.preventDefault();
			console.log('blah');
		}
		//For IE7&8
		else{
			event.returnValue = false;
		}
		alert('Empty Name');
	}
	sanitizeString(jobValue);
}

//resets the image to the default image
function resetImg(){
	if($('pokeImgNoFade')){
		$('pokeImgNoFade').setAttribute('id','pokeImgFade');
	}
	var newImg = 'images/blank.jpg'
	$('pokeImgFade').src=newImg;
}

function $(id){
	return document.getElementById(id);
}

function $$(tag,index){
	return document.getElementsByTagName(tag)[index];
}

function getInputs(){
    if(window.localStorage!==undefined){
    	if(localStorage.getItem(selectedPoke)){
    		return true;
    	}
    	else{
    		return false;
    	}
	}else{
		//cookies
		if(GetCookie(selectedPoke) == null){//first time
			console.log('firsttime');
			return true;
		}
		else{
			console.log('nope');
			return false;
		}
	}
}

//sanitizeString sanitizes the input
//then it passes it to the saveinputs method to save the value in storage
function sanitizeString(){
	var str = document.forms[0].elements[0].value;
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    saveInputs(str);
}

//Saves the input into localstorage/cookies
function saveInputs(inName){
	//check if browser understands localStorage
	if(window.localStorage){
		if(inName){//did the user send in an arg 
				//if no arg then it is first time
			localStorage.setItem(selectedPoke,inName);
			console.log(selectedPoke);
			console.log('saved');
		}
	}	
	else{//I am in ie7**/
		SetCookie(selectedPoke,inName);
		console.log('set');
	}
}
