
// db of inputs and their regex if applicable
// 1: input id 2: regex (undefined if not necessary) 3: (bool - undefined if no regex) is inclusive regex 4: custom error string (undefined if not necessary)
var form_1_inputs = [
	["my_input"],
	// identifies non-alphanumeric regex - [\\^]|[^A-z|0-9] 
	["my_input_2","[\\^]|[^A-z|0-9]", false, "Please only use letters and numbers."],
	// identifies non-numeric values except for hyphen - [\\^]|[^0-9|-|.]
	["my_input_3","[\\^]|[^0-9|-]", false, "Please provide your 9 digit phone number."],
	// identifies a valid email address
	["my_input_4","[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", true, "Please provide a valid email address."],
	// identifies a valid street address
	["my_input_5","[\\^]|[^A-z|0-9 ,.]", false, "Please provide a valid street address."]
];

// anonymous object that houses a constructor for a new policeman form validator object
var validator = (function() {
	return{
		policeman: function(db){
			// Setup
			this._db = db;
			for (var x = 0; x < db.length; x++){
					// set required
				set_required(db[x][0]);
				// set regex
				if (db[x][1]!=undefined){
					set_regex(db[x][0],db[x][1]);
				} 
				// set listener
				document.getElementById(db[x][0]).addEventListener("input",
					(e)=>{ run_validation(e); }
				);
				document.getElementById(db[x][0]).addEventListener("blur",
					(e)=>{ trim_ends(e); }
				);
			}
			// Utility Methods
			function set_required(id){
				var z = document.getElementById(id);
				z.classList.add("i_required");
				z.classList.add("i_invalid");
			}
			function set_regex(id,regex){
				if (regex != undefined){
				document.getElementById(id).classList.add("i_regex");
				document.getElementById(id).setAttribute('data-regex',regex);
				}
			}
			function check_length(e){
				let maxlength = parseInt(e.target.getAttribute('max-length'));
				if (e.target.value.length > maxlength){
					e.target.value = e.target.value.slice(0,maxlength);
				}
			}
			function remove_illegal(e, value){
				e.target.value = e.target.value.replace(value[0],"");
			}
			var trim_ends = (e)=>{ e.target.value = e.target.value.trim(); }
			// Validation on Input
			function run_validation(e){
				if (e.target.value==undefined || e.target.value=="" || e.target.value==null)
				{  e.target.classList.add('i_invalid'); }
				else
				{	
					if (e.target.classList.contains("i_regex"))
					{
						var reg = new RegExp(e.target.getAttribute('data-regex'),"g"); 
						var isinclusive = db.find(function(z){ if (z[0] == e.target.getAttribute('id')) { return z; }});
						if (reg.test(e.target.value) != isinclusive[2])
						{
							e.target.classList.add('i_invalid');
							remove_illegal(e, e.target.value.match(reg));
							run_validation(e);
						}
						else
						{
							e.target.classList.remove('i_invalid');
						}
					}
					else{ e.target.classList.remove('i_invalid'); }
				}
				check_length(e);
			}
			// Validation on Submit
			this.form_validation = function(){
				var db = this._db;
				var invalid = 0;
				for (var x = 0; x < db.length; x++)
				{
					let error_container = document.getElementById(db[x][0] + "_error");
					let container = document.getElementById(db[x][0]);
					if (container.classList.contains('i_invalid'))
					{
						invalid++;
						if (container.value=="" || container.value == undefined)
						{
							error_container.innerText = "This field is required.";
						}
						else
						{
							if (db[x][3] != undefined)
							{
								error_container.innerText = db[x][3];
							}
							else
							{
								error_container.innerText = "This value is invalid.";
							}
						}
					}
					else
					{
						error_container.innerText = "";
					}
				}
				if (invalid > 0)  {return false;}
				else { return true };
			}
		}
	}
})();

// initialize a policeman
var form_1 = new validator.policeman(form_1_inputs);

// gate form submission through policeman check_length
document.getElementById("form_1_submit").onclick = () => {
	if (form_1.form_validation("form_1_inputs")) 
	{ document.getElementById("form_1").submit; }		
}

// for testing
document.getElementById('form_1').onsubmit = ()=>{console.log('submitted!');}
