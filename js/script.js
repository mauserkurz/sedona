(function() {
	"use strict";
	// jquery ui слайдер для цен
	$('#double-slider').slider({
		min: 0,
		max: 3650,
		orientation: "horizontal",
		animate: true,
		range: true,
		step: 1,
		values: [0, 3000],
		slide: function(event, ui) {
			$('#price-min').val(ui.values[0]);
			$('#price-max').val(ui.values[1]);
		}
	});
	// обработчик ввода минимальной цены с изменением позиций слайдера цен
	$('#price-min').bind('input', function() {
		var min = $('#price-min').val();
		var max = $('#price-max').val();
		$('#double-slider').slider( "option", "values", [min, max] );
	});
	// обработчик ввода максимальной цены с изменением позиций слайдера цен
	$('#price-max').bind('input', function() {
		var min = $('#price-min').val();
		var max = $('#price-max').val();
		$('#double-slider').slider( "option", "values", [min, max] );
	});
	// плавный скрол к карте для 1-й якорь-ссылки в основной навигации
	$('a[href^="#map-of-sedona"]').bind('click',function () {
		var target = this.hash;
		var $target = $(target);
		var $body = $('html, body');
		$body.stop().animate({
			'scrollTop': $target.offset().top
		}, 900, 'swing', function () {
			window.location.hash = target;
		});
	});
	// открывает и закрывает меню навигации по клику на гамбургер
	$('#hamb').bind('click', function (event) {
		event.preventDefault();
		$('#main-nav').toggleClass('show');
	});
	// закрывает меню навигации по клику на крестик
	$('#cross').bind('click', function (event) {
		event.preventDefault();
		if ($('#main-nav').hasClass('show')) {
			$('#main-nav').removeClass('show');
		}
	});
	// закрывает меню навигации по клику на ссылку навигации
	$('#nav-list li a').bind('click', function () {
		if ($('#main-nav').hasClass('show')) {
			$('#main-nav').removeClass('show');
		}
	});
	// google карта седоны
	if ($('#map-of-sedona')) {
		var init = function initMap() {
			var myLatlng = new google.maps.LatLng(34.8543784,-111.7951384);
			var myOptions = {
				zoom: 11,
				center: myLatlng
			};
			new google.maps.Map(document.getElementById('map-of-sedona'), myOptions);
		};
		$(window).bind('load', init);
		$(window).bind('resize', init);
	}
	// открывает и закрывает меню поиска на основной странице
	$('#search-hotels').slideUp(0);
	$('#btn-search').bind('click', function (event) {
		event.preventDefault();
		$('#search-hotels').slideToggle(200);
	});
	// функция принимающая обьекты dom - кнопки плюс 1 и минус 1, 1 место вывода числа, задает их функционал и соотношение
	function ButtonsCounter(btnPlus, btnMinus, output) {
		// кнопка минус 1
		btnMinus.bind('click', function(event) {
			event.preventDefault();
			var value = parseInt(output.val(), 10);
			if (isNaN(value) || value <= 0) {
				value = 0;
			}
			else {
				value--;
			}
			output.val(value);
		});
		// кнопка плюс 1
		btnPlus.bind('click', function(event) {
			event.preventDefault();
			var value = parseInt(output.val(), 10);
			if (isNaN(value) || value < 0) {
				value = 0;
			}
			else {
				value++;
			}
			output.val(value);
		});
	}
	// использование вышележащей функции для кнопок в меню поиска на главной странице
	ButtonsCounter($('#adult-plus'), $('#adult-minus'), $('#adult'));
	ButtonsCounter($('#kids-plus'), $('#kids-minus'), $('#kids'));
	// календари для ввода дат в меню поиска отелей
	// настройки русскоязычной версии
	$.datepicker.regional.ru = {
		monthNames: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		firstDay: 1,
	};
	// календарь заезда
	$.datepicker.setDefaults($.datepicker.regional.ru);
	$('#date-lab').datepicker({
		minDate: 0,
		maxDate: '+1y',
		dateFormat: 'dd MM yy'
		
	});
	// календарь выезда
	$('#date-exit').datepicker({
		minDate: 0,
		maxDate: '+1y',
		dateFormat: 'dd MM yy'
	});
	// кнопка-переключатель каллендаря формы поиска
	var showExit = false;
	var showLab = false;
	// кнопка календаря для даты выезда
	$('#exit-calendar').bind('click', function(event) {
		event.preventDefault();
		if (!showExit) {
			// показать календарь
			$('#date-exit').datepicker('show');
			showExit = true;
		}
		else {
			// скрыть календарь
			$('#date-exit').datepicker('hide');
			showExit = false;
		}
	});
	// кнопка календаря для даты заезда
	$('#lab-calendar').bind('click', function(event) {
		event.preventDefault();
		if (!showLab) {
			// показать календарь
			$('#date-lab').datepicker('show');
			showLab = true;
		}
		else {
			// скрыть календарь
			$('#date-lab').datepicker('hide');
			showLab = false;
		}
	});
	// валидатор формы поиска отелей
	// вылидация значений колличества взрослых и детей
	function validNumberInput(num, nonZero) {
		var value = parseInt(num, 10);
		if (isNaN(value) || value < 0) {
			return false;
		}
		else if (nonZero === true && value === 0) {
			return false;
		}
		else {
			return true;
		}
	}
	// валидация корректности введенных дат
	function validDate(CheckingDate) {
		var labValue = CheckingDate.split(' ');
		// введены ли 3 последовательности символов через пробел
		if (labValue.length === 3) {
			var year = parseInt(labValue[2], 10);
			var month = labValue[1].toUpperCase();
			var day = parseInt(labValue[0], 10);
			var areMonth = false;
			var monthes = ['ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ', 'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'];
			var monthNum;
			// корректность ввода месяца, и поиск его номера
			for (var i = 0; i < monthes.length; i++) {
				if (month === monthes[i]) {
					areMonth = true;
					monthNum = i + 1;
				}
			}
			// правильность введенного года
			if (isNaN(year) || year <= 2000 || year >= 2100) {
				return false;
			}
			// не корректно введен месяц
			else if (!areMonth){
				return false;
			}
			// если верны месяц и год, расчет и сравнения правильности даты месяца
			else {
				var monthDays = 30;
				var dayMax = [1, 3, 5, 7, 8, 10, 12];
				// проверка на 29 или 28 февраля
				if (monthNum === 2) {
					if (year % 4 === 0) {
						monthDays = 29;
					}
					else {
						monthDays = 28;
					}
				}
				// проверка на 30 или 31 день в месяце
				else {
					for (var k = 0; k < dayMax.length; k++) {
						if (monthNum === dayMax[k]) {
							monthDays = 31;
						}
					}
				}
				// если день введен неправильно
				if (isNaN(day)) {
					return false;
				}
				// если день отрицательный или 0
				else if (!isNaN(day) && day <= 0) {
					return false;
				}
				// если дней больше чем в введенном месяце
				else if (day > monthDays) {
					return false;
				}
				// все проверки пройдены
				else {
					return true;
				}
			}
		}
		// есл не введены ли 3 последовательности символов через пробел
		else {
			return false;
		}
	}
	// проверка на правельный период заезд-выезд
	function validPeriod(beginDate,endDate) {
		var date = new Date();
		var timeZone = -1*(date.getTimezoneOffset()/60);
		var nowDate = new Date(date.setHours(timeZone, 0, 0, 0));
		var nowDateUnix = nowDate.getTime();
		var plusYearUnix = nowDate.setFullYear(nowDate.getFullYear() + 1);
		// функция перевода введенной даты на английский
		function monthTranslate(ruDate) {
			var ruDateArrey = ruDate.split(' ');
			var month = ruDateArrey[1].toUpperCase();
			var lib = [['ЯНВАРЯ', 'January'], ['ФЕВРАЛЯ', 'February'], ['МАРТА', 'March'], ['АПРЕЛЯ', 'April'], ['МАЯ', 'May'], ['ИЮНЯ', 'June'], ['ИЮЛЯ', 'July'], ['АВГУСТА', 'August'], ['СЕНТЯБРЯ', 'September'], ['ОКТЯБРЯ', 'October'], ['НОЯБРЯ', 'November'], ['ДЕКАБРЯ', 'December']];
			for (var a = 0; a < lib.length; a++) {
				if (month === lib[a][0]) {
					month = lib[a][1];
				}
			}
			ruDateArrey.splice(1, 1, month);
			var engDateArrey = ruDateArrey;
			return engDateArrey;
		}
		// функция перевода введенной английской даты в машинный формат
		function arreyToDate(arr) {
			var time = new Date(arr);
			var date = new Date(time.setHours(timeZone, 0, 0, 0));
			return date;
		}
		// перевод в машинный формат дат заезд-выезд
		var beginDateUnix = arreyToDate(monthTranslate(beginDate));
		beginDateUnix = beginDateUnix.getTime();
		var endDateUnix = arreyToDate(monthTranslate(endDate));
		endDateUnix = endDateUnix.getTime();
		var validate = 0;
		// если дата заезда познее или равна сегодня и раньше или равна сегодня + 1 год
		if ((beginDateUnix >= nowDateUnix) && (beginDateUnix <= plusYearUnix)) {
			validate++;
			$('#date-lab').removeAttr('style');
		}
		else {
			$('#date-lab').css('outline', '1px solid red');
		}
		// если дата выезда познее или равна сегодня и познее или равна дате заезда и раньше или равна сегодня + 1 год
		if ((endDateUnix >= nowDateUnix) && (endDateUnix >= beginDateUnix) && (endDateUnix <= plusYearUnix)) {
			$('#date-exit').removeAttr('style');
			validate++;
		}
		else {
			$('#date-exit').css('outline', '1px solid red');
		}
		// если даты заезда и выезда валидны
		if (validate === 2) {
			return true;
		}
		else {
			return false;
		}
	}
	// проверка введены ли вообще данные
	function requiredValue() {
		var adult = $('#adult').val();
		var labDate = $('#date-lab').val();
		var exitDate = $('#date-exit').val();
		if (adult && labDate && exitDate) {
			$('#adult').removeAttr('style');
			$('#date-lab').removeAttr('style');
			$('#date-exit').removeAttr('style');
			return true;
		}
		else {
			if(!adult) {
				$('#adult').css('outline', '1px solid red');
			}
			else {
				$('#adult').removeAttr('style');
			}
			if(!labDate) {
				$('#date-lab').css('outline', '1px solid red');
			}
			else {
				$('#date-lab').removeAttr('style');
			}
			if (!exitDate) {
				$('#date-exit').css('outline', '1px solid red');
			}
			else {
				$('#date-exit').removeAttr('style');
			}
			return false;
		}
	}
	// вставка последних данных с использованием localStorage в меню поиска
	var adultStorage = localStorage.getItem('adult');
	var kidsStorage = localStorage.getItem('kids');
	var labDateStorage = localStorage.getItem('labDate');
	var exitDateStorage = localStorage.getItem('exitDate');
	if(adultStorage) {
		$('#adult').val(adultStorage);
	}
	if(kidsStorage) {
		$('#kids').val(kidsStorage);
	}
	if(labDateStorage) {
		$('#date-lab').val(labDateStorage);
	}
	if(exitDateStorage) {
		$('#date-exit').val(exitDateStorage);
	}
	// обработчик введенных данных в меню поиска отелей, после нажатия на кнопку найти 
	$('#btn-find').bind('click', function (event) {
		event.preventDefault();
		var adult = $('#adult').val();
		var kids = $('#kids').val();
		var labDate = $('#date-lab').val();
		var exitDate = $('#date-exit').val();
		// проверка если не работает атрибут required
		if(!Modernizr.input.required) { 
			if(!requiredValue()) {
				return;
			}
		}
		// валидация данных используя выше обьявленные функции
		var labCheck = validDate(labDate);
		var exitCheck = validDate(exitDate);
		var adultCheck = validNumberInput(adult, true);
		var kidsCheck = validNumberInput(kids, false);
		var pediodCheck = false;
		// проверка возвращенных данных функций валидаторов
		// запуск валидации периода заезд-выезд, если они введены как правильные даты
		if (labCheck && exitCheck) {
			pediodCheck = validPeriod(labDate,exitDate);
		}
		// сохранение валидных данных в localStorage и переход в полное меню поиска отелей на другой странице
		if (labCheck && exitCheck && adultCheck && kidsCheck && pediodCheck) {
			localStorage.setItem('adult', adult);
			localStorage.setItem('kids', kids);
			localStorage.setItem('labDate', labDate);
			localStorage.setItem('exitDate', exitDate);
			window.location.href='hotels.html';
		}
		// если какие-либо данные не валидны
		else {
			if(!adultCheck) {
				$('#adult').css('outline', '1px solid red');
			}
			else {
				$('#adult').removeAttr('style');
			}
			if(!kidsCheck) {
				$('#kids').css('outline', '1px solid red');
			}
			else {
				$('#kids').removeAttr('style');
			}
			if(!labCheck) {
				$('#date-lab').css('outline', '1px solid red');
			}
			else {
				$('#date-lab').removeAttr('style');
			}
			if(!exitCheck) {
				$('#date-exit').css('outline', '1px solid red');
			}
			else {
				$('#date-exit').removeAttr('style');
			}
			if (!pediodCheck) {
				pediodCheck = validPeriod(labDate,exitDate);
			}
			return;
		}
	});
	// при опредилении по user agent браузера ie, добавит стили
	var a = navigator.userAgent;
	if(a.indexOf('MSIE 10.0') !== -1 || a.indexOf('Trident/7.0') !== -1) {
		$('head').append('<link rel="stylesheet" href="css/ie10.min.css">');
	}
})();