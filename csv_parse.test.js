const CSVParse = require('./csv_parse');


test('parsed_content function returns a new 2-D array with columns 25 (patient name) and 13 (SIG)', () => {
    let answer = [['PatientName', 'Sig'], ['TEST, PATIENT', '(SEPT09-NOV07) TAKE 1 TABLET ONCE DAILY'], ['TEST, PATIENT', '(SEPT09-NOV07) TAKE 1 TABLET ONCE DAILY'], ['TEST, PATIENT 2', '(SEPT20-NOV18) TAKE 1 TABLET ONCE DAILY']];
    expect(CSVParse.parse_array(csv_array, parsed_content)).toEqual(answer);
});


test('is_duplicate function returns false for non-duplicate element', () => {
    let check_duplicates_array = [['PatientName', 'Sig'], ['TEST, PATIENT', '(SEPT09-NOV07) TAKE 1 TABLET ONCE DAILY']];
    let newElement = ['TEST, PATIENT 2', '(SEP20-NOV18) TAKE 1 TABLET ONCE DAILY'];
    expect(CSVParse.is_duplicate(newElement, check_duplicates_array)).toBeFalsy();
});

test('is_duplicate function returns true for duplicated element', () => {
    let check_duplicates_array = [['PatientName', 'Sig'], ['TEST, PATIENT', '(SEPT09-NOV07) TAKE 1 TABLET ONCE DAILY']];
    let newElement = ['TEST, PATIENT', '(SEPT09-NOV07) TAKE 1 TABLET ONCE DAILY'];
    expect(CSVParse.is_duplicate(newElement, check_duplicates_array)).toBeTruthy();
});

test('searchPattern to match requested regex pattern', () => {
    let month = "NOV";
    let regexPattern = new RegExp("-" + month + "[0-9]{1,2}", 'i');
    let final_report = [];
    let check_duplicates = [];
    let pre_parsed_array = [];
    let parsed_array = CSVParse.parse_array(csv_array, pre_parsed_array);
    let answer = [['TEST, PATIENT', 'NOV07'], ['TEST, PATIENT 2', 'NOV18']];
    expect(CSVParse.searchPattern(regexPattern, parsed_array, final_report)).toEqual(answer);
});
	

var parsed_content = [];

const csv_array = [
    ['RxNumber', 'FirstFillDate', 'TxNumber', 'FillDate', 'PharmacistsInitials', 'AuthorizedQuantity', 'DispensedQuantity','RemainingQuantity', 'DaysSupply', 'OralWritten', 'PreviousTxNumber', 'PreviousFillDate','DaysAgo', 'Sig', 'RxStatus', 'RxComment','AcquisitionCost', 'Cost', 'Markup', 'Fees', 'Total', 'Discount', 'Co-pay', 'ThirdPartyPays', 'Plans', 'PatientName', 'PatientAddress','PatientCity', 'PatientProvState', 'PatientPhone', 'PatientBirthdate', 'DoctorName', 'DoctorAddress', 'DoctorCity', 'DoctorProvState','DoctorPhone', 'DoctorLicence', 'FirstDrugName', 'SecondDrugName', 'DIN', 'Manufacturer', 'PackSize', 'Narcotic','Tier' ],

    ["COL 0", "COL 1", "COL 2", "COL 3", "COL 4", "COL 5", "COL 6", "COL 7", "COL 8", "COL 9", "COL 10", "COL 11", "COL 12", "(SEPT09-NOV07) TAKE 1 TABLET ONCE DAILY", "COL 14", "COL 15", "COL 16", "COL 17", "COL 18", "COL 19", "COL 20", "COL 21", "COL 22", "COL 23", "COL 24", "TEST, PATIENT"],

    ["COL 0", "COL 1", "COL 2", "COL 3", "COL 4", "COL 5", "COL 6", "COL 7", "COL 8", "COL 9", "COL 10", "COL 11", "COL 12", "(SEPT09-NOV07) TAKE 1 TABLET ONCE DAILY", "COL 14", "COL 15", "COL 16", "COL 17", "COL 18", "COL 19", "COL 20", "COL 21", "COL 22", "COL 23", "COL 24", "TEST, PATIENT"], // duplicate of previous element

    ["COL 0", "COL 1", "COL 2", "COL 3", "COL 4", "COL 5", "COL 6", "COL 7", "COL 8", "COL 9", "COL 10", "COL 11", "COL 12", "(SEPT20-NOV18) TAKE 1 TABLET ONCE DAILY", "COL 14", "COL 15", "COL 16", "COL 17", "COL 18", "COL 19", "COL 20", "COL 21", "COL 22", "COL 23", "COL 24", "TEST, PATIENT 2"],
        ];
    
