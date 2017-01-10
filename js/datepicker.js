// 定义构造函数constructor
function Datepicker(DOM){
	this._date = moment(),
	this.$calendar = $(DOM).html(`<p>输入跳转时间：<input type="text" class="settime" placeholder="yyyy/mm/dd"></p>
		<table>
			<caption></caption>
			<thead></thead>
			<tbody></tbody>
		</table>`)
	this.init().draw()
	
	var _this = this
	this.$calendar.on('click', '.prev', function(){ 
		_this.prevMonth().draw()
	})
	this.$calendar.on('click', '.next', function(){ 
		_this.nextMonth().draw()
	})
	this.$calendar.on('click', '.date td', function(){ 
		_this.selectDay(this).draw()
	})
	this.$calendar.on('keydown', '.settime', function(event){ 
		_this.setTime(event).draw()
	})
	this.$calendar.on('click', '.currentdate', function(){ 
		_this.drawMonth() 
	})
	this.$calendar.on('click', '.prevyear', function(){ 
		_this.changeYear(-1).drawTitle('YYYY')
	})
	this.$calendar.on('click', '.nextyear', function(){ 
		_this.changeYear(1).drawTitle('YYYY')
	})
	this.$calendar.on('click', '.month td', function(){ 	
		_this.selectMonth(this).draw()	
	})
}
Datepicker.prototype = {
	init: function(){
		this.$calendar.find('tr').remove()
		var tr = $('<tr class="date"></tr>')
		tr.append('<th class="icon prev">&#xe66e;</th><th class="currentdate" colspan="5"></th><th class="icon next">&#xe66f;</th>')
		this.$calendar.find('thead').append(tr)
		//绘制week
		var $tr = $('<tr class="week"></tr>'),
		week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
		week.forEach(function(item, index){	$tr.append(`<td>${week[index]}</td>`) })
		this.$calendar.find('thead').append($tr)
		this.nowday()
		return this
	},
	fun: function(className, str){
		return $(`<td class="${className}">${str}</td>`)
	}
}
//重绘日历
Datepicker.prototype.draw = function(){
	//绘制日期
	this.$calendar.find('tbody').empty()
	var	daysInThisMonth = this._date.daysInMonth(),
		thisday = this._date.date(),
		startAt = this._date.date(1).format('d'),
		daysInLsatMonth = this._date.subtract(1, 'M').daysInMonth()//此时日期月份减一为了不影响thisday和startAt放在最后写（也可以深度克隆一个日期）
		this._date.add(1, 'M')//因为上面日期月份减一现在加一使当前日期不改变
	for(var i = -startAt; i < 42 - startAt ;i = i + 7){
		var tr = $('<tr class="date"></tr>')
		for (var j = i; j < i + 7; j++){
			tr.append(this.fun(j === Math.abs(j % daysInThisMonth) ? (j === thisday - 1 ? 'normal selected' : 'normal') : 'other', 
			j >= 0 ? j % daysInThisMonth + 1 : daysInLsatMonth + j + 1))
		}
		this.$calendar.find('tbody').append(tr)
	}
	//判断如果为当月 高亮当天
	if(this._date.year() === moment().year() && this._date.month() === moment().month()){
		this.$calendar.find(`.normal:eq(${moment().date() - 1})`).addClass('today')
	}
	this.drawTitle('YYYY年MM月')
}
//翻下一个月
Datepicker.prototype.drawTitle = function(formatString){
	this.$calendar.find('.currentdate').html(this._date.format(formatString))
}
Datepicker.prototype.changeYear = function(num){
	this._date.add(num, 'y')
	return this
}
Datepicker.prototype.nextMonth = function(){
	this._date.add(1, 'M')
	return this
}
//翻上一个月
Datepicker.prototype.prevMonth = function(){
	this._date.subtract(1, 'M')
	return this
}
//选择某天高亮
Datepicker.prototype.selectDay = function(e){
	this.$calendar.find('tbody').find('td').removeClass('selected')
	this._date.date($(e).text())

	if($(e).hasClass('other') && $(e).text() > 21){
		this.prevMonth()
	}else if($(e).hasClass('other')){ 
		this.nextMonth()
	}
	return this
}
//输入日期跳转日历
Datepicker.prototype.setTime = function(e){
	if (e.keyCode === 13) {
		this._date = moment(this.$calendar.find('.settime').val())
		$('.settime').val('')
	}
	return this
}
Datepicker.prototype.nowday = function(){
	$('caption').html(moment().format('YYYY年MM月DD日 HH:mm:ss'))
	var that = this
	setTimeout(function(){ that.nowday() }, 1000)
}
//绘制月份
Datepicker.prototype.drawMonth = function(){
	this.$calendar.find('tr').remove()
	var tr = $('<tr class="month"></tr>')
	tr.append('<th class="icon prevyear">&#xe66e;</th><th class="currentdate" colspan="2"></th><th class="icon nextyear">&#xe66f;</th>')
	this.$calendar.find('thead').append(tr)
	var month = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] 
	for(var i = 0; i < 12; i = i + 4){
		var $tr = $('<tr class="month"></tr>')
		for (var j = 0; j < 4; j++) {
			$tr.append(`<td data-index="${i + j}">${month[i + j]}</td>`)
		}
		this.$calendar.find('tbody').append($tr) 
	}
	this.drawTitle('YYYY')
}
//选择月份
Datepicker.prototype.selectMonth = function(e){
	this._date.month($(e).data('index'));
	this.init()
	return this
}