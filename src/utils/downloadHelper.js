
import {
  DRPROCESSOR
} from '../constants/services';

import 'whatwg-fetch';




export const downloadFile = (url, success) => {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = "blob";
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (success) success(xhr.response);
    }
  };
  xhr.send(null);
};

export const prepareMergeMultipleFiles = (mergeConf, done) => {
    fetch(DRPROCESSOR + '/api/pdfmerge/and/wait/for/status', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mergeConf)

    }).then(function (response) {
      if (response.status >= 200 && response.status < 300) {
        response.json().then(function (result) {
            done({
                "file":mergeConf.name+".pdf",
                "url":DRPROCESSOR+"/api/download/pdfmerge/"+result.id+"/"+mergeConf.name
            });
        });
      }
      else {
          //TODO Error
          done();
      }
    });
};

export const prepareDownloadMultipleFiles = (mergeConf, done) => {
    fetch(DRPROCESSOR + '/api/zip/and/wait/for/status', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mergeConf)

    }).then((response)=>{
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      else {
          console.log("Error");
          console.log(response);
          //TODO Error
          done();
      }}).then((result)=> {
         done({
            "file":mergeConf.name+".zip",
            "url":DRPROCESSOR+"/api/download/zip/"+result.id+"/"+mergeConf.name
        });
    });
};


export const downloadSingleFile = (downloadOptions,done) => {
try {
  console.log("downloadSingleFile:"+downloadOptions.url);
  console.log(downloadOptions);
  let link = document.createElement('a');
  document.body.appendChild(link);
  link.setAttribute('type', 'hidden');
  link.href = downloadOptions.url;
  link.download = downloadOptions.file;
  link.target = '_blank';
  link.click();
  if (done){
    done();
  }
}catch (err) {
    window.alert(err);
}

};