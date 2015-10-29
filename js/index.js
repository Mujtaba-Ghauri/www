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
        initialize: function () {
            this.bindEvents();
        },
        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function () {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'
        onDeviceReady: function () {
            document.getElementById("convert").addEventListener('submit', app.convert, false);
            document.getElementById("changePage").addEventListener('click', app.changePage, false);
            document.getElementById("saveXrate").addEventListener('submit', app.saveXrate, false);
            document.getElementById("showDatabase").addEventListener('click', app.onShowDatabaseClick, false);

            app.createXrateDatabase();
        },

        convert: function (e) {

            e.preventDefault();

            var entry = this.entry.value;
            var convertTo;
            for (var i = 0; i < this.convertTo.length; i++) {
                if (this.convertTo[i].checked) {
                    convertTo = this.convertTo[i].value;
                }
            }

            var Xrate = window.localStorage.getItem("Xrate");

            if (Xrate != null) {
                if (convertTo == 'euros') {
                    var result = entry * Xrate;
                    document.getElementById("converted-entry").textContent = '£' + entry + ' is €' + result.toFixed(2);

                } else {
                    var result = entry / Xrate;
                    document.getElementById("converted-entry").textContent = '€' + entry + ' is £' + result.toFixed(2);
                }

            } else {
                alert('Xrate not set');
            }
        },

        changePage: function () {

            var mainPage = document.getElementById("mainPage");
            var settingsPage = document.getElementById("settingsPage");

            if (document.getElementById("mainPage").style.display == "block") {
                mainPage.style.display = "none";
                settingsPage.style.display = "block";
                this.textContent = "Back";


            } else {
                mainPage.style.display = "block";
                settingsPage.style.display = "none";
                this.textContent = "Settings";
            }
        },

        saveXrate: function (e) {
            e.preventDefault();
            var entry = this.xrate.value;

            window.localStorage.setItem("Xrate", entry);
            alert('Xrate ' + entry + ' saved in LocalStorage');
        },

        createXrateDatabase: function () {
            var db = window.openDatabase("XrateDB", "1.0", "Exchange Rate Database", 1000);
            db.transaction(this.populateDB, this.errorDB);

        },

        populateDB: function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS XRATES');
            tx.executeSql('CREATE TABLE IF NOT EXISTS XRATES (id UNIQUE, currency, Xrate)');
            tx.executeSql('INSERT INTO XRATES (id, currency, Xrate) VALUES (1, "EURO", "1.26")');
            tx.executeSql('INSERT INTO XRATES (id, currency, Xrate) VALUES (2, "DOLLAR", "1.61")');
            tx.executeSql('INSERT INTO XRATES (id, currency, Xrate) VALUES (3, "YEN", "172.00")');
            tx.executeSql('INSERT INTO XRATES (id, currency, Xrate) VALUES (4, "RUPEES", "175.00")');
        },
        errorDB: function (err) {
            alert('Something went wrong :(');
            console.log(err);
        },

        onShowDatabaseClick: function (e) {
            e.preventDefault();
            var db = window.openDatabase("XrateDB", "1.0", "Exchange Rate Database", 1000);
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM XRATES', [], app.querySuccess, app.errorDB);
            }, app.errorDB);
        },

        querySuccess: function (tx, results) {

            document.getElementById("contentsPanel").style.display = "block";
            var len = results.rows.length;
            var databaseItems = document.getElementById('databaseItems');
            while (databaseItems.firstChild) {
                databaseItems.removeChild(databaseItems.firstChild);
            }
            for (var i = 0; i < len; i++) {
                var pEl = document.createElement('p');
                pEl.textContent = results.rows.item(i).currency + " " + results.rows.item(i).Xrate;
                databaseItems.appendChild(pEl);
            }

            document.getElementById("databaseTable").style.display = "block";
            var tableBody = document.getElementById("databaseTable").getElementsByTagName('tbody')[0];

            while (tableBody.firstChild) {
                tableBody.removeChild(tableBody.firstChild);
            }

            for (i = 0; i < len; i++) {
                var row = tableBody.insertRow(-1);  // inset at end
                var cell0 = row.insertCell(0);
                cell0.textContent = results.rows.item(i).currency;
                var cell1 = row.insertCell(1);
                cell1.textContent = results.rows.item(i).Xrate;
            }
        }

    }
    ;

app.initialize();








