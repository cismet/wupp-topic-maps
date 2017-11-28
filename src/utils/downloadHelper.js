
import {
  DRPROCESSOR
} from '../constants/services';






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

export const mergeMultipleFiles = (mergeConf, done) => {
    fetch(DRPROCESSOR + '/api/pdfmerge/and/wait/for/status', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mergeConf)

    }).then(function (response) {
      if (response.status >= 200 && response.status < 300) {
        response.json().then(function (result) {
            downloadSingleFile({
                "url":DRPROCESSOR+"/api/download/pdfmerge/"+result.id+"/"+mergeConf.name,
                "file":mergeConf.name+".pdf"
            });
            done();
        });
      }
      else {
          //TODO Error
          done();
      }
    });
};

export const downloadMultipleFiles = (mergeConf, done) => {
    fetch(DRPROCESSOR + '/api/zip/and/wait/for/status', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mergeConf)

    }).then(function (response) {
      if (response.status >= 200 && response.status < 300) {
        response.json().then(function (result) {
            downloadSingleFile({
                "url":DRPROCESSOR+"/api/download/zip/"+result.id+"/"+mergeConf.name,
                "file":mergeConf.name+".zip"
            });
            done();
        });
      }
      else {
          //TODO Error
          done();
      }
    });
};


export const downloadSingleFile = (downloadOptions) => {
  // downloadFile(urlPrefixToDisableCORSPrevention+downloadOptions.url, function(blob) {
  //     FileSaver.saveAs(blob, downloadOptions.file);
  // });
  let link = document.createElement('a');
  document.body.appendChild(link);
  link.setAttribute('type', 'hidden');
  link.href = downloadOptions.url;
  link.download = downloadOptions.file;
  link.target = '_blank';
  link.click();
};