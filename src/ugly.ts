import { ProjectJsonType } from "./projecttype";
import Random from "../lib/random";

export default function ugly(projectJSON: ProjectJsonType) {
  const rd = new Random();
  const targets = projectJSON.targets;
  const broadcasts = {};
  targets.forEach((target, i) => {
    // broadcasts

    if (target.isStage) {
      Object.keys(target.broadcasts).forEach((e) => {
        const brdrd = rd.getRandom();
        (broadcasts as any)[(target.broadcasts as any)[e]] = brdrd;
        (target.broadcasts as any)[e] = brdrd;
      });
    }

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

      // Functions

      if (block.opcode === "procedures_prototype") {
        const rdvs: any[] = [];
        const vars: object = {};
        const originalP = (block.mutation as any).proccode as string;

        let args: any[] = JSON.parse((block.mutation as any).argumentnames);

        args = args.map((arg) => {
          const rv = rd.getRandom();
          rdvs.push(rv);
          (vars as any)[arg] = rv;
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
        Object.keys(target.blocks).forEach((blockhash) => {
          const block = target.blocks[blockhash];
          if (block.mutation) {
            if ((block.mutation as any).proccode === originalP) {
              (block.mutation as any).proccode = d;
            }
          } else if (block.opcode.startsWith("argument_reporter")) {
            (block.fields as any).VALUE = [
              (vars as any)[(block.fields as any).VALUE[0]],
              (block.fields as any).VALUE[1],
            ];
          }
        });

        ((block.mutation as any).proccode as string) = d;
        ((block.mutation as any).argumentnames as string) =
          JSON.stringify(args);

        target.blocks[blockhash] = block;
      }

      // Broadcasts
      else if (block.opcode === "event_broadcast") {
        const value = (block.inputs as any).BROADCAST_INPUT;

        (block.inputs as any).BROADCAST_INPUT = [
          value[0],
          [value[1][0], (broadcasts as any)[value[1][1]], value[1][1]],
        ];
        target.blocks[blockhash] = block;
      } else if (block.opcode === "event_whenbroadcastreceived") {
        const value = (block.fields as any).BROADCAST_OPTION;
        (block.fields as any).BROADCAST_OPTION = [
          (broadcasts as any)[value[1]],
          value[1],
        ];
        target.blocks[blockhash] = block;
      }
    });

    targets[i] = target;
  });
  projectJSON.targets = targets;
  return projectJSON;
}
