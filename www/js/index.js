/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

	// Orientation change
	window.addEventListener('orientationchange', this.onOrientationChange, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

	// Init map
	initMap();

	// Trying to get the db
	console.log("going to open a db file");
	//testDb();
	console.log("after db");

	// Test the file system path
	testFs();

	console.log("cordova file");
	alert("cordova file doc:"+cordova.file.applicationStorageDirectory);
	alert("cordova file doc:"+cordova.file.applicationDirectory);
	alert("cordova file data directory:"+cordova.file.dataDirectory);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
	onOrientationChange: function() {
		// Resize map
		resizeMap();
	}


};

// Get device info
function getDeviceInfo() {
	return {
		cordova: device.cordova,
		model: device.model,
		platform: device.platform,
		uuid: device.uuid,
		version: device.version
	}
}

var map = null;
var home = [51.505, -0.08];
var defaultZoom = 2;
function initMap() {
	var mapEl = $('#map');

	// Set the size
	resizeMap();

	// Make a new map without zoom control
	map = L.map('map', {
		zoomControl: false
	});

	// Set the view
	map.setView(
		home,
		defaultZoom
	);

console.log(home);
console.log(defaultZoom);
console.log("going to add tile layer");
	// Set the tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// Automatically calculate the device size and resize the map
function resizeMap(el) {
	var mapEl = el || $('#map');

	// Find the window size
	mapEl.width($(document).width());
	mapEl.height($(document).height());
console.log("this is the height");
var mapHeight = mapEl.height();
console.log(mapHeight);
}

function testDb() {

console.log("test db");
	var db = window.sqlitePlugin.openDatabase({name: "my.db", createFromLocation: 1});

	  db.transaction(function(tx) {
	    tx.executeSql('DROP TABLE IF EXISTS test_table');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');

	    // demonstrate PRAGMA:
	    db.executeSql("pragma table_info (test_table);", [], function(res) {
	      console.log("PRAGMA res: " + JSON.stringify(res));
	    });

	    tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", 100], function(tx, res) {
alert("inserted into test_table");
	      console.log("insertId: " + res.insertId + " -- probably 1");
	      console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

	      db.transaction(function(tx) {
		tx.executeSql("select count(id) as cnt from test_table;", [], function(tx, res) {
		  console.log("res.rows.length: " + res.rows.length + " -- should be 1");
		  console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
		});
	      });

	    }, function(e) {
	alert("there is an error trying to insert db");
	      console.log("ERROR: " + e.message);
	    });
	});
}

function testFs() {
	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 , gotFs, fail);
}

function fail() {
	alert("can't get file system");
}

function gotFs(fileSystem) {
window.fileSystem = fileSystem;
alert("got file system:"+fileSystem.name);
	console.log(fileSystem.root.fullPath);
alert(fileSystem.root.toURL());
alert(fileSystem.root.fullPath);

	// Try to read the files within the root directory
	var directoryReader = fileSystem.root.createReader();

	directoryReader.readEntries(function(entries) {
		for (var i = 0; i < entries.length; i++) {
			console.log(entries[i].name);
		}
	});
}
