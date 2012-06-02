var imgWidth = 320;
var imgHeight = 240;

var process = function (ctx) {
	var img = $("#myImage");
	img .pixastic("edges")
	      .pixastic("desaturate")
		//.pixastic("blurfast", {amount: 0.1})
		.pixastic("brightness", {contrast: 100});
		//.pixastic("posterize", {levels: 1});



	// get the context
	var imgDOM = document.getElementById("myImage");
	console.log(imgDOM);
	//ctx = imgDOM.getContext("2d");
	var imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);

	// store centroid here temporarily
	var centroidX = Math.floor( imgWidth / 2 );
	var centroidY = Math.floor( imgHeight / 2 );
	console.log(centroidX, centroidY);

	var circleRadius = 50.0;
	var colorChanges = 0;

	var step = 0.1;
	var treathold = 200;

	var currentAngle = 0;
	var currentPosX;
	var currentPosY;
	var previousColor=0;
	var currentColor;
	while (currentAngle < Math.PI*2) {
		currentAngle += 0.01;

		currentPosX = centroidX + Math.floor(circleRadius * Math.cos(currentAngle));
		currentPosY = centroidY + Math.floor(circleRadius * Math.sin(currentAngle));

		currentColor = imageData.data[ currentPosX * imgWidth * 4 + currentPosY * 4 ];

		if(Math.abs(previousColor - currentColor) > treathold) {
			colorChanges++;
		}
		previousColor = currentColor;
	}

	console.log("colorChanges", colorChanges);

	// 
	//console.log(imageData.data[0 * 4 * ]);

	// draw the circle
	ctx.strokeStyle = "red";  
	ctx.beginPath(); 
	ctx.arc(centroidX, centroidY, circleRadius, circleRadius, Math.PI*2, true);  
	ctx.closePath();
	ctx.stroke();
}