const fs = require('fs');
const parse = require('csv-parse');
const dialog = require('electron').remote.dialog; 
const app = require('electron').remote.app;

let openFile = document.getElementById('open-file-manager');

openFile.addEventListener('click', function() {
    dialog.showOpenDialog((fileNameArray) => {

        if(fileNameArray === undefined) {
            console.log('No file selected');
            return;
        };

        let fileName = fileNameArray[0];

        fs.readFile(fileName, function (err, fileData) {
            if(err) {
                alert("An error ocurred reading the file :" + err.message);
            };

            parse(fileData, {columns: null, trim: true}, function(err, rows) {
                /*
                 * rows is an array of arrays that is passed to this callback
                 * column 13 = SIG
                 * column 25 = patient name
                 */
                let month = document.getElementById('month').value;
                let regexPattern = new RegExp("-" + month + "[0-9]{1,2}", 'i');

                var parsed_content_done = parse_array(rows, parsed_content);
                var final_report_done = searchPattern(regexPattern, parsed_content_done, final_report);
                sort_by_date(final_report_done);

                let downloadFolderPath = app.getPath('downloads');

                let file = fs.createWriteStream(downloadFolderPath + '/refills_due.csv');
                final_report.forEach(function(row) {
                    file.write(row.join(', ') + '\n');
                })
                cleanup();
            });
        });
    });
});



function cleanup() {
    document.getElementById('month').value = '';
    let myNotification = new Notification('Pharmalyze Message', {
        body: 'Your refills report has been generated in your Downloads folder'
    })
};
    

var parsed_content = [];
var check_duplicates_array = [];
var final_report = [];

var is_duplicate = function(data, check_duplicates_array) {
    /* *
     * Checks whether the @param 'data' is already included in our parsed_content and check_duplicates_array (which should have the same elements)
     * @param {Array} data is an array with pt_name as first element and month as second element
     *
     * @returns {Boolean} Returns true if data is already in the check_duplicates_array and false if data is not in the array
     *
     */
    let pt_name = data[0];
    let due_date = data[1];
    if (check_duplicates_array.length > 0) {
        for (let i = 0; i < check_duplicates_array.length; i++) {
            if (check_duplicates_array[i][0] === pt_name && check_duplicates_array[i][1] === due_date) {
                return true;
            };
        };
    } else {
        return false;
    };
    return false;
};

var format_date = function(input) {
    /**
     * Adds a '0' in front of date for dates that are single digit
     *
     * @param {string} input is a date in the format of a three character month and single digit number
     *
     * @returns {string} Returns the input but with a 0 in front of the single digit
     *
     * @example 
     * format_date('NOV9'); // => NOV09
     *
     */
    let output = input.slice(0,3) + '0' + input.slice(3);
    return output;
};

var searchPattern = function(regexPattern, array_of_arrays, final_report) {
    /** 
     * Searches the 'sig' column (second column) to find whether its contents match the regex pattern named 'regexPattern'.
     * If there is a match, it checks whether the patient name and sig have already been added into the final_report array by checking the
     * not_duplicats() function
     *
     * @param {regex} regexPattern is a regular expression in the format of RegExp("-" + month + "[0-9]{1,2}", 'i') 
     * @param {Array} array_of_arrays has been parsed from the csv file
     * @param {array} final_report is the array that will contain the end result
     *
     * @returns {array} final_report which is a 2-D array where each element is an array that contains the matched patient name and SIG
     *
     *
     */
    array_of_arrays.forEach(function(row) {
        let sig = row[1];
        let match = regexPattern.test(sig);
        if (match) {
            let pre_due_date = sig.match(regexPattern)[0];
            let due_date = pre_due_date.slice(1);
            
            if (due_date.length === 4) {
                /* 
                 * due_date must have a string length of 5. Eg. NOV09
                 * If due_date has a string length of 4, it means that the date portion is a single digit number missing a '0' in front. eg. NOV9
                 * format_date will add the 0 in front of the date if the string length is 4
                 */
                due_date = format_date(due_date);
            };
                
            let pt_name = row[0];
            data = [pt_name, due_date];
            if (is_duplicate(data, check_duplicates_array) === false) {
                final_report.push(data);
                check_duplicates_array.push(data);
            }
        };
    });
    return final_report;
};

var parse_array = function(array_of_arrays, parsed_content_array) {
    /**
     * Takes in the 2-D array from the CSV file of patient information, and parses only columns 25 and 13 which are patient name and SIG which are passed to a 
     * new array called parsed_content
     *
     * @param {Array} array_of_arrays is the 2-D array that contains all patient information from the CSV
     * @param {Array} parsed_Content_array is the array that will store columns 25 and 13 into a single array, resulting in a 2-D array
     *
     * @returns {array} Returns parsed_content_array
     *
     */
    array_of_arrays.forEach(function(row) {
        let new_row = [row[25], row[13]];
        parsed_content_array.push(new_row);
    });

    return parsed_content_array;
};

var sort_by_date = function(array_of_arrays) {
    /** 
     * Sorts the 2-D array according to due date, by ascending order (eg. 01, 02, 03,... 30)
     *
     * @param {array} array_of_arrays is a 2-D array with two columns: patient name and SIG
     *
     */
    array_of_arrays.sort(function(a, b) {
        if (a[1] < b[1]) { return -1 };
        if (a[1] > b[1]) { return 1 };
    });
    return;
};




module.exports.parse_array = parse_array;
module.exports.searchPattern = searchPattern;
module.exports.is_duplicate = is_duplicate;
