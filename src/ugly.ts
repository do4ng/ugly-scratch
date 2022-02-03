import { ProjectJsonType } from "./projecttype";
import Random from "../lib/random";

export default function ugly(projectJSON: ProjectJsonType) {
  const rd = new Random();
  const targets = projectJSON.targets;
  targets.forEach((target, i) => {
    // var name
    Object.keys(target.variables).forEach((varHash) => {
      const vardata = (target.variables as any)[varHash];
      vardata[0] = rd.getRandom();
      (target.variables as any)[varHash] = vardata;
    });
    Object.keys(target.lists).forEach((varHash) => {
      const vardata = (target.lists as any)[varHash];
      vardata[0] = rd.getRandom();
      (target.lists as any)[varHash] = vardata;
    });

    console.log(target);

    // pos
    if (Object.keys(target.blocks).length > 0) {
      const t = target.blocks[Object.keys(target.blocks)[0]];
      //console.log(target.blocks);
      if (t.topLevel) {
        t.x = 0;
        t.y = 0;
      }

      target.blocks[Object.keys(target.blocks)[0]] = t;
    }

    Object.keys(target.blocks).forEach((blockhash) => {
      const block = target.blocks[blockhash];

      if (block.topLevel) {
        block.x = 0;
        block.y = 0;
      }

      if (block.opcode === "procedures_prototype") {
        const rdvs: any[] = [];
        const originalP = (block.mutation as any).proccode as string;

        let args: any[] = JSON.parse((block.mutation as any).argumentnames);

        args = args.map(() => {
          const rv = rd.getRandom();
          rdvs.push(rv);
          return rv;
        });
        const d = originalP
          .split(" ")
          .map((code) => {
            if (!code.startsWith("%")) {
              return rd.getRandom();
            }
            return code;
          })
          .join(" ");
        let fileVIndex = 0;
        Object.keys(target.blocks).forEach((blockhash) => {
          const block = target.blocks[blockhash];
          if (block.mutation) {
            if ((block.mutation as any).proccode === originalP) {
              (block.mutation as any).proccode = d;
            }
          } else if (block.opcode.startsWith("argument_reporter")) {
            (block.fields as any).VALUE = [
              rdvs[fileVIndex],
              (block.fields as any).VALUE[1],
            ];
            fileVIndex += 1;
          }
        });

        ((block.mutation as any).proccode as string) = d;
        ((block.mutation as any).argumentnames as string) =
          JSON.stringify(args);

        target.blocks[blockhash] = block;
      }
    });

    targets[i] = target;
  });
  projectJSON.targets = targets;
  console.log(JSON.stringify(projectJSON));
  return projectJSON;
}
