var lineNr = 0;


angular.module('yapp').controller('ReportCtrl', function($scope, $http, $filter, NgTableParams) {
  
    $http.get('/getQueryJson').success(function(data,status) {
        console.log('SUCCESS: ' + status);
        console.log(data);
    }).error(function(error) {
        console.log('ERROR');
        console.log(data);
    })
	
	var self = this;
	$scope.data = [{name: "Moroni1", age: 50}, {name: "John2", age: 20},{name: "Moroni3", age: 50}, {name: "John4", age: 20},{name: "Moroni5", age: 50}, {name: "John6", age: 20},{name: "Moroni7", age: 50}, {name: "John8", age: 20},{name: "Moroni9", age: 50}, {name: "John10", age: 20},{name: "Moroni11", age: 50}, {name: "John12", age: 20} /*,*/];
	

	$scope.tableParams = createUsingFullOptions();
	function createUsingFullOptions() {
      var initialParams = {
		page: 1,
        count: 5 // initial page size
		
      };
      var initialSettings = {
        // page size buttons (right set of buttons in demo)
        counts: [],
        // determines the pager buttons (left set of buttons in demo)
        paginationMaxBlocks: 13,
        paginationMinBlocks: 2,
        dataset: $scope.data
      };
      return new NgTableParams(initialParams, initialSettings);
    }

  $http.get('https://uclactive.aidbox.io/fhir/Patient').
  then(function(response) {    
        $scope.getCSV(); 
	   //searching parameters
        $scope.sortType     = 'first_name'; // set the default sort type
  		$scope.sortReverse  = false;  // set the default sort order
  		$scope.searchFish   = '';     // set the default search/filter term

  		//quering the data
        $scope.patient = response.data.entry;
      });

	 
	// Send Query Data to NodeJs
	$scope.query = function () {
		var month = ("0" + ($scope.dt.getMonth() + 1)).slice(-2);
		var date = $scope.dt.getFullYear() + "" + month;
		var queryData = JSON.stringify({MemberID_Hash: $scope.memberNo, Date_Key_Month: date});
		$http({
			method: 'POST',
			url: 'http://uclactive.westeurope.cloudapp.azure.com:3000/query',
			data: queryData,
			withCredentials: true,
			headers: {
                    'Content-Type': 'application/json; charset=utf-8'
			}
		})
	.success(function() {console.log("Success" + data);})
	.error(function() {console.log("Error: "+data);});
	}	
	  
	// Date Picker Function
	$scope.popup1 = {
		opened: false
	};
	$scope.open1 = function() {
		$scope.popup1.opened = true;
	};
	  
	$scope.formats = ['MMMM', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy','d!.M!.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.altInputFormats = ['M!/d!/yyyy'];
	  
	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.clear = function() {
		$scope.dt = null;
		$scope.memberNo = null;
		    $scope.mytime = null;

	};

	$scope.options = {
		customClass: getDayClass,
		minDate: new Date(),
		showWeeks: true
	};

	// Disable weekend selection
	function disabled(data) {
		var date = data.date,
		mode = data.mode;
		return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
	}
	
	$scope.toggleMin = function() {
		$scope.options.minDate = $scope.options.minDate ? null : new Date();
	};

	$scope.toggleMin();

	$scope.setDate = function(year, month, day) {
		$scope.dt = new Date(year, month, day);
	};

	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	var afterTomorrow = new Date(tomorrow);
	afterTomorrow.setDate(tomorrow.getDate() + 1);
	$scope.events = [
		{
			date: tomorrow,
			status: 'full'
		},
		{
		date: afterTomorrow,
		status: 'partially'
		}
	];

	function getDayClass(data) {
		var date = data.date,
			mode = data.mode;
		if (mode === 'day') {
			var dayToCheck = new Date(date).setHours(0,0,0,0);

			for (var i = 0; i < $scope.events.length; i++) {
				var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

				if (dayToCheck === currentDay) {
					return $scope.events[i].status;
				}
			}
		}

		return '';
	}
 
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overridden in the second argument.
function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
          }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
              new RegExp("\"\"", "g"), "\"");
          } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
          }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
      }
    // Return the parsed data.
    return (arrData);
  }

  //CSV to JSON
  function CSV2JSON(csv) {
    var array = CSVToArray(csv);
    var objArray = [];
    for (var i = 1; i < array.length; i++) {
      objArray[i - 1] = {};
      for (var k = 0; k < array[0].length && k < array[i].length; k++) {
        var key = array[0][k];
        objArray[i - 1][key] = array[i][k]
      }
    }

    var json = JSON.stringify(objArray);
    var str = json.replace(/},/g, "},\r\n");

    return str;
  }

  
  $scope.getCSV = function() {
    // http get request to read CSV file content
    $http.get('/csv/test2.csv').success($scope.startParsing);
  };
  $scope.startParsing = function (allText) {
    $scope.jsonData = [{ "key": "Cumulative Return", "values": JSON.parse(CSV2JSON(allText))}];
  }

  //This os for for table display
  //reading CSV
  $scope.readCSV = function() {
    // http get request to read CSV file content
    $http.get('/csv/test2.csv').success($scope.processData);
	
	
	//Converter Class
	var Converter = require("csvtojson").Converter;
	var converter = new Converter({});

	//end_parsed will be emitted once parsing finished
	converter.on("end_parsed", function (jsonArray) {
	   console.log(jsonArray); //here is your result jsonarray
	});

	//read from file
	require("fs").createReadStream("/csv/vGymSwipeGM.csv").pipe(converter);
  };

  //showing the table
  $scope.processData = function(allText) {
    // split content based on new line
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for ( var i = 0; i < allTextLines.length; i++) {
      // split content based on comma
      var data = allTextLines[i].split(',');
      if (data.length == headers.length) {
        var tarr = [];
        for ( var j = 0; j < headers.length; j++) {
          tarr.push(data[j]);
        }
        lines.push(tarr);
      }
    }
    $scope.data = lines;
    $scope.jsonData = CSV2JSON(allText);
  };

/*  d3.csv("/csv/test2.csv",function(err,data){
      
      //get each key of the data that is not date
      //these will be our key in the key/value pair
      //the values x and y will be month and the value
      var dataToPlot = Object.keys(data[0]).filter(function(k){return k!="DayofSwipeDate"})
        .map(function(k){
          return {"key":k,"values":data.map(function(d){
           return {
            var timeParser = d3.time.format("%I%p");
            var time = new Date(timeParser.parse(d.HourName));
            var hour = time.getHours();
             //let's make this a real date
             "x":d3.time.format('%d-%m-%y')(new Date(d.DayofSwipeDate)),
             "y":d3.time.format("%I%p").parse(d.HourName)
           }
          })}
        })

        nv.addGraph(function() {
        var chart = nv.models.multiBarChart()
          .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
          .rotateLabels(0)      //Angle to rotate x-axis labels.
          .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
          .groupSpacing(0.1)    //Distance between each group of bars.
        ;
    
        chart.xAxis
            .tickFormat(d3.time.format('%d-%b-%Y'));
    
        chart.yAxis
            .tickFormat(d3.time.format('%H%p'));
    
        d3.select('#chart1 svg')
            .datum(dataToPlot)
            .call(chart);
    
        nv.utils.windowResize(chart.update);
    
        return chart;
      });
      })
*/
  // First Graph
  $scope.options1 = {
    title: {
      enable: true,
      text: 'UCL-Active - 1st example chart (This is just a demo) - made with angular-nvd3'
    },
    subtitle: {
      enable: true,
      text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
      css: {
        'text-align': 'center',
        'margin': '10px 13px 0px 7px'
      }
    },
    caption: {
      enable: true,
      html: '<b>Figure 1.</b> INSERT DESCRIPTION HERE OF WHAT\'S HAPPENING IN THE FIGURE',
      css: {
        'text-align': 'justify',
        'margin': '10px 13px 0px 7px'
      }
    },

    chart: {
      type: 'discreteBarChart',
      height: 450,
      margin: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 55
      },
      x: function(d) {
        return d3.time.format('%d-%m-%y')(new Date(d.DayofSwipeDate));
      },
      y: function(d) {
        var timeParser = d3.time.format("%I%p");
        var time = new Date(timeParser.parse(d.HourName));
        var hour = time.getHours();
        return hour;
      },
      showValues: true,
      duration: 500,
      xAxis: {
        axisLabel: 'DayofSwipeDate'
      },
      yAxis: {
        axisLabel: 'HourName',
        axisLabelDistance: -10
      }
    }
  };

/*  $scope.datax = [{
    key: "Cumulative Return",
    values: [{"DayofSwipeDate": ""}]
  }]*/

  $scope.data1 = [{"key":"Cumulative Return","values":[{"MemberTlmsNo":"100000041","MemberGender":"Male","MemberAge":"65","DayOfMemberDateOfBirthKey":"14-Nov-51","ContractMainCode":"DPP","PayPlanAggMonthlyTermFee":"£40.00","DayofSwipeDate":"01-Jun-16","HourName":"9AM"},{"MemberTlmsNo":"100000041","MemberGender":"Male","MemberAge":"65","DayOfMemberDateOfBirthKey":"14-Nov-51","ContractMainCode":"DPP","PayPlanAggMonthlyTermFee":"£40.00","DayofSwipeDate":"08-Jun-16","HourName":"12PM"},{"MemberTlmsNo":"100000041","MemberGender":"Male","MemberAge":"65","DayOfMemberDateOfBirthKey":"14-Nov-51","ContractMainCode":"DPP","PayPlanAggMonthlyTermFee":"£40.00","DayofSwipeDate":"14-Jun-16","HourName":"9AM"},{"MemberTlmsNo":"100000041","MemberGender":"Male","MemberAge":"65","DayOfMemberDateOfBirthKey":"14-Nov-51","ContractMainCode":"DPP","PayPlanAggMonthlyTermFee":"£40.00","DayofSwipeDate":"15-Jun-16","HourName":"12PM"},{"MemberTlmsNo":"100000041","MemberGender":"Male","MemberAge":"65","DayOfMemberDateOfBirthKey":"14-Nov-51","ContractMainCode":"DPP","PayPlanAggMonthlyTermFee":"£40.00","DayofSwipeDate":"20-Jun-16","HourName":"12PM"},{"MemberTlmsNo":"100000041","MemberGender":"Male","MemberAge":"65","DayOfMemberDateOfBirthKey":"14-Nov-51","ContractMainCode":"DPP","PayPlanAggMonthlyTermFee":"£40.00","DayofSwipeDate":"20-Jun-16","HourName":"2PM"},{"MemberTlmsNo":"100000041","MemberGender":"Male","MemberAge":"65","DayOfMemberDateOfBirthKey":"14-Nov-51","ContractMainCode":"DPP","PayPlanAggMonthlyTermFee":"£40.00","DayofSwipeDate":"21-Jun-16","HourName":"9AM"},{"MemberTlmsNo":"100000041","MemberGender":"Male","MemberAge":"65","DayOfMemberDateOfBirthKey":"14-Nov-51","ContractMainCode":"DPP","PayPlanAggMonthlyTermFee":"£40.00","DayofSwipeDate":"27-Jun-16","HourName":"12PM"},{"MemberTlmsNo":"100000041","MemberGender":"Male","MemberAge":"65","DayOfMemberDateOfBirthKey":"14-Nov-51","ContractMainCode":"DPP","PayPlanAggMonthlyTermFee":"£40.00","DayofSwipeDate":"28-Jun-16","HourName":"10AM"},{"MemberTlmsNo":"100000041","MemberGender":"Male","MemberAge":"65","DayOfMemberDateOfBirthKey":"14-Nov-51","ContractMainCode":"DPP","PayPlanAggMonthlyTermFee":"£40.00","DayofSwipeDate":"11-Jul-16","HourName":"12PM"}]}]

  // Second Graph
  $scope.options2 = {
    title: {
      enable: true,
      text: 'UCL-Active - 2nd example chart (This is just a demo) - made with angular-nvd3'
    },
    subtitle: {
      enable: true,
      text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
      css: {
        'text-align': 'center',
        'margin': '10px 13px 0px 7px'
      }
    },
    caption: {
      enable: true,
      html: '<b>Figure 2.</b> INSERT DESCRIPTION HERE OF WHAT\'S HAPPENING IN THE FIGURE',
      css: {
        'text-align': 'justify',
        'margin': '10px 13px 0px 7px'
      }
    },

    chart: {
      type: 'lineChart',
      height: 450,
      margin: {
        top: 20,
        right: 20,
        bottom: 40,
        left: 55
      },
      x: function(d) {
        return d.x;
      },
      y: function(d) {
        return d.y;
      },
      useInteractiveGuideline: true,
      dispatch: {
        stateChange: function(e) {
          console.log("stateChange");
        },
        changeState: function(e) {
          console.log("changeState");
        },
        tooltipShow: function(e) {
          console.log("tooltipShow");
        },
        tooltipHide: function(e) {
          console.log("tooltipHide");
        }
      },
      xAxis: {
        axisLabel: 'Time (ms)'
      },
      yAxis: {
        axisLabel: 'Voltage (v)',
        tickFormat: function(d) {
          return d3.format('.02f')(d);
        },
        axisLabelDistance: -10
      },
      callback: function(chart) {
        console.log("!!! lineChart callback !!!");
      }
    }
  };

  $scope.data2 = sinAndCos();

  /*Random Data Generator */
  function sinAndCos() {
    var sin = [],
    sin2 = [],
    cos = [];

    //Data is represented as an array of {x,y} pairs.
    for (var i = 0; i < 100; i++) {
      sin.push({
        x: i,
        y: Math.sin(i / 10)
      });
      sin2.push({
        x: i,
        y: i % 10 == 5 ? null : Math.sin(i / 10) * 0.25 + 0.5
      });
      cos.push({
        x: i,
        y: .5 * Math.cos(i / 10 + 2) + Math.random() / 10
      });
    }

    //Line chart data should be sent as an array of series objects.
    return [{
      values: sin, //values - represents the array of {x,y} data points
      key: 'Sine Wave', //key  - the name of the series.
      color: '#ff7f0e', //color - optional: choose your own line color.
      strokeWidth: 2,
      classed: 'dashed',
      area: true
    }, {
      values: cos,
      key: 'Cosine Wave',
      color: '#2ca02c',
      area: true
    }, {
      values: sin2,
      key: 'Another sine wave',
      color: '#7777ff',
      area: true //area - set to true if you want this line to turn into a filled area chart.
    }];
  };


  // Third Graph
  $scope.options3 = {
    title: {
      enable: true,
      text: 'UCL-Active - 3rd example chart (This is just a demo) - made with angular-nvd3'
    },
    subtitle: {
      enable: true,
      text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
      css: {
        'text-align': 'center',
        'margin': '10px 13px 0px 7px'
      }
    },
    caption: {
      enable: true,
      html: '<b>Figure 3.</b> INSERT DESCRIPTION HERE OF WHAT\'S HAPPENING IN THE FIGURE',
      css: {
        'text-align': 'justify',
        'margin': '10px 13px 0px 7px'
      }
    },
    chart: {
      type: 'cumulativeLineChart',
      height: 450,
      margin: {
        top: 20,
        right: 20,
        bottom: 60,
        left: 65
      },
      x: function(d) {
        return d[0];
      },
      y: function(d) {
        return d[1] / 100;
      },
      average: function(d) {
        return d.mean / 100;
      },

      color: d3.scale.category10().range(),
      duration: 300,
      useInteractiveGuideline: true,
      clipVoronoi: false,

      xAxis: {
        axisLabel: 'X Axis',
        tickFormat: function(d) {
          return d3.time.format('%m/%d/%y')(new Date(d))
        },
        showMaxMin: false,
        staggerLabels: true
      },

      yAxis: {
        axisLabel: 'Y Axis',
        tickFormat: function(d) {
          return d3.format(',.1%')(d);
        },
        axisLabelDistance: 20
      }
    }
  };

  $scope.data3 = [{
    key: "Long",
    values: [
    [1083297600000, -2.974623048543],
    [1085976000000, -1.7740300785979],
    [1088568000000, 4.4681318138177],
    [1091246400000, 7.0242541001353],
    [1093924800000, 7.5709603667586],
    [1096516800000, 20.612245065736],
    [1099195200000, 21.698065237316],
    [1101790800000, 40.501189458018],
    [1104469200000, 50.464679413194],
    [1107147600000, 48.917421973355],
    [1109566800000, 63.750936549160],
    [1112245200000, 59.072499126460],
    [1114833600000, 43.373158880492],
    [1117512000000, 54.490918947556],
    [1120104000000, 56.661178852079],
    [1122782400000, 73.450103545496],
    [1125460800000, 71.714526354907],
    [1128052800000, 85.221664349607],
    [1130734800000, 77.769261392481],
    [1133326800000, 95.966528716500],
    [1136005200000, 107.59132116397],
    [1138683600000, 127.25740096723],
    [1141102800000, 122.13917498830],
    [1143781200000, 126.53657279774],
    [1146369600000, 132.39300992970],
    [1149048000000, 120.11238242904],
    [1151640000000, 118.41408917750],
    [1154318400000, 107.92918924621],
    [1156996800000, 110.28057249569],
    [1159588800000, 117.20485334692],
    [1162270800000, 141.33556756948],
    [1164862800000, 159.59452727893],
    [1167541200000, 167.09801853304],
    [1170219600000, 185.46849659215],
    [1172638800000, 184.82474099990],
    [1175313600000, 195.63155213887],
    [1177905600000, 207.40597044171],
    [1180584000000, 230.55966698196],
    [1183176000000, 239.55649035292],
    [1185854400000, 241.35915085208],
    [1188532800000, 239.89428956243],
    [1191124800000, 260.47781917715],
    [1193803200000, 276.39457482225],
    [1196398800000, 258.66530682672],
    [1199077200000, 250.98846121893],
    [1201755600000, 226.89902618127],
    [1204261200000, 227.29009273807],
    [1206936000000, 218.66476654350],
    [1209528000000, 232.46605902918],
    [1212206400000, 253.25667081117],
    [1214798400000, 235.82505363925],
    [1217476800000, 229.70112774254],
    [1220155200000, 225.18472705952],
    [1222747200000, 189.13661746552],
    [1225425600000, 149.46533007301],
    [1228021200000, 131.00340772114],
    [1230699600000, 135.18341728866],
    [1233378000000, 109.15296887173],
    [1235797200000, 84.614772549760],
    [1238472000000, 100.60810015326],
    [1241064000000, 141.50134895610],
    [1243742400000, 142.50405083675],
    [1246334400000, 139.81192372672],
    [1249012800000, 177.78205544583],
    [1251691200000, 194.73691933074],
    [1254283200000, 209.00838460225],
    [1256961600000, 198.19855877420],
    [1259557200000, 222.37102417812],
    [1262235600000, 234.24581081250],
    [1264914000000, 228.26087689346],
    [1267333200000, 248.81895126250],
    [1270008000000, 270.57301075186],
    [1272600000000, 292.64604322550],
    [1275278400000, 265.94088520518],
    [1277870400000, 237.82887467569],
    [1280548800000, 265.55973314204],
    [1283227200000, 248.30877330928],
    [1285819200000, 278.14870066912],
    [1288497600000, 292.69260960288],
    [1291093200000, 300.84263809599],
    [1293771600000, 326.17253914628],
    [1296450000000, 337.69335966505],
    [1298869200000, 339.73260965121],
    [1301544000000, 346.87865120765],
    [1304136000000, 347.92991526628],
    [1306814400000, 342.04627502669],
    [1309406400000, 333.45386231233],
    [1312084800000, 323.15034181243],
    [1314763200000, 295.66126882331],
    [1317355200000, 251.48014579253],
    [1320033600000, 295.15424257905],
    [1322629200000, 294.54766764397],
    [1325307600000, 295.72906119051],
    [1327986000000, 325.73351347613],
    [1330491600000, 340.16106061186],
    [1333166400000, 345.15514071490],
    [1335758400000, 337.10259395679],
    [1338436800000, 318.68216333837],
    [1341028800000, 317.03683945246],
    [1343707200000, 318.53549659997],
    [1346385600000, 332.85381464104],
    [1348977600000, 337.36534373477],
    [1351656000000, 350.27872156161],
    [1354251600000, 349.45128876100]
    ],
    mean: 250
  }, {
    key: "Short",
    values: [
    [1083297600000, -0.77078283705125],
    [1085976000000, -1.8356366650335],
    [1088568000000, -5.3121322073127],
    [1091246400000, -4.9320975829662],
    [1093924800000, -3.9835408823225],
    [1096516800000, -6.8694685316805],
    [1099195200000, -8.4854877428545],
    [1101790800000, -15.933627197384],
    [1104469200000, -15.920980069544],
    [1107147600000, -12.478685045651],
    [1109566800000, -17.297761889305],
    [1112245200000, -15.247129891020],
    [1114833600000, -11.336459046839],
    [1117512000000, -13.298990907415],
    [1120104000000, -16.360027000056],
    [1122782400000, -18.527929522030],
    [1125460800000, -22.176516738685],
    [1128052800000, -23.309665368330],
    [1130734800000, -21.629973409748],
    [1133326800000, -24.186429093486],
    [1136005200000, -29.116707312531],
    [1138683600000, -37.188037874864],
    [1141102800000, -34.689264821198],
    [1143781200000, -39.505932105359],
    [1146369600000, -45.339572492759],
    [1149048000000, -43.849353192764],
    [1151640000000, -45.418353922571],
    [1154318400000, -44.579281059919],
    [1156996800000, -44.027098363370],
    [1159588800000, -41.261306759439],
    [1162270800000, -47.446018534027],
    [1164862800000, -53.413782948909],
    [1167541200000, -50.700723647419],
    [1170219600000, -56.374090913296],
    [1172638800000, -61.754245220322],
    [1175313600000, -66.246241587629],
    [1177905600000, -75.351650899999],
    [1180584000000, -81.699058262032],
    [1183176000000, -82.487023368081],
    [1185854400000, -86.230055113277],
    [1188532800000, -84.746914818507],
    [1191124800000, -100.77134971977],
    [1193803200000, -109.95435565947],
    [1196398800000, -99.605672965057],
    [1199077200000, -99.607249394382],
    [1201755600000, -94.874614950188],
    [1204261200000, -105.35899063105],
    [1206936000000, -106.01931193802],
    [1209528000000, -110.28883571771],
    [1212206400000, -119.60256203030],
    [1214798400000, -115.62201315802],
    [1217476800000, -106.63824185202],
    [1220155200000, -99.848746318951],
    [1222747200000, -85.631219602987],
    [1225425600000, -63.547909262067],
    [1228021200000, -59.753275364457],
    [1230699600000, -63.874977883542],
    [1233378000000, -56.865697387488],
    [1235797200000, -54.285579501988],
    [1238472000000, -56.474659581885],
    [1241064000000, -63.847137745644],
    [1243742400000, -68.754247867325],
    [1246334400000, -69.474257009155],
    [1249012800000, -75.084828197067],
    [1251691200000, -77.101028237237],
    [1254283200000, -80.454866854387],
    [1256961600000, -78.984349952220],
    [1259557200000, -83.041230807854],
    [1262235600000, -84.529748348935],
    [1264914000000, -83.837470195508],
    [1267333200000, -87.174487671969],
    [1270008000000, -90.342293007487],
    [1272600000000, -93.550928464991],
    [1275278400000, -85.833102140765],
    [1277870400000, -79.326501831592],
    [1280548800000, -87.986196903537],
    [1283227200000, -85.397862121771],
    [1285819200000, -94.738167050020],
    [1288497600000, -98.661952897151],
    [1291093200000, -99.609665952708],
    [1293771600000, -103.57099836183],
    [1296450000000, -104.04353411322],
    [1298869200000, -108.21382792587],
    [1301544000000, -108.74006900920],
    [1304136000000, -112.07766650960],
    [1306814400000, -109.63328199118],
    [1309406400000, -106.53578966772],
    [1312084800000, -103.16480871469],
    [1314763200000, -95.945078001828],
    [1317355200000, -81.226687340874],
    [1320033600000, -90.782206596168],
    [1322629200000, -89.484445370113],
    [1325307600000, -88.514723135326],
    [1327986000000, -93.381292724320],
    [1330491600000, -97.529705609172],
    [1333166400000, -99.520481439189],
    [1335758400000, -99.430184898669],
    [1338436800000, -93.349934521973],
    [1341028800000, -95.858475286491],
    [1343707200000, -95.522755836605],
    [1346385600000, -98.503848862036],
    [1348977600000, -101.49415251896],
    [1351656000000, -101.50099325672],
    [1354251600000, -99.487094927489]
    ],
    mean: -60
  }, {
    key: "Gross",
    mean: 125,
    values: [
    [1083297600000, -3.7454058855943],
    [1085976000000, -3.6096667436314],
    [1088568000000, -0.8440003934950],
    [1091246400000, 2.0921565171691],
    [1093924800000, 3.5874194844361],
    [1096516800000, 13.742776534056],
    [1099195200000, 13.212577494462],
    [1101790800000, 24.567562260634],
    [1104469200000, 34.543699343650],
    [1107147600000, 36.438736927704],
    [1109566800000, 46.453174659855],
    [1112245200000, 43.825369235440],
    [1114833600000, 32.036699833653],
    [1117512000000, 41.191928040141],
    [1120104000000, 40.301151852023],
    [1122782400000, 54.922174023466],
    [1125460800000, 49.538009616222],
    [1128052800000, 61.911998981277],
    [1130734800000, 56.139287982733],
    [1133326800000, 71.780099623014],
    [1136005200000, 78.474613851439],
    [1138683600000, 90.069363092366],
    [1141102800000, 87.449910167102],
    [1143781200000, 87.030640692381],
    [1146369600000, 87.053437436941],
    [1149048000000, 76.263029236276],
    [1151640000000, 72.995735254929],
    [1154318400000, 63.349908186291],
    [1156996800000, 66.253474132320],
    [1159588800000, 75.943546587481],
    [1162270800000, 93.889549035453],
    [1164862800000, 106.18074433002],
    [1167541200000, 116.39729488562],
    [1170219600000, 129.09440567885],
    [1172638800000, 123.07049577958],
    [1175313600000, 129.38531055124],
    [1177905600000, 132.05431954171],
    [1180584000000, 148.86060871993],
    [1183176000000, 157.06946698484],
    [1185854400000, 155.12909573880],
    [1188532800000, 155.14737474392],
    [1191124800000, 159.70646945738],
    [1193803200000, 166.44021916278],
    [1196398800000, 159.05963386166],
    [1199077200000, 151.38121182455],
    [1201755600000, 132.02441123108],
    [1204261200000, 121.93110210702],
    [1206936000000, 112.64545460548],
    [1209528000000, 122.17722331147],
    [1212206400000, 133.65410878087],
    [1214798400000, 120.20304048123],
    [1217476800000, 123.06288589052],
    [1220155200000, 125.33598074057],
    [1222747200000, 103.50539786253],
    [1225425600000, 85.917420810943],
    [1228021200000, 71.250132356683],
    [1230699600000, 71.308439405118],
    [1233378000000, 52.287271484242],
    [1235797200000, 30.329193047772],
    [1238472000000, 44.133440571375],
    [1241064000000, 77.654211210456],
    [1243742400000, 73.749802969425],
    [1246334400000, 70.337666717565],
    [1249012800000, 102.69722724876],
    [1251691200000, 117.63589109350],
    [1254283200000, 128.55351774786],
    [1256961600000, 119.21420882198],
    [1259557200000, 139.32979337027],
    [1262235600000, 149.71606246357],
    [1264914000000, 144.42340669795],
    [1267333200000, 161.64446359053],
    [1270008000000, 180.23071774437],
    [1272600000000, 199.09511476051],
    [1275278400000, 180.10778306442],
    [1277870400000, 158.50237284410],
    [1280548800000, 177.57353623850],
    [1283227200000, 162.91091118751],
    [1285819200000, 183.41053361910],
    [1288497600000, 194.03065670573],
    [1291093200000, 201.23297214328],
    [1293771600000, 222.60154078445],
    [1296450000000, 233.35556801977],
    [1298869200000, 231.22452435045],
    [1301544000000, 237.84432503045],
    [1304136000000, 235.55799131184],
    [1306814400000, 232.11873570751],
    [1309406400000, 226.62381538123],
    [1312084800000, 219.34811113539],
    [1314763200000, 198.69242285581],
    [1317355200000, 168.90235629066],
    [1320033600000, 202.64725756733],
    [1322629200000, 203.05389378105],
    [1325307600000, 204.85986680865],
    [1327986000000, 229.77085616585],
    [1330491600000, 239.65202435959],
    [1333166400000, 242.33012622734],
    [1335758400000, 234.11773262149],
    [1338436800000, 221.47846307887],
    [1341028800000, 216.98308827912],
    [1343707200000, 218.37781386755],
    [1346385600000, 229.39368622736],
    [1348977600000, 230.54656412916],
    [1351656000000, 243.06087025523],
    [1354251600000, 244.24733578385]
    ]
  }, {
    key: "S&P 1500",
    values: [
    [1083297600000, -1.7798428181819],
    [1085976000000, -0.36883324836999],
    [1088568000000, 1.7312581046040],
    [1091246400000, -1.8356125950460],
    [1093924800000, -1.5396564170877],
    [1096516800000, -0.16867791409247],
    [1099195200000, 1.3754263993413],
    [1101790800000, 5.8171640898041],
    [1104469200000, 9.4350145241608],
    [1107147600000, 6.7649081510160],
    [1109566800000, 9.1568499314776],
    [1112245200000, 7.2485090994419],
    [1114833600000, 4.8762222306595],
    [1117512000000, 8.5992339354652],
    [1120104000000, 9.0896517982086],
    [1122782400000, 13.394644048577],
    [1125460800000, 12.311842010760],
    [1128052800000, 13.221003650717],
    [1130734800000, 11.218481009206],
    [1133326800000, 15.565352598445],
    [1136005200000, 15.623703865926],
    [1138683600000, 19.275255326383],
    [1141102800000, 19.432433717836],
    [1143781200000, 21.232881244655],
    [1146369600000, 22.798299192958],
    [1149048000000, 19.006125095476],
    [1151640000000, 19.151889158536],
    [1154318400000, 19.340022855452],
    [1156996800000, 22.027934841859],
    [1159588800000, 24.903300681329],
    [1162270800000, 29.146492833877],
    [1164862800000, 31.781626082589],
    [1167541200000, 33.358770738428],
    [1170219600000, 35.622684613497],
    [1172638800000, 33.332821711366],
    [1175313600000, 34.878748635832],
    [1177905600000, 40.582332613844],
    [1180584000000, 45.719535502920],
    [1183176000000, 43.239344722386],
    [1185854400000, 38.550955100342],
    [1188532800000, 40.585368816283],
    [1191124800000, 45.601374057981],
    [1193803200000, 48.051404337892],
    [1196398800000, 41.582581696032],
    [1199077200000, 40.650580792748],
    [1201755600000, 32.252222066493],
    [1204261200000, 28.106390258553],
    [1206936000000, 27.532698196687],
    [1209528000000, 33.986390463852],
    [1212206400000, 36.302660526438],
    [1214798400000, 25.015574480172],
    [1217476800000, 23.989494069029],
    [1220155200000, 25.934351445531],
    [1222747200000, 14.627592011699],
    [1225425600000, -5.2249403809749],
    [1228021200000, -12.330933408050],
    [1230699600000, -11.000291508188],
    [1233378000000, -18.563864948088],
    [1235797200000, -27.213097001687],
    [1238472000000, -20.834133840523],
    [1241064000000, -12.717886701719],
    [1243742400000, -8.1644613083526],
    [1246334400000, -7.9108408918201],
    [1249012800000, -0.77002391591209],
    [1251691200000, 2.8243816569672],
    [1254283200000, 6.8761411421070],
    [1256961600000, 4.5060912230294],
    [1259557200000, 10.487179794349],
    [1262235600000, 13.251375597594],
    [1264914000000, 9.2207594803415],
    [1267333200000, 12.836276936538],
    [1270008000000, 19.816793904978],
    [1272600000000, 22.156787167211],
    [1275278400000, 12.518039090576],
    [1277870400000, 6.4253587440854],
    [1280548800000, 13.847372028409],
    [1283227200000, 8.5454736090364],
    [1285819200000, 18.542801953304],
    [1288497600000, 23.037064683183],
    [1291093200000, 23.517422401888],
    [1293771600000, 31.804723416068],
    [1296450000000, 34.778247386072],
    [1298869200000, 39.584883855230],
    [1301544000000, 40.080647664875],
    [1304136000000, 44.180050667889],
    [1306814400000, 42.533535927221],
    [1309406400000, 40.105374449011],
    [1312084800000, 37.014659267156],
    [1314763200000, 29.263745084262],
    [1317355200000, 19.637463417584],
    [1320033600000, 33.157645345770],
    [1322629200000, 32.895053150988],
    [1325307600000, 34.111544824647],
    [1327986000000, 40.453985817473],
    [1330491600000, 46.435700783313],
    [1333166400000, 51.062385488671],
    [1335758400000, 50.130448220658],
    [1338436800000, 41.035476682018],
    [1341028800000, 46.591932296457],
    [1343707200000, 48.349391180634],
    [1346385600000, 51.913011286919],
    [1348977600000, 55.747238313752],
    [1351656000000, 52.991824077209],
    [1354251600000, 49.556311883284]
    ]
  }];


  //4th Graph
  $scope.options4 = {
   title: {
    enable: true,
    text: 'UCL-Active - 4th example chart (This is just a demo) - made with angular-nvd3'
  },
  subtitle: {
    enable: true,
    text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
    css: {
      'text-align': 'center',
      'margin': '10px 13px 0px 7px'
    }
  },
  caption: {
    enable: true,
    html: '<b>Figure 4.</b> INSERT DESCRIPTION HERE OF WHAT\'S HAPPENING IN THE FIGURE',
    css: {
      'text-align': 'justify',
      'margin': '10px 13px 0px 7px'
    }
  },
  chart: {
    type: 'multiBarChart',
    height: 450,
    margin : {
      top: 20,
      right: 20,
      bottom: 45,
      left: 45
    },
    clipEdge: true,
    duration: 500,
    stacked: true,
    xAxis: {
      axisLabel: 'Time (ms)',
      showMaxMin: false,
      tickFormat: function(d){
        return d3.format(',f')(d);
      }
    },
    yAxis: {
      axisLabel: 'Y Axis',
      axisLabelDistance: -20,
      tickFormat: function(d){
        return d3.format(',.1f')(d);
      }
    }
  }
};

$scope.data4 = generateData();

/* Random Data Generator (took from nvd3.org) */
function generateData() {
  return stream_layers(3,50+Math.random()*50,.1).map(function(data, i) {
    return {
      key: 'Stream' + i,
      values: data
    };
  });
}

/* Inspired by Lee Byron's test data generator. */
function stream_layers(n, m, o) {
  if (arguments.length < 3) o = 0;
  function bump(a) {
    var x = 1 / (.1 + Math.random()),
    y = 2 * Math.random() - .5,
    z = 10 / (.1 + Math.random());
    for (var i = 0; i < m; i++) {
      var w = (i / m - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
  return d3.range(n).map(function() {
    var a = [], i;
    for (i = 0; i < m; i++) a[i] = o + o * Math.random();
      for (i = 0; i < 5; i++) bump(a);
        return a.map(stream_index);
    });
}

/* Another layer generator using gamma distributions. */
function stream_waves(n, m) {
  return d3.range(n).map(function(i) {
    return d3.range(m).map(function(j) {
      var x = 20 * j / m - i / 3;
      return 2 * x * Math.exp(-.5 * x);
    }).map(stream_index);
  });
}

function stream_index(d, i) {
  return {x: i, y: Math.max(0, d)};
}

        //5th graph
        $scope.options5 = {
          chart: {
            type: 'stackedAreaChart',
            height: 450,
            margin : {
              top: 20,
              right: 20,
              bottom: 30,
              left: 40
            },
            x: function(d){return d[0];},
            y: function(d){return d[1];},
            useVoronoi: false,
            clipEdge: true,
            duration: 100,
            useInteractiveGuideline: true,
            xAxis: {
              showMaxMin: false,
              tickFormat: function(d) {
                return d3.time.format('%x')(new Date(d))
              }
            },
            yAxis: {
              tickFormat: function(d){
                return d3.format(',.2f')(d);
              }
            },
            zoom: {
              enabled: true,
              scaleExtent: [1, 10],
              useFixedDomain: false,
              useNiceScale: false,
              horizontalOff: false,
              verticalOff: true,
              unzoomEventType: 'dblclick.zoom'
            }
          }
        };

        $scope.data5 = [
        {
          "key" : "North America" ,
          "values" : [ [ 1025409600000 , 23.041422681023] , [ 1028088000000 , 19.854291255832] , [ 1030766400000 , 21.02286281168] , [ 1033358400000 , 22.093608385173] , [ 1036040400000 , 25.108079299458] , [ 1038632400000 , 26.982389242348] , [ 1041310800000 , 19.828984957662] , [ 1043989200000 , 19.914055036294] , [ 1046408400000 , 19.436150539916] , [ 1049086800000 , 21.558650338602] , [ 1051675200000 , 24.395594061773] , [ 1054353600000 , 24.747089309384] , [ 1056945600000 , 23.491755498807] , [ 1059624000000 , 23.376634878164] , [ 1062302400000 , 24.581223154533] , [ 1064894400000 , 24.922476843538] , [ 1067576400000 , 27.357712939042] , [ 1070168400000 , 26.503020572593] , [ 1072846800000 , 26.658901244878] , [ 1075525200000 , 27.065704156445] , [ 1078030800000 , 28.735320452588] , [ 1080709200000 , 31.572277846319] , [ 1083297600000 , 30.932161503638] , [ 1085976000000 , 31.627029785554] , [ 1088568000000 , 28.728743674232] , [ 1091246400000 , 26.858365172675] , [ 1093924800000 , 27.279922830032] , [ 1096516800000 , 34.408301211324] , [ 1099195200000 , 34.794362930439] , [ 1101790800000 , 35.609978198951] , [ 1104469200000 , 33.574394968037] , [ 1107147600000 , 31.979405070598] , [ 1109566800000 , 31.19009040297] , [ 1112245200000 , 31.083933968994] , [ 1114833600000 , 29.668971113185] , [ 1117512000000 , 31.490638014379] , [ 1120104000000 , 31.818617451128] , [ 1122782400000 , 32.960314008183] , [ 1125460800000 , 31.313383196209] , [ 1128052800000 , 33.125486081852] , [ 1130734800000 , 32.791805509149] , [ 1133326800000 , 33.506038030366] , [ 1136005200000 , 26.96501697216] , [ 1138683600000 , 27.38478809681] , [ 1141102800000 , 27.371377218209] , [ 1143781200000 , 26.309915460827] , [ 1146369600000 , 26.425199957518] , [ 1149048000000 , 26.823411519396] , [ 1151640000000 , 23.850443591587] , [ 1154318400000 , 23.158355444054] , [ 1156996800000 , 22.998689393695] , [ 1159588800000 , 27.9771285113] , [ 1162270800000 , 29.073672469719] , [ 1164862800000 , 28.587640408904] , [ 1167541200000 , 22.788453687637] , [ 1170219600000 , 22.429199073597] , [ 1172638800000 , 22.324103271052] , [ 1175313600000 , 17.558388444187] , [ 1177905600000 , 16.769518096208] , [ 1180584000000 , 16.214738201301] , [ 1183176000000 , 18.729632971229] , [ 1185854400000 , 18.814523318847] , [ 1188532800000 , 19.789986451358] , [ 1191124800000 , 17.070049054933] , [ 1193803200000 , 16.121349575716] , [ 1196398800000 , 15.141659430091] , [ 1199077200000 , 17.175388025297] , [ 1201755600000 , 17.286592443522] , [ 1204261200000 , 16.323141626568] , [ 1206936000000 , 19.231263773952] , [ 1209528000000 , 18.446256391095] , [ 1212206400000 , 17.822632399764] , [ 1214798400000 , 15.53936647598] , [ 1217476800000 , 15.255131790217] , [ 1220155200000 , 15.660963922592] , [ 1222747200000 , 13.254482273698] , [ 1225425600000 , 11.920796202299] , [ 1228021200000 , 12.122809090924] , [ 1230699600000 , 15.691026271393] , [ 1233378000000 , 14.720881635107] , [ 1235797200000 , 15.387939360044] , [ 1238472000000 , 13.765436672228] , [ 1241064000000 , 14.631445864799] , [ 1243742400000 , 14.292446536221] , [ 1246334400000 , 16.170071367017] , [ 1249012800000 , 15.948135554337] , [ 1251691200000 , 16.612872685134] , [ 1254283200000 , 18.778338719091] , [ 1256961600000 , 16.756026065421] , [ 1259557200000 , 19.385804443146] , [ 1262235600000 , 22.950590240168] , [ 1264914000000 , 23.61159018141] , [ 1267333200000 , 25.708586989581] , [ 1270008000000 , 26.883915999885] , [ 1272600000000 , 25.893486687065] , [ 1275278400000 , 24.678914263176] , [ 1277870400000 , 25.937275793024] , [ 1280548800000 , 29.461381693838] , [ 1283227200000 , 27.357322961861] , [ 1285819200000 , 29.057235285673] , [ 1288497600000 , 28.549434189386] , [ 1291093200000 , 28.506352379724] , [ 1293771600000 , 29.449241421598] , [ 1296450000000 , 25.796838168807] , [ 1298869200000 , 28.740145449188] , [ 1301544000000 , 22.091744141872] , [ 1304136000000 , 25.07966254541] , [ 1306814400000 , 23.674906973064] , [ 1309406400000 , 23.418002742929] , [ 1312084800000 , 23.24364413887] , [ 1314763200000 , 31.591854066817] , [ 1317355200000 , 31.497112374114] , [ 1320033600000 , 26.67238082043] , [ 1322629200000 , 27.297080015495] , [ 1325307600000 , 20.174315530051] , [ 1327986000000 , 19.631084213898] , [ 1330491600000 , 20.366462219461] , [ 1333166400000 , 19.284784434185] , [ 1335758400000 , 19.157810257624]]
        },

        {
          "key" : "Africa" ,
          "values" : [ [ 1025409600000 , 7.9356392949025] , [ 1028088000000 , 7.4514668527298] , [ 1030766400000 , 7.9085410566608] , [ 1033358400000 , 5.8996782364764] , [ 1036040400000 , 6.0591869346923] , [ 1038632400000 , 5.9667815800451] , [ 1041310800000 , 8.65528925664] , [ 1043989200000 , 8.7690763386254] , [ 1046408400000 , 8.6386160387453] , [ 1049086800000 , 5.9895557449743] , [ 1051675200000 , 6.3840324338159] , [ 1054353600000 , 6.5196511461441] , [ 1056945600000 , 7.0738618553114] , [ 1059624000000 , 6.5745957367133] , [ 1062302400000 , 6.4658359184444] , [ 1064894400000 , 2.7622758754954] , [ 1067576400000 , 2.9794782986241] , [ 1070168400000 , 2.8735432712019] , [ 1072846800000 , 1.6344817513645] , [ 1075525200000 , 1.5869248754883] , [ 1078030800000 , 1.7172279157246] , [ 1080709200000 , 1.9649927409867] , [ 1083297600000 , 2.0261695079196] , [ 1085976000000 , 2.0541261923929] , [ 1088568000000 , 3.9466318927569] , [ 1091246400000 , 3.7826770946089] , [ 1093924800000 , 3.9543021004028] , [ 1096516800000 , 3.8309891064711] , [ 1099195200000 , 3.6340958946166] , [ 1101790800000 , 3.5289755762525] , [ 1104469200000 , 5.702378559857] , [ 1107147600000 , 5.6539569019223] , [ 1109566800000 , 5.5449506370392] , [ 1112245200000 , 4.7579993280677] , [ 1114833600000 , 4.4816139372906] , [ 1117512000000 , 4.5965558568606] , [ 1120104000000 , 4.3747066116976] , [ 1122782400000 , 4.4588822917087] , [ 1125460800000 , 4.4460351848286] , [ 1128052800000 , 3.7989113035136] , [ 1130734800000 , 3.7743883140088] , [ 1133326800000 , 3.7727852823828] , [ 1136005200000 , 7.2968111448895] , [ 1138683600000 , 7.2800122043237] , [ 1141102800000 , 7.1187787503354] , [ 1143781200000 , 8.351887016482] , [ 1146369600000 , 8.4156698763993] , [ 1149048000000 , 8.1673298604231] , [ 1151640000000 , 5.5132447126042] , [ 1154318400000 , 6.1152537710599] , [ 1156996800000 , 6.076765091942] , [ 1159588800000 , 4.6304473798646] , [ 1162270800000 , 4.6301068469402] , [ 1164862800000 , 4.3466656309389] , [ 1167541200000 , 6.830104897003] , [ 1170219600000 , 7.241633040029] , [ 1172638800000 , 7.1432372054153] , [ 1175313600000 , 10.608942063374] , [ 1177905600000 , 10.914964549494] , [ 1180584000000 , 10.933223880565] , [ 1183176000000 , 8.3457524851265] , [ 1185854400000 , 8.1078413081882] , [ 1188532800000 , 8.2697185922474] , [ 1191124800000 , 8.4742436475968] , [ 1193803200000 , 8.4994601179319] , [ 1196398800000 , 8.7387319683243] , [ 1199077200000 , 6.8829183612895] , [ 1201755600000 , 6.984133637885] , [ 1204261200000 , 7.0860136043287] , [ 1206936000000 , 4.3961787956053] , [ 1209528000000 , 3.8699674365231] , [ 1212206400000 , 3.6928925238305] , [ 1214798400000 , 6.7571718894253] , [ 1217476800000 , 6.4367313362344] , [ 1220155200000 , 6.4048441521454] , [ 1222747200000 , 5.4643833239669] , [ 1225425600000 , 5.3150786833374] , [ 1228021200000 , 5.3011272612576] , [ 1230699600000 , 4.1203601430809] , [ 1233378000000 , 4.0881783200525] , [ 1235797200000 , 4.1928665957189] , [ 1238472000000 , 7.0249415663205] , [ 1241064000000 , 7.006530880769] , [ 1243742400000 , 6.994835633224] , [ 1246334400000 , 6.1220222336254] , [ 1249012800000 , 6.1177436137653] , [ 1251691200000 , 6.1413396231981] , [ 1254283200000 , 4.8046006145874] , [ 1256961600000 , 4.6647600660544] , [ 1259557200000 , 4.544865006255] , [ 1262235600000 , 6.0488249316539] , [ 1264914000000 , 6.3188669540206] , [ 1267333200000 , 6.5873958262306] , [ 1270008000000 , 6.2281189839578] , [ 1272600000000 , 5.8948915746059] , [ 1275278400000 , 5.5967320482214] , [ 1277870400000 , 0.99784432084837] , [ 1280548800000 , 1.0950794175359] , [ 1283227200000 , 0.94479734407491] , [ 1285819200000 , 1.222093988688] , [ 1288497600000 , 1.335093106856] , [ 1291093200000 , 1.3302565104985] , [ 1293771600000 , 1.340824670897] , [ 1296450000000 , 0] , [ 1298869200000 , 0] , [ 1301544000000 , 0] , [ 1304136000000 , 0] , [ 1306814400000 , 0] , [ 1309406400000 , 0] , [ 1312084800000 , 0] , [ 1314763200000 , 0] , [ 1317355200000 , 4.4583692315] , [ 1320033600000 , 3.6493043348059] , [ 1322629200000 , 3.8610064091761] , [ 1325307600000 , 5.5144800685202] , [ 1327986000000 , 5.1750695220791] , [ 1330491600000 , 5.6710066952691] , [ 1333166400000 , 5.5611890039181] , [ 1335758400000 , 5.5979368839939]]
        },

        {
          "key" : "South America" ,
          "values" : [ [ 1025409600000 , 7.9149900245423] , [ 1028088000000 , 7.0899888751059] , [ 1030766400000 , 7.5996132380614] , [ 1033358400000 , 8.2741174301034] , [ 1036040400000 , 9.3564460833513] , [ 1038632400000 , 9.7066786059904] , [ 1041310800000 , 10.213363052343] , [ 1043989200000 , 10.285809585273] , [ 1046408400000 , 10.222053149228] , [ 1049086800000 , 8.6188592137975] , [ 1051675200000 , 9.3335447543566] , [ 1054353600000 , 8.9312402186628] , [ 1056945600000 , 8.1895089343658] , [ 1059624000000 , 8.260622135079] , [ 1062302400000 , 7.7700786851364] , [ 1064894400000 , 7.9907428771318] , [ 1067576400000 , 8.7769091865606] , [ 1070168400000 , 8.4855077060661] , [ 1072846800000 , 9.6277203033655] , [ 1075525200000 , 9.9685913452624] , [ 1078030800000 , 10.615085181759] , [ 1080709200000 , 9.2902488079646] , [ 1083297600000 , 8.8610439830061] , [ 1085976000000 , 9.1075344931229] , [ 1088568000000 , 9.9156737639203] , [ 1091246400000 , 9.7826003238782] , [ 1093924800000 , 10.55403610555] , [ 1096516800000 , 10.926900264097] , [ 1099195200000 , 10.903144818736] , [ 1101790800000 , 10.862890389067] , [ 1104469200000 , 10.64604998964] , [ 1107147600000 , 10.042790814087] , [ 1109566800000 , 9.7173391591038] , [ 1112245200000 , 9.6122415755443] , [ 1114833600000 , 9.4337921146562] , [ 1117512000000 , 9.814827171183] , [ 1120104000000 , 12.059260396788] , [ 1122782400000 , 12.139649903873] , [ 1125460800000 , 12.281290663822] , [ 1128052800000 , 8.8037085409056] , [ 1130734800000 , 8.6300618239176] , [ 1133326800000 , 9.1225708491432] , [ 1136005200000 , 12.988124170836] , [ 1138683600000 , 13.356778764353] , [ 1141102800000 , 13.611196863271] , [ 1143781200000 , 6.8959030061189] , [ 1146369600000 , 6.9939633271353] , [ 1149048000000 , 6.7241510257676] , [ 1151640000000 , 5.5611293669517] , [ 1154318400000 , 5.6086488714041] , [ 1156996800000 , 5.4962849907033] , [ 1159588800000 , 6.9193153169278] , [ 1162270800000 , 7.0016334389778] , [ 1164862800000 , 6.7865422443273] , [ 1167541200000 , 9.0006454225383] , [ 1170219600000 , 9.2233916171431] , [ 1172638800000 , 8.8929316009479] , [ 1175313600000 , 10.345937520404] , [ 1177905600000 , 10.075914677026] , [ 1180584000000 , 10.089006188111] , [ 1183176000000 , 10.598330295008] , [ 1185854400000 , 9.9689546533009] , [ 1188532800000 , 9.7740580198146] , [ 1191124800000 , 10.558483060626] , [ 1193803200000 , 9.9314651823603] , [ 1196398800000 , 9.3997715873769] , [ 1199077200000 , 8.4086493387262] , [ 1201755600000 , 8.9698309085926] , [ 1204261200000 , 8.2778357995396] , [ 1206936000000 , 8.8585045600123] , [ 1209528000000 , 8.7013756413322] , [ 1212206400000 , 7.7933605469443] , [ 1214798400000 , 7.0236183483064] , [ 1217476800000 , 6.9873088186829] , [ 1220155200000 , 6.8031713070097] , [ 1222747200000 , 6.6869531315723] , [ 1225425600000 , 6.138256993963] , [ 1228021200000 , 5.6434994016354] , [ 1230699600000 , 5.495220262512] , [ 1233378000000 , 4.6885326869846] , [ 1235797200000 , 4.4524349883438] , [ 1238472000000 , 5.6766520778185] , [ 1241064000000 , 5.7675774480752] , [ 1243742400000 , 5.7882863168337] , [ 1246334400000 , 7.2666010034924] , [ 1249012800000 , 7.5191821322261] , [ 1251691200000 , 7.849651451445] , [ 1254283200000 , 10.383992037985] , [ 1256961600000 , 9.0653691861818] , [ 1259557200000 , 9.6705248324159] , [ 1262235600000 , 10.856380561349] , [ 1264914000000 , 11.27452370892] , [ 1267333200000 , 11.754156529088] , [ 1270008000000 , 8.2870811422455] , [ 1272600000000 , 8.0210264360699] , [ 1275278400000 , 7.5375074474865] , [ 1277870400000 , 8.3419527338039] , [ 1280548800000 , 9.4197471818443] , [ 1283227200000 , 8.7321733185797] , [ 1285819200000 , 9.6627062648126] , [ 1288497600000 , 10.187962234548] , [ 1291093200000 , 9.8144201733476] , [ 1293771600000 , 10.275723361712] , [ 1296450000000 , 16.796066079353] , [ 1298869200000 , 17.543254984075] , [ 1301544000000 , 16.673660675083] , [ 1304136000000 , 17.963944353609] , [ 1306814400000 , 16.63774086721] , [ 1309406400000 , 15.84857094609] , [ 1312084800000 , 14.767303362181] , [ 1314763200000 , 24.778452182433] , [ 1317355200000 , 18.370353229999] , [ 1320033600000 , 15.253137429099] , [ 1322629200000 , 14.989600840649] , [ 1325307600000 , 16.052539160125] , [ 1327986000000 , 16.424390322793] , [ 1330491600000 , 17.884020741104] , [ 1333166400000 , 18.372698836036] , [ 1335758400000 , 18.315881576096]]
        },

        {
          "key" : "Asia" ,
          "values" : [ [ 1025409600000 , 13.153938631352] , [ 1028088000000 , 12.456410521864] , [ 1030766400000 , 12.537048663919] , [ 1033358400000 , 13.947386398309] , [ 1036040400000 , 14.421680682568] , [ 1038632400000 , 14.143238262286] , [ 1041310800000 , 12.229635347478] , [ 1043989200000 , 12.508479916948] , [ 1046408400000 , 12.155368409526] , [ 1049086800000 , 13.335455563994] , [ 1051675200000 , 12.888210138167] , [ 1054353600000 , 12.842092790511] , [ 1056945600000 , 12.513816474199] , [ 1059624000000 , 12.21453674494] , [ 1062302400000 , 11.750848343935] , [ 1064894400000 , 10.526579636787] , [ 1067576400000 , 10.873596086087] , [ 1070168400000 , 11.019967131519] , [ 1072846800000 , 11.235789380602] , [ 1075525200000 , 11.859910850657] , [ 1078030800000 , 12.531031616536] , [ 1080709200000 , 11.360451067019] , [ 1083297600000 , 11.456244780202] , [ 1085976000000 , 11.436991407309] , [ 1088568000000 , 11.638595744327] , [ 1091246400000 , 11.190418301469] , [ 1093924800000 , 11.835608007589] , [ 1096516800000 , 11.540980244475] , [ 1099195200000 , 10.958762325687] , [ 1101790800000 , 10.885791159509] , [ 1104469200000 , 13.605810720109] , [ 1107147600000 , 13.128978067437] , [ 1109566800000 , 13.119012086882] , [ 1112245200000 , 13.003706129783] , [ 1114833600000 , 13.326996807689] , [ 1117512000000 , 13.547947991743] , [ 1120104000000 , 12.807959646616] , [ 1122782400000 , 12.931763821068] , [ 1125460800000 , 12.795359993008] , [ 1128052800000 , 9.6998935538319] , [ 1130734800000 , 9.3473740089131] , [ 1133326800000 , 9.36902067716] , [ 1136005200000 , 14.258619539875] , [ 1138683600000 , 14.21241095603] , [ 1141102800000 , 13.973193618249] , [ 1143781200000 , 15.218233920664] , [ 1146369600000 , 14.382109727451] , [ 1149048000000 , 13.894310878491] , [ 1151640000000 , 15.593086090031] , [ 1154318400000 , 16.244839695189] , [ 1156996800000 , 16.017088850647] , [ 1159588800000 , 14.183951830057] , [ 1162270800000 , 14.148523245696] , [ 1164862800000 , 13.424326059971] , [ 1167541200000 , 12.974450435754] , [ 1170219600000 , 13.232470418021] , [ 1172638800000 , 13.318762655574] , [ 1175313600000 , 15.961407746104] , [ 1177905600000 , 16.287714639805] , [ 1180584000000 , 16.24659058389] , [ 1183176000000 , 17.564505594808] , [ 1185854400000 , 17.872725373164] , [ 1188532800000 , 18.018998508756] , [ 1191124800000 , 15.584518016602] , [ 1193803200000 , 15.480850647182] , [ 1196398800000 , 15.699120036985] , [ 1199077200000 , 19.184281817226] , [ 1201755600000 , 19.691226605205] , [ 1204261200000 , 18.982314051293] , [ 1206936000000 , 18.707820309008] , [ 1209528000000 , 17.459630929759] , [ 1212206400000 , 16.500616076782] , [ 1214798400000 , 18.086324003978] , [ 1217476800000 , 18.929464156259] , [ 1220155200000 , 18.233728682084] , [ 1222747200000 , 16.315776297325] , [ 1225425600000 , 14.632892190251] , [ 1228021200000 , 14.667835024479] , [ 1230699600000 , 13.946993947309] , [ 1233378000000 , 14.394304684398] , [ 1235797200000 , 13.724462792967] , [ 1238472000000 , 10.930879035807] , [ 1241064000000 , 9.8339915513708] , [ 1243742400000 , 10.053858541872] , [ 1246334400000 , 11.786998438286] , [ 1249012800000 , 11.780994901769] , [ 1251691200000 , 11.305889670277] , [ 1254283200000 , 10.918452290083] , [ 1256961600000 , 9.6811395055706] , [ 1259557200000 , 10.971529744038] , [ 1262235600000 , 13.330210480209] , [ 1264914000000 , 14.592637568961] , [ 1267333200000 , 14.605329141157] , [ 1270008000000 , 13.936853794037] , [ 1272600000000 , 12.189480759072] , [ 1275278400000 , 11.676151385046] , [ 1277870400000 , 13.058852800018] , [ 1280548800000 , 13.62891543203] , [ 1283227200000 , 13.811107569918] , [ 1285819200000 , 13.786494560786] , [ 1288497600000 , 14.045162857531] , [ 1291093200000 , 13.697412447286] , [ 1293771600000 , 13.677681376221] , [ 1296450000000 , 19.96151186453] , [ 1298869200000 , 21.049198298156] , [ 1301544000000 , 22.687631094009] , [ 1304136000000 , 25.469010617433] , [ 1306814400000 , 24.88379943712] , [ 1309406400000 , 24.203843814249] , [ 1312084800000 , 22.138760964036] , [ 1314763200000 , 16.034636966228] , [ 1317355200000 , 15.394958944555] , [ 1320033600000 , 12.62564246197] , [ 1322629200000 , 12.973735699739] , [ 1325307600000 , 15.78601833615] , [ 1327986000000 , 15.227368020134] , [ 1330491600000 , 15.899752650733] , [ 1333166400000 , 15.661317319168] , [ 1335758400000 , 15.359891177281]]
        } ,

        {
          "key" : "Europe" ,
          "values" : [ [ 1025409600000 , 9.3433263069351] , [ 1028088000000 , 8.4583069475546] , [ 1030766400000 , 8.0342398154196] , [ 1033358400000 , 8.1538966876572] , [ 1036040400000 , 10.743604786849] , [ 1038632400000 , 12.349366155851] , [ 1041310800000 , 10.742682503899] , [ 1043989200000 , 11.360983869935] , [ 1046408400000 , 11.441336039535] , [ 1049086800000 , 10.897508791837] , [ 1051675200000 , 11.469101547709] , [ 1054353600000 , 12.086311476742] , [ 1056945600000 , 8.0697180773504] , [ 1059624000000 , 8.2004392233445] , [ 1062302400000 , 8.4566434900643] , [ 1064894400000 , 7.9565760979059] , [ 1067576400000 , 9.3764619255827] , [ 1070168400000 , 9.0747664160538] , [ 1072846800000 , 10.508939004673] , [ 1075525200000 , 10.69936754483] , [ 1078030800000 , 10.681562399145] , [ 1080709200000 , 13.184786109406] , [ 1083297600000 , 12.668213052351] , [ 1085976000000 , 13.430509403986] , [ 1088568000000 , 12.393086349213] , [ 1091246400000 , 11.942374044842] , [ 1093924800000 , 12.062227685742] , [ 1096516800000 , 11.969974363623] , [ 1099195200000 , 12.14374574055] , [ 1101790800000 , 12.69422821995] , [ 1104469200000 , 9.1235211044692] , [ 1107147600000 , 8.758211757584] , [ 1109566800000 , 8.8072309258443] , [ 1112245200000 , 11.687595946835] , [ 1114833600000 , 11.079723082664] , [ 1117512000000 , 12.049712896076] , [ 1120104000000 , 10.725319428684] , [ 1122782400000 , 10.844849996286] , [ 1125460800000 , 10.833535488461] , [ 1128052800000 , 17.180932407865] , [ 1130734800000 , 15.894764896516] , [ 1133326800000 , 16.412751299498] , [ 1136005200000 , 12.573569093402] , [ 1138683600000 , 13.242301508051] , [ 1141102800000 , 12.863536342041] , [ 1143781200000 , 21.034044171629] , [ 1146369600000 , 21.419084618802] , [ 1149048000000 , 21.142678863692] , [ 1151640000000 , 26.56848967753] , [ 1154318400000 , 24.839144939906] , [ 1156996800000 , 25.456187462166] , [ 1159588800000 , 26.350164502825] , [ 1162270800000 , 26.478333205189] , [ 1164862800000 , 26.425979547846] , [ 1167541200000 , 28.191461582256] , [ 1170219600000 , 28.930307448808] , [ 1172638800000 , 29.521413891117] , [ 1175313600000 , 28.188285966466] , [ 1177905600000 , 27.704619625831] , [ 1180584000000 , 27.49086242483] , [ 1183176000000 , 28.770679721286] , [ 1185854400000 , 29.06048067145] , [ 1188532800000 , 28.240998844973] , [ 1191124800000 , 33.004893194128] , [ 1193803200000 , 34.075180359928] , [ 1196398800000 , 32.548560664834] , [ 1199077200000 , 30.629727432729] , [ 1201755600000 , 28.642858788159] , [ 1204261200000 , 27.973575227843] , [ 1206936000000 , 27.393351882726] , [ 1209528000000 , 28.476095288522] , [ 1212206400000 , 29.29667866426] , [ 1214798400000 , 29.222333802896] , [ 1217476800000 , 28.092966093842] , [ 1220155200000 , 28.107159262922] , [ 1222747200000 , 25.482974832099] , [ 1225425600000 , 21.208115993834] , [ 1228021200000 , 20.295043095268] , [ 1230699600000 , 15.925754618402] , [ 1233378000000 , 17.162864628346] , [ 1235797200000 , 17.084345773174] , [ 1238472000000 , 22.24600710228] , [ 1241064000000 , 24.530543998508] , [ 1243742400000 , 25.084184918241] , [ 1246334400000 , 16.606166527359] , [ 1249012800000 , 17.239620011628] , [ 1251691200000 , 17.336739127379] , [ 1254283200000 , 25.478492475754] , [ 1256961600000 , 23.017152085244] , [ 1259557200000 , 25.617745423684] , [ 1262235600000 , 24.061133998641] , [ 1264914000000 , 23.223933318646] , [ 1267333200000 , 24.425887263936] , [ 1270008000000 , 35.501471156693] , [ 1272600000000 , 33.775013878675] , [ 1275278400000 , 30.417993630285] , [ 1277870400000 , 30.023598978467] , [ 1280548800000 , 33.327519522436] , [ 1283227200000 , 31.963388450372] , [ 1285819200000 , 30.49896723209] , [ 1288497600000 , 32.403696817913] , [ 1291093200000 , 31.47736071922] , [ 1293771600000 , 31.53259666241] , [ 1296450000000 , 41.760282761548] , [ 1298869200000 , 45.605771243237] , [ 1301544000000 , 39.986557966215] , [ 1304136000000 , 43.84633051005] , [ 1306814400000 , 39.857316881858] , [ 1309406400000 , 37.675127768207] , [ 1312084800000 , 35.775077970313] , [ 1314763200000 , 48.631009702578] , [ 1317355200000 , 42.830831754505] , [ 1320033600000 , 35.611502589362] , [ 1322629200000 , 35.320136981738] , [ 1325307600000 , 31.564136901516] , [ 1327986000000 , 32.074407502433] , [ 1330491600000 , 35.053013769977] , [ 1333166400000 , 33.873085184128] , [ 1335758400000 , 32.321039427046]]
        } ,

        {
          "key" : "Australia" ,
          "values" : [ [ 1025409600000 , 5.1162447683392] , [ 1028088000000 , 4.2022848306513] , [ 1030766400000 , 4.3543715758736] , [ 1033358400000 , 5.4641223667245] , [ 1036040400000 , 6.0041275884577] , [ 1038632400000 , 6.6050520064486] , [ 1041310800000 , 5.0154059912793] , [ 1043989200000 , 5.1835708554647] , [ 1046408400000 , 5.1142682006164] , [ 1049086800000 , 5.0271381717695] , [ 1051675200000 , 5.3437782653456] , [ 1054353600000 , 5.2105844515767] , [ 1056945600000 , 6.552565997799] , [ 1059624000000 , 6.9873363581831] , [ 1062302400000 , 7.010986789097] , [ 1064894400000 , 4.4254242025515] , [ 1067576400000 , 4.9613848042174] , [ 1070168400000 , 4.8854920484764] , [ 1072846800000 , 4.0441111794228] , [ 1075525200000 , 4.0219596813179] , [ 1078030800000 , 4.3065749225355] , [ 1080709200000 , 3.9148434915404] , [ 1083297600000 , 3.8659430654512] , [ 1085976000000 , 3.9572824600686] , [ 1088568000000 , 4.7372190641522] , [ 1091246400000 , 4.6871476374455] , [ 1093924800000 , 5.0398702564196] , [ 1096516800000 , 5.5221787544964] , [ 1099195200000 , 5.424646299798] , [ 1101790800000 , 5.9240223067349] , [ 1104469200000 , 5.9936860983601] , [ 1107147600000 , 5.8499523215019] , [ 1109566800000 , 6.4149040329325] , [ 1112245200000 , 6.4547895561969] , [ 1114833600000 , 5.9385382611161] , [ 1117512000000 , 6.0486751030592] , [ 1120104000000 , 5.23108613838] , [ 1122782400000 , 5.5857797121029] , [ 1125460800000 , 5.3454665096987] , [ 1128052800000 , 5.0439154120119] , [ 1130734800000 , 5.054634702913] , [ 1133326800000 , 5.3819451380848] , [ 1136005200000 , 5.2638869269803] , [ 1138683600000 , 5.5806167415681] , [ 1141102800000 , 5.4539047069985] , [ 1143781200000 , 7.6728842432362] , [ 1146369600000 , 7.719946716654] , [ 1149048000000 , 8.0144619912942] , [ 1151640000000 , 7.942223133434] , [ 1154318400000 , 8.3998279827444] , [ 1156996800000 , 8.532324572605] , [ 1159588800000 , 4.7324285199763] , [ 1162270800000 , 4.7402397487697] , [ 1164862800000 , 4.9042069355168] , [ 1167541200000 , 5.9583963430882] , [ 1170219600000 , 6.3693899239171] , [ 1172638800000 , 6.261153903813] , [ 1175313600000 , 5.3443942184584] , [ 1177905600000 , 5.4932111235361] , [ 1180584000000 , 5.5747393101109] , [ 1183176000000 , 5.3833633060013] , [ 1185854400000 , 5.5125898831832] , [ 1188532800000 , 5.8116112661327] , [ 1191124800000 , 4.3962296939996] , [ 1193803200000 , 4.6967663605521] , [ 1196398800000 , 4.7963004350914] , [ 1199077200000 , 4.1817985183351] , [ 1201755600000 , 4.3797643870182] , [ 1204261200000 , 4.6966642197965] , [ 1206936000000 , 4.3609995132565] , [ 1209528000000 , 4.4736290996496] , [ 1212206400000 , 4.3749762738128] , [ 1214798400000 , 3.3274661194507] , [ 1217476800000 , 3.0316184691337] , [ 1220155200000 , 2.5718140204728] , [ 1222747200000 , 2.7034994044603] , [ 1225425600000 , 2.2033786591364] , [ 1228021200000 , 1.9850621240805] , [ 1230699600000 , 0] , [ 1233378000000 , 0] , [ 1235797200000 , 0] , [ 1238472000000 , 0] , [ 1241064000000 , 0] , [ 1243742400000 , 0] , [ 1246334400000 , 0] , [ 1249012800000 , 0] , [ 1251691200000 , 0] , [ 1254283200000 , 0.44495950017788] , [ 1256961600000 , 0.33945469262483] , [ 1259557200000 , 0.38348269455195] , [ 1262235600000 , 0] , [ 1264914000000 , 0] , [ 1267333200000 , 0] , [ 1270008000000 , 0] , [ 1272600000000 , 0] , [ 1275278400000 , 0] , [ 1277870400000 , 0] , [ 1280548800000 , 0] , [ 1283227200000 , 0] , [ 1285819200000 , 0] , [ 1288497600000 , 0] , [ 1291093200000 , 0] , [ 1293771600000 , 0] , [ 1296450000000 , 0.52216435716176] , [ 1298869200000 , 0.59275786698454] , [ 1301544000000 , 0] , [ 1304136000000 , 0] , [ 1306814400000 , 0] , [ 1309406400000 , 0] , [ 1312084800000 , 0] , [ 1314763200000 , 0] , [ 1317355200000 , 0] , [ 1320033600000 , 0] , [ 1322629200000 , 0] , [ 1325307600000 , 0] , [ 1327986000000 , 0] , [ 1330491600000 , 0] , [ 1333166400000 , 0] , [ 1335758400000 , 0]]
        } ,

        {
          "key" : "Antarctica" ,
          "values" : [ [ 1025409600000 , 1.3503144674343] , [ 1028088000000 , 1.2232741112434] , [ 1030766400000 , 1.3930470790784] , [ 1033358400000 , 1.2631275030593] , [ 1036040400000 , 1.5842699103708] , [ 1038632400000 , 1.9546996043116] , [ 1041310800000 , 0.8504048300986] , [ 1043989200000 , 0.85340686311353] , [ 1046408400000 , 0.843061357391] , [ 1049086800000 , 2.119846992476] , [ 1051675200000 , 2.5285382124858] , [ 1054353600000 , 2.5056570712835] , [ 1056945600000 , 2.5212789901005] , [ 1059624000000 , 2.6192011642534] , [ 1062302400000 , 2.5382187823805] , [ 1064894400000 , 2.3393223047168] , [ 1067576400000 , 2.491219888698] , [ 1070168400000 , 2.497555874906] , [ 1072846800000 , 1.734018115546] , [ 1075525200000 , 1.9307268299646] , [ 1078030800000 , 2.2261679836799] , [ 1080709200000 , 1.7608893704206] , [ 1083297600000 , 1.6242690616808] , [ 1085976000000 , 1.7161663801295] , [ 1088568000000 , 1.7183554537038] , [ 1091246400000 , 1.7179780759145] , [ 1093924800000 , 1.7314274801784] , [ 1096516800000 , 1.2596883356752] , [ 1099195200000 , 1.381177053009] , [ 1101790800000 , 1.4408819615814] , [ 1104469200000 , 3.4743581836444] , [ 1107147600000 , 3.3603749903192] , [ 1109566800000 , 3.5350883257893] , [ 1112245200000 , 3.0949644237828] , [ 1114833600000 , 3.0796455899995] , [ 1117512000000 , 3.3441247640644] , [ 1120104000000 , 4.0947643978168] , [ 1122782400000 , 4.4072631274052] , [ 1125460800000 , 4.4870979780825] , [ 1128052800000 , 4.8404549457934] , [ 1130734800000 , 4.8293016233697] , [ 1133326800000 , 5.2238093263952] , [ 1136005200000 , 3.382306337815] , [ 1138683600000 , 3.7056975170243] , [ 1141102800000 , 3.7561118692318] , [ 1143781200000 , 2.861913700854] , [ 1146369600000 , 2.9933744103381] , [ 1149048000000 , 2.7127537218463] , [ 1151640000000 , 3.1195497076283] , [ 1154318400000 , 3.4066964004508] , [ 1156996800000 , 3.3754571113569] , [ 1159588800000 , 2.2965579982924] , [ 1162270800000 , 2.4486818633018] , [ 1164862800000 , 2.4002308848517] , [ 1167541200000 , 1.9649579750349] , [ 1170219600000 , 1.9385263638056] , [ 1172638800000 , 1.9128975336387] , [ 1175313600000 , 2.3412869836298] , [ 1177905600000 , 2.4337870351445] , [ 1180584000000 , 2.62179703171] , [ 1183176000000 , 3.2642864957929] , [ 1185854400000 , 3.3200396223709] , [ 1188532800000 , 3.3934212707572] , [ 1191124800000 , 4.2822327088179] , [ 1193803200000 , 4.1474964228541] , [ 1196398800000 , 4.1477082879801] , [ 1199077200000 , 5.2947122916128] , [ 1201755600000 , 5.2919843508028] , [ 1204261200000 , 5.198978305031] , [ 1206936000000 , 3.5603057673513] , [ 1209528000000 , 3.3009087690692] , [ 1212206400000 , 3.1784852603792] , [ 1214798400000 , 4.5889503538868] , [ 1217476800000 , 4.401779617494] , [ 1220155200000 , 4.2208301828278] , [ 1222747200000 , 3.89396671475] , [ 1225425600000 , 3.0423832241354] , [ 1228021200000 , 3.135520611578] , [ 1230699600000 , 1.9631418164089] , [ 1233378000000 , 1.8963543874958] , [ 1235797200000 , 1.8266636017025] , [ 1238472000000 , 0.93136635895188] , [ 1241064000000 , 0.92737801918888] , [ 1243742400000 , 0.97591889805002] , [ 1246334400000 , 2.6841193805515] , [ 1249012800000 , 2.5664341140531] , [ 1251691200000 , 2.3887523699873] , [ 1254283200000 , 1.1737801663681] , [ 1256961600000 , 1.0953582317281] , [ 1259557200000 , 1.2495674976653] , [ 1262235600000 , 0.36607452464754] , [ 1264914000000 , 0.3548719047291] , [ 1267333200000 , 0.36769242398939] , [ 1270008000000 , 0] , [ 1272600000000 , 0] , [ 1275278400000 , 0] , [ 1277870400000 , 0] , [ 1280548800000 , 0] , [ 1283227200000 , 0] , [ 1285819200000 , 0.85450741275337] , [ 1288497600000 , 0.91360317921637] , [ 1291093200000 , 0.89647678692269] , [ 1293771600000 , 0.87800687192639] , [ 1296450000000 , 0] , [ 1298869200000 , 0] , [ 1301544000000 , 0.43668720882994] , [ 1304136000000 , 0.4756523602692] , [ 1306814400000 , 0.46947368328469] , [ 1309406400000 , 0.45138896152316] , [ 1312084800000 , 0.43828726648117] , [ 1314763200000 , 2.0820861395316] , [ 1317355200000 , 0.9364411075395] , [ 1320033600000 , 0.60583907839773] , [ 1322629200000 , 0.61096950747437] , [ 1325307600000 , 0] , [ 1327986000000 , 0] , [ 1330491600000 , 0] , [ 1333166400000 , 0] , [ 1335758400000 , 0]]
        }

        ]
		
      });
