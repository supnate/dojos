<html>
<head>
	<title>Index of {{title}}</title>
	<style type="text/css">
		body			{font-size: 12px; font-family: arial;}
		h4 				{font-size: 16px; font-family: arial; margin:20px; margin-bottom:5px; font-weight: bold;}
		table 			{border-collapse: collapse; margin-left: 20px;}
		tr:hover		{background-color: #fffff0;}
		tr:first-child:hover{background: none;}
		th {
			text-align: left;
			cursor: default;
			font-weight: bold;
			padding: 6px 3px;
			color: #555;
			text-shadow: 0 1px 0 white;
			border-bottom: 1px solid #D8D8D8;
			background: #eee;
			background: -moz-linear-gradient(#eee,#ddd);
			background: -webkit-linear-gradient(#f6f6f6,#eee);
		}
		th, td 			{font-size: 12px;font-family: arial;padding: 5px;padding-right: 30px;}
		td 				{color: #777;border-bottom: 1px solid #f0f0f0;}
		td:first-child	{padding-left: 24px; background: transparent url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAA6ElEQVQoFQXBMW5TQRgGwNnHnoE0QbiCjoIooUmTU3AuS1BwIoTSUdJBigg3GCWOg9/++zHTop078wIAsPMrE4SL5/1aIyMjIyMjz/m0tbFECFdrPeaQQw75mz/5nZH7fN7aWILmauSYfznmmIfss8vIUx7zZWsTTXM5vpWvTk5Wq9VHQP/gtgOLa0Qpw940vAQdaG6thpOhlOkG0AEuAVGmEkAH+G4YSikxXQM6wDsAMRFAB/ihDNNUmN4DOsAbBAEAdICfpmmaAt4COoj2GgCASbIkZh1NAACznhQt2itnFgAAlF3u/gMDtJXPzQxoswAAAABJRU5ErkJgggo=") no-repeat 5px 5px;}
		.folder td:first-child	{padding-left: 24px; background: transparent url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABq0lEQVQ4y8WTu4oUQRSGv+rtGVuxhwVFdFEEE2c3d0HYTEMTn8DEVxADQTDUF9DMwMxQMBMx8AEWzRQ3cBHd9TI91+2urjq/QbczY2IygSep4nD+79yqnCRWsYQVbWVACvDh5ZXdrLe15dwyT1TjT/sxFFeB6i+VA2B6+cb7kAI4Jf0LO087zjlQI8Y5Qvnj0sHug321XoC1bk+K9eHk6+s7wPMUgKAS88eqb4+Jfg2SHs7lZBvX2Nh+2EUCDGSAcMnJsx9f7NxfAGqXyDzRd5EJO/pMPT1gcviGTnYOVIN5pAAE8v7dLrKL8xnglFk4ws9Afko9HpH3b5Gd2mwb/lOBmgrSdYhJugDUCenxM6xv3p4HCsP8F0LxCsUhCkMURihOyM7fg0osASTFEpu9a4LjGIUCqwcoDiEUrX+E4hRUQb20RiokC1j9vckUhygU7X3QZh7NAVKYL7YBeMkRUfjVCotF2XGIwnghtrJpMywB5G0QZj9P1JNujuWJ1AHLQadRrACPkuZ0SSSWpeStWgDK6tHek5vbiOs48n++XQHurcf0rFng//6NvwG+iB9/4duaTgAAAABJRU5ErkJgggo=") no-repeat 5px 4px;}
		a, a:visited 	{font-family: arial;text-decoration: none;color: #2175bc;}
		a:hover 		{color: red;text-decoration: underline;}
		.footer 		{font-style: italic; font-family: arial; color:#777; font-size: 12px; margin: 20px;}
		.highlight		{background-color: #ffff99;}
		#filterStatus	{color:#777;}
		#tbFilter		{outline: none;margin-left: 20px; margin-bottom: 5px;width: 200px;}
	</style>
</head>
<body>
	<h4>Index of {{path|safe}}</h4>
	<div style="display: inline-block; width: 680px;">
		<div style="text-align: right;">
			<span id="filterStatus"></span>
			<input id="tbFilter" onkeyup="filter(this.value);" placeholder="Filter"/>
		</div>
		<div id="gridContainer"><table>
			<tr>
				<th style="min-width: 300px">Name</th>
				<th style="min-width: 60px">Type</th>
				<th style="min-width: 60px">Size</th>
				<th style="min-width: 100px">Last Modified</th>
			</tr>
			{% for file in files %}
			<tr>
				<td><a href="{{file.path}}">{{file.name}}</td>
				<td>{{file.type}}</td>
				<td>{{file.size}}</td>
				<td>{{file.lastModified}}</td>
			</tr>
			{% endfor %} 
		</table>
		</div>
	</div>
	<div class="footer"><hr/>Powered by dojos on NodeJS, Sep, 2011, <a href="https://github.com/supnate/dojos">github.com/supnate/dojos</a> supnate@gmail.com</div>
</body>
</html>

<script>
function $(id){	return document.getElementById(id);}
function each(arr, callback){	for(var i = 0; i< arr.length; i++)callback(arr[i], i);}
function clone(arr){	var arr2 = [];each(arr, function(s){arr2.push(s);});return arr2;}
function stripHtml(s){	return s.replace(/<[^>]*>/g, '');}
function fixEvent(evt){evt =  evt||event; if(!evt.target)evt.target = evt.srcElement;return evt;};

$('tbFilter').value= '', $('tbFilter').focus();
var container = $('gridContainer'), grid = container.firstChild, data = [], sortData = {};

container.onclick = function(e){
	e = fixEvent(e);
	if(/th/i.test(e.target.tagName)){
		sort(e.target.cellIndex);
	}
}
each(grid.rows, function(row){	//init grid data
	if(row.rowIndex <= 0)return;
	var item = [];
	each(row.cells, function(cell){item.push(cell.innerHTML);});
	if(row.cells[1].innerHTML == 'folder')row.className = 'folder';
	data.push(item);
});
function sort(col){
	sortData = {col: col, desc: (sortData.col == col && !sortData.desc) ? true : false};
	data.sort(function(a, b){
		var v1 = stripHtml(a[col]), v2 = stripHtml(b[col]);
		switch(col){
			case 2:
				v1 = parseInt(v1);
				v2 = parseInt(v2);
				break;
			case 3:
				v1 = new Date(v1);
				v2 = new Date(v2);
				break;
		}
		//folder always on top
		if(a[1] == 'folder' && b[1] != 'folder')return -1;
		if(b[1] == 'folder' && a[1] != 'folder')return 1;
		//when sorting values are the same, always keep name ordered
		if(v1 < v2)r = -1;
		else if(v1 > v2)r = 1;
		else return stripHtml(a[0]) <= stripHtml(b[0]) ? -1 : 1;
		
		return sortData.desc ? -r : r;
	});
	if($('tbFilter').value)filter();
	else render(data);
	//update sorting indicators
	each(grid.rows[0].cells, function(cell){
		cell.innerHTML = cell.innerHTML.replace(/ *[↑↓]$/g, '')
			+ (cell.cellIndex == sortData.col ? (sortData.desc ? ' ↓' : ' ↑') : '');
	});
}
function filter(){
	var s = $('tbFilter').value;
	if(!s){
		render(data);
		$('filterStatus').innerHTML = '';
	}else{
		var arr = [];
		each(data, function(item){
			item = clone(item);
			var rex = new RegExp('(' + s + ')', 'ig');
			if(rex.test(stripHtml(item.join(','))))arr.push(item);
			each(item, function(c, i){//highlight search key
				item[i] = stripHtml(c).replace(rex, '<span class="highlight">$1</span>');
			});
			var href = (location.pathname + '/' + stripHtml(item[0])).replace(/\/\//g, '/');
			item[0] = '<a href="' + href + '"/>' + item[0] + '</a>';
		});
		render(arr);
		$('filterStatus').innerHTML = arr.length + '/' + data.length;
	}
}
function render(gridData){
	var sb = [];
	sb.push('<table><tr>', grid.rows[0].innerHTML, '</tr>');
	each(gridData, function(rowData){
		sb.push('<tr',(stripHtml(rowData[1]) == 'folder') ? ' class="folder"': '','>');
		each(rowData, function(cellData, i){
			sb.push('<td>', cellData, '</td>');
		});
		sb.push('</tr>');
	});
	if(!gridData.length)sb.push('<tr><td colspan="4" style="background:none; padding-left: 5px;">No data.</td></tr>');
	sb.join('</table>');
	container.innerHTML = sb.join('');
	grid = container.firstChild;
}
</script>





