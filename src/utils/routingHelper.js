import objectAssign from 'object-assign';

export function modifyQueryPart(search, modifiedParts) {
    let query = getQueryObject(search)
    let newQuery = objectAssign( query, modifiedParts);
    let pNames = Object.getOwnPropertyNames(newQuery);
    let querypart = "?";
    let first = true;
    for (let nidx in pNames) {
        let connector;
        if (first) {
            connector = "";
        } else {
            connector = "&";
        }
        querypart = querypart.concat(connector,pNames[nidx],"=",newQuery[pNames[nidx]]);
        first = false;
    }
    return querypart;
}
export function getQueryObject(search) {
    let obj = {};
    if(search) {
        search.slice(1).split('&').map((item) => {
        const [ k, v ] = item.split('=');
        v ? obj[k] = v : null;
      });
    }
    return obj;
}