$(function() {
	initParts();
	setTimeout(function() {
		initCommonModule();
	}, 1000);
})

function initParts() {
	$("#banner").load("parts/banner.html");
	$("#functions").load("parts/functions.html");
}

function initCommonModule() {
	ajax.get('count?code=fifamobile', function(data) {
		$("#cardTotal").text(data.cardTotal);
	});
}

/**
 * 调用html2canvas框架进行截图下载功能
 * @param domId 容器Id
 * author Levin
 */
function domShot(domId) {
	//0.5.0-beta4方法
	html2canvas(document.querySelector("#" + domId), {
		allowTaint: true,
		height: $("#" + domId).outerHeight() + 20
	}).then(function(canvas) {
		var timestamp = Date.parse(new Date());
		$('#down_button').attr('href', canvas.toDataURL());
		$('#down_button').attr('download', timestamp + '.png');
		var fileObj = document.getElementById("down_button");
		fileObj.click();
	});
}

function getBackground(pn, r, score, hb, bg) {
	var imgUrl = "http://img.wantuole.com/resources/backgrouds/";
	var num = 0;
	var imgName = "";
	if(parseInt(hb) > 0) {
		num = parseInt((parseInt(score) - 70) / 10);
		if(bg == "CGER" || bg == 'SC' || bg == 'TC' || bg == 'T' || bg == 'TDYX' || pn.indexOf('剧情精英球员') >= 0 || bg == 'ZCBase')
			num = parseInt((parseInt(score) - 50) / 10);
		else if(bg == 'JLBZ')
			num = parseInt((parseInt(score) - 60) / 10);
		if(pn == '世界杯球员') {
			if(num > 4) {
				num = 4;
			}
		}
		imgName = bg + num + ".png";
	} else {
		num = parseInt((parseInt(score) - 50) / 10);
		if(bg != "BASIC") {
			imgName = bg + num + ".png";
		} else {
			switch(parseInt(r)) {
				case 1:
					imgName = "";
					break;
				case 2:
					imgName = "MR";
					break;
				case 3:
					imgName = "ER";
					break;
				case 4:
					imgName = "GR";
					break;
				case 5:
					imgName = "SR";
					break;
				case 6:
					imgName = "BR";
					break;
			}
			imgName = imgName + num + ".png";
		}
	}
	imgUrl = imgUrl + imgName;
	return imgUrl;
}

function getHead(pn, no, score, calcscore, head, count, haveas) {
	var imgUrl = "http://img.wantuole.com/FIFA%E8%B6%B3%E7%90%83%E4%B8%96%E7%95%8C/players/";
	if(pn == '世界杯球员') {
		var imgUrl = "http://img.wantuole.com/FIFA%E8%B6%B3%E7%90%83%E4%B8%96%E7%95%8C/wcplayers/";
	}
	var num = 0;
	var imgName = "";

	if(parseInt(haveas) == 1) {
		if(parseInt(score) >= 80) {
			if(calcscore)
				imgName = no + "_AS" + calcscore + ".png";
			else
				imgName = no + "_AS.png";
		} else {
			imgName = no + ".png";
		}
	} else {
		if(head == "TOTW") {
			if(score) {
				imgName = no + "_" + head + calcscore + ".png";
			} else {
				imgName = no + "_" + head + ".png";
			}
		} else {
			if(parseInt(count) > 1) {
				num = parseInt((parseInt(score) - calcscore) / 10);
				if(head == "IC" || head == "PI") {
					if(num == 0)
						num = 1;
				}

				if(num > count)
					num = count;
				imgName = no + "_" + head + num + ".png";
			} else {
				if(head) {
					if(parseInt(score) >= 80) {
						imgName = no + "_" + head + ".png";
						if(head == 'MM') {
							if(score >= 100) {
								imgName = no + "_L" + head + ".png";
							}
						} else if(head == 'LVL') {
							if(score >= 100) {
								imgName = no + "_LVLM.png";
							}
						}
					} else {
						if(calcscore == -1) {
							imgName = no + "_" + head + ".png";
						} else {
							imgName = no + ".png";
						}
					}
				} else
					imgName = no + ".png";
			}
		}
	}
	imgUrl = imgUrl + imgName;
	return imgUrl;
}

function getBasicValues(job, values) {
	var basicValues = [];
	if(job != 'GK') {
		basicValues[0] = Math.floor(values[1] * 0.45 + values[0] * 0.55);
		basicValues[1] = Math.floor(values[6] * 0.45 + values[7] * 0.20 + values[8] * 0.25 + values[16] * 0.1);
		basicValues[2] = Math.floor(values[17] * 0.45 + values[18] * 0.25 + values[19] * 0.3);
		basicValues[3] = Math.floor(values[4] * 0.55 + values[3] * 0.3 + values[15] * 0.15);
		basicValues[4] = Math.floor(values[11] * 0.50 + values[10] * 0.35 + values[5] * 0.15);
		basicValues[5] = Math.floor(values[2] * 0.6 + values[12] * 0.4);

	} else {
		basicValues[0] = values[6];
		basicValues[1] = values[7];
		basicValues[2] = values[9];
		basicValues[3] = values[8];
		basicValues[4] = Math.round(values[17] * 0.35 + values[18] * 0.3 + values[19] * 0.3 + values[16] * 0.05);
		basicValues[5] = Math.round(values[2] * 0.6 + values[12] * 0.4);
	}

	return basicValues;
}

//方法一:逐个字符检查是否中文字符
String.prototype.getByteLen = function() {
	var len = 0;
	for(var i = 0; i < this.length; i++) {
		if((this.charCodeAt(i) & 0xff00) != 0)
			len++;
		len++;
	}
	return len;
}