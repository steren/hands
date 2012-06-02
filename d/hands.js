var imgWidth = 300;
var imgHeight = 200;

var computeCentroid = function() {
	//var img = $("#myImage");
	//var histo = img.pixastic("histogram", {contrast: 100});

	$("#myImage").pixastic("desaturate");

	var imgDOM = document.getElementById("myImage");
	console.log(imgDOM);
	ctx = imgDOM.getContext("2d");
	var imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);

	var LineSumArray = [];
	for(var i = 0; i < imgWidth ; i++) {
		var sum = 0;
		for (var j = 0; j < imgHeight; j++ ) {
			sum += imageData.data[j * imgWidth * 4 + i * 4];
		}
		LineSumArray.push(sum);
	}
	// this is dirty, do a ponderated instead
	var maxColumn = 0;
	var maxColumnAt = 0;
	for (var k = 0; k < LineSumArray.length; k++) {
		if( LineSumArray[k] > maxColumn ) {
			maxColumn = LineSumArray[k];
			maxColumnAt = k;
		}
	}
	console.log(maxColumnAt);

	var ColumnSumArray = [];
	for(var l = 0; l < imgHeight ; l++) {
		var sumC = 0;
		for (var m = 0; m < imgWidth; m++ ) {
			sumC += imageData.data[l * imgWidth * 4 + m * 4];
		}
		ColumnSumArray.push(sumC);
	}
	// this is dirty, do a ponderated instead
	var maxLine = 0;
	var maxLineAt = 0;
	for (var i = 0; i < ColumnSumArray.length; i++) {
		if( ColumnSumArray[i] > maxLine ) {
			maxLine = ColumnSumArray[i];
			maxLineAt = i;
		}
	}
	console.log(maxLineAt);

	return {y: maxLineAt, x: maxColumnAt};
};

var process = function(ctx) {

	var centroid = computeCentroid();

	var img = $("#myImage");
	img .pixastic("edges")
		//.pixastic("blurfast", {amount: 0.1})
		.pixastic("brightness", {contrast: 100});
		//.pixastic("posterize", {levels: 1});

	// get the context
	var imgDOM = document.getElementById("myImage");
	console.log(imgDOM);
	//ctx = imgDOM.getContext("2d");
	var imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);

	// store centroid here temporarily
	//var centroidX = Math.floor( imgWidth / 2 );
	//var centroidX = Math.floor( imgHeight / 2 );
	var centroidX = centroid.x;
	var centroidY = centroid.y;
	console.log(centroidX, centroidY);

	var circleRadius = 100.0;
	var colorChanges = 0;

	var step = 0.1;
	var treathold = 200;

	var currentAngle = 0;
	var currentPosX;
	var currentPosY;
	var previousColor = 0;
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
};