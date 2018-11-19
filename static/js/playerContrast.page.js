var selectedRaritie;
var selectedNation;
var selectedJob;
var leagues;
var selectedLeague;
var selectedClub;
var selectedProgram;
var selectedProgramChild = '';
var selectedSkill;
var programs = [];
var cards = [];
var filter = false;
var filterCards;
var index = 1;
var size = 30;
var dataTable;

var selectedPlayer;
var players = [];
var playerHead = [];
var playerInfo = [];
var maxValue = [];

$(function() {
	initPage();
})

function initPage() {
	$("#raritySelect").multiselect({
		includeSelectAllOption: false,
		selectAllText: ' 全选',
		nonSelectedText: '全部', //没有值的时候button显示值  
		nSelectedText: '个被选中', //有n个值的时候显示n个被选中 
		allSelectedText: '全选', //所有被选中的时候 全选（n）
		enableFiltering: false,
		numberDisplayed: 1,
		filterPlaceholder: '查询',
		onChange: function(option, checked, select) {
			if(checked) {
				selectedRaritie = $(option).val();
			} else {
				selectedRaritie = "";
			}
		}
	});

	$("#jobSelect").multiselect({
		maxHeight: 500,
		includeSelectAllOption: false,
		selectAllText: ' 全选',
		nonSelectedText: '全部', //没有值的时候button显示值  
		nSelectedText: '个被选中', //有n个值的时候显示n个被选中 
		allSelectedText: '全选', //所有被选中的时候 全选（n）
		enableFiltering: false,
		numberDisplayed: 1,
		filterPlaceholder: '查询',
		onChange: function(option, checked, select) {
			if(checked) {
				selectedJob = $(option).val();
			} else {
				selectedJob = "";
			}
		}
	});

	if(localStorage["nation"]) {
		var data = JSON.parse(localStorage["nation"]);
		var select = $('#nationSelect');
		data.forEach(function(item, i) {
			option = $("<option value='" + item.code + "' icon='" + item.icon + "' name='" + item.chname + "'>" + item.chname + "</option>");
			option.appendTo(select);
		});

		select.multiselect({
			maxHeight: 500,
			includeSelectAllOption: false,
			enableFiltering: true,
			filterPlaceholder: '查询',
			nonSelectedText: '请选择...',
			onChange: function(option, checked, select) {
				if(checked) {
					selectedNation = $(option).val();
				} else {
					selectedNation = "";
				}
			}
		});
	} else {
		ajax.get('nation/list', function(result) {
			if(result.data && typeof(result.data) != undefined) {
				localStorage.setItem("nation", JSON.stringify(result.data));
			}
			var select = $('#nationSelect');
			result.data.forEach(function(item, i) {
				option = $("<option value='" + item.code + "' icon='" + item.icon + "' name='" + item.chname + "'>" + item.chname + "</option>");
				option.appendTo(select);
			});

			select.multiselect({
				maxHeight: 500,
				includeSelectAllOption: false,
				enableFiltering: true,
				filterPlaceholder: '查询',
				nonSelectedText: '请选择...',
				onChange: function(option, checked, select) {
					if(checked) {
						selectedNation = $(option).val();
					} else {
						selectedNation = "";
					}
				}
			});
		});
	}

	//localStorage.removeItem("league")
	if(localStorage["league"]) {
		var data = JSON.parse(localStorage["league"]);
		var select = $('#leagueSelect');
		data.forEach(function(item, i) {
			var option = $("<option value='" + item.code + "'>" + item.chname + "</option>");
			option.appendTo(select);
		});

		select.multiselect({
			maxHeight: 500,
			includeSelectAllOption: false,
			enableFiltering: true,
			filterPlaceholder: '查询',
			onChange: function(option, checked, select) {
				if(checked) {
					selectedLeague = $(option).val();
				} else {
					selectedLeague = "";
				}

				selectedClub = "";
				bindClub($(option).val());
			}
		});

		bindClub('');
	} else {
		ajax.get('league/list', function(result) {
			if(result.data && typeof(result.data) != undefined) {
				localStorage.setItem("league", JSON.stringify(result.data));
			}
			var select = $('#leagueSelect');
			result.data.forEach(function(item, i) {
				var option = $("<option value='" + item.code + "'>" + item.chname + "</option>");
				option.appendTo(select);
			});

			select.multiselect({
				maxHeight: 500,
				includeSelectAllOption: false,
				enableFiltering: true,
				filterPlaceholder: '查询',
				onChange: function(option, checked, select) {
					if(checked) {
						selectedLeague = $(option).val();
					} else {
						selectedLeague = "";
					}

					selectedClub = "";
					bindClub($(option).val());
				}
			});

			bindClub('');
		});
	}
	
	localStorage.removeItem("program")
	if(localStorage["program"]) {
		var data = JSON.parse(localStorage["program"]);
		var select = $('#programSelect');
		programs = data;
		programs.forEach(function(item, i) {
			if(item.isShow) {
				if(item.isShow == "1") {
					var option = $("<option value='" + item.chname + "'>" + item.chname + "</option>");
					option.appendTo(select);
				}
			}
		});

		select.multiselect({
			maxHeight: 500,
			includeSelectAllOption: false,
			enableFiltering: true,
			filterPlaceholder: '查询',
			nonSelectedText: '请选择...',
			onChange: function(option, checked, select) {
				if(checked) {
					selectedProgram = $(option).val();
					programs.forEach(function(program, index) {
						if(program.chname == selectedProgram) {
							if(program.childs) {
								if(program.childs.length > 0) {
									bindProgramChild(program.childs);
									$("#programChildDiv").show();
								} else {
									selectedProgramChild = "";
									$("#programChildDiv").hide();
								}
							} else {
								selectedProgramChild = "";
								$("#programChildDiv").hide();
							}
						}
					});
				} else {
					selectedProgram = "";
				}
			}
		});
	} else {
		ajax.get('program/list?gameCode=fifamobile', function(result) {
			if(result.data && typeof(result.data) != undefined) {
				localStorage.setItem("program", JSON.stringify(result.data));
			}
			var select = $('#programSelect');
			programs = result.data;
			programs.forEach(function(item, i) {
				if(item.isShow) {
					if(item.isShow == "1") {
						var option = $("<option value='" + item.chname + "'>" + item.chname + "</option>");
						option.appendTo(select);
					}
				}
			});

			select.multiselect({
				maxHeight: 500,
				includeSelectAllOption: false,
				enableFiltering: true,
				filterPlaceholder: '查询',
				nonSelectedText: '请选择...',
				onChange: function(option, checked, select) {
					if(checked) {
						selectedProgram = $(option).val();
						programs.forEach(function(program, index) {
							if(program.chname == selectedProgram) {
								if(program.childs) {
									if(program.childs.length > 0) {
										bindProgramChild(program.childs);
										$("#programChildDiv").show();
									} else {
										selectedProgramChild = "";
										$("#programChildDiv").hide();
									}
								} else {
									selectedProgramChild = "";
									$("#programChildDiv").hide();
								}
							}
						});
					} else {
						selectedProgram = "";
					}
				}
			});
		});
	}

	//localStorage.removeItem("skill")
	if(localStorage["skill"]) {
		var data = JSON.parse(localStorage["skill"]);
		var select = $('#skillSelect');
		data.forEach(function(item, i) {
			var option = $("<option value='" + item.code + "'>" + item.name + "</option>");
			option.appendTo(select);
		});

		select.multiselect({
			maxHeight: 500,
			includeSelectAllOption: false,
			enableFiltering: true,
			filterPlaceholder: '查询',
			nonSelectedText: '请选择...',
			onChange: function(option, checked, select) {
				if(checked) {
					selectedSkill = $(option).val();
				} else {
					selectedSkill = "";
				}
			}
		});
	} else {
		ajax.get('skill/list?gameCode=fifamobile', function(result) {
			if(result.data && typeof(result.data) != undefined) {
				localStorage.setItem("skill", JSON.stringify(result.data));
			}
			var select = $('#skillSelect');
			result.data.forEach(function(item, i) {
				var option = $("<option value='" + item.code + "'>" + item.name + "</option>");
				option.appendTo(select);
			});

			select.multiselect({
				maxHeight: 500,
				includeSelectAllOption: false,
				enableFiltering: true,
				filterPlaceholder: '查询',
				nonSelectedText: '请选择...',
				onChange: function(option, checked, select) {
					if(checked) {
						selectedSkill = $(option).val();
					} else {
						selectedSkill = "";
					}
				}
			});
		});
	}

	$("#sortSelect").multiselect({
		maxHeight: 500,
		includeSelectAllOption: false,
		selectAllText: ' 全选',
		nonSelectedText: '全部', //没有值的时候button显示值  
		nSelectedText: '个被选中', //有n个值的时候显示n个被选中 
		allSelectedText: '全选', //所有被选中的时候 全选（n）
		enableFiltering: false,
		numberDisplayed: 1,
		filterPlaceholder: '查询',
		onChange: function(option, checked, select) {
			if(checked) {
				if($(option).val()) {
					dataTable.order([parseInt($(option).val()), "desc"]).draw();
				}
			}
		}
	});

	//bindData();

	$('#playerList tbody').on('click', 'tr', function() {
		var data = dataTable.row(this).data();
		buildInfo(data.code);
		$('#playerSelect').modal('hide');
	});
}

function bindClub(lcode) {
	//localStorage.removeItem("club")
	if(localStorage["club"] && lcode == '') {
		var data = JSON.parse(localStorage["club"]);
		var select = $('#clubSelect');
		select.empty();
		var option = $("<option value=''>全部</option>");
		option.appendTo(select);
		data.forEach(function(item, i) {
			var option = $("<option value='" + item.code + "'>" + item.chname + "</option>");
			option.appendTo(select);
		});

		select.multiselect('destroy').multiselect({
			maxHeight: 500,
			includeSelectAllOption: false,
			enableFiltering: true,
			filterPlaceholder: '查询',
			nonSelectedText: '请选择...',
			onChange: function(option, checked, select) {
				if(checked) {
					selectedClub = $(option).val();
				} else {
					selectedClub = "";
				}
			}
		});
	} else {
		ajax.get('club/list?lcode=' + lcode, function(result) {
			if(result.data && typeof(result.data) != undefined && lcode == '') {
				localStorage.setItem("club", JSON.stringify(result.data));
			}
			var select = $('#clubSelect');
			select.empty();
			var option = $("<option value=''>全部</option>");
			option.appendTo(select);
			result.data.forEach(function(item, i) {
				var option = $("<option value='" + item.code + "'>" + item.chname + "</option>");
				option.appendTo(select);
			});

			select.multiselect('destroy').multiselect({
				maxHeight: 500,
				includeSelectAllOption: false,
				enableFiltering: true,
				filterPlaceholder: '查询',
				nonSelectedText: '请选择...',
				onChange: function(option, checked, select) {
					if(checked) {
						selectedClub = $(option).val();
					} else {
						selectedClub = "";
					}
				}
			});
		});
	}
}

function bindProgramChild(childs) {
	var select = $('#programChildSelect');
	select.empty();
	var option = $("<option value=''>全部</option>");
	option.appendTo(select);
	childs.forEach(function(item, i) {
		var option = $("<option value='" + item.chname + "'>" + item.chname + "</option>");
		option.appendTo(select);
	});

	select.multiselect('destroy').multiselect({
		maxHeight: 500,
		includeSelectAllOption: false,
		enableFiltering: true,
		filterPlaceholder: '查询',
		nonSelectedText: '请选择...',
		onChange: function(option, checked, select) {
			if(checked) {
				selectedProgramChild = $(option).val();
			} else {
				selectedProgramChild = "";
			}
		}
	});
}

function bindData() {
	$("#selectFilter").hide();
	$("#wailt").show();
	$("#playerList").hide();

	var args = "";

	var name = $("#name").val();
	if(name) {
		args += '&n=' + encodeURI(name);
	}

	if(selectedRaritie) {
		args += '&r=' + selectedRaritie;
	}

	if(selectedJob) {
		args += '&j=' + selectedJob;
	}

	if(selectedNation) {
		args += '&nc=' + selectedNation;
	}

	if(selectedLeague) {
		args += '&lc=' + selectedLeague;
	}

	if(selectedClub) {
		args += '&cc=' + selectedClub;
	}

	if(selectedProgram) {
		var program = selectedProgram;
		if(selectedProgramChild) {
			program = selectedProgram + "-" + selectedProgramChild;
		}
		args += '&pc=' + encodeURI(program);
	}

	if(selectedSkill) {
		args += '&b=' + selectedSkill;
	}

	var foot = $("#footSelect").val();
	if(foot) {
		args += '&f=' + encodeURI(foot);
	}

	var height = $("#height").val();
	if(height) {
		args += '&h=' + h;
	}

	var scoreMin = $("#scoreMin").val();
	var scoreMax = $("#scoreMax").val();
	if(scoreMin || scoreMax) {
		if(scoreMin) {
			args += '&mi=' + scoreMin;
		}

		if(scoreMax) {
			args += '&ma=' + scoreMax;
		}
	}

	ajax.get('fifa/list2?1=1' + args, function(result) {
		cards = result.data;

		$("#wailt").hide();
		$("#playerList").show();

		buildCardList(cards)
	});
}

function buildInfo(code) {
	var max = 5;
	if(!IsPC()) {
		max = 3;
	}
	if(players.length < max) {
		ajax.get('fifamobile/card/detail?code=' + code, function(data) {
			ajax.get('levelup/list?gameCode=fifamobile&type=1&code=' + data.basicInfo.jobCode + '&level=' + data.basicInfo.score, function(result) {
				data.train = {};
				result.data.forEach(function(item) {
					data.train[item.level] = {};
					data.train[item.level].values = item.capabilityValues;
				})

				ajax.get('levelup/list?gameCode=fifamobile&type=2&code=' + data.skills.code + '&level=0', function(result) {
					data.boost = {};
					result.data.forEach(function(item) {
						data.boost[item.level] = {};
						data.boost[item.level].values = item.capabilityValues;
					})
					data.values = [];
					for(var i = 0; i < 20; i++) {
						data.values.push(data.capabilityValues.extend[i]);
					}
					data.selectTrain = data.basicInfo.score;
					data.selectBoost = 0;
					players.push(data);
					compare();
				});
			});
		});
	}
}

function deletePlayer(i) {
	players.splice(i, 1);
	compare();
}

function compare() {
	if(players.length == 0) {
		$("#msg").show();
		$("#compare").hide();
	} else {
		$("#msg").hide();
		$("#compare").show();
	}

	$("div[type]").show();
	for(var i = 0; i < 28; i++) {
		maxValue[i] = 0;
	}
	var heads = $("#heads");
	var infos = $("#infos");

	playerHead.forEach(function(item, i) {
		item.remove();
	});

	playerInfo.forEach(function(item, i) {
		item.remove();
	});

	players.forEach(function(player, i) {
		valueRefresh(player.code);
	})

	players.forEach(function(player, i) {
		var headBox = $('<div class="col-sm-2 col-xs-3 compare-column"></div>');
		var c = 'compare';
		if(!IsPC()) {
			c = 'mcompare'
		}
		var item = $("<div class='fm-card-img " + c + "'><img id='bg_" + player.code + "' class='background' width='100%' src='" +
			getBackground(player.basicInfo.programInfo.name, player.rarityValue, parseInt(player.selectTrain) + parseInt(player.selectBoost), player.basicInfo.programInfo.havebackground, player.basicInfo.bg) +
			"'><img id='head_" + player.code + "' class='player-img' width='100%' src='" +
			getHead(player.basicInfo.programInfo.name, player.basicInfo.no, parseInt(player.selectTrain) + parseInt(player.selectBoost), player.basicInfo.headcalcscore, player.basicInfo.head, player.basicInfo.headcount, player.basicInfo.havaas) + "'></div>");
		item.appendTo(headBox);

		item = $('<h5>' + player.name + '</h5>');
		item.appendTo(headBox);

		item = $('<button type="button" class="btn red btn-xs margin-bottom-10" onclick="deletePlayer(' + i + ')">删除球员</button>');
		item.appendTo(headBox);

		var levelSelect = '<select id="train_' + player.code + '" class="form-control">';
		for(var i = parseInt(player.basicInfo.score); i <= 100; i++) {
			levelSelect += '<option value="' + i + '">' + i + '</option>';
		}
		levelSelect += '</select>';
		item = $('<div class="compare-row compare-label">' + levelSelect + '</div>');
		item.appendTo(headBox)

		var skillSelect = '<select id="boost_' + player.code + '" class="form-control">';
		for(var i = 0; i <= 20; i++) {
			skillSelect += '<option value="' + i + '">' + i + '</option>';
		}
		skillSelect += '</select>';
		item = $('<div class="compare-row compare-label">' + skillSelect + '</div>');
		item.appendTo(headBox)

		headBox.appendTo(heads);
		playerHead.push(headBox);

		var infoBox = $('<div class="col-sm-2 col-xs-3 compare-column"></div>');

		item = $('<div class="compare-row compare-label"></div>');
		item.appendTo(infoBox)

		item = $('<div id="score_' + player.code + '" type="info" class="compare-row compare-label">' + (parseInt(player.selectTrain) + parseInt(player.selectBoost)) + '</div>');
		item.appendTo(infoBox)

		item = $('<div type="info" class="compare-row compare-label">' + player.basicInfo.job + '</div>');
		item.appendTo(infoBox)

		item = $('<div type="info" class="compare-row compare-label">' + (player.basicInfo.height ? player.basicInfo.height + 'cm' : '-') + '</div>');
		item.appendTo(infoBox)

		item = $('<div type="info" class="compare-row compare-label">' + (player.basicInfo.foot ? player.basicInfo.foot : '-') + '</div>');
		item.appendTo(infoBox)

		item = $('<div type="info" class="compare-row compare-label">' + player.skills.name + '</div>');
		item.appendTo(infoBox)

		item = $('<div type="info" class="compare-row compare-label">' + (player.basicInfo.traits ? player.basicInfo.traits : '') + '</div>');
		item.appendTo(infoBox)

		item = $('<div class="compare-row compare-label"><div></div></div>');
		item.appendTo(infoBox)

		var total = 0;
		values = getBasicValues(player.basicInfo.jobCode, player.values)
		for(var i = 0; i < 6; i++) {
			total += parseInt(values[i]);
			item = $('<div id="value' + i + '_' + player.code + '" type="basic" class="compare-row compare-label" index="' + i + '" data="' + values[i] + '">' + values[i] + '</div>');
			if(maxValue[i] < parseInt(values[i])) {
				maxValue[i] = parseInt(values[i]);
			}
			item.appendTo(infoBox);
		}

		item = $('<div id="value6_' + player.code + '" type="basic" class="compare-row compare-label" index="6" data="' + total + '">' + total + '</div>');
		if(maxValue[6] < total) {
			maxValue[6] = total;
		}
		item.appendTo(infoBox);

		item = $('<div class="compare-row compare-label"></div>');
		item.appendTo(infoBox);

		total = 0;
		for(var i = 0; i < 20; i++) {
			total += parseInt(player.values[i]);
			item = $('<div id="value' + (i + 7) + '_' + player.code + '" type="extend" class="compare-row compare-label" index="' + (i + 7) + '" data="' + player.values[i] + '">' + player.values[i] + '</div>');
			if(maxValue[i + 7] < parseInt(player.values[i])) {
				maxValue[i + 7] = parseInt(player.values[i]);
			}
			item.appendTo(infoBox)
		}

		item = $('<div id="value27_' + player.code + '" type="extend" class="compare-row compare-label" index="27" data="' + total + '">' + total + '</div>');
		if(maxValue[27] < total) {
			maxValue[27] = total;
		}
		item.appendTo(infoBox)

		infoBox.appendTo(infos);
		playerInfo.push(infoBox);

		$("#train_" + player.code).val(player.selectTrain);
		$("#train_" + player.code).bind('change', function() {
			player.selectTrain = $("#train_" + player.code).val();
			playerInfoChange(player.code);
		});

		$("#boost_" + player.code).val(player.selectBoost);
		$("#boost_" + player.code).bind('change', function() {
			player.selectBoost = $("#boost_" + player.code).val();
			playerInfoChange(player.code);
		});
	});

	$(".compare-label[index]").addClass("font-grey-salt");
	for(var i = 0; i < 28; i++) {
		$(".compare-label[index='" + i + "'][data='" + maxValue[i] + "']").addClass("font-red bold");
	}
}

function playerInfoChange(code) {
	compare();
}

function valueRefresh(code) {
	players.forEach(function(player, i) {
		if(player.code == code) {
			player.values = [];
			for(var i = 0; i < 20; i++) {
				player.values.push(player.capabilityValues.extend[i]);
			}

			for(var i = parseInt(player.basicInfo.score) + 1; i <= parseInt(player.selectTrain); i++) {
				for(var j = 0; j < 20; j++) {
					if(parseInt(player.values[j]) + parseInt(player.train[i].values[j]) > 120) {
						player.values[j] = 120;
					} else {
						player.values[j] = parseInt(player.values[j]) + parseInt(player.train[i].values[j]);
					}
				}
			}

			if(parseInt(player.selectBoost) > 0) {
				for(var i = 0; i < 20; i++) {
					if(parseInt(player.boost[parseInt(player.selectBoost)].values[i]) > 0) {
						var value = parseInt(player.values[i]);
						value = value + Math.round(parseInt(player.values[i]) * parseInt(player.boost[parseInt(player.selectBoost)].values[i]) / 100);
						if(value > 140) {
							player.values[i] = 140;
						} else {
							player.values[i] = value;
						}
					}
				}
			}
		}
	});

}

function buildCardList(cards) {
	if(dataTable) {
		dataTable.clear();
		dataTable.destroy();
	}

	cards.forEach(function(card, i) {
		var values = getBasicValues(card.basicInfo.jobCode, card.capabilityValues.extend);
		card.values = values;
	});

	dataTable = $('#playerList').DataTable({
		"data": cards,
		"deferRender": true,
		"destroy": true,
		columnDefs: [{
			targets: 0,
			orderable: false,
			width: "10%",
			render: function(data, type, row, meta) {
				return "<div class='fm-card-img'><img class='background' height='60' src='" +
					getBackground(row.basicInfo.programInfo.name, row.rarityValue, row.basicInfo.score, row.basicInfo.programInfo.havebackground, row.basicInfo.bg) +
					"'><img class='player-img' height='60' src='" +
					getHead(row.basicInfo.programInfo.name, row.basicInfo.no, row.basicInfo.score, row.basicInfo.headcalcscore, row.basicInfo.head, row.basicInfo.headcount, row.basicInfo.havaas) + "'></div>";
			}
		}, {
			targets: 1,
			width: "10%",
			render: function(data, type, row, meta) {
				return "<span class='bold'>" + row.basicInfo.score + "</span>";
			}
		}, {
			targets: 2,
			width: "50%",
			render: function(data, type, row, meta) {
				var html = "<span style='font-size:16px;' class='bold'>" + row.name + "</span>";
				html += "</br><span>" + row.basicInfo.job + "</span>";
				if(row.basicInfo.nationInfo) {
					html += " | <img style='width: 24px' title='" + row.basicInfo.nationInfo.name + "' src='" + row.basicInfo.nationInfo.icon + "'>";
				}

				if(row.basicInfo.leagueInfo) {
					html += " | <img style='width: 24px' title='" + row.basicInfo.leagueInfo.name + "' src='" + row.basicInfo.leagueInfo.icon + "'>";
				}

				if(row.basicInfo.clubInfo) {
					html += " | <img style='width: 24px' title='" + row.basicInfo.clubInfo.name + "' src='" + row.basicInfo.clubInfo.icon + "'>";
				}
				html += "</br><span>" + (row.basicInfo.programInfo.code == 'basic' ? '基本球员' : (row.basicInfo.programInfo.code == 'wc' ? '世界杯球员' : row.basicInfo.programInfo.name)) + "</span>";
				return html;
			}
		}, {
			targets: 3,
			width: "15%",
			render: function(data, type, row, meta) {
				return "<span class='bold'>" + (parseInt(row.values[0]) + parseInt(row.values[1]) +
					parseInt(row.values[2]) + parseInt(row.values[3]) + parseInt(row.values[4]) +
					parseInt(row.values[5])) + "</span>";
			}
		}, {
			targets: 4,
			width: "15%",
			render: function(data, type, row, meta) {
				var value = 0;
				for(var i = 0; i < row.capabilityValues.extend.length; i++) {
					value += parseInt(row.capabilityValues.extend[i]);
				}
				return "<span class='bold'>" + value.toString() + "</span>";
			}
		}, {
			targets: 5,
			className: "hidden",
			render: function(data, type, row, meta) {
				return "<span class='bold'>" + row.values[0] + "</span>";
			}
		}, {
			targets: 6,
			className: "hidden",
			render: function(data, type, row, meta) {
				return "<span class='bold'>" + row.values[1] + "</span>";
			}
		}, {
			targets: 7,
			className: "hidden",
			render: function(data, type, row, meta) {
				return "<span class='bold'>" + row.values[2] + "</span>";
			}
		}, {
			targets: 8,
			className: "hidden",
			render: function(data, type, row, meta) {
				return "<span class='bold'>" + row.values[3] + "</span>";
			}
		}, {
			targets: 9,
			className: "hidden",
			render: function(data, type, row, meta) {
				return "<span class='bold'>" + row.values[4] + "</span>";
			}
		}, {
			targets: 10,
			className: "hidden",
			render: function(data, type, row, meta) {
				return "<span class='bold'>" + row.values[5] + "</span>";
			}
		}, {
			targets: 11,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[0];
			}
		}, {
			targets: 12,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[1];
			}
		}, {
			targets: 13,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[2];
			}
		}, {
			targets: 14,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[3];
			}
		}, {
			targets: 15,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[4];
			}
		}, {
			targets: 16,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[5];
			}
		}, {
			targets: 17,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[6];
			}
		}, {
			targets: 18,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[7];
			}
		}, {
			targets: 19,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[8];
			}
		}, {
			targets: 20,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[9];
			}
		}, {
			targets: 21,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[10];
			}
		}, {
			targets: 22,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[11];
			}
		}, {
			targets: 23,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[12];
			}
		}, {
			targets: 24,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[13];
			}
		}, {
			targets: 25,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[14];
			}
		}, {
			targets: 26,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[15];
			}
		}, {
			targets: 27,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[16];
			}
		}, {
			targets: 28,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[17];
			}
		}, {
			targets: 29,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[18];
			}
		}, {
			targets: 30,
			className: "hidden",
			render: function(data, type, row, meta) {
				return row.capabilityValues.extend[19];
			}
		}],
		"bRetrieve": true,
		"searching": false,
		"lengthChange": false,
		"pageLength": 10,
		"deferRender": true,
		"language": {
			"lengthMenu": "显示 _MENU_ 条记录",
			"loadingRecords": "请等待，数据正在加载中......",
			"infoEmpty": "没有记录可以显示",
			"emptyTable": "无可用数据",
			"info": "",
			"paginate": {
				"first": "<<",
				"last": ">>",
				"next": ">",
				"previous": "<"
			}
		}
	});

	setTimeout(function() {
		$("#dataTables_paginate").parent().removeClass("col-md-7");
	}, 5000)
}

function clearFilter() {
	$("#name").val('');
	$("#height").val('');
	$("#foot").val('');

	$("#scoreMin").val('');
	$("#scoreMax").val('');

	$("#nationSelect").multiselect("deselect", selectedNation);
	selectedNation = "";

	$("#raritySelect").multiselect("deselect", selectedRaritie);
	selectedRaritie = "";

	$("#jobSelect").multiselect("deselect", selectedJob);
	selectedJob = "";

	$("#leagueSelect").multiselect("deselect", selectedLeague);
	selectedLeague = "";

	$("#clubSelect").multiselect("deselect", selectedClub);
	selectedClub = "";

	$("#programSelect").multiselect("deselect", selectedProgram);
	selectedProgram = "";
	selectedProgramChild = "";
	$("#programChildDiv").hide();

	$("#skillSelect").multiselect("deselect", selectedSkill);
	selectedSkill = "";
}