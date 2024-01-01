function decode(b64Data){
	// https://stackoverflow.com/questions/14620769/decompress-gzip-and-zlib-string-in-javascript
	
	// Decode base64 (convert ascii to binary)
	var strData     = atob(b64Data);

	// Convert binary string to character-number array
	var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});

	// Turn number array into byte-array
	var binData     = new Uint8Array(charData);

	// Pako magic
	var data        = pako.inflate(binData);

	// Convert gunzipped byteArray back to ascii string:
	var strData     = new TextDecoder().decode(data);

	return strData;
}

function encode(strData){
	// https://stackoverflow.com/questions/14620769/decompress-gzip-and-zlib-string-in-javascript

	// Convert binary string to character-number array
	var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});

	// Turn number array into byte-array
	var binData     = new Uint8Array(charData);

	// Pako magic
	var data        = pako.deflate(binData, {level:9});

	// Convert gunzipped byteArray back to ascii string:
	var strData     = String.fromCharCode.apply(null, new Uint16Array(data));
		
	// Encode base64
	var b64Data     = btoa(strData);

	return b64Data;
}

function factorio_replace(inputStr, find, replace){
	var count = 0;
	return ["0"+encode(decode(inputStr.substr(1)).replaceAll(find, function (){
		count++;
		return replace;
	})), count];
}

function updateOutput() {
  var blueprint_field = document.getElementById("blueprint_field").value;
  var find_field = document.getElementById("find_field").value;
  var replace_field = document.getElementById("replace_field").value;
  var output = document.getElementById("output-field");
  var numreplaced = document.getElementById("numreplaced");
  output.value = "";
  numreplaced.innerHTML = "\n";
  var [newjson, occurences] = factorio_replace(blueprint_field,find_field,replace_field);
  output.value = newjson;
  numreplaced.innerHTML = "Found and replaced "+occurences+" occurences."
}

function loadExample(index){
	document.getElementById("blueprint_field").value = examples[index][0];
	document.getElementById("find_field").value = examples[index][1];
	document.getElementById("replace_field").value = examples[index][2];
	updateOutput();
}

function copyToClipboard() {
    var output = document.getElementById("output-field");
    output.select();
    output.setSelectionRange(0, 99999);
    document.execCommand("copy");
}
