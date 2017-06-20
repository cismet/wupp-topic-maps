import ziputils from 'jszip-utils';
import JSZip from 'jszip';
import * as FileSaver from 'file-saver';


const urlPrefixToDisableCORSPrevention="https://crossorigin.me/";





export const downloadFile = (url, success) => {
    let xhr = new XMLHttpRequest(); 
    xhr.open('GET', url, true); 
    xhr.responseType = "blob";
    xhr.onreadystatechange = function () { 
        if (xhr.readyState == 4) {
            if (success) success(xhr.response);
        }
    };
    xhr.send(null);
};

export const downloadMultipleFiles = ( downloadOptions, downloadFileName , done ) => {
    let zip=JSZip();
    let count = 0;
    let allOptions=[];
    downloadOptions.forEach(function(suboptions){
        suboptions.downloads.forEach(function(downloadInfo){
            let newDLInfo={
                "file":suboptions.folder+downloadInfo.file,
                "url":downloadInfo.url
            };
            allOptions.push(newDLInfo);
        });
    });
    let zipFilename = downloadFileName+".zip";
    
    allOptions.forEach(function(dlOption){
        ziputils.getBinaryContent(urlPrefixToDisableCORSPrevention+dlOption.url, function (err, data) {
          if(err) {
              //throw err; // or handle the error
              //console.log(err);
          }
          zip.file(dlOption.file, data, {binary:true});
          count++;
          if (count == allOptions.length) {
            zip.generateAsync({type:"blob"})
              .then(function (blob) {
                  FileSaver.saveAs(blob, zipFilename);
                  if (done != undefined){
                      done();
                  }
              });
          }
        });
    });
};


export const downloadSingleFile = ( downloadOptions ) => {
    // downloadFile(urlPrefixToDisableCORSPrevention+downloadOptions.url, function(blob) {
    //     FileSaver.saveAs(blob, downloadOptions.file);
    // });
    let link=document.createElement('a');
        document.body.appendChild(link);
        link.setAttribute('type','hidden');
        link.href = downloadOptions.url;
        link.download = downloadOptions.file;
        link.target='_blank';
        link.click();
};