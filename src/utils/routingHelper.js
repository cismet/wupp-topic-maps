import objectAssign from 'object-assign';

export function modifyQueryPart(query,modifiedParts) {
  let newQuery= objectAssign({}, query,modifiedParts );
    let pNames=Object.getOwnPropertyNames(newQuery);
    let querypart="?";
  let first=true;
  for (let nidx in pNames) {
      let connector;
      if (first) {
          connector="";
      }
      else {
          connector="&";
      }
      querypart=querypart+connector+pNames[nidx]+"="+newQuery[pNames[nidx]];
      first=false;
  }
  return querypart;  
}