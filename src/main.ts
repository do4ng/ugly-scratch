import "./style.scss";
import jszip from "jszip";
import filesaver from "file-saver";
import ugly from "./ugly";
import { Buffer } from "buffer";
import Random from "../lib/random";
import log from "./logger";

(window as any).global = window;

global.Buffer = global.Buffer || Buffer;

const rd = new Random();

function handleFileSelect(event: any) {
  const files = event.target.files;

  let file = files[0];

  let reader = new FileReader();

  reader.onload = (function (_f: any) {
    return function (e: any) {
      let contents = e.target.result;
      jszip.loadAsync(contents).then(async function (zip) {
        const outputzip = new jszip();
        let index = 0;
        zip.forEach(async (relativePath, file) => {
          // @ts-ignore
          await zip
            .file(file.name)
            .async("string")
            .then(function (base64) {
              if (relativePath === "project.json") {
                log(base64);
                outputzip.file(
                  relativePath,
                  JSON.stringify(ugly(JSON.parse(base64)))
                );
                // console.log("processing..");
                log(JSON.stringify(ugly(JSON.parse(base64))));
              } else {
                outputzip.file(relativePath, base64);
              }
            });

          index += 1;
          if (index === Object.keys(zip.files).length) {
            outputzip
              .generateAsync({ type: "blob" })
              .then((reszip) => {
                if (window.location.hash != "#dev")
                  filesaver.saveAs(reszip, `${rd.getRandom()}.sb3`);
              })
              .catch((e) => {
                console.error(e);
              });
          }
        });
      });
    };
  })(file);

  reader.readAsArrayBuffer(file);
}

(document.getElementById("sb3") as HTMLElement).addEventListener(
  "change",
  handleFileSelect,
  false
);
