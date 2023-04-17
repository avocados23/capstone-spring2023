/**
* Middleware to validate lat/long.
* 
* @author Nam Tran
* @version 4.17.23
*/

function checkValidLatLongMultiple(req, res, next) {
    const destLat = req.query.destLat;
    const destLong = req.query.destLong;
    const clientLat = req.query.clientLat;
    const clientLong = req.query.clientLong;

    const latRegex = new RegExp(/^(\+|-)?(?:90(?:(?:\.0{1,20})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,20})?))$/)
    const longRegex = new RegExp(/^(\+|-)?(?:180(?:(?:\.0{1,20})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,20})?))$/);

    if (!destLat || !destLong || !clientLat || !clientLong || !latRegex.test(destLat) || !latRegex.test(clientLat) || !longRegex.test(clientLong) || !longRegex.test(destLong)) {
        return res.status(500).send("Invalid lat long values");
    } else {
        return next();
    }
}

module.exports = checkValidLatLongMultiple;