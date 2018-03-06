const fs = require('fs');
const parse = require('csv-parse');



let month = "NOV";

let regexPattern = new RegExp("-" + month + "[0-9]{1,2}", 'i');

// column 13 = SIG
// column 25 = patient name

var parsed_content = [];
var final_report = [];
var check_duplicates_array = [];

var not_duplicate = function(data) {
    // data is an array with pt_name as first element and month as second element
    let pt_name = data[0];
    let due_date = data[1];
    let answer = false;
    if (check_duplicates_array.length > 0) {
        // if the array is populated go through the forEach function. if it's not populated, then return true;
        check_duplicates_array.forEach(function(arr) {
            // return true if no duplicates found
            if (arr.includes(pt_name) && arr.includes(due_date, 1)) {
                return answer = false;
            } else {
                return answer = true;
            };
        });
    } else {
        return answer = true;
    };
    return answer;
};

var format_date = function(input) {
    let output = input.slice(0,3) + '0' + input.slice(3);
    return output;
};

var searchPattern = function(parsed_content) {
    parsed_content.forEach(function(row) {
        let sig = row[1];
        let match = regexPattern.test(sig);
        if (match) {
            let pre_due_date = sig.match(regexPattern)[0];
            let due_date = pre_due_date.slice(1);
            
            if (due_date.length === 4) {
                /* due_date must have a string length of 5. Eg. NOV09
                 * If due_date has a string length of 4, it means that the date portion is a single digit number missing a '0' in front. eg. NOV9
                 * format_date will add the 0 in front of the date if the string length is 4
                 */
                due_date = format_date(due_date);
            };
                
            let pt_name = row[0];
            data = [pt_name, due_date];
            if (not_duplicate(data)) {
                final_report.push(data);
                check_duplicates_array.push(data);
            }
        };
    });
};

var parse_array = function(array_of_arrays, parsed_content_array) {
    array_of_arrays.forEach(function(row) {
        let new_row = [row[25], row[13]];
        parsed_content_array.push(new_row);
    });
};

var sort_by_date = function(array_of_arrays) {
    array_of_arrays.sort(function(a, b) {
        if (a[1] < b[1]) { return -1 };
        if (a[1] > b[1]) { return 1 };
    });
    return;
};


fs.readFile('hm_batch.csv', function (err, fileData) {
    parse(fileData, {columns: null, trim: true}, function(err, rows) {
        //rows is an array of arrays that is passed to this callback
        parse_array(rows, parsed_content);
        searchPattern(parsed_content);
        sort_by_date(final_report);
        let file = fs.createWriteStream('jsOutput.csv');
        final_report.forEach(function(row) {
            file.write(row.join(', ') + '\n');
        });
    });
});

