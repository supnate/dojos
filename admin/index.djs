<html>
<head>
	<title>Welcome to Dojos!</title>
	
	<style>
		body			{font-size: 12px; font-family: arial;}
		a, a:visited 	{font-family: arial;text-decoration: none;color: #2175bc;}
		a:hover 		{color: red;text-decoration: underline;}
		
		#wrapper		{	margin: 15px;}
		
		table 			{border-collapse: collapse;}
		tr:hover		{background-color: #fffff0;}
		tr:first-child:hover{background: none;}
		th {
			text-align: left;
			cursor: default;
			font-weight: bold;
			padding: 8px 3px;
			color: #555;
			text-shadow: 0 1px 0 white;
			border-bottom: 1px solid #D8D8D8;
			background: #eee;
			background: -moz-linear-gradient(#eee,#ddd);
			background: -webkit-linear-gradient(#f6f6f6,#eee);
		}
		th, td 			{font-size: 12px;font-family: arial;padding: 8px;}
		td 				{color: #777;border-bottom: 1px solid #f0f0f0;}
		td:last-child,th:last-child	{	text-align: center;}
	</style>
</head>
<body>
	<div id="wrapper">
		<div class="header"></div>
		
		<h2>Web Sites</h2>
		<div class="sites">
			<table>
				<tr>
					<th width="100px">Name</th>
					<th width="60px">Port</th>
					<th width="200px">Location</th>
					<th width="50px">Status</th>
					<th width="80px">Action</th>
				</tr>
				<tr>
					{% for site in sites %}
					<tr>
						<td><a href="http://localhost:{{site.port}}">{{site.name}}</td>
						<td>{{site.port}}</td>
						<td>{{site.location}}</td>
						<td>{{site.status}}</td>
						<td>{{site.action|safe}}</td>
					</tr>
					{% endfor %} 
				</tr>
			</table>
		</div>
	</div>
</body>

</html>