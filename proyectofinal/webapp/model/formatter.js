sap.ui.define([], function () {

    function dateFormat(date) {
        
        if (date) {

            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "d MMM y"
            });
            var dateNewFormat = new String(dateFormat.format(date));
            return dateNewFormat;                        
        }
    }
    return {
        dateFormat: dateFormat
    }
}); 