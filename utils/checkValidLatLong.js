/**
* Middleware to validate lat/long.
* 
* @author Nam Tran
* @version 4.17.23
*/

function checkValidLatLong(req, res, next) {
    const lat = req.query.latitude;
    const long = req.query.longitude;
    const latRegex = new RegExp(/^(\+|-)?(?:90(?:(?:\.0{1,20})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,20})?))$/)
    const longRegex = new RegExp(/^(\+|-)?(?:180(?:(?:\.0{1,20})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,20})?))$/);

    if (!lat || !long || !latRegex.test(lat) || !longRegex.test(long)) {
        return res.status(500).send("Needs both a valid latitude and longitude");
    } else {
        return next();
    }
}

module.exports = checkValidLatLong;