// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)};
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)};
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)};
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h};

function getMinecraftRGB(hex) {
	return (hexToR(hex)<<16)+(hexToG(hex)<<8)+(hexToB(hex));
}

var jobject = {};
function refreshOutput() {
	var player;
	var item;
	var dmg;
	var qty;
	var HFEnchantments;
	var HFModifiers;
	var HFUnbreakable;
	var HFCanDestroy;
	var HFCanPlace;
	if ($('#HFEnchantments').hasClass('btn-danger')) {
		HFEnchantments = 1;
	} else {
		HFEnchantments = 0;
	}
	if ($('#HFModifiers').hasClass('btn-danger')) {
		HFModifiers = 2;
	} else {
		HFModifiers = 0;
	}
	if ($('#HFUnbreakable').hasClass('btn-danger')) {
		HFUnbreakable = 4;
	} else {
		HFUnbreakable = 0;
	}
	if ($('#HFCanDestroy').hasClass('btn-danger')) {
		HFCanDestroy = 8;
	} else {
		HFCanDestroy = 0;
	}
	if ($('#HFCanPlace').hasClass('btn-danger')) {
		HFCanPlace = 16;
	} else {
		HFCanPlace = 0;
	}
	var HFTotal = HFEnchantments + HFModifiers + HFUnbreakable + HFCanDestroy + HFCanPlace;
	if (HFTotal > 0) {
		jobject.HideFlags = HFTotal;
	} else if (jobject.HideFlags != undefined) {
		delete jobject.HideFlags;
	}
	if (jobject.CanDestroy != undefined) {
		if (jobject.CanDestroy.length == 0) {
			delete jobject.CanDestroy;
		}
	}
	if (jobject.CanPlaceOn != undefined) {
		if (jobject.CanPlaceOn.length == 0) {
			delete jobject.CanPlaceOn;
		}
	}
	if ($('#invul').prop("checked")) {
		jobject.Unbreakable = 1;
	} else {
		delete jobject.Unbreakable;
	}
	if ($('#useItemName').prop("checked")) {
		if (jobject.display == undefined) {
			jobject.display = new Object;
		}
		jobject.display.Name=$('#itmName').val();
	} else {
		if (jobject.display != undefined) {
			delete jobject.display.Name;
		}
	}
	if (jobject.display != undefined) {
		if (Object.keys(jobject.display).length == 0) {
			delete jobject.display;
		}
	}
	if (jobject.ench != undefined) {
		if (jobject.ench.length == 0) {
			delete jobject.ench;
		}
	}
	if (jobject.StoredEnchantments != undefined) {
		if (jobject.StoredEnchantments.length == 0) {
			delete jobject.StoredEnchantments;
		}
	}
	if (jobject.AttributeModifiers != undefined) {
		if (jobject.AttributeModifiers.length == 0) {
			delete jobject.AttributeModifiers;
		}
	}
	if ($('#player').val() != '') {
		player = $('#player').val();
	} else {
		player = '@a';
	}
	if ($('#item').val() != '') {
		item = 'minecraft:'+$('#item').val();
	} else {
		item = 'minecraft:stone';
	}
	if ($('#dmg').val() != '') {
		dmg = $('#dmg').val();
	} else {
		dmg = '0';
	}
	if ($('#qty').val() != '') {
		qty = $('#qty').val();
	} else {
		qty = '1';
	}
	if ($('#repairCost').val() != '' && $('#repairCost').val() != '0') {
		jobject.repairCost = $('#repairCost').val();
	} else {
		delete jobject.repairCost;
	}
	if (item == 'minecraft:leather_helmet' || item == 'minecraft:leather_chestplate' || item == 'minecraft:leather_leggings' || item == 'minecraft:leather_boots') {
		$('#previewcolorcontainer').show();
		if ($('#previewcolorcheckbox').is(':checked')) {
			jobject.display = new Object;
			jobject.display.color = getMinecraftRGB('#'+$('#leathercolor').val());
		} else {
			if (jobject.display == '[object Object]') {
				delete jobject.display.color;
			}
		}
	} else {
		if (jobject.display == '[object Object]') {
			delete jobject.display.color;
		}
		$('#previewcolorcontainer').hide();
	}
	if (jobject.display != undefined) {
		if (Object.keys(jobject.display).length == 0) {
			delete jobject.display;
		}
	}
	$('#out').html("/give "+player+" "+item+" "+qty+" "+dmg+" "+getJSONWithProperFormatting(JSON.stringify(jobject)));
}
function getJSONWithProperFormatting(obj) {
	//return obj.replace(/\"([^(\")"]+)\":/g,"$1:").replace(/id:\"([0-9]+)\"/g,'id:$1').replace(/lvl:\"([0-9]+)\"/g,'lvl:$1').replace(/repairCost:\"([0-9]+)\"/g,'repairCost:$1');
	var str = obj.replace(/\"lvl\":\"([a-zA-Z0-9.-]+)\"/g,'lvl:$1');
	str = str.replace(/\"id\":\"([a-zA-Z0-9.-]+)\"/g,'id:$1');
	str = str.replace(/\"Amount\":\"([a-zA-Z0-9.-]+)\"/g,'Amount:$1');
	str = str.replace(/\"Operation\":\"([a-zA-Z0-9-]+)\"/g,'Operation:$1')
	str = str.replace(/\"([^(\")"]+)\":/g,"$1:");
	return str;
}
$( document ).ready(function(){
	$('.glyphicon').popover();
	$('#refresh').click(refreshOutput);
	$('#loreAddBtn').click(function(){
		if ($('#loreAdd').val() != '') {
			if (jobject.display == undefined) {
				jobject.display = new Object;
			}
			if (jobject.display.Lore == undefined) {
				jobject.display.Lore = new Array;
			}
			jobject.display.Lore.push($('#loreAdd').val());
			$('#loreAdd').val('');
			refreshOutput();
		}
	});
	$('#useItemName').change(function(){
		if ($('#useItemName').prop("checked")) {
			$('#itmName').val('');
			$('#itmName').removeAttr('disabled');
		} else {
			$('#itmName').val('Check the checkbox to use a custom name');
			$('#itmName').attr('disabled','true');
		}
	});
	$('#attrRemove').click(function(){
		if (jobject.AttributeModifiers == undefined) {
			alert('Nothing to remove!');
			return false;
		}
		for (var i = 0; i < jobject.AttributeModifiers.length; i++) {
			if (jobject.AttributeModifiers[i].AttributeName == $('#attributeName').val()) {
				foundExisting = true;
				jobject.AttributeModifiers.remove(i);
			}
		};
		refreshOutput();
	});
	$('#enchAdd').click(function(){
		if ($('#enchID').val() != '') {
			if (jobject.ench == undefined) {
				jobject.ench = new Array;
			}
			if ($('#enchQTY').val() == '') {
				$('#enchQTY').val('1');
			}
			var foundExisting = false;
			for (var i = 0; i < jobject.ench.length; i++) {
				if (jobject.ench[i].id == $('#enchID').val()) {
					foundExisting = true;
					jobject.ench.remove(i);
				}
			};
			jobject.ench.push({"id":0,"lvl":0});
			jobject.ench[jobject.ench.length - 1].id=$('#enchID').val();
			jobject.ench[jobject.ench.length - 1].lvl=$('#enchQTY').val();
			refreshOutput();
		}
	});
	$('#enchAddStore').click(function(){
		if ($('#enchStoreID').val() != '') {
			if (jobject.StoredEnchantments == undefined) {
				jobject.StoredEnchantments = new Array;
			}
			if ($('#enchStoreQTY').val() == '') {
				$('#enchStoreQTY').val('1');
			}
			var foundExisting = false;
			for (var i = 0; i < jobject.StoredEnchantments.length; i++) {
				if (jobject.StoredEnchantments[i].id == $('#enchStoreID').val()) {
					foundExisting = true;
					jobject.StoredEnchantments.remove(i);
				}
			};
			jobject.StoredEnchantments.push({"id":0,"lvl":0});
			jobject.StoredEnchantments[jobject.StoredEnchantments.length - 1].id=$('#enchStoreID').val();
			jobject.StoredEnchantments[jobject.StoredEnchantments.length - 1].lvl=$('#enchStoreQTY').val();
			refreshOutput();
		}
	});
	$('#enchRemoveStore').click(function(){
		if (jobject.StoredEnchantments == undefined) {
			alert('Nothing to remove!');
			return false;
		}
		for (var i = 0; i < jobject.StoredEnchantments.length; i++) {
			if (jobject.StoredEnchantments[i].id == $('#enchStoreID').val()) {
				foundExisting = true;
				jobject.StoredEnchantments.remove(i);
			}
		};
		refreshOutput();
	});
	$('#enchRemove').click(function(){
		if (jobject.ench == undefined) {
			alert('Nothing to remove!');
			return false;
		}
		for (var i = 0; i < jobject.ench.length; i++) {
			if (jobject.ench[i].id == $('#enchID').val()) {
				foundExisting = true;
				jobject.ench.remove(i);
			}
		};
		refreshOutput();
	});
	$('#destroyAdd').click(function(){
		foundExisting = false;
		if ($('#canDestroy').val() == '') {
			var canDestroy = 'minecraft:stone';
		} else {
			var canDestroy = 'minecraft:'+$('#canDestroy').val();
		}
		if (jobject.CanDestroy != undefined) {
			for (var i = 0; i < jobject.CanDestroy.length; i++) {
				if (jobject.CanDestroy[i] == canDestroy) {
					foundExisting = true;
				}
			};
		} else {
			jobject.CanDestroy = new Array;
		}
		if (!foundExisting) {
			jobject.CanDestroy.push(canDestroy);
		}
		refreshOutput();
	});
	$('#destroyRemove').click(function(){
		foundExisting = false;
		if ($('#canDestroy').val() == '') {
			var canDestroy = 'minecraft:stone';
		} else {
			var canDestroy = 'minecraft:'+$('#canDestroy').val();
		}
		if (jobject.CanDestroy != undefined) {
			for (var i = 0; i < jobject.CanDestroy.length; i++) {
				if (jobject.CanDestroy[i] == canDestroy) {
					jobject.CanDestroy.remove(i,0);
				}
			};
		}
		refreshOutput();
	});
	$('#placeOnAdd').click(function(){
		foundExisting = false;
		if ($('#canPlaceOn').val() == '') {
			var CanPlaceOn = 'minecraft:stone';
		} else {
			var CanPlaceOn = 'minecraft:'+$('#canPlaceOn').val();
		}
		if (jobject.CanPlaceOn != undefined) {
			for (var i = 0; i < jobject.CanPlaceOn.length; i++) {
				if (jobject.CanPlaceOn[i] == CanPlaceOn) {
					foundExisting = true;
				}
			};
		} else {
			jobject.CanPlaceOn = new Array;
		}
		if (!foundExisting) {
			jobject.CanPlaceOn.push(CanPlaceOn);
		}
		refreshOutput();
	});
	$('#placeOnRemove').click(function(){
		foundExisting = false;
		if ($('#canPlaceOn').val() == '') {
			var canPlaceOn = 'minecraft:stone';
		} else {
			var canPlaceOn = 'minecraft:'+$('#canPlaceOn').val();
		}
		if (jobject.CanPlaceOn != undefined) {
			for (var i = 0; i < jobject.CanPlaceOn.length; i++) {
				if (jobject.CanPlaceOn[i] == canPlaceOn) {
					jobject.CanPlaceOn.remove(i,0);
				}
			};
		} else {
			alert("Nothing to remove!");
		}
		refreshOutput();
	});
	$('.hfToggle').click(function(){
		if($(this).hasClass('btn-success')) {
			$(this).removeClass('btn-success').addClass('btn-danger');
		} else {
			$(this).removeClass('btn-danger').addClass('btn-success');
		}
		refreshOutput();
	});
	$('#attrAdd').click(function(){
		if ($('#attributeName').val() != '') {
			if (jobject.AttributeModifiers == undefined) {
				jobject.AttributeModifiers = new Array;
			}
			if ($('#attributeAmount').val() == '') {
				$('#attributeAmount').val('0.1f');
			}
			if ($('#attributeOp').val() == '') {
				$('#attributeOp').val('1');
			}
			var foundExisting = false;
			for (var i = 0; i < jobject.AttributeModifiers.length; i++) {
				if (jobject.AttributeModifiers[i].AttributeName == $('#attributeName').val()) {
					foundExisting = true;
					jobject.AttributeModifiers.remove(i);
				}
			};
			jobject.AttributeModifiers.push({AttributeName:null});
			jobject.AttributeModifiers[jobject.AttributeModifiers.length - 1].AttributeName=$('#attributeName').val();
			jobject.AttributeModifiers[jobject.AttributeModifiers.length - 1].Name=$('#attributeName').val();
			jobject.AttributeModifiers[jobject.AttributeModifiers.length - 1].Amount=$('#attributeAmount').val();
			jobject.AttributeModifiers[jobject.AttributeModifiers.length - 1].Operation=$('#attributeOp').val();
			jobject.AttributeModifiers[jobject.AttributeModifiers.length - 1].UUIDMost=Math.floor(Math.random()*90000) + 10000;
			jobject.AttributeModifiers[jobject.AttributeModifiers.length - 1].UUIDLeast=Math.floor(Math.random()*90000) + 100000;
			refreshOutput();
		}
	});
$('input').change(refreshOutput);
$('input').focusout(refreshOutput);
$('input').focus(refreshOutput);
$('select').change(refreshOutput);
$('select').focusout(refreshOutput);
$('select').focus(refreshOutput);
refreshOutput();
});
